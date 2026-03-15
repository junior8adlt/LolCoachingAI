import { useGameStore } from '../stores/gameStore';
import { getAllGameData, isGameRunning } from './riotApi';
import { analyzeGameState } from './gameAnalyzer';
import { getCoachingAdvice, getMatchupAnalysis, generatePostGameCoaching, checkBackendSource } from './aiCoach';
import { updateTracking, getJungleCoachingTip } from './jungleTracker';
import { updateWaveState, getWaveCoachingTip, shouldRecallBasedOnWave } from './waveEngine';
import { saveGameRecord, getProfileBasedTip, getPlayerProfile, classifyDeathCause } from './playerProfile';
import { analyzeVision } from './visionTracker';
import { analyzePlayerDeath, detectDeathPatterns, type DeathAnalysisResult } from './deathAnalyzer';
import { getChampionPowerSpikeTip, getChampionTradingTip, getChampionCoaching, getChampionCombo } from '../data/championCoaching';
import { getChampionMechanics } from '../data/championMechanics';
import { getSmartCoachingTips } from './smartCoach';
import { detectPhase } from './gamePhaseEngine';
import { generateThreatWarnings, getMatchupFightContext } from './threatModel';
import { getObjectiveRotationTips, getTeamfightTips, getDiveTip, getRotationTip } from './macroCoach';
import { getGameAwarenessTips } from './gameAwareness';
import { predictEnemyIntents, getHighestThreatIntent, generateIntentTip } from './intentEngine';
import { evaluateCombat, generateCombatTip } from './combatEvaluator';
import { updateTeamfightState, generateTeamfightTip } from './teamfightEngine';
import { analyzeStrategy, generateStrategyTip } from './winConditionEngine';
import { assessPosition, generatePositionTip } from './positioningEngine';
import { buildGameContext, getRotationCall, generateRotationTip } from './gameContext';
import { updateRoamTracking, getRoamPredictions, generateRoamTip } from './roamPredictor';
import { detectTempoAdvantage, generateTempoTip } from './tempoEngine';
import { generateDamageTip, calculateDamage, predictFightOutcome, generateFightPredictionTip, getObjectiveSetup, generateObjectiveSetupTip } from './damageModel';
import { updateCooldowns, getKillWindow } from './cooldownTracker';
import { getEnemyHPEstimate, isEnemyLow, isEnemyVeryLow, initScreenReader } from './screenReader';
import { pickBestAdvice, setGameStartTime } from './advicePriority';
import { speakTip, speakRaw } from './voiceCoach';
import { t } from './i18n';
import type { AllGameData, GameEvent } from '../types/game';
import type { GamePhase } from '../types/coaching';

const POLL_INTERVAL = 1500;
const AI_COACH_INTERVAL = 5000;

let pollTimerId: ReturnType<typeof setInterval> | null = null;
let aiCoachTimerId: ReturnType<typeof setInterval> | null = null;
let previousEvents: GameEvent[] = [];
let wasGameRunning = false;
let lastAICoachTime = 0;
let latestGameData: AllGameData | null = null;
let processedDeathEvents: Set<number> = new Set();
let deathAnalyses: DeathAnalysisResult[] = [];
let lastPlayerLevel = 0;
let lastChampionTipTime = 0;
let lastItemCount = 0; // Track completed items for item spike detection

function determineGamePhase(gameTime: number): GamePhase {
  if (gameTime <= 0) return 'LOADING';
  if (gameTime < 900) return 'EARLY_GAME';
  if (gameTime < 1800) return 'MID_GAME';
  return 'LATE_GAME';
}

function notifyElectron(event: string): void {
  const api = (window as unknown as Record<string, unknown>).electronAPI as
    | { forceOverlayShow?: () => Promise<void>; forceOverlayHide?: () => Promise<void> }
    | undefined;
  if (event === 'game-start' && api?.forceOverlayShow) {
    api.forceOverlayShow();
  }
}

function onGameStart(): void {
  const store = useGameStore.getState();
  store.reset();
  store.setGamePhase('LOADING');
  store.setAIState({ status: 'analyzing', currentThought: 'Game detected. Initializing analysis...', reasoningChain: [] });

  // Force overlay visible and on top
  if (!store.overlayVisible) store.toggleOverlay();
  notifyElectron('game-start');
  initScreenReader();
  setGameStartTime(Date.now());

  previousEvents = [];
  lastAICoachTime = 0;
  latestGameData = null;
  processedDeathEvents = new Set();
  deathAnalyses = [];
  lastPlayerLevel = 0;
  lastChampionTipTime = 0;
  wasGameRunning = true;

  speakRaw(t('ui_analyzing_matchup'));
  console.log('[GameLoop] Game started. Initializing coaching session.');
}

async function onGameEnd(): Promise<void> {
  const store = useGameStore.getState();
  store.setGamePhase('POST_GAME');
  store.setAIState({ status: 'analyzing', currentThought: 'Generating post-game report...' });

  if (latestGameData) {
    // Save game record for player profile learning
    try {
      const ap = latestGameData.activePlayer;
      const mp = latestGameData.allPlayers.find((p) => p.summonerName === ap.summonerName);
      if (mp) {
        const teamKills = latestGameData.allPlayers
          .filter((p) => p.team === mp.team)
          .reduce((sum, p) => sum + p.scores.kills, 0);
        const duration = latestGameData.gameData.gameTime;
        const deaths = latestGameData.events.Events
          .filter((e) => e.EventName === 'ChampionKill' && e.VictimName === ap.summonerName);

        saveGameRecord({
          timestamp: Date.now(),
          champion: mp.championName,
          role: mp.position || 'NONE',
          duration,
          kills: mp.scores.kills,
          deaths: mp.scores.deaths,
          assists: mp.scores.assists,
          cs: mp.scores.creepScore,
          csPerMin: duration > 0 ? mp.scores.creepScore / (duration / 60) : 0,
          visionScore: mp.scores.wardScore,
          win: false, // Can't determine from API easily
          deathCauses: deaths.map((d) => classifyDeathCause(d, latestGameData!.allPlayers)),
          farmingEfficiency: store.farmingStats?.efficiency ?? 0,
          killParticipation: teamKills > 0
            ? ((mp.scores.kills + mp.scores.assists) / teamKills) * 100
            : 0,
        });
      }
    } catch (e) {
      console.error('[GameLoop] Failed to save game record:', e);
    }

    try {
      const analysis = await generatePostGameCoaching(latestGameData);
      store.setPostGameAnalysis(analysis);
      store.setAIState({ status: 'idle', currentThought: 'Post-game report ready.' });
    } catch (error) {
      console.error('[GameLoop] Failed to generate post-game report:', error);
      store.setAIState({ status: 'idle', currentThought: 'Failed to generate post-game report.' });
    }
  }

  wasGameRunning = false;
  latestGameData = null;
  console.log('[GameLoop] Game ended. Post-game report generated.');
}

async function processGameState(data: AllGameData): Promise<void> {
  const store = useGameStore.getState();

  store.updateGameData(data);

  const gameTime = data.gameData.gameTime;
  const phase = determineGamePhase(gameTime);
  if (store.gamePhase !== phase && phase !== 'LOADING') {
    store.setGamePhase(phase);
  }

  // Collect ALL candidate tips, then the priority engine picks the best
  const allCandidateTips: import('../types/coaching').CoachingTip[] = [];

  const analysisResult = analyzeGameState(data, previousEvents);

  store.updateFarmingStats(analysisResult.farmingStats);
  store.updateThreats(analysisResult.threats);
  store.updateObjectives(analysisResult.objectives);

  // Only danger tips from old analyzer go to candidates
  for (const tip of analysisResult.tips) {
    if (tip.priority === 'danger') {
      allCandidateTips.push(tip);
    }
  }

  // ── Jungle Tracking ──
  const junglePrediction = updateTracking(
    data.events.Events,
    gameTime,
    data.allPlayers
  );
  store.updateJunglePrediction(junglePrediction);

  // Jungle coaching tip
  const myPlayer = data.allPlayers.find(
    (p) => p.summonerName === data.activePlayer.summonerName
  );
  const playerPos = myPlayer?.position?.toUpperCase();
  const playerSide = playerPos === 'TOP' ? 'top' as const :
    (playerPos === 'BOTTOM' || playerPos === 'UTILITY') ? 'bot' as const : 'mid' as const;

  const jglTip = getJungleCoachingTip(junglePrediction, gameTime, playerSide);
  if (jglTip) {
    allCandidateTips.push(jglTip);
  }

  // ── Wave Engine ──
  const prevCS = previousEvents.length > 0 ? (store.farmingStats?.currentCS ?? 0) : 0;
  const prevTime = previousEvents.length > 0 ? (latestGameData?.gameData.gameTime ?? 0) : 0;

  const myTeam = myPlayer?.team;
  const laneOpponent = myPlayer && myTeam ? data.allPlayers.find(
    (p) => p.team !== myTeam && p.position === myPlayer.position
  ) : undefined;

  const waveInfo = updateWaveState(
    gameTime,
    analysisResult.farmingStats.currentCS,
    prevCS,
    prevTime,
    data.events.Events,
    myPlayer?.isDead ?? false,
    laneOpponent?.isDead ?? false,
    data.activePlayer.summonerName,
    laneOpponent?.summonerName
  );

  const waveTip = getWaveCoachingTip(waveInfo, gameTime, store.objectives);
  if (waveTip) {
    allCandidateTips.push(waveTip);
  }

  // Wave-aware recall suggestion
  const waveRecall = shouldRecallBasedOnWave(
    waveInfo,
    data.activePlayer.currentGold,
    data.activePlayer.championStats.currentHealth / data.activePlayer.championStats.maxHealth
  );
  if (waveRecall.canRecall && data.activePlayer.currentGold >= 1000) {
    allCandidateTips.push({
      id: `wave-recall-${Date.now()}`,
      message: waveRecall.reason,
      priority: 'info' as const,
      category: 'recall' as const,
      timestamp: Date.now(),
      dismissed: false,
    });
  }

  // ── Vision Awareness ──
  const visionAnalysis = analyzeVision(data, junglePrediction, gameTime);
  allCandidateTips.push(...visionAnalysis.tips);

  // ── Death Analysis ──
  const myDeaths = data.events.Events.filter(
    (e) => e.EventName === 'ChampionKill' &&
      e.VictimName === data.activePlayer.summonerName &&
      !processedDeathEvents.has(e.EventID)
  );

  for (const deathEvent of myDeaths) {
    processedDeathEvents.add(deathEvent.EventID);
    const { analysis, tip } = analyzePlayerDeath(
      deathEvent,
      data.allPlayers,
      data.activePlayer,
      data.events.Events,
      junglePrediction,
      gameTime
    );
    deathAnalyses.push(analysis);
    // Death analysis goes directly - it's event-driven and always important
    store.addCoachingTip(tip);
    speakTip(tip);

    const patternTip = detectDeathPatterns(deathAnalyses, gameTime);
    if (patternTip) {
      store.addCoachingTip(patternTip);
      speakTip(patternTip);
    }
  }

  // ── Player Profile Tips ──
  const profile = getPlayerProfile();
  if (profile.gamesPlayed >= 2) {
    const profileTip = getProfileBasedTip(
      profile,
      gameTime,
      {
        cs: analysisResult.farmingStats.currentCS,
        deaths: myPlayer?.scores.deaths ?? 0,
        visionScore: myPlayer?.scores.wardScore ?? 0,
      }
    );
    if (profileTip) {
      allCandidateTips.push(profileTip);
    }
  }

  // ── Matchup Analysis ──
  if (!store.matchupInfo && gameTime > 30) {
    if (myPlayer && myPlayer.position && laneOpponent) {
      try {
        const matchup = await getMatchupAnalysis(
          myPlayer.championName,
          laneOpponent.championName,
          myPlayer.position
        );
        store.setMatchupInfo(matchup);
      } catch {
        // Matchup analysis not critical
      }
    }
  }

  // ── Champion-Specific Coaching ──
  const now = Date.now();
  const myChampion = myPlayer?.championName;
  const currentLevel = data.activePlayer.level;

  if (myChampion) {
    // Power spike notification when leveling up
    if (currentLevel > lastPlayerLevel && lastPlayerLevel > 0) {
      const spikeTip = getChampionPowerSpikeTip(myChampion, currentLevel);
      if (spikeTip) {
        allCandidateTips.push({
          id: `champ-spike-${Date.now()}`,
          message: spikeTip,
          priority: 'info' as const,
          category: 'matchup' as const,
          timestamp: now,
          dismissed: false,
        });
      }

      // At key levels, also give combo reminder
      if ([2, 3, 6].includes(currentLevel)) {
        const combo = getChampionCombo(myChampion);
        if (combo) {
          store.addCoachingTip({
            id: `champ-combo-${now}`,
            message: `Your combo: ${combo}`,
            priority: 'info' as const,
            category: 'matchup' as const,
            timestamp: now,
            dismissed: false,
          });
        }
      }
    }
    lastPlayerLevel = currentLevel;

    // ── Item completion detection ──
    const currentItemCount = myPlayer ? myPlayer.items.filter((i: { price: number }) => i.price >= 2500).length : 0;
    if (currentItemCount > lastItemCount && lastItemCount >= 0 && myPlayer) {
      const newItem = myPlayer.items
        .filter((i: { price: number }) => i.price >= 2500)
        .sort((a: { price: number }, b: { price: number }) => b.price - a.price)[0];
      if (newItem) {
        allCandidateTips.push({
          id: `item-spike-${now}`,
          message: `${newItem.displayName} completed! You just power spiked. Look for a fight or objective.`,
          priority: 'warning' as const,
          category: 'trading' as const,
          timestamp: now,
          dismissed: false,
        });
      }
    }
    lastItemCount = currentItemCount;

    // Rotating champion tips: trading → mechanics → strategy (every 60s during laning)
    if (gameTime < 900 && now - lastChampionTipTime > 60000) {
      const tipCycle = Math.floor(gameTime / 60) % 3;
      let tipMessage: string | null = null;

      if (tipCycle === 0) {
        // Trading pattern
        tipMessage = getChampionTradingTip(myChampion, gameTime);
      } else if (tipCycle === 1) {
        // Mechanical tip
        const mechanics = getChampionMechanics(myChampion);
        if (mechanics) {
          const allMechTips = [
            ...mechanics.animationCancels,
            ...mechanics.spacingTricks,
            ...mechanics.advancedTips,
          ];
          if (allMechTips.length > 0) {
            tipMessage = allMechTips[Math.floor(Math.random() * allMechTips.length)];
          }
        }
      } else {
        // Common mistake warning
        const coaching = getChampionCoaching(myChampion);
        if (coaching && coaching.commonMistakes.length > 0) {
          tipMessage = `Avoid: ${coaching.commonMistakes[Math.floor(Math.random() * coaching.commonMistakes.length)]}`;
        }
      }

      if (tipMessage) {
        store.addCoachingTip({
          id: `champ-tip-${now}`,
          message: tipMessage,
          priority: 'info' as const,
          category: 'matchup' as const,
          timestamp: now,
          dismissed: false,
        });
        lastChampionTipTime = now;
      }
    }

    // Mid/late game strategy reminder (once per phase transition)
    if (gameTime >= 900 && gameTime < 920) {
      const coaching = getChampionCoaching(myChampion);
      if (coaching) {
        const tip = {
          id: `champ-midgame-${now}`,
          message: coaching.midGame,
          priority: 'info' as const,
          category: 'macro' as const,
          timestamp: now,
          dismissed: false,
        };
        store.addCoachingTip(tip);
        speakTip(tip);
      }
    }
    if (gameTime >= 1800 && gameTime < 1820) {
      const coaching = getChampionCoaching(myChampion);
      if (coaching) {
        const tip = {
          id: `champ-lategame-${now}`,
          message: coaching.lateGame,
          priority: 'info' as const,
          category: 'macro' as const,
          timestamp: now,
          dismissed: false,
        };
        store.addCoachingTip(tip);
        speakTip(tip);
      }
    }
  }

  // ── Game Phase Detection ──
  const phaseInfo = detectPhase(
    gameTime,
    data.events.Events,
    myPlayer,
    laneOpponent,
    data.allPlayers,
    store.objectives
  );
  // Phase context available for all downstream systems
  console.log(`[Phase] ${phaseInfo.phase} (${phaseInfo.context})`);

  // ── Cooldown Tracking ──
  const enemies = data.allPlayers.filter((p) => p.team !== myPlayer?.team);
  updateCooldowns(data.events.Events, gameTime, enemies);

  // ── Enemy HP Detection (from screen capture) ──
  if (laneOpponent && !laneOpponent.isDead && gameTime > 120) {
    const hpReading = getEnemyHPEstimate();
    if (isEnemyVeryLow()) {
      allCandidateTips.push({
        id: `hp-kill-${Date.now()}`,
        message: `${laneOpponent.championName} is very low HP! Go for the kill NOW.`,
        priority: 'danger',
        category: 'trading',
        timestamp: Date.now(),
        dismissed: false,
      });
    } else if (isEnemyLow()) {
      const myHPPercent = data.activePlayer.championStats.currentHealth / data.activePlayer.championStats.maxHealth;
      if (myHPPercent > 0.4) {
        allCandidateTips.push({
          id: `hp-trade-${Date.now()}`,
          message: `${laneOpponent.championName} is low (~${Math.round(hpReading.healthPercent * 100)}% HP). You can trade aggressively or all-in.`,
          priority: 'warning',
          category: 'trading',
          timestamp: Date.now(),
          dismissed: false,
        });
      }
    }
  }

  // Kill window detection (cooldowns) - HIGHEST PRIORITY tip
  if (laneOpponent && !laneOpponent.isDead && gameTime > 120) {
    const killWindow = getKillWindow(laneOpponent.summonerName, gameTime);
    if (killWindow.hasWindow) {
      // This is a DANGER level tip - flash/ult down = real kill window
      allCandidateTips.push({
        id: `kw-${Date.now()}`,
        message: `${killWindow.reason} Play aggressive NOW.`,
        priority: 'danger' as const,
        category: 'trading' as const,
        timestamp: Date.now(),
        dismissed: false,
      });
    }
  }

  // ── Threat Model (champion-specific warnings) ──
  const threatTips = generateThreatWarnings(enemies, gameTime);
  allCandidateTips.push(...threatTips);

  // ── Matchup context (archetype-based fight advice) ──
  if (laneOpponent && gameTime > 90 && gameTime < 900) {
    const matchupCtx = getMatchupFightContext(
      myPlayer?.championName ?? '',
      laneOpponent.championName
    );
    if (matchupCtx) {
      allCandidateTips.push({
        id: `matchup-ctx-${Date.now()}`,
        message: matchupCtx,
        priority: 'info',
        category: 'matchup',
        timestamp: Date.now(),
        dismissed: false,
      });
    }
  }

  // ── Game Awareness Model (fight brewing, gank window, rotation, teamfight state) ──
  const awarenessTips = getGameAwarenessTips(
    gameTime,
    data.events.Events,
    data.allPlayers,
    myPlayer,
    store.objectives,
    junglePrediction
  );
  allCandidateTips.push(...awarenessTips);

  // ── Macro Coach (objectives, teamfights, rotations, dive safety) ──
  const objectiveTips = getObjectiveRotationTips(gameTime, store.objectives, myPlayer, data.allPlayers);
  allCandidateTips.push(...objectiveTips);

  const teamfightTips = getTeamfightTips(gameTime, data.allPlayers, myPlayer);
  allCandidateTips.push(...teamfightTips);

  const rotationTip = getRotationTip(gameTime, myPlayer, data.allPlayers);
  if (rotationTip) allCandidateTips.push(rotationTip);

  // ── Smart Coach (opportunities, fights, builds) ──
  const smartTips = getSmartCoachingTips(data, junglePrediction, waveInfo);
  allCandidateTips.push(...smartTips);

  // Dive safety warning (checks if smart coach suggests fight but it might be a dive)
  if (laneOpponent && !laneOpponent.isDead) {
    const myHPPercent = data.activePlayer.championStats.currentHealth / data.activePlayer.championStats.maxHealth;
    const fightTipExists = smartTips.some((t) => t.category === 'trading' && t.message.toLowerCase().includes('fight'));
    if (fightTipExists) {
      const diveTip = getDiveTip(myHPPercent, laneOpponent, true, gameTime);
      if (diveTip) allCandidateTips.push(diveTip);
    }
  }

  // ── Tempo Engine ──
  if (myPlayer && laneOpponent && gameTime > 90) {
    const tempo = detectTempoAdvantage(
      myPlayer, data.activePlayer, laneOpponent, data.allPlayers, gameTime, waveInfo
    );
    const tempoTip = generateTempoTip(tempo);
    if (tempoTip) allCandidateTips.push(tempoTip);
  }

  // ── Positioning Engine ──
  if (myPlayer && gameTime > 120) {
    // Pass recent death EVENTS (not analyses) for positioning
    const myDeathEvents = data.events.Events.filter(
      (e) => e.EventName === 'ChampionKill' && e.VictimName === data.activePlayer.summonerName
    );
    const posAssessment = assessPosition(
      myPlayer, data.activePlayer, waveInfo, junglePrediction,
      visionAnalysis, gameTime, myDeathEvents
    );
    const posTip = generatePositionTip(posAssessment);
    if (posTip) allCandidateTips.push(posTip);
  }

  // ── Roam Prediction ──
  updateRoamTracking(data.allPlayers, data.events.Events, gameTime);
  if (myPlayer && gameTime > 300) {
    const roamPredictions = getRoamPredictions(myPlayer, gameTime);
    for (const pred of roamPredictions) {
      const roamTip = generateRoamTip(pred);
      if (roamTip) { allCandidateTips.push(roamTip); break; } // Only top roam warning
    }
  }

  // ── Game Context + Rotation Engine ──
  if (myPlayer && gameTime > 600) {
    const ctx = buildGameContext(
      data.allPlayers, myPlayer, data.activePlayer,
      data.events.Events, gameTime, store.objectives, junglePrediction
    );
    const myRole = myPlayer.position?.toUpperCase() ?? 'MIDDLE';
    const rotation = getRotationCall(ctx, myRole, waveInfo.state as any);
    const rotTip = generateRotationTip(rotation);
    if (rotTip) allCandidateTips.push(rotTip);
  }

  // ── Damage Model / Kill Probability ──
  if (laneOpponent && !laneOpponent.isDead && gameTime > 120) {
    const enemyForDmg = {
      championName: laneOpponent.championName,
      level: laneOpponent.level,
      itemCount: laneOpponent.items.filter((i: { price: number }) => i.price >= 2500).length,
    };
    const dmgEstimate = calculateDamage(data.activePlayer, enemyForDmg);
    const dmgTip = generateDamageTip(dmgEstimate, laneOpponent.championName);
    if (dmgTip) allCandidateTips.push(dmgTip);
  }

  // ── Fight Outcome Predictor ──
  if (gameTime > 600) {
    const fightPred = predictFightOutcome(
      data.allPlayers, myPlayer?.team ?? 'ORDER', gameTime
    );
    const fightTip = generateFightPredictionTip(fightPred);
    if (fightTip) allCandidateTips.push(fightTip);
  }

  // ── Objective Setup Engine ──
  if (gameTime > 240) {
    const myRole = myPlayer?.position?.toUpperCase() ?? 'MIDDLE';
    const objSetup = getObjectiveSetup(store.objectives, gameTime, myRole);
    if (objSetup) {
      const objTip = generateObjectiveSetupTip(objSetup);
      if (objTip) allCandidateTips.push(objTip);
    }
  }

  // ── Intent Engine (predict enemy actions) ──
  if (gameTime > 120) {
    const intents = predictEnemyIntents(
      data.allPlayers, myPlayer!, data.events.Events, gameTime,
      store.objectives, junglePrediction
    );
    const topThreat = getHighestThreatIntent(intents);
    if (topThreat) {
      const intentTip = generateIntentTip(topThreat);
      if (intentTip) allCandidateTips.push(intentTip);
    }
  }

  // ── Combat Evaluator (kill probability) ──
  if (laneOpponent && !laneOpponent.isDead && myPlayer) {
    const combatResult = evaluateCombat(
      data.activePlayer, myPlayer, laneOpponent
    );
    const combatTip = generateCombatTip(combatResult, laneOpponent.championName);
    if (combatTip) allCandidateTips.push(combatTip);
  }

  // ── Teamfight Engine ──
  if (gameTime > 600) {
    const tfState = updateTeamfightState(
      data.events.Events, gameTime, data.allPlayers, myPlayer?.team ?? 'ORDER'
    );
    const tfTip = generateTeamfightTip(tfState, myPlayer?.championName ?? '');
    if (tfTip) allCandidateTips.push(tfTip);
  }

  // ── Win Condition Engine (strategy) ──
  if (gameTime > 300) {
    const strategy = analyzeStrategy(
      data.allPlayers, myPlayer?.team ?? 'ORDER',
      data.events.Events, gameTime, store.objectives
    );
    const stratTip = generateStrategyTip(strategy, gameTime);
    if (stratTip) allCandidateTips.push(stratTip);
  }

  // ── Priority Engine: pick THE BEST tip to show ──
  const bestTips = pickBestAdvice(allCandidateTips, 2); // max 2 tips at a time
  for (const tip of bestTips) {
    store.addCoachingTip(tip);
    speakTip(tip);
  }

  previousEvents = [...data.events.Events];
  latestGameData = data;
}

async function sendToAICoach(data: AllGameData): Promise<void> {
  const store = useGameStore.getState();
  const now = Date.now();

  if (now - lastAICoachTime < AI_COACH_INTERVAL) {
    return;
  }

  lastAICoachTime = now;
  const source = await checkBackendSource();
  store.setAIState({ status: 'thinking', currentThought: 'Analyzing game state...', source });

  try {
    const tips = await getCoachingAdvice(data);
    for (const tip of tips) {
      store.addCoachingTip(tip);
      speakTip(tip);
    }
    store.setAIState({ status: 'coaching', currentThought: 'Analysis complete.', source });
  } catch (error) {
    console.error('[GameLoop] AI coach error:', error);
    store.setAIState({ status: 'idle', currentThought: 'AI analysis unavailable.' });
  }

  setTimeout(() => {
    const current = useGameStore.getState().aiState;
    if (current.status === 'coaching') {
      store.setAIState({ status: 'idle', currentThought: '' });
    }
  }, 3000);
}

async function pollTick(): Promise<void> {
  try {
    const running = await isGameRunning();

    if (running && !wasGameRunning) {
      onGameStart();
    } else if (!running && wasGameRunning) {
      await onGameEnd();
      return;
    }

    if (!running) {
      return;
    }

    const store = useGameStore.getState();
    const lastEventId = store.lastEventId;
    const data = await getAllGameData(lastEventId >= 0 ? lastEventId : undefined);

    await processGameState(data);

    await sendToAICoach(data);
  } catch (error) {
    if (wasGameRunning) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Failed to connect') || errorMessage.includes('timed out')) {
        await onGameEnd();
      }
    }
  }
}

export function startPolling(): void {
  if (pollTimerId !== null) {
    console.log('[GameLoop] Already polling.');
    return;
  }

  console.log('[GameLoop] Starting game polling...');

  pollTick();

  pollTimerId = setInterval(() => {
    pollTick();
  }, POLL_INTERVAL);
}

export function stopPolling(): void {
  if (pollTimerId !== null) {
    clearInterval(pollTimerId);
    pollTimerId = null;
  }
  if (aiCoachTimerId !== null) {
    clearInterval(aiCoachTimerId);
    aiCoachTimerId = null;
  }
  wasGameRunning = false;
  previousEvents = [];
  latestGameData = null;
  console.log('[GameLoop] Polling stopped.');
}

export const gameLoop = {
  startPolling,
  stopPolling,
};
