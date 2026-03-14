export type TipPriority = 'info' | 'warning' | 'danger';

export type TipCategory =
  | 'farming'
  | 'trading'
  | 'vision'
  | 'objective'
  | 'positioning'
  | 'recall'
  | 'matchup'
  | 'jungle'
  | 'teamfight'
  | 'macro'
  | 'general';

export interface CoachingTip {
  id: string;
  message: string;
  priority: TipPriority;
  category: TipCategory;
  timestamp: number;
  dismissed: boolean;
}

export interface MatchupInfo {
  yourChampion: string;
  enemyChampion: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tips: string[];
  powerSpikes: string[];
  laneSummary: string;
}

export type ThreatLevel = 'low' | 'medium' | 'high';

export type ThreatType =
  | 'burst'
  | 'sustained'
  | 'cc'
  | 'poke'
  | 'engage'
  | 'splitpush'
  | 'assassin'
  | 'dive';

export interface ThreatAssessment {
  championName: string;
  threatLevel: ThreatLevel;
  threatTypes: ThreatType[];
  notes: string;
}

export type JungleSide = 'top' | 'mid' | 'bot';

export interface JunglePrediction {
  predictedSide: JungleSide;
  confidence: number;
  lastSeen: number;
  gankRisk: number;
}

export interface FarmingStats {
  currentCS: number;
  csPerMin: number;
  targetCS: number;
  missedCS: number;
  efficiency: number;
}

export type ObjectiveType = 'dragon' | 'baron' | 'herald';
export type ObjectiveStatus = 'alive' | 'dead' | 'spawning';

export interface ObjectiveInfo {
  type: ObjectiveType;
  status: ObjectiveStatus;
  timer: number;
  dragonType?: string;
}

export type PerformanceGrade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface PostGameGrades {
  laning: PerformanceGrade;
  farming: PerformanceGrade;
  vision: PerformanceGrade;
  teamfighting: PerformanceGrade;
  objectives: PerformanceGrade;
  overall: PerformanceGrade;
}

export interface KeyMistake {
  timestamp: number;
  description: string;
  category: TipCategory;
  severity: TipPriority;
}

export interface PostGameStats {
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMin: number;
  visionScore: number;
  goldEarned: number;
  damageDealt: number;
  killParticipation: number;
}

export interface PostGameAnalysis {
  grades: PostGameGrades;
  keyMistakes: KeyMistake[];
  stats: PostGameStats;
  improvementTips: string[];
  duration: number;
}

export type AIStatusType = 'idle' | 'thinking' | 'analyzing' | 'coaching';

export interface AIState {
  status: AIStatusType;
  currentThought: string;
  reasoningChain: string[];
}

export type GamePhase =
  | 'WAITING'
  | 'LOADING'
  | 'EARLY_GAME'
  | 'MID_GAME'
  | 'LATE_GAME'
  | 'POST_GAME';
