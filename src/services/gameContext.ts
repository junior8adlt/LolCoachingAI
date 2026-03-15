/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck - GameContext destructures many fields for extensibility
import type { PlayerInfo, GameEvent, ActivePlayer } from '../types/game';
import type {
  CoachingTip,
  JunglePrediction,
  ObjectiveInfo,
} from '../types/coaching';
import { getChampionMeta, type ChampionArchetype } from '../data/championMeta';
import type { WaveState } from './waveEngine';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface GameContext {
  // Game state
  gamePhase: 'early' | 'mid' | 'late';
  gameTime: number;

  // Map pressure
  mapPressure: {
    top: 'ally' | 'enemy' | 'neutral';
    mid: 'ally' | 'enemy' | 'neutral';
    bot: 'ally' | 'enemy' | 'neutral';
  };

  // Jungle control
  jungleControl: 'ally' | 'enemy' | 'contested';

  // Objective priority
  nextObjective: string | null;
  objectiveUrgency: 'low' | 'medium' | 'high' | 'critical';

  // Fight strength
  teamfightAdvantage: 'us' | 'them' | 'even';
  numberAdvantage: number;

  // Player context
  myChampion: string;
  myRole: string;
  myGoldLead: number;
  myLevelAdvantage: number;
}

export interface RotationCall {
  action: 'stay' | 'push_and_rotate' | 'rotate_now' | 'group' | 'split' | 'defend';
  target: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SPLITPUSH_CHAMPIONS = new Set([
  'Fiora', 'Jax', 'Tryndamere', 'Camille', 'Yorick', 'Nasus',
  'Gwen', 'Shen', 'Irelia', 'Riven', 'Kayle', 'Master Yi',
  'Trundle', 'Udyr', 'Volibear',
]);

const EARLY_GAME_END = 840;   // 14 minutes
const MID_GAME_END = 1680;    // 28 minutes

// Tip dedup
let tipCounter = 0;
const recentRotationTips = new Map<string, number>();

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getGamePhase(gameTime: number): 'early' | 'mid' | 'late' {
  if (gameTime < EARLY_GAME_END) return 'early';
  if (gameTime < MID_GAME_END) return 'mid';
  return 'late';
}

/**
 * Identify which PlayerInfo is the laner for a given position string on a team.
 * The Riot Live Client API uses position strings like "TOP", "MIDDLE", "BOTTOM",
 * "JUNGLE", "UTILITY".
 */
function findLaner(
  allPlayers: PlayerInfo[],
  team: 'ORDER' | 'CHAOS',
  positionKeyword: string
): PlayerInfo | undefined {
  return allPlayers.find(
    (p) => p.team === team && p.position.toUpperCase().includes(positionKeyword.toUpperCase())
  );
}

function getKDA(scores: { kills: number; deaths: number; assists: number }): number {
  return scores.kills + scores.assists - scores.deaths;
}

/**
 * Estimate gold from items on a PlayerInfo.
 * We sum up item prices as a rough proxy for total gold earned.
 */
function estimateGoldFromItems(player: PlayerInfo): number {
  return player.items.reduce((sum, item) => sum + item.price * item.count, 0);
}

/**
 * Compare two laners in a lane and return pressure: 'ally', 'enemy', or 'neutral'.
 */
function inferLanePressure(
  allyLaner: PlayerInfo | undefined,
  enemyLaner: PlayerInfo | undefined
): 'ally' | 'enemy' | 'neutral' {
  if (!allyLaner || !enemyLaner) return 'neutral';

  let allyScore = 0;
  let enemyScore = 0;

  // Kill advantage
  const allyKills = allyLaner.scores.kills;
  const enemyKills = enemyLaner.scores.kills;
  if (allyKills > enemyKills + 1) allyScore += 2;
  else if (enemyKills > allyKills + 1) enemyScore += 2;
  else if (allyKills > enemyKills) allyScore += 1;
  else if (enemyKills > allyKills) enemyScore += 1;

  // CS advantage
  const csDiff = allyLaner.scores.creepScore - enemyLaner.scores.creepScore;
  if (csDiff > 20) allyScore += 2;
  else if (csDiff > 10) allyScore += 1;
  else if (csDiff < -20) enemyScore += 2;
  else if (csDiff < -10) enemyScore += 1;

  // Level advantage
  const levelDiff = allyLaner.level - enemyLaner.level;
  if (levelDiff >= 2) allyScore += 2;
  else if (levelDiff >= 1) allyScore += 1;
  else if (levelDiff <= -2) enemyScore += 2;
  else if (levelDiff <= -1) enemyScore += 1;

  // Death state
  if (enemyLaner.isDead) allyScore += 2;
  if (allyLaner.isDead) enemyScore += 2;

  if (allyScore > enemyScore + 1) return 'ally';
  if (enemyScore > allyScore + 1) return 'enemy';
  return 'neutral';
}

/**
 * Determine jungle control from objective events and jungler KDA.
 */
function inferJungleControl(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
  events: GameEvent[]
): 'ally' | 'enemy' | 'contested' {
  let allyScore = 0;
  let enemyScore = 0;

  // Count epic monster kills (dragons, heralds, barons) per team
  const allyPlayerNames = new Set(
    allPlayers.filter((p) => p.team === myTeam).map((p) => p.summonerName)
  );

  for (const event of events) {
    if (
      event.EventName === 'DragonKill' ||
      event.EventName === 'HeraldKill' ||
      event.EventName === 'BaronKill'
    ) {
      if (event.KillerName && allyPlayerNames.has(event.KillerName)) {
        allyScore += 2;
      } else {
        enemyScore += 2;
      }
      // Stolen objectives are extra impactful
      if (event.Stolen) {
        if (event.KillerName && allyPlayerNames.has(event.KillerName)) {
          allyScore += 1;
        } else {
          enemyScore += 1;
        }
      }
    }
  }

  // Compare junglers KDA
  const allyJungler = findLaner(allPlayers, myTeam, 'JUNGLE');
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';
  const enemyJungler = findLaner(allPlayers, enemyTeam, 'JUNGLE');

  if (allyJungler && enemyJungler) {
    const allyKDA = getKDA(allyJungler.scores);
    const enemyKDA = getKDA(enemyJungler.scores);
    if (allyKDA > enemyKDA + 3) allyScore += 2;
    else if (allyKDA > enemyKDA + 1) allyScore += 1;
    else if (enemyKDA > allyKDA + 3) enemyScore += 2;
    else if (enemyKDA > allyKDA + 1) enemyScore += 1;
  }

  if (allyScore > enemyScore + 1) return 'ally';
  if (enemyScore > allyScore + 1) return 'enemy';
  return 'contested';
}

/**
 * Figure out the next objective and how urgent it is.
 */
function inferObjectivePriority(
  objectives: ObjectiveInfo[],
  gameTime: number,
  teamAhead: boolean
): { nextObjective: string | null; objectiveUrgency: 'low' | 'medium' | 'high' | 'critical' } {
  let bestObjective: string | null = null;
  let bestUrgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let bestTimer = Infinity;

  for (const obj of objectives) {
    const objLabel = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);

    if (obj.status === 'alive') {
      // Objective is alive right now
      const urgency = determineAliveObjectiveUrgency(obj, gameTime, teamAhead);
      if (urgencyRank(urgency) > urgencyRank(bestUrgency)) {
        bestUrgency = urgency;
        bestObjective = `${objLabel} alive now`;
        bestTimer = 0;
      }
    } else if (obj.status === 'dead' && obj.timer > 0) {
      // Objective spawning soon
      const timeToSpawn = obj.timer;
      if (timeToSpawn < bestTimer) {
        bestTimer = timeToSpawn;
        if (timeToSpawn <= 30) {
          bestUrgency = maxUrgency(bestUrgency, 'critical');
          bestObjective = `${objLabel} in ${Math.round(timeToSpawn)}s`;
        } else if (timeToSpawn <= 60) {
          bestUrgency = maxUrgency(bestUrgency, 'high');
          bestObjective = `${objLabel} in ${Math.round(timeToSpawn)}s`;
        } else if (timeToSpawn <= 120) {
          bestUrgency = maxUrgency(bestUrgency, 'medium');
          bestObjective = `${objLabel} in ${Math.round(timeToSpawn)}s`;
        } else {
          bestObjective = `${objLabel} in ${Math.round(timeToSpawn)}s`;
        }
      }
    }
  }

  return { nextObjective: bestObjective, objectiveUrgency: bestUrgency };
}

function determineAliveObjectiveUrgency(
  obj: ObjectiveInfo,
  gameTime: number,
  teamAhead: boolean
): 'low' | 'medium' | 'high' | 'critical' {
  if (obj.type === 'baron') {
    if (teamAhead) return 'high';
    return 'medium';
  }
  if (obj.type === 'dragon') {
    if (gameTime > MID_GAME_END) return 'high';
    return 'medium';
  }
  if (obj.type === 'herald') {
    if (gameTime < EARLY_GAME_END) return 'medium';
    return 'low';
  }
  return 'low';
}

function urgencyRank(u: 'low' | 'medium' | 'high' | 'critical'): number {
  switch (u) {
    case 'low': return 0;
    case 'medium': return 1;
    case 'high': return 2;
    case 'critical': return 3;
  }
}

function maxUrgency(
  a: 'low' | 'medium' | 'high' | 'critical',
  b: 'low' | 'medium' | 'high' | 'critical'
): 'low' | 'medium' | 'high' | 'critical' {
  return urgencyRank(a) >= urgencyRank(b) ? a : b;
}

/**
 * Compare teamfight strength based on alive champions, levels, and gold.
 */
function inferTeamfightAdvantage(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS'
): { teamfightAdvantage: 'us' | 'them' | 'even'; numberAdvantage: number } {
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';

  const allyAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead);
  const enemyAlive = allPlayers.filter((p) => p.team === enemyTeam && !p.isDead);

  const numberAdvantage = allyAlive.length - enemyAlive.length;

  // Weighted score: alive count + level sum + gold estimate
  const allyLevelSum = allyAlive.reduce((s, p) => s + p.level, 0);
  const enemyLevelSum = enemyAlive.reduce((s, p) => s + p.level, 0);

  const allyGold = allyAlive.reduce((s, p) => s + estimateGoldFromItems(p), 0);
  const enemyGold = enemyAlive.reduce((s, p) => s + estimateGoldFromItems(p), 0);

  let allyPower = allyAlive.length * 1000 + allyLevelSum * 100 + allyGold;
  let enemyPower = enemyAlive.length * 1000 + enemyLevelSum * 100 + enemyGold;

  const powerRatio = allyPower / Math.max(enemyPower, 1);

  let advantage: 'us' | 'them' | 'even';
  if (powerRatio > 1.15) advantage = 'us';
  else if (powerRatio < 0.87) advantage = 'them';
  else advantage = 'even';

  return { teamfightAdvantage: advantage, numberAdvantage };
}

/**
 * Normalize Riot position strings ("TOP", "MIDDLE", "BOTTOM", "JUNGLE", "UTILITY")
 * into our role format.
 */
function normalizeRole(position: string): string {
  const p = position.toUpperCase();
  if (p.includes('TOP')) return 'top';
  if (p.includes('MID')) return 'mid';
  if (p.includes('BOT') || p.includes('BOTTOM')) return 'adc';
  if (p.includes('JUN')) return 'jungle';
  if (p.includes('UTIL') || p.includes('SUP')) return 'support';
  return 'mid';
}

/**
 * Check if a champion is a splitpusher by name or archetype.
 */
function isSplitpusher(championName: string): boolean {
  if (SPLITPUSH_CHAMPIONS.has(championName)) return true;
  const meta = getChampionMeta(championName);
  if (!meta) return false;
  const splitArchetypes: ChampionArchetype[] = ['skirmisher', 'specialist'];
  return meta.archetypes.some((a) => splitArchetypes.includes(a));
}

/**
 * Determine how far ahead/behind a player is by comparing gold from items to
 * the average of the enemy team.
 */
function estimateGoldLead(myPlayer: PlayerInfo, allPlayers: PlayerInfo[]): number {
  const enemyTeam = myPlayer.team === 'ORDER' ? 'CHAOS' : 'ORDER';
  const enemies = allPlayers.filter((p) => p.team === enemyTeam);
  if (enemies.length === 0) return 0;

  const myGold = estimateGoldFromItems(myPlayer);
  const avgEnemyGold = enemies.reduce((s, p) => s + estimateGoldFromItems(p), 0) / enemies.length;
  return myGold - avgEnemyGold;
}

/**
 * Determine level advantage relative to the direct lane opponent.
 */
function estimateLevelAdvantage(
  myPlayer: PlayerInfo,
  allPlayers: PlayerInfo[]
): number {
  const enemyTeam = myPlayer.team === 'ORDER' ? 'CHAOS' : 'ORDER';
  const myPosition = myPlayer.position.toUpperCase();
  const opponent = allPlayers.find(
    (p) => p.team === enemyTeam && p.position.toUpperCase() === myPosition
  );
  if (!opponent) return 0;
  return myPlayer.level - opponent.level;
}

/**
 * Determine what objective side matters for rotation targeting.
 */
function getObjectiveSide(nextObjective: string | null): string | null {
  if (!nextObjective) return null;
  const lower = nextObjective.toLowerCase();
  if (lower.includes('dragon')) return 'bot';
  if (lower.includes('baron') || lower.includes('herald')) return 'top';
  return null;
}

/**
 * Check if allies are in a fight (multiple recent kills/deaths in short window).
 */
function isTeamFighting(events: GameEvent[], gameTime: number): boolean {
  const recentWindow = 15; // 15 seconds
  const recentCombatEvents = events.filter(
    (e) =>
      (e.EventName === 'ChampionKill' || e.EventName === 'Multikill') &&
      gameTime - e.EventTime < recentWindow
  );
  return recentCombatEvents.length >= 2;
}

/**
 * Count how many allies are dead.
 */
function countDeadAllies(allPlayers: PlayerInfo[], myTeam: 'ORDER' | 'CHAOS'): number {
  return allPlayers.filter((p) => p.team === myTeam && p.isDead).length;
}

/**
 * Check if we're behind overall (more deaths than kills as a team, less gold).
 */
function isTeamBehind(allPlayers: PlayerInfo[], myTeam: 'ORDER' | 'CHAOS'): boolean {
  const allies = allPlayers.filter((p) => p.team === myTeam);
  const enemies = allPlayers.filter((p) => p.team !== myTeam);

  const allyKills = allies.reduce((s, p) => s + p.scores.kills, 0);
  const enemyKills = enemies.reduce((s, p) => s + p.scores.kills, 0);

  const allyGold = allies.reduce((s, p) => s + estimateGoldFromItems(p), 0);
  const enemyGold = enemies.reduce((s, p) => s + estimateGoldFromItems(p), 0);

  return enemyKills > allyKills + 5 || enemyGold > allyGold + 3000;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a unified GameContext from all available game data sources.
 */
export function buildGameContext(
  allPlayers: PlayerInfo[],
  myPlayer: PlayerInfo | undefined,
  activePlayer: ActivePlayer | undefined,
  events: GameEvent[],
  gameTime: number,
  objectives: ObjectiveInfo[],
  junglePrediction: JunglePrediction | null
): GameContext {
  const myTeam = myPlayer?.team ?? 'ORDER';
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';

  // Game phase
  const gamePhase = getGamePhase(gameTime);

  // Map pressure per lane
  const allyTop = findLaner(allPlayers, myTeam, 'TOP');
  const enemyTop = findLaner(allPlayers, enemyTeam, 'TOP');
  const allyMid = findLaner(allPlayers, myTeam, 'MID');
  const enemyMid = findLaner(allPlayers, enemyTeam, 'MID');
  const allyBot = findLaner(allPlayers, myTeam, 'BOT');
  const enemyBot = findLaner(allPlayers, enemyTeam, 'BOT');
  // Include support in bot pressure calculation
  const allySupport = findLaner(allPlayers, myTeam, 'UTIL');
  const enemySupport = findLaner(allPlayers, enemyTeam, 'UTIL');

  const topPressure = inferLanePressure(allyTop, enemyTop);
  const midPressure = inferLanePressure(allyMid, enemyMid);

  // Bot lane considers both ADC and support
  let botPressure = inferLanePressure(allyBot, enemyBot);
  if (botPressure === 'neutral' && allySupport && enemySupport) {
    // Tiebreak with support comparison
    const supportPressure = inferLanePressure(allySupport, enemySupport);
    if (supportPressure !== 'neutral') {
      botPressure = supportPressure;
    }
  }

  // Jungle control
  const jungleControl = inferJungleControl(allPlayers, myTeam, events);

  // Is the team ahead?
  const teamAhead = !isTeamBehind(allPlayers, myTeam);

  // Objective priority
  const { nextObjective, objectiveUrgency } = inferObjectivePriority(
    objectives,
    gameTime,
    teamAhead
  );

  // Teamfight advantage
  const { teamfightAdvantage, numberAdvantage } = inferTeamfightAdvantage(allPlayers, myTeam);

  // Player context
  const myChampion = myPlayer?.championName ?? '';
  const myRole = normalizeRole(myPlayer?.position ?? 'MIDDLE');
  const myGoldLead = myPlayer ? estimateGoldLead(myPlayer, allPlayers) : 0;
  const myLevelAdvantage = myPlayer ? estimateLevelAdvantage(myPlayer, allPlayers) : 0;

  return {
    gamePhase,
    gameTime,
    mapPressure: {
      top: topPressure,
      mid: midPressure,
      bot: botPressure,
    },
    jungleControl,
    nextObjective,
    objectiveUrgency,
    teamfightAdvantage,
    numberAdvantage,
    myChampion,
    myRole,
    myGoldLead,
    myLevelAdvantage,
  };
}

/**
 * Determine the rotation call for the player based on the unified context.
 */
export function getRotationCall(
  context: GameContext,
  myRole: string,
  waveState: WaveState
): RotationCall {
  const {
    gamePhase,
    gameTime,
    nextObjective,
    objectiveUrgency,
    teamfightAdvantage,
    numberAdvantage,
    myChampion,
    myGoldLead,
    mapPressure,
  } = context;

  const objectiveSide = getObjectiveSide(nextObjective);
  const isAhead = myGoldLead > 500;
  const canSplit = isSplitpusher(myChampion);
  const waveIsPushing = waveState === 'pushing_to_enemy' || waveState === 'crashing';
  const waveFrozen = waveState === 'frozen_near_you' || waveState === 'frozen_near_enemy';

  // ── Defend logic: behind, allies dead, protect base ──
  if (numberAdvantage <= -2 && teamfightAdvantage === 'them') {
    return {
      action: 'defend',
      target: 'base',
      reason: 'Team disadvantage, multiple allies dead. Play safe and defend.',
      urgency: 'high',
    };
  }

  // ── Role-specific rotation logic ──

  // --- ADC ---
  if (myRole === 'adc') {
    return getADCRotation(context, waveState, objectiveSide);
  }

  // --- Support ---
  if (myRole === 'support') {
    return getSupportRotation(context, waveState, objectiveSide);
  }

  // --- Jungle ---
  if (myRole === 'jungle') {
    return getJungleRotation(context, waveState, objectiveSide);
  }

  // --- Mid ---
  if (myRole === 'mid') {
    return getMidRotation(context, waveState, objectiveSide, canSplit);
  }

  // --- Top ---
  if (myRole === 'top') {
    return getTopRotation(context, waveState, objectiveSide, canSplit);
  }

  // Fallback: generic logic
  return getGenericRotation(context, waveState, objectiveSide, canSplit);
}

// ---------------------------------------------------------------------------
// Role-specific rotation helpers
// ---------------------------------------------------------------------------

function getADCRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null
): RotationCall {
  const { objectiveUrgency, nextObjective, gamePhase, numberAdvantage, teamfightAdvantage } = context;

  // ADC should never split alone
  // Critical objective: rotate now
  if (objectiveUrgency === 'critical') {
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective spawning imminently. Group with team as ADC.',
      urgency: 'high',
    };
  }

  // High urgency: push wave then go
  if (objectiveUrgency === 'high') {
    if (waveState === 'pushing_to_enemy' || waveState === 'crashing') {
      return {
        action: 'push_and_rotate',
        target: nextObjective ?? 'objective',
        reason: 'Push out your wave then rotate for the objective.',
        urgency: 'high',
      };
    }
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective priority is high. Group with your team.',
      urgency: 'high',
    };
  }

  // Mid/late game: group up
  if (gamePhase !== 'early' && numberAdvantage >= 0) {
    return {
      action: 'group',
      target: objectiveSide === 'bot' ? 'dragon' : objectiveSide === 'top' ? 'baron' : 'mid lane',
      reason: 'Group with team for objective pressure. ADCs should not be alone.',
      urgency: 'medium',
    };
  }

  // Default: farm and stay safe
  return {
    action: 'stay',
    target: 'bot lane',
    reason: 'Farm safely. Wait for team to set up plays.',
    urgency: 'low',
  };
}

function getSupportRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null
): RotationCall {
  const { objectiveUrgency, nextObjective, gamePhase, jungleControl } = context;

  // Critical objective
  if (objectiveUrgency === 'critical') {
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective imminent. Set up vision and zone for your team.',
      urgency: 'high',
    };
  }

  // High urgency: set up vision early
  if (objectiveUrgency === 'high') {
    const visionTarget = objectiveSide === 'bot' ? 'dragon pit' : 'baron pit';
    return {
      action: 'rotate_now',
      target: visionTarget,
      reason: `Set up vision around ${visionTarget} before objective spawns.`,
      urgency: 'high',
    };
  }

  // Early-mid game: roam with jungler
  if (gamePhase === 'early' && jungleControl !== 'enemy') {
    return {
      action: 'push_and_rotate',
      target: 'river',
      reason: 'Roam with jungler to establish river control and deep vision.',
      urgency: 'medium',
    };
  }

  // Mid-late: stick with ADC or team
  if (gamePhase !== 'early') {
    return {
      action: 'group',
      target: objectiveSide ?? 'mid lane',
      reason: 'Group with your ADC or team. Supports should not be alone.',
      urgency: 'medium',
    };
  }

  return {
    action: 'stay',
    target: 'bot lane',
    reason: 'Stay with ADC and maintain lane pressure.',
    urgency: 'low',
  };
}

function getJungleRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null
): RotationCall {
  const {
    objectiveUrgency,
    nextObjective,
    gamePhase,
    mapPressure,
    numberAdvantage,
    teamfightAdvantage,
  } = context;

  // Critical objective: drop everything
  if (objectiveUrgency === 'critical') {
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective spawning now. Secure it as jungler.',
      urgency: 'high',
    };
  }

  // High urgency: path toward objective side
  if (objectiveUrgency === 'high') {
    return {
      action: 'push_and_rotate',
      target: nextObjective ?? 'objective',
      reason: 'Clear camps on objective side and prepare to take it.',
      urgency: 'high',
    };
  }

  // Gank winning lanes
  const winningLane = findWinningLane(mapPressure);
  if (winningLane && gamePhase === 'early') {
    return {
      action: 'push_and_rotate',
      target: `${winningLane} lane`,
      reason: `${winningLane} lane has pressure. Gank to snowball the advantage.`,
      urgency: 'medium',
    };
  }

  // Number advantage: force a play
  if (numberAdvantage >= 2) {
    const target = objectiveSide ?? 'nearest objective';
    return {
      action: 'rotate_now',
      target,
      reason: 'Number advantage. Force an objective or dive.',
      urgency: 'high',
    };
  }

  // Default: farm and look for opportunities
  return {
    action: 'stay',
    target: 'jungle',
    reason: 'Farm camps and track the enemy jungler. Look for gank opportunities.',
    urgency: 'low',
  };
}

function getMidRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null,
  canSplit: boolean
): RotationCall {
  const { objectiveUrgency, nextObjective, gamePhase, numberAdvantage } = context;

  // Critical objective
  if (objectiveUrgency === 'critical') {
    if (waveState === 'pushing_to_enemy' || waveState === 'crashing') {
      return {
        action: 'push_and_rotate',
        target: nextObjective ?? 'objective',
        reason: 'Crash wave then rotate to objective.',
        urgency: 'high',
      };
    }
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective is critical. Leave lane and rotate.',
      urgency: 'high',
    };
  }

  // High urgency: push and roam
  if (objectiveUrgency === 'high') {
    return {
      action: 'push_and_rotate',
      target: objectiveSide === 'bot' ? 'bot side' : 'top side',
      reason: 'Push mid wave and roam to objective side.',
      urgency: 'high',
    };
  }

  // Mid-late game: group or push
  if (gamePhase !== 'early' && numberAdvantage >= 0) {
    return {
      action: 'group',
      target: objectiveSide ?? 'mid lane',
      reason: 'Group with team for mid-game objective play.',
      urgency: 'medium',
    };
  }

  // Early game: push and look for roams
  if (gamePhase === 'early' && (waveState === 'pushing_to_enemy' || waveState === 'crashing')) {
    return {
      action: 'push_and_rotate',
      target: objectiveSide ?? 'nearest lane',
      reason: 'Good wave state. Look for a roam after pushing.',
      urgency: 'medium',
    };
  }

  return {
    action: 'stay',
    target: 'mid lane',
    reason: 'Farm and maintain mid priority.',
    urgency: 'low',
  };
}

function getTopRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null,
  canSplit: boolean
): RotationCall {
  const {
    objectiveUrgency,
    nextObjective,
    gamePhase,
    teamfightAdvantage,
    myGoldLead,
    numberAdvantage,
  } = context;

  // Critical objective
  if (objectiveUrgency === 'critical') {
    // Check if we have TP (we can't check summoner spells from context alone,
    // so for top lane we assume TP is available as a possibility)
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Critical objective. TP or walk down now.',
      urgency: 'high',
    };
  }

  // Strong splitpusher with gold lead: split push
  if (canSplit && myGoldLead > 1000 && gamePhase !== 'early') {
    // But only if team can handle 4v4
    if (teamfightAdvantage !== 'them' && numberAdvantage >= -1) {
      return {
        action: 'split',
        target: 'side lane',
        reason: 'You are a strong splitpusher with a lead. Apply side lane pressure.',
        urgency: 'medium',
      };
    }
  }

  // High objective urgency: push and rotate
  if (objectiveUrgency === 'high') {
    if (waveState === 'pushing_to_enemy' || waveState === 'crashing') {
      return {
        action: 'push_and_rotate',
        target: nextObjective ?? 'objective',
        reason: 'Crash wave then rotate for the objective.',
        urgency: 'high',
      };
    }
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Objective spawning soon. Move toward objective side.',
      urgency: 'high',
    };
  }

  // Mid-late game grouping
  if (gamePhase === 'late') {
    if (canSplit && teamfightAdvantage !== 'them') {
      return {
        action: 'split',
        target: 'side lane',
        reason: 'Late game split push. Apply pressure while team groups.',
        urgency: 'medium',
      };
    }
    return {
      action: 'group',
      target: objectiveSide ?? 'mid lane',
      reason: 'Late game. Group with team for teamfights.',
      urgency: 'medium',
    };
  }

  return {
    action: 'stay',
    target: 'top lane',
    reason: 'Farm and build your lead in lane.',
    urgency: 'low',
  };
}

function getGenericRotation(
  context: GameContext,
  waveState: WaveState,
  objectiveSide: string | null,
  canSplit: boolean
): RotationCall {
  const { objectiveUrgency, nextObjective, gamePhase, numberAdvantage } = context;

  if (objectiveUrgency === 'critical') {
    return {
      action: 'rotate_now',
      target: nextObjective ?? 'objective',
      reason: 'Critical objective. Rotate immediately.',
      urgency: 'high',
    };
  }

  if (objectiveUrgency === 'high') {
    return {
      action: 'push_and_rotate',
      target: nextObjective ?? 'objective',
      reason: 'Push your wave then rotate for objective.',
      urgency: 'high',
    };
  }

  if (gamePhase !== 'early' && numberAdvantage >= 0) {
    return {
      action: 'group',
      target: objectiveSide ?? 'mid lane',
      reason: 'Group with team to take objectives.',
      urgency: 'medium',
    };
  }

  return {
    action: 'stay',
    target: 'lane',
    reason: 'Farm and wait for an opportunity.',
    urgency: 'low',
  };
}

/**
 * Find a lane where we have ally pressure for ganking purposes.
 */
function findWinningLane(
  mapPressure: GameContext['mapPressure']
): 'top' | 'mid' | 'bot' | null {
  if (mapPressure.top === 'ally') return 'top';
  if (mapPressure.mid === 'ally') return 'mid';
  if (mapPressure.bot === 'ally') return 'bot';
  return null;
}

// ---------------------------------------------------------------------------
// Tip generation
// ---------------------------------------------------------------------------

function createRotationTip(
  message: string,
  priority: 'info' | 'warning' | 'danger',
  category: 'macro' | 'objective' = 'macro'
): CoachingTip | null {
  const hash = message.slice(0, 40).toLowerCase();
  const now = Date.now();

  if (recentRotationTips.has(hash) && now - (recentRotationTips.get(hash) ?? 0) < 45000) {
    return null;
  }
  recentRotationTips.set(hash, now);

  // Cleanup stale entries
  if (recentRotationTips.size > 40) {
    for (const [k, t] of recentRotationTips) {
      if (now - t > 90000) recentRotationTips.delete(k);
    }
  }

  tipCounter++;
  return {
    id: `rotation-${now}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: now,
    dismissed: false,
  };
}

/**
 * Generate a coaching tip from a rotation call.
 * Returns null if the call is low urgency or a duplicate tip was sent recently.
 */
export function generateRotationTip(call: RotationCall): CoachingTip | null {
  // Don't generate tips for low-urgency "stay" calls
  if (call.action === 'stay' && call.urgency === 'low') {
    return null;
  }

  const priority = rotationUrgencyToPriority(call.urgency);
  const category = call.action === 'defend' ? 'macro' : 'objective';

  let message: string;

  switch (call.action) {
    case 'rotate_now':
      message = `Rotate NOW to ${call.target}! ${call.reason}`;
      break;
    case 'push_and_rotate':
      message = `Push wave then rotate to ${call.target}. ${call.reason}`;
      break;
    case 'group':
      message = `Group at ${call.target}. ${call.reason}`;
      break;
    case 'split':
      message = `Split push ${call.target}. ${call.reason}`;
      break;
    case 'defend':
      message = `Fall back and defend ${call.target}! ${call.reason}`;
      break;
    case 'stay':
      message = `Stay in ${call.target}. ${call.reason}`;
      break;
    default:
      message = call.reason;
  }

  return createRotationTip(message, priority, category);
}

function rotationUrgencyToPriority(
  urgency: 'low' | 'medium' | 'high'
): 'info' | 'warning' | 'danger' {
  switch (urgency) {
    case 'low': return 'info';
    case 'medium': return 'warning';
    case 'high': return 'danger';
  }
}
