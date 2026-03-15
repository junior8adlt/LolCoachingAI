import type { AllGameData, PlayerInfo, ActivePlayer } from '../types/game';
import type { CoachingTip, TipPriority, TipCategory, JunglePrediction } from '../types/coaching';
import { getChampionMeta } from '../data/championMeta';
import { getPowerSpike } from '../data/powerSpikes';
import { getMatchupData } from '../data/matchups';
import { getEnemyCooldowns } from './cooldownTracker';
import { getEnemyHPEstimate } from './screenReader';
import { recommendItems } from '../data/items';
import { areItemsIncompatible } from '../data/itemRules';
import type { LaneWaveInfo } from './waveEngine';

// ── Smart Coach ──
// A PROACTIVE coaching engine that identifies OPPORTUNITIES, not just threats.
// Thinks like a Challenger coach: when to fight, what to build, how to play your champion.

let tipCounter = 0;
const recentTipMessages = new Map<string, number>(); // message hash → timestamp

function createTip(message: string, priority: TipPriority, category: TipCategory): CoachingTip | null {
  // Anti-repetition: hash the first 40 chars, block similar tips for 90s
  const hash = message.slice(0, 40).toLowerCase();
  const now = Date.now();
  const lastTime = recentTipMessages.get(hash);
  if (lastTime && now - lastTime < 90000) return null;
  recentTipMessages.set(hash, now);

  // Cleanup old entries
  if (recentTipMessages.size > 50) {
    for (const [key, time] of recentTipMessages) {
      if (now - time > 120000) recentTipMessages.delete(key);
    }
  }

  tipCounter++;
  return {
    id: `smart-${now}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: now,
    dismissed: false,
  };
}

// ── Fight Analysis: Can you win? ──

interface FightAssessment {
  canWin: boolean;
  confidence: number; // 0-1
  reason: string;
  action: 'fight' | 'trade' | 'poke' | 'safe' | 'all-in';
}

function assessFightPotential(
  me: ActivePlayer,
  myInfo: PlayerInfo,
  enemy: PlayerInfo,
  _gameTime: number,
  waveInfo?: LaneWaveInfo | null
): FightAssessment {
  const myHPPercent = me.championStats.currentHealth / me.championStats.maxHealth;
  const myLevel = me.level;
  const enemyLevel = enemy.level;
  const levelDiff = myLevel - enemyLevel;

  if (enemy.isDead) {
    return { canWin: true, confidence: 1, reason: 'Enemy is dead', action: 'safe' };
  }

  // ── Gold estimation ──
  const myGold = myInfo.scores.kills * 300 + myInfo.scores.assists * 150 + myInfo.scores.creepScore * 21;
  const enemyGold = enemy.scores.kills * 300 + enemy.scores.assists * 150 + enemy.scores.creepScore * 21;
  const goldDiff = myGold - enemyGold;
  const myCompletedItems = myInfo.items.filter((i) => i.price >= 2500).length;
  const enemyCompletedItems = enemy.items.filter((i) => i.price >= 2500).length;

  // ── Scoring system (50 = even) ──
  let score = 50;
  const reasons: string[] = [];

  // HP (your HP matters a lot)
  score += (myHPPercent - 0.5) * 30;
  if (myHPPercent < 0.3) { score -= 15; reasons.push('you\'re too low'); }

  // Enemy HP from screen capture
  const enemyHP = getEnemyHPEstimate();
  if (enemyHP.detected && enemyHP.confidence > 0.3) {
    score += (0.5 - enemyHP.healthPercent) * 25; // enemy low = we're favored
    if (enemyHP.healthPercent < 0.3) reasons.push(`enemy ~${Math.round(enemyHP.healthPercent * 100)}% HP`);
  }

  // Level
  score += levelDiff * 8;
  if (levelDiff >= 2) reasons.push(`+${levelDiff} levels`);
  if (levelDiff <= -2) reasons.push(`${levelDiff} levels behind`);

  // Gold/items
  if (goldDiff > 1000) score += 8;
  if (goldDiff > 2000) score += 8;
  if (goldDiff < -1000) score -= 8;
  if (goldDiff < -2000) score -= 8;
  score += (myCompletedItems - enemyCompletedItems) * 10;
  if (myCompletedItems > enemyCompletedItems) reasons.push('item advantage');
  if (myCompletedItems < enemyCompletedItems) reasons.push('item disadvantage');

  // ── Power spikes ──
  const mySpike = getPowerSpike(myInfo.championName);
  const enemySpike = getPowerSpike(enemy.championName);
  if (mySpike?.levelSpikes.includes(myLevel)) { score += 10; reasons.push('power spike'); }
  if (enemySpike?.levelSpikes.includes(enemyLevel)) score -= 10;

  // ── Range advantage (NEW) ──
  const myMeta = getChampionMeta(myInfo.championName);
  const enemyMeta = getChampionMeta(enemy.championName);
  const myIsRanged = myMeta?.archetypes.some((a) => a === 'marksman' || a === 'artillery' || a === 'mage') ?? false;
  const enemyIsRanged = enemyMeta?.archetypes.some((a) => a === 'marksman' || a === 'artillery' || a === 'mage') ?? false;

  if (myIsRanged && !enemyIsRanged) {
    score += 8; // Range advantage for short trades
    reasons.push('range advantage');
  }
  if (!myIsRanged && enemyIsRanged) {
    score -= 5; // Melee vs ranged is unfavorable for poke
  }

  // ── Champion matchup (NEW) ──
  const matchup = getMatchupData(myInfo.championName, enemy.championName);
  if (matchup) {
    // difficulty 1 = easy for you, 5 = hard for you
    const matchupBonus = (3 - matchup.difficulty) * 5; // -10 to +10
    score += matchupBonus;
    if (matchup.difficulty >= 4) reasons.push(`tough matchup vs ${enemy.championName}`);
    if (matchup.difficulty <= 2) reasons.push(`favorable matchup`);
  }

  // ── Cooldowns (NEW) ──
  const enemyCDs = getEnemyCooldowns(enemy.summonerName);
  if (enemyCDs) {
    if (enemyCDs.flashDown) { score += 12; reasons.push('enemy flash down'); }
    if (enemyCDs.ultDown) { score += 10; reasons.push('enemy ult down'); }
  }

  // ── Summoner spells (NEW) ──
  const mySpells = [
    myInfo.summonerSpells.summonerSpellOne.displayName.toLowerCase(),
    myInfo.summonerSpells.summonerSpellTwo.displayName.toLowerCase(),
  ].join(' ');
  const hasIgnite = mySpells.includes('ignite') || mySpells.includes('incendiar');
  const hasHeal = mySpells.includes('heal') || mySpells.includes('curación');
  if (hasIgnite) score += 4; // ignite = kill pressure
  if (hasHeal) score += 2;

  // ── Wave state (NEW) - don't fight in big enemy wave ──
  if (waveInfo) {
    if (waveInfo.state === 'pushing_to_you' || waveInfo.state === 'frozen_near_enemy') {
      score -= 12; // Fighting in enemy wave = bad
      reasons.push('bad wave position');
    }
    if (waveInfo.state === 'pushing_to_enemy' || waveInfo.state === 'frozen_near_you') {
      score += 5; // Wave is on your side = safer
    }
  }

  // ── Build reason string ──
  const topReasons = reasons.slice(0, 3).join(', ');

  // ── Determine action ──
  if (score >= 72) {
    return { canWin: true, confidence: 0.85, reason: `Big advantage: ${topReasons}`, action: 'all-in' };
  }
  if (score >= 62) {
    return { canWin: true, confidence: 0.7, reason: topReasons || 'You have an advantage', action: 'fight' };
  }
  if (score >= 53) {
    return { canWin: true, confidence: 0.55, reason: topReasons || 'Slightly favored', action: 'trade' };
  }
  if (score >= 45) {
    return { canWin: false, confidence: 0.5, reason: topReasons || 'Even matchup', action: 'poke' };
  }
  return { canWin: false, confidence: 0.3, reason: topReasons || 'Enemy advantage', action: 'safe' };
}

// ── Build Recommendations ──

interface BuildAdvice {
  message: string;
  priority: TipPriority;
}

function analyzeBuildNeeds(
  me: ActivePlayer,
  myInfo: PlayerInfo,
  enemies: PlayerInfo[]
): BuildAdvice | null {
  const gold = me.currentGold;
  if (gold < 800) return null; // Not enough gold to buy anything meaningful

  const myItems = myInfo.items.map((i) => i.displayName.toLowerCase());
  const hasAntiHeal = myItems.some((i) =>
    i.includes('executioner') || i.includes('oblivion') || i.includes('morello') ||
    i.includes('thornmail') || i.includes('chemtech') || i.includes('verdugo')
  );
  const hasArmor = myItems.some((i) =>
    i.includes('plated') || i.includes('steelcaps') || i.includes('tabis') ||
    i.includes('randuin') || i.includes('frozen heart') || i.includes('tabi')
  );
  const hasMR = myItems.some((i) =>
    i.includes('hexdrinker') || i.includes('maw') || i.includes('spirit visage') ||
    i.includes('force of nature') || i.includes('mercury') || i.includes('wit\'s end')
  );

  // Count enemy damage types
  const enemyMeta = enemies.map((e) => getChampionMeta(e.championName));
  const apCount = enemyMeta.filter((m) => m?.archetypes.some((a) => a === 'mage' || a === 'enchanter')).length;
  const adCount = enemyMeta.filter((m) => m?.archetypes.some((a) => a === 'marksman' || a === 'assassin')).length;
  const tankCount = enemyMeta.filter((m) => m?.archetypes.some((a) => a === 'tank' || a === 'juggernaut')).length;

  // Check for enemy healing champions
  const healers = enemies.filter((e) => {
    const name = e.championName.toLowerCase();
    return ['aatrox', 'dr. mundo', 'fiora', 'irelia', 'kayn', 'sylas', 'vladimir',
            'warwick', 'yuumi', 'soraka', 'nami', 'senna', 'swain', 'illaoi',
            'mordekaiser', 'olaf', 'briar', 'bel\'veth'].includes(name.toLowerCase());
  });

  // Anti-heal recommendation
  if (healers.length >= 2 && !hasAntiHeal && gold >= 800) {
    const healerNames = healers.map((h) => h.championName).join(' and ');
    return {
      message: `Buy anti-heal! ${healerNames} have heavy healing. Get Executioner's or Oblivion Orb.`,
      priority: 'warning',
    };
  }

  // Armor recommendation
  if (adCount >= 3 && !hasArmor) {
    return {
      message: `Enemy has ${adCount} AD threats. Consider armor in your build (Plated Steelcaps or armor component).`,
      priority: 'info',
    };
  }

  // MR recommendation
  if (apCount >= 3 && !hasMR) {
    return {
      message: `Enemy has ${apCount} AP threats. Consider MR (Mercury's Treads or Hexdrinker).`,
      priority: 'info',
    };
  }

  // Tank shred
  if (tankCount >= 2) {
    const myArchetype = getChampionMeta(myInfo.championName)?.archetypes ?? [];
    if (myArchetype.includes('marksman')) {
      const hasBork = myItems.some((i) => i.includes('blade') || i.includes('botrk'));
      if (!hasBork) {
        return {
          message: `Enemy has ${tankCount} tanks. Build Blade of the Ruined King for %HP shred.`,
          priority: 'info',
        };
      }
    }
  }

  return null;
}

// ── Opportunity Detection ──

function detectOpportunities(
  me: ActivePlayer,
  myInfo: PlayerInfo,
  enemy: PlayerInfo | undefined,
  enemies: PlayerInfo[],
  junglePrediction: JunglePrediction | null,
  gameTime: number,
  waveInfo?: LaneWaveInfo | null
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  if (!enemy) return tips;

  const fight = assessFightPotential(me, myInfo, enemy, gameTime, waveInfo);
  const minutes = Math.floor(gameTime / 60);

  // ── Opportunity: Enemy is dead → push/take objectives ──
  if (enemy.isDead) {
    if (enemy.respawnTimer > 15) {
      const tip = createTip(
        `${enemy.championName} is dead for ${Math.ceil(enemy.respawnTimer)}s. Push the wave and take plates or roam.`,
        'info', 'macro'
      );
      if (tip) tips.push(tip);
    }
    return tips; // No need for more tips when enemy is dead
  }

  // ── Opportunity: Jungler visible on other side of map ──
  if (junglePrediction && gameTime > 150) {
    const playerSide = getPlayerSide(myInfo);
    const junglerOnOtherSide =
      (playerSide === 'bot' && junglePrediction.predictedSide === 'top') ||
      (playerSide === 'top' && junglePrediction.predictedSide === 'bot');

    if (junglerOnOtherSide && junglePrediction.confidence > 0.5) {
      const tip = createTip(
        `Enemy jungler is ${junglePrediction.predictedSide} side. You're safe to play aggressive for the next 30s.`,
        'info', 'jungle'
      );
      if (tip) tips.push(tip);
    }
  }

  // ── Opportunity: Level advantage ──
  const levelDiff = me.level - enemy.level;
  if (levelDiff >= 1 && fight.canWin) {
    const tip = createTip(
      `You're level ${me.level} vs their ${enemy.level}. ${fight.reason}. Look for a ${fight.action === 'all-in' ? 'kill' : 'trade'}.`,
      fight.action === 'all-in' ? 'warning' : 'info', 'trading'
    );
    if (tip) tips.push(tip);
  }

  // ── Opportunity: You just hit a power spike ──
  const mySpike = getPowerSpike(myInfo.championName);
  if (mySpike?.levelSpikes.includes(me.level) && levelDiff >= 0) {
    const tip = createTip(
      `Power spike! You just hit level ${me.level} on ${myInfo.championName}. This is your moment to fight.`,
      'warning', 'matchup'
    );
    if (tip) tips.push(tip);
  }

  // ── Opportunity: Item advantage ──
  const myCompletedItems = myInfo.items.filter((i) => i.price >= 2500).length;
  const enemyCompletedItems = enemy.items.filter((i) => i.price >= 2500).length;
  if (myCompletedItems > enemyCompletedItems && myCompletedItems >= 1) {
    const tip = createTip(
      `Item advantage! You have ${myCompletedItems} completed item${myCompletedItems > 1 ? 's' : ''} vs their ${enemyCompletedItems}. You win fights right now.`,
      'info', 'trading'
    );
    if (tip) tips.push(tip);
  }

  // ── Wave-aware fight warning ──
  if (waveInfo && fight.canWin &&
      (waveInfo.state === 'pushing_to_you' || waveInfo.state === 'frozen_near_enemy')) {
    const tip = createTip(
      `You could win the fight, but wave is against you. Crash the wave first, then look for a trade.`,
      'info', 'trading'
    );
    if (tip) tips.push(tip);
  }

  // ── Warning: Enemy has advantage - but be specific about WHY ──
  if (levelDiff <= -2) {
    const tip = createTip(
      `You're ${Math.abs(levelDiff)} levels behind ${enemy.championName}. Don't fight, just CS. You need XP.`,
      'warning', 'positioning'
    );
    if (tip) tips.push(tip);
  }

  // Champion tips are now handled by gameLoop on level-up and phase transitions
  // No more timer-based triggers here

  // ── Low HP fight assessment ──
  const myHPPercent = me.championStats.currentHealth / me.championStats.maxHealth;
  if (myHPPercent < 0.4 && myHPPercent > 0.15) {
    // Instead of always saying "recall", evaluate if enemy is also low
    if (fight.canWin && fight.confidence >= 0.6) {
      const tip = createTip(
        `You're low but you still have an advantage. ${fight.reason}. Consider fighting before recalling.`,
        'info', 'trading'
      );
      if (tip) tips.push(tip);
    } else if (me.currentGold >= 1300) {
      const tip = createTip(
        `Low HP with ${Math.round(me.currentGold)}g. Push wave into tower, then recall for an item spike.`,
        'warning', 'recall'
      );
      if (tip) tips.push(tip);
    }
  }

  // ── Gold sitting warning (contextual, not spammy) ──
  if (me.currentGold >= 1800 && myHPPercent > 0.5 && minutes > 3) {
    const tip = createTip(
      `${Math.round(me.currentGold)}g unspent. Crash the wave and recall. That gold is wasted in your pocket.`,
      'info', 'recall'
    );
    if (tip) tips.push(tip);
  }

  // ── Build recommendation (only when you have enough gold to act on it) ──
  if (me.currentGold >= 900) {
    const buildAdvice = analyzeBuildNeeds(me, myInfo, enemies);
    if (buildAdvice) {
      const tip = createTip(buildAdvice.message, buildAdvice.priority, 'general');
      if (tip) tips.push(tip);
    }

    // Smart item recommendation based on archetype + enemy comp
    if (me.currentGold >= 2500) {
      const myArchMeta = getChampionMeta(myInfo.championName);
      const myArch = myArchMeta?.archetypes[0] ?? 'marksman';
      const tankCount = enemies.filter((e) => {
        const m = getChampionMeta(e.championName);
        return m?.archetypes.some((a) => a === 'tank' || a === 'juggernaut');
      }).length;
      const apCount = enemies.filter((e) => {
        const m = getChampionMeta(e.championName);
        return m?.archetypes.some((a) => a === 'mage' || a === 'enchanter');
      }).length;
      const adCount = enemies.filter((e) => {
        const m = getChampionMeta(e.championName);
        return m?.archetypes.some((a) => a === 'marksman' || a === 'assassin');
      }).length;
      const healerCount = enemies.filter((e) => {
        const name = e.championName.toLowerCase();
        return ['aatrox', 'dr. mundo', 'fiora', 'vladimir', 'warwick', 'yuumi', 'soraka', 'sylas', 'briar', 'swain', 'illaoi', 'olaf'].includes(name);
      }).length;

      const recs = recommendItems(myArch, { tanks: tankCount, ap: apCount, ad: adCount, healers: healerCount });
      // Filter out items already owned or incompatible
      const myItemNames = myInfo.items.map((i) => i.displayName);
      const validRecs = recs.filter((r) =>
        !myItemNames.some((owned) => owned.toLowerCase() === r.toLowerCase()) &&
        !myItemNames.some((owned) => areItemsIncompatible(owned, r))
      );

      if (validRecs.length > 0) {
        const tip = createTip(
          `Build suggestion: ${validRecs[0]}. ${validRecs.length > 1 ? `Also consider: ${validRecs[1]}.` : ''}`,
          'info', 'general'
        );
        if (tip) tips.push(tip);
      }
    }
  }

  return tips;
}

function getPlayerSide(player: PlayerInfo): 'top' | 'mid' | 'bot' {
  const pos = player.position?.toUpperCase() ?? '';
  if (pos === 'TOP') return 'top';
  if (pos === 'BOTTOM' || pos === 'UTILITY') return 'bot';
  return 'mid';
}

// ── Main Export ──

export function getSmartCoachingTips(
  data: AllGameData,
  junglePrediction: JunglePrediction | null,
  waveInfo?: LaneWaveInfo | null
): CoachingTip[] {
  const me = data.activePlayer;
  const myInfo = data.allPlayers.find(
    (p) => p.summonerName === me.summonerName
  );
  if (!myInfo) return [];

  const myTeam = myInfo.team;
  const enemies = data.allPlayers.filter((p) => p.team !== myTeam);
  const laneEnemy = enemies.find((p) => p.position === myInfo.position && myInfo.position !== '');
  const gameTime = data.gameData.gameTime;

  return detectOpportunities(me, myInfo, laneEnemy, enemies, junglePrediction, gameTime, waveInfo);
}

export function resetSmartCoach(): void {
  recentTipMessages.clear();
  tipCounter = 0;
}
