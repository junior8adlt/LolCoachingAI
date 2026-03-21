import type { CoachingTip, TipPriority, TipCategory, ObjectiveInfo, JunglePrediction } from '../types/coaching';
import type { EnemyCooldowns } from './cooldownTracker';
import type { LaneWaveInfo } from './waveEngine';
import type { PlayerWeakness, WeaknessType } from './playerProfile';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Decision Timing Engine
// ═══════════════════════════════════════════════════════════════════════════════
// Gives advice BEFORE events happen, not during/after.
// A real coach says "fight window in 3 seconds" not "you should have fought".

export interface UpcomingDecision {
  type: 'fight_window' | 'gank_incoming' | 'objective_spawn' | 'power_spike' | 'roam_window' | 'recall_window';
  timeUntil: number;       // seconds until this happens
  message: string;         // "Fight window opening in 5s - enemy flash still down"
  urgency: 'prepare' | 'ready' | 'now';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Focus Mode
// ═══════════════════════════════════════════════════════════════════════════════
// Shows only 1 improvement objective per game phase. Reduces cognitive load.

export interface FocusObjective {
  phase: 'early' | 'mid' | 'late';
  objective: string;          // "Focus: Hit 7 CS/min"
  metric: string;             // "cs_per_min"
  target: number;             // 7.0
  current: number;            // 5.5
  progress: number;           // 0-1
}

// ── Tip creation helper ─────────────────────────────────────────────────────

let tipCounter = 0;

function createTip(
  message: string,
  priority: TipPriority,
  category: TipCategory,
): CoachingTip {
  tipCounter += 1;
  return {
    id: `decision-tip-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ── Urgency helpers ─────────────────────────────────────────────────────────

function urgencyFromTimeUntil(seconds: number): 'prepare' | 'ready' | 'now' {
  if (seconds <= 5) return 'now';
  if (seconds <= 15) return 'ready';
  return 'prepare';
}

function priorityFromUrgency(urgency: 'prepare' | 'ready' | 'now'): TipPriority {
  if (urgency === 'now') return 'danger';
  if (urgency === 'ready') return 'warning';
  return 'info';
}

// ── XP / level estimation ───────────────────────────────────────────────────

// Approximate cumulative XP required per level in League (simplified model)
const XP_PER_LEVEL: Record<number, number> = {
  1: 0,
  2: 280,
  3: 660,
  4: 1140,
  5: 1720,
  6: 2400,
  7: 3180,
  8: 4060,
  9: 5040,
  10: 6120,
  11: 7300,
  12: 8580,
  13: 9960,
  14: 11440,
  15: 13020,
  16: 14700,
  17: 16480,
  18: 18360,
};

// CS per minute → rough XP per minute (minion XP + ambient XP)
// At ~7 CS/min a solo laner earns roughly 380 XP/min total
const XP_PER_CS_MINUTE = 54; // ~380 XP/min / 7 CS/min ≈ 54 XP per CS-minute unit
const AMBIENT_XP_PER_MIN = 2; // tiny passive XP scaled by game time not captured here

/**
 * Estimate seconds until next level-up based on current level, CS/min rate, and
 * game time. Returns -1 if we cannot estimate (e.g. already level 18).
 */
function estimateTimeToLevelUp(currentLevel: number, csPerMin: number, gameTimeSeconds: number): number {
  if (currentLevel >= 18) return -1;
  if (csPerMin <= 0) return -1;

  const nextLevel = currentLevel + 1;
  const xpNeeded = (XP_PER_LEVEL[nextLevel] ?? 18360) - (XP_PER_LEVEL[currentLevel] ?? 0);

  // Estimate how much XP was already earned toward the next level.
  // We use game time and CS to approximate total XP earned, then see the remainder.
  const gameMinutes = gameTimeSeconds / 60;
  const totalXPEstimate = csPerMin * gameMinutes * XP_PER_CS_MINUTE + gameMinutes * AMBIENT_XP_PER_MIN;
  const currentLevelXP = XP_PER_LEVEL[currentLevel] ?? 0;
  const xpIntoLevel = Math.max(0, totalXPEstimate - currentLevelXP);
  const xpRemaining = Math.max(0, xpNeeded - xpIntoLevel);

  // XP earn rate (per second)
  const xpPerSecond = (csPerMin * XP_PER_CS_MINUTE + AMBIENT_XP_PER_MIN) / 60;
  if (xpPerSecond <= 0) return -1;

  const secondsToLevel = xpRemaining / xpPerSecond;

  // Clamp: if estimate is negative or huge it's unreliable
  if (secondsToLevel < 0) return 5; // about to level up
  if (secondsToLevel > 300) return -1; // too far away to be useful
  return Math.round(secondsToLevel);
}

// ── Detection: Fight window approaching ─────────────────────────────────────

function detectFightWindows(
  gameTime: number,
  cooldowns: EnemyCooldowns[],
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  for (const cd of cooldowns) {
    // Flash coming back soon → use your advantage NOW
    if (cd.flashDown) {
      const timeUntilFlashBack = Math.max(0, cd.flashUpTime - gameTime);

      if (timeUntilFlashBack <= 30 && timeUntilFlashBack > 0) {
        const urgency = urgencyFromTimeUntil(timeUntilFlashBack);
        decisions.push({
          type: 'fight_window',
          timeUntil: timeUntilFlashBack,
          message: `Use your advantage NOW on ${cd.championName} - their Flash back in ${Math.ceil(timeUntilFlashBack)}s`,
          urgency,
        });
      } else if (timeUntilFlashBack > 30) {
        // Flash still well on CD → window is open
        decisions.push({
          type: 'fight_window',
          timeUntil: 0,
          message: `${cd.championName} Flash down for ${Math.ceil(timeUntilFlashBack)}s - fight window OPEN`,
          urgency: 'now',
        });
      }
    }

    // Ult coming back soon → similar logic
    if (cd.ultDown) {
      const timeUntilUltBack = Math.max(0, cd.ultUpTime - gameTime);

      if (timeUntilUltBack <= 20 && timeUntilUltBack > 0) {
        const urgency = urgencyFromTimeUntil(timeUntilUltBack);
        decisions.push({
          type: 'fight_window',
          timeUntil: timeUntilUltBack,
          message: `${cd.championName} ult back in ${Math.ceil(timeUntilUltBack)}s - trade before it's up`,
          urgency,
        });
      } else if (timeUntilUltBack > 20) {
        decisions.push({
          type: 'fight_window',
          timeUntil: 0,
          message: `${cd.championName} ult down for ${Math.ceil(timeUntilUltBack)}s - all-in opportunity`,
          urgency: 'ready',
        });
      }
    }
  }

  return decisions;
}

// ── Detection: Gank incoming ────────────────────────────────────────────────

function detectGankIncoming(
  gameTime: number,
  junglePrediction: JunglePrediction,
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  // Only warn if gank risk is elevated
  if (junglePrediction.gankRisk < 0.4) return decisions;

  const timeSinceSeen = gameTime - junglePrediction.lastSeen;

  // Jungler on your side with high risk
  if (junglePrediction.gankRisk >= 0.6) {
    // If recently seen nearby, gank is imminent
    if (timeSinceSeen < 30) {
      decisions.push({
        type: 'gank_incoming',
        timeUntil: Math.max(5, 15 - timeSinceSeen),
        message: `Gank LIKELY in ${Math.max(5, Math.ceil(15 - timeSinceSeen))}s - jungler on your side, back off now`,
        urgency: 'now',
      });
    } else {
      // Not seen recently but predicted on your side
      decisions.push({
        type: 'gank_incoming',
        timeUntil: 20,
        message: `Gank likely in 10-20s - jungler predicted on your side, play safe`,
        urgency: 'ready',
      });
    }
  } else if (junglePrediction.gankRisk >= 0.4) {
    // Moderate risk
    if (timeSinceSeen > 60) {
      decisions.push({
        type: 'gank_incoming',
        timeUntil: 30,
        message: `Jungler missing for ${Math.floor(timeSinceSeen)}s - gank possible, ward up and stay alert`,
        urgency: 'prepare',
      });
    }
  }

  return decisions;
}

// ── Detection: Objective spawn ──────────────────────────────────────────────

function detectObjectiveSpawns(
  objectives: ObjectiveInfo[],
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  for (const obj of objectives) {
    // Objective is dead and timer is counting down to respawn
    if (obj.status === 'dead' && obj.timer > 0 && obj.timer <= 90) {
      const objName = obj.type === 'dragon'
        ? `${obj.dragonType ?? ''} Dragon`.trim()
        : obj.type === 'baron'
          ? 'Baron'
          : 'Rift Herald';

      const urgency = urgencyFromTimeUntil(obj.timer);

      if (obj.timer <= 60) {
        let action = 'start pushing';
        if (obj.timer <= 20) {
          action = 'move to position NOW';
        } else if (obj.timer <= 40) {
          action = 'set up vision and prepare';
        }

        decisions.push({
          type: 'objective_spawn',
          timeUntil: obj.timer,
          message: `${objName} in ${Math.ceil(obj.timer)}s - ${action}`,
          urgency,
        });
      } else {
        // 60-90s out: early warning
        decisions.push({
          type: 'objective_spawn',
          timeUntil: obj.timer,
          message: `${objName} spawning in ${Math.ceil(obj.timer)}s - start thinking about setup`,
          urgency: 'prepare',
        });
      }
    }

    // Objective is alive → remind to contest if no timer
    if (obj.status === 'alive' && (obj.type === 'baron' || obj.type === 'dragon')) {
      decisions.push({
        type: 'objective_spawn',
        timeUntil: 0,
        message: `${obj.type === 'baron' ? 'Baron' : (obj.dragonType ?? '') + ' Dragon'} is UP - look for opportunities to take it`,
        urgency: 'ready',
      });
    }
  }

  return decisions;
}

// ── Detection: Power spike (level up approaching) ───────────────────────────

function detectPowerSpike(
  gameTime: number,
  myLevel: number,
  csPerMin: number,
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  const secondsToLevel = estimateTimeToLevelUp(myLevel, csPerMin, gameTime);
  if (secondsToLevel < 0) return decisions;

  const nextLevel = myLevel + 1;

  // Key power spike levels
  const isKeyLevel = nextLevel === 2 || nextLevel === 3 || nextLevel === 6 ||
    nextLevel === 11 || nextLevel === 16;

  if (isKeyLevel && secondsToLevel <= 30) {
    const urgency = urgencyFromTimeUntil(secondsToLevel);
    let spikeInfo = '';

    if (nextLevel === 2) {
      spikeInfo = 'level 2 first is a huge early advantage, prepare to trade';
    } else if (nextLevel === 3) {
      spikeInfo = 'all basic abilities unlocked, look for a trade';
    } else if (nextLevel === 6) {
      spikeInfo = 'ultimate unlocked, prepare for all-in';
    } else if (nextLevel === 11) {
      spikeInfo = 'rank 2 ult spike, look for a big play';
    } else if (nextLevel === 16) {
      spikeInfo = 'rank 3 ult spike, massive power increase';
    }

    decisions.push({
      type: 'power_spike',
      timeUntil: secondsToLevel,
      message: `About to hit level ${nextLevel} in ~${secondsToLevel}s - ${spikeInfo}`,
      urgency,
    });
  } else if (!isKeyLevel && secondsToLevel <= 10) {
    // Non-key levels: only mention if imminent
    decisions.push({
      type: 'power_spike',
      timeUntil: secondsToLevel,
      message: `Level ${nextLevel} in ~${secondsToLevel}s - small stat advantage incoming`,
      urgency: 'prepare',
    });
  }

  return decisions;
}

// ── Detection: Roam window ──────────────────────────────────────────────────

function detectRoamWindow(
  waveState: LaneWaveInfo,
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  // Wave about to crash into enemy tower = roam window opening
  if (waveState.state === 'pushing_to_enemy' && waveState.confidence >= 0.4) {
    // Fast push → crash is imminent
    if (waveState.csRate >= 5) {
      decisions.push({
        type: 'roam_window',
        timeUntil: 5,
        message: 'Wave crashing in ~5s - prepare to roam after it hits tower',
        urgency: 'ready',
      });
    } else if (waveState.csRate >= 2.5) {
      // Slow push building → crash in ~10-15s
      decisions.push({
        type: 'roam_window',
        timeUntil: 12,
        message: 'Wave crashing in ~10s - prepare to roam after',
        urgency: 'prepare',
      });
    }
  }

  // Wave already crashing → roam NOW
  if (waveState.state === 'crashing' && waveState.confidence >= 0.3) {
    decisions.push({
      type: 'roam_window',
      timeUntil: 0,
      message: 'Wave crashing into tower NOW - roam or recall window open',
      urgency: 'now',
    });
  }

  return decisions;
}

// ── Detection: Recall window ────────────────────────────────────────────────

function detectRecallWindow(
  waveState: LaneWaveInfo,
): UpcomingDecision[] {
  const decisions: UpcomingDecision[] = [];

  // Wave pushing toward you → safe recall once it arrives
  if (waveState.state === 'pushing_to_you' && waveState.confidence >= 0.3) {
    decisions.push({
      type: 'recall_window',
      timeUntil: 15,
      message: 'Wave coming to you in ~15s - safe recall window after you catch it',
      urgency: 'prepare',
    });
  }

  // Wave bouncing back → it will push to you
  if (waveState.state === 'bouncing' && waveState.confidence >= 0.3) {
    decisions.push({
      type: 'recall_window',
      timeUntil: 20,
      message: 'Wave bouncing back - catch it at tower then recall',
      urgency: 'prepare',
    });
  }

  // Wave crashing into enemy tower → recall now before it bounces back
  if (waveState.state === 'crashing' && waveState.confidence >= 0.3) {
    decisions.push({
      type: 'recall_window',
      timeUntil: 0,
      message: 'Wave crashed into enemy tower - recall NOW before it bounces',
      urgency: 'now',
    });
  }

  return decisions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: predictUpcomingDecisions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Analyze the current game state and predict upcoming decision points.
 * Returns an array of decisions sorted by urgency (most urgent first).
 */
export function predictUpcomingDecisions(
  gameTime: number,
  objectives: ObjectiveInfo[],
  junglePrediction: JunglePrediction,
  cooldowns: EnemyCooldowns[],
  waveState: LaneWaveInfo,
  myLevel: number,
): UpcomingDecision[] {
  const csPerMin = gameTime > 0 ? (waveState.csRate / 30) * 60 : 0; // convert 30s rate to per-minute

  const allDecisions: UpcomingDecision[] = [
    ...detectFightWindows(gameTime, cooldowns),
    ...detectGankIncoming(gameTime, junglePrediction),
    ...detectObjectiveSpawns(objectives),
    ...detectPowerSpike(gameTime, myLevel, csPerMin),
    ...detectRoamWindow(waveState),
    ...detectRecallWindow(waveState),
  ];

  // Sort by urgency: now > ready > prepare, then by timeUntil ascending
  const urgencyOrder: Record<string, number> = { now: 0, ready: 1, prepare: 2 };
  allDecisions.sort((a, b) => {
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgDiff !== 0) return urgDiff;
    return a.timeUntil - b.timeUntil;
  });

  return allDecisions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: generateTimingTip
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert a single UpcomingDecision into a CoachingTip, or return null if the
 * decision doesn't warrant a tip right now.
 */
export function generateTimingTip(decision: UpcomingDecision): CoachingTip | null {
  // Only generate tips for decisions that are urgent enough
  if (decision.urgency === 'prepare' && decision.timeUntil > 30) {
    return null; // Too far out to bother the player
  }

  const priority = priorityFromUrgency(decision.urgency);

  const categoryMap: Record<UpcomingDecision['type'], TipCategory> = {
    fight_window: 'trading',
    gank_incoming: 'jungle',
    objective_spawn: 'objective',
    power_spike: 'trading',
    roam_window: 'macro',
    recall_window: 'recall',
  };

  return createTip(decision.message, priority, categoryMap[decision.type]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Focus Mode: getFocusObjective
// ═══════════════════════════════════════════════════════════════════════════════

interface CurrentStats {
  csPerMin: number;
  deaths: number;
  wardsPlaced: number;
  killParticipation: number; // 0-100
  soloDeaths: number;
}

/**
 * Determine the single most important objective for the player to focus on,
 * based on game phase and their known weaknesses.
 */
export function getFocusObjective(
  gameTime: number,
  playerWeaknesses: PlayerWeakness[],
  currentStats: CurrentStats,
): FocusObjective {
  const minutes = gameTime / 60;

  // Determine phase
  const phase: 'early' | 'mid' | 'late' =
    minutes < 15 ? 'early' :
    minutes < 25 ? 'mid' :
    'late';

  // Build a set of weakness types for quick lookup
  const weaknessSet = new Set<WeaknessType>(playerWeaknesses.map((w) => w.type));

  // Helper: find the highest severity weakness from a list of candidate types
  function hasWeakness(...types: WeaknessType[]): boolean {
    return types.some((t) => weaknessSet.has(t));
  }

  // ── Early game (0-15min) ──────────────────────────────────────────────────

  if (phase === 'early') {
    if (hasWeakness('farming')) {
      const target = 7.0;
      const current = currentStats.csPerMin;
      const progress = Math.min(1, current / target);
      return {
        phase,
        objective: 'Focus: Hit 7 CS/min',
        metric: 'cs_per_min',
        target,
        current: Math.round(current * 10) / 10,
        progress: Math.round(progress * 100) / 100,
      };
    }

    if (hasWeakness('vision')) {
      const target = 3;
      const current = currentStats.wardsPlaced;
      const progress = Math.min(1, current / target);
      return {
        phase,
        objective: 'Focus: Ward before pushing',
        metric: 'wards_placed',
        target,
        current,
        progress: Math.round(progress * 100) / 100,
      };
    }

    if (hasWeakness('dying_to_ganks')) {
      // Use inverse of deaths to ganks as the metric; target = 0 gank deaths
      const target = 0;
      const current = currentStats.deaths; // proxy: total deaths early
      const progress = current === 0 ? 1 : Math.max(0, 1 - current * 0.33);
      return {
        phase,
        objective: 'Focus: Check minimap every 5s',
        metric: 'gank_deaths',
        target,
        current,
        progress: Math.round(progress * 100) / 100,
      };
    }

    // Default early game
    const target = 7.0;
    const current = currentStats.csPerMin;
    const progress = Math.min(1, current / target);
    return {
      phase,
      objective: 'Focus: Win lane trades',
      metric: 'cs_per_min',
      target,
      current: Math.round(current * 10) / 10,
      progress: Math.round(progress * 100) / 100,
    };
  }

  // ── Mid game (15-25min) ───────────────────────────────────────────────────

  if (phase === 'mid') {
    if (hasWeakness('kill_participation', 'passivity')) {
      const target = 60;
      const current = currentStats.killParticipation;
      const progress = Math.min(1, current / target);
      return {
        phase,
        objective: 'Focus: Rotate to objectives',
        metric: 'kill_participation',
        target,
        current: Math.round(current),
        progress: Math.round(progress * 100) / 100,
      };
    }

    if (hasWeakness('solo_deaths', 'overaggression')) {
      const target = 0;
      const current = currentStats.soloDeaths;
      const progress = current === 0 ? 1 : Math.max(0, 1 - current * 0.33);
      return {
        phase,
        objective: "Focus: Don't get caught alone",
        metric: 'solo_deaths',
        target,
        current,
        progress: Math.round(progress * 100) / 100,
      };
    }

    // Default mid game
    const target = 60;
    const current = currentStats.killParticipation;
    const progress = Math.min(1, current / target);
    return {
      phase,
      objective: 'Focus: Group for objectives',
      metric: 'kill_participation',
      target,
      current: Math.round(current),
      progress: Math.round(progress * 100) / 100,
    };
  }

  // ── Late game (25+min) ────────────────────────────────────────────────────

  if (hasWeakness('late_game_deaths', 'solo_deaths', 'overaggression')) {
    const target = 0;
    const current = currentStats.deaths;
    const progress = current <= 3 ? Math.max(0, 1 - current * 0.15) : Math.max(0, 1 - current * 0.1);
    return {
      phase,
      objective: 'Focus: Position behind frontline',
      metric: 'deaths',
      target,
      current,
      progress: Math.round(progress * 100) / 100,
    };
  }

  // Default late game
  const target = 0;
  const current = currentStats.deaths;
  const progress = current <= 2 ? 1 : Math.max(0, 1 - (current - 2) * 0.15);
  return {
    phase,
    objective: "Focus: Don't die with shutdown",
    metric: 'deaths',
    target,
    current,
    progress: Math.round(progress * 100) / 100,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: generateFocusTip
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert a FocusObjective into a coaching tip. Returns null if progress is
 * already at 100% (no need to remind the player).
 */
export function generateFocusTip(focus: FocusObjective): CoachingTip | null {
  // Player is already meeting the objective
  if (focus.progress >= 1.0) {
    return null;
  }

  const progressPercent = Math.round(focus.progress * 100);

  let priority: TipPriority = 'info';
  if (focus.progress < 0.3) {
    priority = 'danger';
  } else if (focus.progress < 0.6) {
    priority = 'warning';
  }

  const phaseLabel = focus.phase === 'early' ? 'Early game' :
    focus.phase === 'mid' ? 'Mid game' : 'Late game';

  let detail = '';
  switch (focus.metric) {
    case 'cs_per_min':
      detail = ` (${focus.current}/${focus.target} CS/min)`;
      break;
    case 'wards_placed':
      detail = ` (${focus.current}/${focus.target} wards)`;
      break;
    case 'kill_participation':
      detail = ` (${focus.current}%/${focus.target}% KP)`;
      break;
    case 'gank_deaths':
    case 'solo_deaths':
    case 'deaths':
      if (focus.current > 0) {
        detail = ` (${focus.current} deaths so far)`;
      }
      break;
    default:
      detail = '';
  }

  const message = `[${phaseLabel}] ${focus.objective}${detail} - ${progressPercent}% there`;

  const categoryMap: Record<string, TipCategory> = {
    cs_per_min: 'farming',
    wards_placed: 'vision',
    kill_participation: 'macro',
    gank_deaths: 'jungle',
    solo_deaths: 'positioning',
    deaths: 'positioning',
  };

  return createTip(
    message,
    priority,
    categoryMap[focus.metric] ?? 'general',
  );
}
