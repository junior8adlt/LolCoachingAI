import type { AllGameData, PlayerInfo, ActivePlayer } from '../types/game';
import type { CoachingTip, TipPriority, TipCategory, JunglePrediction } from '../types/coaching';
import { getChampionCoaching } from '../data/championCoaching';
// championMechanics used by game loop directly
import { getChampionMeta } from '../data/championMeta';
import { getPowerSpike } from '../data/powerSpikes';

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
  _gameTime: number
): FightAssessment {
  const myHP = me.championStats.currentHealth;
  const myMaxHP = me.championStats.maxHealth;
  const myHPPercent = myHP / myMaxHP;
  const myLevel = me.level;
  const myKills = myInfo.scores.kills;
  const myDeaths = myInfo.scores.deaths;
  const myCS = myInfo.scores.creepScore;

  // Note: can't see enemy HP from API, estimate from context
  const enemyLevel = enemy.level;
  const enemyKills = enemy.scores.kills;
  const enemyDeaths = enemy.scores.deaths;
  const enemyCS = enemy.scores.creepScore;

  // Gold estimates
  const myGold = myKills * 300 + myInfo.scores.assists * 150 + myCS * 21;
  const enemyGold = enemyKills * 300 + enemy.scores.assists * 150 + enemyCS * 21;
  const goldDiff = myGold - enemyGold;

  // Item count comparison
  const myItems = myInfo.items.filter((i) => i.price >= 800).length;
  const enemyItems = enemy.items.filter((i) => i.price >= 800).length;

  // Enemy is dead - no fight needed
  if (enemy.isDead) {
    return { canWin: true, confidence: 1, reason: 'Enemy is dead', action: 'safe' };
  }

  // Level advantage
  const levelDiff = myLevel - enemyLevel;

  // Scoring system
  let score = 50; // 50 = even

  // HP comparison (most important for immediate fights)
  score += (myHPPercent - 0.5) * 30; // your HP matters
  // We can't see enemy HP %, but we can estimate from items/kills

  // Level advantage
  score += levelDiff * 8;

  // Kill/death advantage
  score += (myKills - enemyKills) * 3;
  score -= (myDeaths - enemyDeaths) * 3;

  // Gold/item advantage
  if (goldDiff > 1000) score += 10;
  if (goldDiff > 2000) score += 10;
  if (goldDiff < -1000) score -= 10;
  if (goldDiff < -2000) score -= 10;
  score += (myItems - enemyItems) * 8;

  // Power spike check
  const mySpike = getPowerSpike(myInfo.championName);
  const enemySpike = getPowerSpike(enemy.championName);
  if (mySpike?.levelSpikes.includes(myLevel)) score += 10;
  if (enemySpike?.levelSpikes.includes(enemyLevel)) score -= 10;

  // Determine action
  if (score >= 70) {
    return { canWin: true, confidence: 0.85, reason: `You have a big advantage (level ${levelDiff > 0 ? '+' + levelDiff : levelDiff}, ${goldDiff > 0 ? '+' : ''}${Math.round(goldDiff)}g)`, action: 'all-in' };
  }
  if (score >= 60) {
    return { canWin: true, confidence: 0.7, reason: 'You have an advantage', action: 'fight' };
  }
  if (score >= 52) {
    return { canWin: true, confidence: 0.55, reason: 'Slightly favored', action: 'trade' };
  }
  if (score >= 45) {
    return { canWin: false, confidence: 0.5, reason: 'Even matchup', action: 'poke' };
  }
  return { canWin: false, confidence: 0.3, reason: `Enemy has advantage (${Math.abs(levelDiff)} levels ${levelDiff < 0 ? 'behind' : ''}, ${Math.abs(Math.round(goldDiff))}g ${goldDiff < 0 ? 'behind' : ''})`, action: 'safe' };
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
  gameTime: number
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  if (!enemy) return tips;

  const fight = assessFightPotential(me, myInfo, enemy, gameTime);
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

  // ── Warning: Enemy has advantage - but be specific about WHY ──
  if (levelDiff <= -2) {
    const tip = createTip(
      `You're ${Math.abs(levelDiff)} levels behind ${enemy.championName}. Don't fight, just CS. You need XP.`,
      'warning', 'positioning'
    );
    if (tip) tips.push(tip);
  }

  // ── Champion-specific contextual tips ──
  const coaching = getChampionCoaching(myInfo.championName);
  if (coaching) {
    // Give phase-appropriate strategy
    if (gameTime < 900 && minutes % 3 === 0) {
      const tip = createTip(coaching.earlyGame, 'info', 'matchup');
      if (tip) tips.push(tip);
    }
  }

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

  // ── Build recommendation ──
  if (minutes > 5 && minutes % 4 === 0) {
    const buildAdvice = analyzeBuildNeeds(me, myInfo, enemies);
    if (buildAdvice) {
      const tip = createTip(buildAdvice.message, buildAdvice.priority, 'general');
      if (tip) tips.push(tip);
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
  junglePrediction: JunglePrediction | null
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

  return detectOpportunities(me, myInfo, laneEnemy, enemies, junglePrediction, gameTime);
}

export function resetSmartCoach(): void {
  recentTipMessages.clear();
  tipCounter = 0;
}
