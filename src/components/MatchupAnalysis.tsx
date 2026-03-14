import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-2.5 h-2.5 ${
            star <= rating
              ? rating >= 4
                ? 'text-gaming-neon-red'
                : rating >= 3
                ? 'text-gaming-neon-gold'
                : 'text-gaming-neon-green'
              : 'text-gray-700'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function MatchupAnalysis() {
  const matchupInfo = useGameStore((s) => s.matchupInfo);
  const [minimized, setMinimized] = useState(false);

  if (!matchupInfo) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="glass-panel px-2.5 py-1.5 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="text-[9px] text-gaming-neon-blue font-bold uppercase tracking-wider">
          Matchup
        </span>
        <span className="text-[10px] text-gray-400">
          {matchupInfo.yourChampion} vs {matchupInfo.enemyChampion}
        </span>
        <StarRating rating={matchupInfo.difficulty} />
      </button>
    );
  }

  return (
    <div className="glass-panel-accent w-[260px] animate-fade-in">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>Matchup Analysis</span>
        <button
          onClick={() => setMinimized(true)}
          className="text-[9px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          minimize
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Champion vs Champion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-neon-blue/40 to-gaming-neon-blue/20 flex items-center justify-center border border-gaming-neon-blue/30">
              <span className="text-[10px] font-bold text-gaming-neon-blue">
                {matchupInfo.yourChampion.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] text-gray-200 font-medium">
              {matchupInfo.yourChampion}
            </span>
          </div>

          <span className="text-[10px] text-gray-500 font-bold">VS</span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-200 font-medium">
              {matchupInfo.enemyChampion}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-neon-red/40 to-gaming-neon-red/20 flex items-center justify-center border border-gaming-neon-red/30">
              <span className="text-[10px] font-bold text-gaming-neon-red">
                {matchupInfo.enemyChampion.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">Difficulty</span>
          <StarRating rating={matchupInfo.difficulty} />
        </div>

        {/* Lane Summary */}
        {matchupInfo.laneSummary && (
          <div className="text-[10px] text-gray-400 leading-relaxed px-1 py-1.5 rounded bg-gaming-surface/50">
            {matchupInfo.laneSummary}
          </div>
        )}

        {/* Key Tips */}
        <div>
          <div className="text-[9px] text-gaming-neon-blue/70 font-bold uppercase tracking-wider mb-1.5">
            Key Tips
          </div>
          <ul className="space-y-1">
            {matchupInfo.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px]">
                <span className="text-gaming-neon-blue/50 mt-0.5 flex-shrink-0">-</span>
                <span className="text-gray-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Power Spikes */}
        {matchupInfo.powerSpikes.length > 0 && (
          <div>
            <div className="text-[8px] text-gaming-neon-gold/60 font-bold uppercase tracking-wider mb-1">
              Power Spikes
            </div>
            {matchupInfo.powerSpikes.map((spike, i) => (
              <div key={i} className="text-[9px] text-gray-400 data-text">
                {spike}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
