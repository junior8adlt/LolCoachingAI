import { useGameStore } from '../stores/gameStore';
import { getKeybindLabel } from '../services/keybinds';
import type { AIStatusType, GamePhase } from '../types/coaching';

const PHASE_LABELS: Record<GamePhase, { text: string; color: string }> = {
  WAITING: { text: 'Waiting', color: 'text-gray-400' },
  LOADING: { text: 'Loading', color: 'text-gaming-neon-gold' },
  EARLY_GAME: { text: 'Early Game', color: 'text-gaming-neon-green' },
  MID_GAME: { text: 'Mid Game', color: 'text-gaming-neon-blue' },
  LATE_GAME: { text: 'Late Game', color: 'text-gaming-neon-purple' },
  POST_GAME: { text: 'Post Game', color: 'text-gray-400' },
};

const AI_STYLES: Record<AIStatusType, { dot: string; text: string; label: string }> = {
  idle: {
    dot: 'bg-gray-400',
    text: 'text-gray-400',
    label: 'Ready',
  },
  thinking: {
    dot: 'bg-gaming-neon-blue animate-pulse-neon',
    text: 'text-gaming-neon-blue',
    label: 'Thinking',
  },
  analyzing: {
    dot: 'bg-gaming-neon-purple animate-pulse-neon',
    text: 'text-gaming-neon-purple',
    label: 'Analyzing',
  },
  coaching: {
    dot: 'bg-gaming-neon-green animate-pulse-neon',
    text: 'text-gaming-neon-green',
    label: 'Coaching',
  },
};

export function StatusIndicator() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const aiState = useGameStore((s) => s.aiState);
  const overlayVisible = useGameStore((s) => s.overlayVisible);
  const gameData = useGameStore((s) => s.gameData);

  const ai = AI_STYLES[aiState.status];
  const phase = PHASE_LABELS[gamePhase];
  const isConnected = gameData !== null;

  return (
    <div className="absolute top-1 right-1 z-50 pointer-events-auto">
      <div className="glass-panel px-2 py-1 flex items-center gap-3">
        {/* Connection status */}
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-gaming-neon-green' : 'bg-gaming-neon-red'}`} />
          <span className={`text-[8px] data-text ${isConnected ? 'text-gaming-neon-green' : 'text-gaming-neon-red'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-gaming-border/40" />

        {/* Game phase */}
        <span className={`text-[8px] data-text ${phase.color}`}>
          {phase.text}
        </span>

        {/* Separator */}
        <div className="w-px h-3 bg-gaming-border/40" />

        {/* AI status */}
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${ai.dot}`} />
          <span className={`text-[8px] ${ai.text} data-text`}>
            AI: {ai.label}
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-gaming-border/40" />

        {/* Overlay toggle indicator */}
        <div className="flex items-center gap-1">
          <span className={`text-[8px] data-text ${overlayVisible ? 'text-gaming-neon-blue' : 'text-gray-600'}`}>
            {overlayVisible ? `${getKeybindLabel('toggleOverlay')}:ON` : `${getKeybindLabel('toggleOverlay')}:OFF`}
          </span>
        </div>
      </div>
    </div>
  );
}
