import type { PlayerInfo } from '../types/game';
import type { CoachingTip, ObjectiveInfo } from '../types/coaching';

// ── Macro Coach ──
// High-level game awareness: objectives, rotations, teamfight calls, tower safety.
// This is what separates a Gold coach from a Challenger coach.

let tipCounter = 0;
const recentMacroTips = new Map<string, number>();

function createMacroTip(
  message: string,
  priority: 'info' | 'warning' | 'danger',
  category: 'macro' | 'objective' | 'positioning' = 'macro'
): CoachingTip | null {
  const hash = message.slice(0, 35).toLowerCase();
  const now = Date.now();
  if (recentMacroTips.has(hash) && now - (recentMacroTips.get(hash) ?? 0) < 60000) return null;
  recentMacroTips.set(hash, now);

  // Cleanup
  if (recentMacroTips.size > 30) {
    for (const [k, t] of recentMacroTips) {
      if (now - t > 120000) recentMacroTips.delete(k);
    }
  }

  tipCounter++;
  return {
    id: `macro-${now}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: now,
    dismissed: false,
  };
}

// ── 1. Objective Rotation Advisor ──

export function getObjectiveRotationTips(
  gameTime: number,
  objectives: ObjectiveInfo[],
  myPlayer: PlayerInfo | undefined,
  allPlayers: PlayerInfo[]
): CoachingTip[] {
  const tips: CoachingTip[] = [];
  if (!myPlayer) return tips;

  const myTeam = myPlayer.team;
  const enemiesDead = allPlayers.filter((p) => p.team !== myTeam && p.isDead);
  const alliesDead = allPlayers.filter((p) => p.team === myTeam && p.isDead);
  const numberAdvantage = enemiesDead.length - alliesDead.length;

  for (const obj of objectives) {
    // ── Objective spawning soon → rotate ──
    if (obj.status === 'dead' && obj.timer > 0 && obj.timer <= 60) {
      const objName = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
      const side = obj.type === 'dragon' ? 'bot' : 'top';

      if (obj.timer <= 30) {
        const tip = createMacroTip(
          `${objName} spawns in ${Math.ceil(obj.timer)}s! Push ${side} wave and rotate NOW.`,
          'warning', 'objective'
        );
        if (tip) tips.push(tip);
      } else {
        const tip = createMacroTip(
          `${objName} in ${Math.ceil(obj.timer)}s. Start setting up vision and wave priority ${side} side.`,
          'info', 'objective'
        );
        if (tip) tips.push(tip);
      }
    }

    // ── Objective alive + number advantage → take it ──
    if (obj.status === 'alive' && numberAdvantage >= 2) {
      const objName = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
      const tip = createMacroTip(
        `${numberAdvantage} enemies dead! Take ${objName} NOW. You have numbers advantage.`,
        'danger', 'objective'
      );
      if (tip) tips.push(tip);
    }
  }

  // ── Baron call after ace or near-ace ──
  if (enemiesDead.length >= 4 && gameTime >= 1200) {
    const tip = createMacroTip(
      `${enemiesDead.length} enemies dead! Rush Baron immediately!`,
      'danger', 'objective'
    );
    if (tip) tips.push(tip);
  }

  // ── Dragon call when 3+ dead early ──
  if (enemiesDead.length >= 3 && gameTime >= 300 && gameTime < 1200) {
    const tip = createMacroTip(
      `${enemiesDead.length} enemies dead! Take Dragon while they can't contest.`,
      'danger', 'objective'
    );
    if (tip) tips.push(tip);
  }

  // ── After killing lane opponent → push + roam/objective ──
  if (myPlayer.scores.kills > 0) {
    const laneOpponentDead = allPlayers.find(
      (p) => p.team !== myTeam && p.position === myPlayer.position && p.isDead && p.respawnTimer > 15
    );
    if (laneOpponentDead) {
      const timer = Math.ceil(laneOpponentDead.respawnTimer);
      if (gameTime < 900) {
        const tip = createMacroTip(
          `${laneOpponentDead.championName} dead for ${timer}s. Push wave into tower, then look for plates or a roam.`,
          'info', 'macro'
        );
        if (tip) tips.push(tip);
      } else {
        const tip = createMacroTip(
          `${laneOpponentDead.championName} dead for ${timer}s. Push and rotate to an objective or help another lane.`,
          'info', 'macro'
        );
        if (tip) tips.push(tip);
      }
    }
  }

  return tips;
}

// ── 2. Teamfight Awareness ──

export function getTeamfightTips(
  gameTime: number,
  allPlayers: PlayerInfo[],
  myPlayer: PlayerInfo | undefined
): CoachingTip[] {
  const tips: CoachingTip[] = [];
  if (!myPlayer || gameTime < 600) return tips;

  const myTeam = myPlayer.team;
  const alliesDead = allPlayers.filter((p) => p.team === myTeam && p.isDead).length;
  const enemiesDead = allPlayers.filter((p) => p.team !== myTeam && p.isDead).length;
  const alliesAlive = allPlayers.filter((p) => p.team === myTeam && !p.isDead).length;
  const enemiesAlive = allPlayers.filter((p) => p.team !== myTeam && !p.isDead).length;

  // ── Don't fight outnumbered ──
  if (alliesDead >= 2 && enemiesDead === 0 && alliesAlive <= 3) {
    const tip = createMacroTip(
      `${alliesDead} allies dead! Don't fight ${enemiesAlive}v${alliesAlive}. Play safe and wait for respawns.`,
      'danger', 'positioning'
    );
    if (tip) tips.push(tip);
  }

  // ── Won teamfight → push advantage ──
  if (enemiesDead >= 3 && alliesDead <= 1) {
    const tip = createMacroTip(
      `Won the fight! ${enemiesDead} dead. Push for towers, inhibitors, or objectives. Don't waste this.`,
      'warning', 'macro'
    );
    if (tip) tips.push(tip);
  }

  // ── Lost teamfight → defend ──
  if (alliesDead >= 3 && enemiesDead <= 1) {
    const tip = createMacroTip(
      `Lost the fight. Play safe under tower. Clear waves and stall until team respawns.`,
      'warning', 'positioning'
    );
    if (tip) tips.push(tip);
  }

  // ── Even fight warning ──
  if (alliesDead >= 2 && enemiesDead >= 2 && alliesAlive >= 2 && enemiesAlive >= 2) {
    const tip = createMacroTip(
      `Messy fight. Regroup with your team. Don't chase kills alone.`,
      'info', 'positioning'
    );
    if (tip) tips.push(tip);
  }

  return tips;
}

// ── 3. Tower / Dive Awareness ──

export interface DiveAssessment {
  shouldDive: boolean;
  reason: string;
}

export function assessDiveSafety(
  myHPPercent: number,
  myLevel: number,
  enemyIsDead: boolean,
  alliesNearby: number,
  gameTime: number
): DiveAssessment {
  // Enemy is dead → no dive needed, free tower
  if (enemyIsDead) {
    return { shouldDive: false, reason: 'Enemy is dead. Free tower damage, no dive needed.' };
  }

  // Too low HP to dive
  if (myHPPercent < 0.4) {
    return { shouldDive: false, reason: 'Too low HP to dive. You\'ll die to tower shots.' };
  }

  // Solo dive is almost always bad below level 6
  if (alliesNearby === 0 && myLevel < 6) {
    return { shouldDive: false, reason: 'Don\'t solo dive before level 6. Tower will kill you.' };
  }

  // Solo dive requires high HP
  if (alliesNearby === 0 && myHPPercent < 0.7) {
    return { shouldDive: false, reason: 'Don\'t solo dive without 70%+ HP. Let jungler help.' };
  }

  // 2+ people can dive if HP is decent
  if (alliesNearby >= 1 && myHPPercent >= 0.5) {
    return { shouldDive: true, reason: 'Dive is possible with your ally. One tanks tower, other kills.' };
  }

  // Late game with high HP → dive is safer
  if (gameTime > 1500 && myHPPercent >= 0.6) {
    return { shouldDive: true, reason: 'Late game dive. Tower does less relative damage. Go fast.' };
  }

  return { shouldDive: false, reason: 'Dive too risky right now. Poke them down first or wait for help.' };
}

// Warn about dive situations in the fight model
export function getDiveTip(
  myHPPercent: number,
  enemyInfo: PlayerInfo | undefined,
  fightCanWin: boolean,
  gameTime: number
): CoachingTip | null {
  if (!enemyInfo || enemyInfo.isDead) return null;

  // If fight model says we can win BUT enemy might be under tower
  // We infer "under tower" from: enemy low CS rate (staying safe), or they just came back from death
  if (fightCanWin && myHPPercent < 0.5) {
    return createMacroTip(
      `You might win the trade, but you're at ${Math.round(myHPPercent * 100)}% HP. If they're under tower, DON'T DIVE. Poke and wait.`,
      'warning', 'positioning'
    );
  }

  if (fightCanWin && myHPPercent >= 0.5 && myHPPercent < 0.7 && gameTime < 900) {
    return createMacroTip(
      `Careful if chasing under tower. Only dive with jungle help or if they're very low.`,
      'info', 'positioning'
    );
  }

  return null;
}

// ── 4. Rotation Advice ──

export function getRotationTip(
  gameTime: number,
  myPlayer: PlayerInfo | undefined,
  allPlayers: PlayerInfo[]
): CoachingTip | null {
  if (!myPlayer || gameTime < 840) return null; // Pre-14 min is mostly laning

  const myTeam = myPlayer.team;
  const myPos = myPlayer.position?.toUpperCase();

  // Side lane player in mid-late game → should be aware of rotations
  if ((myPos === 'TOP' || myPos === 'BOTTOM') && gameTime > 900) {
    const enemiesGrouped = allPlayers.filter(
      (p) => p.team !== myTeam && !p.isDead
    ).length;

    // If all 5 enemies alive and it's mid-late game
    if (enemiesGrouped === 5) {
      return createMacroTip(
        'All 5 enemies alive. Don\'t push too far alone without vision. Stay ready to group for objectives.',
        'info', 'macro'
      );
    }
  }

  // Mid laner should roam after pushing
  if (myPos === 'MIDDLE' && gameTime > 600 && gameTime < 1200) {
    const kills = myPlayer.scores.kills;
    if (kills >= 2) {
      return createMacroTip(
        'You\'re ahead mid. Push wave and look for roams to bot or top. Spread your lead.',
        'info', 'macro'
      );
    }
  }

  return null;
}

export function resetMacroCoach(): void {
  recentMacroTips.clear();
  tipCounter = 0;
}
