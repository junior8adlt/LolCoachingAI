import type { GameEvent, PlayerInfo } from '../types/game';
import type { JunglePrediction, JungleSide, CoachingTip } from '../types/coaching';
import { getJunglePath, type ClearPath } from '../data/junglePaths';

// ── Camp Timer Constants (Season 15) ──

const CAMP_TIMERS = {
  // First spawn times (seconds from game start) - Season 2026
  BUFF_FIRST_SPAWN: 90,         // 1:30 - Blue/Red
  SMALL_CAMP_FIRST_SPAWN: 90,   // 1:30 - Gromp, Wolves, Raptors, Krugs
  SCUTTLE_FIRST_SPAWN: 210,     // 3:30
  DRAGON_FIRST_SPAWN: 300,      // 5:00
  VOIDGRUBS_FIRST_SPAWN: 360,   // 6:00
  HERALD_FIRST_SPAWN: 840,      // 14:00
  BARON_FIRST_SPAWN: 1200,      // 20:00

  // Respawn times (seconds)
  BUFF_RESPAWN: 300,             // 5:00
  SMALL_CAMP_RESPAWN: 135,      // 2:15
  SCUTTLE_RESPAWN: 150,         // 2:30
  DRAGON_RESPAWN: 300,          // 5:00
  VOIDGRUBS_RESPAWN: 240,       // 4:00
  HERALD_RESPAWN: 0,            // Does NOT respawn (one-time)
  BARON_RESPAWN: 360,           // 6:00
} as const;

// Camp locations mapped to sides
const CAMP_SIDES: Record<string, { order: JungleSide; chaos: JungleSide }> = {
  blue_buff:  { order: 'bot', chaos: 'top' },
  red_buff:   { order: 'top', chaos: 'bot' },
  gromp:      { order: 'bot', chaos: 'top' },
  wolves:     { order: 'bot', chaos: 'top' },
  raptors:    { order: 'top', chaos: 'bot' },
  krugs:      { order: 'top', chaos: 'bot' },
  scuttle_top: { order: 'top', chaos: 'top' },
  scuttle_bot: { order: 'bot', chaos: 'bot' },
};

// ── Tracking State ──

interface CampState {
  alive: boolean;
  lastKillTime: number;
  respawnTime: number;
  side: JungleSide;
}

interface JungleState {
  // Event-based sighting
  lastSeenTime: number;
  lastSeenSide: JungleSide;
  lastSeenEvent: string;
  junglerName: string;
  junglerChampion: string;
  junglerTeam: 'ORDER' | 'CHAOS';

  // Camp timer estimates
  camps: Map<string, CampState>;

  // Path inference
  estimatedClearCount: number;
  lastClearStartTime: number;

  // Sighting history for pattern matching
  sightings: Array<{ time: number; side: JungleSide; event: string }>;
}

const state: JungleState = {
  lastSeenTime: 0,
  lastSeenSide: 'bot',
  lastSeenEvent: '',
  junglerName: '',
  junglerChampion: '',
  junglerTeam: 'ORDER',
  camps: new Map(),
  estimatedClearCount: 0,
  lastClearStartTime: 90,
  sightings: [],
};

// ── Helpers ──

function findEnemyJungler(players: PlayerInfo[], myTeam: 'ORDER' | 'CHAOS'): PlayerInfo | null {
  const enemyTeam = myTeam === 'ORDER' ? 'CHAOS' : 'ORDER';
  return players.find((p) => p.team === enemyTeam && hasSmite(p)) ?? null;
}

function hasSmite(player: PlayerInfo): boolean {
  const s1 = player.summonerSpells.summonerSpellOne.rawDisplayName.toLowerCase();
  const s2 = player.summonerSpells.summonerSpellTwo.rawDisplayName.toLowerCase();
  return s1.includes('smite') || s2.includes('smite') ||
         s1.includes('castigo') || s2.includes('castigo'); // Spanish client
}

function inferSideFromEvent(event: GameEvent, junglerName: string, allPlayers: PlayerInfo[]): JungleSide | null {
  // Objective kills → exact location
  if (event.EventName === 'DragonKill') return 'bot';
  if (event.EventName === 'HeraldKill') return 'top';
  if (event.EventName === 'BaronKill') return 'top';

  // Champion kill/assist → infer from victim's lane position
  if (event.EventName === 'ChampionKill') {
    const isJunglerInvolved = event.KillerName === junglerName ||
      (event.Assisters?.includes(junglerName) ?? false);

    if (isJunglerInvolved && event.VictimName) {
      const victim = allPlayers.find((p) => p.summonerName === event.VictimName);
      if (victim) {
        const pos = victim.position?.toUpperCase();
        if (pos === 'TOP') return 'top';
        if (pos === 'BOTTOM' || pos === 'UTILITY') return 'bot';
        if (pos === 'MIDDLE') return 'mid';
      }
    }

    // Jungler died → we know where they were
    if (event.VictimName === junglerName) {
      const killer = allPlayers.find((p) => p.summonerName === event.KillerName);
      if (killer) {
        const pos = killer.position?.toUpperCase();
        if (pos === 'TOP') return 'top';
        if (pos === 'BOTTOM' || pos === 'UTILITY') return 'bot';
        if (pos === 'MIDDLE') return 'mid';
      }
    }
  }

  return null;
}

// ── Camp Timer Management ──

function initCamps(enemyTeam: 'ORDER' | 'CHAOS'): void {
  const teamKey = enemyTeam === 'ORDER' ? 'order' : 'chaos';

  const campDefs: Array<{ name: string; side: JungleSide; respawn: number }> = [
    { name: 'blue_buff', side: CAMP_SIDES.blue_buff[teamKey], respawn: CAMP_TIMERS.BUFF_RESPAWN },
    { name: 'red_buff', side: CAMP_SIDES.red_buff[teamKey], respawn: CAMP_TIMERS.BUFF_RESPAWN },
    { name: 'gromp', side: CAMP_SIDES.gromp[teamKey], respawn: CAMP_TIMERS.SMALL_CAMP_RESPAWN },
    { name: 'wolves', side: CAMP_SIDES.wolves[teamKey], respawn: CAMP_TIMERS.SMALL_CAMP_RESPAWN },
    { name: 'raptors', side: CAMP_SIDES.raptors[teamKey], respawn: CAMP_TIMERS.SMALL_CAMP_RESPAWN },
    { name: 'krugs', side: CAMP_SIDES.krugs[teamKey], respawn: CAMP_TIMERS.SMALL_CAMP_RESPAWN },
  ];

  for (const camp of campDefs) {
    state.camps.set(camp.name, {
      alive: true,
      lastKillTime: 0,
      respawnTime: camp.respawn,
      side: camp.side,
    });
  }
}

function estimateCampStates(gameTime: number): void {
  // Estimate which camps are alive based on timing
  for (const [_name, camp] of state.camps) {
    if (!camp.alive && camp.lastKillTime > 0) {
      if (gameTime >= camp.lastKillTime + camp.respawnTime) {
        camp.alive = true;
      }
    }
  }
}

function markCampsCleared(side: JungleSide, gameTime: number): void {
  // When jungler is seen on a side, estimate they cleared camps there
  for (const [_name, camp] of state.camps) {
    if (camp.side === side && camp.alive) {
      camp.alive = false;
      camp.lastKillTime = gameTime;
    }
  }
}

// ── Path Inference ──

function inferPositionFromClearCycle(
  gameTime: number,
  clearPath: ClearPath | null,
  enemyTeam: 'ORDER' | 'CHAOS'
): { side: JungleSide; confidence: number } {
  const timeSinceSeen = gameTime - state.lastSeenTime;

  // Phase 1: First clear (0 - ~3:30)
  if (gameTime < 210) {
    if (clearPath) {
      // Early game: jungler follows their clear path
      const clearDuration = clearPath.type === 'full-clear' ? 210 :
                           clearPath.type === '5-camp' ? 170 : 130;

      if (gameTime < 90 + clearDuration) {
        // Still on first clear
        const progress = (gameTime - 90) / clearDuration;
        if (progress < 0.5) {
          // First half of clear: started side
          const startSide = clearPath.route[0].toLowerCase().includes('red')
            ? (enemyTeam === 'ORDER' ? 'top' : 'bot')
            : (enemyTeam === 'ORDER' ? 'bot' : 'top');
          return { side: startSide, confidence: 0.65 };
        } else {
          // Second half: opposite side
          const startSide = clearPath.route[0].toLowerCase().includes('red')
            ? (enemyTeam === 'ORDER' ? 'top' : 'bot')
            : (enemyTeam === 'ORDER' ? 'bot' : 'top');
          const oppSide: JungleSide = startSide === 'top' ? 'bot' : 'top';
          return { side: oppSide, confidence: 0.6 };
        }
      } else {
        // First clear done, looking for gank
        return { side: clearPath.preferredSide === 'flexible' ? 'mid' : clearPath.preferredSide, confidence: 0.5 };
      }
    }
    return { side: 'bot', confidence: 0.3 };
  }

  // Phase 2: Scuttle contest (3:30 - 4:30)
  if (gameTime >= 210 && gameTime < 270) {
    // Junglers often contest scuttle
    return { side: 'mid', confidence: 0.4 };
  }

  // Phase 3: Standard play - use camp timers
  // Find which side has more alive camps → jungler probably heading there
  let topCamps = 0;
  let botCamps = 0;
  for (const [_name, camp] of state.camps) {
    if (camp.alive) {
      if (camp.side === 'top') topCamps++;
      else if (camp.side === 'bot') botCamps++;
    }
  }

  if (topCamps > botCamps + 1) {
    return { side: 'top', confidence: 0.45 };
  }
  if (botCamps > topCamps + 1) {
    return { side: 'bot', confidence: 0.45 };
  }

  // Clear cycle timing: junglers typically alternate sides every ~2 minutes
  if (state.lastSeenSide === 'top' || state.lastSeenSide === 'mid') {
    // Was top/mid, if enough time passed, likely bot now
    if (timeSinceSeen > 60) return { side: 'bot', confidence: 0.35 };
    return { side: state.lastSeenSide, confidence: Math.max(0.2, 0.6 - timeSinceSeen * 0.005) };
  } else {
    if (timeSinceSeen > 60) return { side: 'top', confidence: 0.35 };
    return { side: state.lastSeenSide, confidence: Math.max(0.2, 0.6 - timeSinceSeen * 0.005) };
  }
}

// ── Gank Risk Calculation ──

function calculateGankRisk(
  predictedSide: JungleSide,
  confidence: number,
  playerSide: JungleSide,
  gameTime: number,
  junglerDead: boolean,
  junglerLevel: number
): number {
  if (junglerDead) return 0.05;

  let risk = 0.15; // Base risk

  // Same side as prediction
  if (predictedSide === playerSide) {
    risk += 0.3 * confidence;
  } else if (predictedSide === 'mid') {
    risk += 0.15 * confidence; // Mid can roam to either side
  }

  // Time since last seen - higher = more danger (fog of war)
  const timeSinceSeen = gameTime - state.lastSeenTime;
  if (timeSinceSeen > 90) {
    risk += 0.2; // Haven't seen jungler in 1.5 min = very dangerous
  } else if (timeSinceSeen > 60) {
    risk += 0.12;
  } else if (timeSinceSeen > 30) {
    risk += 0.05;
  }

  // Early game ganking windows are more dangerous
  if (gameTime >= 150 && gameTime <= 420) {
    risk += 0.1; // 2:30 - 7:00 is prime gank time
  }

  // Level-based: jungler with ult is more threatening
  if (junglerLevel >= 6) {
    risk += 0.05;
  }

  // Gank timing patterns: junglers tend to gank after clearing
  const clearPath = getJunglePath(state.junglerChampion);
  if (clearPath) {
    for (const gankTime of clearPath.ganksAt) {
      if (Math.abs(gameTime - gankTime) < 20) {
        risk += 0.15; // Near a known gank timing
        break;
      }
    }
  }

  return Math.min(1, Math.max(0, risk));
}

// ── Public API ──

export function updateTracking(
  events: GameEvent[],
  gameTime: number,
  players: PlayerInfo[]
): JunglePrediction {
  // Find my team
  const myPlayer = players.find((p) => !p.isBot && p.team === 'ORDER') ??
                   players.find((p) => !p.isBot) ??
                   players[0];

  if (!myPlayer) {
    return { predictedSide: 'mid', confidence: 0.1, lastSeen: 0, gankRisk: 0.3 };
  }

  const jungler = findEnemyJungler(players, myPlayer.team);
  if (!jungler) {
    return { predictedSide: 'mid', confidence: 0.1, lastSeen: 0, gankRisk: 0.2 };
  }

  // Initialize state if needed
  const enemyTeam = myPlayer.team === 'ORDER' ? 'CHAOS' : 'ORDER';
  if (state.junglerName !== jungler.summonerName) {
    state.junglerName = jungler.summonerName;
    state.junglerChampion = jungler.championName;
    state.junglerTeam = enemyTeam as 'ORDER' | 'CHAOS';
    state.sightings = [];
    initCamps(state.junglerTeam);
  }

  // Update camp states based on time
  estimateCampStates(gameTime);

  // Process events for sightings
  const relevantEvents = events
    .filter((e) =>
      e.KillerName === jungler.summonerName ||
      e.VictimName === jungler.summonerName ||
      (e.Assisters?.includes(jungler.summonerName) ?? false)
    )
    .sort((a, b) => b.EventTime - a.EventTime);

  if (relevantEvents.length > 0) {
    const latestEvent = relevantEvents[0];

    // Only process if newer than our last sighting
    if (latestEvent.EventTime > state.lastSeenTime) {
      state.lastSeenTime = latestEvent.EventTime;
      state.lastSeenEvent = latestEvent.EventName;

      const inferredSide = inferSideFromEvent(latestEvent, jungler.summonerName, players);
      if (inferredSide) {
        state.lastSeenSide = inferredSide;
        state.sightings.push({
          time: latestEvent.EventTime,
          side: inferredSide,
          event: latestEvent.EventName,
        });
        // Keep last 20 sightings
        if (state.sightings.length > 20) {
          state.sightings = state.sightings.slice(-20);
        }
        // Mark camps on that side as likely cleared
        markCampsCleared(inferredSide, latestEvent.EventTime);
      }
    }
  }

  // Predict current position
  const clearPath = getJunglePath(jungler.championName);
  const timeSinceSeen = gameTime - state.lastSeenTime;

  let predictedSide: JungleSide;
  let confidence: number;

  if (jungler.isDead) {
    // Jungler is dead - they're at fountain or about to respawn
    predictedSide = 'mid'; // Base/fountain
    confidence = 0.95;
  } else if (timeSinceSeen < 10) {
    // Just seen, very confident
    predictedSide = state.lastSeenSide;
    confidence = 0.9;
  } else if (timeSinceSeen < 30) {
    // Seen recently, still nearby
    predictedSide = state.lastSeenSide;
    confidence = 0.7;
  } else if (timeSinceSeen < 60) {
    // Could have moved one side
    const inference = inferPositionFromClearCycle(gameTime, clearPath, state.junglerTeam);
    predictedSide = inference.side;
    confidence = Math.min(0.6, inference.confidence);
  } else {
    // Long time no see - use camp timers and clear cycle
    const inference = inferPositionFromClearCycle(gameTime, clearPath, state.junglerTeam);
    predictedSide = inference.side;
    confidence = inference.confidence;
  }

  // Calculate gank risk for player's lane
  const playerPos = myPlayer.position?.toUpperCase();
  const playerSide: JungleSide = playerPos === 'TOP' ? 'top' :
    (playerPos === 'BOTTOM' || playerPos === 'UTILITY') ? 'bot' : 'mid';

  const gankRisk = calculateGankRisk(
    predictedSide, confidence, playerSide, gameTime,
    jungler.isDead, jungler.level
  );

  return {
    predictedSide,
    confidence: Math.round(confidence * 100) / 100,
    lastSeen: state.lastSeenTime,
    gankRisk: Math.round(gankRisk * 100) / 100,
  };
}

// ── Coaching Tips ──

let tipCounter = 0;

export function getJungleCoachingTip(
  prediction: JunglePrediction,
  gameTime: number,
  playerSide: JungleSide
): CoachingTip | null {
  const timeSinceSeen = gameTime - prediction.lastSeen;

  // High gank risk warning
  if (prediction.gankRisk >= 0.6 && prediction.predictedSide === playerSide) {
    tipCounter++;
    return {
      id: `jng-${Date.now()}-${tipCounter}`,
      message: `Enemy jungler likely on your side! Gank risk HIGH. Play safe and ward.`,
      priority: 'danger',
      category: 'jungle',
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  // Fog of war warning
  if (timeSinceSeen > 90 && prediction.gankRisk >= 0.4) {
    tipCounter++;
    return {
      id: `jng-${Date.now()}-${tipCounter}`,
      message: `Enemy jungler not seen in ${Math.floor(timeSinceSeen)}s. Stay alert, ward up.`,
      priority: 'warning',
      category: 'jungle',
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  return null;
}

export function resetJungleState(): void {
  state.lastSeenTime = 0;
  state.lastSeenSide = 'bot';
  state.lastSeenEvent = '';
  state.junglerName = '';
  state.junglerChampion = '';
  state.camps.clear();
  state.sightings = [];
  state.estimatedClearCount = 0;
  state.lastClearStartTime = 90;
}

export { type ClearPath } from '../data/junglePaths';
export { getJunglePath as getStandardClearPath } from '../data/junglePaths';
