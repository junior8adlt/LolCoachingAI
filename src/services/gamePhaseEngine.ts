import type { GameEvent, PlayerInfo } from '../types/game';

// ── Game Phase Engine ──
// Detects the current tactical phase beyond simple time-based early/mid/late.
// A Challenger coach adapts advice to WHAT'S HAPPENING, not what minute it is.

export type TacticalPhase =
  | 'laning'           // Both laners in lane farming
  | 'roaming'          // Player or enemy left lane
  | 'skirmish'         // 2-3 people fighting
  | 'teamfight'        // 4+ people involved
  | 'splitpush'        // Player alone in side lane, team elsewhere
  | 'objective_setup'  // Near dragon/baron spawn, positioning
  | 'post_fight'       // Just after a fight, cleanup phase
  | 'base_defense'     // Defending base/inhibs
  | 'siege';           // Team grouped pushing a tower

export interface PhaseInfo {
  phase: TacticalPhase;
  confidence: number;
  context: string;       // Human-readable context
  adviceStyle: 'aggressive' | 'defensive' | 'macro' | 'farming' | 'positioning';
}

interface PhaseState {
  recentKillTimes: number[];    // timestamps of recent kills
  lastPhase: TacticalPhase;
  lastPhaseChange: number;
  playerInLane: boolean;
  enemyInLane: boolean;
}

const state: PhaseState = {
  recentKillTimes: [],
  lastPhase: 'laning',
  lastPhaseChange: 0,
  playerInLane: true,
  enemyInLane: true,
};

export function detectPhase(
  gameTime: number,
  events: GameEvent[],
  myPlayer: PlayerInfo | undefined,
  laneEnemy: PlayerInfo | undefined,
  allPlayers: PlayerInfo[],
  objectives: Array<{ type: string; status: string; timer: number }>
): PhaseInfo {

  // Track recent kills (last 15 seconds)
  const recentEvents = events.filter(
    (e) => e.EventName === 'ChampionKill' && gameTime - e.EventTime < 15
  );
  const recentKillCount = recentEvents.length;

  // Count dead players
  const myTeam = myPlayer?.team;
  const alliesAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead).length;
  const enemiesAlive = allPlayers.filter((p) => p.team !== myTeam && !p.isDead).length;

  // Is enemy laner dead or missing?
  const enemyLanerDead = laneEnemy?.isDead ?? false;

  // ── Teamfight detection: 3+ kills in 15 seconds ──
  if (recentKillCount >= 3) {
    return {
      phase: 'teamfight',
      confidence: 0.9,
      context: `${recentKillCount} kills in the last 15s - teamfight happening`,
      adviceStyle: 'positioning',
    };
  }

  // ── Skirmish: 1-2 kills recently ──
  if (recentKillCount >= 1 && recentKillCount <= 2) {
    return {
      phase: 'skirmish',
      confidence: 0.7,
      context: 'Fight happening nearby',
      adviceStyle: 'aggressive',
    };
  }

  // ── Post-fight: multiple deaths but no recent kills ──
  const recentDeaths = allPlayers.filter((p) => p.isDead && p.respawnTimer > 10).length;
  if (recentDeaths >= 3 && recentKillCount === 0) {
    return {
      phase: 'post_fight',
      confidence: 0.7,
      context: `${recentDeaths} players dead - post-fight cleanup`,
      adviceStyle: 'macro',
    };
  }

  // ── Base defense: lots of allies dead, enemies pushing ──
  if (alliesAlive <= 2 && enemiesAlive >= 4 && gameTime > 900) {
    return {
      phase: 'base_defense',
      confidence: 0.65,
      context: 'Team disadvantage - defend carefully',
      adviceStyle: 'defensive',
    };
  }

  // ── Objective setup: dragon/baron spawning within 60s ──
  for (const obj of objectives) {
    if ((obj.type === 'dragon' || obj.type === 'baron') && obj.status === 'alive') {
      // Objective is up - if it's mid/late game, probably setting up
      if (gameTime > 300 && obj.type === 'dragon') {
        return {
          phase: 'objective_setup',
          confidence: 0.5,
          context: `${obj.type} is alive - set up vision and positioning`,
          adviceStyle: 'macro',
        };
      }
      if (gameTime > 1200 && obj.type === 'baron') {
        return {
          phase: 'objective_setup',
          confidence: 0.6,
          context: 'Baron is alive - play around it',
          adviceStyle: 'macro',
        };
      }
    }
    if (obj.status === 'dead' && obj.timer > 0 && obj.timer <= 60) {
      return {
        phase: 'objective_setup',
        confidence: 0.7,
        context: `${obj.type} spawns in ${obj.timer}s - set up now`,
        adviceStyle: 'macro',
      };
    }
  }

  // ── Laning phase: both laners present, early-mid game ──
  if (gameTime < 900 && !enemyLanerDead) {
    return {
      phase: 'laning',
      confidence: 0.8,
      context: 'Laning phase - focus on CS and trading',
      adviceStyle: 'farming',
    };
  }

  // ── Splitpush: late game, player position suggests side lane ──
  if (gameTime > 900 && myPlayer) {
    const pos = myPlayer.position?.toUpperCase();
    if ((pos === 'TOP' || pos === 'BOTTOM') && enemyLanerDead) {
      return {
        phase: 'splitpush',
        confidence: 0.5,
        context: 'Side lane open - push for pressure',
        adviceStyle: 'macro',
      };
    }
  }

  // ── Gank window: enemy jungler dead → safe to play aggressive ──
  const enemyJunglerDead = allPlayers.some(
    (p) => p.team !== myTeam && p.isDead &&
    (p.summonerSpells.summonerSpellOne.displayName.toLowerCase().includes('smite') ||
     p.summonerSpells.summonerSpellOne.displayName.toLowerCase().includes('castigo') ||
     p.summonerSpells.summonerSpellTwo.displayName.toLowerCase().includes('smite') ||
     p.summonerSpells.summonerSpellTwo.displayName.toLowerCase().includes('castigo'))
  );

  if (enemyJunglerDead && gameTime < 1200) {
    return {
      phase: 'laning',
      confidence: 0.75,
      context: 'Enemy jungler is dead - safe to play aggressive',
      adviceStyle: 'aggressive',
    };
  }

  // Default: general macro phase
  if (gameTime < 900) {
    return {
      phase: 'laning',
      confidence: 0.6,
      context: 'Laning phase',
      adviceStyle: 'farming',
    };
  }

  return {
    phase: 'siege',
    confidence: 0.4,
    context: 'Mid-late game - group or split based on comp',
    adviceStyle: 'macro',
  };
}

export function resetPhaseEngine(): void {
  state.recentKillTimes = [];
  state.lastPhase = 'laning';
  state.lastPhaseChange = 0;
}
