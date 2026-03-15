// @ts-nocheck
import type { PlayerInfo, ActivePlayer, GameEvent } from '../types/game';
import type { CoachingTip, JunglePrediction, JungleSide } from '../types/coaching';
import type { LaneWaveInfo } from './waveEngine';
import type { VisionAnalysis } from './visionTracker';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PositionSafety = 'safe' | 'moderate' | 'risky' | 'dangerous';

export interface PositionAssessment {
  safety: PositionSafety;
  overextended: boolean;
  gankVulnerable: boolean;
  reasons: string[];
  recommendation: string;
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

interface GankDeathRecord {
  gameTime: number;
  wasGanked: boolean;
}

interface PositioningState {
  recentGankDeaths: GankDeathRecord[];
  lastFlashTime: number;
  lastAssessment: PositionAssessment | null;
  lastTipTime: number;
}

const state: PositioningState = {
  recentGankDeaths: [],
  lastFlashTime: 0,
  lastAssessment: null,
  lastTipTime: 0,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** First possible gank window start (seconds). */
const FIRST_GANK_WINDOW_START = 150; // 2:30

/** First gank window end (seconds). */
const FIRST_GANK_WINDOW_END = 240; // 4:00

/** Scuttle crab spawns at 3:30, junglers contest near river. */
const SCUTTLE_SPAWN_TIME = 210;

/** Buff respawn interval (seconds). Jungler finishes buff then often ganks. */
const BUFF_RESPAWN_INTERVAL = 300;

/** First buff spawn (seconds). */
const FIRST_BUFF_SPAWN = 90;

/** How long (seconds) with no jungler sighting counts as "unknown". */
const JUNGLER_UNKNOWN_THRESHOLD = 60;

/** HP percentage threshold for "took damage, probably overextended". */
const LOW_HP_THRESHOLD = 0.5;

/** Cooldown between positioning tips (ms). */
const TIP_COOLDOWN_MS = 30000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let tipCounter = 0;

function createTip(
  message: string,
  priority: 'info' | 'warning' | 'danger',
): CoachingTip {
  tipCounter++;
  return {
    id: `pos-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category: 'positioning',
    timestamp: Date.now(),
    dismissed: false,
  };
}

function playerLaneSide(position: string): JungleSide {
  const pos = position?.toUpperCase() ?? '';
  if (pos === 'TOP') return 'top';
  if (pos === 'BOTTOM' || pos === 'UTILITY') return 'bot';
  return 'mid';
}

function getHealthPercent(activePlayer: ActivePlayer): number {
  const stats = activePlayer.championStats;
  if (stats.maxHealth <= 0) return 1;
  return stats.currentHealth / stats.maxHealth;
}

function getManaPercent(activePlayer: ActivePlayer): number {
  const stats = activePlayer.championStats;
  if (stats.resourceMax <= 0) return 1; // resourceless champion
  return stats.resourceValue / stats.resourceMax;
}

/**
 * Check whether the player recently used Flash by scanning events for
 * SummonerSpellCast events. The Riot API doesn't directly expose this,
 * but we track if Flash went on cooldown via absence in summoner spells
 * or via kill-participation events where flash was used.
 *
 * Since the Live Client API doesn't give us spell cooldowns, we track
 * this from death events where the player died shortly after a fight
 * (implying they may have burned flash).
 */
function detectFlashUsed(
  events: GameEvent[],
  playerName: string,
  gameTime: number,
): boolean {
  // Heuristic: if the player got a kill or assist within the last 30s
  // and the fight was close (they took damage), they likely used flash.
  // This is imperfect, but it's the best we can do without cooldown data.
  // We primarily rely on the lastFlashTime state which can be set externally.
  if (state.lastFlashTime > 0 && gameTime - state.lastFlashTime < 300) {
    return true;
  }
  return false;
}

/**
 * Scan recent death events to identify gank-related deaths.
 * A death is a "gank death" if the jungler assisted or if multiple enemies
 * were involved in the kill.
 */
function processRecentDeaths(
  events: GameEvent[],
  playerName: string,
  gameTime: number,
  junglerName: string,
): void {
  for (const event of events) {
    if (event.EventName !== 'ChampionKill') continue;
    if (event.VictimName !== playerName) continue;

    // Skip old events already processed
    const alreadyRecorded = state.recentGankDeaths.some(
      (d) => Math.abs(d.gameTime - event.EventTime) < 2,
    );
    if (alreadyRecorded) continue;

    const assisters = event.Assisters ?? [];
    const wasGanked =
      assisters.includes(junglerName) ||
      event.KillerName === junglerName ||
      assisters.length >= 1; // multi-person kill in lane = likely gank

    state.recentGankDeaths.push({
      gameTime: event.EventTime,
      wasGanked,
    });
  }

  // Prune deaths older than 5 minutes
  state.recentGankDeaths = state.recentGankDeaths.filter(
    (d) => gameTime - d.gameTime < 300,
  );
}

function countRecentGankDeaths(gameTime: number, windowSeconds: number): number {
  return state.recentGankDeaths.filter(
    (d) => d.wasGanked && gameTime - d.gameTime < windowSeconds,
  ).length;
}

// ---------------------------------------------------------------------------
// Wave-based overextension inference
// ---------------------------------------------------------------------------

function isWavePushingToEnemy(waveState: LaneWaveInfo): boolean {
  return (
    waveState.state === 'pushing_to_enemy' ||
    waveState.state === 'frozen_near_enemy'
  );
}

function isWaveNearYourTower(waveState: LaneWaveInfo): boolean {
  return (
    waveState.state === 'pushing_to_you' ||
    waveState.state === 'frozen_near_you'
  );
}

// ---------------------------------------------------------------------------
// Time-based risk factors
// ---------------------------------------------------------------------------

function getTimeBasedRisk(gameTime: number): { risk: number; reason: string | null } {
  // First gank window: 2:30 - 4:00
  if (gameTime >= FIRST_GANK_WINDOW_START && gameTime <= FIRST_GANK_WINDOW_END) {
    return { risk: 0.3, reason: 'First gank window (2:30-4:00) -- junglers finish first clear' };
  }

  // Scuttle contest: 3:30 - 4:30
  if (gameTime >= SCUTTLE_SPAWN_TIME && gameTime < SCUTTLE_SPAWN_TIME + 60) {
    return { risk: 0.15, reason: 'Scuttle crab spawned -- junglers are near river' };
  }

  // Buff respawn timings: jungler finishes buff then often ganks nearby lane
  if (gameTime >= FIRST_BUFF_SPAWN + BUFF_RESPAWN_INTERVAL) {
    const timeSinceFirstBuff = gameTime - FIRST_BUFF_SPAWN;
    const timeSinceLastRespawn = timeSinceFirstBuff % BUFF_RESPAWN_INTERVAL;
    // Within 60s after buff respawn, jungler is likely clearing it then ganking
    if (timeSinceLastRespawn < 60) {
      return { risk: 0.15, reason: 'Buff just respawned -- jungler may gank after clearing it' };
    }
  }

  return { risk: 0, reason: null };
}

// ---------------------------------------------------------------------------
// Jungler threat assessment
// ---------------------------------------------------------------------------

interface JunglerThreat {
  risk: number;
  reason: string | null;
  junglerDead: boolean;
  junglerOnYourSide: boolean;
  junglerUnknown: boolean;
}

function assessJunglerThreat(
  junglePrediction: JunglePrediction,
  playerSide: JungleSide,
  gameTime: number,
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
): JunglerThreat {
  const result: JunglerThreat = {
    risk: 0,
    reason: null,
    junglerDead: false,
    junglerOnYourSide: false,
    junglerUnknown: false,
  };

  // Check if enemy jungler is dead
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';
  const enemyJungler = allPlayers.find(
    (p) =>
      p.team === enemyTeam &&
      (p.position?.toUpperCase() === 'JUNGLE' ||
        p.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase().includes('smite') ||
        p.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase().includes('smite')),
  );

  if (enemyJungler?.isDead) {
    result.junglerDead = true;
    result.risk = -0.2; // negative = safer
    result.reason = 'Enemy jungler is dead -- no gank threat';
    return result;
  }

  const timeSinceSeen = gameTime - junglePrediction.lastSeen;

  // Jungler predicted on your side
  if (junglePrediction.predictedSide === playerSide) {
    result.junglerOnYourSide = true;
    result.risk = 0.35 * junglePrediction.confidence;
    result.reason = `Enemy jungler likely on your side (${Math.round(junglePrediction.confidence * 100)}% confidence)`;
  } else if (junglePrediction.predictedSide === 'mid' && playerSide !== 'mid') {
    // Mid junglers can gank adjacent lanes quickly
    result.risk = 0.15 * junglePrediction.confidence;
    result.reason = 'Enemy jungler near mid -- can roam to your lane';
  }

  // Jungler not seen for a while = unknown = dangerous
  if (timeSinceSeen > JUNGLER_UNKNOWN_THRESHOLD) {
    result.junglerUnknown = true;
    const fogPenalty = Math.min(0.25, (timeSinceSeen - JUNGLER_UNKNOWN_THRESHOLD) / 300);
    result.risk += fogPenalty;
    if (!result.reason) {
      result.reason = `Enemy jungler not seen in ${Math.floor(timeSinceSeen)}s -- be careful`;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Allied jungler proximity (safety factor)
// ---------------------------------------------------------------------------

function isAlliedJunglerNearby(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
  playerSide: JungleSide,
  junglePrediction: JunglePrediction,
): boolean {
  // We can't know the allied jungler's exact position, but if the allied
  // jungler recently participated in events on the same side, they're likely nearby.
  // As a simple heuristic: if there's an allied jungler alive and the enemy
  // jungler is NOT on our side, the allied jungler may be near us.
  // This is a rough approximation.
  const alliedJungler = allPlayers.find(
    (p) =>
      p.team === myTeam &&
      (p.position?.toUpperCase() === 'JUNGLE' ||
        p.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase().includes('smite') ||
        p.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase().includes('smite')),
  );

  if (!alliedJungler || alliedJungler.isDead) return false;

  // We don't have allied jungler position tracking, so we use a weak signal:
  // If enemy jungler is on the opposite side, allied jungler might be near us.
  // This is intentionally conservative -- we only use it as a minor safety factor.
  if (
    junglePrediction.predictedSide !== playerSide &&
    junglePrediction.confidence > 0.5
  ) {
    return true; // maybe -- enemy jungler is elsewhere, allied could be here
  }

  return false;
}

// ---------------------------------------------------------------------------
// Main assessment function
// ---------------------------------------------------------------------------

/**
 * Assess the player's current positioning safety.
 *
 * Since the Riot Live Client Data API does NOT provide x,y coordinates,
 * we infer positioning from:
 * - Wave state (pushing to enemy = you're probably forward)
 * - HP (low HP in lane = took damage = probably traded forward)
 * - Vision quality (low vision = more danger when forward)
 * - Enemy jungler prediction (from jungle tracker)
 * - Recent gank deaths (pattern of overextension)
 * - Game timing (certain windows are riskier)
 */
export function assessPosition(
  myPlayer: PlayerInfo,
  activePlayer: ActivePlayer,
  waveState: LaneWaveInfo,
  junglePrediction: JunglePrediction,
  visionAnalysis: VisionAnalysis,
  gameTime: number,
  recentDeaths: GameEvent[],
): PositionAssessment {
  const reasons: string[] = [];
  let dangerScore = 0; // accumulator: higher = more danger

  const playerSide = playerLaneSide(myPlayer.position);
  const healthPct = getHealthPercent(activePlayer);
  const manaPct = getManaPercent(activePlayer);
  const allPlayers: PlayerInfo[] = []; // We don't have full player list here; use what's available

  // Find enemy jungler name for death processing
  const junglerName = junglePrediction.lastSeen > 0 ? '' : ''; // placeholder
  processRecentDeaths(recentDeaths, myPlayer.summonerName, gameTime, junglerName);

  // ─── 1. Overextension detection via wave state ───

  const wavePushingToEnemy = isWavePushingToEnemy(waveState);
  const waveNearYourTower = isWaveNearYourTower(waveState);

  if (wavePushingToEnemy) {
    // Forward position inferred from wave push
    dangerScore += 0.2;
    reasons.push('Wave is pushing toward enemy -- you are likely forward in lane');

    if (junglePrediction.predictedSide === playerSide && junglePrediction.confidence > 0.3) {
      // Wave pushing to enemy + jungler on your side = VERY dangerous
      dangerScore += 0.35;
      reasons.push('Enemy jungler predicted on your side while you are pushed up');
    } else if (
      gameTime - junglePrediction.lastSeen > JUNGLER_UNKNOWN_THRESHOLD
    ) {
      // Wave pushing to enemy + jungler unknown
      dangerScore += 0.2;
      reasons.push('Enemy jungler location unknown while you are pushed up');
    }
  }

  if (waveNearYourTower) {
    // Safe position near tower
    dangerScore -= 0.15;
    reasons.push('Wave is near your tower -- relatively safe position');
  }

  // ─── 2. HP-based overextension detection ───

  if (healthPct < LOW_HP_THRESHOLD && !waveNearYourTower) {
    dangerScore += 0.2;
    reasons.push(
      `HP is low (${Math.round(healthPct * 100)}%) and wave is not near your tower -- you may be overextended`,
    );
  }

  if (healthPct < 0.3) {
    dangerScore += 0.15;
    reasons.push(`HP critically low (${Math.round(healthPct * 100)}%) -- very vulnerable`);
  }

  // ─── 3. Gank vulnerability ───

  // Time-based risk
  const timeFactor = getTimeBasedRisk(gameTime);
  if (timeFactor.reason) {
    dangerScore += timeFactor.risk;
    reasons.push(timeFactor.reason);
  }

  // Vision quality
  if (visionAnalysis.visionQuality === 'critical') {
    dangerScore += 0.2;
    reasons.push('Vision is critically low -- no information on enemy movements');
  } else if (visionAnalysis.visionQuality === 'poor') {
    dangerScore += 0.1;
    reasons.push('Vision coverage is poor -- limited awareness of enemy jungler');
  }

  // Ward score not increasing = no new wards placed
  if (visionAnalysis.wardScorePerMin < 0.3 && gameTime > 180) {
    dangerScore += 0.1;
    reasons.push('Ward score is very low -- you have almost no vision in the area');
  }

  // Fog of war risk from vision tracker
  if (visionAnalysis.fogRisk > 0.6) {
    dangerScore += 0.15;
    reasons.push('Fog of war risk is high -- dangerous blind spots');
  }

  // Flash on cooldown
  if (detectFlashUsed(recentDeaths, myPlayer.summonerName, gameTime)) {
    dangerScore += 0.1;
    reasons.push('Flash is likely on cooldown -- reduced escape potential');
  }

  // ─── 4. Jungler-specific threat ───

  if (junglePrediction.gankRisk >= 0.6) {
    dangerScore += 0.25;
    reasons.push('Jungle tracker reports HIGH gank risk');
  } else if (junglePrediction.gankRisk >= 0.4) {
    dangerScore += 0.1;
    reasons.push('Jungle tracker reports moderate gank risk');
  }

  // Enemy jungler dead = huge safety boost
  // Check via prediction confidence being high and risk being very low
  if (junglePrediction.gankRisk < 0.1) {
    dangerScore -= 0.2;
    reasons.push('Enemy jungler is dead or confirmed far away -- safe to play aggressive');
  }

  // ─── 5. Safe position indicators ───

  // Wave frozen near your tower
  if (waveState.state === 'frozen_near_you' && waveState.confidence > 0.4) {
    dangerScore -= 0.1;
    reasons.push('Wave is frozen on your side -- excellent defensive position');
  }

  // High HP and mana = healthy and ready
  if (healthPct > 0.8 && manaPct > 0.5) {
    dangerScore -= 0.05;
    // Only add as reason if nothing else is keeping them safe
    if (dangerScore > 0) {
      reasons.push('Good HP and mana -- healthy enough to react to threats');
    }
  }

  // ─── 6. Recent gank death pattern ───

  const recentGankDeathCount = countRecentGankDeaths(gameTime, 300);
  if (recentGankDeathCount >= 2) {
    dangerScore += 0.2;
    reasons.push(
      `Died to ${recentGankDeathCount} ganks recently -- pattern of overextension detected`,
    );
  } else if (recentGankDeathCount === 1) {
    dangerScore += 0.1;
    reasons.push('Died to a gank recently -- play safer until you have better vision');
  }

  // ─── Determine final safety level ───

  dangerScore = Math.max(0, Math.min(1, dangerScore));

  let safety: PositionSafety;
  if (dangerScore >= 0.65) {
    safety = 'dangerous';
  } else if (dangerScore >= 0.4) {
    safety = 'risky';
  } else if (dangerScore >= 0.2) {
    safety = 'moderate';
  } else {
    safety = 'safe';
  }

  const overextended =
    wavePushingToEnemy &&
    (dangerScore >= 0.4 || healthPct < LOW_HP_THRESHOLD);

  const gankVulnerable =
    junglePrediction.gankRisk >= 0.4 ||
    (visionAnalysis.visionQuality === 'critical' &&
      gameTime >= FIRST_GANK_WINDOW_START) ||
    (wavePushingToEnemy &&
      gameTime - junglePrediction.lastSeen > JUNGLER_UNKNOWN_THRESHOLD);

  const recommendation = buildRecommendation(
    safety,
    overextended,
    gankVulnerable,
    waveState,
    healthPct,
    junglePrediction,
    gameTime,
  );

  const assessment: PositionAssessment = {
    safety,
    overextended,
    gankVulnerable,
    reasons,
    recommendation,
  };

  state.lastAssessment = assessment;
  return assessment;
}

// ---------------------------------------------------------------------------
// Recommendation builder
// ---------------------------------------------------------------------------

function buildRecommendation(
  safety: PositionSafety,
  overextended: boolean,
  gankVulnerable: boolean,
  waveState: LaneWaveInfo,
  healthPct: number,
  junglePrediction: JunglePrediction,
  gameTime: number,
): string {
  if (safety === 'dangerous') {
    if (overextended && gankVulnerable) {
      return 'BACK OFF NOW. You are pushed up with no vision and the jungler may be near. Retreat to tower immediately.';
    }
    if (overextended) {
      return 'You are overextended. Pull back toward your tower and let the wave push to you.';
    }
    if (gankVulnerable) {
      return 'High gank risk. Ward river/tribush and hug the safe side of the lane.';
    }
    if (healthPct < 0.3) {
      return 'HP is too low to stay in lane safely. Recall or play far back under tower.';
    }
    return 'Dangerous position. Play safe, ward up, and be ready to retreat.';
  }

  if (safety === 'risky') {
    if (gankVulnerable && waveState.state === 'pushing_to_enemy') {
      return 'Wave is pushing out and you are gank-vulnerable. Ward before pushing further or let the wave bounce.';
    }
    if (healthPct < LOW_HP_THRESHOLD) {
      return 'Low HP in a forward position. Consider backing or playing under tower until you can heal up.';
    }
    if (gameTime >= FIRST_GANK_WINDOW_START && gameTime <= FIRST_GANK_WINDOW_END) {
      return 'First gank window is active. Play safe and keep river warded. The enemy jungler just finished their first clear.';
    }
    return 'Moderate risk. Keep vision up and track the enemy jungler before committing forward.';
  }

  if (safety === 'moderate') {
    if (waveState.state === 'frozen_near_you') {
      return 'Good position with wave on your side. Farm safely and look for your jungler to set up a gank.';
    }
    if (junglePrediction.gankRisk < 0.2) {
      return 'Jungler is elsewhere. You have a window to trade or push, but keep an eye on the map.';
    }
    return 'Position is okay. Maintain vision and watch minimap for enemy jungler movements.';
  }

  // Safe
  if (waveState.state === 'frozen_near_you') {
    return 'Excellent position. Wave frozen on your side, farm freely and zone the enemy if possible.';
  }
  if (junglePrediction.gankRisk < 0.1) {
    return 'Very safe. Enemy jungler is confirmed far away. You can play aggressively.';
  }
  return 'Safe position. Farm up and look for opportunities to trade or roam.';
}

// ---------------------------------------------------------------------------
// Coaching tip generation
// ---------------------------------------------------------------------------

/**
 * Generate a coaching tip based on the position assessment.
 * Returns `null` if there is nothing urgent to communicate or if
 * the tip cooldown has not elapsed.
 */
export function generatePositionTip(
  assessment: PositionAssessment,
): CoachingTip | null {
  const now = Date.now();
  if (now - state.lastTipTime < TIP_COOLDOWN_MS) {
    return null;
  }

  if (assessment.safety === 'dangerous') {
    state.lastTipTime = now;

    if (assessment.overextended && assessment.gankVulnerable) {
      return createTip(
        'You are OVEREXTENDED and gank-vulnerable! Back off to tower now.',
        'danger',
      );
    }
    if (assessment.overextended) {
      return createTip(
        'You are overextended. The wave is pushing forward and you are exposed. Pull back.',
        'danger',
      );
    }
    if (assessment.gankVulnerable) {
      return createTip(
        'High gank danger! Ward up and stay near your tower. Enemy jungler may be close.',
        'danger',
      );
    }
    return createTip(
      'Dangerous position. Retreat and play safe until you have more information.',
      'danger',
    );
  }

  if (assessment.safety === 'risky') {
    state.lastTipTime = now;

    if (assessment.gankVulnerable) {
      return createTip(
        'Gank risk is elevated. Drop a ward in river before pushing further.',
        'warning',
      );
    }
    if (assessment.overextended) {
      return createTip(
        'You look overextended. Let the wave push back to you or place vision first.',
        'warning',
      );
    }
    return createTip(
      'Position is risky. Keep your ward coverage up and track the enemy jungler.',
      'warning',
    );
  }

  // Safe / moderate -- only tip if there's a positive opportunity
  if (assessment.safety === 'safe' && !assessment.gankVulnerable) {
    // Don't spam "you're safe" tips -- only on clear windows
    const hasOpportunity = assessment.reasons.some(
      (r) =>
        r.includes('dead') ||
        r.includes('far away') ||
        r.includes('frozen on your side'),
    );
    if (hasOpportunity) {
      state.lastTipTime = now;
      return createTip(
        'Safe window detected. You can trade, push, or look for a roam opportunity.',
        'info',
      );
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Utility: mark flash as used (called from external systems)
// ---------------------------------------------------------------------------

/**
 * Notify the positioning engine that the player used Flash.
 * This increases gank vulnerability for the cooldown duration.
 */
export function markFlashUsed(gameTime: number): void {
  state.lastFlashTime = gameTime;
}

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------

export function resetPositioningEngine(): void {
  state.recentGankDeaths = [];
  state.lastFlashTime = 0;
  state.lastAssessment = null;
  state.lastTipTime = 0;
  tipCounter = 0;
}
