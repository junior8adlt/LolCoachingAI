import type { GameEvent, PlayerInfo } from '../types/game';
import type { JunglePrediction, JungleSide } from '../types/coaching';
import { getJunglePath, type ClearPath } from '../data/junglePaths';

interface JungleTrackingState {
  lastSeenTime: number;
  lastSeenSide: JungleSide;
  lastSeenEvent: string;
  campsClearedEstimate: number;
  respawnTimers: Map<string, number>;
}

const trackingState: JungleTrackingState = {
  lastSeenTime: 0,
  lastSeenSide: 'bot',
  lastSeenEvent: '',
  campsClearedEstimate: 0,
  respawnTimers: new Map(),
};

function findEnemyJungler(
  players: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS'
): PlayerInfo | null {
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';
  const jungler = players.find(
    (p) => p.team === enemyTeam && hasSmite(p)
  );
  return jungler ?? null;
}

function hasSmite(player: PlayerInfo): boolean {
  const spell1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const spell2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return spell1.includes('smite') || spell2.includes('smite');
}

function inferSideFromEvent(event: GameEvent, junglerName: string): JungleSide | null {
  if (event.EventName === 'DragonKill' && event.KillerName === junglerName) {
    return 'bot';
  }
  if (event.EventName === 'HeraldKill' && event.KillerName === junglerName) {
    return 'top';
  }
  if (event.EventName === 'BaronKill' && event.KillerName === junglerName) {
    return 'top';
  }

  if (event.EventName === 'ChampionKill') {
    if (event.KillerName === junglerName || event.Assisters?.includes(junglerName)) {
      if (event.VictimName) {
        return null;
      }
    }
  }

  return null;
}

function inferSideFromKillVictim(
  victimName: string,
  allPlayers: PlayerInfo[]
): JungleSide {
  const victim = allPlayers.find((p) => p.summonerName === victimName);
  if (!victim) return 'mid';

  const position = victim.position.toLowerCase();
  if (position === 'top') return 'top';
  if (position === 'bottom' || position === 'utility') return 'bot';
  return 'mid';
}

function estimatePositionFromClearPath(
  path: ClearPath,
  gameTime: number
): JungleSide {
  if (gameTime < 120) {
    return path.preferredSide === 'flexible' ? 'bot' : path.preferredSide;
  }

  for (const gankTime of path.ganksAt) {
    if (Math.abs(gameTime - gankTime) < 30) {
      if (path.preferredSide !== 'flexible') {
        return path.preferredSide;
      }
    }
  }

  const clearCycleLength = path.type === 'full-clear' ? 240 : path.type === '5-camp' ? 180 : 120;
  const cyclePosition = gameTime % clearCycleLength;

  if (cyclePosition < clearCycleLength * 0.33) {
    return path.preferredSide === 'top' ? 'bot' : 'top';
  }
  if (cyclePosition < clearCycleLength * 0.66) {
    return 'mid';
  }
  return path.preferredSide === 'flexible' ? 'bot' : path.preferredSide;
}

export function updateTracking(
  events: GameEvent[],
  gameTime: number,
  players: PlayerInfo[]
): JunglePrediction {
  const myPlayer = players[0];
  if (!myPlayer) {
    return {
      predictedSide: 'mid',
      confidence: 0.1,
      lastSeen: 0,
      gankRisk: 0.3,
    };
  }

  const jungler = findEnemyJungler(players, myPlayer.team);
  if (!jungler) {
    return {
      predictedSide: 'mid',
      confidence: 0.1,
      lastSeen: 0,
      gankRisk: 0.2,
    };
  }

  const junglerName = jungler.summonerName;

  const relevantEvents = events
    .filter(
      (e) =>
        e.KillerName === junglerName ||
        e.VictimName === junglerName ||
        (e.Assisters && e.Assisters.includes(junglerName))
    )
    .sort((a, b) => b.EventTime - a.EventTime);

  if (relevantEvents.length > 0) {
    const latestEvent = relevantEvents[0];
    trackingState.lastSeenTime = latestEvent.EventTime;

    let inferredSide = inferSideFromEvent(latestEvent, junglerName);

    if (!inferredSide && latestEvent.EventName === 'ChampionKill') {
      const targetName =
        latestEvent.KillerName === junglerName || latestEvent.Assisters?.includes(junglerName)
          ? latestEvent.VictimName
          : latestEvent.KillerName;

      if (targetName) {
        inferredSide = inferSideFromKillVictim(targetName, players);
      }
    }

    if (inferredSide) {
      trackingState.lastSeenSide = inferredSide;
      trackingState.lastSeenEvent = latestEvent.EventName;
    }
  }

  return predictJunglerSide(
    trackingState.lastSeenSide,
    gameTime,
    jungler.championName
  );
}

export function predictJunglerSide(
  lastSeenSide: JungleSide,
  gameTime: number,
  jungleChampion: string
): JunglePrediction {
  const timeSinceLastSeen = gameTime - trackingState.lastSeenTime;
  const clearPath = getJunglePath(jungleChampion);

  let predictedSide: JungleSide;
  let confidence: number;

  if (timeSinceLastSeen < 15) {
    predictedSide = lastSeenSide;
    confidence = 0.9;
  } else if (timeSinceLastSeen < 40) {
    predictedSide = lastSeenSide;
    confidence = 0.7;
  } else if (timeSinceLastSeen < 90) {
    if (clearPath) {
      predictedSide = estimatePositionFromClearPath(clearPath, gameTime);
      confidence = 0.5;
    } else {
      const sides: JungleSide[] = ['top', 'mid', 'bot'];
      const opposite: Record<JungleSide, JungleSide> = {
        top: 'bot',
        bot: 'top',
        mid: 'mid',
      };
      predictedSide = opposite[lastSeenSide] ?? sides[Math.floor((gameTime / 30) % 3)];
      confidence = 0.4;
    }
  } else {
    if (clearPath) {
      predictedSide = estimatePositionFromClearPath(clearPath, gameTime);
      confidence = 0.3;
    } else {
      predictedSide = 'mid';
      confidence = 0.2;
    }
  }

  const gankRisk = calculateGankRisk(
    { predictedSide, confidence, lastSeen: trackingState.lastSeenTime, gankRisk: 0 },
    lastSeenSide
  );

  return {
    predictedSide,
    confidence: Math.round(confidence * 100) / 100,
    lastSeen: trackingState.lastSeenTime,
    gankRisk: Math.round(gankRisk * 100) / 100,
  };
}

export function calculateGankRisk(
  prediction: JunglePrediction,
  playerPosition: JungleSide
): number {
  let risk = 0.3;

  if (prediction.predictedSide === playerPosition) {
    risk += 0.35;
  }

  risk *= prediction.confidence + 0.3;

  const timeSinceLastSeen = trackingState.lastSeenTime > 0
    ? Date.now() / 1000 - trackingState.lastSeenTime
    : 999;

  if (timeSinceLastSeen > 60) {
    risk += 0.15;
  }

  return Math.min(1, Math.max(0, risk));
}

export { type ClearPath } from '../data/junglePaths';
export { getJunglePath as getStandardClearPath } from '../data/junglePaths';
