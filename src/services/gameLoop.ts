import { useGameStore } from '../stores/gameStore';
import { getAllGameData, isGameRunning } from './riotApi';
import { analyzeGameState } from './gameAnalyzer';
import { getCoachingAdvice, getMatchupAnalysis, generatePostGameCoaching } from './aiCoach';
import { updateTracking } from './jungleTracker';
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

function determineGamePhase(gameTime: number): GamePhase {
  if (gameTime <= 0) return 'LOADING';
  if (gameTime < 900) return 'EARLY_GAME';
  if (gameTime < 1800) return 'MID_GAME';
  return 'LATE_GAME';
}

function onGameStart(): void {
  const store = useGameStore.getState();
  store.reset();
  store.setGamePhase('LOADING');
  store.setAIState({ status: 'analyzing', currentThought: 'Game detected. Initializing analysis...', reasoningChain: [] });

  previousEvents = [];
  lastAICoachTime = 0;
  latestGameData = null;
  wasGameRunning = true;

  console.log('[GameLoop] Game started. Initializing coaching session.');
}

async function onGameEnd(): Promise<void> {
  const store = useGameStore.getState();
  store.setGamePhase('POST_GAME');
  store.setAIState({ status: 'analyzing', currentThought: 'Generating post-game report...' });

  if (latestGameData) {
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

  for (const tip of analysisResult.tips) {
    store.addCoachingTip(tip);
  }

  const junglePrediction = updateTracking(
    data.events.Events,
    gameTime,
    data.allPlayers
  );
  store.updateJunglePrediction(junglePrediction);

  if (!store.matchupInfo && gameTime > 30) {
    const myPlayer = data.allPlayers.find(
      (p) => p.summonerName === data.activePlayer.summonerName
    );
    if (myPlayer && myPlayer.position) {
      const myTeam = myPlayer.team;
      const laneOpponent = data.allPlayers.find(
        (p) => p.team !== myTeam && p.position === myPlayer.position
      );
      if (laneOpponent) {
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
  store.setAIState({ status: 'thinking', currentThought: 'Analyzing game state...' });

  try {
    const tips = await getCoachingAdvice(data);
    for (const tip of tips) {
      store.addCoachingTip(tip);
    }
    store.setAIState({ status: 'coaching', currentThought: 'Analysis complete.' });
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
