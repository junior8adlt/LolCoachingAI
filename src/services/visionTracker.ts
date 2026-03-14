import type { AllGameData } from '../types/game';
import type { CoachingTip, JunglePrediction } from '../types/coaching';

// ── Vision Awareness System ──
// Tracks vision score, identifies vision gaps, and alerts when fog of war is dangerous.
// The Riot API gives us wardScore but NOT ward positions.
// We infer vision quality from: ward score rate, jungler visibility, game phase, objectives.

interface VisionState {
  lastWardScore: number;
  lastCheckTime: number;
  wardScoreRate: number;           // wards per minute
  timeSinceLastWardIncrease: number;
  consecutiveLowVisionChecks: number;
  lastVisionTipTime: number;
}

const state: VisionState = {
  lastWardScore: 0,
  lastCheckTime: 0,
  wardScoreRate: 0,
  timeSinceLastWardIncrease: 0,
  consecutiveLowVisionChecks: 0,
  lastVisionTipTime: 0,
};

// Vision score benchmarks per minute by game phase
const VISION_BENCHMARKS = {
  EARLY: { good: 0.8, decent: 0.5, poor: 0.3 },   // 0-15min
  MID: { good: 1.2, decent: 0.8, poor: 0.5 },      // 15-25min
  LATE: { good: 1.5, decent: 1.0, poor: 0.6 },      // 25min+
};

// Objective spawn times that require vision setup
const VISION_CRITICAL_OBJECTIVES = [
  { name: 'Dragon', spawnTime: 300, setupTime: 60, side: 'bot' as const },
  { name: 'Voidgrubs', spawnTime: 360, setupTime: 45, side: 'top' as const },
  { name: 'Herald', spawnTime: 840, setupTime: 60, side: 'top' as const },
  { name: 'Baron', spawnTime: 1200, setupTime: 90, side: 'top' as const },
];

let tipCounter = 0;

function createTip(
  message: string,
  priority: 'info' | 'warning' | 'danger',
  category: 'vision' = 'vision'
): CoachingTip {
  tipCounter++;
  return {
    id: `vis-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ── Core Analysis ──

export interface VisionAnalysis {
  wardScorePerMin: number;
  visionQuality: 'good' | 'decent' | 'poor' | 'critical';
  fogRisk: number;           // 0-1, how dangerous the fog of war is right now
  shouldWard: boolean;
  wardingUrgency: 'low' | 'medium' | 'high' | 'critical';
  tips: CoachingTip[];
}

export function analyzeVision(
  gameData: AllGameData,
  junglePrediction: JunglePrediction | null,
  gameTime: number
): VisionAnalysis {
  const tips: CoachingTip[] = [];
  const myPlayer = gameData.allPlayers.find(
    (p) => p.summonerName === gameData.activePlayer.summonerName
  );

  if (!myPlayer || gameTime < 60) {
    return {
      wardScorePerMin: 0,
      visionQuality: 'decent',
      fogRisk: 0.1,
      shouldWard: false,
      wardingUrgency: 'low',
      tips: [],
    };
  }

  const currentWardScore = myPlayer.scores.wardScore;
  const minutes = gameTime / 60;
  const wardScorePerMin = minutes > 0 ? currentWardScore / minutes : 0;

  // Track ward score changes
  if (state.lastCheckTime > 0) {
    if (currentWardScore > state.lastWardScore) {
      state.timeSinceLastWardIncrease = 0;
      state.consecutiveLowVisionChecks = 0;
    } else {
      state.timeSinceLastWardIncrease += (gameTime - state.lastCheckTime);
      state.consecutiveLowVisionChecks++;
    }
  }
  state.lastWardScore = currentWardScore;
  state.lastCheckTime = gameTime;
  state.wardScoreRate = wardScorePerMin;

  // Determine vision quality
  const benchmarks = gameTime < 900 ? VISION_BENCHMARKS.EARLY :
    gameTime < 1500 ? VISION_BENCHMARKS.MID : VISION_BENCHMARKS.LATE;

  let visionQuality: VisionAnalysis['visionQuality'];
  if (wardScorePerMin >= benchmarks.good) {
    visionQuality = 'good';
  } else if (wardScorePerMin >= benchmarks.decent) {
    visionQuality = 'decent';
  } else if (wardScorePerMin >= benchmarks.poor) {
    visionQuality = 'poor';
  } else {
    visionQuality = 'critical';
  }

  // Calculate fog of war risk
  let fogRisk = 0.2; // base risk

  // Jungler not seen = more dangerous
  if (junglePrediction) {
    const timeSinceJunglerSeen = gameTime - junglePrediction.lastSeen;
    if (timeSinceJunglerSeen > 90) {
      fogRisk += 0.3;
    } else if (timeSinceJunglerSeen > 60) {
      fogRisk += 0.2;
    } else if (timeSinceJunglerSeen > 30) {
      fogRisk += 0.1;
    }

    // Jungler predicted on your side
    const playerPos = myPlayer.position?.toUpperCase();
    const playerSide = playerPos === 'TOP' ? 'top' :
      (playerPos === 'BOTTOM' || playerPos === 'UTILITY') ? 'bot' : 'mid';

    if (junglePrediction.predictedSide === playerSide) {
      fogRisk += 0.15;
    }
  }

  // No wards placed recently
  if (state.timeSinceLastWardIncrease > 120) {
    fogRisk += 0.15;
  }

  // Low vision score overall
  if (visionQuality === 'critical') {
    fogRisk += 0.15;
  } else if (visionQuality === 'poor') {
    fogRisk += 0.1;
  }

  fogRisk = Math.min(1, fogRisk);

  // Determine warding urgency
  let wardingUrgency: VisionAnalysis['wardingUrgency'] = 'low';
  const shouldWard = fogRisk > 0.4 || visionQuality === 'critical' || state.timeSinceLastWardIncrease > 150;

  if (fogRisk >= 0.7) {
    wardingUrgency = 'critical';
  } else if (fogRisk >= 0.5 || visionQuality === 'critical') {
    wardingUrgency = 'high';
  } else if (fogRisk >= 0.35 || visionQuality === 'poor') {
    wardingUrgency = 'medium';
  }

  // ── Generate Tips ──
  const now = Date.now();
  const tipCooldown = 45000; // 45s between vision tips

  if (now - state.lastVisionTipTime > tipCooldown) {
    // Critical: no vision + jungler MIA
    if (wardingUrgency === 'critical') {
      tips.push(createTip(
        'No vision and enemy jungler is MIA. Ward river NOW or play under tower.',
        'danger'
      ));
      state.lastVisionTipTime = now;
    }
    // High: hasn't warded in a while
    else if (wardingUrgency === 'high' && state.timeSinceLastWardIncrease > 120) {
      tips.push(createTip(
        `You haven't warded in ${Math.floor(state.timeSinceLastWardIncrease)}s. Drop a ward in river or bush.`,
        'warning'
      ));
      state.lastVisionTipTime = now;
    }
    // Objective vision setup
    else {
      const objectiveTip = checkObjectiveVision(gameTime, wardingUrgency);
      if (objectiveTip) {
        tips.push(objectiveTip);
        state.lastVisionTipTime = now;
      }
    }

    // Swap trinket reminder (after first back, ~level 6+)
    if (myPlayer.level >= 6 && currentWardScore < 3 && gameTime > 480) {
      const hasControlWard = myPlayer.items.some(
        (item) => item.itemID === 2055 || item.displayName.toLowerCase().includes('control')
      );
      if (!hasControlWard && now - state.lastVisionTipTime > 90000) {
        tips.push(createTip(
          'Buy a Control Ward on your next back. Vision wins games.',
          'info'
        ));
        state.lastVisionTipTime = now;
      }
    }
  }

  return {
    wardScorePerMin: Math.round(wardScorePerMin * 100) / 100,
    visionQuality,
    fogRisk: Math.round(fogRisk * 100) / 100,
    shouldWard,
    wardingUrgency,
    tips,
  };
}

function checkObjectiveVision(
  gameTime: number,
  currentUrgency: VisionAnalysis['wardingUrgency']
): CoachingTip | null {
  for (const obj of VISION_CRITICAL_OBJECTIVES) {
    // Check if objective is spawning soon
    const timeUntilSpawn = obj.spawnTime - gameTime;

    if (timeUntilSpawn > 0 && timeUntilSpawn <= obj.setupTime) {
      return createTip(
        `${obj.name} spawns in ${Math.ceil(timeUntilSpawn)}s. Set up vision around ${obj.side} side.`,
        currentUrgency === 'critical' ? 'danger' : 'warning'
      );
    }

    // Objective is up and no vision
    if (gameTime >= obj.spawnTime && currentUrgency !== 'low') {
      // Only for dragon/baron which repeat
      if (obj.name === 'Dragon' || obj.name === 'Baron') {
        const respawnCycle = 300; // 5min dragon, 6min baron
        const timeSinceSpawn = (gameTime - obj.spawnTime) % respawnCycle;
        if (timeSinceSpawn < 30) {
          return createTip(
            `${obj.name} is spawning. Ward the pit and surroundings.`,
            'warning'
          );
        }
      }
    }
  }

  return null;
}

export function resetVisionState(): void {
  state.lastWardScore = 0;
  state.lastCheckTime = 0;
  state.wardScoreRate = 0;
  state.timeSinceLastWardIncrease = 0;
  state.consecutiveLowVisionChecks = 0;
  state.lastVisionTipTime = 0;
}
