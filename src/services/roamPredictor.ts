// @ts-nocheck
import type { PlayerInfo, GameEvent } from '../types/game';
import type { CoachingTip } from '../types/coaching';
import { getChampionMeta, type ChampionArchetype } from '../data/championMeta';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoamPrediction {
  champion: string;
  roamLikelihood: number;   // 0-1
  targetLane: 'top' | 'mid' | 'bot' | 'unknown';
  warning: string;
  isGlobalUlt: boolean;     // TF, Galio, Shen, Pantheon, Nocturne
}

interface CSSnapshot {
  champion: string;
  lastCS: number;
  lastCSChangeTime: number;
  position: string;
  team: 'ORDER' | 'CHAOS';
}

interface RoamHistoryEntry {
  champion: string;
  time: number;
  targetLane: 'top' | 'mid' | 'bot' | 'unknown';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Champions with global or semi-global ultimates */
const GLOBAL_ULT_CHAMPIONS: ReadonlySet<string> = new Set([
  'Twisted Fate',
  'Galio',
  'Shen',
  'Pantheon',
  'Nocturne',
  'Ryze',
]);

/** Assassins known for aggressive roaming patterns */
const ROAMING_ASSASSINS: ReadonlySet<string> = new Set([
  'Talon',
  'Katarina',
  'Akali',
  'Zed',
  'Qiyana',
  'LeBlanc',
  'Fizz',
  'Naafiri',
  'Ekko',
  'Diana',
  'Pyke',
]);

/** How many seconds of no CS change before we flag a potential roam */
const CS_STALL_THRESHOLD_SECONDS = 15;

/** Minimum polls (at ~1.5s each) with no CS increase to consider a stall */
const CS_STALL_MIN_POLLS = 3;

/** Level threshold for global ult warnings */
const GLOBAL_ULT_LEVEL = 6;

/** Game time (seconds) after which roaming becomes common */
const ROAM_WINDOW_START = 360; // 6 minutes

/** Approximate gold value of a completed first item */
const FIRST_ITEM_GOLD_THRESHOLD = 2600;

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

/** Tracks last-known CS for each enemy laner */
let csTracking: Map<string, CSSnapshot> = new Map();

/** History of confirmed roams (from kill/assist events) */
let roamHistory: RoamHistoryEntry[] = [];

/** Set of event IDs we have already processed */
let processedEventIds: Set<number> = new Set();

/** Tracks whether we already warned about a global ult champion hitting 6 */
let globalUltWarned: Set<string> = new Set();

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Determine if a champion is considered a "laner" (top/mid/bot) rather than
 * jungle or support.  The Riot Live Client position field uses values like
 * "TOP", "MIDDLE", "BOTTOM", "JUNGLE", "UTILITY".
 */
function isLaner(position: string): boolean {
  const p = position.toUpperCase();
  return p === 'TOP' || p === 'MIDDLE' || p === 'BOTTOM';
}

/**
 * Normalise Riot position strings into our lane union type.
 */
function normaliseLane(position: string): 'top' | 'mid' | 'bot' | 'unknown' {
  const p = position.toUpperCase();
  if (p === 'TOP') return 'top';
  if (p === 'MIDDLE') return 'mid';
  if (p === 'BOTTOM') return 'bot';
  return 'unknown';
}

/**
 * Return the lane that is most likely the target of a roam originating from
 * `sourceLane`.  Mid roams to bot more often, top roams mid, etc.
 */
function likelyRoamTarget(
  sourceLane: 'top' | 'mid' | 'bot' | 'unknown',
): 'top' | 'mid' | 'bot' | 'unknown' {
  switch (sourceLane) {
    case 'mid':
      return 'bot'; // mid-to-bot is statistically most common
    case 'top':
      return 'mid';
    case 'bot':
      return 'mid';
    default:
      return 'unknown';
  }
}

/**
 * Determine if a player has completed what looks like a first item based on
 * their inventory.  We look for any non-consumable, non-component item that
 * costs 2600+ gold.
 */
function hasCompletedFirstItem(player: PlayerInfo): boolean {
  return player.items.some(
    (item) => !item.consumable && item.price >= FIRST_ITEM_GOLD_THRESHOLD,
  );
}

/**
 * Check if a player has boots (any tier).
 */
function hasBoots(player: PlayerInfo): boolean {
  const bootsKeywords = ['boots', 'greaves', 'treads', 'swiftness', 'lucidity', 'plated', 'sorcerer'];
  return player.items.some((item) => {
    const name = item.displayName.toLowerCase();
    return bootsKeywords.some((kw) => name.includes(kw));
  });
}

/**
 * Check if a champion's archetypes include 'assassin'.
 */
function isAssassinArchetype(championName: string): boolean {
  const meta = getChampionMeta(championName);
  if (!meta) return false;
  return (meta.archetypes as ChampionArchetype[]).includes('assassin');
}

/**
 * Calculate the roam frequency score for a champion based on how many
 * confirmed roams they have in history, weighted by recency.
 */
function roamFrequencyScore(champion: string, gameTime: number): number {
  const entries = roamHistory.filter((e) => e.champion === champion);
  if (entries.length === 0) return 0;

  let score = 0;
  for (const entry of entries) {
    const age = gameTime - entry.time;
    // Recent roams weigh more; decay over 5 minutes
    const weight = Math.max(0, 1 - age / 300);
    score += 0.15 + 0.15 * weight;
  }
  return Math.min(score, 0.4); // cap contribution at 0.4
}

/**
 * Infer which lane a kill event occurred in by looking at the victim's
 * position (if they are in allPlayers).
 */
function inferKillLane(
  victimName: string,
  allPlayers: PlayerInfo[],
): 'top' | 'mid' | 'bot' | 'unknown' {
  const victim = allPlayers.find((p) => p.summonerName === victimName);
  if (!victim) return 'unknown';
  return normaliseLane(victim.position);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Call every poll cycle (~1.5s) with the latest game state.
 *
 * Updates internal CS tracking and processes new kill/assist events to detect
 * confirmed roams.
 */
export function updateRoamTracking(
  allPlayers: PlayerInfo[],
  events: GameEvent[],
  gameTime: number,
): void {
  // --- 1. Update CS snapshots for every enemy laner ---
  for (const player of allPlayers) {
    if (!isLaner(player.position)) continue;

    const existing = csTracking.get(player.championName);
    const currentCS = player.scores.creepScore;

    if (!existing) {
      csTracking.set(player.championName, {
        champion: player.championName,
        lastCS: currentCS,
        lastCSChangeTime: gameTime,
        position: player.position,
        team: player.team,
      });
    } else {
      // Update position/team in case the data shifts
      existing.position = player.position;
      existing.team = player.team;

      if (currentCS > existing.lastCS) {
        existing.lastCS = currentCS;
        existing.lastCSChangeTime = gameTime;
      }
    }
  }

  // --- 2. Process new kill/assist events to detect confirmed roams ---
  for (const event of events) {
    if (processedEventIds.has(event.EventID)) continue;
    processedEventIds.add(event.EventID);

    if (event.EventName !== 'ChampionKill') continue;

    const killLane = inferKillLane(event.VictimName ?? '', allPlayers);
    if (killLane === 'unknown') continue;

    // Check killer
    if (event.KillerName) {
      const killer = allPlayers.find((p) => p.summonerName === event.KillerName);
      if (killer && isLaner(killer.position)) {
        const killerLane = normaliseLane(killer.position);
        if (killerLane !== killLane) {
          // Killer appeared in a lane that is not their own -> confirmed roam
          roamHistory.push({
            champion: killer.championName,
            time: event.EventTime,
            targetLane: killLane,
          });
        }
      }
    }

    // Check assisters
    if (event.Assisters) {
      for (const assisterName of event.Assisters) {
        const assister = allPlayers.find((p) => p.summonerName === assisterName);
        if (assister && isLaner(assister.position)) {
          const assisterLane = normaliseLane(assister.position);
          if (assisterLane !== killLane) {
            roamHistory.push({
              champion: assister.championName,
              time: event.EventTime,
              targetLane: killLane,
            });
          }
        }
      }
    }
  }
}

/**
 * Evaluate the current roam threat for each enemy laner relative to the
 * player's own position and return a sorted list of predictions.
 */
export function getRoamPredictions(
  myPlayer: PlayerInfo,
  gameTime: number,
): RoamPrediction[] {
  const predictions: RoamPrediction[] = [];
  const myTeam = myPlayer.team;

  for (const [championName, snapshot] of csTracking.entries()) {
    // Only evaluate enemies
    if (snapshot.team === myTeam) continue;

    // We need the full player object for deeper checks
    // (caller should have called updateRoamTracking first so csTracking is fresh)
    // Reconstruct a lightweight check from snapshot + known data

    let likelihood = 0;
    let targetLane: 'top' | 'mid' | 'bot' | 'unknown' = 'unknown';
    const isGlobal = GLOBAL_ULT_CHAMPIONS.has(championName);
    const isRoamingAssassin = ROAMING_ASSASSINS.has(championName);
    const sourceLane = normaliseLane(snapshot.position);

    // ---- CS stall detection ----
    const csStalledSeconds = gameTime - snapshot.lastCSChangeTime;
    const csStalledPolls = csStalledSeconds / 1.5;

    if (
      csStalledSeconds >= CS_STALL_THRESHOLD_SECONDS &&
      csStalledPolls >= CS_STALL_MIN_POLLS
    ) {
      // Significant CS stall -> strong roam indicator
      // Scale from 0.3 at threshold to 0.6 at 30s
      const stallFactor = Math.min(
        0.6,
        0.3 + 0.3 * ((csStalledSeconds - CS_STALL_THRESHOLD_SECONDS) / 15),
      );
      likelihood += stallFactor;
      targetLane = likelyRoamTarget(sourceLane);
    }

    // ---- Global ult check ----
    if (isGlobal) {
      // We don't have the player's level here directly from csTracking, but
      // the warning system will mark them regardless because their ult is
      // always a threat once we know they exist in csTracking.
      // We add a baseline threat.
      likelihood += 0.25;
      targetLane = normaliseLane(myPlayer.position); // global can hit anyone
    }

    // ---- Assassin roaming pattern ----
    if (isRoamingAssassin || isAssassinArchetype(championName)) {
      likelihood += 0.1;
      // After first item, assassins roam much more
      // We cannot check items from snapshot alone; this is a baseline bump.
    }

    // ---- Game time factor ----
    if (gameTime >= ROAM_WINDOW_START) {
      likelihood += 0.05;
    }

    // ---- Roam history ----
    likelihood += roamFrequencyScore(championName, gameTime);

    // Clamp to [0, 1]
    likelihood = Math.min(1, Math.max(0, likelihood));

    // Only surface if there's a meaningful threat
    if (likelihood < 0.15) continue;

    // Build warning string
    const warning = buildWarningString(
      championName,
      sourceLane,
      targetLane,
      likelihood,
      isGlobal,
      csStalledSeconds >= CS_STALL_THRESHOLD_SECONDS,
    );

    predictions.push({
      champion: championName,
      roamLikelihood: Math.round(likelihood * 100) / 100,
      targetLane,
      warning,
      isGlobalUlt: isGlobal,
    });
  }

  // Sort by likelihood descending
  predictions.sort((a, b) => b.roamLikelihood - a.roamLikelihood);
  return predictions;
}

/**
 * Enriched version that also factors in the player object's live items/level
 * for more precise scoring.  Call this after updateRoamTracking with the full
 * allPlayers list available.
 */
export function getRoamPredictionsEnriched(
  myPlayer: PlayerInfo,
  allPlayers: PlayerInfo[],
  gameTime: number,
): RoamPrediction[] {
  const predictions: RoamPrediction[] = [];
  const myTeam = myPlayer.team;

  for (const player of allPlayers) {
    if (player.team === myTeam) continue;
    if (!isLaner(player.position)) continue;
    if (player.isDead) continue;

    const championName = player.championName;
    const snapshot = csTracking.get(championName);
    const isGlobal = GLOBAL_ULT_CHAMPIONS.has(championName);
    const isRoamingAssassin = ROAMING_ASSASSINS.has(championName);
    const sourceLane = normaliseLane(player.position);

    let likelihood = 0;
    let targetLane: 'top' | 'mid' | 'bot' | 'unknown' = 'unknown';

    // ---- CS stall detection ----
    if (snapshot) {
      const csStalledSeconds = gameTime - snapshot.lastCSChangeTime;
      const csStalledPolls = csStalledSeconds / 1.5;

      if (
        csStalledSeconds >= CS_STALL_THRESHOLD_SECONDS &&
        csStalledPolls >= CS_STALL_MIN_POLLS
      ) {
        const stallFactor = Math.min(
          0.6,
          0.3 + 0.3 * ((csStalledSeconds - CS_STALL_THRESHOLD_SECONDS) / 15),
        );
        likelihood += stallFactor;
        targetLane = likelyRoamTarget(sourceLane);
      }
    }

    // ---- Global ult at level 6+ ----
    if (isGlobal && player.level >= GLOBAL_ULT_LEVEL) {
      likelihood += 0.3;
      targetLane = normaliseLane(myPlayer.position);
    }

    // ---- Assassin roaming pattern ----
    if (isRoamingAssassin || isAssassinArchetype(championName)) {
      let assassinBonus = 0.1;

      if (hasCompletedFirstItem(player)) {
        assassinBonus += 0.15; // power spike roam
      }

      if (player.scores.kills > 0) {
        // They have kill momentum
        assassinBonus += 0.1;
      }

      likelihood += assassinBonus;
    }

    // ---- Boots factor (faster roams) ----
    if (hasBoots(player)) {
      likelihood += 0.05;
    }

    // ---- Game time factor ----
    if (gameTime >= ROAM_WINDOW_START) {
      likelihood += 0.05;
    }
    if (player.level >= GLOBAL_ULT_LEVEL && !isGlobal) {
      // Post-6 non-global champs also roam more
      likelihood += 0.05;
    }

    // ---- Roam history ----
    likelihood += roamFrequencyScore(championName, gameTime);

    // Clamp
    likelihood = Math.min(1, Math.max(0, likelihood));

    if (likelihood < 0.15) continue;

    const csStalledSeconds = snapshot
      ? gameTime - snapshot.lastCSChangeTime
      : 0;

    const warning = buildWarningString(
      championName,
      sourceLane,
      targetLane,
      likelihood,
      isGlobal && player.level >= GLOBAL_ULT_LEVEL,
      csStalledSeconds >= CS_STALL_THRESHOLD_SECONDS,
    );

    predictions.push({
      champion: championName,
      roamLikelihood: Math.round(likelihood * 100) / 100,
      targetLane,
      warning,
      isGlobalUlt: isGlobal,
    });
  }

  predictions.sort((a, b) => b.roamLikelihood - a.roamLikelihood);
  return predictions;
}

/**
 * Convert a RoamPrediction into a CoachingTip suitable for the overlay.
 * Returns null if the prediction does not warrant a tip.
 */
export function generateRoamTip(prediction: RoamPrediction): CoachingTip | null {
  if (prediction.roamLikelihood < 0.25) return null;

  const priority =
    prediction.roamLikelihood >= 0.6
      ? 'danger'
      : prediction.roamLikelihood >= 0.4
        ? 'warning'
        : 'info';

  return {
    id: `roam-${prediction.champion}-${Date.now()}`,
    message: prediction.warning,
    priority,
    category: 'macro',
    timestamp: Date.now(),
    dismissed: false,
  };
}

/**
 * Reset all internal state.  Call between games.
 */
export function resetRoamPredictor(): void {
  csTracking = new Map();
  roamHistory = [];
  processedEventIds = new Set();
  globalUltWarned = new Set();
}

// ---------------------------------------------------------------------------
// Warning string builder
// ---------------------------------------------------------------------------

function buildWarningString(
  champion: string,
  sourceLane: 'top' | 'mid' | 'bot' | 'unknown',
  targetLane: 'top' | 'mid' | 'bot' | 'unknown',
  likelihood: number,
  isGlobalUltActive: boolean,
  csStalled: boolean,
): string {
  const laneLabel = sourceLane === 'unknown' ? 'lane' : sourceLane;
  const targetLabel = targetLane === 'unknown' ? '' : ` Play safe ${targetLane}.`;

  // Global ult champions get a special message
  if (isGlobalUltActive) {
    return getGlobalUltWarning(champion);
  }

  // Confirmed frequent roamer
  const historyCount = roamHistory.filter((e) => e.champion === champion).length;
  if (historyCount >= 2) {
    return `${champion} is a repeat roamer (${historyCount} confirmed). Expect another roam.${targetLabel}`;
  }

  // Kill momentum roam
  if (likelihood >= 0.6 && !csStalled) {
    return `${champion} got a kill and is missing. Likely roaming with the lead.${targetLabel}`;
  }

  // CS stall-based missing
  if (csStalled) {
    return `Enemy ${champion} missing from ${laneLabel}. CS stopped increasing.${targetLabel}`;
  }

  // Assassin generic
  if (ROAMING_ASSASSINS.has(champion) || isAssassinArchetype(champion)) {
    return `${champion} may be looking to roam from ${laneLabel}.${targetLabel}`;
  }

  // Fallback
  return `${champion} could be roaming from ${laneLabel}. Stay alert.${targetLabel}`;
}

function getGlobalUltWarning(champion: string): string {
  switch (champion) {
    case 'Twisted Fate':
      return 'TF hit level 6. He can ult anywhere. Respect his global pressure.';
    case 'Galio':
      return 'Galio has his ultimate. He can fly to any ally across the map. Be cautious of enemy engages.';
    case 'Shen':
      return 'Shen has Stand United. He can ult to any ally instantly. Do not commit to fights without tracking him.';
    case 'Pantheon':
      return 'Pantheon has Grand Starfall. He can drop on any lane. Watch for him going missing.';
    case 'Nocturne':
      return 'Nocturne has Paranoia. When your screen goes dark, back off immediately.';
    case 'Ryze':
      return 'Ryze has Realm Warp. He can portal his entire team. Watch for grouped movements.';
    default:
      return `${champion} has a global ultimate. Stay aware of the map.`;
  }
}
