import { useGameStore } from '../stores/gameStore';
import type { ThreatLevel } from '../types/coaching';

const THREAT_COLORS: Record<ThreatLevel, { text: string; bg: string; dot: string }> = {
  low: {
    text: 'text-gaming-neon-green',
    bg: 'bg-gaming-neon-green/10',
    dot: 'bg-gaming-neon-green',
  },
  medium: {
    text: 'text-gaming-neon-gold',
    bg: 'bg-gaming-neon-gold/10',
    dot: 'bg-gaming-neon-gold',
  },
  high: {
    text: 'text-gaming-neon-red',
    bg: 'bg-gaming-neon-red/10',
    dot: 'bg-gaming-neon-red',
  },
};

const THREAT_TYPE_LABELS: Record<string, string> = {
  burst: 'Burst damage',
  sustained: 'Sustained DPS',
  cc: 'Crowd control',
  poke: 'Poke threat',
  engage: 'Engage threat',
  splitpush: 'Splitpush',
  assassin: 'Assassin',
  dive: 'Dive threat',
};

function getChampInitials(name: string): string {
  if (name.length <= 3) return name.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getChampColor(index: number): string {
  const colors = [
    'from-red-500/60 to-red-700/60',
    'from-blue-500/60 to-blue-700/60',
    'from-purple-500/60 to-purple-700/60',
    'from-amber-500/60 to-amber-700/60',
    'from-emerald-500/60 to-emerald-700/60',
  ];
  return colors[index % colors.length];
}

export function EnemyThreatList() {
  const threats = useGameStore((s) => s.threats);

  if (threats.length === 0) {
    return (
      <div className="glass-panel w-[220px]">
        <div className="panel-header">Enemy Threats</div>
        <div className="p-3 text-center text-[11px] text-gray-500 italic">
          No enemy data available
        </div>
      </div>
    );
  }

  // Sort by threat level: high first
  const sorted = [...threats].sort((a, b) => {
    const order: Record<ThreatLevel, number> = { high: 0, medium: 1, low: 2 };
    return order[a.threatLevel] - order[b.threatLevel];
  });

  return (
    <div className="glass-panel w-[220px]">
      <div className="panel-header flex items-center justify-between">
        <span>Enemy Threats</span>
        <span className="text-[9px] text-gray-500 data-text">{threats.length}/5</span>
      </div>

      <div className="p-1.5 space-y-0.5">
        {sorted.map((enemy, i) => {
          const threat = THREAT_COLORS[enemy.threatLevel];
          const primaryThreat = enemy.threatTypes[0];
          return (
            <div
              key={`${enemy.championName}-${i}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded ${threat.bg} transition-colors hover:bg-white/5`}
            >
              {/* Champion Icon Placeholder */}
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${getChampColor(i)} flex items-center justify-center flex-shrink-0 border border-white/10`}
              >
                <span className="text-[9px] font-bold text-white/90">
                  {getChampInitials(enemy.championName)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-200 truncate">
                    {enemy.championName}
                  </span>
                  <span className={`text-[9px] font-bold uppercase ${threat.text}`}>
                    {enemy.threatLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] text-gray-500">
                    {primaryThreat ? THREAT_TYPE_LABELS[primaryThreat] || primaryThreat : '-'}
                  </span>
                </div>
                {enemy.notes && (
                  <div className="text-[8px] text-gray-600 mt-0.5 truncate">
                    {enemy.notes}
                  </div>
                )}
              </div>

              {/* Threat dot */}
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${threat.dot} ${
                enemy.threatLevel === 'high' ? 'animate-pulse-neon' : ''
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
