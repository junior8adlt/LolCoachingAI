import type {
  AllGameData,
  ActivePlayer,
  GameEvent,
  PlayerInfo,
} from '../types/game';
import type {
  FarmingStats,
  ThreatAssessment,
  ThreatLevel,
  ThreatType,
  CoachingTip,
  TipPriority,
  TipCategory,
  PostGameAnalysis,
  PostGameGrades,
  PostGameStats,
  KeyMistake,
  PerformanceGrade,
  ObjectiveInfo,
} from '../types/coaching';
import { getPowerSpike } from '../data/powerSpikes';
import { getMatchupData } from '../data/matchups';

export interface AnalysisResult {
  tips: CoachingTip[];
  threats: ThreatAssessment[];
  farmingStats: FarmingStats;
  objectives: ObjectiveInfo[];
  shouldRecall: boolean;
  recallReason: string;
}

let tipCounter = 0;

function createTip(
  message: string,
  priority: TipPriority,
  category: TipCategory
): CoachingTip {
  tipCounter += 1;
  return {
    id: `tip-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

function getIdealCSForTime(gameTimeSeconds: number): number {
  const minutes = gameTimeSeconds / 60;
  if (minutes <= 0) return 0;
  const wavesPerMinute = 1;
  const minionsPerWave = 6.5;
  return Math.floor(minutes * wavesPerMinute * minionsPerWave);
}

export function analyzeFarming(
  _activePlayer: ActivePlayer,
  gameTime: number,
  players: PlayerInfo[],
  summonerName: string
): FarmingStats {
  const player = players.find((p) => p.summonerName === summonerName);
  const currentCS = player?.scores.creepScore ?? 0;
  const minutes = gameTime / 60;
  const csPerMin = minutes > 0 ? currentCS / minutes : 0;
  const targetCS = getIdealCSForTime(gameTime);
  const missedCS = Math.max(0, targetCS - currentCS);
  const efficiency = targetCS > 0 ? Math.min(100, (currentCS / targetCS) * 100) : 100;

  return {
    currentCS,
    csPerMin: Math.round(csPerMin * 10) / 10,
    targetCS,
    missedCS,
    efficiency: Math.round(efficiency),
  };
}

export function analyzeThreats(
  enemies: PlayerInfo[],
  _gameTime: number,
  myPlayer?: PlayerInfo
): ThreatAssessment[] {
  const myKills = myPlayer?.scores.kills ?? 0;
  const myDeaths = myPlayer?.scores.deaths ?? 0;
  const myKDA = myDeaths === 0 ? myKills : myKills / myDeaths;

  return enemies.map((enemy) => {
    const { kills, deaths, assists } = enemy.scores;
    const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
    const totalGoldFromKills = kills * 300 + assists * 150;

    // Compare relative to player - someone 2/1 isn't "fed" if you're 5/0
    const isActuallyDangerous = kills >= 4 || (kda >= 3 && kills >= 3) || totalGoldFromKills >= 2500;
    const isAheadOfMe = kda > myKDA + 1 && kills >= 3;

    let threatLevel: ThreatLevel = 'low';
    if (isActuallyDangerous || (isAheadOfMe && totalGoldFromKills >= 1500)) {
      threatLevel = 'high';
    } else if (kills >= 3 || (kda >= 2.5 && totalGoldFromKills >= 1000)) {
      threatLevel = 'medium';
    }

    const spikeData = getPowerSpike(enemy.championName);
    if (spikeData) {
      const isAtSpike = spikeData.levelSpikes.includes(enemy.level);
      if (isAtSpike && threatLevel !== 'high') {
        threatLevel = threatLevel === 'low' ? 'medium' : 'high';
      }
    }

    const threatTypes: ThreatType[] = determineThreatTypes(enemy);

    const notes = buildThreatNotes(enemy, kda, threatLevel);

    return {
      championName: enemy.championName,
      threatLevel,
      threatTypes,
      notes,
    };
  });
}

function determineThreatTypes(enemy: PlayerInfo): ThreatType[] {
  const types: ThreatType[] = [];
  const spikeData = getPowerSpike(enemy.championName);

  if (!spikeData) {
    if (enemy.scores.kills >= 3) types.push('burst');
    return types.length > 0 ? types : ['sustained'];
  }

  const archetype = spikeData.archetype;
  const role = spikeData.role;

  if (role === 'jng') {
    types.push('engage');
  }

  if (archetype === 'early') {
    types.push('burst');
  }

  const assassins = [
    'Zed', 'Talon', 'Fizz', 'Katarina', 'Akali', 'LeBlanc',
    'Rengar', 'KhaZix', 'Evelynn', 'Qiyana', 'Pyke',
  ];
  if (assassins.includes(enemy.championName)) {
    types.push('assassin');
  }

  const pokers = [
    'Xerath', 'Ziggs', 'Lux', 'Vel\'Koz', 'Jayce', 'Caitlyn',
  ];
  if (pokers.includes(enemy.championName)) {
    types.push('poke');
  }

  const ccHeavy = [
    'Nautilus', 'Leona', 'Amumu', 'Sejuani', 'Malzahar',
    'Morgana', 'Thresh', 'Annie',
  ];
  if (ccHeavy.includes(enemy.championName)) {
    types.push('cc');
  }

  const splitters = [
    'Fiora', 'Jax', 'Tryndamere', 'Yorick', 'Camille', 'Nasus',
  ];
  if (splitters.includes(enemy.championName)) {
    types.push('splitpush');
  }

  const divers = [
    'Irelia', 'Camille', 'Vi', 'Jarvan IV', 'Hecarim', 'Diana',
  ];
  if (divers.includes(enemy.championName)) {
    types.push('dive');
  }

  if (types.length === 0) {
    types.push('sustained');
  }

  return types;
}

function buildThreatNotes(
  enemy: PlayerInfo,
  kda: number,
  threatLevel: ThreatLevel
): string {
  const parts: string[] = [];
  const { kills, deaths, assists } = enemy.scores;

  if (threatLevel === 'high') {
    parts.push(`${enemy.championName} is fed (${kills}/${deaths}/${assists}, ${kda.toFixed(1)} KDA)`);
  } else if (threatLevel === 'medium') {
    parts.push(`${enemy.championName} is doing well (${kills}/${deaths}/${assists})`);
  } else {
    parts.push(`${enemy.championName} is not a major threat (${kills}/${deaths}/${assists})`);
  }

  if (enemy.isDead) {
    parts.push('Currently dead');
  }

  return parts.join('. ') + '.';
}

export function detectOverextension(
  activePlayer: ActivePlayer,
  gameTime: number,
  events: GameEvent[]
): boolean {
  const healthPercent =
    activePlayer.championStats.currentHealth /
    activePlayer.championStats.maxHealth;
  const manaPercent =
    activePlayer.championStats.resourceMax > 0
      ? activePlayer.championStats.resourceValue /
        activePlayer.championStats.resourceMax
      : 1;

  if (healthPercent < 0.3) return true;
  if (healthPercent < 0.5 && manaPercent < 0.2) return true;

  const recentDeaths = events.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      e.VictimName === activePlayer.summonerName &&
      gameTime - e.EventTime < 120
  );
  if (recentDeaths.length >= 2) return true;

  return false;
}

export function analyzeWaveState(
  events: GameEvent[],
  gameTime: number
): string {
  const recentKills = events.filter(
    (e) =>
      (e.EventName === 'ChampionKill' || e.EventName === 'TurretKilled') &&
      gameTime - e.EventTime < 60
  );

  if (recentKills.length > 0) {
    const turretKills = recentKills.filter(
      (e) => e.EventName === 'TurretKilled'
    );
    if (turretKills.length > 0) {
      return 'Turret recently fell - wave dynamics are shifting. Consider adjusting your positioning.';
    }
    return 'Recent champion kills may affect wave state. Watch for slow pushes.';
  }

  const minutes = gameTime / 60;
  const waveNumber = Math.floor(minutes * 2);
  if (waveNumber % 3 === 0) {
    return 'Cannon wave incoming. Prioritize cannon CS.';
  }

  return 'Standard wave pattern. Focus on last-hitting.';
}

export function checkRecallTiming(
  activePlayer: ActivePlayer
): { shouldRecall: boolean; reason: string } {
  const healthPercent =
    activePlayer.championStats.currentHealth /
    activePlayer.championStats.maxHealth;
  const manaPercent =
    activePlayer.championStats.resourceMax > 0
      ? activePlayer.championStats.resourceValue /
        activePlayer.championStats.resourceMax
      : 1;
  const gold = activePlayer.currentGold;

  if (healthPercent < 0.25) {
    return {
      shouldRecall: true,
      reason: `Health critically low (${Math.round(healthPercent * 100)}%). Recall immediately.`,
    };
  }

  if (healthPercent < 0.4 && manaPercent < 0.15) {
    return {
      shouldRecall: true,
      reason: 'Low health and almost out of mana. Good time to recall.',
    };
  }

  if (gold >= 1300 && healthPercent < 0.6) {
    return {
      shouldRecall: true,
      reason: `You have ${gold}g and are low on health. Recall for a power spike buy.`,
    };
  }

  if (gold >= 2000) {
    return {
      shouldRecall: true,
      reason: `Sitting on ${gold}g. Recall to spend gold and gain an item advantage.`,
    };
  }

  if (gold >= 900 && healthPercent < 0.5) {
    return {
      shouldRecall: true,
      reason: `${gold}g available with low health. Consider recalling for components.`,
    };
  }

  return { shouldRecall: false, reason: '' };
}

export function analyzeDeathCause(
  events: GameEvent[],
  playerName: string
): string {
  const deaths = events
    .filter(
      (e) => e.EventName === 'ChampionKill' && e.VictimName === playerName
    )
    .sort((a, b) => b.EventTime - a.EventTime);

  if (deaths.length === 0) {
    return 'No deaths recorded.';
  }

  const lastDeath = deaths[0];
  const killer = lastDeath.KillerName ?? 'Unknown';
  const assisters = lastDeath.Assisters ?? [];
  const timeStr = formatGameTime(lastDeath.EventTime);

  if (assisters.length >= 3) {
    return `Killed by ${killer} with ${assisters.length} assists at ${timeStr}. You were caught in a teamfight or collapsed on. Check your positioning.`;
  }

  if (assisters.length >= 1) {
    return `Killed by ${killer} (assisted by ${assisters.join(', ')}) at ${timeStr}. You were ganked or outnumbered. Improve your map awareness and ward coverage.`;
  }

  return `Solo killed by ${killer} at ${timeStr}. Review the matchup and avoid unfavorable trades.`;
}

function formatGameTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function analyzeGameState(
  gameData: AllGameData,
  previousEvents: GameEvent[] = []
): AnalysisResult {
  const { activePlayer, allPlayers, events, gameData: gd } = gameData;
  const gameTime = gd.gameTime;
  const tips: CoachingTip[] = [];

  const myTeam = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  )?.team;
  const enemies = allPlayers.filter((p) => p.team !== myTeam);
  const allies = allPlayers.filter(
    (p) => p.team === myTeam && p.summonerName !== activePlayer.summonerName
  );

  const farmStats = analyzeFarming(
    activePlayer,
    gameTime,
    allPlayers,
    activePlayer.summonerName
  );

  if (farmStats.efficiency < 50 && gameTime > 300) {
    tips.push(
      createTip(
        `Your CS is ${farmStats.currentCS} (${farmStats.csPerMin}/min). Target is ${farmStats.targetCS}. Focus on last-hitting.`,
        'warning',
        'farming'
      )
    );
  } else if (farmStats.efficiency < 70 && gameTime > 300) {
    tips.push(
      createTip(
        `CS could be better: ${farmStats.csPerMin}/min. Try to hit ${Math.ceil(farmStats.targetCS / (gameTime / 60))}/min.`,
        'info',
        'farming'
      )
    );
  }

  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const threats = analyzeThreats(enemies, gameTime, myPlayer);

  const highThreats = threats.filter((t) => t.threatLevel === 'high');
  for (const threat of highThreats) {
    tips.push(
      createTip(
        `Watch out for ${threat.championName} - they are fed! ${threat.notes}`,
        'danger',
        'positioning'
      )
    );
  }

  const isOverextended = detectOverextension(activePlayer, gameTime, events.Events);
  if (isOverextended) {
    tips.push(
      createTip(
        'You may be overextended. Consider falling back to a safer position.',
        'warning',
        'positioning'
      )
    );
  }

  const recall = checkRecallTiming(activePlayer);
  if (recall.shouldRecall) {
    tips.push(createTip(recall.reason, 'warning', 'recall'));
  }

  if (myPlayer) {
    const laneOpponent = enemies.find(
      (e) => e.position === myPlayer.position && myPlayer.position !== ''
    );
    if (laneOpponent) {
      const matchup = getMatchupData(myPlayer.championName, laneOpponent.championName);
      if (matchup) {
        if (matchup.difficulty >= 4) {
          tips.push(
            createTip(
              `Tough matchup vs ${laneOpponent.championName}. ${matchup.tips[0] ?? 'Play safe and farm.'}`,
              'warning',
              'matchup'
            )
          );
        }
      }
    }
  }

  const newEvents = events.Events.filter(
    (e) => !previousEvents.some((pe) => pe.EventID === e.EventID)
  );
  for (const event of newEvents) {
    if (
      event.EventName === 'DragonKill' &&
      event.KillerName &&
      !isAllyPlayer(event.KillerName, allies, activePlayer.summonerName)
    ) {
      tips.push(
        createTip(
          `Enemy team secured ${event.DragonType ?? ''} Dragon. Prioritize the next dragon spawn.`,
          'warning',
          'objective'
        )
      );
    }

    if (
      event.EventName === 'BaronKill' &&
      event.KillerName &&
      !isAllyPlayer(event.KillerName, allies, activePlayer.summonerName)
    ) {
      tips.push(
        createTip(
          'Enemy team got Baron! Play safe, clear waves, and avoid unfavorable fights.',
          'danger',
          'objective'
        )
      );
    }

    if (
      event.EventName === 'ChampionKill' &&
      event.VictimName === activePlayer.summonerName
    ) {
      const deathAnalysis = analyzeDeathCause(events.Events, activePlayer.summonerName);
      tips.push(createTip(deathAnalysis, 'info', 'positioning'));
    }
  }

  const objectives = deriveObjectives(events.Events, gameTime);

  return {
    tips,
    threats,
    farmingStats: farmStats,
    objectives,
    shouldRecall: recall.shouldRecall,
    recallReason: recall.reason,
  };
}

function isAllyPlayer(
  name: string,
  allies: PlayerInfo[],
  selfName: string
): boolean {
  if (name === selfName) return true;
  return allies.some((a) => a.summonerName === name);
}

function deriveObjectives(
  events: GameEvent[],
  gameTime: number
): ObjectiveInfo[] {
  const objectives: ObjectiveInfo[] = [];

  const dragonKills = events.filter((e) => e.EventName === 'DragonKill');
  const lastDragon = dragonKills.length > 0 ? dragonKills[dragonKills.length - 1] : null;

  if (lastDragon) {
    const timeSinceKill = gameTime - lastDragon.EventTime;
    const respawnTime = 300;
    if (timeSinceKill < respawnTime) {
      objectives.push({
        type: 'dragon',
        status: 'dead',
        timer: Math.round(respawnTime - timeSinceKill),
        dragonType: lastDragon.DragonType,
      });
    } else {
      objectives.push({ type: 'dragon', status: 'alive', timer: 0 });
    }
  } else {
    if (gameTime >= 300) {
      objectives.push({ type: 'dragon', status: 'alive', timer: 0 });
    } else {
      objectives.push({
        type: 'dragon',
        status: 'spawning',
        timer: Math.round(300 - gameTime),
      });
    }
  }

  const heraldKills = events.filter((e) => e.EventName === 'HeraldKill');
  if (gameTime < 1200) {
    if (heraldKills.length === 0) {
      if (gameTime >= 480) {
        objectives.push({ type: 'herald', status: 'alive', timer: 0 });
      } else {
        objectives.push({
          type: 'herald',
          status: 'spawning',
          timer: Math.round(480 - gameTime),
        });
      }
    } else if (heraldKills.length === 1) {
      const timeSince = gameTime - heraldKills[0].EventTime;
      const respawnTime = 360;
      if (timeSince < respawnTime && gameTime + (respawnTime - timeSince) < 1200) {
        objectives.push({
          type: 'herald',
          status: 'dead',
          timer: Math.round(respawnTime - timeSince),
        });
      } else {
        objectives.push({ type: 'herald', status: 'dead', timer: 0 });
      }
    }
  }

  const baronKills = events.filter((e) => e.EventName === 'BaronKill');
  if (gameTime >= 1200) {
    const lastBaron = baronKills.length > 0 ? baronKills[baronKills.length - 1] : null;
    if (lastBaron) {
      const timeSince = gameTime - lastBaron.EventTime;
      const respawnTime = 360;
      if (timeSince < respawnTime) {
        objectives.push({
          type: 'baron',
          status: 'dead',
          timer: Math.round(respawnTime - timeSince),
        });
      } else {
        objectives.push({ type: 'baron', status: 'alive', timer: 0 });
      }
    } else {
      objectives.push({ type: 'baron', status: 'alive', timer: 0 });
    }
  } else {
    objectives.push({
      type: 'baron',
      status: 'spawning',
      timer: Math.round(1200 - gameTime),
    });
  }

  return objectives;
}

function gradeValue(
  value: number,
  thresholds: [number, number, number, number, number, number]
): PerformanceGrade {
  const [sPlus, s, a, b, c, d] = thresholds;
  if (value >= sPlus) return 'S+';
  if (value >= s) return 'S';
  if (value >= a) return 'A';
  if (value >= b) return 'B';
  if (value >= c) return 'C';
  if (value >= d) return 'D';
  return 'F';
}

export function generatePostGameReport(
  allData: AllGameData,
  allEvents: GameEvent[]
): PostGameAnalysis {
  const { activePlayer, allPlayers, gameData: gd } = allData;
  const duration = gd.gameTime;
  const minutes = duration / 60;

  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const scores = myPlayer?.scores ?? {
    kills: 0,
    deaths: 0,
    assists: 0,
    creepScore: 0,
    wardScore: 0,
  };

  const myTeam = myPlayer?.team;
  const teamKills = allPlayers
    .filter((p) => p.team === myTeam)
    .reduce((sum, p) => sum + p.scores.kills, 0);
  const killParticipation =
    teamKills > 0 ? ((scores.kills + scores.assists) / teamKills) * 100 : 0;

  const csPerMin = minutes > 0 ? scores.creepScore / minutes : 0;

  const stats: PostGameStats = {
    kills: scores.kills,
    deaths: scores.deaths,
    assists: scores.assists,
    cs: scores.creepScore,
    csPerMin: Math.round(csPerMin * 10) / 10,
    visionScore: scores.wardScore,
    goldEarned: activePlayer.currentGold,
    damageDealt: 0,
    killParticipation: Math.round(killParticipation),
  };

  const farmingGrade = gradeValue(csPerMin, [10, 8.5, 7, 6, 5, 3.5]);
  const visionGrade = gradeValue(
    minutes > 0 ? scores.wardScore / minutes : 0,
    [2.0, 1.5, 1.2, 0.8, 0.5, 0.3]
  );

  const kda =
    scores.deaths === 0
      ? scores.kills + scores.assists
      : (scores.kills + scores.assists) / scores.deaths;
  const laningGrade = gradeValue(kda, [8, 5, 3.5, 2.5, 1.5, 0.8]);

  const objectiveGrade = gradeValue(
    killParticipation,
    [80, 65, 55, 45, 35, 20]
  );

  const teamfightGrade = gradeValue(kda * (killParticipation / 100), [
    5, 3.5, 2.5, 1.5, 1, 0.5,
  ]);

  const overallScore =
    (gradeToNum(farmingGrade) +
      gradeToNum(visionGrade) +
      gradeToNum(laningGrade) +
      gradeToNum(objectiveGrade) +
      gradeToNum(teamfightGrade)) /
    5;
  const overallGrade = numToGrade(overallScore);

  const grades: PostGameGrades = {
    laning: laningGrade,
    farming: farmingGrade,
    vision: visionGrade,
    teamfighting: teamfightGrade,
    objectives: objectiveGrade,
    overall: overallGrade,
  };

  const keyMistakes: KeyMistake[] = [];
  const deaths = allEvents.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      e.VictimName === activePlayer.summonerName
  );
  for (const death of deaths) {
    const assisters = death.Assisters ?? [];
    let category: TipCategory = 'positioning';
    let severity: TipPriority = 'warning';
    let description: string;

    if (assisters.length >= 2) {
      description = `Died to a ${assisters.length + 1}-man collapse by ${death.KillerName} at ${formatGameTime(death.EventTime)}. Improve map awareness.`;
      category = 'vision';
      severity = 'danger';
    } else if (assisters.length === 1) {
      description = `Died to a gank by ${death.KillerName} + ${assisters[0]} at ${formatGameTime(death.EventTime)}.`;
      category = 'jungle';
    } else {
      description = `Solo killed by ${death.KillerName} at ${formatGameTime(death.EventTime)}. Review trade patterns.`;
      category = 'trading';
    }

    keyMistakes.push({
      timestamp: death.EventTime,
      description,
      category,
      severity,
    });
  }

  const improvementTips: string[] = [];

  if (csPerMin < 6) {
    improvementTips.push(
      'Practice last-hitting in practice tool. Aim for 7+ CS/min.'
    );
  }
  if (scores.wardScore < minutes * 0.6) {
    improvementTips.push(
      'Place more wards. Vision control wins games. Aim for 1+ vision score per minute.'
    );
  }
  if (scores.deaths > 5) {
    improvementTips.push(
      `You died ${scores.deaths} times. Focus on playing safer and tracking enemy cooldowns.`
    );
  }
  if (killParticipation < 40) {
    improvementTips.push(
      'Low kill participation. Try to be more involved in team plays and skirmishes.'
    );
  }
  if (deaths.length > 0) {
    const soloDeaths = deaths.filter(
      (d) => !d.Assisters || d.Assisters.length === 0
    );
    if (soloDeaths.length >= 3) {
      improvementTips.push(
        `You were solo killed ${soloDeaths.length} times. Study the matchup and avoid overcommitting to trades.`
      );
    }
  }

  if (improvementTips.length === 0) {
    improvementTips.push(
      'Solid performance! Focus on maintaining consistency across games.'
    );
  }

  return {
    grades,
    keyMistakes,
    stats,
    improvementTips,
    duration,
  };
}

function gradeToNum(grade: PerformanceGrade): number {
  const map: Record<PerformanceGrade, number> = {
    'S+': 7,
    S: 6,
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    F: 1,
  };
  return map[grade];
}

function numToGrade(num: number): PerformanceGrade {
  if (num >= 6.5) return 'S+';
  if (num >= 5.5) return 'S';
  if (num >= 4.5) return 'A';
  if (num >= 3.5) return 'B';
  if (num >= 2.5) return 'C';
  if (num >= 1.5) return 'D';
  return 'F';
}
