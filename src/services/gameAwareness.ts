import type { GameEvent, PlayerInfo } from '../types/game';
import type { CoachingTip, ObjectiveInfo, JunglePrediction } from '../types/coaching';

// ── Game Awareness Model ──
// Detects high-level game situations that a Challenger coach would instantly recognize:
// - Fight about to happen (convergence of players)
// - Gank window (jungler dead/visible elsewhere)
// - Objective rotation timing
// - Teamfight state (who wins the next 5v5)

let tipCounter = 0;
const recentAwarenessTips = new Map<string, number>();

function createTip(
  message: string,
  priority: 'info' | 'warning' | 'danger',
  category: 'macro' | 'positioning' | 'objective' | 'trading' = 'macro'
): CoachingTip | null {
  const hash = message.slice(0, 35).toLowerCase();
  const now = Date.now();
  if (recentAwarenessTips.has(hash) && now - (recentAwarenessTips.get(hash) ?? 0) < 45000) return null;
  recentAwarenessTips.set(hash, now);
  if (recentAwarenessTips.size > 30) {
    for (const [k, t] of recentAwarenessTips) {
      if (now - t > 90000) recentAwarenessTips.delete(k);
    }
  }
  tipCounter++;
  return {
    id: `aware-${now}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: now,
    dismissed: false,
  };
}

// ── Helpers ──

function hasSmite(p: PlayerInfo): boolean {
  const s1 = p.summonerSpells.summonerSpellOne.displayName.toLowerCase();
  const s2 = p.summonerSpells.summonerSpellTwo.displayName.toLowerCase();
  return s1.includes('smite') || s2.includes('smite') || s1.includes('castigo') || s2.includes('castigo');
}

function getEnemyJungler(allPlayers: PlayerInfo[], myTeam: string): PlayerInfo | null {
  return allPlayers.find((p) => p.team !== myTeam && hasSmite(p)) ?? null;
}

function getMyJungler(allPlayers: PlayerInfo[], myTeam: string): PlayerInfo | null {
  return allPlayers.find((p) => p.team === myTeam && hasSmite(p)) ?? null;
}

// ── 1. Fight About to Happen ──
// Detected by: multiple recent kills in short window, or objective up + teams alive

function detectFightBrewing(
  events: GameEvent[],
  gameTime: number,
  allPlayers: PlayerInfo[],
  myTeam: string,
  objectives: ObjectiveInfo[]
): CoachingTip | null {
  // Recent kills (last 20s) suggest escalation
  const recentKills = events.filter(
    (e) => e.EventName === 'ChampionKill' && gameTime - e.EventTime < 20
  ).length;

  if (recentKills >= 1 && recentKills <= 2) {
    const alliesAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead).length;
    const enemiesAlive = allPlayers.filter((p) => p.team !== myTeam && !p.isDead).length;

    if (alliesAlive >= 4 && enemiesAlive >= 4) {
      return createTip(
        `Skirmish escalating into teamfight. ${alliesAlive}v${enemiesAlive}. Position carefully and focus priority targets.`,
        'warning', 'positioning'
      );
    }
  }

  // Objective alive + both teams full → fight is likely
  const majorObjective = objectives.find(
    (o) => (o.type === 'dragon' || o.type === 'baron') && o.status === 'alive'
  );
  if (majorObjective && gameTime > 300) {
    const alliesAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead).length;
    const enemiesAlive = allPlayers.filter((p) => p.team !== myTeam && !p.isDead).length;

    if (alliesAlive >= 4 && enemiesAlive >= 4 && gameTime > 600) {
      const objName = majorObjective.type.charAt(0).toUpperCase() + majorObjective.type.slice(1);
      return createTip(
        `${objName} is up. ${alliesAlive}v${enemiesAlive}. Group with your team for the contest. Don't get caught alone.`,
        'warning', 'positioning'
      );
    }
  }

  // Objective spawning in <30s + teams alive → group call
  const spawningObj = objectives.find(
    (o) => o.status === 'dead' && o.timer > 0 && o.timer <= 30 && (o.type === 'dragon' || o.type === 'baron')
  );
  if (spawningObj && gameTime > 300) {
    const alliesAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead).length;
    if (alliesAlive >= 3) {
      const objName = spawningObj.type.charAt(0).toUpperCase() + spawningObj.type.slice(1);
      const side = spawningObj.type === 'dragon' ? 'bot' : 'top';
      return createTip(
        `${objName} in ${Math.ceil(spawningObj.timer)}s. Group ${side} side NOW. Fight is coming.`,
        'danger', 'objective'
      );
    }
  }

  return null;
}

// ── 2. Gank Window ──
// When enemy jungler is dead, visible on other side, or accounted for

function detectGankWindow(
  allPlayers: PlayerInfo[],
  myTeam: string,
  myPlayer: PlayerInfo | undefined,
  junglePrediction: JunglePrediction | null,
  gameTime: number
): CoachingTip | null {
  if (!myPlayer || gameTime < 150) return null;

  const enemyJungler = getEnemyJungler(allPlayers, myTeam);
  if (!enemyJungler) return null;

  const myPos = myPlayer.position?.toUpperCase();
  const mySide = myPos === 'TOP' ? 'top' : (myPos === 'BOTTOM' || myPos === 'UTILITY') ? 'bot' : 'mid';

  // Enemy jungler is DEAD → aggressive window
  if (enemyJungler.isDead) {
    const timer = Math.ceil(enemyJungler.respawnTimer);
    if (timer > 10) {
      return createTip(
        `Enemy ${enemyJungler.championName} dead for ${timer}s. No gank possible. Play aggressive.`,
        'warning', 'trading'
      );
    }
  }

  // Enemy jungler confirmed on OTHER side of map
  if (junglePrediction && junglePrediction.confidence > 0.5) {
    const jgSide = junglePrediction.predictedSide;
    const isOtherSide =
      (mySide === 'top' && jgSide === 'bot') ||
      (mySide === 'bot' && jgSide === 'top');

    if (isOtherSide) {
      return createTip(
        `${enemyJungler.championName} spotted ${jgSide} side. You're safe to push and trade for ~30s.`,
        'info', 'trading'
      );
    }
  }

  // Our jungler is nearby (same side) → potential gank FOR us
  const myJungler = getMyJungler(allPlayers, myTeam);
  if (myJungler && !myJungler.isDead && junglePrediction) {
    // If our jungler is on our side, mention it
    // Ally jungler alive + enemy jungler elsewhere = potential gank for us
    // Let other systems handle the specific tip
  }

  return null;
}

// ── 3. Objective Rotation ──
// Smart rotation calls based on game state

function detectObjectiveRotation(
  gameTime: number,
  objectives: ObjectiveInfo[],
  allPlayers: PlayerInfo[],
  myPlayer: PlayerInfo | undefined,
  myTeam: string
): CoachingTip | null {
  if (!myPlayer || gameTime < 240) return null;

  const myPos = myPlayer.position?.toUpperCase();
  const enemiesDead = allPlayers.filter((p) => p.team !== myTeam && p.isDead);

  // ── After winning a fight → push for objective ──
  if (enemiesDead.length >= 2) {
    // Find the best objective to take
    const dragon = objectives.find((o) => o.type === 'dragon' && o.status === 'alive');
    const baron = objectives.find((o) => o.type === 'baron' && o.status === 'alive');
    const herald = objectives.find((o) => o.type === 'herald' && o.status === 'alive');

    if (baron && gameTime >= 1200 && enemiesDead.length >= 3) {
      return createTip(
        `${enemiesDead.length} enemies dead. Rotate to Baron NOW. This wins the game.`,
        'danger', 'objective'
      );
    }

    if (dragon && gameTime >= 300) {
      return createTip(
        `${enemiesDead.length} enemies dead. Rotate to Dragon. Free objective.`,
        'warning', 'objective'
      );
    }

    if (herald && gameTime >= 840 && gameTime < 1200) {
      return createTip(
        `${enemiesDead.length} enemies dead. Take Rift Herald for tower pressure.`,
        'warning', 'objective'
      );
    }
  }

  // ── Pre-objective: push wave first ──
  for (const obj of objectives) {
    if (obj.status === 'dead' && obj.timer > 0 && obj.timer <= 45 && obj.timer > 30) {
      const side = obj.type === 'dragon' ? 'bot' : 'top';
      const shouldRotate = (myPos === 'TOP' && side === 'bot') || (myPos === 'BOTTOM' && side === 'top');

      if (shouldRotate) {
        return createTip(
          `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} in ${Math.ceil(obj.timer)}s. Push your wave and start rotating ${side}.`,
          'warning', 'macro'
        );
      }
    }
  }

  return null;
}

// ── 4. Teamfight State Assessment ──
// Who wins the next 5v5? Based on levels, items, deaths

function assessTeamfightState(
  allPlayers: PlayerInfo[],
  myTeam: string,
  gameTime: number
): CoachingTip | null {
  if (gameTime < 900) return null; // Too early for 5v5 analysis

  const allies = allPlayers.filter((p) => p.team === myTeam);
  const enemies = allPlayers.filter((p) => p.team !== myTeam);

  // Total team gold estimates
  const allyGold = allies.reduce((sum, p) =>
    sum + p.scores.kills * 300 + p.scores.assists * 150 + p.scores.creepScore * 21, 0);
  const enemyGold = enemies.reduce((sum, p) =>
    sum + p.scores.kills * 300 + p.scores.assists * 150 + p.scores.creepScore * 21, 0);
  const goldDiff = allyGold - enemyGold;

  // Dead count right now
  const alliesAlive = allies.filter((p) => !p.isDead).length;
  const enemiesAlive = enemies.filter((p) => !p.isDead).length;

  // Number advantage → fight
  if (alliesAlive > enemiesAlive + 1 && alliesAlive >= 4) {
    return createTip(
      `${alliesAlive}v${enemiesAlive} numbers advantage! Force a fight or take an objective now.`,
      'danger', 'macro'
    );
  }

  // Number disadvantage → don't fight
  if (enemiesAlive > alliesAlive + 1 && enemiesAlive >= 4) {
    return createTip(
      `${alliesAlive}v${enemiesAlive} - you're outnumbered. Don't force fights. Stall and wait for respawns.`,
      'warning', 'positioning'
    );
  }

  // Big gold lead → force fights
  if (goldDiff > 5000 && alliesAlive >= 4) {
    return createTip(
      `Your team has ~${Math.round(goldDiff / 1000)}k gold lead. Force fights and objectives. You win 5v5.`,
      'info', 'macro'
    );
  }

  // Big gold deficit → avoid fights
  if (goldDiff < -5000 && enemiesAlive >= 4) {
    return createTip(
      `Your team is ~${Math.round(Math.abs(goldDiff) / 1000)}k gold behind. Avoid 5v5 fights. Look for picks or split push.`,
      'warning', 'macro'
    );
  }

  return null;
}

// ── Main Export ──

export function getGameAwarenessTips(
  gameTime: number,
  events: GameEvent[],
  allPlayers: PlayerInfo[],
  myPlayer: PlayerInfo | undefined,
  objectives: ObjectiveInfo[],
  junglePrediction: JunglePrediction | null
): CoachingTip[] {
  const tips: CoachingTip[] = [];
  if (!myPlayer) return tips;

  const myTeam = myPlayer.team;

  // 1. Fight about to happen
  const fightTip = detectFightBrewing(events, gameTime, allPlayers, myTeam, objectives);
  if (fightTip) tips.push(fightTip);

  // 2. Gank window
  const gankTip = detectGankWindow(allPlayers, myTeam, myPlayer, junglePrediction, gameTime);
  if (gankTip) tips.push(gankTip);

  // 3. Objective rotation
  const rotationTip = detectObjectiveRotation(gameTime, objectives, allPlayers, myPlayer, myTeam);
  if (rotationTip) tips.push(rotationTip);

  // 4. Teamfight state
  const tfTip = assessTeamfightState(allPlayers, myTeam, gameTime);
  if (tfTip) tips.push(tfTip);

  return tips;
}

export function resetGameAwareness(): void {
  recentAwarenessTips.clear();
  tipCounter = 0;
}
