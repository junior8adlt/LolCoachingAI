import type { CoachingTip } from '../types/coaching';
import type { GameEvent, PlayerInfo } from '../types/game';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface DeathCause {
  time: number;
  type: 'solo_kill' | 'gank' | 'teamfight' | 'dive' | 'caught_out';
  killerChampion: string;
  assistCount: number;
}

export interface GameRecord {
  timestamp: number;
  champion: string;
  role: string;
  duration: number; // seconds
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMin: number;
  visionScore: number;
  win: boolean;
  deathCauses: DeathCause[];
  farmingEfficiency: number; // 0-100
  killParticipation: number; // 0-100
}

export type WeaknessType =
  | 'farming'
  | 'dying_to_ganks'
  | 'solo_deaths'
  | 'vision'
  | 'kill_participation'
  | 'overaggression'
  | 'passivity'
  | 'late_game_deaths'
  | 'early_game_deaths';

export interface PlayerWeakness {
  type: WeaknessType;
  severity: 'mild' | 'moderate' | 'severe';
  detail: string;
  gamesAnalyzed: number;
}

export interface PlayerStrength {
  type: string;
  detail: string;
  gamesAnalyzed: number;
}

export interface PlayerProfile {
  gamesPlayed: number;
  avgCSPerMin: number;
  avgDeaths: number;
  avgVisionScore: number;
  avgKillParticipation: number;
  mostPlayedChampions: { champion: string; games: number; winRate: number }[];
  weaknesses: PlayerWeakness[];
  strengths: PlayerStrength[];
  improvementTrend: 'improving' | 'stable' | 'declining';
  lastUpdated: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY_PROFILE = 'lolcoach_player_profile';
const STORAGE_KEY_HISTORY = 'lolcoach_game_history';
const MAX_GAME_RECORDS = 50;

// ─── Local Storage Helpers ───────────────────────────────────────────────────

function loadGameHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistGameHistory(history: GameRecord[]): void {
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
}

function loadCachedProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

function persistProfile(profile: PlayerProfile): void {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

// ─── Death Classification ────────────────────────────────────────────────────

/**
 * Classify a death event into a DeathCause based on game context.
 *
 * Heuristics:
 * - 0 assisters and no turret involvement  -> solo_kill
 * - 2+ assisters                           -> gank (multi-person collapse)
 * - 1 assister near turret name in event   -> dive
 * - 3+ assisters                           -> teamfight
 * - 1 assister, no turret                  -> caught_out
 */
export function classifyDeathCause(
  event: GameEvent,
  allPlayers: PlayerInfo[]
): DeathCause {
  const assistCount = event.Assisters?.length ?? 0;
  const killerName = event.KillerName ?? 'Unknown';
  const time = event.EventTime;

  // Resolve killer champion name from player list
  const killerPlayer = allPlayers.find(
    (p) => p.summonerName === killerName || p.championName === killerName
  );
  const killerChampion = killerPlayer?.championName ?? killerName;

  // Check if a turret was involved (turret names contain "Turret" or "T_")
  const isTurretInvolved =
    killerName.includes('Turret') ||
    killerName.includes('T_') ||
    (event.Assisters ?? []).some(
      (a) => a.includes('Turret') || a.includes('T_')
    );

  let type: DeathCause['type'];

  if (assistCount >= 3) {
    // 4+ people involved -> teamfight
    type = 'teamfight';
  } else if (isTurretInvolved && assistCount >= 1) {
    // Died under or near turret with enemy assistance -> dive
    type = 'dive';
  } else if (assistCount >= 2) {
    // 3 people involved (killer + 2 assists) -> gank
    type = 'gank';
  } else if (assistCount === 0) {
    // Pure 1v1 -> solo kill
    type = 'solo_kill';
  } else {
    // 1 assister, no turret -> caught out / roam
    type = 'caught_out';
  }

  return { time, type, killerChampion, assistCount };
}

// ─── Aggregate Stats ─────────────────────────────────────────────────────────

function computeAvg(records: GameRecord[], accessor: (r: GameRecord) => number): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + accessor(r), 0);
  return sum / records.length;
}

function computeMostPlayedChampions(
  records: GameRecord[]
): { champion: string; games: number; winRate: number }[] {
  const champMap = new Map<string, { games: number; wins: number }>();

  for (const r of records) {
    const entry = champMap.get(r.champion) ?? { games: 0, wins: 0 };
    entry.games++;
    if (r.win) entry.wins++;
    champMap.set(r.champion, entry);
  }

  return Array.from(champMap.entries())
    .map(([champion, { games, wins }]) => ({
      champion,
      games,
      winRate: games > 0 ? Math.round((wins / games) * 100) : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
}

// ─── Weakness Detection ─────────────────────────────────────────────────────

function detectWeaknesses(records: GameRecord[]): PlayerWeakness[] {
  if (records.length === 0) return [];

  const weaknesses: PlayerWeakness[] = [];
  const gamesAnalyzed = records.length;

  const avgCSPerMin = computeAvg(records, (r) => r.csPerMin);
  const avgDeaths = computeAvg(records, (r) => r.deaths);
  const avgKills = computeAvg(records, (r) => r.kills);
  const avgKP = computeAvg(records, (r) => r.killParticipation);

  // Compute average vision score per minute
  const avgVisionScorePerMin =
    records.length > 0
      ? records.reduce(
          (acc, r) => acc + (r.duration > 0 ? r.visionScore / (r.duration / 60) : 0),
          0
        ) / records.length
      : 0;

  // ── Farming ──
  if (avgCSPerMin < 6) {
    weaknesses.push({
      type: 'farming',
      severity: 'severe',
      detail: `Average CS/min is ${avgCSPerMin.toFixed(1)}, well below the 7.5 target.`,
      gamesAnalyzed,
    });
  } else if (avgCSPerMin < 7) {
    weaknesses.push({
      type: 'farming',
      severity: 'moderate',
      detail: `Average CS/min is ${avgCSPerMin.toFixed(1)}, below the 7.5 target.`,
      gamesAnalyzed,
    });
  } else if (avgCSPerMin < 7.5) {
    weaknesses.push({
      type: 'farming',
      severity: 'mild',
      detail: `Average CS/min is ${avgCSPerMin.toFixed(1)}, slightly below the 7.5 target.`,
      gamesAnalyzed,
    });
  }

  // ── Dying to ganks ──
  const allDeathCauses = records.flatMap((r) => r.deathCauses);
  const totalDeaths = allDeathCauses.length;
  if (totalDeaths > 0) {
    const gankDeaths = allDeathCauses.filter((d) => d.type === 'gank').length;
    const gankPct = (gankDeaths / totalDeaths) * 100;
    if (gankPct > 40) {
      weaknesses.push({
        type: 'dying_to_ganks',
        severity: 'severe',
        detail: `${gankPct.toFixed(0)}% of your deaths are from ganks (${gankDeaths}/${totalDeaths}).`,
        gamesAnalyzed,
      });
    } else if (gankPct > 25) {
      weaknesses.push({
        type: 'dying_to_ganks',
        severity: 'moderate',
        detail: `${gankPct.toFixed(0)}% of your deaths are from ganks.`,
        gamesAnalyzed,
      });
    }
  }

  // ── Solo deaths ──
  const soloDeathsPerGame =
    records.length > 0
      ? records.reduce(
          (acc, r) => acc + r.deathCauses.filter((d) => d.type === 'solo_kill').length,
          0
        ) / records.length
      : 0;
  if (soloDeathsPerGame > 3) {
    weaknesses.push({
      type: 'solo_deaths',
      severity: 'severe',
      detail: `Averaging ${soloDeathsPerGame.toFixed(1)} solo deaths per game.`,
      gamesAnalyzed,
    });
  } else if (soloDeathsPerGame > 2) {
    weaknesses.push({
      type: 'solo_deaths',
      severity: 'moderate',
      detail: `Averaging ${soloDeathsPerGame.toFixed(1)} solo deaths per game.`,
      gamesAnalyzed,
    });
  }

  // ── Vision ──
  if (avgVisionScorePerMin < 0.5) {
    weaknesses.push({
      type: 'vision',
      severity: 'severe',
      detail: `Vision score per minute is ${avgVisionScorePerMin.toFixed(2)}, far below the 0.8 target.`,
      gamesAnalyzed,
    });
  } else if (avgVisionScorePerMin < 0.8) {
    weaknesses.push({
      type: 'vision',
      severity: 'moderate',
      detail: `Vision score per minute is ${avgVisionScorePerMin.toFixed(2)}, below the 0.8 target.`,
      gamesAnalyzed,
    });
  }

  // ── Kill participation ──
  if (avgKP < 40) {
    weaknesses.push({
      type: 'kill_participation',
      severity: 'severe',
      detail: `Average kill participation is ${avgKP.toFixed(0)}%, well below 50%.`,
      gamesAnalyzed,
    });
  } else if (avgKP < 50) {
    weaknesses.push({
      type: 'kill_participation',
      severity: 'moderate',
      detail: `Average kill participation is ${avgKP.toFixed(0)}%, below 50%.`,
      gamesAnalyzed,
    });
  }

  // ── Overaggression ──
  if (avgDeaths > 6 && avgKills > 5) {
    weaknesses.push({
      type: 'overaggression',
      severity: avgDeaths > 8 ? 'severe' : 'moderate',
      detail: `Averaging ${avgKills.toFixed(1)} kills but ${avgDeaths.toFixed(1)} deaths. High risk playstyle.`,
      gamesAnalyzed,
    });
  }

  // ── Passivity ──
  if (avgKills < 3 && avgDeaths < 3 && avgKP < 40) {
    weaknesses.push({
      type: 'passivity',
      severity: avgKP < 30 ? 'severe' : 'moderate',
      detail: `Low kills (${avgKills.toFixed(1)}), low deaths (${avgDeaths.toFixed(1)}), low KP (${avgKP.toFixed(0)}%). Not impacting the game enough.`,
      gamesAnalyzed,
    });
  }

  // ── Late game deaths ──
  if (totalDeaths > 0) {
    const lateDeaths = allDeathCauses.filter((d) => d.time > 1200).length; // 20min
    const latePct = (lateDeaths / totalDeaths) * 100;
    if (latePct > 60) {
      weaknesses.push({
        type: 'late_game_deaths',
        severity: latePct > 75 ? 'severe' : 'moderate',
        detail: `${latePct.toFixed(0)}% of deaths occur after 20 minutes. Positioning may break down late.`,
        gamesAnalyzed,
      });
    }
  }

  // ── Early game deaths ──
  if (totalDeaths > 0) {
    const earlyDeaths = allDeathCauses.filter((d) => d.time < 600).length; // 10min
    const earlyPct = (earlyDeaths / totalDeaths) * 100;
    if (earlyPct > 50) {
      weaknesses.push({
        type: 'early_game_deaths',
        severity: earlyPct > 65 ? 'severe' : 'moderate',
        detail: `${earlyPct.toFixed(0)}% of deaths occur before 10 minutes. Laning phase is vulnerable.`,
        gamesAnalyzed,
      });
    }
  }

  return weaknesses;
}

// ─── Strength Detection ─────────────────────────────────────────────────────

function detectStrengths(records: GameRecord[]): PlayerStrength[] {
  if (records.length === 0) return [];

  const strengths: PlayerStrength[] = [];
  const gamesAnalyzed = records.length;

  const avgCSPerMin = computeAvg(records, (r) => r.csPerMin);
  const avgDeaths = computeAvg(records, (r) => r.deaths);
  const avgKP = computeAvg(records, (r) => r.killParticipation);
  const avgVisionScorePerMin =
    records.reduce(
      (acc, r) => acc + (r.duration > 0 ? r.visionScore / (r.duration / 60) : 0),
      0
    ) / records.length;

  if (avgCSPerMin >= 8) {
    strengths.push({
      type: 'farming',
      detail: `Excellent CS/min of ${avgCSPerMin.toFixed(1)}.`,
      gamesAnalyzed,
    });
  }

  if (avgDeaths < 3) {
    strengths.push({
      type: 'survival',
      detail: `Low average deaths (${avgDeaths.toFixed(1)}) shows strong positioning.`,
      gamesAnalyzed,
    });
  }

  if (avgKP >= 65) {
    strengths.push({
      type: 'teamplay',
      detail: `High kill participation (${avgKP.toFixed(0)}%) shows strong team coordination.`,
      gamesAnalyzed,
    });
  }

  if (avgVisionScorePerMin >= 1.0) {
    strengths.push({
      type: 'vision',
      detail: `Strong vision control with ${avgVisionScorePerMin.toFixed(2)} vision score/min.`,
      gamesAnalyzed,
    });
  }

  const winRate =
    records.length > 0
      ? (records.filter((r) => r.win).length / records.length) * 100
      : 0;
  if (winRate >= 60 && records.length >= 5) {
    strengths.push({
      type: 'winrate',
      detail: `Strong ${winRate.toFixed(0)}% win rate over ${records.length} games.`,
      gamesAnalyzed,
    });
  }

  return strengths;
}

// ─── Improvement Trend ───────────────────────────────────────────────────────

function computeImprovementTrend(
  records: GameRecord[]
): 'improving' | 'stable' | 'declining' {
  if (records.length < 10) return 'stable';

  // Sort by timestamp descending (newest first)
  const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
  const recent = sorted.slice(0, 5);
  const previous = sorted.slice(5, 10);

  const recentCSPM = computeAvg(recent, (r) => r.csPerMin);
  const prevCSPM = computeAvg(previous, (r) => r.csPerMin);

  const recentDeaths = computeAvg(recent, (r) => r.deaths);
  const prevDeaths = computeAvg(previous, (r) => r.deaths);

  const recentVision = computeAvg(recent, (r) => r.visionScore);
  const prevVision = computeAvg(previous, (r) => r.visionScore);

  // Positive = improving for CS and vision, negative = improving for deaths
  const csImproved = recentCSPM > prevCSPM + 0.3;
  const csDeclined = recentCSPM < prevCSPM - 0.3;

  const deathsImproved = recentDeaths < prevDeaths - 0.5;
  const deathsDeclined = recentDeaths > prevDeaths + 0.5;

  const visionImproved = recentVision > prevVision + 1;
  const visionDeclined = recentVision < prevVision - 1;

  const improvingCount = [csImproved, deathsImproved, visionImproved].filter(Boolean).length;
  const decliningCount = [csDeclined, deathsDeclined, visionDeclined].filter(Boolean).length;

  if (improvingCount >= 2) return 'improving';
  if (decliningCount >= 2) return 'declining';
  return 'stable';
}

// ─── Profile Builder ─────────────────────────────────────────────────────────

function buildProfile(records: GameRecord[]): PlayerProfile {
  const profile: PlayerProfile = {
    gamesPlayed: records.length,
    avgCSPerMin: Math.round(computeAvg(records, (r) => r.csPerMin) * 10) / 10,
    avgDeaths: Math.round(computeAvg(records, (r) => r.deaths) * 10) / 10,
    avgVisionScore: Math.round(computeAvg(records, (r) => r.visionScore) * 10) / 10,
    avgKillParticipation: Math.round(computeAvg(records, (r) => r.killParticipation)),
    mostPlayedChampions: computeMostPlayedChampions(records),
    weaknesses: detectWeaknesses(records),
    strengths: detectStrengths(records),
    improvementTrend: computeImprovementTrend(records),
    lastUpdated: Date.now(),
  };

  return profile;
}

// ─── Personalized Tips ───────────────────────────────────────────────────────

function generatePersonalizedTips(profile: PlayerProfile): string[] {
  const tips: string[] = [];

  for (const weakness of profile.weaknesses) {
    switch (weakness.type) {
      case 'farming':
        tips.push(
          `Practice last-hitting in practice tool. Your average is ${profile.avgCSPerMin} CS/min, target 7.5+. Focus on not missing cannon minions.`
        );
        break;

      case 'dying_to_ganks':
        tips.push(
          'You die to ganks often. Ward river at 2:30 and watch minimap every 5 seconds. Track the enemy jungler and play safe when they are on your side.'
        );
        break;

      case 'solo_deaths':
        tips.push(
          'You take too many 1v1 fights and lose. Only fight when you have a clear advantage (item spike, level up, summoner spell edge). Respect enemy cooldowns.'
        );
        break;

      case 'vision':
        tips.push(
          'Your vision score is low. Buy a control ward every back and swap to Farsight/Oracle after first recall. Vision wins games.'
        );
        break;

      case 'kill_participation':
        tips.push(
          `Your kill participation is ${profile.avgKillParticipation}%. Look at the minimap more and rotate to skirmishes. Use TP proactively if you have it.`
        );
        break;

      case 'overaggression':
        tips.push(
          'You tend to force fights and die. Play for objectives, not kills. A death costs more than a kill is worth. Focus on safe damage in teamfights.'
        );
        break;

      case 'passivity':
        tips.push(
          'You are not impacting the game enough. Look for trades in lane, roam when you push waves, and join skirmishes. Being alive but invisible is losing.'
        );
        break;

      case 'late_game_deaths':
        tips.push(
          'Most of your deaths happen late game. Stay with your team after 20 minutes, do not face-check unwarded areas, and position behind frontline in teamfights.'
        );
        break;

      case 'early_game_deaths':
        tips.push(
          'You die too much in early laning. Respect enemy level 2/3/6 power spikes, manage the wave near your tower, and do not overextend without ward coverage.'
        );
        break;
    }
  }

  // Add positive reinforcement for strengths
  for (const strength of profile.strengths) {
    tips.push(`Keep it up: ${strength.detail}`);
  }

  // Trend-based tips
  if (profile.improvementTrend === 'improving') {
    tips.push(
      'Your stats are trending upward over recent games. Keep focusing on the fundamentals that are working.'
    );
  } else if (profile.improvementTrend === 'declining') {
    tips.push(
      'Your performance has dipped recently. Consider taking a short break, reviewing replays, or focusing on one improvement area at a time.'
    );
  }

  return tips;
}

// ─── In-game Contextual Tips ─────────────────────────────────────────────────

export function getProfileBasedTip(
  profile: PlayerProfile,
  gameTime: number,
  currentStats: { cs: number; deaths: number; visionScore: number }
): CoachingTip | null {
  const weaknessTypes = new Set(profile.weaknesses.map((w) => w.type));
  const gameMinutes = gameTime / 60;

  // Farming check: if weakness is farming and current CS is below expected
  if (weaknessTypes.has('farming') && gameMinutes >= 5) {
    const expectedCS = gameMinutes * 7; // target 7 cs/min as a minimum
    const currentCSPerMin = gameMinutes > 0 ? currentStats.cs / gameMinutes : 0;
    if (currentCSPerMin < 5.5) {
      return {
        id: `profile-farming-${Math.floor(gameTime / 120)}`,
        message: `Your CS is ${currentStats.cs} at ${gameMinutes.toFixed(0)} min (${currentCSPerMin.toFixed(1)}/min). Target: ${Math.round(expectedCS)}. Focus on last-hitting.`,
        priority: currentCSPerMin < 4 ? 'danger' : 'warning',
        category: 'farming',
        timestamp: gameTime,
        dismissed: false,
      };
    }
  }

  // Gank awareness: if weakness is ganks and early-mid game without vision
  if (weaknessTypes.has('dying_to_ganks') && gameTime >= 180) {
    const visionPerMin = gameMinutes > 0 ? currentStats.visionScore / gameMinutes : 0;
    if (visionPerMin < 0.4) {
      return {
        id: `profile-gank-ward-${Math.floor(gameTime / 180)}`,
        message:
          'You tend to die to ganks. Your vision is low right now. Place a ward in river or pixel brush immediately.',
        priority: 'warning',
        category: 'vision',
        timestamp: gameTime,
        dismissed: false,
      };
    }
  }

  // Late game death tendency: warn at 25min+
  if (weaknessTypes.has('late_game_deaths') && gameTime >= 1500) {
    // Fire at 25, 30, 35 minutes etc.
    const fiveMinBlock = Math.floor(gameTime / 300);
    if (gameTime % 300 < 30) {
      return {
        id: `profile-lategame-${fiveMinBlock}`,
        message:
          'Late game approaching. You tend to die more at this stage. Stick with your team, avoid face-checking, and play for picks not fights.',
        priority: 'warning',
        category: 'positioning',
        timestamp: gameTime,
        dismissed: false,
      };
    }
  }

  // Early game death tendency
  if (weaknessTypes.has('early_game_deaths') && gameTime >= 120 && gameTime < 600) {
    if (currentStats.deaths > 0) {
      return {
        id: `profile-earlydeath-${currentStats.deaths}`,
        message: `You already have ${currentStats.deaths} death(s) in early game. Play safe, farm under tower, and wait for jungle help.`,
        priority: currentStats.deaths >= 2 ? 'danger' : 'warning',
        category: 'positioning',
        timestamp: gameTime,
        dismissed: false,
      };
    }
  }

  // Overaggression check
  if (weaknessTypes.has('overaggression') && currentStats.deaths >= 4) {
    return {
      id: `profile-overagg-${currentStats.deaths}`,
      message: `${currentStats.deaths} deaths so far. Your profile shows a pattern of overaggression. Play for objectives and safe farm.`,
      priority: 'danger',
      category: 'general',
      timestamp: gameTime,
      dismissed: false,
    };
  }

  // Vision check for players weak at vision
  if (weaknessTypes.has('vision') && gameMinutes >= 10) {
    const visionPerMin = currentStats.visionScore / gameMinutes;
    if (visionPerMin < 0.5) {
      return {
        id: `profile-vision-${Math.floor(gameTime / 300)}`,
        message: `Your vision score is ${currentStats.visionScore} at ${gameMinutes.toFixed(0)} min. Buy a control ward and place deeper wards.`,
        priority: 'warning',
        category: 'vision',
        timestamp: gameTime,
        dismissed: false,
      };
    }
  }

  return null;
}

// ─── Exported API ────────────────────────────────────────────────────────────

/**
 * Save a game record to persistent history and rebuild the player profile.
 * Keeps a maximum of MAX_GAME_RECORDS entries (oldest pruned first).
 */
export function saveGameRecord(record: GameRecord): void {
  const history = loadGameHistory();
  history.push(record);

  // Sort newest first for pruning
  history.sort((a, b) => b.timestamp - a.timestamp);

  // Keep only the most recent records
  const trimmed = history.slice(0, MAX_GAME_RECORDS);
  persistGameHistory(trimmed);

  // Rebuild and cache the profile
  const profile = buildProfile(trimmed);
  persistProfile(profile);
}

/**
 * Get the current player profile. Returns cached version if available,
 * otherwise rebuilds from game history.
 */
export function getPlayerProfile(): PlayerProfile {
  const cached = loadCachedProfile();
  const history = loadGameHistory();

  // Return cached if it exists and game count matches
  if (cached && cached.gamesPlayed === history.length && history.length > 0) {
    return cached;
  }

  // Rebuild from history
  const profile = buildProfile(history);
  if (history.length > 0) {
    persistProfile(profile);
  }
  return profile;
}

/**
 * Generate personalized coaching tips based on the player's profile.
 */
export function getPersonalizedTips(): string[] {
  const profile = getPlayerProfile();
  return generatePersonalizedTips(profile);
}

/**
 * Clear all stored player data and start fresh.
 */
export function resetProfile(): void {
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
}
