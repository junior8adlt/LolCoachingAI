import { useGameStore } from '../stores/gameStore';
import { speakRaw } from './voiceCoach';
import { getLanguage, getSpeechLang } from './i18n';
import { buildCoachContext } from './claudeCoach';
import { getChampionThreat } from './threatModel';
import { getChampionCoaching } from '../data/championCoaching';
import { recommendItems } from '../data/items';
import { getChampionMeta } from '../data/championMeta';

// ── Voice Input: Speech-to-Text ──
// Player asks Claude questions. Claude gets ALL engine data as context.
// This is the PRIMARY way Claude coaches - when the player asks.

const BACKEND_URL = 'http://localhost:8420';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
}

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

// ── Audio Recording (MediaRecorder - works in Electron) ──

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

function stopRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

async function startRecording(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      // Stop mic stream
      stream.getTracks().forEach((t) => t.stop());

      if (audioChunks.length === 0) return;

      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      updateState({ isListening: false, transcript: 'Transcribiendo...' });

      // Convert to base64 and send to backend for transcription
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('http://localhost:8420/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, language: getSpeechLang() }),
          });
          const data = await res.json();
          const text = data.text ?? '';

          if (text) {
            updateState({ transcript: text });
            handlePlayerQuestion(text);
          } else {
            updateState({ transcript: 'No entendi, intenta de nuevo' });
            setTimeout(() => updateState({ transcript: '' }), 3000);
          }
        } catch (err) {
          console.error('[VoiceInput] Transcription failed:', err);
          updateState({ transcript: 'Error de transcripcion' });
          setTimeout(() => updateState({ transcript: '' }), 3000);
        }
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    updateState({ isListening: true, transcript: 'Grabando...' });
    console.log('[VoiceInput] Recording started');
  } catch (err) {
    console.error('[VoiceInput] Mic error:', err);
    updateState({ isListening: false, transcript: 'Error de microfono' });
  }
}

// Mic permission handled by MediaRecorder's getUserMedia call

export async function startListening(): Promise<void> {
  if (currentState.isListening || currentState.isProcessing) return;
  await startRecording();
}

export function stopListening(): void {
  stopRecording();
  // State will update in mediaRecorder.onstop
}

export function toggleListening(): void {
  if (currentState.isListening) stopListening();
  else startListening();
}

// ── Handle player question with FULL engine context ──

async function handlePlayerQuestion(question: string): Promise<void> {
  updateState({ isProcessing: true });

  const store = useGameStore.getState();
  store.setAIState({
    status: 'thinking',
    currentThought: `"${question}"`,
    reasoningChain: [`> "${question}"`],
  });

  try {
    const answer = await askClaudeWithContext(question);

    store.setAIState({
      status: 'coaching',
      currentThought: answer,
      reasoningChain: [`> "${question}"`, answer],
      source: 'claude',
    });

    speakRaw(answer);

    // Show Claude's answer in banner briefly, then auto-dismiss (don't rotate)
    const tipId = `voice-${Date.now()}`;
    store.addCoachingTip({
      id: tipId,
      message: answer,
      priority: 'info',
      category: 'general',
      timestamp: Date.now(),
      dismissed: false,
    });
    // Auto-dismiss after 12s so it doesn't keep rotating
    setTimeout(() => {
      store.dismissTip(tipId);
    }, 12000);
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
  }, 8000);
}

// ── Ask Claude with ALL engine context ──

async function askClaudeWithContext(question: string): Promise<string> {
  const store = useGameStore.getState();
  const data = store.gameData;
  const lang = getLanguage();

  // Build rich context from all engines
  const context = data ? buildCoachContext(
    data,
    store.farmingStats,
    null,
    store.junglePrediction,
    store.threats,
    store.objectives,
    'moderate',
    '',
    `${store.players.filter((p) => p.team === store.players.find((pp) => pp.summonerName === store.activePlayer?.summonerName)?.team && !p.isDead).length}v${store.players.filter((p) => p.team !== store.players.find((pp) => pp.summonerName === store.activePlayer?.summonerName)?.team && !p.isDead).length}`,
    store.gamePhase
  ) : null;

  // Get extra data from our engines
  const myChamp = context?.champion ?? '';
  const enemyChamp = context?.enemyChampion ?? '';
  const coaching = getChampionCoaching(myChamp);
  const enemyThreat = enemyChamp ? getChampionThreat(enemyChamp) : null;
  const myMeta = getChampionMeta(myChamp);

  // Build item recommendations
  let itemRecs = '';
  if (myMeta && context) {
    const enemies = store.players.filter((p) => p.team !== store.players.find((pp) => pp.summonerName === store.activePlayer?.summonerName)?.team);
    const tankCount = enemies.filter((e) => getChampionMeta(e.championName)?.archetypes.some((a) => a === 'tank' || a === 'juggernaut')).length;
    const apCount = enemies.filter((e) => getChampionMeta(e.championName)?.archetypes.some((a) => a === 'mage')).length;
    const adCount = enemies.filter((e) => getChampionMeta(e.championName)?.archetypes.some((a) => a === 'marksman' || a === 'assassin')).length;
    const healerCount = enemies.filter((e) => ['aatrox', 'dr. mundo', 'vladimir', 'soraka', 'yuumi', 'sylas'].includes(e.championName.toLowerCase())).length;
    const recs = recommendItems(myMeta.archetypes[0] ?? 'marksman', { tanks: tankCount, ap: apCount, ad: adCount, healers: healerCount });
    itemRecs = recs.slice(0, 3).join(', ');
  }

  // Fix gameTime: ensure it's in seconds. If < 100, it's probably minutes.
  const gameTimeSec = context ? (context.gameTime < 100 ? context.gameTime * 60 : context.gameTime) : 0;
  const gameMinute = Math.floor(gameTimeSec / 60);
  const gameSec = Math.floor(gameTimeSec % 60);
  const timeStr = `${gameMinute}:${gameSec.toString().padStart(2, '0')}`;

  // Wave state safety
  const waveDisplay = gameTimeSec < 90 ? 'minions not spawned yet' : (context?.waveState ?? 'unknown');

  // Vision from actual data
  const visionPerMin = store.farmingStats && gameMinute > 0
    ? ((store.players.find((p) => p.summonerName === store.activePlayer?.summonerName)?.scores.wardScore ?? 0) / gameMinute).toFixed(1)
    : '0';

  // Performance snapshot
  const expectedCS = gameMinute > 1 ? Math.round(gameMinute * 7) : 0; // 7 CS/min is decent
  const csPerMin = context?.csPerMin ?? 0;
  const csDiff = expectedCS > 0 ? context!.cs - expectedCS : 0;
  const goldEstimate = context ? Math.round(context.gold + context.kills * 300 + (context.cs * 21)) : 0;

  const contextStr = context ? `
GAME DATA (read carefully):
- Champion: ${context.champion} level ${context.level}
- KDA: ${context.kills}/${context.deaths}/${context.assists}
- CS: ${context.cs} (${csPerMin}/min) | Expected at min ${gameMinute}: ~${expectedCS} CS | ${csDiff >= 0 ? '+' : ''}${csDiff} vs expected
- HP: ${Math.round(context.hp)}/${Math.round(context.maxHp)} (${Math.round(context.hp/context.maxHp*100)}%)
- Gold in pocket: ${Math.round(context.gold)}g | Total earned estimate: ~${goldEstimate}g
- Items: ${context.items.join(', ') || 'starting items'}
- Enemy laner: ${context.enemyChampion ?? 'unknown'} lvl${context.enemyLevel}, ${context.enemyKills}/${context.enemyDeaths}${context.enemyIsDead ? ' (DEAD)' : ''}
- Enemy items: ${context.enemyItems.join(', ') || 'unknown'}
- Wave: ${waveDisplay}
- Jungle: ${context.junglePrediction} (gank risk: ${Math.round(context.gankRisk * 100)}%)
- Threats: ${context.threats.join(', ') || 'none critical'}
- Objectives: ${context.objectives.join(', ') || 'none imminent'}
- Vision score/min: ${visionPerMin}
- Team alive: ${context.teamState}
- Game time: ${timeStr} (minute ${gameMinute}) | Phase: ${context.gamePhase}

FULL ENEMY TEAM:
${store.players.filter((p) => p.team !== store.players.find((pp) => pp.summonerName === store.activePlayer?.summonerName)?.team).map((e) => `  - ${e.championName} (${e.position || 'unknown'}) lvl${e.level} ${e.scores.kills}/${e.scores.deaths}/${e.scores.assists}`).join('\n')}

FULL ALLY TEAM:
${store.players.filter((p) => p.team === store.players.find((pp) => pp.summonerName === store.activePlayer?.summonerName)?.team && p.summonerName !== store.activePlayer?.summonerName).map((a) => `  - ${a.championName} (${a.position || 'unknown'}) lvl${a.level} ${a.scores.kills}/${a.scores.deaths}/${a.scores.assists}`).join('\n')}

CHAMPION KNOWLEDGE:
- Combos: ${coaching?.combos.slice(0, 2).join(' | ') ?? 'unknown'}
- Trading: ${coaching?.tradingPatterns[0] ?? 'unknown'}
- Phase advice: ${context.gamePhase === 'EARLY_GAME' ? (coaching?.earlyGame ?? '') : context.gamePhase === 'MID_GAME' ? (coaching?.midGame ?? '') : (coaching?.lateGame ?? '')}
- Enemy threat: ${enemyThreat ? `${enemyThreat.warning} - ${enemyThreat.counterplay}` : 'no specific threat data'}
- Recommended items: ${itemRecs || 'follow recommended build'}` : 'No game data available.';

  const langInstr = lang === 'es'
    ? 'Responde en espanol. Coach profesional de LoL. 2-3 oraciones max. Usa lenguaje de gaming. NO asteriscos, NO markdown, NO emojis, NO digas bro ni hermano. Texto plano.'
    : 'Reply in English. Professional LoL coach. 2-3 sentences max. NO asterisks, NO markdown, NO emojis. Plain text.';

  const prompt = `You are a Challenger League of Legends coach analyzing a LIVE game.
Use the game data STRICTLY. Do not invent information.

GAME PHASE RULES:
- If game minute < 1: Match just started. Player may be in fountain. Do NOT judge CS. Give prep advice.
- If game minute 1-3: Lane starting. Focus on wave control and jungle tracking. CS still forming.
- If game minute 3-15: Laning phase. Evaluate CS/min, gold, level difference vs lane opponent.
- If game minute 15-25: Mid game. Evaluate objectives, rotations, team plays.
- If game minute 25+: Late game. Evaluate teamfight positioning, baron plays, closing the game.

${contextStr}

PLAYER ASKS: "${question}"

COACHING METHOD (situation → analysis → action):
1. Assess the situation from the data
2. Analyze what matters right now
3. Give a clear action

${langInstr}

STRICT RULES:
- Use REAL numbers from the data above. Never invent stats.
- If CS is behind expected, say it clearly with numbers.
- If asked "como voy", be HONEST. Compare CS vs expected, gold, KDA.
- Reference champion names and specific abilities when relevant.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BACKEND_URL}/api/coaching/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: prompt, language: lang, game_state: {} }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Backend error');

    const result = await response.json();
    // Strip markdown/asterisks that TTS would read as "asterisco"
    const clean = (result.answer ?? 'No pude analizar eso.')
      .replace(/\*+/g, '')
      .replace(/_+/g, '')
      .replace(/#+/g, '')
      .replace(/`+/g, '')
      .trim();
    return clean;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Auto-trigger on death (called from gameLoop) ──

export async function triggerDeathReview(deathReason: string, killerChampion: string): Promise<void> {
  const store = useGameStore.getState();
  const question = `Acabo de morir. ${deathReason}. Me mato ${killerChampion}. Que hice mal y que deberia hacer diferente?`;

  store.setAIState({
    status: 'thinking',
    currentThought: 'Analizando tu muerte...',
    reasoningChain: ['Muerte detectada', deathReason],
    source: 'claude',
  });

  try {
    const answer = await askClaudeWithContext(question);
    store.setAIState({
      status: 'coaching',
      currentThought: answer,
      reasoningChain: ['Muerte detectada', deathReason, answer],
      source: 'claude',
    });
    speakRaw(answer);
    store.addCoachingTip({
      id: `death-review-${Date.now()}`,
      message: answer,
      priority: 'warning',
      category: 'positioning',
      timestamp: Date.now(),
      dismissed: false,
    });
  } catch {
    // Silent fail - death analysis from local engine already showed
  }

  setTimeout(() => {
    const current = useGameStore.getState().aiState;
    if (current.status === 'coaching') {
      useGameStore.getState().setAIState({ status: 'idle', currentThought: '' });
    }
  }, 10000);
}

// ── Local fallback answers ──

function getLocalAnswer(
  question: string,
  store: ReturnType<typeof useGameStore.getState>
): string {
  const q = question.toLowerCase();
  const isEs = getLanguage() === 'es';

  if (q.includes('build') || q.includes('item') || q.includes('comprar') || q.includes('buildear')) {
    const gold = store.activePlayer?.currentGold ?? 0;
    return isEs ? `Tienes ${Math.round(gold)} de oro. Revisa los items recomendados y compra componentes.` : `You have ${Math.round(gold)} gold. Check recommended items.`;
  }
  if (q.includes('como voy') || q.includes('how am i')) {
    const f = store.farmingStats;
    const kda = `${store.activePlayer?.level ?? 0}`;
    return isEs ? `Vas nivel ${kda}, ${f?.currentCS ?? 0} CS (${f?.csPerMin ?? 0}/min). ${(f?.efficiency ?? 0) >= 70 ? 'Bien de farmeo.' : 'Necesitas farmear mas.'}` : `Level ${kda}, ${f?.csPerMin ?? 0} CS/min.`;
  }
  if (q.includes('pelea') || q.includes('fight') || q.includes('tradear')) {
    return isEs ? 'Checa los niveles y items. Si tienes ventaja, tradea. Si no, farmea.' : 'Check levels and items before fighting.';
  }
  return isEs ? 'Concentrate en farmear y no morir. Preguntame algo mas especifico.' : 'Focus on farming. Ask me something specific.';
}

// Public function to send a typed question to Claude
export async function sendTextQuestion(question: string): Promise<void> {
  await handlePlayerQuestion(question);
}

export const voiceInput = {
  startListening,
  stopListening,
  toggleListening,
  onVoiceInputStateChange,
  getVoiceInputState,
  sendTextQuestion,
};
