import type { CoachingTip, TipPriority } from '../types/coaching';
import { t, getSpeechLang, getLanguage, translateSide } from './i18n';

// ── Voice Coach: Text-to-Speech engine ──
// Speaks coaching tips aloud like a real coach.
// Only speaks important things (warnings/dangers) to avoid spam.

interface VoiceConfig {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  voiceName: string | null;
}

const config: VoiceConfig = {
  enabled: true,
  volume: 0.85,
  rate: 1.1,
  pitch: 0.95,
  voiceName: null,
};

let speechQueue: string[] = [];
let isSpeaking = false;
let lastSpokenMessage = '';
let lastSpokenTime = 0;
const COOLDOWN_MS = 4000;

const SPEAKABLE_PRIORITIES: TipPriority[] = ['warning', 'danger'];

// Pattern -> i18n key + capture groups mapping
interface VoiceRewrite {
  pattern: RegExp;
  key: string;
  extractArgs?: (match: RegExpMatchArray) => string[];
}

const VOICE_REWRITES: VoiceRewrite[] = [
  { pattern: /Health critically low \(\d+%\)\. Recall immediately\./, key: 'recall_low' },
  { pattern: /You may be overextended/, key: 'overextended' },
  { pattern: /Sitting on (\d+)g\. Recall to spend gold/, key: 'gold_recall' },
  { pattern: /You have (\d+)g and are low on health/, key: 'low_gold_recall' },
  { pattern: /Low health and almost out of mana/, key: 'no_resources' },
  { pattern: /Enemy team secured.*Dragon/, key: 'enemy_dragon' },
  { pattern: /Enemy team got Baron/, key: 'enemy_baron' },
  {
    pattern: /Watch out for (.+) - they are fed/,
    key: 'enemy_fed',
    extractArgs: (m) => [m[1]],
  },
  { pattern: /Your CS is .+ Focus on last-hitting/, key: 'low_cs' },
  {
    pattern: /Enemy jungler likely (.+) side/,
    key: 'jungler_side',
    extractArgs: (m) => [translateSide(m[1])],
  },
  {
    pattern: /Tough matchup vs (.+)\./,
    key: 'tough_matchup',
    extractArgs: (m) => [m[1]],
  },
  {
    pattern: /Killed by (.+) \(assisted by (.+)\).*Improve your map awareness/,
    key: 'ganked',
    extractArgs: (m) => [m[1], m[2]],
  },
  {
    pattern: /Solo killed by (.+).*Review the matchup/,
    key: 'solo_killed',
    extractArgs: (m) => [m[1]],
  },
  { pattern: /Died to a \d+-man collapse/, key: 'collapsed' },
  { pattern: /Freeze the wave here/, key: 'freeze' },
  { pattern: /You lose this trade early/, key: 'lose_trade' },
  { pattern: /overextended with no vision/, key: 'no_vision_pushed' },
  { pattern: /recall soon/, key: 'look_recall' },
];

function rewriteForVoice(message: string): string {
  for (const rewrite of VOICE_REWRITES) {
    const match = message.match(rewrite.pattern);
    if (match) {
      const args = rewrite.extractArgs ? rewrite.extractArgs(match) : [];
      return t(rewrite.key, ...args);
    }
  }
  // No match: truncate long messages
  if (message.length > 80) {
    const firstSentence = message.split(/[.!]/).filter(Boolean)[0];
    return firstSentence ? firstSentence.trim() : message.slice(0, 80);
  }
  return message;
}

function getPreferredVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const lang = getLanguage();
  const langPrefix = lang === 'es' ? 'es' : 'en';

  if (config.voiceName) {
    const match = voices.find((v) => v.name === config.voiceName);
    if (match) return match;
  }

  // Prefer good voices per language
  const preferredES = ['Microsoft Sabina', 'Google espanol', 'Paulina', 'Monica', 'Jorge'];
  const preferredEN = ['Microsoft David', 'Microsoft Mark', 'Google US English', 'Alex', 'Daniel'];
  const preferred = lang === 'es' ? preferredES : preferredEN;

  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith(langPrefix));
    if (match) return match;
  }

  const fallback = voices.find((v) => v.lang.startsWith(langPrefix));
  return fallback ?? voices[0] ?? null;
}

// Audio element for playing neural TTS mp3 files
let audioElement: HTMLAudioElement | null = null;

function initAudioPlayer(): void {
  if (audioElement) return;

  // Listen for TTS audio files from main process
  const api = (window as unknown as {
    electronAPI?: { onTTSAudio?: (cb: (path: string) => void) => () => void }
  }).electronAPI;

  if (api?.onTTSAudio) {
    api.onTTSAudio((audioPath: string) => {
      playAudioFile(audioPath);
    });
  }
}

function playAudioFile(filePath: string): void {
  if (audioElement) {
    audioElement.pause();
  }
  audioElement = new Audio(`file://${filePath}`);
  audioElement.volume = config.volume;
  audioElement.onended = () => {
    isSpeaking = false;
    setTimeout(() => processQueue(), 200);
  };
  audioElement.onerror = () => {
    isSpeaking = false;
    setTimeout(() => processQueue(), 200);
  };
  audioElement.play().catch(() => {
    isSpeaking = false;
    processQueue();
  });
}

function processQueue(): void {
  if (!config.enabled || isSpeaking || speechQueue.length === 0) return;

  const message = speechQueue.shift();
  if (!message) return;

  isSpeaking = true;

  // Try neural TTS first (Microsoft Edge voices - sounds like a real person)
  const api = (window as unknown as {
    electronAPI?: { speakNeural?: (text: string, lang: string) => Promise<{ ok: boolean }> }
  }).electronAPI;

  if (api?.speakNeural) {
    api.speakNeural(message, getLanguage()).then((result) => {
      if (!result.ok) {
        speakWithWebSpeech(message);
      } else {
        // Audio plays from main process - release speaking lock after estimated duration
        const estimatedDuration = Math.max(2000, message.length * 80); // ~80ms per char
        setTimeout(() => {
          isSpeaking = false;
          processQueue();
        }, estimatedDuration);
      }
    }).catch(() => {
      speakWithWebSpeech(message);
    });
    return;
  }

  // No neural TTS available, use Web Speech API
  speakWithWebSpeech(message);
}

function speakWithWebSpeech(message: string): void {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.volume = config.volume;
  utterance.rate = config.rate;
  utterance.pitch = config.pitch;
  utterance.lang = getSpeechLang();

  const voice = getPreferredVoice();
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onend = () => {
    isSpeaking = false;
    setTimeout(() => processQueue(), 300);
  };

  utterance.onerror = () => {
    isSpeaking = false;
    setTimeout(() => processQueue(), 300);
  };

  window.speechSynthesis.speak(utterance);
}

export function speakTip(tip: CoachingTip): void {
  if (!config.enabled) return;
  if (!SPEAKABLE_PRIORITIES.includes(tip.priority)) return;

  const now = Date.now();
  if (tip.message === lastSpokenMessage && now - lastSpokenTime < COOLDOWN_MS) return;

  const voiceMessage = rewriteForVoice(tip.message);
  lastSpokenMessage = tip.message;
  lastSpokenTime = now;

  if (tip.priority === 'danger') {
    speechQueue.unshift(voiceMessage);
  } else {
    speechQueue.push(voiceMessage);
  }

  if (speechQueue.length > 3) {
    speechQueue = speechQueue.slice(0, 3);
  }

  processQueue();
}

export function speakRaw(message: string): void {
  if (!config.enabled) return;
  speechQueue.push(message);
  if (speechQueue.length > 3) {
    speechQueue = speechQueue.slice(0, 3);
  }
  processQueue();
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
  speechQueue = [];
  isSpeaking = false;
}

export function setVoiceEnabled(enabled: boolean): void {
  config.enabled = enabled;
  if (!enabled) stopSpeaking();
}

export function setVoiceVolume(volume: number): void {
  config.volume = Math.max(0, Math.min(1, volume));
}

export function setVoiceRate(rate: number): void {
  config.rate = Math.max(0.5, Math.min(2, rate));
}

export function isVoiceEnabled(): boolean {
  return config.enabled;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const langPrefix = getLanguage() === 'es' ? 'es' : 'en';
  return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith(langPrefix));
}

export function setVoiceName(name: string): void {
  config.voiceName = name;
}

if (typeof window !== 'undefined') {
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { /* voices loaded */ };
  }
  // Init neural TTS audio player
  initAudioPlayer();
}

export const voiceCoach = {
  speakTip,
  speakRaw,
  stopSpeaking,
  setVoiceEnabled,
  setVoiceVolume,
  setVoiceRate,
  isVoiceEnabled,
  getAvailableVoices,
  setVoiceName,
};
