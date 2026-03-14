import type { GameEvent } from '../types/game';
import type {
  CoachingTip,
  TipPriority,
  TipCategory,
  ObjectiveInfo,
} from '../types/coaching';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WaveState =
  | 'pushing_to_enemy'
  | 'pushing_to_you'
  | 'frozen_near_you'
  | 'frozen_near_enemy'
  | 'crashing'
  | 'bouncing'
  | 'unknown';

export interface LaneWaveInfo {
  state: WaveState;
  confidence: number; // 0-1
  lastUpdate: number; // game-time seconds when this was last computed
  csRate: number; // CS per 30-second window
  recommendation: string;
}

export interface RecallDecision {
  canRecall: boolean;
  reason: string;
}

// ---------------------------------------------------------------------------
// Constants – League wave mechanics
// ---------------------------------------------------------------------------

/** Minions first spawn at 1:05 (65 s). */
const FIRST_WAVE_SPAWN = 65;

/** A new wave spawns every 30 seconds. */
const WAVE_INTERVAL = 30;

/** Wave travel time from spawn to roughly mid-lane. */
const WAVE_TRAVEL_TO_MID = 30;

/**
 * After a champion kill, it takes roughly 30-45 s for the wave advantage to
 * become visible in CS numbers.
 */
const KILL_WAVE_DELAY = 37;

/** Rolling window size (seconds) for CS-rate tracking. */
const WINDOW_SIZE = 30;

// CS-rate thresholds (CS per 30-second window)
const CS_RATE_FAST_PUSH = 5; // shoving hard
const CS_RATE_SLOW_PUSH = 2.5; // moderate farming / slow push building
const CS_RATE_FREEZE = 1; // just last-hitting
// Below FREEZE threshold with player alive → could be roaming or zoning

// ---------------------------------------------------------------------------
// Internal state – per-lane tracking
// ---------------------------------------------------------------------------

interface CSSnapshot {
  time: number;
  cs: number;
}

interface LaneState {
  csHistory: CSSnapshot[];
  waveInfo: LaneWaveInfo;
  playerDeathTime: number; // last game-time player died, 0 if never
  enemyDeathTime: number; // last game-time enemy laner died, 0 if never
  turretKilledTime: number; // last game-time a turret fell in this lane
  recallTime: number; // last game-time player recalled
}

const laneStates: Map<string, LaneState> = new Map();

function getOrCreateLane(laneKey: string): LaneState {
  let state = laneStates.get(laneKey);
  if (!state) {
    state = {
      csHistory: [],
      waveInfo: {
        state: 'unknown',
        confidence: 0,
        lastUpdate: 0,
        csRate: 0,
        recommendation: 'Not enough data yet.',
      },
      playerDeathTime: 0,
      enemyDeathTime: 0,
      turretKilledTime: 0,
      recallTime: 0,
    };
    laneStates.set(laneKey, state);
  }
  return state;
}

/** Reset all tracked state (useful between games). */
export function resetWaveEngine(): void {
  laneStates.clear();
  waveTipCounter = 0;
}

// ---------------------------------------------------------------------------
// Tip creation – mirrors gameAnalyzer.ts createTip pattern
// ---------------------------------------------------------------------------

let waveTipCounter = 0;

function createTip(
  message: string,
  priority: TipPriority,
  category: TipCategory,
): CoachingTip {
  waveTipCounter += 1;
  return {
    id: `wave-tip-${Date.now()}-${waveTipCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ---------------------------------------------------------------------------
// CS-rate computation
// ---------------------------------------------------------------------------

function computeCSRate(history: CSSnapshot[], currentTime: number): number {
  if (history.length < 2) return 0;

  // Find the snapshot closest to (currentTime - WINDOW_SIZE)
  const windowStart = currentTime - WINDOW_SIZE;
  let startSnapshot: CSSnapshot | null = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= windowStart) {
      startSnapshot = history[i];
      break;
    }
  }

  const endSnapshot = history[history.length - 1];

  if (!startSnapshot) {
    // Not enough history for a full window; use the oldest available
    startSnapshot = history[0];
  }

  const dt = endSnapshot.time - startSnapshot.time;
  if (dt <= 0) return 0;

  const dcs = endSnapshot.cs - startSnapshot.cs;
  // Normalize to a 30-second rate
  return (dcs / dt) * WINDOW_SIZE;
}

// ---------------------------------------------------------------------------
// Infer wave state from CS rate + events
// ---------------------------------------------------------------------------

function inferWaveFromCSRate(
  csRate: number,
  playerDead: boolean,
): WaveState {
  if (playerDead) {
    // Player is dead; wave is almost certainly pushing toward them.
    return 'pushing_to_you';
  }

  if (csRate >= CS_RATE_FAST_PUSH) {
    return 'pushing_to_enemy';
  }
  if (csRate >= CS_RATE_SLOW_PUSH) {
    // Could be a slow push building or just normal farming
    return 'pushing_to_enemy';
  }
  if (csRate >= CS_RATE_FREEZE) {
    return 'frozen_near_you';
  }
  // Very low CS rate but alive → possibly roaming, or wave is far from player
  return 'unknown';
}

function inferWaveFromEvents(
  lane: LaneState,
  gameTime: number,
  playerDead: boolean,
  enemyLanerDead: boolean,
): { state: WaveState; confidence: number } | null {
  // Enemy laner just died → wave pushes toward enemy tower
  if (enemyLanerDead && lane.enemyDeathTime > 0) {
    const timeSinceDeath = gameTime - lane.enemyDeathTime;
    if (timeSinceDeath < KILL_WAVE_DELAY + 15) {
      return { state: 'pushing_to_enemy', confidence: 0.8 };
    }
    // After the wave has had time to crash, it starts bouncing back
    if (timeSinceDeath < KILL_WAVE_DELAY + 45) {
      return { state: 'crashing', confidence: 0.6 };
    }
    if (timeSinceDeath < KILL_WAVE_DELAY + 75) {
      return { state: 'bouncing', confidence: 0.5 };
    }
  }

  // Player just died → wave pushes toward player's tower
  if (playerDead && lane.playerDeathTime > 0) {
    const timeSinceDeath = gameTime - lane.playerDeathTime;
    if (timeSinceDeath < KILL_WAVE_DELAY + 15) {
      return { state: 'pushing_to_you', confidence: 0.8 };
    }
    if (timeSinceDeath < KILL_WAVE_DELAY + 45) {
      return { state: 'crashing', confidence: 0.6 };
    }
  }

  // Turret recently fell → faster push dynamics
  if (lane.turretKilledTime > 0) {
    const timeSinceTurret = gameTime - lane.turretKilledTime;
    if (timeSinceTurret < 60) {
      return { state: 'pushing_to_enemy', confidence: 0.5 };
    }
  }

  // Player recently recalled → wave likely bouncing back
  if (lane.recallTime > 0) {
    const timeSinceRecall = gameTime - lane.recallTime;
    if (timeSinceRecall < 45) {
      return { state: 'bouncing', confidence: 0.5 };
    }
  }

  return null;
}

function buildRecommendation(state: WaveState, gameTime: number, csRate: number): string {
  const minutes = gameTime / 60;

  switch (state) {
    case 'pushing_to_enemy':
      if (csRate >= CS_RATE_FAST_PUSH) {
        return 'You are fast-pushing. Make sure you have vision before shoving this far.';
      }
      return 'Wave is pushing toward enemy tower. Consider crashing it fully before rotating.';

    case 'pushing_to_you':
      return 'Wave is pushing toward you. Let it come to your tower for a safe farming position.';

    case 'frozen_near_you':
      if (minutes < 14) {
        return 'Wave is frozen on your side. Great position to farm safely and deny the enemy.';
      }
      return 'Wave is frozen near you. Farm up, but watch for opportunities to group if objectives are up.';

    case 'frozen_near_enemy':
      return 'Wave is frozen on the enemy side. Be careful of ganks if you walk up to farm.';

    case 'crashing':
      return 'Wave is crashing into tower. It will bounce back soon. Plan your next move.';

    case 'bouncing':
      return 'Wave is bouncing back. It will start pushing toward you shortly. Prepare to catch it.';

    case 'unknown':
    default:
      return 'Wave state is unclear. Keep an eye on minion positioning.';
  }
}

// ---------------------------------------------------------------------------
// Process game events relevant to wave tracking
// ---------------------------------------------------------------------------

function processEvents(
  lane: LaneState,
  events: GameEvent[],
  _gameTime: number,
  playerName?: string,
  enemyLanerName?: string,
): void {
  for (const event of events) {
    // Champion kills
    if (event.EventName === 'ChampionKill') {
      if (playerName && event.VictimName === playerName) {
        lane.playerDeathTime = event.EventTime;
      }
      if (enemyLanerName && event.VictimName === enemyLanerName) {
        lane.enemyDeathTime = event.EventTime;
      }
    }

    // Turret kills
    if (event.EventName === 'TurretKilled') {
      lane.turretKilledTime = event.EventTime;
    }

    // Detect recall via lack-of-CS combined with not being dead.
    // The Riot API does not expose recall events directly, so we
    // approximate: if CS hasn't changed for 10+ seconds, the player
    // is alive, and they were recently pushing, they likely recalled.
    // This is handled implicitly via CS-rate dropping to 0.
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Update the wave state for a lane based on new data.
 *
 * @param gameTime     Current game time in seconds.
 * @param csNow        Player's current total creep score.
 * @param csPrevious   Player's creep score at `prevTime`.
 * @param prevTime     The game time of the previous sample.
 * @param events       Recent game events (kills, turret kills, etc.).
 * @param playerDead   Whether the player is currently dead.
 * @param enemyLanerDead Whether the enemy laner is currently dead.
 * @param laneKey      Optional lane identifier (defaults to "player_lane").
 * @param playerName   Optional summoner name for event matching.
 * @param enemyLanerName Optional enemy laner summoner name for event matching.
 */
export function updateWaveState(
  gameTime: number,
  csNow: number,
  csPrevious: number,
  prevTime: number,
  events: GameEvent[],
  playerDead: boolean,
  enemyLanerDead: boolean,
  laneKey: string = 'player_lane',
  playerName?: string,
  enemyLanerName?: string,
): LaneWaveInfo {
  const lane = getOrCreateLane(laneKey);

  // Before minions have spawned there is nothing to infer.
  if (gameTime < FIRST_WAVE_SPAWN) {
    lane.waveInfo = {
      state: 'unknown',
      confidence: 0,
      lastUpdate: gameTime,
      csRate: 0,
      recommendation: 'Minions have not spawned yet.',
    };
    return lane.waveInfo;
  }

  // Record CS snapshot
  if (
    lane.csHistory.length === 0 ||
    lane.csHistory[lane.csHistory.length - 1].time < gameTime
  ) {
    lane.csHistory.push({ time: gameTime, cs: csNow });
  }

  // Prune old history (keep last 5 minutes max)
  const pruneThreshold = gameTime - 300;
  while (lane.csHistory.length > 0 && lane.csHistory[0].time < pruneThreshold) {
    lane.csHistory.shift();
  }

  // Process events
  processEvents(lane, events, gameTime, playerName, enemyLanerName);

  // Detect recall: if CS hasn't changed for a long stretch while player is alive
  const csRate = computeCSRate(lane.csHistory, gameTime);
  const dt = gameTime - prevTime;
  if (dt > 0 && !playerDead && csNow === csPrevious && dt >= 8) {
    // Likely recalling or roaming; mark as possible recall
    lane.recallTime = gameTime;
  }

  // ------ Determine wave state ------
  // First check event-based inference (higher signal).
  const eventInference = inferWaveFromEvents(lane, gameTime, playerDead, enemyLanerDead);

  let state: WaveState;
  let confidence: number;

  if (eventInference && eventInference.confidence > 0.5) {
    state = eventInference.state;
    confidence = eventInference.confidence;

    // Adjust confidence with CS-rate corroboration
    const csState = inferWaveFromCSRate(csRate, playerDead);
    if (csState === state) {
      confidence = Math.min(1, confidence + 0.15);
    }
  } else {
    // Fall back to pure CS-rate heuristic
    state = inferWaveFromCSRate(csRate, playerDead);
    confidence = csRate > 0 ? 0.4 : 0.2;

    // Distinguish slow push from fast push
    if (!playerDead && !enemyLanerDead) {
      if (csRate >= CS_RATE_FAST_PUSH) {
        state = 'pushing_to_enemy';
        confidence = 0.6;
      } else if (csRate >= CS_RATE_SLOW_PUSH && csRate < CS_RATE_FAST_PUSH) {
        // Moderate CS; could be slow push building or normal lane
        state = 'pushing_to_enemy';
        confidence = 0.35;
      } else if (csRate >= CS_RATE_FREEZE && csRate < CS_RATE_SLOW_PUSH) {
        state = 'frozen_near_you';
        confidence = 0.4;
      } else if (csRate < CS_RATE_FREEZE && csRate > 0) {
        // Very low CS but something is happening
        state = 'pushing_to_you';
        confidence = 0.3;
      }
    }

    // Merge with weaker event inference if available
    if (eventInference) {
      state = eventInference.state;
      confidence = Math.max(confidence, eventInference.confidence);
    }
  }

  const recommendation = buildRecommendation(state, gameTime, csRate);

  lane.waveInfo = {
    state,
    confidence: Math.round(confidence * 100) / 100,
    lastUpdate: gameTime,
    csRate: Math.round(csRate * 10) / 10,
    recommendation,
  };

  return lane.waveInfo;
}

/**
 * Generate a coaching tip based on the current wave state, game time,
 * and upcoming objectives.
 *
 * Returns `null` when there is nothing actionable to say.
 */
export function getWaveCoachingTip(
  waveInfo: LaneWaveInfo,
  gameTime: number,
  objectives: ObjectiveInfo[],
): CoachingTip | null {
  // Don't generate tips when confidence is too low
  if (waveInfo.confidence < 0.3) {
    return null;
  }

  const minutes = gameTime / 60;

  // ---- Objective-aware tips ----
  const upcomingObjective = objectives.find(
    (o) =>
      (o.status === 'alive' || (o.status === 'dead' && o.timer <= 60)) &&
      (o.type === 'dragon' || o.type === 'baron' || o.type === 'herald'),
  );

  if (upcomingObjective) {
    const objName =
      upcomingObjective.type === 'dragon'
        ? `${upcomingObjective.dragonType ?? ''} Dragon`.trim()
        : upcomingObjective.type === 'baron'
          ? 'Baron'
          : 'Rift Herald';

    const objSpawning = upcomingObjective.status === 'dead' && upcomingObjective.timer <= 60;
    const objAlive = upcomingObjective.status === 'alive';

    if (objSpawning || objAlive) {
      if (waveInfo.state === 'pushing_to_you' || waveInfo.state === 'frozen_near_you') {
        return createTip(
          `${objName} ${objSpawning ? 'spawns soon' : 'is up'}. Push the wave out before rotating so you don't lose CS to tower.`,
          'warning',
          'macro',
        );
      }
      if (waveInfo.state === 'pushing_to_enemy' && waveInfo.csRate >= CS_RATE_SLOW_PUSH) {
        return createTip(
          `Set up a slow push before ${objName} ${objSpawning ? 'spawns' : 'fight'}. The built-up wave will pressure the lane while you're gone.`,
          'info',
          'macro',
        );
      }
    }
  }

  // ---- State-specific tips ----

  switch (waveInfo.state) {
    case 'pushing_to_enemy': {
      if (waveInfo.csRate >= CS_RATE_FAST_PUSH) {
        return createTip(
          'You are shoving the wave hard. Make sure you have vision of the enemy jungler before pushing this aggressively.',
          'warning',
          'farming',
        );
      }
      if (minutes < 14) {
        return createTip(
          'Wave is slowly pushing toward the enemy. You can build a big wave and crash it to get a free recall or roam timer.',
          'info',
          'macro',
        );
      }
      return null;
    }

    case 'pushing_to_you': {
      return createTip(
        'Wave is pushing toward you. Let it come to your tower for a safe farming position.',
        'info',
        'farming',
      );
    }

    case 'frozen_near_you': {
      if (minutes < 14) {
        return createTip(
          'Nice freeze! The enemy has to overextend to farm. Call your jungler for a gank.',
          'info',
          'farming',
        );
      }
      return createTip(
        'Wave is frozen on your side. Farm up safely but be ready to group if your team needs you.',
        'info',
        'farming',
      );
    }

    case 'frozen_near_enemy': {
      return createTip(
        'Wave is frozen on the enemy side. Be very careful walking up -- you are exposed to ganks. Ask your jungler to help break the freeze.',
        'warning',
        'positioning',
      );
    }

    case 'crashing': {
      return createTip(
        'Wave is crashing into tower. Great time to recall, roam, or take a jungle camp while the wave resets.',
        'info',
        'recall',
      );
    }

    case 'bouncing': {
      return createTip(
        'Wave is bouncing back and will push toward you. Be ready to catch it at your tower -- don\'t miss the CS.',
        'info',
        'farming',
      );
    }

    case 'unknown':
    default:
      return null;
  }
}

/**
 * Determine whether the player should recall based on wave state,
 * current gold, and remaining health percentage (0-1).
 */
export function shouldRecallBasedOnWave(
  waveInfo: LaneWaveInfo,
  gold: number,
  healthPercent: number,
): RecallDecision {
  // Excellent recall windows
  if (waveInfo.state === 'crashing') {
    if (gold >= 800) {
      return {
        canRecall: true,
        reason: `Wave is crashing into enemy tower. Perfect recall timing -- you have ${gold}g to spend.`,
      };
    }
    if (healthPercent < 0.4) {
      return {
        canRecall: true,
        reason: 'Wave is crashing into tower and you are low. Recall now before the wave bounces back.',
      };
    }
    return {
      canRecall: true,
      reason: 'Wave is crashing into tower. Good window to recall even without much gold.',
    };
  }

  // Wave pushing TO enemy -- can recall after it crashes
  if (waveInfo.state === 'pushing_to_enemy') {
    if (waveInfo.csRate >= CS_RATE_FAST_PUSH) {
      return {
        canRecall: true,
        reason: 'You are fast-pushing. Crash the wave into tower, then recall immediately.',
      };
    }
    if (gold >= 1300) {
      return {
        canRecall: true,
        reason: `Shove the rest of this wave into tower then recall. You have ${gold}g for a significant buy.`,
      };
    }
    if (healthPercent < 0.3) {
      return {
        canRecall: true,
        reason: 'Health is critical. Push the remaining wave out and recall before you die.',
      };
    }
    return {
      canRecall: false,
      reason: 'Wave is pushing but hasn\'t crashed yet. Finish shoving it into tower before recalling.',
    };
  }

  // Wave pushing TOWARD you -- bad recall timing
  if (waveInfo.state === 'pushing_to_you') {
    if (healthPercent < 0.2) {
      return {
        canRecall: true,
        reason: 'You are dangerously low. Recall even though you will lose CS to tower -- staying alive is more important.',
      };
    }
    const wavesLost = waveInfo.csRate > 0 ? Math.ceil(WAVE_TRAVEL_TO_MID / WAVE_INTERVAL) : 1;
    return {
      canRecall: false,
      reason: `Don't recall now. The wave is pushing toward you and you'll lose ${wavesLost > 1 ? `~${wavesLost} waves` : 'a wave'} to tower.`,
    };
  }

  // Frozen near you -- bad to recall, you'll break the freeze
  if (waveInfo.state === 'frozen_near_you') {
    if (healthPercent < 0.2) {
      return {
        canRecall: true,
        reason: 'Health is too low to stay. Recall even though it breaks your freeze.',
      };
    }
    return {
      canRecall: false,
      reason: 'You have a freeze going. Don\'t recall or you\'ll lose this advantageous position.',
    };
  }

  // Frozen near enemy -- could recall but wave won't push to you
  if (waveInfo.state === 'frozen_near_enemy') {
    if (gold >= 1000 || healthPercent < 0.35) {
      return {
        canRecall: true,
        reason: 'Wave is frozen on enemy side. You can recall, but try to break the freeze first if possible.',
      };
    }
    return {
      canRecall: false,
      reason: 'Wave is frozen on enemy side. Try to break the freeze before recalling.',
    };
  }

  // Bouncing -- wave coming back, wait for it
  if (waveInfo.state === 'bouncing') {
    if (healthPercent < 0.2) {
      return {
        canRecall: true,
        reason: 'Too low to wait for the wave. Recall now and try to catch it when you get back.',
      };
    }
    return {
      canRecall: false,
      reason: 'Wave is bouncing back toward you. Wait to catch it at your tower before recalling.',
    };
  }

  // Unknown -- use gold + health heuristics
  if (gold >= 1300 && healthPercent < 0.5) {
    return {
      canRecall: true,
      reason: `Wave state unclear, but you have ${gold}g and are low. Recalling is likely safe.`,
    };
  }

  if (healthPercent < 0.25) {
    return {
      canRecall: true,
      reason: 'Health is very low. Consider recalling even though wave state is unclear.',
    };
  }

  return {
    canRecall: false,
    reason: 'No clear recall window. Keep farming and look for a good wave state to back.',
  };
}
