import type { CoachingTip } from '../types/coaching';

// ── Advice Priority Engine ──
// A central brain that picks THE MOST IMPORTANT tip to show.
// A real coach says ONE thing at a time, not 5 things simultaneously.

// Priority tiers (highest = most important)
const PRIORITY_TIERS: Record<string, number> = {
  // Tier 1: Immediate action required (life or death)
  'kill_window': 100,      // Enemy has no flash/ult - GO
  'danger_immediate': 95,  // You're about to die
  'objective_now': 90,     // Dragon/Baron spawning NOW

  // Tier 2: Tactical advantage
  'fight_advantage': 80,   // You win this fight, take it
  'cooldown_window': 75,   // Enemy flash/ult down
  'level_spike': 70,       // You just power spiked

  // Tier 3: Strategic
  'wave_action': 60,       // Crash wave, freeze, etc.
  'build_urgent': 55,      // Anti-heal needed urgently
  'recall_timing': 50,     // Good recall window

  // Tier 4: Informational
  'matchup_tip': 40,       // Champion-specific advice
  'build_suggestion': 35,  // General build tip
  'vision_reminder': 30,   // Ward up

  // Tier 5: Background coaching
  'mechanics_tip': 20,     // Animation cancel, spacing
  'general_tip': 10,       // Generic coaching
};

// Map tip categories + priorities to tier scores
function scoreTip(tip: CoachingTip): number {
  let score = 0;

  // Priority boost
  if (tip.priority === 'danger') score += 50;
  else if (tip.priority === 'warning') score += 25;
  else score += 5;

  // Category scoring
  const msg = tip.message.toLowerCase();

  // Kill windows (highest value)
  if (msg.includes('kill window') || msg.includes('flash down') || msg.includes('ult down')) {
    score += PRIORITY_TIERS['kill_window'];
  }
  // Fight advantage
  else if (msg.includes('you win') || msg.includes('all-in') || msg.includes('advantage') || msg.includes('power spike')) {
    score += PRIORITY_TIERS['fight_advantage'];
  }
  // Objective
  else if (msg.includes('dragon') || msg.includes('baron') || msg.includes('herald') || msg.includes('objective')) {
    score += PRIORITY_TIERS['objective_now'];
  }
  // Wave
  else if (msg.includes('wave') || msg.includes('push') || msg.includes('crash') || msg.includes('freeze')) {
    score += PRIORITY_TIERS['wave_action'];
  }
  // Build
  else if (msg.includes('build') || msg.includes('buy') || msg.includes('anti-heal') || msg.includes('armor') || msg.includes('mr ')) {
    score += PRIORITY_TIERS['build_suggestion'];
  }
  // Recall
  else if (msg.includes('recall') || msg.includes('gold')) {
    score += PRIORITY_TIERS['recall_timing'];
  }
  // Vision
  else if (msg.includes('ward') || msg.includes('vision')) {
    score += PRIORITY_TIERS['vision_reminder'];
  }
  // Combo/mechanics
  else if (msg.includes('combo') || msg.includes('cancel') || msg.includes('spacing')) {
    score += PRIORITY_TIERS['mechanics_tip'];
  }
  // Matchup
  else if (tip.category === 'matchup' || tip.category === 'trading') {
    score += PRIORITY_TIERS['matchup_tip'];
  }
  // Default
  else {
    score += PRIORITY_TIERS['general_tip'];
  }

  return score;
}

// ── Main function: pick the best tip(s) ──

let lastAdviceTime = 0;
let lastAdviceMessage = '';
const MIN_ADVICE_INTERVAL = 15000;   // 15s between tips - a real coach doesn't talk every 5s
const BASE_SCORE_THRESHOLD = 35;     // Early game threshold (more guidance needed)
const LATE_SCORE_THRESHOLD = 55;     // Late game threshold (player knows the game, only high-value tips)
let gameStartTime = 0;

export function setGameStartTime(time: number): void {
  gameStartTime = time;
}

// Dynamic threshold: more tips early, fewer late
function getScoreThreshold(): number {
  const elapsed = Date.now() - gameStartTime;
  const minutes = elapsed / 60000;
  if (minutes < 10) return BASE_SCORE_THRESHOLD;    // Early: more coaching
  if (minutes < 20) return BASE_SCORE_THRESHOLD + 8; // Mid: moderate
  if (minutes < 30) return BASE_SCORE_THRESHOLD + 15; // Late: only important stuff
  return LATE_SCORE_THRESHOLD;                        // Very late: almost silent unless critical
}

export function pickBestAdvice(
  candidates: CoachingTip[],
  maxTips: number = 1
): CoachingTip[] {
  const now = Date.now();

  // Don't spam - minimum 15s between advice
  if (now - lastAdviceTime < MIN_ADVICE_INTERVAL) {
    // Exception: DANGER tips cut through the silence
    const dangerOnly = candidates.filter((t) => t.priority === 'danger');
    if (dangerOnly.length === 0) return [];
    candidates = dangerOnly;
  }

  if (candidates.length === 0) return [];

  // Score all candidates
  const scored = candidates.map((tip) => ({
    tip,
    score: scoreTip(tip),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // ── SILENCE: if nothing is important enough, say NOTHING ──
  // Dynamic threshold: coach talks more early, less late
  const threshold = getScoreThreshold();
  if (scored[0].score < threshold) {
    return [];
  }

  // Pick top N, filter duplicates
  const result: CoachingTip[] = [];
  for (const { tip, score } of scored) {
    if (result.length >= maxTips) break;
    if (score < threshold) break;

    // Skip if too similar to last advice
    if (tip.message.slice(0, 30) === lastAdviceMessage.slice(0, 30)) continue;

    result.push(tip);
  }

  if (result.length > 0) {
    lastAdviceTime = now;
    lastAdviceMessage = result[0].message;
  }

  return result;
}

export function resetPriorityEngine(): void {
  lastAdviceTime = 0;
  lastAdviceMessage = '';
}
