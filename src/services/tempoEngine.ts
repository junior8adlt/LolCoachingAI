import type { PlayerInfo, ActivePlayer, Item } from '../types/game';
import type { CoachingTip, TipPriority, TipCategory } from '../types/coaching';
import type { LaneWaveInfo } from './waveEngine';
import type { EnemyCooldowns } from './cooldownTracker';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TempoWindow =
  | 'enemy_dead'         // Enemy laner dead -> free push/roam/objective
  | 'enemy_recalled'     // Enemy backed -> push wave, take plates, roam
  | 'wave_crashed'       // Wave is under enemy tower -> roam/back window
  | 'level_advantage'    // You leveled up first -> trade window
  | 'item_spike'         // You completed item, they haven't -> fight window
  | 'number_advantage'   // More allies alive -> force plays
  | 'summoner_advantage' // Enemy flash/TP down -> exploit window
  | 'none';

export interface TempoState {
  hasAdvantage: boolean;
  window: TempoWindow;
  duration: number;        // How long this window lasts (seconds estimate)
  action: string;          // What to do: "push", "roam", "take plates", "recall", "fight"
  urgency: 'low' | 'medium' | 'high';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum respawn timer to consider it a meaningful tempo window. */
const MIN_RESPAWN_FOR_WINDOW = 10;

/** Approximate base + walk-back duration after an enemy recall. */
const RECALL_WINDOW_DURATION = 25;

/** Duration of a level-advantage trade window (seconds). */
const LEVEL_ADVANTAGE_DURATION = 30;

/** Minimum item price to count as a "completed item" spike. */
const COMPLETED_ITEM_PRICE = 2500;

/** Duration of an item spike window (seconds). */
const ITEM_SPIKE_DURATION = 60;

/** Plate gold per plate, used in action text. */
const PLATE_FALL_TIME = 840; // 14 minutes, plates fall

// ---------------------------------------------------------------------------
// Internal state for recall inference
// ---------------------------------------------------------------------------

interface RecallTracker {
  lastCS: number;
  lastCSTime: number;
  csStaleStart: number;    // game time when CS stopped increasing
  lastItemCount: number;   // number of completed items last check
  lastItemCheckTime: number;
  possibleRecallStart: number; // when we think the recall started
  confirmedRecall: boolean;
  recallEndEstimate: number;   // game time when enemy returns to lane
}

const recallTrackers: Map<string, RecallTracker> = new Map();

function getOrCreateRecallTracker(name: string): RecallTracker {
  let tracker = recallTrackers.get(name);
  if (!tracker) {
    tracker = {
      lastCS: 0,
      lastCSTime: 0,
      csStaleStart: 0,
      lastItemCount: 0,
      lastItemCheckTime: 0,
      possibleRecallStart: 0,
      confirmedRecall: false,
      recallEndEstimate: 0,
    };
    recallTrackers.set(name, tracker);
  }
  return tracker;
}

/** Reset all internal state (call between games). */
export function resetTempoEngine(): void {
  recallTrackers.clear();
  tempoTipCounter = 0;
  lastLevelSnapshot.clear();
}

// ---------------------------------------------------------------------------
// Level tracking
// ---------------------------------------------------------------------------

const lastLevelSnapshot: Map<string, number> = new Map();

// ---------------------------------------------------------------------------
// Tip creation
// ---------------------------------------------------------------------------

let tempoTipCounter = 0;

function createTip(
  message: string,
  priority: TipPriority,
  category: TipCategory,
): CoachingTip {
  tempoTipCounter += 1;
  return {
    id: `tempo-tip-${Date.now()}-${tempoTipCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function countCompletedItems(items: Item[]): number {
  return items.filter((item) => item.price >= COMPLETED_ITEM_PRICE && !item.consumable).length;
}

function countAlive(players: PlayerInfo[]): number {
  return players.filter((p) => !p.isDead).length;
}

function hasFlashOrTP(spells: { summonerSpellOne: { displayName: string }; summonerSpellTwo: { displayName: string } }): { hasFlash: boolean; hasTP: boolean } {
  const s1 = spells.summonerSpellOne.displayName.toLowerCase();
  const s2 = spells.summonerSpellTwo.displayName.toLowerCase();
  return {
    hasFlash: s1.includes('flash') || s1.includes('destello') || s2.includes('flash') || s2.includes('destello'),
    hasTP: s1.includes('teleport') || s1.includes('teleportación') || s2.includes('teleport') || s2.includes('teleportación'),
  };
}

// ---------------------------------------------------------------------------
// Recall inference
// ---------------------------------------------------------------------------

function updateRecallInference(
  opponent: PlayerInfo,
  gameTime: number,
): boolean {
  const tracker = getOrCreateRecallTracker(opponent.summonerName);
  const currentCS = opponent.scores.creepScore;
  const currentItemCount = countCompletedItems(opponent.items);

  // If opponent is dead, they are not recalling
  if (opponent.isDead) {
    tracker.confirmedRecall = false;
    tracker.csStaleStart = 0;
    tracker.lastCS = currentCS;
    tracker.lastCSTime = gameTime;
    tracker.lastItemCount = currentItemCount;
    tracker.lastItemCheckTime = gameTime;
    return false;
  }

  // Track CS staleness: CS not increasing while alive
  if (currentCS > tracker.lastCS) {
    // CS increased, opponent is farming -- not recalling
    tracker.csStaleStart = 0;
    tracker.confirmedRecall = false;
    tracker.lastCS = currentCS;
    tracker.lastCSTime = gameTime;
  } else if (tracker.csStaleStart === 0 && gameTime > tracker.lastCSTime + 2) {
    // CS hasn't increased for a bit, mark the start of staleness
    tracker.csStaleStart = gameTime;
  }

  // Check if enemy has new items after a period of no CS (they backed and bought)
  if (currentItemCount > tracker.lastItemCount && tracker.csStaleStart > 0) {
    const staleDuration = gameTime - tracker.csStaleStart;
    // If CS was stale for 8+ seconds and they have new items, they recalled
    if (staleDuration >= 8) {
      tracker.confirmedRecall = true;
      tracker.possibleRecallStart = tracker.csStaleStart;
      // They just got back (items appeared) -- estimate remaining window
      // Base channel = 8s, walk back ~17s from base to mid-lane
      tracker.recallEndEstimate = gameTime + RECALL_WINDOW_DURATION;
    }
  }

  // Also detect: CS stale for 12+ seconds while alive = likely backing RIGHT NOW
  if (
    tracker.csStaleStart > 0 &&
    !tracker.confirmedRecall &&
    gameTime - tracker.csStaleStart >= 12
  ) {
    tracker.confirmedRecall = true;
    tracker.possibleRecallStart = tracker.csStaleStart;
    tracker.recallEndEstimate = tracker.csStaleStart + 8 + 17; // 8s channel + 17s walk
  }

  // Expire the recall window
  if (tracker.confirmedRecall && gameTime > tracker.recallEndEstimate) {
    tracker.confirmedRecall = false;
    tracker.csStaleStart = 0;
  }

  tracker.lastItemCount = currentItemCount;
  tracker.lastItemCheckTime = gameTime;

  return tracker.confirmedRecall && gameTime <= tracker.recallEndEstimate;
}

function getRecallWindowRemaining(opponentName: string, gameTime: number): number {
  const tracker = recallTrackers.get(opponentName);
  if (!tracker || !tracker.confirmedRecall) return 0;
  return Math.max(0, tracker.recallEndEstimate - gameTime);
}

// ---------------------------------------------------------------------------
// Individual detection functions
// ---------------------------------------------------------------------------

function detectEnemyDead(
  opponent: PlayerInfo,
  gameTime: number,
): TempoState | null {
  if (!opponent.isDead || opponent.respawnTimer < MIN_RESPAWN_FOR_WINDOW) {
    return null;
  }

  const duration = opponent.respawnTimer;
  let action: string;
  let urgency: 'low' | 'medium' | 'high';

  if (duration >= 30) {
    action = gameTime < PLATE_FALL_TIME ? 'push and take plates' : 'push and take objective';
    urgency = 'high';
  } else if (duration >= 20) {
    action = 'push and roam';
    urgency = 'high';
  } else {
    action = 'push wave';
    urgency = 'medium';
  }

  return {
    hasAdvantage: true,
    window: 'enemy_dead',
    duration,
    action,
    urgency,
  };
}

function detectEnemyRecalled(
  opponent: PlayerInfo,
  gameTime: number,
): TempoState | null {
  const isRecalling = updateRecallInference(opponent, gameTime);
  if (!isRecalling) return null;

  const remaining = getRecallWindowRemaining(opponent.summonerName, gameTime);
  if (remaining <= 5) return null; // too short to be useful

  let action: string;
  let urgency: 'low' | 'medium' | 'high';

  if (remaining >= 20) {
    action = gameTime < PLATE_FALL_TIME ? 'push and take plates' : 'push and roam';
    urgency = 'high';
  } else if (remaining >= 12) {
    action = 'push wave';
    urgency = 'medium';
  } else {
    action = 'recall';
    urgency = 'low';
  }

  return {
    hasAdvantage: true,
    window: 'enemy_recalled',
    duration: Math.round(remaining),
    action,
    urgency,
  };
}

function detectWaveCrashed(
  waveState: LaneWaveInfo | undefined,
): TempoState | null {
  if (!waveState) return null;

  const isCrashing =
    waveState.state === 'crashing' ||
    (waveState.state === 'pushing_to_enemy' && waveState.csRate >= 5);

  if (!isCrashing || waveState.confidence < 0.3) return null;

  return {
    hasAdvantage: true,
    window: 'wave_crashed',
    duration: 25, // roughly one wave cycle before it bounces
    action: 'roam or recall',
    urgency: 'medium',
  };
}

function detectLevelAdvantage(
  myPlayer: PlayerInfo,
  activePlayer: ActivePlayer,
  opponent: PlayerInfo,
): TempoState | null {
  const myLevel = activePlayer.level;
  const enemyLevel = opponent.level;

  // No advantage if equal or behind
  if (myLevel <= enemyLevel) {
    lastLevelSnapshot.set(myPlayer.summonerName, myLevel);
    return null;
  }

  // Only trigger on level-UP transitions, not persistent advantages
  const prevLevel = lastLevelSnapshot.get(myPlayer.summonerName) ?? 1;
  lastLevelSnapshot.set(myPlayer.summonerName, myLevel);

  if (myLevel === prevLevel) {
    // Not a fresh level-up; skip unless it's a major spike level
    const majorSpikeLevels = [2, 3, 6, 11, 16];
    if (!majorSpikeLevels.includes(myLevel) || myLevel - enemyLevel < 2) {
      return null;
    }
  }

  const levelDiff = myLevel - enemyLevel;
  let urgency: 'low' | 'medium' | 'high';
  let action: string;

  // Key power spike levels
  const isPowerSpike = myLevel === 2 || myLevel === 3 || myLevel === 6 || myLevel === 11 || myLevel === 16;

  if (isPowerSpike && levelDiff >= 1) {
    urgency = 'high';
    action = myLevel === 6
      ? 'all-in with ultimate advantage'
      : 'fight -- you have a level advantage';
  } else if (levelDiff >= 2) {
    urgency = 'high';
    action = 'fight -- significant level advantage';
  } else {
    urgency = 'medium';
    action = 'trade aggressively';
  }

  return {
    hasAdvantage: true,
    window: 'level_advantage',
    duration: LEVEL_ADVANTAGE_DURATION,
    action,
    urgency,
  };
}

function detectItemSpike(
  myPlayer: PlayerInfo,
  opponent: PlayerInfo,
): TempoState | null {
  const myCompleted = countCompletedItems(myPlayer.items);
  const enemyCompleted = countCompletedItems(opponent.items);

  if (myCompleted <= 0 || myCompleted <= enemyCompleted) return null;

  const itemDiff = myCompleted - enemyCompleted;
  let urgency: 'low' | 'medium' | 'high';

  if (itemDiff >= 2) {
    urgency = 'high';
  } else if (myCompleted === 1 && enemyCompleted === 0) {
    // First completed item is a huge spike
    urgency = 'high';
  } else {
    urgency = 'medium';
  }

  return {
    hasAdvantage: true,
    window: 'item_spike',
    duration: ITEM_SPIKE_DURATION,
    action: 'fight -- you have an item advantage',
    urgency,
  };
}

function detectNumberAdvantage(
  myPlayer: PlayerInfo,
  allPlayers: PlayerInfo[],
): TempoState | null {
  const myTeam = allPlayers.filter((p) => p.team === myPlayer.team);
  const enemyTeam = allPlayers.filter((p) => p.team !== myPlayer.team);

  const aliveAllies = countAlive(myTeam);
  const aliveEnemies = countAlive(enemyTeam);

  if (aliveAllies <= aliveEnemies) return null;

  const advantage = aliveAllies - aliveEnemies;

  // Find the longest enemy respawn timer to estimate the window duration
  const longestRespawn = enemyTeam
    .filter((p) => p.isDead)
    .reduce((max, p) => Math.max(max, p.respawnTimer), 0);

  if (longestRespawn < 5) return null; // too short to capitalize

  let action: string;
  let urgency: 'low' | 'medium' | 'high';

  if (advantage >= 3) {
    action = 'force baron or end the game';
    urgency = 'high';
  } else if (advantage === 2) {
    action = 'force an objective -- dragon, baron, or tower';
    urgency = 'high';
  } else {
    // 1 player advantage
    action = 'look for a pick or pressure an objective';
    urgency = 'medium';
  }

  return {
    hasAdvantage: true,
    window: 'number_advantage',
    duration: Math.round(longestRespawn),
    action,
    urgency,
  };
}

function detectSummonerAdvantage(
  opponent: PlayerInfo,
  cooldowns: EnemyCooldowns | undefined,
  gameTime: number,
): TempoState | null {
  if (!cooldowns) return null;

  const { hasFlash: enemyHasFlash, hasTP: _enemyHasTP } = hasFlashOrTP(opponent.summonerSpells);

  const flashDown = cooldowns.flashDown && enemyHasFlash;
  const ultDown = cooldowns.ultDown;

  if (!flashDown && !ultDown) return null;

  let duration: number;
  let action: string;
  let urgency: 'low' | 'medium' | 'high';

  if (flashDown && ultDown) {
    const flashRemaining = Math.max(0, cooldowns.flashUpTime - gameTime);
    const ultRemaining = Math.max(0, cooldowns.ultUpTime - gameTime);
    duration = Math.min(flashRemaining, ultRemaining); // window lasts until the first one comes back
    action = 'all-in -- enemy has no flash and no ultimate';
    urgency = 'high';
  } else if (flashDown) {
    duration = Math.max(0, cooldowns.flashUpTime - gameTime);
    action = 'look for an engage -- enemy has no flash';
    urgency = 'medium';
  } else {
    // ult down only
    duration = Math.max(0, cooldowns.ultUpTime - gameTime);
    action = 'trade or fight -- enemy ultimate is down';
    urgency = 'medium';
  }

  if (duration <= 5) return null; // too short

  return {
    hasAdvantage: true,
    window: 'summoner_advantage',
    duration: Math.round(duration),
    action,
    urgency,
  };
}

// ---------------------------------------------------------------------------
// Priority ranking for tempo windows
// ---------------------------------------------------------------------------

const WINDOW_PRIORITY: Record<TempoWindow, number> = {
  enemy_dead: 6,
  number_advantage: 5,
  enemy_recalled: 4,
  item_spike: 3,
  level_advantage: 3,
  summoner_advantage: 2,
  wave_crashed: 1,
  none: 0,
};

const URGENCY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function scoreTempo(state: TempoState): number {
  return WINDOW_PRIORITY[state.window] * URGENCY_WEIGHT[state.urgency];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Detect the highest-priority tempo advantage available to the player.
 *
 * @param myPlayer       The player's own PlayerInfo from allPlayers array.
 * @param activePlayer   The ActivePlayer data (level, gold, stats).
 * @param laneOpponent   The lane opponent's PlayerInfo (or null if unknown).
 * @param allPlayers     All players in the game.
 * @param gameTime       Current game time in seconds.
 * @param waveState      Optional current wave state from waveEngine.
 * @param cooldowns      Optional enemy cooldown state from cooldownTracker.
 * @returns The highest-priority TempoState, or a 'none' state if no advantage.
 */
export function detectTempoAdvantage(
  myPlayer: PlayerInfo,
  activePlayer: ActivePlayer,
  laneOpponent: PlayerInfo | null,
  allPlayers: PlayerInfo[],
  gameTime: number,
  waveState?: LaneWaveInfo,
  cooldowns?: EnemyCooldowns,
): TempoState {
  const candidates: TempoState[] = [];

  // If the player is dead, there is no tempo advantage
  if (myPlayer.isDead) {
    return {
      hasAdvantage: false,
      window: 'none',
      duration: 0,
      action: 'wait for respawn',
      urgency: 'low',
    };
  }

  // Lane-opponent-dependent checks
  if (laneOpponent) {
    const enemyDead = detectEnemyDead(laneOpponent, gameTime);
    if (enemyDead) candidates.push(enemyDead);

    const enemyRecalled = detectEnemyRecalled(laneOpponent, gameTime);
    if (enemyRecalled) candidates.push(enemyRecalled);

    const levelAdv = detectLevelAdvantage(myPlayer, activePlayer, laneOpponent);
    if (levelAdv) candidates.push(levelAdv);

    const itemSpike = detectItemSpike(myPlayer, laneOpponent);
    if (itemSpike) candidates.push(itemSpike);

    const summonerAdv = detectSummonerAdvantage(laneOpponent, cooldowns, gameTime);
    if (summonerAdv) candidates.push(summonerAdv);
  }

  // Team-wide checks (always run)
  const numberAdv = detectNumberAdvantage(myPlayer, allPlayers);
  if (numberAdv) candidates.push(numberAdv);

  // Wave state check (always run if data available)
  const waveCrashed = detectWaveCrashed(waveState);
  if (waveCrashed) candidates.push(waveCrashed);

  // No advantages detected
  if (candidates.length === 0) {
    return {
      hasAdvantage: false,
      window: 'none',
      duration: 0,
      action: 'farm and wait for an opening',
      urgency: 'low',
    };
  }

  // Return the highest-priority tempo window
  candidates.sort((a, b) => scoreTempo(b) - scoreTempo(a));
  return candidates[0];
}

/**
 * Generate a coaching tip from a TempoState.
 * Returns null if there is no actionable advantage.
 */
export function generateTempoTip(state: TempoState): CoachingTip | null {
  if (!state.hasAdvantage || state.window === 'none') return null;

  const durationText = state.duration > 0 ? ` (~${state.duration}s window)` : '';

  switch (state.window) {
    case 'enemy_dead': {
      const message =
        state.urgency === 'high'
          ? `Enemy laner is dead${durationText}. ${capitalize(state.action)} now -- don't waste this window!`
          : `Enemy laner is dead${durationText}. ${capitalize(state.action)} before they return.`;
      return createTip(message, state.urgency === 'high' ? 'danger' : 'warning', 'macro');
    }

    case 'enemy_recalled': {
      const message = `Enemy laner has recalled${durationText}. ${capitalize(state.action)} while they walk back.`;
      return createTip(message, 'warning', 'macro');
    }

    case 'wave_crashed': {
      const message = `Wave is crashing into enemy tower${durationText}. Free window to ${state.action}.`;
      return createTip(message, 'info', 'macro');
    }

    case 'level_advantage': {
      const message = `You hit a level power spike${durationText}. ${capitalize(state.action)}!`;
      return createTip(
        message,
        state.urgency === 'high' ? 'danger' : 'warning',
        'trading',
      );
    }

    case 'item_spike': {
      const message = `Item spike advantage${durationText}. ${capitalize(state.action)}.`;
      return createTip(
        message,
        state.urgency === 'high' ? 'danger' : 'warning',
        'trading',
      );
    }

    case 'number_advantage': {
      const message = `Your team has a numbers advantage${durationText}. ${capitalize(state.action)}!`;
      return createTip(
        message,
        state.urgency === 'high' ? 'danger' : 'warning',
        'objective',
      );
    }

    case 'summoner_advantage': {
      const message = `${capitalize(state.action)}${durationText}.`;
      return createTip(message, 'warning', 'trading');
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function capitalize(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
