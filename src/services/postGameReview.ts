// @ts-nocheck
import type { GameEvent, PlayerInfo, ActivePlayer } from '../types/game';
import type { FarmingStats } from '../types/coaching';
import type { DeathAnalysisResult } from './deathAnalyzer';

// ── Post-Game AI Coach Review System ──
// After the game ends, generates a detailed coaching review like a real
// Challenger coach doing VOD review. Uses all game data accumulated during
// the match to produce scores, highlight mistakes, and build an improvement plan.

// ── Interfaces ──

export interface MistakeReview {
  timestamp: number;
  description: string;
  whatToDo: string;
  category: 'farming' | 'positioning' | 'vision' | 'macro' | 'trading';
  impactLevel: 'minor' | 'major' | 'game_changing';
}

export interface Opportunity {
  timestamp: number;
  description: string;
  potentialGain: string;
}

export interface PostGameReview {
  macroScore: number;
  mechanicsScore: number;
  farmingScore: number;
  visionScore: number;
  decisionScore: number;
  overallScore: number;

  biggestMistakes: MistakeReview[];
  missedOpportunities: Opportunity[];
  bestPlays: string[];

  primaryFocus: string;
  improvementPlan: string[];

  coachSummary: string;
}

// ── Constants ──

const OBJECTIVE_NAMES = ['DragonKill', 'BaronKill', 'HeraldKill'];
const OBJECTIVE_SPAWN_TIMES: Record<string, number> = {
  dragon: 300,   // 5:00
  herald: 480,   // 8:00
  baron: 1200,   // 20:00
};
const OBJECTIVE_RESPAWN_TIMES: Record<string, number> = {
  dragon: 300,
  baron: 360,
  herald: 480,
};

// ── Score Calculators ──

function calcMacroScore(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  gameTime: number
): number {
  const myName = activePlayer.summonerName;
  const myPlayer = allPlayers.find((p) => p.summonerName === myName);
  const myTeam = myPlayer?.team ?? 'ORDER';

  let score = 50;

  // Objective participation: did you assist or kill objectives?
  const teamObjectiveEvents = allEvents.filter(
    (e) =>
      OBJECTIVE_NAMES.includes(e.EventName) &&
      (e.KillerName === myName ||
        (e.Assisters ?? []).includes(myName) ||
        isTeammate(e.KillerName ?? '', allPlayers, myTeam))
  );
  const myObjectiveParticipation = allEvents.filter(
    (e) =>
      OBJECTIVE_NAMES.includes(e.EventName) &&
      (e.KillerName === myName || (e.Assisters ?? []).includes(myName))
  );
  const totalTeamObjectives = teamObjectiveEvents.length;
  if (totalTeamObjectives > 0) {
    const participationRate = myObjectiveParticipation.length / totalTeamObjectives;
    score += participationRate * 25;
  }

  // Tower damage contribution: approximate via turret kills involvement
  const turretKills = allEvents.filter(
    (e) =>
      e.EventName === 'TurretKilled' &&
      (e.KillerName === myName || (e.Assisters ?? []).includes(myName))
  );
  score += Math.min(turretKills.length * 5, 15);

  // Penalize solo deaths (dying alone, not in teamfight)
  const myDeaths = allEvents.filter(
    (e) => e.EventName === 'ChampionKill' && e.VictimName === myName
  );
  const soloDeaths = myDeaths.filter((d) => {
    const nearbyAllyDeaths = allEvents.filter(
      (e) =>
        e.EventName === 'ChampionKill' &&
        e.VictimName !== myName &&
        isTeammate(e.VictimName ?? '', allPlayers, myTeam) &&
        Math.abs(e.EventTime - d.EventTime) < 10
    );
    return nearbyAllyDeaths.length === 0;
  });
  score -= soloDeaths.length * 5;

  // Bonus for game duration efficiency (ending games faster = better macro)
  const gameMinutes = gameTime / 60;
  if (gameMinutes < 25) score += 5;
  else if (gameMinutes > 40) score -= 5;

  return clamp(Math.round(score), 0, 100);
}

function calcMechanicsScore(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer
): number {
  const myName = activePlayer.summonerName;
  const myPlayer = allPlayers.find((p) => p.summonerName === myName);
  const myTeam = myPlayer?.team ?? 'ORDER';
  const scores = myPlayer?.scores;
  if (!scores) return 50;

  let score = 50;

  const kills = scores.kills;
  const deaths = scores.deaths;
  const assists = scores.assists;

  // KDA contribution
  const kda = (kills + assists) / Math.max(1, deaths);
  if (kda >= 5) score += 25;
  else if (kda >= 3) score += 15;
  else if (kda >= 2) score += 8;
  else if (kda < 1) score -= 15;

  // Solo kills (kills where you had no assisters)
  const soloKills = allEvents.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      e.KillerName === myName &&
      (e.Assisters ?? []).length === 0 &&
      !isTeammate(e.VictimName ?? '', allPlayers, myTeam)
  );
  score += Math.min(soloKills.length * 5, 15);

  // Avoided solo deaths: if you have few deaths relative to enemy solo kill attempts
  const soloDeathsOnYou = allEvents.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      e.VictimName === myName &&
      (e.Assisters ?? []).length === 0
  );
  if (soloDeathsOnYou.length === 0 && kills >= 3) score += 10;
  else if (soloDeathsOnYou.length <= 1) score += 5;

  // Penalize high deaths
  if (deaths >= 8) score -= 15;
  else if (deaths >= 6) score -= 10;
  else if (deaths >= 4) score -= 5;

  return clamp(Math.round(score), 0, 100);
}

function calcFarmingScore(
  _allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  gameTime: number,
  farmingStats: FarmingStats | null
): number {
  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const cs = farmingStats?.currentCS ?? myPlayer?.scores.creepScore ?? 0;
  const gameMinutes = Math.max(1, gameTime / 60);
  const csPerMin = farmingStats?.csPerMin ?? cs / gameMinutes;

  let score: number;

  // Benchmark against rank averages
  if (csPerMin >= 9) score = 95;
  else if (csPerMin >= 8) score = 85;
  else if (csPerMin >= 7) score = 70;
  else if (csPerMin >= 6) score = 55;
  else if (csPerMin >= 5) score = 40;
  else if (csPerMin >= 4) score = 25;
  else score = 15;

  // Efficiency bonus from farming stats
  if (farmingStats) {
    const efficiency = farmingStats.efficiency;
    if (efficiency >= 0.8) score += 5;
    else if (efficiency < 0.5) score -= 10;
  }

  return clamp(Math.round(score), 0, 100);
}

function calcVisionScore(
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  gameTime: number
): number {
  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const wardScore = myPlayer?.scores.wardScore ?? 0;
  const gameMinutes = Math.max(1, gameTime / 60);
  const wardPerMin = wardScore / gameMinutes;

  let score: number;

  if (wardPerMin >= 1.5) score = 95;
  else if (wardPerMin >= 1.2) score = 85;
  else if (wardPerMin >= 1.0) score = 70;
  else if (wardPerMin >= 0.7) score = 55;
  else if (wardPerMin >= 0.5) score = 40;
  else if (wardPerMin >= 0.3) score = 25;
  else score = 15;

  return clamp(Math.round(score), 0, 100);
}

function calcDecisionScore(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  deathHistory: DeathAnalysisResult[]
): number {
  const myName = activePlayer.summonerName;
  const myPlayer = allPlayers.find((p) => p.summonerName === myName);
  const myTeam = myPlayer?.team ?? 'ORDER';
  const scores = myPlayer?.scores;
  if (!scores) return 50;

  let score = 60;

  // Kill participation
  const teamKills = allPlayers
    .filter((p) => p.team === myTeam)
    .reduce((sum, p) => sum + p.scores.kills, 0);
  const kp =
    teamKills > 0
      ? (scores.kills + scores.assists) / teamKills
      : 0;

  if (kp >= 0.7) score += 20;
  else if (kp >= 0.5) score += 10;
  else if (kp < 0.3) score -= 15;

  // Deaths from bad positioning vs teamfight deaths
  const badPositionDeaths = deathHistory.filter(
    (d) =>
      d.reason === 'caught_rotating' ||
      d.reason === 'ganked_overextended' ||
      d.reason === 'ganked_no_vision' ||
      d.reason === 'dove_under_tower'
  );
  const teamfightDeaths = deathHistory.filter(
    (d) =>
      d.reason === 'teamfight_bad_positioning' ||
      d.reason === 'teamfight_focused'
  );

  // Penalize bad positioning deaths more heavily
  score -= badPositionDeaths.length * 6;
  // Teamfight deaths are less your fault
  score -= teamfightDeaths.length * 2;

  // Bonus for low total deaths
  if (scores.deaths <= 2) score += 10;
  else if (scores.deaths <= 4) score += 5;

  return clamp(Math.round(score), 0, 100);
}

// ── Mistake & Opportunity Detection ──

function findBiggestMistakes(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  deathHistory: DeathAnalysisResult[]
): MistakeReview[] {
  const myName = activePlayer.summonerName;
  const myDeathEvents = allEvents.filter(
    (e) => e.EventName === 'ChampionKill' && e.VictimName === myName
  );

  const mistakes: MistakeReview[] = [];

  for (const deathEvent of myDeathEvents) {
    const deathTime = deathEvent.EventTime;
    const deathAnalysis = deathHistory.find(
      (d) => Math.abs(d.gameTime - deathTime) < 5
    );

    const impactLevel = classifyDeathImpact(deathEvent, allEvents);
    const category = mapReasonToCategory(deathAnalysis?.reason);

    mistakes.push({
      timestamp: deathTime,
      description: deathAnalysis?.explanation ?? `Died at ${formatTime(deathTime)} to ${deathEvent.KillerName ?? 'unknown'}.`,
      whatToDo: deathAnalysis?.whatToDoNext ?? 'Review this death and identify what led to it.',
      category,
      impactLevel,
    });
  }

  // Sort by impact: game_changing > major > minor
  const impactOrder: Record<string, number> = {
    game_changing: 3,
    major: 2,
    minor: 1,
  };
  mistakes.sort((a, b) => impactOrder[b.impactLevel] - impactOrder[a.impactLevel]);

  return mistakes.slice(0, 3);
}

function classifyDeathImpact(
  deathEvent: GameEvent,
  allEvents: GameEvent[]
): 'minor' | 'major' | 'game_changing' {
  const deathTime = deathEvent.EventTime;
  const assisters = deathEvent.Assisters ?? [];

  // Death before objective spawn = game_changing
  for (const [obj, spawnTime] of Object.entries(OBJECTIVE_SPAWN_TIMES)) {
    if (deathTime >= spawnTime - 30 && deathTime <= spawnTime + 10) {
      return 'game_changing';
    }
  }

  // Death right before an enemy objective take
  const enemyObjectiveSoon = allEvents.find(
    (e) =>
      OBJECTIVE_NAMES.includes(e.EventName) &&
      e.EventTime > deathTime &&
      e.EventTime - deathTime < 45
  );
  if (enemyObjectiveSoon) {
    return 'game_changing';
  }

  // Solo death (no allies died nearby) = major
  if (assisters.length === 0) {
    return 'major';
  }

  // Death in teamfight context = minor
  return 'minor';
}

function findMissedOpportunities(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer
): Opportunity[] {
  const myName = activePlayer.summonerName;
  const myPlayer = allPlayers.find((p) => p.summonerName === myName);
  const myTeam = myPlayer?.team ?? 'ORDER';
  const opportunities: Opportunity[] = [];

  // Detect: enemy died but no objective taken after
  const enemyDeaths = allEvents.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      !isTeammate(e.VictimName ?? '', allPlayers, myTeam) &&
      e.VictimName !== myName
  );

  for (const death of enemyDeaths) {
    const deathTime = death.EventTime;
    // Check if we took an objective within 60 seconds of enemy dying
    const objectiveTakenAfter = allEvents.find(
      (e) =>
        OBJECTIVE_NAMES.includes(e.EventName) &&
        e.EventTime > deathTime &&
        e.EventTime - deathTime < 60 &&
        isTeammate(e.KillerName ?? '', allPlayers, myTeam)
    );
    const turretTakenAfter = allEvents.find(
      (e) =>
        e.EventName === 'TurretKilled' &&
        e.EventTime > deathTime &&
        e.EventTime - deathTime < 60
    );

    // Only flag if the death was of a meaningful enemy (not minor kills in big fights)
    // and the player participated in or was alive for the kill
    const playerParticipated =
      death.KillerName === myName || (death.Assisters ?? []).includes(myName);

    if (
      !objectiveTakenAfter &&
      !turretTakenAfter &&
      playerParticipated &&
      deathTime > 300 // only after 5 minutes
    ) {
      // Check if dragon or baron was available (rough estimate based on timers)
      const isDragonTime = deathTime >= OBJECTIVE_SPAWN_TIMES.dragon;
      const isBaronTime = deathTime >= OBJECTIVE_SPAWN_TIMES.baron;
      let potentialGain = 'Could have taken a tower or pushed an advantage';
      if (isBaronTime) potentialGain = 'Baron could have been an option, or push towers';
      else if (isDragonTime) potentialGain = 'Free dragon or tower was available';

      opportunities.push({
        timestamp: deathTime,
        description: `Got a kill on ${death.VictimName} at ${formatTime(deathTime)} but no objective followed.`,
        potentialGain,
      });
    }
  }

  // Detect: enemy laner missing but no response (approximate via kills on teammates)
  const allyDeathsFromRoams = allEvents.filter((e) => {
    if (e.EventName !== 'ChampionKill') return false;
    if (!isTeammate(e.VictimName ?? '', allPlayers, myTeam)) return false;
    if (e.VictimName === myName) return false;
    // If the killer is a laner (not jungler) and the victim is on a different lane area
    const killer = allPlayers.find((p) => p.summonerName === e.KillerName);
    if (!killer) return false;
    const killerIsJungler =
      killer.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase().includes('smite') ||
      killer.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase().includes('smite');
    return !killerIsJungler && e.EventTime > 180;
  });

  for (const allyDeath of allyDeathsFromRoams.slice(0, 3)) {
    const killerPlayer = allPlayers.find(
      (p) => p.summonerName === allyDeath.KillerName
    );
    if (killerPlayer) {
      opportunities.push({
        timestamp: allyDeath.EventTime,
        description: `${killerPlayer.championName} roamed and killed your teammate at ${formatTime(allyDeath.EventTime)}. You could have pinged or followed.`,
        potentialGain: 'Could have counter-roamed for a kill or saved your teammate',
      });
    }
  }

  // Sort by timestamp (most impactful = later in game often)
  opportunities.sort((a, b) => b.timestamp - a.timestamp);

  return opportunities.slice(0, 3);
}

function findBestPlays(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  gameTime: number,
  farmingStats: FarmingStats | null
): string[] {
  const myName = activePlayer.summonerName;
  const myPlayer = allPlayers.find((p) => p.summonerName === myName);
  const scores = myPlayer?.scores;
  const plays: string[] = [];

  if (!scores) return plays;

  // Kill streaks: find longest streak without dying
  const myKillEvents = allEvents
    .filter(
      (e) => e.EventName === 'ChampionKill' && e.KillerName === myName
    )
    .sort((a, b) => a.EventTime - b.EventTime);
  const myDeathEvents = allEvents
    .filter(
      (e) => e.EventName === 'ChampionKill' && e.VictimName === myName
    )
    .sort((a, b) => a.EventTime - b.EventTime);

  let bestStreak = 0;
  let currentStreak = 0;
  let deathIdx = 0;
  for (const kill of myKillEvents) {
    // Check if we died before this kill
    while (
      deathIdx < myDeathEvents.length &&
      myDeathEvents[deathIdx].EventTime < kill.EventTime
    ) {
      currentStreak = 0;
      deathIdx++;
    }
    currentStreak++;
    if (currentStreak > bestStreak) bestStreak = currentStreak;
  }
  if (bestStreak >= 3) {
    plays.push(
      `Went on a ${bestStreak}-kill streak without dying. Great aggression and survival.`
    );
  }

  // Good KDA
  const kda = (scores.kills + scores.assists) / Math.max(1, scores.deaths);
  if (kda >= 4) {
    plays.push(
      `Strong KDA of ${scores.kills}/${scores.deaths}/${scores.assists} (${kda.toFixed(1)}). You stayed alive while contributing to kills.`
    );
  }

  // High CS efficiency
  const gameMinutes = Math.max(1, gameTime / 60);
  const csPerMin =
    farmingStats?.csPerMin ?? scores.creepScore / gameMinutes;
  if (csPerMin >= 8) {
    plays.push(
      `Excellent farming at ${csPerMin.toFixed(1)} CS/min (${scores.creepScore} total). You didn't let fights distract you from farm.`
    );
  } else if (csPerMin >= 7) {
    plays.push(
      `Solid farming at ${csPerMin.toFixed(1)} CS/min (${scores.creepScore} total). Above average CS for the game.`
    );
  }

  // Low deaths
  if (scores.deaths <= 2 && gameMinutes >= 20) {
    plays.push(
      `Only ${scores.deaths} death(s) in a ${Math.round(gameMinutes)}-minute game. You played safely and picked your fights well.`
    );
  }

  // Multi-kills
  const multiKills = allEvents.filter(
    (e) => e.EventName === 'Multikill' && e.KillerName === myName
  );
  if (multiKills.length > 0) {
    plays.push(
      `Pulled off ${multiKills.length} multi-kill(s) during the game. Clutch teamfight performance.`
    );
  }

  // If we still have no plays, find something positive
  if (plays.length === 0) {
    if (scores.assists >= 10) {
      plays.push(
        `${scores.assists} assists shows great teamplay and participation in fights.`
      );
    }
    if (scores.wardScore >= gameMinutes * 0.8) {
      plays.push(
        `Ward score of ${scores.wardScore.toFixed(0)} shows solid vision control.`
      );
    }
    if (plays.length === 0) {
      plays.push(
        'Finished the game. Every game is a learning opportunity regardless of outcome.'
      );
    }
  }

  return plays.slice(0, 3);
}

// ── Improvement Plan ──

function buildImprovementPlan(
  scores: {
    macro: number;
    mechanics: number;
    farming: number;
    vision: number;
    decision: number;
  },
  deathHistory: DeathAnalysisResult[]
): { primaryFocus: string; improvementPlan: string[] } {
  // Find weakest area
  const areas: { name: string; score: number; focus: string; tips: string[] }[] = [
    {
      name: 'farming',
      score: scores.farming,
      focus: 'Your biggest weakness this game was CS. You missed too much gold from minions.',
      tips: [
        'Practice last-hitting in practice tool for 10 minutes before ranked.',
        'During laning, focus on getting every cannon minion - they are worth the most gold.',
        'After fights, always push the wave into tower before roaming so you don\'t lose CS.',
      ],
    },
    {
      name: 'vision',
      score: scores.vision,
      focus: 'Your biggest weakness this game was vision control. You played blind too often.',
      tips: [
        'Buy a control ward every time you recall. Place it in river or jungle.',
        'Swap to sweeper after first back if you are support, or after completing your ward quest.',
        'Ward 15 seconds before objectives spawn, not when the fight starts.',
      ],
    },
    {
      name: 'macro',
      score: scores.macro,
      focus: 'Your biggest weakness this game was macro play. You weren\'t in the right places.',
      tips: [
        'After getting a kill, immediately look at the map for a tower or objective to take.',
        'Don\'t waste time walking mid for no reason. Have a plan before you rotate.',
        'Track objective timers and be in position 30 seconds before they spawn.',
      ],
    },
    {
      name: 'mechanics',
      score: scores.mechanics,
      focus: 'Your biggest weakness this game was mechanics. You lost too many fights you should have won.',
      tips: [
        'Review your champion\'s combo in practice tool. Smooth combos win trades.',
        'Focus on dodging one key ability per fight. Sidestep before engaging.',
        'Don\'t use all your abilities at once. Hold your CC or escape for the right moment.',
      ],
    },
    {
      name: 'decision',
      score: scores.decision,
      focus: 'Your biggest weakness this game was decision-making. Some deaths were avoidable.',
      tips: [
        'Before fighting, count how many enemies are on the map. If you see fewer than 5, assume they are near you.',
        'Don\'t chase kills into unwarded areas. Take the safe gold on the map first.',
        'When behind, focus on farming and scaling. Don\'t force fights you can\'t win.',
      ],
    },
  ];

  // Also consider death patterns
  const gankDeaths = deathHistory.filter(
    (d) => d.reason === 'ganked_no_vision' || d.reason === 'ganked_overextended'
  );
  if (gankDeaths.length >= 2) {
    const visionArea = areas.find((a) => a.name === 'vision')!;
    visionArea.score -= 10; // Weight it more
  }

  const soloDeaths = deathHistory.filter((d) => d.reason.startsWith('solo_killed'));
  if (soloDeaths.length >= 3) {
    const mechArea = areas.find((a) => a.name === 'mechanics')!;
    mechArea.score -= 10;
  }

  areas.sort((a, b) => a.score - b.score);
  const weakest = areas[0];

  return {
    primaryFocus: weakest.focus,
    improvementPlan: weakest.tips,
  };
}

// ── Coach Summary ──

function buildCoachSummary(
  scores: {
    macro: number;
    mechanics: number;
    farming: number;
    vision: number;
    decision: number;
    overall: number;
  },
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  deathHistory: DeathAnalysisResult[]
): string {
  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const playerScores = myPlayer?.scores;
  if (!playerScores) return 'Not enough data to summarize this game.';

  // Find strongest area
  const scoreEntries = [
    { name: 'macro play', score: scores.macro },
    { name: 'mechanics', score: scores.mechanics },
    { name: 'farming', score: scores.farming },
    { name: 'vision control', score: scores.vision },
    { name: 'decision-making', score: scores.decision },
  ];
  scoreEntries.sort((a, b) => b.score - a.score);
  const strongest = scoreEntries[0];
  const weakest = scoreEntries[scoreEntries.length - 1];

  // KDA string
  const kda = `${playerScores.kills}/${playerScores.deaths}/${playerScores.assists}`;

  let summary = `You went ${kda} with a ${scores.overall}/100 overall score. `;
  summary += `Your strongest area was ${strongest.name} (${strongest.score}/100). `;

  if (weakest.score < 50) {
    summary += `Focus on improving your ${weakest.name} (${weakest.score}/100) next game.`;
  } else if (deathHistory.length >= 4) {
    summary += `You died ${deathHistory.length} times which held you back. Work on dying less.`;
  } else {
    summary += `Solid game overall. Keep pushing your ${weakest.name} to climb further.`;
  }

  return summary;
}

// ── Main Export ──

export function generatePostGameReview(
  allEvents: GameEvent[],
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  gameTime: number,
  farmingStats: FarmingStats | null,
  deathHistory: DeathAnalysisResult[]
): PostGameReview {
  // Calculate all scores
  const macroScore = calcMacroScore(allEvents, allPlayers, activePlayer, gameTime);
  const mechanicsScore = calcMechanicsScore(allEvents, allPlayers, activePlayer);
  const farmingScore = calcFarmingScore(allEvents, allPlayers, activePlayer, gameTime, farmingStats);
  const visionScore = calcVisionScore(allPlayers, activePlayer, gameTime);
  const decisionScore = calcDecisionScore(allEvents, allPlayers, activePlayer, deathHistory);

  const overallScore = Math.round(
    macroScore * 0.2 +
    mechanicsScore * 0.2 +
    farmingScore * 0.2 +
    visionScore * 0.15 +
    decisionScore * 0.25
  );

  const scoreSet = {
    macro: macroScore,
    mechanics: mechanicsScore,
    farming: farmingScore,
    vision: visionScore,
    decision: decisionScore,
    overall: overallScore,
  };

  // Detect key moments
  const biggestMistakes = findBiggestMistakes(allEvents, allPlayers, activePlayer, deathHistory);
  const missedOpportunities = findMissedOpportunities(allEvents, allPlayers, activePlayer);
  const bestPlays = findBestPlays(allEvents, allPlayers, activePlayer, gameTime, farmingStats);

  // Build improvement plan
  const { primaryFocus, improvementPlan } = buildImprovementPlan(scoreSet, deathHistory);

  // Coach summary
  const coachSummary = buildCoachSummary(scoreSet, allPlayers, activePlayer, deathHistory);

  return {
    macroScore,
    mechanicsScore,
    farmingScore,
    visionScore,
    decisionScore,
    overallScore,
    biggestMistakes,
    missedOpportunities,
    bestPlays,
    primaryFocus,
    improvementPlan,
    coachSummary,
  };
}

// ── Display Formatter ──

export function formatReviewForDisplay(review: PostGameReview): string {
  const lines: string[] = [];

  lines.push('========================================');
  lines.push('     POST-GAME COACHING REVIEW');
  lines.push('========================================');
  lines.push('');

  // Scores
  lines.push('--- SCORES ---');
  lines.push(`  Macro:       ${formatScoreBar(review.macroScore)}`);
  lines.push(`  Mechanics:   ${formatScoreBar(review.mechanicsScore)}`);
  lines.push(`  Farming:     ${formatScoreBar(review.farmingScore)}`);
  lines.push(`  Vision:      ${formatScoreBar(review.visionScore)}`);
  lines.push(`  Decisions:   ${formatScoreBar(review.decisionScore)}`);
  lines.push(`  OVERALL:     ${formatScoreBar(review.overallScore)}`);
  lines.push('');

  // Best plays
  lines.push('--- BEST PLAYS ---');
  for (let i = 0; i < review.bestPlays.length; i++) {
    lines.push(`  ${i + 1}. ${review.bestPlays[i]}`);
  }
  lines.push('');

  // Biggest mistakes
  if (review.biggestMistakes.length > 0) {
    lines.push('--- BIGGEST MISTAKES ---');
    for (let i = 0; i < review.biggestMistakes.length; i++) {
      const m = review.biggestMistakes[i];
      const impact = m.impactLevel.toUpperCase().replace('_', ' ');
      lines.push(`  ${i + 1}. [${impact}] ${m.description}`);
      lines.push(`     -> ${m.whatToDo}`);
    }
    lines.push('');
  }

  // Missed opportunities
  if (review.missedOpportunities.length > 0) {
    lines.push('--- MISSED OPPORTUNITIES ---');
    for (let i = 0; i < review.missedOpportunities.length; i++) {
      const o = review.missedOpportunities[i];
      lines.push(`  ${i + 1}. ${o.description}`);
      lines.push(`     -> ${o.potentialGain}`);
    }
    lines.push('');
  }

  // Improvement focus
  lines.push('--- WHAT TO WORK ON ---');
  lines.push(`  ${review.primaryFocus}`);
  lines.push('');
  for (let i = 0; i < review.improvementPlan.length; i++) {
    lines.push(`  ${i + 1}. ${review.improvementPlan[i]}`);
  }
  lines.push('');

  // Coach summary
  lines.push('--- COACH VERDICT ---');
  lines.push(`  ${review.coachSummary}`);
  lines.push('');
  lines.push('========================================');

  return lines.join('\n');
}

// ── Helpers ──

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isTeammate(
  name: string,
  allPlayers: PlayerInfo[],
  myTeam: string
): boolean {
  const player = allPlayers.find((p) => p.summonerName === name);
  return player?.team === myTeam;
}

function mapReasonToCategory(
  reason: string | undefined
): 'farming' | 'positioning' | 'vision' | 'macro' | 'trading' {
  if (!reason) return 'positioning';
  if (reason.includes('vision') || reason === 'ganked_no_vision') return 'vision';
  if (reason.includes('ganked') || reason === 'caught_rotating') return 'positioning';
  if (reason.includes('solo_killed')) return 'trading';
  if (reason.includes('teamfight')) return 'positioning';
  if (reason === 'dove_under_tower') return 'macro';
  return 'positioning';
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatScoreBar(score: number): string {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  const bar = '#'.repeat(filled) + '-'.repeat(empty);
  const grade = scoreToGrade(score);
  return `[${bar}] ${score}/100 (${grade})`;
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'S+';
  if (score >= 80) return 'S';
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
