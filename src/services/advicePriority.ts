import type { CoachingTip } from '../types/coaching';

// ── Advice Priority Engine ──
// Central brain: picks THE BEST tip. Strong anti-repetition.

const PRIORITY_TIERS: Record<string, number> = {
  'kill_window': 100,
  'danger_immediate': 95,
  'objective_now': 90,
  'fight_advantage': 80,
  'cooldown_window': 75,
  'level_spike': 70,
  'wave_action': 60,
  'build_urgent': 55,
  'recall_timing': 50,
  'matchup_tip': 40,
  'build_suggestion': 35,
  'vision_reminder': 30,
  'mechanics_tip': 20,
  'general_tip': 10,
};

function scoreTip(tip: CoachingTip): number {
  let score = 0;
  if (tip.priority === 'danger') score += 50;
  else if (tip.priority === 'warning') score += 25;
  else score += 5;

  const msg = tip.message.toLowerCase();
  if (msg.includes('kill window') || msg.includes('flash down') || msg.includes('ult down') || msg.includes('all-in now')) {
    score += PRIORITY_TIERS['kill_window'];
  } else if (msg.includes('you win') || msg.includes('advantage') || msg.includes('power spike')) {
    score += PRIORITY_TIERS['fight_advantage'];
  } else if (msg.includes('baron') || msg.includes('dragon') || msg.includes('herald') || msg.includes('objective')) {
    score += PRIORITY_TIERS['objective_now'];
  } else if (msg.includes('wave') || msg.includes('push') || msg.includes('crash') || msg.includes('freeze')) {
    score += PRIORITY_TIERS['wave_action'];
  } else if (msg.includes('build') || msg.includes('buy') || msg.includes('anti-heal')) {
    score += PRIORITY_TIERS['build_suggestion'];
  } else if (msg.includes('recall') || msg.includes('gold')) {
    score += PRIORITY_TIERS['recall_timing'];
  } else if (msg.includes('ward') || msg.includes('vision')) {
    score += PRIORITY_TIERS['vision_reminder'];
  } else if (tip.category === 'matchup' || tip.category === 'trading') {
    score += PRIORITY_TIERS['matchup_tip'];
  } else {
    score += PRIORITY_TIERS['general_tip'];
  }
  return score;
}

// ── Anti-Repetition System ──
// Track TOPICS not exact messages. "Dragon is up" and "Dragon alive, contest" are the SAME topic.

type TopicKey = string;

function extractTopic(tip: CoachingTip): TopicKey {
  const msg = tip.message.toLowerCase();

  // Map messages to broad topics
  if (msg.includes('dragon')) return 'dragon';
  if (msg.includes('baron')) return 'baron';
  if (msg.includes('herald') || msg.includes('rift')) return 'herald';
  if (msg.includes('cs') || msg.includes('farm') || msg.includes('last hit') || msg.includes('cs/min')) return 'farming';
  if (msg.includes('ward') || msg.includes('vision')) return 'vision';
  if (msg.includes('recall') || msg.includes('gold') || msg.includes('unspent')) return 'recall';
  if (msg.includes('missing') || msg.includes('roam')) return 'roam';
  if (msg.includes('gank') || msg.includes('jungle')) return 'jungle';
  if (msg.includes('flash down') || msg.includes('ult down')) return 'cooldowns';
  if (msg.includes('kill') || msg.includes('all-in')) return 'kill_window';
  if (msg.includes('team') || msg.includes('group') || msg.includes('5v')) return 'teamfight';
  if (msg.includes('overextend') || msg.includes('too far') || msg.includes('safe')) return 'positioning';
  if (msg.includes('wave') || msg.includes('push') || msg.includes('freeze')) return 'wave';
  if (msg.includes('build') || msg.includes('buy') || msg.includes('item')) return 'build';
  if (msg.includes('rotate') || msg.includes('objective')) return 'rotation';
  if (msg.includes('advantage') || msg.includes('spike')) return 'advantage';

  return `cat_${tip.category}`;
}

// Topic cooldowns: how long before the same topic can appear again
const TOPIC_COOLDOWNS: Record<string, number> = {
  dragon: 90000,       // 1.5 min - don't spam dragon
  baron: 90000,
  herald: 90000,
  farming: 180000,     // 3 min - CS tips are the most annoying
  vision: 120000,      // 2 min
  recall: 60000,       // 1 min
  roam: 45000,         // 45s - roam warnings are time-sensitive
  jungle: 60000,       // 1 min
  cooldowns: 30000,    // 30s - cooldown windows are urgent
  kill_window: 20000,  // 20s - kill windows are highest value
  teamfight: 30000,    // 30s
  positioning: 90000,  // 1.5 min
  wave: 90000,         // 1.5 min
  build: 120000,       // 2 min
  rotation: 60000,     // 1 min
  advantage: 60000,    // 1 min
};

const topicLastShown = new Map<TopicKey, number>();

function isTopicOnCooldown(topic: TopicKey): boolean {
  const lastTime = topicLastShown.get(topic);
  if (!lastTime) return false;
  const cooldown = TOPIC_COOLDOWNS[topic] ?? 60000;
  return Date.now() - lastTime < cooldown;
}

function markTopicShown(topic: TopicKey): void {
  topicLastShown.set(topic, Date.now());
}

// ── Main ──

let lastAdviceTime = 0;
const MIN_ADVICE_INTERVAL = 12000; // 12s between ANY tips
const BASE_SCORE_THRESHOLD = 40;
const LATE_SCORE_THRESHOLD = 55;
let gameStartTime = 0;

export function setGameStartTime(time: number): void {
  gameStartTime = time;
}

function getScoreThreshold(): number {
  const elapsed = Date.now() - gameStartTime;
  const minutes = elapsed / 60000;
  if (minutes < 10) return BASE_SCORE_THRESHOLD;
  if (minutes < 20) return BASE_SCORE_THRESHOLD + 8;
  if (minutes < 30) return BASE_SCORE_THRESHOLD + 15;
  return LATE_SCORE_THRESHOLD;
}

export function pickBestAdvice(
  candidates: CoachingTip[],
  maxTips: number = 1
): CoachingTip[] {
  const now = Date.now();

  // Min interval between any tips
  if (now - lastAdviceTime < MIN_ADVICE_INTERVAL) {
    const dangerOnly = candidates.filter((t) => t.priority === 'danger');
    if (dangerOnly.length === 0) return [];
    candidates = dangerOnly;
  }

  if (candidates.length === 0) return [];

  // Score and filter by topic cooldown
  const scored = candidates
    .map((tip) => ({ tip, score: scoreTip(tip), topic: extractTopic(tip) }))
    .filter(({ topic }) => !isTopicOnCooldown(topic))  // BLOCK topics on cooldown
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  const threshold = getScoreThreshold();
  if (scored[0].score < threshold) return [];

  const result: CoachingTip[] = [];
  const usedTopics = new Set<string>();

  for (const { tip, score, topic } of scored) {
    if (result.length >= maxTips) break;
    if (score < threshold) break;
    if (usedTopics.has(topic)) continue; // Don't show 2 tips about same topic

    result.push(tip);
    usedTopics.add(topic);
    markTopicShown(topic);
  }

  if (result.length > 0) {
    lastAdviceTime = now;
  }

  return result;
}

export function resetPriorityEngine(): void {
  lastAdviceTime = 0;
  topicLastShown.clear();
  gameStartTime = 0;
}
