import type { GameEvent, PlayerInfo, ActivePlayer } from '../types/game';
import type { CoachingTip, JunglePrediction } from '../types/coaching';

// ── Death Analysis System ──
// When the player dies, provides deep contextual analysis of WHY they died
// and what they should have done differently. Like a coach doing VOD review in real-time.

export type DeathReason =
  | 'ganked_no_vision'
  | 'ganked_overextended'
  | 'solo_killed_bad_trade'
  | 'solo_killed_level_disadvantage'
  | 'solo_killed_item_disadvantage'
  | 'dove_under_tower'
  | 'caught_rotating'
  | 'teamfight_bad_positioning'
  | 'teamfight_focused'
  | 'executed'
  | 'unknown';

export interface DeathAnalysisResult {
  reason: DeathReason;
  explanation: string;
  whatToDoNext: string;
  killerChampion: string;
  assistCount: number;
  gameTime: number;
  wasOverextended: boolean;
  hadVisionDeficit: boolean;
  wasLevelDown: boolean;
}

interface DeathContext {
  healthBeforeFight: number;  // estimated
  manaBeforeFight: number;
  playerLevel: number;
  killerLevel: number;
  wasUnderEnemyTower: boolean;
  recentAllyDeathsNearby: number;
  enemyJunglerInvolved: boolean;
  numberOfEnemies: number;
  wardScore: number;
  gameTime: number;
  gameMinutes: number;
}

let tipCounter = 0;

function createTip(
  message: string,
  priority: 'info' | 'warning' | 'danger'
): CoachingTip {
  tipCounter++;
  return {
    id: `death-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category: 'positioning',
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ── Main Analysis Function ──

export function analyzePlayerDeath(
  deathEvent: GameEvent,
  allPlayers: PlayerInfo[],
  activePlayer: ActivePlayer,
  allEvents: GameEvent[],
  _junglePrediction: JunglePrediction | null,
  _gameTime: number
): { analysis: DeathAnalysisResult; tip: CoachingTip } {
  const killerName = deathEvent.KillerName ?? 'Unknown';
  const assisters = deathEvent.Assisters ?? [];
  const assistCount = assisters.length;
  const deathTime = deathEvent.EventTime;

  const myPlayer = allPlayers.find(
    (p) => p.summonerName === activePlayer.summonerName
  );
  const killer = allPlayers.find((p) => p.summonerName === killerName);
  const myTeam = myPlayer?.team;

  // Build context
  const context: DeathContext = {
    healthBeforeFight: activePlayer.championStats.currentHealth / activePlayer.championStats.maxHealth,
    manaBeforeFight: activePlayer.championStats.resourceMax > 0
      ? activePlayer.championStats.resourceValue / activePlayer.championStats.resourceMax
      : 1,
    playerLevel: activePlayer.level,
    killerLevel: killer?.level ?? activePlayer.level,
    wasUnderEnemyTower: false, // inferred below
    recentAllyDeathsNearby: 0,
    enemyJunglerInvolved: false,
    numberOfEnemies: 1 + assistCount,
    wardScore: myPlayer?.scores.wardScore ?? 0,
    gameTime: deathTime,
    gameMinutes: deathTime / 60,
  };

  // Check if enemy jungler was involved
  const enemyJungler = allPlayers.find(
    (p) => p.team !== myTeam && hasSmite(p)
  );
  if (enemyJungler) {
    context.enemyJunglerInvolved =
      killerName === enemyJungler.summonerName ||
      assisters.includes(enemyJungler.summonerName);
  }

  // Check for tower dive (turret kill event near death time)
  const recentTowerEvents = allEvents.filter(
    (e) => e.EventName === 'TurretKilled' &&
      Math.abs(e.EventTime - deathTime) < 15
  );
  if (recentTowerEvents.length > 0) {
    context.wasUnderEnemyTower = true;
  }

  // Count ally deaths nearby (within 10 seconds = teamfight)
  context.recentAllyDeathsNearby = allEvents.filter(
    (e) =>
      e.EventName === 'ChampionKill' &&
      e.VictimName !== activePlayer.summonerName &&
      isAlly(e.VictimName ?? '', allPlayers, myTeam ?? 'ORDER') &&
      Math.abs(e.EventTime - deathTime) < 10
  ).length;

  // ── Determine death reason ──
  const reason = classifyDeath(context, killer, myPlayer);

  // ── Generate explanation and advice ──
  const { explanation, whatToDoNext } = generateDeathCoaching(reason, context, killerName, killer);

  const wasOverextended = reason === 'ganked_overextended' || reason === 'caught_rotating';
  const hadVisionDeficit = reason === 'ganked_no_vision' ||
    (context.enemyJunglerInvolved && context.wardScore / Math.max(1, context.gameMinutes) < 0.5);
  const wasLevelDown = context.killerLevel > context.playerLevel;

  const analysis: DeathAnalysisResult = {
    reason,
    explanation,
    whatToDoNext,
    killerChampion: killer?.championName ?? killerName,
    assistCount,
    gameTime: deathTime,
    wasOverextended,
    hadVisionDeficit,
    wasLevelDown,
  };

  const tip = createTip(
    `${explanation} ${whatToDoNext}`,
    reason.includes('teamfight') ? 'info' : 'warning'
  );

  return { analysis, tip };
}

function classifyDeath(
  ctx: DeathContext,
  killer: PlayerInfo | undefined,
  myPlayer: PlayerInfo | undefined
): DeathReason {
  // Executed (no killer or killed by turret/minion)
  if (!killer || ctx.numberOfEnemies === 0) {
    return 'executed';
  }

  // Teamfight (multiple allies died nearby)
  if (ctx.recentAllyDeathsNearby >= 2) {
    if (ctx.numberOfEnemies >= 3) {
      return 'teamfight_focused';
    }
    return 'teamfight_bad_positioning';
  }

  // Ganked (2+ enemies, jungler involved)
  if (ctx.numberOfEnemies >= 2) {
    if (ctx.enemyJunglerInvolved) {
      if (ctx.wardScore / Math.max(1, ctx.gameMinutes) < 0.5) {
        return 'ganked_no_vision';
      }
      return 'ganked_overextended';
    }
    // Multiple enemies but not jungler = roam or collapse
    return 'caught_rotating';
  }

  // Solo kill
  if (ctx.numberOfEnemies === 1) {
    // Dove under tower
    if (ctx.wasUnderEnemyTower) {
      return 'dove_under_tower';
    }

    // Level disadvantage
    if (ctx.killerLevel >= ctx.playerLevel + 2) {
      return 'solo_killed_level_disadvantage';
    }

    // Item disadvantage (rough estimate from kills/CS)
    const killerGoldEstimate = (killer?.scores.kills ?? 0) * 300 +
      (killer?.scores.assists ?? 0) * 150 +
      (killer?.scores.creepScore ?? 0) * 20;
    const myGoldEstimate = (myPlayer?.scores.kills ?? 0) * 300 +
      (myPlayer?.scores.assists ?? 0) * 150 +
      (myPlayer?.scores.creepScore ?? 0) * 20;

    if (killerGoldEstimate > myGoldEstimate * 1.3) {
      return 'solo_killed_item_disadvantage';
    }

    return 'solo_killed_bad_trade';
  }

  return 'unknown';
}

function generateDeathCoaching(
  reason: DeathReason,
  ctx: DeathContext,
  killerName: string,
  killer: PlayerInfo | undefined
): { explanation: string; whatToDoNext: string } {
  const champion = killer?.championName ?? killerName;
  const timeStr = formatTime(ctx.gameTime);

  switch (reason) {
    case 'ganked_no_vision':
      return {
        explanation: `Ganked at ${timeStr} with no vision. Your ward score is low.`,
        whatToDoNext: 'Ward river at 2:30 and before pushing. Watch minimap every 5 seconds.',
      };

    case 'ganked_overextended':
      return {
        explanation: `Ganked at ${timeStr} while overextended. You were too far up.`,
        whatToDoNext: 'Don\'t push past river without knowing where the jungler is. Freeze near your tower.',
      };

    case 'solo_killed_bad_trade':
      return {
        explanation: `Solo killed by ${champion} at ${timeStr}. The trade went wrong.`,
        whatToDoNext: `Study the ${champion} matchup. Avoid fighting when their abilities are up. Trade around cooldowns.`,
      };

    case 'solo_killed_level_disadvantage':
      return {
        explanation: `Solo killed by ${champion} at ${timeStr}. They were level ${ctx.killerLevel} vs your ${ctx.playerLevel}.`,
        whatToDoNext: 'Don\'t fight when down in levels. Farm safely until you catch up in XP.',
      };

    case 'solo_killed_item_disadvantage':
      return {
        explanation: `Solo killed by ${champion} at ${timeStr}. They had an item advantage.`,
        whatToDoNext: 'Check enemy items before fighting. If they completed an item and you haven\'t, play safe.',
      };

    case 'dove_under_tower':
      return {
        explanation: `Died diving tower at ${timeStr}. The dive was too risky.`,
        whatToDoNext: 'Only dive when you\'re sure you can kill AND survive. Have a plan to drop tower aggro.',
      };

    case 'caught_rotating':
      return {
        explanation: `Caught out while rotating at ${timeStr}. Multiple enemies collapsed.`,
        whatToDoNext: 'Use safe paths when rotating. Don\'t face-check unwarded areas. Travel with teammates mid-game.',
      };

    case 'teamfight_bad_positioning':
      return {
        explanation: `Died in teamfight at ${timeStr}. Positioning could be better.`,
        whatToDoNext: 'Stay behind your frontline. Don\'t walk into enemy abilities. Wait for enemies to use key CDs.',
      };

    case 'teamfight_focused':
      return {
        explanation: `Focused down in teamfight at ${timeStr} by ${ctx.numberOfEnemies} enemies.`,
        whatToDoNext: 'Position further back. Use flash or mobility to dodge key abilities. Wait for engage before committing.',
      };

    case 'executed':
      return {
        explanation: `Executed at ${timeStr}.`,
        whatToDoNext: 'Recall when low instead of risking an execute.',
      };

    default:
      return {
        explanation: `Died at ${timeStr} to ${champion}.`,
        whatToDoNext: 'Analyze what went wrong and avoid the same situation.',
      };
  }
}

// ── Pattern Detection ──

export function detectDeathPatterns(
  deaths: DeathAnalysisResult[],
  _gameTime: number
): CoachingTip | null {
  if (deaths.length < 2) return null;

  // Multiple gank deaths
  const gankDeaths = deaths.filter(
    (d) => d.reason === 'ganked_no_vision' || d.reason === 'ganked_overextended'
  );
  if (gankDeaths.length >= 2) {
    return createTip(
      `You've died to ${gankDeaths.length} ganks this game. Buy control wards and don't push without vision.`,
      'danger'
    );
  }

  // Multiple solo deaths
  const soloDeaths = deaths.filter(
    (d) => d.reason.startsWith('solo_killed')
  );
  if (soloDeaths.length >= 3) {
    const mainKiller = soloDeaths[soloDeaths.length - 1].killerChampion;
    return createTip(
      `${soloDeaths.length} solo deaths. Stop taking fights against ${mainKiller}. Farm and wait for your power spike.`,
      'danger'
    );
  }

  // Dying too much early
  const earlyDeaths = deaths.filter((d) => d.gameTime < 600);
  if (earlyDeaths.length >= 3) {
    return createTip(
      `${earlyDeaths.length} deaths before 10 minutes. Play more passive early and focus on CS.`,
      'warning'
    );
  }

  return null;
}

// ── Helpers ──

function hasSmite(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return s1.includes('smite') || s2.includes('smite') ||
         s1.includes('castigo') || s2.includes('castigo');
}

function isAlly(name: string, allPlayers: PlayerInfo[], myTeam: string): boolean {
  const player = allPlayers.find((p) => p.summonerName === name);
  return player?.team === myTeam;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
