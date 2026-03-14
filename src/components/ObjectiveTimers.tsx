import { useGameStore } from '../stores/gameStore';
import type { ObjectiveStatus, ObjectiveType } from '../types/coaching';

const STATUS_STYLES: Record<ObjectiveStatus, { text: string; dot: string }> = {
  alive: { text: 'text-gaming-neon-green', dot: 'bg-gaming-neon-green' },
  dead: { text: 'text-gray-500', dot: 'bg-gray-500' },
  spawning: { text: 'text-gaming-neon-gold', dot: 'bg-gaming-neon-gold animate-pulse-neon' },
};

const OBJECTIVE_CONFIG: Record<ObjectiveType, { icon: string; color: string; bgColor: string; label: string }> = {
  dragon: {
    icon: 'D',
    color: 'text-gaming-neon-orange',
    bgColor: 'bg-gaming-surface',
    label: 'Dragon',
  },
  baron: {
    icon: 'B',
    color: 'text-gaming-neon-purple',
    bgColor: 'bg-purple-900/30',
    label: 'Baron',
  },
  herald: {
    icon: 'H',
    color: 'text-gaming-neon-blue',
    bgColor: 'bg-gaming-surface',
    label: 'Rift Herald',
  },
};

const DRAGON_TYPE_COLORS: Record<string, string> = {
  Infernal: 'text-red-400',
  Mountain: 'text-amber-600',
  Ocean: 'text-blue-400',
  Cloud: 'text-gray-300',
  Hextech: 'text-cyan-300',
  Chemtech: 'text-green-400',
  Elder: 'text-gaming-neon-gold',
};

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ObjectiveTimers() {
  const objectives = useGameStore((s) => s.objectives);

  return (
    <div className="glass-panel w-[200px]">
      <div className="panel-header">Objectives</div>

      <div className="p-1.5 space-y-0.5">
        {objectives.map((obj, i) => {
          const statusStyle = STATUS_STYLES[obj.status];
          const config = OBJECTIVE_CONFIG[obj.type];
          const isSpawningSoon = obj.status === 'spawning' && obj.timer > 0 && obj.timer <= 60;
          const dragonColor = obj.dragonType ? DRAGON_TYPE_COLORS[obj.dragonType] || config.color : '';

          return (
            <div
              key={`${obj.type}-${i}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                isSpawningSoon
                  ? 'bg-gaming-neon-gold/10 border border-gaming-neon-gold/20'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Objective Icon */}
              <div
                className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 border border-gaming-border/40 ${config.bgColor}`}
              >
                <span className={`text-[11px] font-bold ${obj.dragonType ? dragonColor : config.color}`}>
                  {config.icon}
                </span>
              </div>

              {/* Name and Type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-gray-200 truncate">
                    {config.label}
                  </span>
                  {obj.dragonType && (
                    <span className={`text-[8px] ${dragonColor || 'text-gray-400'}`}>
                      {obj.dragonType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                  <span className={`text-[9px] uppercase ${statusStyle.text}`}>
                    {obj.status}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="flex-shrink-0 text-right">
                {obj.status !== 'alive' && obj.timer > 0 && (
                  <span
                    className={`text-sm font-bold data-text ${
                      isSpawningSoon
                        ? 'text-gaming-neon-gold text-shadow-warning'
                        : 'text-gray-400'
                    }`}
                  >
                    {formatCountdown(obj.timer)}
                  </span>
                )}
                {obj.status === 'alive' && (
                  <span className="text-[10px] text-gaming-neon-green data-text">UP</span>
                )}
                {obj.status !== 'alive' && obj.timer <= 0 && (
                  <span className="text-[10px] text-gray-500 data-text">--:--</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {objectives.length === 0 && (
        <div className="p-3 text-center text-[11px] text-gray-500 italic">
          No objective data
        </div>
      )}
    </div>
  );
}
