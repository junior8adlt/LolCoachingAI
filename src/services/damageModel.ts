// @ts-nocheck
// ── Damage Model, Fight Predictor & Objective Setup Engine ──
// Three systems in one file for the League of Legends coaching overlay:
//   1. DamageModel        – Combo damage calculator & kill probability
//   2. FightOutcomePredictor – Teamfight win probability estimation
//   3. ObjectiveSetupEngine  – Pre-objective coaching actions

import type { ActivePlayer, PlayerInfo } from '../types/game';
import type { CoachingTip, ObjectiveInfo, ObjectiveType } from '../types/coaching';
import { getChampionMeta, type ChampionArchetype } from '../data/championMeta';
import { getEnemiesWithUltDown } from './cooldownTracker';
import { getEnemyHPEstimate } from './screenReader';

// ═══════════════════════════════════════════════════════════════════
// 1. DamageModel – Combo Damage Calculator
// ═══════════════════════════════════════════════════════════════════

export interface DamageEstimate {
  comboDamage: number;        // Total estimated burst combo damage
  sustainedDPS: number;       // DPS over 5 seconds
  executeThreshold: number;   // HP where you can execute (with ult/ignite)
  canKillAtHP: number;        // Enemy HP% where you can kill them
}

interface EnemyInfo {
  championName: string;
  level: number;
  itemCount: number;
  currentHPPercent?: number;  // 0-1, from screen reader or estimation
}

// AD-focused archetypes
const AD_ARCHETYPES: ChampionArchetype[] = [
  'marksman', 'assassin', 'bruiser', 'juggernaut', 'skirmisher', 'diver',
];

// AP-focused archetypes
const AP_ARCHETYPES: ChampionArchetype[] = [
  'mage', 'enchanter', 'artillery',
];

// Champions with notable execute abilities (bonus damage at low HP)
const EXECUTE_CHAMPIONS: Record<string, { type: 'flat' | 'missingHP'; baseDamage: number; scalingRatio: number }> = {
  'Jinx':       { type: 'missingHP', baseDamage: 250, scalingRatio: 0.25 },
  'Caitlyn':    { type: 'flat',      baseDamage: 200, scalingRatio: 0.5 },
  'Garen':      { type: 'missingHP', baseDamage: 150, scalingRatio: 0.30 },
  'Darius':     { type: 'flat',      baseDamage: 200, scalingRatio: 0.75 },
  'Veigar':     { type: 'missingHP', baseDamage: 175, scalingRatio: 0.50 },
  'Evelynn':    { type: 'missingHP', baseDamage: 100, scalingRatio: 0.25 },
  'Pyke':       { type: 'flat',      baseDamage: 250, scalingRatio: 0.0 },
  "Kai'Sa":     { type: 'missingHP', baseDamage: 100, scalingRatio: 0.15 },
  'Urgot':      { type: 'flat',      baseDamage: 9999, scalingRatio: 0.0 }, // executes below 25%
  "Cho'Gath":   { type: 'flat',      baseDamage: 300, scalingRatio: 0.50 },
  'Lee Sin':    { type: 'missingHP', baseDamage: 150, scalingRatio: 0.20 },
  'Akshan':     { type: 'flat',      baseDamage: 100, scalingRatio: 0.30 },
  'Samira':     { type: 'flat',      baseDamage: 200, scalingRatio: 0.60 },
};

/**
 * Determine AD vs AP ratio for a champion based on archetype.
 * Returns { adRatio, apRatio } that sum to 1.
 */
function getDamageRatio(championName: string): { adRatio: number; apRatio: number } {
  const meta = getChampionMeta(championName);
  if (!meta) return { adRatio: 0.5, apRatio: 0.5 };

  let adScore = 0;
  let apScore = 0;

  for (const archetype of meta.archetypes) {
    if (AD_ARCHETYPES.includes(archetype)) adScore++;
    if (AP_ARCHETYPES.includes(archetype)) apScore++;
  }

  // Pure AD or pure AP
  if (adScore > 0 && apScore === 0) return { adRatio: 1.0, apRatio: 0.0 };
  if (apScore > 0 && adScore === 0) return { adRatio: 0.0, apRatio: 1.0 };

  // Mixed: split based on archetype counts
  const total = adScore + apScore;
  return {
    adRatio: adScore / total,
    apRatio: apScore / total,
  };
}

/**
 * Estimate enemy effective armor after our penetration.
 */
function estimateEnemyArmor(enemyLevel: number, enemyItemCount: number): number {
  return 30 + (3.5 * enemyLevel) + (enemyItemCount * 15);
}

/**
 * Estimate enemy effective magic resist.
 */
function estimateEnemyMR(enemyLevel: number): number {
  return 30 + (1.3 * enemyLevel);
}

/**
 * Estimate enemy max HP.
 */
function estimateEnemyHP(enemyLevel: number): number {
  return 600 + (95 * enemyLevel);
}

/**
 * Physical damage multiplier accounting for armor and penetration.
 */
function physicalDamageMultiplier(enemyArmor: number, lethality: number, armorPenFlat: number): number {
  const effectiveArmor = Math.max(0, enemyArmor - lethality - armorPenFlat);
  return 100 / (100 + effectiveArmor);
}

/**
 * Magic damage multiplier accounting for MR and penetration.
 */
function magicDamageMultiplier(enemyMR: number, magicPen: number, magicLethality: number): number {
  const effectiveMR = Math.max(0, enemyMR - magicPen - magicLethality);
  return 100 / (100 + effectiveMR);
}

/**
 * Calculate ignite true damage at a given level.
 */
function igniteDamage(level: number): number {
  return 70 + (20 * level);
}

/**
 * Calculate execute bonus damage for champions with execute abilities.
 */
function calculateExecuteDamage(
  championName: string,
  enemyMaxHP: number,
  enemyMissingHP: number,
  stats: ActivePlayer['championStats']
): number {
  const executeInfo = EXECUTE_CHAMPIONS[championName];
  if (!executeInfo) return 0;

  const ad = stats.attackDamage;
  const ap = stats.abilityPower;
  const bestScaling = Math.max(ad, ap);

  if (executeInfo.type === 'flat') {
    return executeInfo.baseDamage + (bestScaling * executeInfo.scalingRatio);
  }

  // missingHP: bonus damage scales with enemy missing health
  const missingHPRatio = enemyMissingHP / Math.max(1, enemyMaxHP);
  return (executeInfo.baseDamage + bestScaling * executeInfo.scalingRatio) * (1 + missingHPRatio);
}

/**
 * Calculate estimated combo damage output.
 */
export function calculateDamage(
  activePlayer: ActivePlayer,
  enemyInfo: EnemyInfo
): DamageEstimate {
  const stats = activePlayer.championStats;
  const championName = activePlayer.summonerName; // We need the champion name
  const myLevel = activePlayer.level;

  const ad = stats.attackDamage;
  const ap = stats.abilityPower;
  const attackSpeed = stats.attackSpeed;
  const critChance = stats.critChance;
  const critDmg = stats.critDamage;
  const lethality = stats.physicalLethality;
  const armorPenFlat = stats.armorPenetrationFlat;
  const magicPen = stats.magicPenetrationFlat;
  const magicLeth = stats.magicLethality;

  // Enemy estimates
  const enemyArmor = estimateEnemyArmor(enemyInfo.level, enemyInfo.itemCount);
  const enemyMR = estimateEnemyMR(enemyInfo.level);
  const enemyMaxHP = estimateEnemyHP(enemyInfo.level);

  const physMult = physicalDamageMultiplier(enemyArmor, lethality, armorPenFlat);
  const magMult = magicDamageMultiplier(enemyMR, magicPen, magicLeth);

  // Determine AD vs AP ratio for this champion
  const { adRatio, apRatio } = getDamageRatio(enemyInfo.championName);

  // AD combo: (AD * 3) for abilities + (AD * attackSpeed * 5) for sustained autos
  const critMultiplier = 1 + critChance * (critDmg / 100);
  const adAbilityDamage = ad * 3;
  const adAutoDamage = ad * attackSpeed * 5 * critMultiplier;
  const totalADRaw = adAbilityDamage + adAutoDamage;

  // AP combo: (AP * 2.5) for burst
  const totalAPRaw = ap * 2.5;

  // Apply resistance reduction and archetype ratios
  const physDamage = totalADRaw * physMult * adRatio;
  const magDamage = totalAPRaw * magMult * apRatio;

  // Burst combo is ability-focused (3s window)
  const adBurstRaw = adAbilityDamage + (ad * attackSpeed * 3 * critMultiplier);
  const apBurstRaw = totalAPRaw;
  const comboDamage = (adBurstRaw * physMult * adRatio) + (apBurstRaw * magMult * apRatio);

  // Sustained DPS over 5 seconds
  const sustainedDPS = (physDamage + magDamage) / 5;

  // Ignite damage (true damage, not reduced)
  const ignite = igniteDamage(myLevel);

  // Execute bonus (estimated at 30% missing HP)
  const executeBonus = calculateExecuteDamage(
    enemyInfo.championName,
    enemyMaxHP,
    enemyMaxHP * 0.3,
    stats
  );

  // Execute threshold: HP at which combo + ignite + execute can finish them
  const executeThreshold = comboDamage + ignite + executeBonus;

  // canKillAtHP: what percentage of enemy HP we can oneshot from
  const canKillAtHP = Math.min(1, executeThreshold / enemyMaxHP);

  return {
    comboDamage: Math.round(comboDamage),
    sustainedDPS: Math.round(sustainedDPS),
    executeThreshold: Math.round(executeThreshold),
    canKillAtHP: Math.round(canKillAtHP * 100) / 100,
  };
}

/**
 * Determine if we can kill a specific target.
 * Uses screen reader HP data if available.
 */
export function canKillTarget(
  activePlayer: ActivePlayer,
  myInfo: PlayerInfo,
  enemyInfo: PlayerInfo
): { canKill: boolean; message: string } {
  const enemyLevel = enemyInfo.level;
  const enemyItemCount = enemyInfo.items.filter((i) => i.price >= 1000).length;

  const estimate = calculateDamage(activePlayer, {
    championName: enemyInfo.championName,
    level: enemyLevel,
    itemCount: enemyItemCount,
  });

  const enemyMaxHP = estimateEnemyHP(enemyLevel);

  // Try to get real HP from screen reader
  const hpReading = getEnemyHPEstimate();
  let currentHP: number;

  if (hpReading.detected && hpReading.confidence > 0.4) {
    currentHP = hpReading.healthPercent * enemyMaxHP;
  } else {
    // Assume they're near full HP if we can't detect
    currentHP = enemyMaxHP * 0.85;
  }

  // Check for ignite availability
  const hasIgnite =
    myInfo.summonerSpells.summonerSpellOne.displayName.toLowerCase().includes('ignite') ||
    myInfo.summonerSpells.summonerSpellOne.displayName.toLowerCase().includes('incendiar') ||
    myInfo.summonerSpells.summonerSpellTwo.displayName.toLowerCase().includes('ignite') ||
    myInfo.summonerSpells.summonerSpellTwo.displayName.toLowerCase().includes('incendiar');

  const totalDamage = hasIgnite
    ? estimate.executeThreshold
    : estimate.comboDamage;

  if (totalDamage >= currentHP) {
    const hpPercent = Math.round((currentHP / enemyMaxHP) * 100);
    return {
      canKill: true,
      message: `You can kill ${enemyInfo.championName} (~${hpPercent}% HP). Combo damage: ${estimate.comboDamage}${hasIgnite ? ` + Ignite ${igniteDamage(activePlayer.level)}` : ''}`,
    };
  }

  const deficit = Math.round(currentHP - totalDamage);
  return {
    canKill: false,
    message: `Need ~${deficit} more damage to kill ${enemyInfo.championName}. Poke first or wait for cooldowns.`,
  };
}

/**
 * Generate a coaching tip from a damage estimate.
 */
export function generateDamageTip(
  estimate: DamageEstimate,
  enemyChampion: string,
  enemyHP?: number
): CoachingTip | null {
  const enemyMaxHP = enemyHP ?? estimateEnemyHP(9); // default level 9

  // High kill potential
  if (estimate.canKillAtHP >= 0.7) {
    return {
      id: `dmg-kill-${enemyChampion}-${Date.now()}`,
      message: `High kill potential on ${enemyChampion}! You can oneshot from ${Math.round(estimate.canKillAtHP * 100)}% HP. Look for an all-in.`,
      priority: 'danger',
      category: 'trading',
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  // Moderate kill potential
  if (estimate.canKillAtHP >= 0.45) {
    return {
      id: `dmg-trade-${enemyChampion}-${Date.now()}`,
      message: `You can kill ${enemyChampion} if they drop below ${Math.round(estimate.canKillAtHP * 100)}% HP. Poke them down first, then all-in.`,
      priority: 'warning',
      category: 'trading',
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  // Low kill potential: only tip if enemy is actually low from screen reader
  const hpReading = getEnemyHPEstimate();
  if (hpReading.detected && hpReading.healthPercent < estimate.canKillAtHP && hpReading.confidence > 0.5) {
    return {
      id: `dmg-execute-${enemyChampion}-${Date.now()}`,
      message: `${enemyChampion} is low enough to kill! Go in now before they recall.`,
      priority: 'danger',
      category: 'trading',
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// 2. FightOutcomePredictor – Teamfight Win Probability
// ═══════════════════════════════════════════════════════════════════

export interface FightPrediction {
  winProbability: number;     // 0-1
  advantage: 'strong' | 'slight' | 'even' | 'disadvantage' | 'heavy_disadvantage';
  keyFactors: string[];       // ["Gold lead +3k", "Number advantage 5v4", "Enemy has no ults"]
  recommendation: 'force_fight' | 'fight_if_objective' | 'only_if_favorable' | 'avoid_fight';
}

interface CooldownInfo {
  enemyUltsDown?: number;
}

/**
 * Estimate a player's gold from their items, kills, assists, and CS.
 */
function estimatePlayerGold(player: PlayerInfo): number {
  const itemGold = player.items.reduce((sum, item) => sum + item.price * item.count, 0);
  const killGold = player.scores.kills * 300;
  const assistGold = player.scores.assists * 150;
  const csGold = player.scores.creepScore * 21; // ~21g per minion average
  return itemGold + killGold + assistGold + csGold;
}

/**
 * Predict the outcome of a teamfight given current game state.
 */
export function predictFightOutcome(
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS',
  gameTime: number,
  cooldowns?: CooldownInfo
): FightPrediction {
  const allies = allPlayers.filter((p) => p.team === myTeam);
  const enemies = allPlayers.filter((p) => p.team !== myTeam);

  const keyFactors: string[] = [];
  let winProb = 0.5; // Start at even

  // ── Factor 1: Gold advantage ──
  const allyGold = allies.reduce((sum, p) => sum + estimatePlayerGold(p), 0);
  const enemyGold = enemies.reduce((sum, p) => sum + estimatePlayerGold(p), 0);
  const goldDiff = allyGold - enemyGold;
  const goldAdv = (goldDiff / 1000) * 0.05; // +5% per 1000g
  winProb += goldAdv;

  if (Math.abs(goldDiff) >= 1000) {
    const sign = goldDiff > 0 ? '+' : '';
    keyFactors.push(`Gold ${sign}${Math.round(goldDiff / 100) * 100}`);
  }

  // ── Factor 2: Number advantage (alive members) ──
  const allyAlive = allies.filter((p) => !p.isDead).length;
  const enemyAlive = enemies.filter((p) => !p.isDead).length;
  const numberDiff = allyAlive - enemyAlive;
  const numberAdv = numberDiff * 0.10; // +10% per extra alive member
  winProb += numberAdv;

  if (numberDiff !== 0) {
    keyFactors.push(`${allyAlive}v${enemyAlive} numbers`);
  }

  // ── Factor 3: Ultimate availability ──
  const ultsDown = cooldowns?.enemyUltsDown ?? getEnemiesWithUltDown().length;
  if (ultsDown >= 3) {
    winProb += 0.10;
    keyFactors.push(`${ultsDown} enemy ults down`);
  } else if (ultsDown >= 1) {
    winProb += ultsDown * 0.03;
    keyFactors.push(`${ultsDown} enemy ult${ultsDown > 1 ? 's' : ''} down`);
  }

  // ── Factor 4: Level advantage ──
  const allyLevels = allies.reduce((sum, p) => sum + p.level, 0);
  const enemyLevels = enemies.reduce((sum, p) => sum + p.level, 0);
  const levelDiff = allyLevels - enemyLevels;
  const levelAdv = levelDiff * 0.01; // +1% per level
  winProb += levelAdv;

  if (Math.abs(levelDiff) >= 2) {
    const sign = levelDiff > 0 ? '+' : '';
    keyFactors.push(`Level diff ${sign}${levelDiff}`);
  }

  // ── Factor 5: Game phase comp advantage ──
  // Late game favors scaling comps (marksman, mage)
  // Early game favors early-game archetypes (assassin, bruiser, diver)
  const gamePhaseMinutes = gameTime / 60;

  const allyScalingScore = allies.reduce((score, p) => {
    const meta = getChampionMeta(p.championName);
    if (!meta) return score;
    if (meta.archetypes.includes('marksman')) score += 2;
    if (meta.archetypes.includes('mage')) score += 1.5;
    if (meta.archetypes.includes('enchanter')) score += 1;
    if (meta.archetypes.includes('tank')) score += 0.5;
    return score;
  }, 0);

  const enemyScalingScore = enemies.reduce((score, p) => {
    const meta = getChampionMeta(p.championName);
    if (!meta) return score;
    if (meta.archetypes.includes('marksman')) score += 2;
    if (meta.archetypes.includes('mage')) score += 1.5;
    if (meta.archetypes.includes('enchanter')) score += 1;
    if (meta.archetypes.includes('tank')) score += 0.5;
    return score;
  }, 0);

  const scalingDiff = allyScalingScore - enemyScalingScore;

  if (gamePhaseMinutes > 25 && scalingDiff > 2) {
    winProb += 0.05;
    keyFactors.push('Late game comp advantage');
  } else if (gamePhaseMinutes > 25 && scalingDiff < -2) {
    winProb -= 0.05;
    keyFactors.push('Enemy scales better');
  } else if (gamePhaseMinutes < 15 && scalingDiff < -2) {
    winProb += 0.05;
    keyFactors.push('Early game comp advantage');
  } else if (gamePhaseMinutes < 15 && scalingDiff > 2) {
    winProb -= 0.05;
    keyFactors.push('Enemy is stronger early');
  }

  // ── Factor 6: Kill/death momentum ──
  const allyKDA = allies.reduce((sum, p) => sum + p.scores.kills + p.scores.assists, 0);
  const enemyKDA = enemies.reduce((sum, p) => sum + p.scores.kills + p.scores.assists, 0);
  if (allyKDA > enemyKDA + 10) {
    winProb += 0.05;
    keyFactors.push('Strong KDA lead');
  } else if (enemyKDA > allyKDA + 10) {
    winProb -= 0.05;
    keyFactors.push('Enemy has KDA lead');
  }

  // Clamp probability
  winProb = Math.max(0.05, Math.min(0.95, winProb));

  // Determine advantage label
  let advantage: FightPrediction['advantage'];
  if (winProb >= 0.65) advantage = 'strong';
  else if (winProb >= 0.55) advantage = 'slight';
  else if (winProb >= 0.45) advantage = 'even';
  else if (winProb >= 0.35) advantage = 'disadvantage';
  else advantage = 'heavy_disadvantage';

  // Determine recommendation
  let recommendation: FightPrediction['recommendation'];
  if (winProb >= 0.65) recommendation = 'force_fight';
  else if (winProb >= 0.55) recommendation = 'fight_if_objective';
  else if (winProb >= 0.45) recommendation = 'only_if_favorable';
  else recommendation = 'avoid_fight';

  if (keyFactors.length === 0) {
    keyFactors.push('Teams are closely matched');
  }

  return {
    winProbability: Math.round(winProb * 100) / 100,
    advantage,
    keyFactors,
    recommendation,
  };
}

/**
 * Generate a coaching tip from a fight prediction.
 */
export function generateFightPredictionTip(prediction: FightPrediction): CoachingTip | null {
  const { winProbability, advantage, keyFactors, recommendation } = prediction;
  const probPercent = Math.round(winProbability * 100);

  let message: string;
  let priority: CoachingTip['priority'];

  switch (recommendation) {
    case 'force_fight':
      message = `Fight now! ${probPercent}% win chance. ${keyFactors[0]}. Force a teamfight or objective.`;
      priority = 'danger';
      break;
    case 'fight_if_objective':
      message = `Favorable fight (${probPercent}%). ${keyFactors[0]}. Fight if there's an objective to contest.`;
      priority = 'warning';
      break;
    case 'only_if_favorable':
      message = `Even fight (${probPercent}%). ${keyFactors[0]}. Only fight if you get a good engage or catch.`;
      priority = 'info';
      break;
    case 'avoid_fight':
      message = `Avoid fighting (${probPercent}% win chance). ${keyFactors[0]}. Play safe and wait for a better moment.`;
      priority = 'warning';
      break;
  }

  // Only generate tips for non-even scenarios or if there's a notable factor
  if (advantage === 'even' && keyFactors.length <= 1) {
    return null;
  }

  return {
    id: `fight-${advantage}-${Date.now()}`,
    message,
    priority,
    category: 'teamfight',
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 3. ObjectiveSetupEngine – Pre-objective Coaching
// ═══════════════════════════════════════════════════════════════════

export interface ObjectiveSetup {
  objective: string;          // "Dragon" / "Baron" / "Herald"
  timeUntilSpawn: number;     // seconds
  setupPhase: 'early_setup' | 'final_setup' | 'contest' | 'not_needed';
  actions: string[];          // ["Push mid wave", "Ward dragon pit", "Group bot side"]
}

const OBJECTIVE_DISPLAY_NAMES: Record<ObjectiveType, string> = {
  dragon: 'Dragon',
  baron: 'Baron',
  herald: 'Herald',
};

/**
 * Get role-specific actions for objective preparation.
 */
function getRoleActions(
  role: string,
  objective: ObjectiveType,
  phase: ObjectiveSetup['setupPhase']
): string[] {
  const normalizedRole = role.toLowerCase();
  const objectiveSide = objective === 'baron' || objective === 'herald' ? 'top' : 'bot';
  const oppositeSide = objectiveSide === 'top' ? 'bot' : 'top';

  if (phase === 'not_needed') return [];

  // Base actions by role
  const roleActions: Record<string, Record<ObjectiveSetup['setupPhase'], string[]>> = {
    bottom: {
      early_setup: [
        `Push ${oppositeSide} wave toward enemy tower`,
        `Start moving toward ${OBJECTIVE_DISPLAY_NAMES[objective]} side`,
      ],
      final_setup: [
        `Group with team near ${OBJECTIVE_DISPLAY_NAMES[objective]}`,
        'Stay behind your frontline',
      ],
      contest: [
        `Fight for ${OBJECTIVE_DISPLAY_NAMES[objective]} if you have number advantage`,
        'Focus on staying alive and dealing damage safely',
      ],
      not_needed: [],
    },
    utility: {
      early_setup: [
        `Set up vision around ${OBJECTIVE_DISPLAY_NAMES[objective]} pit`,
        `Place control ward near ${OBJECTIVE_DISPLAY_NAMES[objective]}`,
      ],
      final_setup: [
        `Sweep enemy wards around ${OBJECTIVE_DISPLAY_NAMES[objective]} pit`,
        'Stay near your ADC',
      ],
      contest: [
        `Fight for ${OBJECTIVE_DISPLAY_NAMES[objective]} if you have number advantage`,
        'Protect your carries',
      ],
      not_needed: [],
    },
    middle: {
      early_setup: [
        'Push mid wave to gain priority',
        `Rotate toward ${OBJECTIVE_DISPLAY_NAMES[objective]} side`,
      ],
      final_setup: [
        `Group with team near ${OBJECTIVE_DISPLAY_NAMES[objective]}`,
        'Look for pick potential on enemy rotations',
      ],
      contest: [
        `Fight for ${OBJECTIVE_DISPLAY_NAMES[objective]} if you have number advantage`,
        'Use abilities to zone enemies from pit',
      ],
      not_needed: [],
    },
    top: {
      early_setup: [
        'Push top wave before rotating',
        objective === 'baron' || objective === 'herald' ? 'Move to objective' : 'TP if needed',
      ],
      final_setup: [
        objective === 'baron' || objective === 'herald'
          ? `Group with team near ${OBJECTIVE_DISPLAY_NAMES[objective]}`
          : 'Split push top or TP to fight',
        'Apply pressure in side lane if TP is available',
      ],
      contest: [
        `Fight for ${OBJECTIVE_DISPLAY_NAMES[objective]} if you have number advantage`,
        'Flank or use TP for surprise engage',
      ],
      not_needed: [],
    },
    jungle: {
      early_setup: [
        `Clear camps near ${OBJECTIVE_DISPLAY_NAMES[objective]}`,
        `Check ${OBJECTIVE_DISPLAY_NAMES[objective]} timer and plan pathing`,
      ],
      final_setup: [
        `Position for smite on ${OBJECTIVE_DISPLAY_NAMES[objective]}`,
        'Make sure you have smite available',
      ],
      contest: [
        `Secure ${OBJECTIVE_DISPLAY_NAMES[objective]} with smite`,
        'Do not smite too early - wait until it is low',
      ],
      not_needed: [],
    },
  };

  const actions = roleActions[normalizedRole];
  if (actions) {
    return actions[phase] ?? [];
  }

  // Fallback: try to match common position values from Riot API
  if (normalizedRole === 'adc' || normalizedRole === 'bot') {
    return roleActions['bottom']?.[phase] ?? [];
  }
  if (normalizedRole === 'support' || normalizedRole === 'sup') {
    return roleActions['utility']?.[phase] ?? [];
  }
  if (normalizedRole === 'mid') {
    return roleActions['middle']?.[phase] ?? [];
  }
  if (normalizedRole === 'jg' || normalizedRole === 'jng') {
    return roleActions['jungle']?.[phase] ?? [];
  }

  // Generic fallback
  switch (phase) {
    case 'early_setup':
      return ['Push your wave', `Start moving toward ${OBJECTIVE_DISPLAY_NAMES[objective]}`];
    case 'final_setup':
      return [`Group with team for ${OBJECTIVE_DISPLAY_NAMES[objective]}`];
    case 'contest':
      return [`Fight for ${OBJECTIVE_DISPLAY_NAMES[objective]} if favorable`];
    default:
      return [];
  }
}

/**
 * Determine the setup phase based on time until objective spawns.
 */
function getSetupPhase(
  status: ObjectiveInfo['status'],
  timeUntilSpawn: number
): ObjectiveSetup['setupPhase'] {
  if (status === 'alive') return 'contest';
  if (status === 'dead') {
    if (timeUntilSpawn <= 0) return 'contest'; // about to spawn
    if (timeUntilSpawn <= 30) return 'final_setup';
    if (timeUntilSpawn <= 60) return 'final_setup';
    if (timeUntilSpawn <= 90) return 'early_setup';
    return 'not_needed';
  }
  // spawning
  if (timeUntilSpawn <= 30) return 'final_setup';
  if (timeUntilSpawn <= 90) return 'early_setup';
  return 'not_needed';
}

/**
 * Get objective setup coaching for the highest priority objective.
 */
export function getObjectiveSetup(
  objectives: ObjectiveInfo[],
  gameTime: number,
  myRole: string
): ObjectiveSetup | null {
  // Prioritize objectives: Baron > Dragon > Herald
  const priority: ObjectiveType[] = ['baron', 'dragon', 'herald'];

  for (const objectiveType of priority) {
    const obj = objectives.find((o) => o.type === objectiveType);
    if (!obj) continue;

    // Herald is only relevant before 20 minutes
    if (objectiveType === 'herald' && gameTime > 1200) continue;

    // Baron is only relevant after 20 minutes
    if (objectiveType === 'baron' && gameTime < 1200) continue;

    let timeUntilSpawn: number;

    if (obj.status === 'alive') {
      timeUntilSpawn = 0; // It's up now
    } else if (obj.timer > 0) {
      timeUntilSpawn = obj.timer - gameTime;
    } else {
      continue; // No known timer
    }

    const phase = getSetupPhase(obj.status, timeUntilSpawn);
    if (phase === 'not_needed') continue;

    const actions = getRoleActions(myRole, objectiveType, phase);

    return {
      objective: OBJECTIVE_DISPLAY_NAMES[objectiveType],
      timeUntilSpawn: Math.max(0, Math.round(timeUntilSpawn)),
      setupPhase: phase,
      actions,
    };
  }

  return null;
}

/**
 * Generate a coaching tip from objective setup info.
 */
export function generateObjectiveSetupTip(setup: ObjectiveSetup): CoachingTip | null {
  if (setup.actions.length === 0) return null;

  let priority: CoachingTip['priority'];
  let message: string;

  switch (setup.setupPhase) {
    case 'early_setup':
      priority = 'info';
      message = `${setup.objective} spawns in ${setup.timeUntilSpawn}s. ${setup.actions[0]}.`;
      break;
    case 'final_setup':
      priority = 'warning';
      message = `${setup.objective} spawning soon (${setup.timeUntilSpawn}s)! ${setup.actions.join('. ')}.`;
      break;
    case 'contest':
      priority = 'danger';
      message = `${setup.objective} is up! ${setup.actions.join('. ')}.`;
      break;
    default:
      return null;
  }

  return {
    id: `obj-${setup.objective.toLowerCase()}-${setup.setupPhase}-${Date.now()}`,
    message,
    priority,
    category: 'objective',
    timestamp: Date.now(),
    dismissed: false,
  };
}
