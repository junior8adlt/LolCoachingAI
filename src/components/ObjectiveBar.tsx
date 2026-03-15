import { useGameStore } from '../stores/gameStore';

// ── Objective Bar ──
// Compact horizontal bar showing Dragon / Herald / Baron status.
// Only shows relevant objectives (hides dead ones with long timers).

function formatTime(s: number): string {
  if (s <= 0) return '';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

const OBJ_ICON: Record<string, { letter: string; alive: string; spawning: string }> = {
  dragon: { letter: 'D', alive: 'text-orange-400', spawning: 'text-orange-400/60' },
  baron: { letter: 'B', alive: 'text-purple-400', spawning: 'text-purple-400/60' },
  herald: { letter: 'H', alive: 'text-sky-400', spawning: 'text-sky-400/60' },
};

export function ObjectiveBar() {
  const objectives = useGameStore((s) => s.objectives);

  // Only show objectives that matter (alive or spawning soon)
  const relevant = objectives.filter(
    (o) => o.status === 'alive' || (o.status === 'dead' && o.timer > 0 && o.timer <= 120) || (o.status === 'spawning' && o.timer <= 120)
  );

  if (relevant.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.06]">
      {relevant.map((obj, i) => {
        const cfg = OBJ_ICON[obj.type] ?? { letter: '?', alive: 'text-gray-400', spawning: 'text-gray-500' };
        const isAlive = obj.status === 'alive';
        const isSpawningSoon = !isAlive && obj.timer > 0 && obj.timer <= 60;

        return (
          <div key={`${obj.type}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <div className="w-px h-3 bg-white/10" />}

            {/* Icon */}
            <span className={`text-[11px] font-black ${isAlive ? cfg.alive : cfg.spawning}`}>
              {cfg.letter}
            </span>

            {/* Status */}
            {isAlive && (
              <span className={`text-[9px] font-bold ${cfg.alive}`}>UP</span>
            )}
            {!isAlive && obj.timer > 0 && (
              <span className={`text-[10px] tabular-nums font-mono ${
                isSpawningSoon ? 'text-amber-400 animate-pulse' : 'text-gray-500'
              }`}>
                {formatTime(obj.timer)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
