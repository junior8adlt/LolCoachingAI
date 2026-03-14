import { useGameStore } from '../stores/gameStore';
import { speakRaw } from './voiceCoach';
import { t, getSpeechLang, getLanguage, translateSide } from './i18n';

// ── Voice Input: Speech-to-Text for player questions ──
// Player asks the AI coach by voice. Supports English & Spanish.

const BACKEND_URL = 'http://localhost:8420';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
}

let recognition: SpeechRecognition | null = null;
let currentState: VoiceInputState = {
  isListening: false,
  transcript: '',
  isProcessing: false,
};

type StateChangeCallback = (state: VoiceInputState) => void;
const stateListeners: StateChangeCallback[] = [];

function notifyListeners(): void {
  for (const cb of stateListeners) cb({ ...currentState });
}

function updateState(partial: Partial<VoiceInputState>): void {
  currentState = { ...currentState, ...partial };
  notifyListeners();
}

export function onVoiceInputStateChange(cb: StateChangeCallback): () => void {
  stateListeners.push(cb);
  return () => {
    const idx = stateListeners.indexOf(cb);
    if (idx >= 0) stateListeners.splice(idx, 1);
  };
}

export function getVoiceInputState(): VoiceInputState {
  return { ...currentState };
}

function createRecognition(): SpeechRecognition | null {
  const SR =
    (window as unknown as Record<string, unknown>).SpeechRecognition ??
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SR) {
    console.warn('[VoiceInput] SpeechRecognition not supported');
    return null;
  }

  const rec = new (SR as new () => SpeechRecognition)();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = getSpeechLang();
  rec.maxAlternatives = 1;

  rec.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (finalTranscript) {
      updateState({ transcript: finalTranscript, isListening: false });
      handlePlayerQuestion(finalTranscript);
    } else {
      updateState({ transcript: interimTranscript });
    }
  };

  rec.onerror = () => {
    updateState({ isListening: false, isProcessing: false });
  };

  rec.onend = () => {
    updateState({ isListening: false });
  };

  return rec;
}

let micPermissionGranted = false;

async function ensureMicPermission(): Promise<boolean> {
  if (micPermissionGranted) return true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately, we just need the permission
    stream.getTracks().forEach((t) => t.stop());
    micPermissionGranted = true;
    console.log('[VoiceInput] Microphone permission granted');
    return true;
  } catch (err) {
    console.error('[VoiceInput] Microphone permission denied:', err);
    return false;
  }
}

export async function startListening(): Promise<void> {
  if (currentState.isListening || currentState.isProcessing) return;

  // Ensure mic permission first
  const hasMic = await ensureMicPermission();
  if (!hasMic) {
    speakRaw(getLanguage() === 'es' ? 'No tengo acceso al microfono.' : 'No microphone access.');
    return;
  }

  // Recreate to pick up language changes
  recognition = createRecognition();

  if (!recognition) {
    const msg = getLanguage() === 'es'
      ? 'La entrada de voz no esta soportada.'
      : 'Voice input is not supported.';
    speakRaw(msg);
    return;
  }

  updateState({ isListening: true, transcript: '' });

  try {
    recognition.start();
    console.log('[VoiceInput] Listening started');
  } catch (err) {
    console.error('[VoiceInput] Failed to start:', err);
    updateState({ isListening: false });
  }
}

export function stopListening(): void {
  if (recognition && currentState.isListening) {
    recognition.stop();
  }
  updateState({ isListening: false });
}

export function toggleListening(): void {
  if (currentState.isListening) {
    stopListening();
  } else {
    startListening();
  }
}

async function handlePlayerQuestion(question: string): Promise<void> {
  updateState({ isProcessing: true });

  const store = useGameStore.getState();
  store.setAIState({
    status: 'thinking',
    currentThought: `"${question}"`,
    reasoningChain: [...store.aiState.reasoningChain, `> "${question}"`],
  });

  try {
    const answer = await askAICoach(question, store.gameData);

    store.setAIState({
      status: 'coaching',
      currentThought: answer,
      reasoningChain: [...store.aiState.reasoningChain, answer],
    });

    speakRaw(answer);

    store.addCoachingTip({
      id: `voice-${Date.now()}`,
      message: answer,
      priority: 'info',
      category: 'general',
      timestamp: Date.now(),
      dismissed: false,
    });

  } catch {
    const fallback = getLocalAnswer(question, store);
    store.setAIState({ status: 'coaching', currentThought: fallback });
    speakRaw(fallback);
  }

  updateState({ isProcessing: false });

  setTimeout(() => {
    const current = useGameStore.getState().aiState;
    if (current.status === 'coaching') {
      useGameStore.getState().setAIState({ status: 'idle', currentThought: '' });
    }
  }, 5000);
}

async function askAICoach(question: string, gameData: unknown): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${BACKEND_URL}/api/coaching/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        language: getLanguage(),
        game_state: gameData ?? {},
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('Backend unavailable');

    const data = await response.json();
    return data.answer ?? data.response ?? t('answer_default');
  } finally {
    clearTimeout(timeoutId);
  }
}

function getLocalAnswer(
  question: string,
  store: ReturnType<typeof useGameStore.getState>
): string {
  const q = question.toLowerCase();

  // Build questions (en + es)
  if (q.includes('build') || q.includes('item') || q.includes('buy') ||
      q.includes('comprar') || q.includes('buildear') || q.includes('construir')) {
    const gold = store.activePlayer?.currentGold ?? 0;
    if (gold >= 1300) {
      return t('answer_build_gold', gold);
    }
    return t('answer_build_farm');
  }

  // Lane questions
  if (q.includes('lane') || q.includes('matchup') || q.includes('play') ||
      q.includes('linea') || q.includes('jugar') || q.includes('como le hago')) {
    if (store.matchupInfo) {
      const m = store.matchupInfo;
      return `${m.tips[0] ?? t('answer_play_safe')}`;
    }
    return t('answer_play_safe');
  }

  // Jungle
  if (q.includes('jungle') || q.includes('gank') || q.includes('ward') ||
      q.includes('jungla') || q.includes('ganke') || q.includes('wardear') || q.includes('jungler')) {
    if (store.junglePrediction) {
      const j = store.junglePrediction;
      const riskLabel = j.gankRisk > 0.6 ? (getLanguage() === 'es' ? 'alto' : 'high')
        : j.gankRisk > 0.3 ? (getLanguage() === 'es' ? 'medio' : 'medium')
        : (getLanguage() === 'es' ? 'bajo' : 'low');
      return t('answer_jungler_risk', translateSide(j.predictedSide), riskLabel);
    }
    return t('answer_ward');
  }

  // Objectives
  if (q.includes('dragon') || q.includes('baron') || q.includes('objective') ||
      q.includes('objetivo') || q.includes('drake')) {
    const objs = store.objectives;
    const parts: string[] = [];
    for (const obj of objs) {
      if (obj.status === 'alive') {
        parts.push(`${obj.type} ${getLanguage() === 'es' ? 'esta vivo, prepara' : 'is alive, set up'}`);
      } else if (obj.status === 'dead' && obj.timer > 0) {
        parts.push(`${obj.type} ${getLanguage() === 'es' ? 'reaparece en' : 'respawns in'} ${Math.ceil(obj.timer)}s`);
      }
    }
    return parts.length > 0 ? parts.join('. ') + '.' : t('answer_default');
  }

  // CS
  if (q.includes('cs') || q.includes('farm') || q.includes('minion')) {
    if (store.farmingStats) {
      const f = store.farmingStats;
      const quality = f.efficiency >= 70
        ? (getLanguage() === 'es' ? 'Esta bien, sigue asi.' : 'That\'s decent, keep it up.')
        : (getLanguage() === 'es' ? 'Concentra mas en el last hit.' : 'Focus more on last hitting.');
      return `${f.currentCS} CS, ${f.csPerMin}/min. ${quality}`;
    }
    return t('answer_default');
  }

  // Threats
  if (q.includes('threat') || q.includes('danger') || q.includes('who') ||
      q.includes('amenaza') || q.includes('peligro') || q.includes('cuidado') || q.includes('quien')) {
    const high = store.threats.filter((th) => th.threatLevel === 'high');
    if (high.length > 0) {
      return t('answer_threats', high.map((th) => th.championName).join(getLanguage() === 'es' ? ' y ' : ' and '));
    }
    return t('answer_no_threats');
  }

  // Teamfight
  if (q.includes('fight') || q.includes('team') || q.includes('pelea') || q.includes('teamfight')) {
    return t('answer_teamfight');
  }

  return t('answer_default');
}

export const voiceInput = {
  startListening,
  stopListening,
  toggleListening,
  onVoiceInputStateChange,
  getVoiceInputState,
};
