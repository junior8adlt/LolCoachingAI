import { useGameStore } from '../stores/gameStore';

// ── Mini Stats Widget ──
// Tiny, ambient, always-visible. Shows only CS + Jungle side.
// Designed to be glanced at, not read.

export function MiniStats() {
  const farmingStats = useGameStore((s) => s.farmingStats);
  const junglePrediction = useGameStore((s) => s.junglePrediction);
  const activePlayer = useGameStore((s) => s.activePlayer);
  const gameData = useGameStore((s) => s.gameData);

  const myChampion = gameData?.allPlayers.find(
    (p) => p.summonerName === activePlayer?.summonerName
  )?.championName;

  const csPerMin = farmingStats?.csPerMin?.toFixed(1) ?? '0.0';
  const cs = farmingStats?.currentCS ?? 0;
  const efficiency = farmingStats?.efficiency ?? 0;

  const csColor = efficiency >= 80 ? 'text-emerald-400' :
                  efficiency >= 60 ? 'text-amber-400' : 'text-red-400';

  const jglSide = junglePrediction?.predictedSide?.toUpperCase() ?? '?';
  const gankRisk = junglePrediction?.gankRisk ?? 0;
  const jglColor = gankRisk >= 0.6 ? 'text-red-400' :
                   gankRisk >= 0.35 ? 'text-amber-400' : 'text-emerald-400';
  const jglDot = gankRisk >= 0.6 ? 'bg-red-400' :
                 gankRisk >= 0.35 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.06]">
      {/* Champion name */}
      {myChampion && (
        <>
          <span className="text-[9px] text-sky-400/70 font-bold tracking-wider uppercase">
            {myChampion}
          </span>
          <div className="w-px h-3 bg-white/10" />
        </>
      )}

      {/* CS */}
      <div className="flex items-baseline gap-1">
        <span className={`text-[13px] font-bold tabular-nums ${csColor}`}>
          {cs}
        </span>
        <span className="text-[8px] text-gray-500">CS</span>
        <span className={`text-[10px] tabular-nums ${csColor}`}>
          {csPerMin}
        </span>
        <span className="text-[7px] text-gray-600">/m</span>
      </div>

      <div className="w-px h-3 bg-white/10" />

      {/* Jungle */}
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${jglDot} ${gankRisk >= 0.6 ? 'animate-pulse' : ''}`} />
        <span className="text-[8px] text-gray-500 uppercase">JG</span>
        <span className={`text-[10px] font-bold tracking-wider ${jglColor}`}>
          {jglSide}
        </span>
      </div>
    </div>
  );
}
