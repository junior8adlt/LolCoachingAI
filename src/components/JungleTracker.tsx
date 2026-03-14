import { useGameStore } from '../stores/gameStore';
import type { JungleSide } from '../types/coaching';

type RiskLevel = 'safe' | 'caution' | 'danger';

function getRiskLevel(gankRisk: number): RiskLevel {
  if (gankRisk >= 70) return 'danger';
  if (gankRisk >= 40) return 'caution';
  return 'safe';
}

const RISK_STYLES: Record<RiskLevel, { text: string; bg: string; border: string; label: string }> = {
  safe: {
    text: 'text-gaming-neon-green',
    bg: 'bg-gaming-neon-green/10',
    border: 'border-gaming-neon-green/20',
    label: 'SAFE',
  },
  caution: {
    text: 'text-gaming-neon-gold',
    bg: 'bg-gaming-neon-gold/10',
    border: 'border-gaming-neon-gold/20',
    label: 'CAUTION',
  },
  danger: {
    text: 'text-gaming-neon-red',
    bg: 'bg-gaming-neon-red/10',
    border: 'border-gaming-neon-red/20',
    label: 'DANGER',
  },
};

const SIDE_POSITIONS: Record<JungleSide, { top: string; left: string }> = {
  top: { top: '15%', left: '25%' },
  mid: { top: '45%', left: '50%' },
  bot: { top: '75%', left: '75%' },
};

function formatSecondsAgo(lastSeen: number, gameTime: number): string {
  const diff = gameTime - lastSeen;
  if (diff < 0) return 'Unknown';
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  return `${Math.floor(diff / 60)}m ${Math.floor(diff % 60)}s ago`;
}

export function JungleTracker() {
  const junglePrediction = useGameStore((s) => s.junglePrediction);
  const gameData = useGameStore((s) => s.gameData);

  if (!junglePrediction) {
    return (
      <div className="glass-panel w-[200px]">
        <div className="panel-header">Jungle Tracking</div>
        <div className="p-3 text-center text-[11px] text-gray-500 italic">
          No jungle data
        </div>
      </div>
    );
  }

  const riskLevel = getRiskLevel(junglePrediction.gankRisk);
  const risk = RISK_STYLES[riskLevel];
  const gameTime = gameData?.gameData.gameTime ?? 0;

  return (
    <div className={`glass-panel w-[200px] ${
      riskLevel === 'danger' ? 'animate-danger-pulse' : ''
    }`}>
      <div className="panel-header flex items-center justify-between">
        <span>Jungle Tracking</span>
        <span className={`text-[9px] font-bold ${risk.text}`}>
          {risk.label}
        </span>
      </div>

      <div className="p-2.5 space-y-2">
        {/* Mini map indicator */}
        <div className="relative w-full aspect-square max-h-[80px] bg-gaming-surface/50 rounded border border-gaming-border/30 overflow-hidden">
          {/* Lane labels */}
          <span className="absolute top-1 left-1 text-[7px] text-gray-600 font-bold uppercase">top</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] text-gray-600 font-bold uppercase">mid</span>
          <span className="absolute bottom-1 right-1 text-[7px] text-gray-600 font-bold uppercase">bot</span>

          {/* Diagonal lane line */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, transparent 45%, rgba(42,58,92,0.3) 49%, rgba(42,58,92,0.3) 51%, transparent 55%)',
            }}
          />

          {/* Predicted location dot */}
          <div
            className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 ${
              riskLevel === 'danger'
                ? 'bg-gaming-neon-red animate-pulse-neon'
                : riskLevel === 'caution'
                ? 'bg-gaming-neon-gold animate-pulse-neon'
                : 'bg-gaming-neon-green'
            }`}
            style={{
              top: SIDE_POSITIONS[junglePrediction.predictedSide].top,
              left: SIDE_POSITIONS[junglePrediction.predictedSide].left,
              boxShadow: `0 0 8px ${
                riskLevel === 'danger'
                  ? 'rgba(255,71,87,0.6)'
                  : riskLevel === 'caution'
                  ? 'rgba(255,215,0,0.6)'
                  : 'rgba(0,255,135,0.4)'
              }`,
            }}
          />
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-500">Confidence</span>
          <span className="text-gray-300 data-text">{junglePrediction.confidence}%</span>
        </div>

        {/* Last seen */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-500">Last seen</span>
          <span className="text-gray-400 data-text">
            {formatSecondsAgo(junglePrediction.lastSeen, gameTime)}
          </span>
        </div>

        {/* Gank probability */}
        <div className={`flex items-center justify-between px-2 py-1 rounded ${risk.bg} ${risk.border} border`}>
          <span className="text-[10px] text-gray-400">Gank Risk</span>
          <span className={`text-sm font-bold data-text ${risk.text}`}>
            {junglePrediction.gankRisk}%
          </span>
        </div>
      </div>
    </div>
  );
}
