import type { AllGameData } from '../types/game';
import type {
  CoachingTip,
  MatchupInfo,
  JunglePrediction,
  PostGameAnalysis,
  TipPriority,
  TipCategory,
} from '../types/coaching';
import { analyzeGameState, generatePostGameReport } from './gameAnalyzer';
import { getMatchupData } from '../data/matchups';

const BACKEND_URL = 'http://localhost:8420';
const REQUEST_TIMEOUT = 5000;

interface AIReasoningResponse {
  thoughts: string[];
  advice: string;
}

interface AICoachingResponse {
  tips: Array<{
    message: string;
    priority: TipPriority;
    category: TipCategory;
  }>;
}

interface AIMatchupResponse {
  yourChampion: string;
  enemyChampion: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tips: string[];
  powerSpikes: string[];
  laneSummary: string;
}

interface AIJungleResponse {
  predictedSide: 'top' | 'mid' | 'bot';
  confidence: number;
  lastSeen: number;
  gankRisk: number;
}

interface AIPostGameResponse {
  grades: PostGameAnalysis['grades'];
  keyMistakes: PostGameAnalysis['keyMistakes'];
  stats: PostGameAnalysis['stats'];
  improvementTips: string[];
  duration: number;
}

async function backendFetch<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

let tipIdCounter = 0;

function makeTip(
  message: string,
  priority: TipPriority,
  category: TipCategory
): CoachingTip {
  tipIdCounter += 1;
  return {
    id: `ai-tip-${Date.now()}-${tipIdCounter}`,
    message,
    priority,
    category,
    timestamp: Date.now(),
    dismissed: false,
  };
}

export async function getCoachingAdvice(
  gameState: AllGameData
): Promise<CoachingTip[]> {
  try {
    const available = await isBackendAvailable();
    if (available) {
      const response = await backendFetch<AICoachingResponse>('/api/coaching/advice', {
        activePlayer: gameState.activePlayer,
        allPlayers: gameState.allPlayers,
        events: gameState.events,
        gameData: gameState.gameData,
      });

      return response.tips.map((t) => makeTip(t.message, t.priority, t.category));
    }
  } catch {
    // Fall through to local analysis
  }

  const result = analyzeGameState(gameState);
  return result.tips;
}

export async function getMatchupAnalysis(
  yourChamp: string,
  enemyChamp: string,
  lane: string
): Promise<MatchupInfo> {
  try {
    const available = await isBackendAvailable();
    if (available) {
      const response = await backendFetch<AIMatchupResponse>(
        '/api/coaching/matchup',
        { yourChampion: yourChamp, enemyChampion: enemyChamp, lane }
      );
      return {
        yourChampion: response.yourChampion,
        enemyChampion: response.enemyChampion,
        difficulty: response.difficulty,
        tips: response.tips,
        powerSpikes: response.powerSpikes,
        laneSummary: response.laneSummary,
      };
    }
  } catch {
    // Fall through to local data
  }

  const localMatchup = getMatchupData(yourChamp, enemyChamp);
  if (localMatchup) {
    return localMatchup;
  }

  return {
    yourChampion: yourChamp,
    enemyChampion: enemyChamp,
    difficulty: 3,
    tips: [
      'No specific matchup data available. Play around your champion strengths.',
      'Trade when enemy abilities are on cooldown.',
      'Track the enemy jungler to avoid ganks.',
    ],
    powerSpikes: ['Level 6 is a key power spike for most champions.'],
    laneSummary: `${yourChamp} vs ${enemyChamp} - Skill matchup. Focus on fundamentals.`,
  };
}

export async function getJunglePrediction(
  gameState: AllGameData
): Promise<JunglePrediction> {
  try {
    const available = await isBackendAvailable();
    if (available) {
      const response = await backendFetch<AIJungleResponse>(
        '/api/coaching/jungle-prediction',
        {
          events: gameState.events,
          allPlayers: gameState.allPlayers,
          gameTime: gameState.gameData.gameTime,
        }
      );
      return {
        predictedSide: response.predictedSide,
        confidence: response.confidence,
        lastSeen: response.lastSeen,
        gankRisk: response.gankRisk,
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    predictedSide: 'mid',
    confidence: 0.3,
    lastSeen: 0,
    gankRisk: 0.5,
  };
}

export async function getAIReasoning(
  gameState: AllGameData
): Promise<{ thoughts: string[]; advice: string }> {
  try {
    const available = await isBackendAvailable();
    if (available) {
      const response = await backendFetch<AIReasoningResponse>(
        '/api/coaching/reasoning',
        {
          activePlayer: gameState.activePlayer,
          allPlayers: gameState.allPlayers,
          events: gameState.events,
          gameData: gameState.gameData,
        }
      );
      return { thoughts: response.thoughts, advice: response.advice };
    }
  } catch {
    // Fall through to local reasoning
  }

  const result = analyzeGameState(gameState);
  const thoughts: string[] = [];

  const gameTime = gameState.gameData.gameTime;
  const minutes = Math.floor(gameTime / 60);

  thoughts.push(`Game time: ${minutes} minutes.`);

  const healthPercent =
    gameState.activePlayer.championStats.currentHealth /
    gameState.activePlayer.championStats.maxHealth;
  thoughts.push(
    `Player health: ${Math.round(healthPercent * 100)}%.`
  );

  thoughts.push(`Current CS: ${result.farmingStats.currentCS} (${result.farmingStats.csPerMin}/min).`);

  const highThreats = result.threats.filter((t) => t.threatLevel === 'high');
  if (highThreats.length > 0) {
    thoughts.push(
      `High threats: ${highThreats.map((t) => t.championName).join(', ')}.`
    );
  }

  const topTip = result.tips.sort((a, b) => {
    const priorityOrder = { danger: 0, warning: 1, info: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  })[0];

  const advice = topTip
    ? topTip.message
    : 'Continue farming and maintain map awareness.';

  return { thoughts, advice };
}

export async function generatePostGameCoaching(
  gameData: AllGameData
): Promise<PostGameAnalysis> {
  try {
    const available = await isBackendAvailable();
    if (available) {
      const response = await backendFetch<AIPostGameResponse>(
        '/api/coaching/post-game',
        {
          activePlayer: gameData.activePlayer,
          allPlayers: gameData.allPlayers,
          events: gameData.events,
          gameData: gameData.gameData,
        }
      );
      return {
        grades: response.grades,
        keyMistakes: response.keyMistakes,
        stats: response.stats,
        improvementTips: response.improvementTips,
        duration: response.duration,
      };
    }
  } catch {
    // Fall through to local analysis
  }

  return generatePostGameReport(gameData, gameData.events.Events);
}

export const aiCoach = {
  getCoachingAdvice,
  getMatchupAnalysis,
  getJunglePrediction,
  getAIReasoning,
  generatePostGameCoaching,
};
