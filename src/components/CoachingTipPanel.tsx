import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { CoachingTip, TipPriority } from '../types/coaching';

const PRIORITY_STYLES: Record<TipPriority, { border: string; icon: string; iconColor: string; bg: string }> = {
  info: {
    border: 'border-gaming-neon-blue/30',
    icon: 'i',
    iconColor: 'bg-gaming-neon-blue/20 text-gaming-neon-blue',
    bg: 'bg-gaming-neon-blue/5',
  },
  warning: {
    border: 'border-gaming-neon-gold/30',
    icon: '!',
    iconColor: 'bg-gaming-neon-gold/20 text-gaming-neon-gold',
    bg: 'bg-gaming-neon-gold/5',
  },
  danger: {
    border: 'border-gaming-neon-red/30 animate-danger-pulse',
    icon: '!!',
    iconColor: 'bg-gaming-neon-red/20 text-gaming-neon-red',
    bg: 'bg-gaming-neon-red/5',
  },
};

function formatTimestamp(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function TipCard({
  tip,
  isActive,
  opacity,
}: {
  tip: CoachingTip;
  isActive: boolean;
  opacity: number;
}) {
  const style = PRIORITY_STYLES[tip.priority];

  return (
    <div
      className={`glass-panel ${style.border} ${style.bg} transition-all duration-300 ${
        isActive ? 'animate-slide-in-up' : ''
      }`}
      style={{ opacity }}
    >
      <div className="flex items-start gap-2.5 p-3">
        {/* Priority Icon */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold ${style.iconColor}`}
        >
          {style.icon}
        </div>

        {/* Tip Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-gray-200 leading-relaxed">
            {tip.message}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${
                tip.priority === 'danger'
                  ? 'text-gaming-neon-red'
                  : tip.priority === 'warning'
                  ? 'text-gaming-neon-gold'
                  : 'text-gaming-neon-blue'
              }`}
            >
              {tip.priority}
            </span>
            <span className="text-[9px] text-gray-600 uppercase tracking-wider">
              {tip.category}
            </span>
            <span className="text-[9px] text-gray-600 data-text">
              {formatTimestamp(tip.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoachingTipPanel() {
  const coachingTips = useGameStore((s) => s.coachingTips);
  const dismissTip = useGameStore((s) => s.dismissTip);
  const dismissTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Get active (not dismissed) tips
  const activeTips = coachingTips.filter((t) => !t.dismissed);
  const recentDismissed = coachingTips
    .filter((t) => t.dismissed)
    .slice(-3)
    .reverse();

  // Auto-dismiss tips after 8 seconds
  useEffect(() => {
    for (const tip of activeTips) {
      if (!dismissTimers.current.has(tip.id)) {
        const timer = setTimeout(() => {
          dismissTip(tip.id);
          dismissTimers.current.delete(tip.id);
        }, 8000);
        dismissTimers.current.set(tip.id, timer);
      }
    }

    return () => {
      dismissTimers.current.forEach((timer) => clearTimeout(timer));
      dismissTimers.current.clear();
    };
  }, [activeTips, dismissTip]);

  if (activeTips.length === 0 && recentDismissed.length === 0) return null;

  return (
    <div className="w-[380px] space-y-1">
      {/* Previous tips (faded) */}
      {recentDismissed.map((tip, i) => (
        <TipCard
          key={tip.id}
          tip={tip}
          isActive={false}
          opacity={0.3 - i * 0.08}
        />
      ))}

      {/* Active tips */}
      {activeTips.map((tip) => (
        <TipCard key={tip.id} tip={tip} isActive={true} opacity={1} />
      ))}
    </div>
  );
}
