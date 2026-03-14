import { useGameStore } from '../stores/gameStore';

type FarmStatus = 'good' | 'below' | 'far-below';

function getFarmStatus(efficiency: number): FarmStatus {
  if (efficiency >= 85) return 'good';
  if (efficiency >= 65) return 'below';
  return 'far-below';
}

const STATUS_STYLES: Record<FarmStatus, { bar: string; text: string; label: string }> = {
  good: {
    bar: 'bg-gaming-neon-green',
    text: 'text-gaming-neon-green',
    label: 'On Target',
  },
  below: {
    bar: 'bg-gaming-neon-gold',
    text: 'text-gaming-neon-gold',
    label: 'Below Target',
  },
  'far-below': {
    bar: 'bg-gaming-neon-red',
    text: 'text-gaming-neon-red',
    label: 'Far Below',
  },
};

export function FarmTracker() {
  const farmingStats = useGameStore((s) => s.farmingStats);

  if (!farmingStats) {
    return (
      <div className="glass-panel w-[200px]">
        <div className="panel-header">Farm</div>
        <div className="p-3 text-center text-[11px] text-gray-500 italic">
          No farm data
        </div>
      </div>
    );
  }

  const status = getFarmStatus(farmingStats.efficiency);
  const style = STATUS_STYLES[status];

  return (
    <div className="glass-panel w-[200px]">
      <div className="panel-header flex items-center justify-between">
        <span>Farm</span>
        <span className={`text-[9px] font-bold ${style.text}`}>
          {style.label}
        </span>
      </div>

      <div className="p-2.5 space-y-2">
        {/* CS Display */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white data-text">
              {farmingStats.currentCS}
            </span>
            <span className="text-[10px] text-gray-500">CS</span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold data-text ${style.text}`}>
              {farmingStats.csPerMin.toFixed(1)}
            </span>
            <span className="text-[9px] text-gray-500 ml-0.5">/min</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-500">
              Target: {farmingStats.targetCS} CS
            </span>
            <span className="text-[9px] text-gray-500 data-text">
              {farmingStats.efficiency.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gaming-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
              style={{ width: `${Math.min(100, farmingStats.efficiency)}%` }}
            />
          </div>
        </div>

        {/* Missed CS */}
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-gray-600">Missed CS</span>
          <span className="text-gray-400 data-text">{farmingStats.missedCS}</span>
        </div>
      </div>
    </div>
  );
}
