import type { PlayerInfo, GameEvent } from '../types/game';
import type { CoachingTip, JunglePrediction, ObjectiveInfo } from '../types/coaching';
import { getPowerSpike } from '../data/powerSpikes';
import { getChampionMeta } from '../data/championMeta';

// ── Enemy Intent Types ──

export type EnemyIntent =
  | 'all_in'           // Enemy wants to kill you
  | 'dive'             // Enemy wants to tower dive
  | 'roam'             // Enemy laner left lane
  | 'recall'           // Enemy is backing
  | 'objective'        // Enemy is going for dragon/baron
  | 'gank'             // Enemy jungler is coming to your lane
  | 'freeze'           // Enemy is freezing the wave
  | 'push_and_roam'    // Enemy is shoving then leaving
  | 'passive';         // Enemy is farming safely

export interface IntentPrediction {
  intent: EnemyIntent;
  confidence: number;      // 0-1
  targetChampion: string;  // Who has this intent
  warning: string;         // What to tell the player
  timeWindow: number;      // Seconds until this happens
}

// ── Internal Constants ──

/** Champions with global or semi-global roaming ultimates */
const ROAMING_ULT_CHAMPIONS = new Set([
  'Twisted Fate', 'Galio', 'Shen', 'Pantheon', 'Nocturne',
  'Ryze', 'Tahm Kench', 'Rek\'Sai',
]);

/** Champions with strong CC suitable for tower dives */
const STRONG_CC_CHAMPIONS = new Set([
  'Nautilus', 'Leona', 'Thresh', 'Alistar', 'Blitzcrank',
  'Renekton', 'Elise', 'Pantheon', 'Maokai', 'Amumu',
  'Sejuani', 'Zac', 'Rell', 'Rakan', 'Vi', 'Jarvan IV',
  'Skarner', 'Rammus', 'Sett', 'Volibear',
]);

/** Champions known for waveclear, enabling push-and-roam */
const WAVECLEAR_CHAMPIONS = new Set([
  'Viktor', 'Anivia', 'Ryze', 'Aurelion Sol', 'Malzahar',
  'Taliyah', 'Xerath', 'Ziggs', 'Lux', 'Syndra', 'Orianna',
  'Hwei', 'Vex', 'Ahri', 'Ekko', 'Katarina', 'Talon',
  'Qiyana', 'Sivir',
]);

/** Key item component gold thresholds suggesting a recall timing */
const RECALL_GOLD_THRESHOLDS: Array<{ gold: number; item: string }> = [
  { gold: 1300, item: 'Needlessly Large Rod' },
  { gold: 1100, item: 'B.F. Sword' },
  { gold: 900, item: 'Pickaxe / Blasting Wand' },
  { gold: 1100, item: 'Lost Chapter / Noonquiver' },
  { gold: 800, item: 'Serrated Dirk' },
  { gold: 700, item: 'Hextech Alternator' },
];

/** How many completed items (price > 2000) a player has */
function countCompletedItems(player: PlayerInfo): number {
  return player.items.filter((item) => item.price >= 2000 && !item.consumable).length;
}

/** Total gold value of a player's inventory */
function totalItemValue(player: PlayerInfo): number {
  return player.items.reduce((sum, item) => sum + item.price * item.count, 0);
}

/** Whether a player has Ignite */
function hasIgnite(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return s1.includes('ignite') || s2.includes('ignite') ||
         s1.includes('dot') || s2.includes('dot');
}

/** Whether a player has Smite (i.e. is the jungler) */
function hasSmite(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return s1.includes('smite') || s2.includes('smite');
}

/** Whether a player has Teleport */
function hasTeleport(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return s1.includes('teleport') || s2.includes('teleport');
}

/** Get enemy team players */
function getEnemies(allPlayers: PlayerInfo[], myTeam: 'ORDER' | 'CHAOS'): PlayerInfo[] {
  return allPlayers.filter((p) => p.team !== myTeam);
}

/** Get allied team players */
function getAllies(allPlayers: PlayerInfo[], myTeam: 'ORDER' | 'CHAOS'): PlayerInfo[] {
  return allPlayers.filter((p) => p.team === myTeam);
}

/** Find the enemy jungler */
function findEnemyJungler(enemies: PlayerInfo[]): PlayerInfo | null {
  return enemies.find((p) => hasSmite(p)) ?? null;
}

/** Find the direct lane opponent for the player */
function findLaneOpponent(enemies: PlayerInfo[], myPosition: string): PlayerInfo | null {
  const posMap: Record<string, string> = {
    TOP: 'TOP',
    MIDDLE: 'MIDDLE',
    BOTTOM: 'BOTTOM',
    UTILITY: 'UTILITY',
    JUNGLE: 'JUNGLE',
  };
  const target = posMap[myPosition.toUpperCase()] ?? myPosition.toUpperCase();
  return enemies.find((p) => p.position.toUpperCase() === target) ?? null;
}

/** Estimate unreliable CS/min for an enemy (all we can see is total CS) */
function estimateCsPerMin(player: PlayerInfo, gameTime: number): number {
  if (gameTime < 60) return 0;
  return player.scores.creepScore / (gameTime / 60);
}

/** Estimate gold earned from kills/assists/cs */
function estimateGoldEarned(player: PlayerInfo): number {
  const killGold = player.scores.kills * 300;
  const assistGold = player.scores.assists * 150;
  const csGold = player.scores.creepScore * 20; // rough average
  return killGold + assistGold + csGold;
}

/** Count how many enemies are alive */
function countAliveEnemies(enemies: PlayerInfo[]): number {
  return enemies.filter((p) => !p.isDead).length;
}

// HP check handled at detection level with ActivePlayer.championStats

// ── Detection Functions ──

/**
 * Detect ALL-IN intent: enemy hit a power spike level, has aggressive summoners,
 * and has item advantage.
 */
function detectAllIn(
  laneOpponent: PlayerInfo | null,
  myPlayer: PlayerInfo,
  gameTime: number
): IntentPrediction | null {
  if (!laneOpponent || laneOpponent.isDead) return null;

  let confidence = 0;
  const reasons: string[] = [];

  // Power spike level check (6, 11, 16 are ultimate upgrades)
  const spikeData = getPowerSpike(laneOpponent.championName);
  const powerSpikeLevels = spikeData?.levelSpikes ?? [6, 11, 16];
  if (powerSpikeLevels.includes(laneOpponent.level)) {
    confidence += 0.25;
    reasons.push(`just hit level ${laneOpponent.level} spike`);
  }

  // Recently leveled up to a power spike (within ~30s of reaching spike level)
  // We approximate: if they're exactly at a spike level and game is early
  if (laneOpponent.level === 6 && gameTime < 480) {
    confidence += 0.1; // Level 6 in early game is a big threat
  }

  // Has ignite = aggressive laner
  if (hasIgnite(laneOpponent)) {
    confidence += 0.15;
    reasons.push('has Ignite');
  }

  // Item advantage: compare total item value
  const enemyItemValue = totalItemValue(laneOpponent);
  const myItemValue = totalItemValue(myPlayer);
  if (enemyItemValue > myItemValue + 500) {
    confidence += 0.15;
    reasons.push('item advantage');
  }

  // Item spike: check if enemy just completed an item spike
  if (spikeData) {
    for (const spikeItem of spikeData.itemSpikes) {
      const hasItem = laneOpponent.items.some(
        (i) => i.displayName.toLowerCase() === spikeItem.toLowerCase()
      );
      if (hasItem) {
        confidence += 0.15;
        reasons.push(`completed ${spikeItem}`);
        break; // Only count once
      }
    }
  }

  // Kill lead makes them more likely to all-in
  const killDiff = laneOpponent.scores.kills - myPlayer.scores.kills;
  if (killDiff >= 2) {
    confidence += 0.15;
    reasons.push(`${killDiff} kill lead`);
  }

  // Champion archetype: assassins and divers are more likely to all-in
  const meta = getChampionMeta(laneOpponent.championName);
  if (meta) {
    const aggressiveTypes = new Set(['assassin', 'diver', 'skirmisher', 'juggernaut']);
    const isAggressive = meta.archetypes.some((a) => aggressiveTypes.has(a));
    if (isAggressive) {
      confidence += 0.1;
    }
  }

  if (confidence < 0.35) return null;

  const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'aggressive positioning';
  return {
    intent: 'all_in',
    confidence: Math.min(1, confidence),
    targetChampion: laneOpponent.championName,
    warning: `${laneOpponent.championName} wants to all-in! (${reasonStr}). Play safe or prep defensively.`,
    timeWindow: 15,
  };
}

/**
 * Detect DIVE intent: enemy jungler alive + your HP likely low + enemy laner has CC.
 * We infer "your HP is low" from the player's recent deaths and current death state.
 * Since we can't see our own HP here directly, we use a heuristic based on
 * whether the player has died recently and whether the enemy has dive tools.
 */
function detectDive(
  enemies: PlayerInfo[],
  myPlayer: PlayerInfo,
  myPlayerCurrentHPRatio: number,
  gameTime: number
): IntentPrediction | null {
  if (myPlayer.isDead) return null;

  const jungler = findEnemyJungler(enemies);
  if (!jungler || jungler.isDead) return null;

  const laneOpponent = findLaneOpponent(enemies, myPlayer.position);
  if (!laneOpponent || laneOpponent.isDead) return null;

  let confidence = 0;
  const divers: string[] = [];

  // Our HP is low - prime dive target
  if (myPlayerCurrentHPRatio < 0.4) {
    confidence += 0.35;
  } else if (myPlayerCurrentHPRatio < 0.6) {
    confidence += 0.15;
  } else {
    // HP is fine, dive is unlikely
    return null;
  }

  // Enemy jungler alive and has CC for tower tanking
  if (STRONG_CC_CHAMPIONS.has(jungler.championName)) {
    confidence += 0.15;
    divers.push(jungler.championName);
  } else {
    confidence += 0.05; // Any jungler can dive, but CC makes it more likely
  }

  // Lane opponent has CC
  if (STRONG_CC_CHAMPIONS.has(laneOpponent.championName)) {
    confidence += 0.15;
    divers.push(laneOpponent.championName);
  }

  // Lane opponent is an archetype that dives (assassin, diver)
  const meta = getChampionMeta(laneOpponent.championName);
  if (meta && meta.archetypes.some((a) => a === 'diver' || a === 'assassin')) {
    confidence += 0.1;
  }

  // Enemy has level/item advantage (makes dive safer for them)
  if (laneOpponent.level >= myPlayer.level + 1 || jungler.level >= myPlayer.level) {
    confidence += 0.1;
  }

  // Game time: dives are more common after level 3-4 for jungler
  if (gameTime >= 180 && gameTime <= 1200) {
    confidence += 0.05;
  }

  if (confidence < 0.4) return null;

  const diveSource = divers.length > 0
    ? divers.join(' + ')
    : `${laneOpponent.championName} + ${jungler.championName}`;

  return {
    intent: 'dive',
    confidence: Math.min(1, confidence),
    targetChampion: laneOpponent.championName,
    warning: `Dive incoming from ${diveSource}! Back off tower or recall NOW. Don't give a free kill.`,
    timeWindow: 20,
  };
}

/**
 * Detect ROAM intent: enemy mid laner completed item + sidelanes pushed up +
 * enemy has roaming ult (TF, Galio, Shen, Pantheon).
 */
function detectRoam(
  enemies: PlayerInfo[],
  _allies: PlayerInfo[],
  myPlayer: PlayerInfo,
  gameTime: number
): IntentPrediction | null {
  // Only relevant for detecting enemy mid/top roams
  const roamCandidates = enemies.filter(
    (e) => !e.isDead && (e.position.toUpperCase() === 'MIDDLE' || e.position.toUpperCase() === 'TOP')
  );

  for (const enemy of roamCandidates) {
    let confidence = 0;
    const reasons: string[] = [];

    // Has roaming ultimate
    if (ROAMING_ULT_CHAMPIONS.has(enemy.championName)) {
      confidence += 0.3;
      reasons.push(`${enemy.championName} has global/semi-global ult`);
    }

    // Has level 6+ (ult available for roaming ult champs)
    if (enemy.level >= 6 && ROAMING_ULT_CHAMPIONS.has(enemy.championName)) {
      confidence += 0.15;
    }

    // Completed first item (has gold to roam effectively)
    const completedItems = countCompletedItems(enemy);
    if (completedItems >= 1) {
      confidence += 0.15;
      reasons.push('completed item');
    }

    // Has boots (mobility for roaming)
    const hasBoots = enemy.items.some(
      (i) => i.displayName.toLowerCase().includes('boots') ||
             i.displayName.toLowerCase().includes('greaves') ||
             i.displayName.toLowerCase().includes('treads') ||
             i.displayName.toLowerCase().includes('plated') ||
             i.displayName.toLowerCase().includes('ionian') ||
             i.displayName.toLowerCase().includes('sorcerer')
    );
    if (hasBoots) {
      confidence += 0.05;
    }

    // Assassin archetype is more likely to roam
    const meta = getChampionMeta(enemy.championName);
    if (meta && meta.archetypes.includes('assassin')) {
      confidence += 0.1;
      reasons.push('assassin archetype');
    }

    // Enemy has kills (more dangerous roam, more motivated)
    if (enemy.scores.kills >= 2) {
      confidence += 0.1;
      reasons.push(`${enemy.scores.kills} kills`);
    }

    // Mid game timing (roams are most common 8-25 minutes)
    if (gameTime >= 480 && gameTime <= 1500) {
      confidence += 0.05;
    }

    // We are a sidelane that could be roamed on
    const myPos = myPlayer.position.toUpperCase();
    if (enemy.position.toUpperCase() === 'MIDDLE' &&
        (myPos === 'TOP' || myPos === 'BOTTOM' || myPos === 'UTILITY')) {
      confidence += 0.05;
    }

    if (confidence < 0.35) continue;

    const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'missing from lane';
    return {
      intent: 'roam',
      confidence: Math.min(1, confidence),
      targetChampion: enemy.championName,
      warning: `${enemy.championName} may roam (${reasonStr}). Ping MIA and play safe until they show on map.`,
      timeWindow: 25,
    };
  }

  return null;
}

/**
 * Detect RECALL intent: enemy has enough estimated gold for a key item component.
 * We infer this from their kill/assist/CS gold minus what they've already spent.
 */
function detectRecall(
  laneOpponent: PlayerInfo | null,
  gameTime: number
): IntentPrediction | null {
  if (!laneOpponent || laneOpponent.isDead) return null;

  const estimatedTotal = estimateGoldEarned(laneOpponent);
  const spentGold = totalItemValue(laneOpponent);
  const estimatedCurrentGold = Math.max(0, estimatedTotal - spentGold);

  let confidence = 0;
  let targetItem = '';

  // Check gold thresholds for key purchases
  for (const threshold of RECALL_GOLD_THRESHOLDS) {
    if (estimatedCurrentGold >= threshold.gold) {
      confidence += 0.2;
      targetItem = threshold.item;
      break;
    }
  }

  // Enemy laner has been in lane a while without buying (high CS, few items)
  const csPerMin = estimateCsPerMin(laneOpponent, gameTime);
  if (csPerMin >= 6 && countCompletedItems(laneOpponent) === 0 && gameTime > 300) {
    confidence += 0.15;
  }

  // After a kill, enemies often recall
  if (laneOpponent.scores.kills > 0 && gameTime < 600) {
    confidence += 0.05;
  }

  // Low estimated gold means they don't need to recall
  if (estimatedCurrentGold < 500) {
    return null;
  }

  if (confidence < 0.3) return null;

  const itemNote = targetItem ? ` for ${targetItem}` : '';
  return {
    intent: 'recall',
    confidence: Math.min(1, confidence),
    targetChampion: laneOpponent.championName,
    warning: `${laneOpponent.championName} likely recalling soon${itemNote}. Push the wave into their tower or get a cheater recall.`,
    timeWindow: 30,
  };
}

/**
 * Detect OBJECTIVE intent: dragon/baron spawning soon + enemy team is grouping
 * (multiple enemies alive, jungler alive).
 */
function detectObjective(
  enemies: PlayerInfo[],
  gameTime: number,
  objectives: ObjectiveInfo[] | null,
  events: GameEvent[]
): IntentPrediction | null {
  const jungler = findEnemyJungler(enemies);
  if (!jungler || jungler.isDead) return null;

  const aliveCount = countAliveEnemies(enemies);
  if (aliveCount < 3) return null; // Need at least 3 alive for objective

  let confidence = 0;
  let objectiveName = '';
  let timeWindow = 60;

  // Check objective status from provided info
  if (objectives && objectives.length > 0) {
    for (const obj of objectives) {
      if (obj.status === 'alive' || obj.status === 'spawning') {
        if (obj.type === 'baron' && gameTime >= 1200) {
          confidence += 0.3;
          objectiveName = 'Baron';
          timeWindow = 45;
        } else if (obj.type === 'dragon') {
          confidence += 0.2;
          objectiveName = obj.dragonType ? `${obj.dragonType} Dragon` : 'Dragon';
          timeWindow = 40;
        } else if (obj.type === 'herald' && gameTime >= 840 && gameTime < 1200) {
          confidence += 0.15;
          objectiveName = 'Rift Herald';
          timeWindow = 40;
        }
      }

      // Spawning soon: higher confidence
      if (obj.status === 'spawning' && obj.timer > 0 && obj.timer <= 60) {
        confidence += 0.15;
        timeWindow = Math.min(timeWindow, obj.timer);
      }
    }
  }

  // Fallback: use game time to estimate objective windows
  if (!objectiveName) {
    // Dragon spawns at 5:00, respawns every 5:00
    if (gameTime >= 270 && gameTime < 1200) {
      const timeSinceDragonWindow = (gameTime - 300) % 300;
      if (timeSinceDragonWindow >= 240 || gameTime < 330) {
        confidence += 0.15;
        objectiveName = 'Dragon';
        timeWindow = 45;
      }
    }
    // Baron spawns at 20:00
    if (gameTime >= 1140) {
      confidence += 0.2;
      objectiveName = objectiveName || 'Baron';
      timeWindow = 50;
    }
  }

  // More enemies alive = higher objective intent
  if (aliveCount >= 4) {
    confidence += 0.1;
  }
  if (aliveCount === 5) {
    confidence += 0.1;
  }

  // Enemy team has recent kills (power play)
  const recentKillEvents = events.filter(
    (e) => e.EventName === 'ChampionKill' && e.EventTime > gameTime - 30
  );
  if (recentKillEvents.length > 0) {
    confidence += 0.1;
  }

  if (confidence < 0.3 || !objectiveName) return null;

  return {
    intent: 'objective',
    confidence: Math.min(1, confidence),
    targetChampion: jungler.championName,
    warning: `Enemy team likely setting up for ${objectiveName}! Ward it and group with your team.`,
    timeWindow,
  };
}

/**
 * Detect GANK intent: enemy jungler not seen recently + game time matches
 * typical gank windows (3:00-4:00, after buff respawns).
 */
function detectGank(
  enemies: PlayerInfo[],
  myPlayer: PlayerInfo,
  gameTime: number,
  junglePrediction: JunglePrediction | null
): IntentPrediction | null {
  const jungler = findEnemyJungler(enemies);
  if (!jungler || jungler.isDead) return null;

  let confidence = 0;
  const reasons: string[] = [];

  // Use jungle prediction if available
  if (junglePrediction) {
    // High gank risk from jungle tracker
    if (junglePrediction.gankRisk >= 0.5) {
      confidence += 0.3;
      reasons.push('jungle tracker predicts gank');
    }

    // Jungler predicted on our side of the map
    const myPos = myPlayer.position.toUpperCase();
    const mySide = myPos === 'TOP' ? 'top' : (myPos === 'BOTTOM' || myPos === 'UTILITY') ? 'bot' : 'mid';
    if (junglePrediction.predictedSide === mySide) {
      confidence += 0.2;
      reasons.push(`jungler predicted ${mySide} side`);
    }

    // Jungler not seen in a long time = dangerous
    const timeSinceSeen = gameTime - junglePrediction.lastSeen;
    if (timeSinceSeen > 60) {
      confidence += 0.15;
      reasons.push(`jungler MIA for ${Math.floor(timeSinceSeen)}s`);
    } else if (timeSinceSeen > 30) {
      confidence += 0.08;
    }
  } else {
    // No jungle prediction: rely on timing
    confidence += 0.1;
  }

  // Classic gank timing windows
  // First clear gank: 2:30 - 4:00
  if (gameTime >= 150 && gameTime <= 240) {
    confidence += 0.15;
    reasons.push('first clear gank window');
  }
  // Post-buff respawn ganks: every 5 min after first buffs
  else if (gameTime > 240) {
    const buffRespawnCycle = (gameTime - 90) % 300;
    if (buffRespawnCycle >= 270 || buffRespawnCycle <= 30) {
      confidence += 0.1;
      reasons.push('buff respawn gank timing');
    }
  }

  // Jungler level 6 = ult gank threat
  if (jungler.level >= 6 && jungler.level <= 7) {
    confidence += 0.1;
    reasons.push('jungler just hit 6');
  }

  // Jungler archetype: aggressive early junglers gank more
  const meta = getChampionMeta(jungler.championName);
  if (meta && meta.archetypes.some((a) => a === 'assassin' || a === 'diver')) {
    confidence += 0.05;
  }

  // Jungler has kills = snowballing through ganks
  if (jungler.scores.kills >= 2) {
    confidence += 0.05;
  }

  if (confidence < 0.35) return null;

  const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'gank timing';
  return {
    intent: 'gank',
    confidence: Math.min(1, confidence),
    targetChampion: jungler.championName,
    warning: `${jungler.championName} gank incoming! (${reasonStr}). Ward up and play to your escape side.`,
    timeWindow: 20,
  };
}

/**
 * Detect FREEZE intent: enemy has a kill lead in lane but low CS rate
 * (they're winning but not pushing, trying to zone).
 */
function detectFreeze(
  laneOpponent: PlayerInfo | null,
  myPlayer: PlayerInfo,
  gameTime: number
): IntentPrediction | null {
  if (!laneOpponent || laneOpponent.isDead) return null;
  if (gameTime < 180) return null; // Too early to have freeze data

  let confidence = 0;
  const reasons: string[] = [];

  // Enemy has kill lead
  const killDiff = laneOpponent.scores.kills - myPlayer.scores.kills;
  if (killDiff >= 1) {
    confidence += 0.15;
    reasons.push(`${killDiff} kill advantage`);
  }

  // Enemy has low CS/min despite winning (freezing, not pushing)
  const enemyCsPerMin = estimateCsPerMin(laneOpponent, gameTime);
  const myCsPerMin = estimateCsPerMin(myPlayer, gameTime);

  // Freezing indicator: enemy CS is close to or lower than ours despite kill lead
  if (killDiff >= 1 && enemyCsPerMin <= myCsPerMin + 1.0 && enemyCsPerMin < 7.5) {
    confidence += 0.2;
    reasons.push('low CS despite kill lead');
  }

  // Enemy is ahead in levels but CS is moderate
  const levelDiff = laneOpponent.level - myPlayer.level;
  if (levelDiff >= 1 && enemyCsPerMin < 8) {
    confidence += 0.1;
    reasons.push('level advantage with moderate farm');
  }

  // Lane bullies with advantage are more likely to freeze
  const meta = getChampionMeta(laneOpponent.championName);
  if (meta && meta.archetypes.some((a) => a === 'juggernaut' || a === 'bruiser' || a === 'skirmisher')) {
    confidence += 0.1;
    reasons.push(`${laneOpponent.championName} lane bully archetype`);
  }

  // Early-mid game is when freezing matters most
  if (gameTime >= 300 && gameTime <= 1200) {
    confidence += 0.05;
  }

  if (confidence < 0.35) return null;

  const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'lane control';
  return {
    intent: 'freeze',
    confidence: Math.min(1, confidence),
    targetChampion: laneOpponent.championName,
    warning: `${laneOpponent.championName} may be freezing the wave (${reasonStr}). Ask jungler for help to break the freeze, or roam.`,
    timeWindow: 45,
  };
}

/**
 * Detect PUSH AND ROAM intent: enemy has waveclear items + mid game + is a
 * waveclear champion.
 */
function detectPushAndRoam(
  enemies: PlayerInfo[],
  _myPlayer: PlayerInfo,
  gameTime: number
): IntentPrediction | null {
  // Most relevant for mid laners
  const midEnemies = enemies.filter(
    (e) => !e.isDead && e.position.toUpperCase() === 'MIDDLE'
  );

  for (const enemy of midEnemies) {
    let confidence = 0;
    const reasons: string[] = [];

    // Waveclear champion
    if (WAVECLEAR_CHAMPIONS.has(enemy.championName)) {
      confidence += 0.2;
      reasons.push('waveclear champion');
    }

    // Has completed an item (waveclear becomes efficient)
    const completedItems = countCompletedItems(enemy);
    if (completedItems >= 1) {
      confidence += 0.15;
      reasons.push('completed item');
    }

    // Mid game timing
    if (gameTime >= 600 && gameTime <= 1500) {
      confidence += 0.1;
      reasons.push('mid game');
    }

    // Enemy has kills/assists suggesting roam-heavy playstyle
    if (enemy.scores.kills + enemy.scores.assists >= 4 && gameTime < 1200) {
      confidence += 0.1;
      reasons.push('high KP');
    }

    // Assassin with waveclear items
    const meta = getChampionMeta(enemy.championName);
    if (meta && meta.archetypes.includes('assassin') && completedItems >= 1) {
      confidence += 0.1;
      reasons.push('assassin with items');
    }

    // Has boots of mobility or similar roaming items
    const hasMobility = enemy.items.some(
      (i) => i.displayName.toLowerCase().includes('mobility')
    );
    if (hasMobility) {
      confidence += 0.1;
      reasons.push('Boots of Mobility');
    }

    if (confidence < 0.35) continue;

    const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'push and roam pattern';
    return {
      intent: 'push_and_roam',
      confidence: Math.min(1, confidence),
      targetChampion: enemy.championName,
      warning: `${enemy.championName} will push and roam (${reasonStr}). Ping your sidelanes and track their movement.`,
      timeWindow: 30,
    };
  }

  return null;
}

/**
 * Detect PASSIVE intent: enemy is farming safely, not threatening kills.
 * This is the fallback when no aggressive intent is detected.
 */
function detectPassive(
  laneOpponent: PlayerInfo | null,
  myPlayer: PlayerInfo,
  gameTime: number
): IntentPrediction | null {
  if (!laneOpponent || laneOpponent.isDead) return null;

  let confidence = 0;

  // Enemy is behind in kills
  const killDiff = laneOpponent.scores.kills - myPlayer.scores.kills;
  if (killDiff <= -1) {
    confidence += 0.2;
  }

  // Enemy is behind in levels
  if (laneOpponent.level < myPlayer.level) {
    confidence += 0.15;
  }

  // Enemy has no ignite (less aggressive summoner setup)
  if (!hasIgnite(laneOpponent)) {
    confidence += 0.05;
  }

  // Enemy has TP (indicates farming/scaling mindset in lane)
  if (hasTeleport(laneOpponent)) {
    confidence += 0.1;
  }

  // Scaling champion archetype
  const spikeData = getPowerSpike(laneOpponent.championName);
  if (spikeData?.archetype === 'late') {
    confidence += 0.2;
  }

  // Enemy has decent CS but low kills = farming
  const csPerMin = estimateCsPerMin(laneOpponent, gameTime);
  if (csPerMin >= 6 && laneOpponent.scores.kills <= 1 && gameTime > 300) {
    confidence += 0.15;
  }

  if (confidence < 0.3) return null;

  return {
    intent: 'passive',
    confidence: Math.min(1, confidence),
    targetChampion: laneOpponent.championName,
    warning: `${laneOpponent.championName} is playing passive. Look for aggressive trades or zone them off CS.`,
    timeWindow: 60,
  };
}

// ── Main Public API ──

/**
 * Predict all enemy intents based on current game state.
 * Returns an array of predictions sorted by confidence (highest first).
 */
export function predictEnemyIntents(
  allPlayers: PlayerInfo[],
  myPlayer: PlayerInfo,
  events: GameEvent[],
  gameTime: number,
  objectives: ObjectiveInfo[] | null,
  junglePrediction: JunglePrediction | null
): IntentPrediction[] {
  const predictions: IntentPrediction[] = [];
  const enemies = getEnemies(allPlayers, myPlayer.team);
  const allies = getAllies(allPlayers, myPlayer.team);
  const laneOpponent = findLaneOpponent(enemies, myPlayer.position);

  // Calculate our HP ratio from the allPlayers data
  // The active player's HP is available via ActivePlayer.championStats
  // but here we work with PlayerInfo, so we estimate from context
  // We'll use a heuristic: if we've died recently, we might be low
  const myPlayerCurrentHPRatio = myPlayer.isDead ? 0 :
    myPlayer.respawnTimer > 0 ? 0.3 : 0.7; // Conservative estimate

  // Run all detectors
  const allIn = detectAllIn(laneOpponent, myPlayer, gameTime);
  if (allIn) predictions.push(allIn);

  const dive = detectDive(enemies, myPlayer, myPlayerCurrentHPRatio, gameTime);
  if (dive) predictions.push(dive);

  const roam = detectRoam(enemies, allies, myPlayer, gameTime);
  if (roam) predictions.push(roam);

  const recall = detectRecall(laneOpponent, gameTime);
  if (recall) predictions.push(recall);

  const objective = detectObjective(enemies, gameTime, objectives, events);
  if (objective) predictions.push(objective);

  const gank = detectGank(enemies, myPlayer, gameTime, junglePrediction);
  if (gank) predictions.push(gank);

  const freeze = detectFreeze(laneOpponent, myPlayer, gameTime);
  if (freeze) predictions.push(freeze);

  const pushRoam = detectPushAndRoam(enemies, myPlayer, gameTime);
  if (pushRoam) predictions.push(pushRoam);

  const passive = detectPassive(laneOpponent, myPlayer, gameTime);
  if (passive) predictions.push(passive);

  // Sort by confidence descending
  predictions.sort((a, b) => b.confidence - a.confidence);

  return predictions;
}

/**
 * Get the single highest-threat intent from a list of predictions.
 * "Threat" means the highest confidence non-passive prediction.
 * Falls back to the highest-confidence prediction if all are passive.
 */
export function getHighestThreatIntent(
  predictions: IntentPrediction[]
): IntentPrediction | null {
  if (predictions.length === 0) return null;

  // Priority order: immediate threats first
  const threatPriority: Record<EnemyIntent, number> = {
    dive: 10,
    gank: 9,
    all_in: 8,
    objective: 7,
    roam: 6,
    push_and_roam: 5,
    freeze: 4,
    recall: 3,
    passive: 1,
  };

  // Score = confidence * priority weight, so high-confidence threats win
  let bestPrediction: IntentPrediction | null = null;
  let bestScore = -1;

  for (const pred of predictions) {
    const priority = threatPriority[pred.intent] ?? 1;
    // Scale confidence by priority so that a 0.6 dive beats a 0.7 passive
    const score = pred.confidence * (priority / 10);
    if (score > bestScore) {
      bestScore = score;
      bestPrediction = pred;
    }
  }

  return bestPrediction;
}

// ── Coaching Tip Generation ──

let tipIdCounter = 0;

/**
 * Convert an intent prediction into an actionable coaching tip.
 * Returns null for low-confidence or passive intents (no tip needed).
 */
export function generateIntentTip(
  prediction: IntentPrediction
): CoachingTip | null {
  // Don't generate tips for low confidence or passive play
  if (prediction.confidence < 0.35) return null;
  if (prediction.intent === 'passive' && prediction.confidence < 0.5) return null;

  tipIdCounter++;
  const id = `intent-${prediction.intent}-${Date.now()}-${tipIdCounter}`;

  switch (prediction.intent) {
    case 'all_in':
      return {
        id,
        message: prediction.warning,
        priority: prediction.confidence >= 0.6 ? 'danger' : 'warning',
        category: 'trading',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'dive':
      return {
        id,
        message: prediction.warning,
        priority: 'danger',
        category: 'positioning',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'roam':
      return {
        id,
        message: prediction.warning,
        priority: prediction.confidence >= 0.5 ? 'danger' : 'warning',
        category: 'macro',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'recall':
      return {
        id,
        message: prediction.warning,
        priority: 'info',
        category: 'macro',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'objective':
      return {
        id,
        message: prediction.warning,
        priority: prediction.confidence >= 0.6 ? 'danger' : 'warning',
        category: 'objective',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'gank':
      return {
        id,
        message: prediction.warning,
        priority: prediction.confidence >= 0.6 ? 'danger' : 'warning',
        category: 'jungle',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'freeze':
      return {
        id,
        message: prediction.warning,
        priority: 'warning',
        category: 'farming',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'push_and_roam':
      return {
        id,
        message: prediction.warning,
        priority: prediction.confidence >= 0.5 ? 'danger' : 'warning',
        category: 'macro',
        timestamp: Date.now(),
        dismissed: false,
      };

    case 'passive':
      return {
        id,
        message: prediction.warning,
        priority: 'info',
        category: 'trading',
        timestamp: Date.now(),
        dismissed: false,
      };

    default:
      return null;
  }
}
