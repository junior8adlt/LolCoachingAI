import type { CoachingTip, TipCategory } from '../types/coaching';
import type { PlayerProfile, WeaknessType } from './playerProfile';

// ── Coaching Reasoning ──────────────────────────────────────────────────────
// The brain that connects game signals into human-like reasoning chains.
// Instead of just saying "fight now", it explains WHY like a real Challenger coach.

export interface CoachingReasoning {
  situation: string;        // "Enemy jungler seen top"
  signals: string[];        // ["Wave pushing", "Level advantage", "Ignite ready"]
  conclusion: string;       // "Enemy cannot punish you"
  action: string;           // "Trade aggressively"
  confidence: number;       // 0-1
  category: 'trade' | 'safety' | 'objective' | 'roam' | 'recall' | 'teamfight';
}

export interface GameSignals {
  jungleSide: string | null;
  jungleConfidence: number;
  waveState: string;
  levelAdvantage: number;
  itemAdvantage: number;
  enemyFlashDown: boolean;
  enemyUltDown: boolean;
  objectiveSpawningSoon: boolean;
  objectiveName: string | null;
  numberAdvantage: number;
  enemyHPLow: boolean;
  visionQuality: string;
  myHPPercent: number;
  gameTime: number;
}

// ── Adaptive Coaching ───────────────────────────────────────────────────────
// Adjusts tip priority based on the player's known weaknesses.

export interface PlayerFocus {
  primaryWeakness: string;                    // "farming" / "vision" / "positioning" / "macro"
  focusObjective: string;                     // "Hit 7 CS/min this game"
  tipWeightModifiers: Record<string, number>; // Boost tip priority for weak areas
}

// ── Signal Collection ───────────────────────────────────────────────────────

interface SignalScore {
  label: string;
  aggressive: number;  // positive = aggressive, negative = defensive
}

function collectSignalScores(signals: GameSignals): SignalScore[] {
  const scores: SignalScore[] = [];

  // Jungle position
  if (signals.jungleSide && signals.jungleConfidence > 0.5) {
    // Jungler on opposite side = safe, same side = danger
    scores.push({
      label: `Enemy jungler ${signals.jungleSide} side (${Math.round(signals.jungleConfidence * 100)}% confidence)`,
      aggressive: 0, // neutral — context-dependent, handled in chain builder
    });
  }
  if (!signals.jungleSide && signals.jungleConfidence < 0.3) {
    scores.push({
      label: 'Enemy jungler position unknown',
      aggressive: -1,
    });
  }

  // Wave state
  if (signals.waveState === 'pushing_to_enemy') {
    scores.push({ label: 'Wave pushing toward enemy', aggressive: -0.5 });
  } else if (signals.waveState === 'frozen_near_tower') {
    scores.push({ label: 'Wave frozen near your tower', aggressive: 1 });
  } else if (signals.waveState === 'pushing_to_you') {
    scores.push({ label: 'Wave pushing toward you', aggressive: 0.5 });
  } else if (signals.waveState === 'even') {
    scores.push({ label: 'Wave is even', aggressive: 0 });
  }

  // Level advantage
  if (signals.levelAdvantage >= 2) {
    scores.push({ label: `${signals.levelAdvantage} level advantage`, aggressive: 1.5 });
  } else if (signals.levelAdvantage === 1) {
    scores.push({ label: '1 level advantage', aggressive: 0.8 });
  } else if (signals.levelAdvantage <= -2) {
    scores.push({ label: `${Math.abs(signals.levelAdvantage)} levels behind`, aggressive: -1.5 });
  } else if (signals.levelAdvantage === -1) {
    scores.push({ label: '1 level behind', aggressive: -0.5 });
  }

  // Item advantage
  if (signals.itemAdvantage > 500) {
    scores.push({ label: `${signals.itemAdvantage}g item lead`, aggressive: 1 });
  } else if (signals.itemAdvantage < -500) {
    scores.push({ label: `${Math.abs(signals.itemAdvantage)}g item deficit`, aggressive: -1 });
  }

  // Summoner spell advantage
  if (signals.enemyFlashDown) {
    scores.push({ label: 'Enemy Flash is down', aggressive: 1.2 });
  }
  if (signals.enemyUltDown) {
    scores.push({ label: 'Enemy ultimate is down', aggressive: 1 });
  }

  // Objective timers
  if (signals.objectiveSpawningSoon && signals.objectiveName) {
    scores.push({
      label: `${signals.objectiveName} spawning soon`,
      aggressive: 0, // objective-specific, not aggression
    });
  }

  // Number advantage
  if (signals.numberAdvantage > 0) {
    scores.push({
      label: `${signals.numberAdvantage}v fewer enemies (number advantage)`,
      aggressive: 1.5,
    });
  } else if (signals.numberAdvantage < 0) {
    scores.push({
      label: `${Math.abs(signals.numberAdvantage)} more enemies nearby (outnumbered)`,
      aggressive: -2,
    });
  }

  // Enemy HP
  if (signals.enemyHPLow) {
    scores.push({ label: 'Enemy laner is low HP', aggressive: 1.5 });
  }

  // My HP
  if (signals.myHPPercent < 30) {
    scores.push({ label: `You are low HP (${Math.round(signals.myHPPercent)}%)`, aggressive: -2 });
  } else if (signals.myHPPercent < 50) {
    scores.push({ label: `You are below half HP (${Math.round(signals.myHPPercent)}%)`, aggressive: -0.8 });
  }

  // Vision quality
  if (signals.visionQuality === 'blind') {
    scores.push({ label: 'No vision in key areas', aggressive: -1.5 });
  } else if (signals.visionQuality === 'poor') {
    scores.push({ label: 'Poor vision coverage', aggressive: -0.5 });
  } else if (signals.visionQuality === 'good') {
    scores.push({ label: 'Good vision coverage', aggressive: 0.5 });
  }

  return scores;
}

// ── Reasoning Chain Builder ─────────────────────────────────────────────────

function buildTradeReasoning(
  signals: GameSignals,
  signalScores: SignalScore[]
): CoachingReasoning | null {
  const aggressiveSignals = signalScores.filter((s) => s.aggressive >= 0.8);
  const defensiveSignals = signalScores.filter((s) => s.aggressive <= -0.8);

  // SAFE TRADE WINDOW: 3+ aggressive signals, not too many defensive
  if (aggressiveSignals.length >= 3 && defensiveSignals.length <= 1) {
    const totalAggression = signalScores.reduce((sum, s) => sum + s.aggressive, 0);
    const confidence = Math.min(1, 0.5 + aggressiveSignals.length * 0.1 + totalAggression * 0.05);

    let action = 'Trade aggressively';
    let conclusion = 'You have a clear advantage';

    if (signals.enemyFlashDown && signals.enemyHPLow) {
      action = 'All-in for the kill';
      conclusion = 'Enemy has no escape and is low';
    } else if (signals.enemyFlashDown) {
      action = 'Look for an extended trade — they cannot Flash away';
      conclusion = 'Enemy escape is limited';
    } else if (signals.levelAdvantage >= 2) {
      action = 'Force a fight — your level advantage is huge';
      conclusion = 'You massively outstat them right now';
    }

    return {
      situation: describeSituation(signals, 'aggressive'),
      signals: aggressiveSignals.map((s) => s.label),
      conclusion,
      action,
      confidence,
      category: 'trade',
    };
  }

  return null;
}

function buildSafetyReasoning(
  signals: GameSignals,
  signalScores: SignalScore[]
): CoachingReasoning | null {
  const defensiveSignals = signalScores.filter((s) => s.aggressive <= -0.5);

  // PLAY SAFE: 2+ defensive signals
  if (defensiveSignals.length >= 2) {
    const totalDefensive = defensiveSignals.reduce((sum, s) => sum + Math.abs(s.aggressive), 0);
    const confidence = Math.min(1, 0.4 + defensiveSignals.length * 0.15 + totalDefensive * 0.05);

    let action = 'Play safe and farm';
    let conclusion = 'The situation is unfavorable';

    if (signals.myHPPercent < 30) {
      action = 'Recall immediately — you are too low to stay';
      conclusion = 'One more ability will kill you';
    } else if (!signals.jungleSide && signals.visionQuality === 'blind') {
      action = 'Hug tower — jungler could be anywhere';
      conclusion = 'You have no information on enemy jungler';
    } else if (signals.levelAdvantage <= -2) {
      action = 'Farm under tower, avoid all trades';
      conclusion = 'You are too far behind in levels to fight';
    } else if (signals.numberAdvantage < 0) {
      action = 'Back off — you are outnumbered';
      conclusion = 'Fighting outnumbered will get you killed';
    }

    return {
      situation: describeSituation(signals, 'defensive'),
      signals: defensiveSignals.map((s) => s.label),
      conclusion,
      action,
      confidence,
      category: 'safety',
    };
  }

  return null;
}

function buildObjectiveReasoning(
  signals: GameSignals,
  signalScores: SignalScore[]
): CoachingReasoning | null {
  if (!signals.objectiveSpawningSoon || !signals.objectiveName) return null;

  const hasPush = signals.waveState === 'pushing_to_enemy' || signals.waveState === 'even';
  const hasNumbers = signals.numberAdvantage >= 0;
  const hasVision = signals.visionQuality === 'good' || signals.visionQuality === 'decent';

  const positiveFactors: string[] = [];
  if (hasPush) positiveFactors.push('Wave is in a good state');
  if (hasNumbers) positiveFactors.push('Number advantage or even');
  if (hasVision) positiveFactors.push('Vision around objective');
  positiveFactors.push(`${signals.objectiveName} spawning soon`);

  // Need at least objective + wave push + numbers to recommend rotate
  if (hasPush && hasNumbers) {
    const confidence = Math.min(1, 0.6 + (hasVision ? 0.15 : 0) + (signals.numberAdvantage > 0 ? 0.15 : 0));

    return {
      situation: `${signals.objectiveName} is spawning soon`,
      signals: positiveFactors,
      conclusion: 'You can contest the objective',
      action: `Push wave and rotate to ${signals.objectiveName}`,
      confidence,
      category: 'objective',
    };
  }

  // Objective spawning but conditions not ideal
  if (signals.objectiveSpawningSoon && !hasNumbers) {
    return {
      situation: `${signals.objectiveName} is spawning but you are outnumbered`,
      signals: [
        `${signals.objectiveName} spawning soon`,
        ...signalScores.filter((s) => s.aggressive <= -0.5).map((s) => s.label),
      ],
      conclusion: 'Cannot contest safely',
      action: `Give ${signals.objectiveName} and get a trade (tower, farm, or vision)`,
      confidence: 0.6,
      category: 'objective',
    };
  }

  return null;
}

function buildRoamReasoning(
  signals: GameSignals,
  _signalScores: SignalScore[]
): CoachingReasoning | null {
  // Roam reasoning: wave pushed + level advantage + no immediate danger
  const wavePushed = signals.waveState === 'pushing_to_enemy';
  const hasAdvantage = signals.levelAdvantage >= 1 || signals.itemAdvantage > 300;
  const isSafe = signals.visionQuality !== 'blind' && signals.myHPPercent > 60;
  const midGame = signals.gameTime >= 600; // 10 min+

  if (wavePushed && hasAdvantage && isSafe && midGame) {
    const signalLabels: string[] = ['Wave pushed to enemy tower'];
    if (signals.levelAdvantage >= 1) signalLabels.push(`${signals.levelAdvantage} level advantage`);
    if (signals.itemAdvantage > 300) signalLabels.push(`${signals.itemAdvantage}g item lead`);
    signalLabels.push('HP is healthy for a roam');

    return {
      situation: 'Wave is crashing and you have an advantage',
      signals: signalLabels,
      conclusion: 'Good roam timing — enemy laner will lose CS to tower',
      action: 'Roam to help a side lane or invade enemy jungle',
      confidence: 0.7,
      category: 'roam',
    };
  }

  return null;
}

function buildRecallReasoning(
  signals: GameSignals,
  _signalScores: SignalScore[]
): CoachingReasoning | null {
  const isLowHP = signals.myHPPercent < 35;
  const wavePushed = signals.waveState === 'pushing_to_enemy';
  const noDanger = signals.numberAdvantage >= 0;

  if (isLowHP && wavePushed) {
    return {
      situation: 'You are low HP and the wave is pushing away',
      signals: [
        `HP at ${Math.round(signals.myHPPercent)}%`,
        'Wave pushed to enemy side',
        noDanger ? 'No immediate threat' : 'Enemies may be nearby',
      ],
      conclusion: 'Staying risks a death for no gain',
      action: 'Recall now — the wave will reset by the time you return',
      confidence: isLowHP ? 0.9 : 0.7,
      category: 'recall',
    };
  }

  // Recall after big item threshold
  if (signals.myHPPercent < 50 && signals.itemAdvantage < -800) {
    return {
      situation: 'You are low and behind on items',
      signals: [
        `HP at ${Math.round(signals.myHPPercent)}%`,
        `${Math.abs(signals.itemAdvantage)}g behind in items`,
      ],
      conclusion: 'You need to buy to stay competitive',
      action: 'Push the wave and recall for items',
      confidence: 0.75,
      category: 'recall',
    };
  }

  return null;
}

function buildTeamfightReasoning(
  signals: GameSignals,
  signalScores: SignalScore[]
): CoachingReasoning | null {
  // Teamfight context: mid-late game + number advantage + objective up
  const isLateEnough = signals.gameTime >= 900; // 15 min+
  if (!isLateEnough) return null;

  if (signals.numberAdvantage >= 1 && signals.objectiveSpawningSoon) {
    const reasons: string[] = [
      `${signals.numberAdvantage} player advantage`,
    ];
    if (signals.objectiveName) reasons.push(`${signals.objectiveName} is up`);
    if (signals.enemyUltDown) reasons.push('Enemy key ultimate is down');
    if (signals.enemyFlashDown) reasons.push('Enemy carry has no Flash');

    return {
      situation: 'Number advantage near an objective',
      signals: reasons,
      conclusion: 'You should force a fight — conditions are in your favor',
      action: 'Group and force a teamfight before the enemy respawns',
      confidence: Math.min(1, 0.65 + signals.numberAdvantage * 0.1),
      category: 'teamfight',
    };
  }

  // Avoid teamfight when behind
  if (signals.numberAdvantage <= -1) {
    return {
      situation: 'You are outnumbered',
      signals: signalScores.filter((s) => s.aggressive <= -0.5).map((s) => s.label),
      conclusion: 'Fighting now is suicide — wait for your team',
      action: 'Do not engage. Wait for teammates or find a pick',
      confidence: 0.8,
      category: 'teamfight',
    };
  }

  return null;
}

function buildDangerReasoning(
  signals: GameSignals,
  _signalScores: SignalScore[]
): CoachingReasoning | null {
  // DANGER: enemy missing + no vision
  const enemyMissing = !signals.jungleSide && signals.jungleConfidence < 0.3;
  const noVision = signals.visionQuality === 'blind' || signals.visionQuality === 'poor';

  if (enemyMissing && noVision) {
    const dangerSignals: string[] = [
      'Enemy jungler position unknown',
      `Vision quality: ${signals.visionQuality}`,
    ];
    if (signals.waveState === 'pushing_to_enemy') {
      dangerSignals.push('You are pushed up');
    }

    return {
      situation: 'Enemies are missing and you have no vision',
      signals: dangerSignals,
      conclusion: 'You could be walking into a gank or collapse',
      action: 'Back off and place a ward before doing anything aggressive',
      confidence: 0.85,
      category: 'safety',
    };
  }

  return null;
}

// ── Situation Description Helper ────────────────────────────────────────────

function describeSituation(signals: GameSignals, tone: 'aggressive' | 'defensive'): string {
  const parts: string[] = [];

  if (signals.jungleSide && signals.jungleConfidence > 0.5) {
    parts.push(`enemy jungler is ${signals.jungleSide} side`);
  }

  if (signals.levelAdvantage > 0) {
    parts.push(`you are ${signals.levelAdvantage} level(s) up`);
  } else if (signals.levelAdvantage < 0) {
    parts.push(`you are ${Math.abs(signals.levelAdvantage)} level(s) down`);
  }

  if (signals.enemyHPLow) {
    parts.push('enemy is low HP');
  }

  if (tone === 'defensive' && signals.myHPPercent < 50) {
    parts.push(`you are at ${Math.round(signals.myHPPercent)}% HP`);
  }

  if (parts.length === 0) {
    return tone === 'aggressive'
      ? 'Multiple factors favor you'
      : 'Multiple factors are against you';
  }

  // Capitalize first letter of first part
  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return parts.join(', ');
}

// ── Main Reasoning Builder ──────────────────────────────────────────────────

/**
 * Takes raw game signals and produces a reasoning chain.
 * Returns the highest-confidence reasoning, or null if no clear action emerges.
 */
export function buildReasoning(signals: GameSignals): CoachingReasoning | null {
  const signalScores = collectSignalScores(signals);

  // Build all candidate reasonings
  const candidates: (CoachingReasoning | null)[] = [
    // Danger is checked first — survival always trumps aggression
    buildDangerReasoning(signals, signalScores),
    buildRecallReasoning(signals, signalScores),
    buildSafetyReasoning(signals, signalScores),
    buildTeamfightReasoning(signals, signalScores),
    buildObjectiveReasoning(signals, signalScores),
    buildTradeReasoning(signals, signalScores),
    buildRoamReasoning(signals, signalScores),
  ];

  // Filter out nulls and pick the highest confidence
  const valid = candidates.filter((c): c is CoachingReasoning => c !== null);

  if (valid.length === 0) return null;

  // Priority order: safety > recall > teamfight/objective > trade > roam
  // If multiple have similar confidence, prefer safety categories
  const categoryPriority: Record<string, number> = {
    safety: 6,
    recall: 5,
    teamfight: 4,
    objective: 3,
    trade: 2,
    roam: 1,
  };

  valid.sort((a, b) => {
    // Strong confidence difference wins
    const confDiff = b.confidence - a.confidence;
    if (Math.abs(confDiff) > 0.2) return confDiff;

    // Otherwise, prefer safety-oriented categories
    return (categoryPriority[b.category] ?? 0) - (categoryPriority[a.category] ?? 0);
  });

  return valid[0];
}

// ── Adaptive Coaching: Player Focus ─────────────────────────────────────────

/**
 * Maps a player weakness type from the profile system to a broad coaching
 * focus category and objective.
 */
const WEAKNESS_TO_FOCUS: Record<WeaknessType, { focus: string; objective: string }> = {
  farming: {
    focus: 'farming',
    objective: 'Hit 7 CS/min this game',
  },
  dying_to_ganks: {
    focus: 'vision',
    objective: 'Ward river before every aggressive push',
  },
  solo_deaths: {
    focus: 'positioning',
    objective: 'Zero solo deaths this game',
  },
  vision: {
    focus: 'vision',
    objective: 'Buy a control ward every back',
  },
  kill_participation: {
    focus: 'macro',
    objective: 'Rotate to at least 2 skirmishes this game',
  },
  overaggression: {
    focus: 'positioning',
    objective: 'Die less than 4 times this game',
  },
  passivity: {
    focus: 'macro',
    objective: 'Look for a roam or TP play every 3 minutes',
  },
  late_game_deaths: {
    focus: 'positioning',
    objective: 'Stay with your team after 20 minutes',
  },
  early_game_deaths: {
    focus: 'positioning',
    objective: 'Survive laning phase with 0-1 deaths',
  },
};

/**
 * Maps broad coaching focus areas to the tip categories they boost.
 */
const FOCUS_TO_TIP_CATEGORIES: Record<string, TipCategory[]> = {
  farming: ['farming'],
  vision: ['vision', 'jungle'],
  positioning: ['positioning', 'teamfight', 'matchup'],
  macro: ['objective', 'macro', 'recall'],
};

/**
 * Determine the player's coaching focus from their profile.
 * Uses the most severe weakness to set the primary focus.
 */
export function getPlayerFocus(profile: PlayerProfile): PlayerFocus {
  const severityScore: Record<string, number> = {
    severe: 3,
    moderate: 2,
    mild: 1,
  };

  // Default focus if no weaknesses detected
  if (profile.weaknesses.length === 0) {
    return {
      primaryWeakness: 'general',
      focusObjective: 'Play consistently and minimize mistakes',
      tipWeightModifiers: {},
    };
  }

  // Sort weaknesses by severity (most severe first)
  const sorted = [...profile.weaknesses].sort(
    (a, b) => (severityScore[b.severity] ?? 0) - (severityScore[a.severity] ?? 0)
  );

  const primary = sorted[0];
  const focusInfo = WEAKNESS_TO_FOCUS[primary.type] ?? {
    focus: 'general',
    objective: 'Focus on fundamentals',
  };

  // Build tip weight modifiers: boost categories related to weaknesses
  const tipWeightModifiers: Record<string, number> = {};

  for (const weakness of profile.weaknesses) {
    const wFocus = WEAKNESS_TO_FOCUS[weakness.type];
    if (!wFocus) continue;

    const categories = FOCUS_TO_TIP_CATEGORIES[wFocus.focus] ?? [];
    const boostAmount = severityScore[weakness.severity] ?? 1;
    // severe = +30, moderate = +20, mild = +10
    const priorityBoost = boostAmount * 10;

    for (const cat of categories) {
      tipWeightModifiers[cat] = (tipWeightModifiers[cat] ?? 0) + priorityBoost;
    }
  }

  return {
    primaryWeakness: focusInfo.focus,
    focusObjective: focusInfo.objective,
    tipWeightModifiers,
  };
}

// ── Tip Priority Adjustment ─────────────────────────────────────────────────

/**
 * Adjusts a coaching tip's priority score based on the player's focus areas.
 * Base scores: danger=100, warning=60, info=30.
 * The focus modifiers are added on top, so weak-area tips bubble to the top.
 */
export function adjustTipPriority(tip: CoachingTip, focus: PlayerFocus): number {
  const basePriority: Record<string, number> = {
    danger: 100,
    warning: 60,
    info: 30,
  };

  let score = basePriority[tip.priority] ?? 30;

  // Add the focus-specific boost for this tip's category
  const categoryBoost = focus.tipWeightModifiers[tip.category] ?? 0;
  score += categoryBoost;

  // Extra boost if the tip directly matches the primary weakness area
  const primaryCategories = FOCUS_TO_TIP_CATEGORIES[focus.primaryWeakness] ?? [];
  if (primaryCategories.includes(tip.category)) {
    score += 20;
  }

  return score;
}

// ── Game Start Focus Message ────────────────────────────────────────────────

/**
 * Generates the focus message announced at game start based on the player's profile.
 * Tells the player exactly what to concentrate on this game.
 */
export function getGameStartFocusMessage(profile: PlayerProfile): string {
  const focus = getPlayerFocus(profile);

  if (focus.primaryWeakness === 'general') {
    return 'No major weaknesses detected. Play your game and stay focused on the fundamentals.';
  }

  const weaknessLabels: Record<string, string> = {
    farming: 'your CS',
    vision: 'your vision control',
    positioning: 'your positioning and survival',
    macro: 'your map presence and macro decisions',
  };

  const label = weaknessLabels[focus.primaryWeakness] ?? focus.primaryWeakness;

  let message = `This game focus: improve ${label}. Goal: ${focus.focusObjective}.`;

  // Add context from the profile trend
  if (profile.improvementTrend === 'improving') {
    message += ' You have been improving recently — keep it up.';
  } else if (profile.improvementTrend === 'declining') {
    message += ' Your recent games show a dip. Reset your mentality and focus on this one thing.';
  }

  // Add a secondary weakness hint if there is one
  if (profile.weaknesses.length >= 2) {
    const secondary = profile.weaknesses[1];
    const secondaryFocus = WEAKNESS_TO_FOCUS[secondary.type];
    if (secondaryFocus && secondaryFocus.focus !== focus.primaryWeakness) {
      message += ` Secondary focus: ${secondaryFocus.objective}.`;
    }
  }

  return message;
}

// ── Death Pattern Message ───────────────────────────────────────────────────

/**
 * When the player dies, check if the death matches a known weakness pattern.
 * If so, return a targeted coaching message. Otherwise returns null.
 *
 * @param deathCause - A string identifier for the death type
 *   (e.g., "ganked_no_vision", "solo_killed_bad_trade", "caught_rotating", etc.)
 * @param profile - The player's profile with weakness data
 */
export function getDeathPatternMessage(
  deathCause: string,
  profile: PlayerProfile
): string | null {
  const weaknessTypes = new Set(profile.weaknesses.map((w) => w.type));

  // Gank death + known gank weakness
  if (
    (deathCause === 'ganked_no_vision' || deathCause === 'ganked_overextended') &&
    weaknessTypes.has('dying_to_ganks')
  ) {
    return 'This is your pattern — you died to a gank again. Ward before pushing and track the enemy jungler on the minimap.';
  }

  // Solo death + known solo death weakness
  if (
    deathCause.startsWith('solo_killed') &&
    weaknessTypes.has('solo_deaths')
  ) {
    return 'This is your pattern — another solo death. Only fight when you have a clear advantage. If unsure, just farm.';
  }

  // Caught out + known overaggression
  if (
    (deathCause === 'caught_rotating' || deathCause === 'ganked_overextended') &&
    weaknessTypes.has('overaggression')
  ) {
    return 'This is your pattern — caught too far forward. You tend to overextend. Play closer to your team and check the map.';
  }

  // Tower dive death + overaggression
  if (
    deathCause === 'dove_under_tower' &&
    weaknessTypes.has('overaggression')
  ) {
    return 'This is your pattern — risky tower dive. Your profile shows overaggression. Not every kill is worth the risk.';
  }

  // Teamfight positioning death + late game death weakness
  if (
    (deathCause === 'teamfight_bad_positioning' || deathCause === 'teamfight_focused') &&
    weaknessTypes.has('late_game_deaths')
  ) {
    return 'This is your pattern — dying in teamfights late. Stay further back, let your frontline engage first, and save your mobility for dodging.';
  }

  // Early death + early game death weakness
  if (
    deathCause.startsWith('solo_killed') &&
    weaknessTypes.has('early_game_deaths')
  ) {
    return 'This is your pattern — dying early in lane. Respect the enemy power spikes and farm safely until you have an item advantage.';
  }

  // Vision-related death + vision weakness
  if (
    deathCause === 'ganked_no_vision' &&
    weaknessTypes.has('vision')
  ) {
    return 'This is your pattern — dying without vision. Buy a control ward every recall and ward the river before pushing past the halfway point.';
  }

  // No pattern match
  return null;
}
