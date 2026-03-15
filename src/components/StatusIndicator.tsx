import { useGameStore } from '../stores/gameStore';
import type { GamePhase } from '../types/coaching';

// ── Status Indicator ──
// Tiny dot in the corner. That's it. Less is more.

const PHASE_DOT: Record<GamePhase, string> = {
  WAITING: 'bg-gray-500',
  LOADING: 'bg-amber-400 animate-pulse',
  EARLY_GAME: 'bg-emerald-400',
  MID_GAME: 'bg-sky-400',
  LATE_GAME: 'bg-purple-400',
  POST_GAME: 'bg-gray-400',
};

export function StatusIndicator() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const gameData = useGameStore((s) => s.gameData);
  const isConnected = gameData !== null;

  return (
    <div className="absolute top-1 right-1 z-50 pointer-events-none">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? PHASE_DOT[gamePhase] : 'bg-red-500'}`} />
        <span className="text-[7px] text-gray-500 uppercase tracking-widest">
          {isConnected ? gamePhase.replace('_', ' ') : 'offline'}
        </span>
      </div>
    </div>
  );
}
