import { create } from 'zustand';
import type { AllGameData, ActivePlayer, PlayerInfo, GameEvent } from '../types/game';
import type {
  CoachingTip,
  MatchupInfo,
  ThreatAssessment,
  JunglePrediction,
  FarmingStats,
  ObjectiveInfo,
  AIState,
  PostGameAnalysis,
  GamePhase,
} from '../types/coaching';

interface GameStoreState {
  gamePhase: GamePhase;
  gameData: AllGameData | null;
  activePlayer: ActivePlayer | null;
  players: PlayerInfo[];
  events: GameEvent[];
  coachingTips: CoachingTip[];
  matchupInfo: MatchupInfo | null;
  threats: ThreatAssessment[];
  junglePrediction: JunglePrediction | null;
  farmingStats: FarmingStats | null;
  objectives: ObjectiveInfo[];
  aiState: AIState;
  postGameAnalysis: PostGameAnalysis | null;
  overlayVisible: boolean;
  lastEventId: number;
}

interface GameStoreActions {
  updateGameData: (data: AllGameData) => void;
  addCoachingTip: (tip: CoachingTip) => void;
  dismissTip: (id: string) => void;
  setMatchupInfo: (info: MatchupInfo | null) => void;
  updateThreats: (threats: ThreatAssessment[]) => void;
  updateJunglePrediction: (prediction: JunglePrediction | null) => void;
  updateFarmingStats: (stats: FarmingStats | null) => void;
  updateObjectives: (objectives: ObjectiveInfo[]) => void;
  setAIState: (state: Partial<AIState>) => void;
  setGamePhase: (phase: GamePhase) => void;
  setPostGameAnalysis: (analysis: PostGameAnalysis | null) => void;
  toggleOverlay: () => void;
  reset: () => void;
}

type GameStore = GameStoreState & GameStoreActions;

const initialAIState: AIState = {
  status: 'idle',
  currentThought: '',
  reasoningChain: [],
  source: 'local',
};

const initialState: GameStoreState = {
  gamePhase: 'WAITING',
  gameData: null,
  activePlayer: null,
  players: [],
  events: [],
  coachingTips: [],
  matchupInfo: null,
  threats: [],
  junglePrediction: null,
  farmingStats: null,
  objectives: [
    { type: 'dragon', status: 'alive', timer: 0 },
    { type: 'herald', status: 'alive', timer: 0 },
    { type: 'baron', status: 'alive', timer: 0 },
  ],
  aiState: { ...initialAIState },
  postGameAnalysis: null,
  overlayVisible: true,
  lastEventId: -1,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  updateGameData: (data: AllGameData) =>
    set((state) => {
      const newEvents = data.events.Events.filter(
        (e) => e.EventID > state.lastEventId
      );
      const lastId =
        data.events.Events.length > 0
          ? data.events.Events[data.events.Events.length - 1].EventID
          : state.lastEventId;

      return {
        gameData: data,
        activePlayer: data.activePlayer,
        players: data.allPlayers,
        events: [...state.events, ...newEvents],
        lastEventId: lastId,
      };
    }),

  addCoachingTip: (tip: CoachingTip) =>
    set((state) => {
      // Block exact same message within 30s
      const isDuplicate = state.coachingTips.some(
        (existing) =>
          existing.message === tip.message &&
          !existing.dismissed &&
          tip.timestamp - existing.timestamp < 30000
      );
      if (isDuplicate) return state;

      // Block same CATEGORY - priority engine ALSO blocks by topic
      // Both layers together prevent any repetition
      const CATEGORY_COOLDOWNS: Record<string, number> = {
        farming: 300000,       // 5min - CS tips are the most annoying spam
        recall: 120000,        // 2min
        positioning: 180000,   // 3min
        matchup: 300000,       // 5min
        jungle: 120000,        // 2min
        vision: 180000,        // 3min
        trading: 90000,        // 1.5min
        macro: 180000,         // 3min
        objective: 120000,     // 2min
        teamfight: 60000,      // 1min - teamfight tips are time-sensitive
        general: 120000,       // 2min
      };
      const cooldown = CATEGORY_COOLDOWNS[tip.category] ?? 20000;
      const categorySpam = state.coachingTips.some(
        (existing) =>
          existing.category === tip.category &&
          !existing.dismissed &&
          tip.timestamp - existing.timestamp < cooldown
      );
      if (categorySpam) return state;
      const activeTips = state.coachingTips.filter((t) => !t.dismissed);
      if (activeTips.length >= 5) {
        const oldest = activeTips.reduce((prev, curr) =>
          prev.timestamp < curr.timestamp ? prev : curr
        );
        return {
          coachingTips: [
            ...state.coachingTips.map((t) =>
              t.id === oldest.id ? { ...t, dismissed: true } : t
            ),
            tip,
          ],
        };
      }
      return {
        coachingTips: [...state.coachingTips, tip],
      };
    }),

  dismissTip: (id: string) =>
    set((state) => ({
      coachingTips: state.coachingTips.map((tip) =>
        tip.id === id ? { ...tip, dismissed: true } : tip
      ),
    })),

  setMatchupInfo: (info: MatchupInfo | null) =>
    set({ matchupInfo: info }),

  updateThreats: (threats: ThreatAssessment[]) =>
    set({ threats }),

  updateJunglePrediction: (prediction: JunglePrediction | null) =>
    set({ junglePrediction: prediction }),

  updateFarmingStats: (stats: FarmingStats | null) =>
    set({ farmingStats: stats }),

  updateObjectives: (objectives: ObjectiveInfo[]) =>
    set({ objectives }),

  setAIState: (partial: Partial<AIState>) =>
    set((state) => ({
      aiState: { ...state.aiState, ...partial },
    })),

  setGamePhase: (phase: GamePhase) =>
    set({ gamePhase: phase }),

  setPostGameAnalysis: (analysis: PostGameAnalysis | null) =>
    set({ postGameAnalysis: analysis }),

  toggleOverlay: () =>
    set((state) => ({ overlayVisible: !state.overlayVisible })),

  reset: () => set({ ...initialState, aiState: { ...initialAIState } }),
}));
