import type { PlayerInfo, GameEvent } from '../types/game';
import type { CoachingTip } from '../types/coaching';
import {
  getChampionMeta,
  type ChampionArchetype,
} from '../data/championMeta';
import { getPowerSpike } from '../data/powerSpikes';

// =============================================================================
// Types
// =============================================================================

export type WinCondition =
  | 'teamfight'
  | 'splitpush'
  | 'early_snowball'
  | 'scale_late'
  | 'pick'
  | 'poke_siege';

export type GameAdvantage = 'winning' | 'even' | 'losing';

export interface StrategicState {
  teamGoldAdvantage: number;
  teamLevelAdvantage: number;
  objectiveAdvantage: number;
  towerAdvantage: number;

  primaryWinCondition: WinCondition;
  secondaryWinCondition: WinCondition;

  overallState: GameAdvantage;
  scalingAdvantage: 'us' | 'them' | 'even';

  strategicAdvice: string;
  timeUrgency: 'rush' | 'normal' | 'stall';
}

// =============================================================================
// Constants
// =============================================================================

const GOLD_PER_KILL = 300;
const GOLD_PER_ASSIST = 150;
const GOLD_PER_CS = 20;
const SIGNIFICANT_GOLD_LEAD = 3000;
const MAJOR_GOLD_LEAD = 6000;

/** Champions known for strong split-push identity */
const SPLITPUSH_CHAMPIONS = new Set([
  'Fiora', 'Jax', 'Tryndamere', 'Camille', 'Yorick', 'Nasus',
  'Gwen', 'Shen', 'Trundle', 'Kayle',
]);

/** Champions that define hypercarry / late-game scaling identity */
const HYPERCARRY_CHAMPIONS = new Set([
  'Kayle', 'Kassadin', 'Vayne', 'Jinx', "Kog'Maw", 'Veigar',
  'Nasus', 'Senna', 'Master Yi', 'Smolder', 'Aphelios',
  'Azir', 'Viktor', 'Cassiopeia',
]);

/** Champions with strong hook/pick threat */
const PICK_CHAMPIONS = new Set([
  'Blitzcrank', 'Thresh', 'Pyke', 'Nautilus', 'Morgana',
  'Ahri', 'Zoe', 'Ashe', 'Varus', 'Lissandra',
]);

/** Champions with strong poke/siege identity */
const POKE_SIEGE_CHAMPIONS = new Set([
  'Xerath', 'Jayce', 'Ziggs', 'Zoe', "Vel'Koz", 'Lux',
  "Kog'Maw", 'Varus', 'Hwei', 'Corki', 'Caitlyn',
]);

// =============================================================================
// Internal helpers
// =============================================================================

interface TeamComposition {
  marksmen: number;
  assassins: number;
  tanks: number;
  mages: number;
  enchanters: number;
  engageSupports: number;
  bruisers: number;
  juggernauts: number;
  artillery: number;
  skirmishers: number;
  divers: number;
  splitpushers: number;
  hypercarries: number;
  pickChampions: number;
  pokeChampions: number;
  earlyChamps: number;
  midChamps: number;
  lateChamps: number;
}

function getTeamPlayers(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
): { allies: PlayerInfo[]; enemies: PlayerInfo[] } {
  const allies: PlayerInfo[] = [];
  const enemies: PlayerInfo[] = [];
  for (const p of allPlayers) {
    if (p.team === myTeam) {
      allies.push(p);
    } else {
      enemies.push(p);
    }
  }
  return { allies, enemies };
}

function analyzeComposition(players: PlayerInfo[]): TeamComposition {
  const comp: TeamComposition = {
    marksmen: 0,
    assassins: 0,
    tanks: 0,
    mages: 0,
    enchanters: 0,
    engageSupports: 0,
    bruisers: 0,
    juggernauts: 0,
    artillery: 0,
    skirmishers: 0,
    divers: 0,
    splitpushers: 0,
    hypercarries: 0,
    pickChampions: 0,
    pokeChampions: 0,
    earlyChamps: 0,
    midChamps: 0,
    lateChamps: 0,
  };

  for (const player of players) {
    const name = player.championName;
    const meta = getChampionMeta(name);
    const spike = getPowerSpike(name);

    if (meta) {
      const archetypes = meta.archetypes as ChampionArchetype[];
      if (archetypes.includes('marksman')) comp.marksmen++;
      if (archetypes.includes('assassin')) comp.assassins++;
      if (archetypes.includes('tank')) comp.tanks++;
      if (archetypes.includes('mage')) comp.mages++;
      if (archetypes.includes('enchanter')) comp.enchanters++;
      if (archetypes.includes('engage_support')) comp.engageSupports++;
      if (archetypes.includes('bruiser')) comp.bruisers++;
      if (archetypes.includes('juggernaut')) comp.juggernauts++;
      if (archetypes.includes('artillery')) comp.artillery++;
      if (archetypes.includes('skirmisher')) comp.skirmishers++;
      if (archetypes.includes('diver')) comp.divers++;
    }

    if (SPLITPUSH_CHAMPIONS.has(name)) comp.splitpushers++;
    if (HYPERCARRY_CHAMPIONS.has(name)) comp.hypercarries++;
    if (PICK_CHAMPIONS.has(name)) comp.pickChampions++;
    if (POKE_SIEGE_CHAMPIONS.has(name)) comp.pokeChampions++;

    if (spike) {
      if (spike.archetype === 'early') comp.earlyChamps++;
      else if (spike.archetype === 'mid') comp.midChamps++;
      else if (spike.archetype === 'late') comp.lateChamps++;
    }
  }

  return comp;
}

function estimatePlayerGold(player: PlayerInfo): number {
  const { kills, assists, creepScore } = player.scores;
  return kills * GOLD_PER_KILL + assists * GOLD_PER_ASSIST + creepScore * GOLD_PER_CS;
}

function estimateTeamGold(players: PlayerInfo[]): number {
  return players.reduce((sum, p) => sum + estimatePlayerGold(p), 0);
}

function totalTeamLevel(players: PlayerInfo[]): number {
  return players.reduce((sum, p) => sum + p.level, 0);
}

function computeTowerAdvantage(
  events: GameEvent[],
  myTeam: 'ORDER' | 'CHAOS',
): number {
  let allyTowers = 0;
  let enemyTowers = 0;

  for (const event of events) {
    if (event.EventName === 'TurretKilled' && event.KillerName) {
      // Turret names contain T1/T2 etc.; killer is a player name.
      // We need to determine which team got the kill by finding the killer
      // in the turret-killed events. The KillerName is a summoner name.
      // We can't easily resolve team from event alone, but turret names
      // encode the team: "Turret_T1_..." = ORDER side turret, "Turret_T2_..." = CHAOS side turret.
      const turret = event.TurretKilled ?? '';
      if (turret.includes('T1_')) {
        // ORDER turret destroyed — benefits CHAOS
        if (myTeam === 'CHAOS') allyTowers++;
        else enemyTowers++;
      } else if (turret.includes('T2_')) {
        // CHAOS turret destroyed — benefits ORDER
        if (myTeam === 'ORDER') allyTowers++;
        else enemyTowers++;
      }
    }
  }

  return allyTowers - enemyTowers;
}

function computeObjectiveAdvantage(
  events: GameEvent[],
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
): number {
  const allyNames = new Set(
    allPlayers.filter(p => p.team === myTeam).map(p => p.summonerName),
  );
  let allyObjectives = 0;
  let enemyObjectives = 0;

  for (const event of events) {
    const name = event.EventName;
    if (
      name === 'DragonKill' ||
      name === 'HeraldKill' ||
      name === 'BaronKill'
    ) {
      const killer = event.KillerName ?? '';
      if (allyNames.has(killer)) {
        allyObjectives++;
      } else {
        enemyObjectives++;
      }
    }
  }

  return allyObjectives - enemyObjectives;
}

function scoreWinConditions(comp: TeamComposition): { primary: WinCondition; secondary: WinCondition } {
  const scores: Record<WinCondition, number> = {
    teamfight: 0,
    splitpush: 0,
    early_snowball: 0,
    scale_late: 0,
    pick: 0,
    poke_siege: 0,
  };

  // Teamfight: tanks + engage + enchanters + AoE mages
  scores.teamfight += comp.tanks * 3;
  scores.teamfight += comp.engageSupports * 3;
  scores.teamfight += comp.enchanters * 2;
  scores.teamfight += comp.juggernauts * 2;
  scores.teamfight += comp.mages * 1;
  scores.teamfight += comp.marksmen * 1;

  // Splitpush: splitpush champs + skirmishers + divers
  scores.splitpush += comp.splitpushers * 4;
  scores.splitpush += comp.skirmishers * 2;
  scores.splitpush += comp.divers * 1;

  // Early snowball: early-game archetypes + assassins
  scores.early_snowball += comp.earlyChamps * 3;
  scores.early_snowball += comp.assassins * 2;
  scores.early_snowball += comp.divers * 1;

  // Scale late: hypercarries + late game archetypes + enchanters (to protect them)
  scores.scale_late += comp.hypercarries * 4;
  scores.scale_late += comp.lateChamps * 3;
  scores.scale_late += comp.enchanters * 1;

  // Pick: pick champions + assassins
  scores.pick += comp.pickChampions * 4;
  scores.pick += comp.assassins * 2;

  // Poke/siege: poke champions + artillery
  scores.poke_siege += comp.pokeChampions * 4;
  scores.poke_siege += comp.artillery * 3;
  scores.poke_siege += comp.marksmen * 1;

  // Sort by score descending
  const sorted = (Object.entries(scores) as [WinCondition, number][])
    .sort((a, b) => b[1] - a[1]);

  const primary = sorted[0][0];
  let secondary = sorted[1][0];
  // Ensure secondary differs from primary
  if (secondary === primary && sorted.length > 2) {
    secondary = sorted[2][0];
  }

  return { primary, secondary };
}

function determineOverallState(goldAdvantage: number, levelAdvantage: number, objectiveAdvantage: number, towerAdvantage: number): GameAdvantage {
  let score = 0;

  // Gold contribution
  if (goldAdvantage >= MAJOR_GOLD_LEAD) score += 3;
  else if (goldAdvantage >= SIGNIFICANT_GOLD_LEAD) score += 2;
  else if (goldAdvantage > 1000) score += 1;
  else if (goldAdvantage <= -MAJOR_GOLD_LEAD) score -= 3;
  else if (goldAdvantage <= -SIGNIFICANT_GOLD_LEAD) score -= 2;
  else if (goldAdvantage < -1000) score -= 1;

  // Level contribution
  if (levelAdvantage >= 5) score += 2;
  else if (levelAdvantage >= 2) score += 1;
  else if (levelAdvantage <= -5) score -= 2;
  else if (levelAdvantage <= -2) score -= 1;

  // Objective contribution
  if (objectiveAdvantage >= 2) score += 1;
  else if (objectiveAdvantage <= -2) score -= 1;

  // Tower contribution
  if (towerAdvantage >= 2) score += 1;
  else if (towerAdvantage <= -2) score -= 1;

  if (score >= 2) return 'winning';
  if (score <= -2) return 'losing';
  return 'even';
}

function determineScalingAdvantage(
  allyComp: TeamComposition,
  enemyComp: TeamComposition,
): 'us' | 'them' | 'even' {
  // Compare late-game champions and hypercarries
  const allyLateScore = allyComp.lateChamps * 2 + allyComp.hypercarries * 3 + allyComp.midChamps;
  const enemyLateScore = enemyComp.lateChamps * 2 + enemyComp.hypercarries * 3 + enemyComp.midChamps;

  // Subtract early-game penalty (they fall off)
  const allyNetScale = allyLateScore - allyComp.earlyChamps;
  const enemyNetScale = enemyLateScore - enemyComp.earlyChamps;

  const diff = allyNetScale - enemyNetScale;
  if (diff >= 3) return 'us';
  if (diff <= -3) return 'them';
  return 'even';
}

function generateAdvice(
  overallState: GameAdvantage,
  primaryWin: WinCondition,
  scalingAdv: 'us' | 'them' | 'even',
  gameTime: number,
  goldAdvantage: number,
): string {
  const minutes = gameTime / 60;
  const isEarly = minutes < 15;
  const isMid = minutes >= 15 && minutes < 25;
  const isLate = minutes >= 25;

  // Winning + early comp
  if (overallState === 'winning' && (primaryWin === 'early_snowball' || scalingAdv === 'them')) {
    if (isLate) {
      return 'You have a lead but the enemy outscales. Force Baron and end the game NOW.';
    }
    return 'Force fights and objectives. End before 25 min. Your lead shrinks over time.';
  }

  // Losing + scaling comp
  if (overallState === 'losing' && (primaryWin === 'scale_late' || scalingAdv === 'us')) {
    if (isLate) {
      return 'You outscale and it\'s late game. Look for a good teamfight to turn this around.';
    }
    return 'Play safe and farm. You outscale at 3 items. Avoid unnecessary fights.';
  }

  // Even + teamfight comp
  if (overallState === 'even' && primaryWin === 'teamfight') {
    return 'Group for objectives. Your teamfight is stronger. Force 5v5s around Dragon/Baron.';
  }

  // Losing + early comp (worst case)
  if (overallState === 'losing' && (primaryWin === 'early_snowball' || scalingAdv === 'them')) {
    return 'You\'re behind AND you don\'t scale. Look for picks to get back in. Avoid 5v5s.';
  }

  // Winning + late comp (best case)
  if (overallState === 'winning' && (primaryWin === 'scale_late' || scalingAdv === 'us')) {
    return 'Keep farming. You\'re ahead AND you scale. Don\'t throw with risky plays.';
  }

  // Splitpush win condition
  if (primaryWin === 'splitpush') {
    if (overallState === 'losing') {
      return 'Apply split-push pressure in a side lane. Avoid grouping when behind — force them to answer the split.';
    }
    return 'Set up split push. Have your duelist pressure a side lane while the team pressures elsewhere.';
  }

  // Pick comp
  if (primaryWin === 'pick') {
    if (overallState === 'losing') {
      return 'Place deep vision and look for picks on overextended enemies. One catch can swing the game.';
    }
    return 'Control vision and look for catches. Avoid full 5v5s unless you get a pick first.';
  }

  // Poke/siege comp
  if (primaryWin === 'poke_siege') {
    return 'Siege towers with poke. Chunk enemies before fights. Do NOT hard engage — let your range do the work.';
  }

  // General contextual advice
  if (overallState === 'winning') {
    if (goldAdvantage >= MAJOR_GOLD_LEAD) {
      return 'Massive lead. Group and force objectives. Don\'t let them stall.';
    }
    return 'You\'re ahead. Keep up the pressure and play around objectives.';
  }

  if (overallState === 'losing') {
    if (isLate) {
      return 'Play for one good teamfight. Ward objectives and look for a favorable engage.';
    }
    return 'Play defensively. Farm safely and wait for enemy mistakes.';
  }

  // Even game
  if (isEarly) {
    return 'Even game. Focus on CS and lane fundamentals. Look for advantages through wave management.';
  }
  if (isMid) {
    return 'Even mid game. Contest objectives and maintain vision control. A good fight can swing the game.';
  }
  return 'Late game and even. Positioning is everything. One mistake can end the game for either team.';
}

function determineTimeUrgency(
  primaryWin: WinCondition,
  scalingAdv: 'us' | 'them' | 'even',
  overallState: GameAdvantage,
): 'rush' | 'normal' | 'stall' {
  // Early comp that is ahead — rush to end
  if (primaryWin === 'early_snowball' && overallState === 'winning') return 'rush';
  if (scalingAdv === 'them' && overallState === 'winning') return 'rush';
  if (scalingAdv === 'them' && overallState === 'even') return 'rush';

  // Late comp that is behind — stall for scaling
  if (primaryWin === 'scale_late' && overallState === 'losing') return 'stall';
  if (scalingAdv === 'us' && overallState === 'losing') return 'stall';

  // Early comp that is behind — desperate, still need to rush
  if (primaryWin === 'early_snowball' && overallState === 'losing') return 'rush';
  if (scalingAdv === 'them' && overallState === 'losing') return 'rush';

  // Late comp that is ahead — can play normal, no rush needed
  if (primaryWin === 'scale_late' && overallState === 'winning') return 'normal';
  if (scalingAdv === 'us' && overallState === 'winning') return 'normal';

  return 'normal';
}

// =============================================================================
// Exported API
// =============================================================================

/**
 * Determine the primary win condition for a team based on champion composition.
 */
export function getWinCondition(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
): WinCondition {
  const { allies } = getTeamPlayers(allPlayers, myTeam);
  const comp = analyzeComposition(allies);
  const { primary } = scoreWinConditions(comp);
  return primary;
}

/**
 * Determine which team scales better into the late game.
 */
export function getScalingAdvantage(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
): 'us' | 'them' | 'even' {
  const { allies, enemies } = getTeamPlayers(allPlayers, myTeam);
  const allyComp = analyzeComposition(allies);
  const enemyComp = analyzeComposition(enemies);
  return determineScalingAdvantage(allyComp, enemyComp);
}

/**
 * Full strategic analysis — who is winning, what the win condition is,
 * and what the team should do right now.
 */
export function analyzeStrategy(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
  events: GameEvent[],
  gameTime: number,
  _objectives?: unknown,
): StrategicState {
  const { allies, enemies } = getTeamPlayers(allPlayers, myTeam);
  const allyComp = analyzeComposition(allies);
  const enemyComp = analyzeComposition(enemies);

  // Gold & level advantages
  const allyGold = estimateTeamGold(allies);
  const enemyGold = estimateTeamGold(enemies);
  const teamGoldAdvantage = allyGold - enemyGold;
  const teamLevelAdvantage = totalTeamLevel(allies) - totalTeamLevel(enemies);

  // Objective & tower advantages from events
  const objectiveAdvantage = computeObjectiveAdvantage(events, allPlayers, myTeam);
  const towerAdvantage = computeTowerAdvantage(events, myTeam);

  // Win conditions
  const { primary: primaryWinCondition, secondary: secondaryWinCondition } = scoreWinConditions(allyComp);

  // Overall game state
  const overallState = determineOverallState(teamGoldAdvantage, teamLevelAdvantage, objectiveAdvantage, towerAdvantage);

  // Scaling analysis
  const scalingAdvantage = determineScalingAdvantage(allyComp, enemyComp);

  // Time urgency
  const timeUrgency = determineTimeUrgency(primaryWinCondition, scalingAdvantage, overallState);

  // Strategic advice
  const strategicAdvice = generateAdvice(overallState, primaryWinCondition, scalingAdvantage, gameTime, teamGoldAdvantage);

  return {
    teamGoldAdvantage,
    teamLevelAdvantage,
    objectiveAdvantage,
    towerAdvantage,
    primaryWinCondition,
    secondaryWinCondition,
    overallState,
    scalingAdvantage,
    strategicAdvice,
    timeUrgency,
  };
}

/**
 * Generate a coaching tip from the current strategic state, if one is warranted.
 * Returns null if no tip is needed (e.g. nothing has changed or game is too early).
 */
export function generateStrategyTip(
  state: StrategicState,
  gameTime: number,
): CoachingTip | null {
  const minutes = gameTime / 60;

  // Don't generate strategy tips before 3 minutes — not enough data
  if (minutes < 3) return null;

  let priority: CoachingTip['priority'] = 'info';
  let message = state.strategicAdvice;

  // Upgrade priority based on urgency
  if (state.timeUrgency === 'rush' && state.overallState === 'losing') {
    priority = 'danger';
    message = `URGENT: ${message}`;
  } else if (state.timeUrgency === 'rush') {
    priority = 'warning';
  } else if (state.overallState === 'losing' && Math.abs(state.teamGoldAdvantage) >= MAJOR_GOLD_LEAD) {
    priority = 'danger';
  } else if (state.overallState === 'losing') {
    priority = 'warning';
  }

  // Add scaling context to the message
  if (state.scalingAdvantage === 'us' && state.overallState !== 'winning') {
    message += ' You outscale — time is on your side.';
  } else if (state.scalingAdvantage === 'them' && state.overallState !== 'losing') {
    message += ' They outscale — don\'t let the game drag on.';
  }

  // Add gold context for large leads
  if (state.teamGoldAdvantage >= MAJOR_GOLD_LEAD) {
    message += ` (${Math.round(state.teamGoldAdvantage / 1000)}k gold lead)`;
  } else if (state.teamGoldAdvantage <= -MAJOR_GOLD_LEAD) {
    message += ` (${Math.round(Math.abs(state.teamGoldAdvantage) / 1000)}k gold deficit)`;
  }

  // Determine coaching category based on win condition
  let category: CoachingTip['category'] = 'macro';
  if (state.primaryWinCondition === 'teamfight') category = 'teamfight';
  else if (state.primaryWinCondition === 'poke_siege') category = 'positioning';
  else if (state.primaryWinCondition === 'pick') category = 'vision';
  else if (state.primaryWinCondition === 'splitpush') category = 'macro';
  else if (state.primaryWinCondition === 'early_snowball') category = 'objective';
  else if (state.primaryWinCondition === 'scale_late') category = 'farming';

  return {
    id: `strategy-${Math.round(gameTime)}`,
    message,
    priority,
    category,
    timestamp: gameTime,
    dismissed: false,
  };
}
