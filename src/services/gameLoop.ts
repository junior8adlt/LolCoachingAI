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

  const analysisResult = analyzeGameState(data, previousEvents);

  store.updateFarmingStats(analysisResult.farmingStats);
  store.updateThreats(analysisResult.threats);
  store.updateObjectives(analysisResult.objectives);

  // Only push DANGER-level tips from the old analyzer (not the repetitive info/warnings)
  for (const tip of analysisResult.tips) {
    if (tip.priority === 'danger') {
      store.addCoachingTip(tip);
      speakTip(tip);
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
    store.addCoachingTip(jglTip);
    speakTip(jglTip);
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
    store.addCoachingTip(waveTip);
    speakTip(waveTip);
  }

  // Wave-aware recall suggestion
  const waveRecall = shouldRecallBasedOnWave(
    waveInfo,
    data.activePlayer.currentGold,
    data.activePlayer.championStats.currentHealth / data.activePlayer.championStats.maxHealth
  );
  if (waveRecall.canRecall && data.activePlayer.currentGold >= 1000) {
    const recallTip = {
      id: `wave-recall-${Date.now()}`,
      message: waveRecall.reason,
      priority: 'info' as const,
      category: 'recall' as const,
      timestamp: Date.now(),
      dismissed: false,
    };
    store.addCoachingTip(recallTip);
  }

  // ── Vision Awareness ──
  const visionAnalysis = analyzeVision(data, junglePrediction, gameTime);
  for (const vTip of visionAnalysis.tips) {
    store.addCoachingTip(vTip);
    speakTip(vTip);
  }

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
    store.addCoachingTip(tip);
    speakTip(tip);

    // Check for death patterns (repeated mistakes)
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
      store.addCoachingTip(profileTip);
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
        const tip = {
          id: `champ-spike-${Date.now()}`,
          message: spikeTip,
          priority: 'info' as const,
          category: 'matchup' as const,
          timestamp: now,
          dismissed: false,
        };
        store.addCoachingTip(tip);
        speakTip(tip);
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

  // ── Smart Coach (the brain - opportunities, fights, builds) ──
  const smartTips = getSmartCoachingTips(data, junglePrediction);
  for (const tip of smartTips) {
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
