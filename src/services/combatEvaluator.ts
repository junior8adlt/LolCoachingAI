import type { ActivePlayer, PlayerInfo } from '../types/game';
import type { CoachingTip } from '../types/coaching';
import { getChampionMeta } from '../data/championMeta';
import type { ChampionArchetype } from '../data/championMeta';
import { getEnemyCooldowns } from './cooldownTracker';
import type { EnemyCooldowns } from './cooldownTracker';
import { getEnemyHPEstimate } from './screenReader';
import type { WaveState } from './waveEngine';

// ── Combat / Kill Probability Evaluator ──
// Calculates whether the player can kill the enemy in a fight,
// using data from the Riot Live Client Data API + tracked cooldowns + screen reading.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CombatResult {
  killProbability: number;       // 0-1 chance you kill them
  deathProbability: number;      // 0-1 chance they kill you
  tradeAdvantage: 'win' | 'lose' | 'even';
  burstDamageEstimate: number;   // Your estimated burst damage
  sustainDamageEstimate: number; // Your DPS over 5 seconds
  recommendation: 'all-in' | 'short-trade' | 'poke' | 'disengage' | 'avoid';
  reason: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Archetypes that deal primarily physical (AD) damage. */
const AD_ARCHETYPES: ReadonlySet<ChampionArchetype> = new Set([
  'marksman',
  'assassin',  // most AD assassins; AP assassins handled by mage overlap
  'skirmisher',
  'juggernaut',
  'bruiser',
  'diver',
]);

/** Archetypes that deal primarily magic (AP) damage. */
const AP_ARCHETYPES: ReadonlySet<ChampionArchetype> = new Set([
  'mage',
  'enchanter',
  'artillery',
]);

/** Base HP per level (rough average across all champions). */
const BASE_HP_PER_LEVEL = 95;
/** Base HP at level 1 (rough average). */
const BASE_HP_LEVEL_1 = 600;

/** Rough average base armor per champion at each level. */
const BASE_ARMOR_PER_LEVEL = 4.2;
const BASE_ARMOR_LEVEL_1 = 32;

/** Rough average base MR per champion at each level. */
const BASE_MR_PER_LEVEL = 1.25;
const BASE_MR_LEVEL_1 = 30;

/** Ignite true damage range by level bracket. */
const IGNITE_DAMAGE: Record<number, number> = {
  1: 70, 2: 80, 3: 90, 4: 100, 5: 110,
  6: 130, 7: 150, 8: 170, 9: 190, 10: 210,
  11: 230, 12: 250, 13: 270, 14: 290, 15: 310,
  16: 330, 17: 350, 18: 410,
};

/** Known armor item keywords (display names from Riot API). */
const ARMOR_ITEM_KEYWORDS = [
  'plated steelcaps', 'thornmail', 'randuin', 'frozen heart',
  'dead man', 'sunfire', 'iceborn', 'warden', 'chain vest',
  'cloth armor', 'bramble vest', 'steel sigil', 'jak\'sho',
];

/** Known MR item keywords. */
const MR_ITEM_KEYWORDS = [
  'mercury', 'spirit visage', 'force of nature', 'banshee',
  'abyssal', 'wit\'s end', 'maw', 'hexdrinker', 'hollow radiance',
  'negatron', 'null-magic', 'kaenic',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Determine whether a champion is primarily AD or AP based on their archetypes.
 * Returns 'ad', 'ap', or 'mixed'.
 */
function getDamageType(championName: string): 'ad' | 'ap' | 'mixed' {
  const meta = getChampionMeta(championName);
  if (!meta) return 'ad'; // default to AD if unknown

  let adScore = 0;
  let apScore = 0;

  for (const arch of meta.archetypes) {
    if (AD_ARCHETYPES.has(arch)) adScore++;
    if (AP_ARCHETYPES.has(arch)) apScore++;
  }

  if (adScore > 0 && apScore > 0) return 'mixed';
  if (apScore > 0) return 'ap';
  return 'ad';
}

/**
 * Count completed items (price >= 2000 is a rough heuristic for completed items).
 */
function countCompletedItems(items: PlayerInfo['items']): number {
  return items.filter((item) => item.price >= 2000 && !item.consumable).length;
}

/**
 * Check whether the enemy has armor-heavy items.
 */
function hasArmorItems(items: PlayerInfo['items']): boolean {
  return items.some((item) => {
    const name = item.displayName.toLowerCase();
    return ARMOR_ITEM_KEYWORDS.some((kw) => name.includes(kw));
  });
}

/**
 * Check whether the enemy has MR-heavy items.
 */
function hasMRItems(items: PlayerInfo['items']): boolean {
  return items.some((item) => {
    const name = item.displayName.toLowerCase();
    return MR_ITEM_KEYWORDS.some((kw) => name.includes(kw));
  });
}

/**
 * Check whether the player has Ignite equipped.
 */
function hasIgnite(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.displayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.displayName.toLowerCase();
  return s1.includes('ignite') || s1.includes('incendiar')
    || s2.includes('ignite') || s2.includes('incendiar');
}

/**
 * Estimate enemy base HP from level.
 */
function estimateBaseHP(level: number): number {
  return BASE_HP_LEVEL_1 + BASE_HP_PER_LEVEL * (level - 1);
}

/**
 * Estimate enemy armor from level.
 */
function estimateBaseArmor(level: number): number {
  return BASE_ARMOR_LEVEL_1 + BASE_ARMOR_PER_LEVEL * (level - 1);
}

/**
 * Estimate enemy MR from level.
 */
function estimateBaseMR(level: number): number {
  return BASE_MR_LEVEL_1 + BASE_MR_PER_LEVEL * (level - 1);
}

/**
 * Calculate the damage multiplier from resistance.
 * reduction = resistance / (100 + resistance)
 * So incoming damage is multiplied by 100 / (100 + resistance).
 */
function damageMultiplierFromResistance(resistance: number): number {
  if (resistance < 0) return 2 - 100 / (100 - resistance); // negative resist edge case
  return 100 / (100 + resistance);
}

/**
 * Estimate the enemy's effective HP against a given damage type,
 * factoring in their estimated resistances and items.
 */
function estimateEnemyEffectiveHP(
  enemy: PlayerInfo,
  damageType: 'ad' | 'ap' | 'mixed',
): number {
  const baseHP = estimateBaseHP(enemy.level);
  const completedItems = countCompletedItems(enemy.items);

  // Add effective HP from items
  let rawHP = baseHP + completedItems * 300; // HP portion of items

  // Estimate resistances
  let armor = estimateBaseArmor(enemy.level);
  let mr = estimateBaseMR(enemy.level);

  if (hasArmorItems(enemy.items)) armor += 60 * Math.min(completedItems, 3);
  if (hasMRItems(enemy.items)) mr += 50 * Math.min(completedItems, 3);

  // Factor in screen-read HP estimate if available
  const hpReading = getEnemyHPEstimate();
  if (hpReading.detected && hpReading.confidence > 0.3) {
    rawHP = rawHP * hpReading.healthPercent;
  }

  // Calculate effective HP based on which damage type we deal
  switch (damageType) {
    case 'ad':
      return rawHP * (1 + armor / 100);
    case 'ap':
      return rawHP * (1 + mr / 100);
    case 'mixed': {
      // Average of physical and magic EHP
      const physEHP = rawHP * (1 + armor / 100);
      const magicEHP = rawHP * (1 + mr / 100);
      return (physEHP + magicEHP) / 2;
    }
  }
}

/**
 * Estimate your burst damage output (full combo).
 */
function estimateBurstDamage(
  activePlayer: ActivePlayer,
  myChampionName: string,
  enemyArmor: number,
  enemyMR: number,
): number {
  const stats = activePlayer.championStats;
  const dmgType = getDamageType(myChampionName);

  let rawDamage = 0;

  if (dmgType === 'ap') {
    // AP combo: AP * 3 rough multiplier (accounts for base damages + ratios)
    rawDamage = stats.abilityPower * 3 + 100 + (activePlayer.level * 15);
  } else if (dmgType === 'ad') {
    // AD burst: several autos + ability base damages scaled with AD
    const autoDamage = stats.attackDamage * (1 + stats.critChance * (stats.critDamage / 100 - 1));
    // Rough 2 autos + abilities ~ 2.5x AD + level base
    rawDamage = autoDamage * 2.5 + stats.attackDamage * 1.5 + activePlayer.level * 10;
  } else {
    // Mixed: combination of both
    const adPortion = stats.attackDamage * 2 + activePlayer.level * 8;
    const apPortion = stats.abilityPower * 2 + activePlayer.level * 10;
    rawDamage = adPortion + apPortion;
  }

  // Apply penetration and resistance reduction
  let effectiveDamage = 0;
  if (dmgType === 'ad') {
    const effectiveArmor = Math.max(0,
      enemyArmor * (1 - stats.armorPenetrationPercent / 100)
      - stats.armorPenetrationFlat
      - stats.physicalLethality
    );
    effectiveDamage = rawDamage * damageMultiplierFromResistance(effectiveArmor);
  } else if (dmgType === 'ap') {
    const effectiveMR = Math.max(0,
      enemyMR * (1 - stats.magicPenetrationPercent / 100)
      - stats.magicPenetrationFlat
      - stats.magicLethality
    );
    effectiveDamage = rawDamage * damageMultiplierFromResistance(effectiveMR);
  } else {
    // Mixed: split damage
    const adRaw = rawDamage * 0.5;
    const apRaw = rawDamage * 0.5;
    const effectiveArmor = Math.max(0,
      enemyArmor * (1 - stats.armorPenetrationPercent / 100)
      - stats.armorPenetrationFlat
      - stats.physicalLethality
    );
    const effectiveMR = Math.max(0,
      enemyMR * (1 - stats.magicPenetrationPercent / 100)
      - stats.magicPenetrationFlat
      - stats.magicLethality
    );
    effectiveDamage =
      adRaw * damageMultiplierFromResistance(effectiveArmor)
      + apRaw * damageMultiplierFromResistance(effectiveMR);
  }

  return Math.max(0, effectiveDamage);
}

/**
 * Estimate your sustained damage over 5 seconds (autos + repeated abilities).
 */
function estimateSustainDamage(
  activePlayer: ActivePlayer,
  myChampionName: string,
  enemyArmor: number,
  enemyMR: number,
): number {
  const stats = activePlayer.championStats;
  const dmgType = getDamageType(myChampionName);

  let rawDamage = 0;

  // 5 seconds of auto-attacks
  const autoCount = stats.attackSpeed * 5;
  const critMultiplier = 1 + stats.critChance * (stats.critDamage / 100 - 1);
  const autoDPS = stats.attackDamage * critMultiplier * autoCount;

  if (dmgType === 'ap') {
    // AP sustained: autos + repeated abilities
    rawDamage = autoDPS + stats.abilityPower * 4 + activePlayer.level * 20;
  } else if (dmgType === 'ad') {
    // AD sustained: autos are primary + some ability rotations
    rawDamage = autoDPS + stats.attackDamage * 2 + activePlayer.level * 12;
  } else {
    rawDamage = autoDPS + stats.attackDamage * 1.5 + stats.abilityPower * 2.5 + activePlayer.level * 15;
  }

  // Apply penetration
  let effectiveDamage = 0;
  if (dmgType === 'ad') {
    const effectiveArmor = Math.max(0,
      enemyArmor * (1 - stats.armorPenetrationPercent / 100)
      - stats.armorPenetrationFlat
      - stats.physicalLethality
    );
    effectiveDamage = rawDamage * damageMultiplierFromResistance(effectiveArmor);
  } else if (dmgType === 'ap') {
    const effectiveMR = Math.max(0,
      enemyMR * (1 - stats.magicPenetrationPercent / 100)
      - stats.magicPenetrationFlat
      - stats.magicLethality
    );
    effectiveDamage = rawDamage * damageMultiplierFromResistance(effectiveMR);
  } else {
    const adRaw = rawDamage * 0.5;
    const apRaw = rawDamage * 0.5;
    const effectiveArmor = Math.max(0,
      enemyArmor * (1 - stats.armorPenetrationPercent / 100)
      - stats.armorPenetrationFlat
      - stats.physicalLethality
    );
    const effectiveMR = Math.max(0,
      enemyMR * (1 - stats.magicPenetrationPercent / 100)
      - stats.magicPenetrationFlat
      - stats.magicLethality
    );
    effectiveDamage =
      adRaw * damageMultiplierFromResistance(effectiveArmor)
      + apRaw * damageMultiplierFromResistance(effectiveMR);
  }

  return Math.max(0, effectiveDamage);
}

/**
 * Estimate the enemy's potential damage to you over 5 seconds.
 * This is a rough mirror of your own damage calc but using enemy-level estimates.
 */
function estimateEnemyDamageToYou(
  activePlayer: ActivePlayer,
  enemy: PlayerInfo,
): number {
  const myArmor = activePlayer.championStats.armor;
  const myMR = activePlayer.championStats.magicResist;
  const enemyDmgType = getDamageType(enemy.championName);

  // Estimate enemy AD/AP from level and items
  const completedItems = countCompletedItems(enemy.items);
  let estimatedAD = 60 + enemy.level * 3.5 + completedItems * 30;
  let estimatedAP = 0;

  if (enemyDmgType === 'ap') {
    estimatedAP = completedItems * 80 + enemy.level * 5;
    estimatedAD = 50 + enemy.level * 3; // base AD only
  } else if (enemyDmgType === 'mixed') {
    estimatedAP = completedItems * 50 + enemy.level * 3;
    estimatedAD = 55 + enemy.level * 3 + completedItems * 20;
  }

  let rawDamage = 0;

  if (enemyDmgType === 'ad') {
    // 5s of autos + abilities
    rawDamage = estimatedAD * 5 + estimatedAD * 2 + enemy.level * 12;
  } else if (enemyDmgType === 'ap') {
    rawDamage = estimatedAP * 3.5 + estimatedAD * 2 + enemy.level * 15;
  } else {
    rawDamage = estimatedAD * 3 + estimatedAP * 2.5 + enemy.level * 14;
  }

  // Apply your resistances
  let effectiveDamage = 0;
  if (enemyDmgType === 'ad') {
    effectiveDamage = rawDamage * damageMultiplierFromResistance(myArmor);
  } else if (enemyDmgType === 'ap') {
    effectiveDamage = rawDamage * damageMultiplierFromResistance(myMR);
  } else {
    const adPortion = rawDamage * 0.5 * damageMultiplierFromResistance(myArmor);
    const apPortion = rawDamage * 0.5 * damageMultiplierFromResistance(myMR);
    effectiveDamage = adPortion + apPortion;
  }

  return Math.max(0, effectiveDamage);
}

// ---------------------------------------------------------------------------
// Core evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluate combat outcome between you and an enemy champion.
 *
 * @param activePlayer - Your stats from the Riot Live Client Data API.
 * @param myInfo       - Your PlayerInfo from allPlayers.
 * @param enemyInfo    - The enemy PlayerInfo from allPlayers.
 * @param cooldowns    - Optional: enemy cooldown tracking data.
 * @param waveState    - Optional: current wave state for minion aggro consideration.
 */
export function evaluateCombat(
  activePlayer: ActivePlayer,
  myInfo: PlayerInfo,
  enemyInfo: PlayerInfo,
  cooldowns?: EnemyCooldowns | null,
  waveState?: WaveState,
): CombatResult {
  // If enemy is dead, no fight to evaluate
  if (enemyInfo.isDead) {
    return {
      killProbability: 0,
      deathProbability: 0,
      tradeAdvantage: 'even',
      burstDamageEstimate: 0,
      sustainDamageEstimate: 0,
      recommendation: 'avoid',
      reason: 'Enemy is dead. Focus on farming and objectives.',
    };
  }

  const stats = activePlayer.championStats;
  const myDmgType = getDamageType(myInfo.championName);

  // ── Estimate enemy resistances ──
  let enemyArmor = estimateBaseArmor(enemyInfo.level);
  let enemyMR = estimateBaseMR(enemyInfo.level);
  if (hasArmorItems(enemyInfo.items)) {
    enemyArmor += 60 * Math.min(countCompletedItems(enemyInfo.items), 3);
  }
  if (hasMRItems(enemyInfo.items)) {
    enemyMR += 50 * Math.min(countCompletedItems(enemyInfo.items), 3);
  }

  // ── Damage estimates ──
  const burstDamage = estimateBurstDamage(activePlayer, myInfo.championName, enemyArmor, enemyMR);
  const sustainDamage = estimateSustainDamage(activePlayer, myInfo.championName, enemyArmor, enemyMR);
  const enemyDamageToMe = estimateEnemyDamageToYou(activePlayer, enemyInfo);

  // ── Enemy effective HP ──
  const enemyEHP = estimateEnemyEffectiveHP(enemyInfo, myDmgType);

  // ── My effective HP ──
  const myHP = stats.currentHealth;
  // We use current (not max) because fight happens right now
  const myEffectiveHP = myHP; // already accounting for our actual health

  // ── Base kill probability: can our sustained damage kill their EHP? ──
  let killProb = Math.min(1, sustainDamage / Math.max(1, enemyEHP));

  // ── Base death probability: can their damage kill our effective HP? ──
  let deathProb = Math.min(1, enemyDamageToMe / Math.max(1, myEffectiveHP));

  // ── Kill Modifiers ──

  // 1. Ignite bonus
  if (hasIgnite(myInfo)) {
    const igniteDmg = IGNITE_DAMAGE[activePlayer.level] ?? 200;
    killProb = Math.min(1, killProb + igniteDmg / Math.max(1, enemyEHP));
  }

  // 2. Level advantage
  const levelDiff = activePlayer.level - enemyInfo.level;
  if (levelDiff !== 0) {
    const levelModifier = levelDiff * 0.08;
    killProb = Math.min(1, Math.max(0, killProb + levelModifier));
    deathProb = Math.min(1, Math.max(0, deathProb - levelModifier));
  }

  // 3. Item advantage
  const myCompleted = countCompletedItems(myInfo.items);
  const enemyCompleted = countCompletedItems(enemyInfo.items);
  const itemDiff = myCompleted - enemyCompleted;
  if (itemDiff !== 0) {
    const itemModifier = itemDiff * 0.15;
    killProb = Math.min(1, Math.max(0, killProb + itemModifier));
    deathProb = Math.min(1, Math.max(0, deathProb - itemModifier));
  }

  // 4. Enemy flash down (from cooldown tracker)
  const cd = cooldowns ?? getEnemyCooldowns(enemyInfo.summonerName);
  if (cd?.flashDown) {
    killProb = Math.min(1, killProb + 0.15);
  }
  if (cd?.ultDown) {
    deathProb = Math.max(0, deathProb - 0.10);
    killProb = Math.min(1, killProb + 0.05);
  }

  // 5. HP screen-read: if enemy is visibly low, boost kill probability
  const hpReading = getEnemyHPEstimate();
  if (hpReading.detected && hpReading.confidence > 0.4) {
    if (hpReading.healthPercent < 0.3) {
      killProb = Math.min(1, killProb + 0.25);
    } else if (hpReading.healthPercent < 0.5) {
      killProb = Math.min(1, killProb + 0.12);
    }
  }

  // 6. Your own HP: if you are low, adjust death probability up
  const myHPPercent = stats.currentHealth / Math.max(1, stats.maxHealth);
  if (myHPPercent < 0.3) {
    deathProb = Math.min(1, deathProb + 0.25);
    killProb = Math.max(0, killProb - 0.10);
  } else if (myHPPercent < 0.5) {
    deathProb = Math.min(1, deathProb + 0.10);
    killProb = Math.max(0, killProb - 0.05);
  }

  // 7. Wave state: trading in enemy wave costs HP
  if (waveState === 'pushing_to_you' || waveState === 'frozen_near_enemy') {
    deathProb = Math.min(1, deathProb + 0.10);
    killProb = Math.max(0, killProb - 0.05);
  } else if (waveState === 'pushing_to_enemy' || waveState === 'frozen_near_you') {
    killProb = Math.min(1, killProb + 0.05);
  }

  // 8. Enemy scores: if enemy is fed, adjust
  const enemyKDA = (enemyInfo.scores.kills + enemyInfo.scores.assists)
    / Math.max(1, enemyInfo.scores.deaths);
  if (enemyKDA > 4) {
    deathProb = Math.min(1, deathProb + 0.10);
    killProb = Math.max(0, killProb - 0.08);
  } else if (enemyKDA < 1) {
    killProb = Math.min(1, killProb + 0.08);
    deathProb = Math.max(0, deathProb - 0.05);
  }

  // ── Clamp final values ──
  killProb = Math.min(1, Math.max(0, killProb));
  deathProb = Math.min(1, Math.max(0, deathProb));

  // ── Determine trade advantage ──
  let tradeAdvantage: CombatResult['tradeAdvantage'];
  if (killProb - deathProb > 0.15) {
    tradeAdvantage = 'win';
  } else if (deathProb - killProb > 0.15) {
    tradeAdvantage = 'lose';
  } else {
    tradeAdvantage = 'even';
  }

  // ── Determine recommendation and reason ──
  let recommendation: CombatResult['recommendation'];
  let reason: string;

  if (killProb > 0.7) {
    recommendation = 'all-in';
    reason = 'All-in window! You can kill them.';
    if (cd?.flashDown) reason += ' Enemy flash is down.';
    if (levelDiff >= 2) reason += ` You are ${levelDiff} levels ahead.`;
    if (itemDiff >= 1) reason += ` You have ${itemDiff} item advantage.`;
  } else if (killProb > 0.5) {
    recommendation = 'short-trade';
    reason = 'Favorable trade. Look for a short trade.';
    if (killProb > 0.6) reason += ' Consider committing if they waste a key ability.';
  } else if (killProb > 0.3) {
    recommendation = 'poke';
    reason = 'Poke only. Don\'t commit to an all-in.';
    if (deathProb > 0.5) reason += ' They can kill you if you overextend.';
  } else if (deathProb > 0.5) {
    recommendation = 'avoid';
    reason = 'Avoid fighting. Farm safely.';
    if (deathProb > 0.7) reason += ' High risk of dying if you engage.';
    if (enemyKDA > 4) reason += ' Enemy is fed.';
  } else {
    recommendation = 'disengage';
    reason = 'Unfavorable fight. Disengage and wait for a better opportunity.';
    if (levelDiff < 0) reason += ` You are ${Math.abs(levelDiff)} level(s) behind.`;
    if (itemDiff < 0) reason += ` You are ${Math.abs(itemDiff)} item(s) behind.`;
  }

  return {
    killProbability: Math.round(killProb * 100) / 100,
    deathProbability: Math.round(deathProb * 100) / 100,
    tradeAdvantage,
    burstDamageEstimate: Math.round(burstDamage),
    sustainDamageEstimate: Math.round(sustainDamage),
    recommendation,
    reason,
  };
}

// ---------------------------------------------------------------------------
// Convenience: quick kill probability
// ---------------------------------------------------------------------------

/**
 * Returns just the kill probability (0-1) for quick checks.
 */
export function getKillProbability(
  activePlayer: ActivePlayer,
  myInfo: PlayerInfo,
  enemyInfo: PlayerInfo,
): number {
  const result = evaluateCombat(activePlayer, myInfo, enemyInfo);
  return result.killProbability;
}

// ---------------------------------------------------------------------------
// Coaching tip generation
// ---------------------------------------------------------------------------

let lastCombatTipTime = 0;
const COMBAT_TIP_COOLDOWN_MS = 12000; // Don't spam combat tips

/**
 * Generate a coaching tip from a combat evaluation result.
 * Returns null if the situation doesn't warrant a tip or tip is on cooldown.
 */
export function generateCombatTip(
  result: CombatResult,
  enemyChampion: string,
): CoachingTip | null {
  const now = Date.now();
  if (now - lastCombatTipTime < COMBAT_TIP_COOLDOWN_MS) {
    return null;
  }

  // Only generate tips for actionable situations
  if (result.recommendation === 'poke' && result.killProbability < 0.35) {
    return null; // Not interesting enough
  }

  let message: string;
  let priority: CoachingTip['priority'];
  const category: CoachingTip['category'] = 'trading';

  switch (result.recommendation) {
    case 'all-in': {
      message = `KILL ${enemyChampion}! ${result.reason} `
        + `(${Math.round(result.killProbability * 100)}% kill chance, `
        + `~${result.burstDamageEstimate} burst dmg)`;
      priority = 'danger';
      break;
    }
    case 'short-trade': {
      message = `Trade with ${enemyChampion}. ${result.reason} `
        + `(${Math.round(result.killProbability * 100)}% kill chance)`;
      priority = 'warning';
      break;
    }
    case 'poke': {
      message = `Poke ${enemyChampion} but don't commit. ${result.reason}`;
      priority = 'info';
      break;
    }
    case 'avoid': {
      message = `Stay away from ${enemyChampion}! ${result.reason} `
        + `(${Math.round(result.deathProbability * 100)}% death risk)`;
      priority = 'danger';
      break;
    }
    case 'disengage': {
      message = `Don't fight ${enemyChampion} right now. ${result.reason}`;
      priority = 'warning';
      break;
    }
    default: {
      return null;
    }
  }

  lastCombatTipTime = now;

  return {
    id: `combat-${enemyChampion}-${now}`,
    message,
    priority,
    category,
    timestamp: now,
    dismissed: false,
  };
}
