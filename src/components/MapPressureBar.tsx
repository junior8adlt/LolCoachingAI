import { useGameStore } from '../stores/gameStore';

// ── Map Pressure Bar ──
// Tiny horizontal bar showing who controls each lane.
// Top | Mid | Bot with color coding: green=ally, red=enemy, gray=neutral

type Pressure = 'ally' | 'enemy' | 'neutral';

function getLanePressure(
  allPlayers: ReturnType<typeof useGameStore.getState>['players'],
  myTeam: string,
  lane: string
): Pressure {
  const allyLaner = allPlayers.find(
    (p) => p.team === myTeam && p.position?.toUpperCase() === lane
  );
  const enemyLaner = allPlayers.find(
    (p) => p.team !== myTeam && p.position?.toUpperCase() === lane
  );

  if (!allyLaner || !enemyLaner) return 'neutral';

  // Compare kills + CS to determine who's winning the lane
  const allyScore = allyLaner.scores.kills * 3 + allyLaner.scores.creepScore * 0.1 - allyLaner.scores.deaths * 2;
  const enemyScore = enemyLaner.scores.kills * 3 + enemyLaner.scores.creepScore * 0.1 - enemyLaner.scores.deaths * 2;

  const diff = allyScore - enemyScore;
  if (diff > 2) return 'ally';
  if (diff < -2) return 'enemy';
  return 'neutral';
}

const PRESSURE_COLORS: Record<Pressure, { bg: string; text: string }> = {
  ally: { bg: 'bg-emerald-500/60', text: 'text-emerald-300' },
  enemy: { bg: 'bg-red-500/60', text: 'text-red-300' },
  neutral: { bg: 'bg-gray-500/40', text: 'text-gray-400' },
};

export function MapPressureBar() {
  const players = useGameStore((s) => s.players);
  const activePlayer = useGameStore((s) => s.activePlayer);
  const gameData = useGameStore((s) => s.gameData);

  if (!activePlayer || !gameData || players.length === 0) return null;

  const myTeam = players.find(
    (p) => p.summonerName === activePlayer.summonerName
  )?.team ?? 'ORDER';

  const top = getLanePressure(players, myTeam, 'TOP');
  const mid = getLanePressure(players, myTeam, 'MIDDLE');
  const bot = getLanePressure(players, myTeam, 'BOTTOM');

  const lanes: Array<{ label: string; pressure: Pressure }> = [
    { label: 'TOP', pressure: top },
    { label: 'MID', pressure: mid },
    { label: 'BOT', pressure: bot },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.06]">
      <span className="text-[7px] text-gray-600 uppercase tracking-widest mr-1">MAP</span>
      {lanes.map((lane, i) => {
        const c = PRESSURE_COLORS[lane.pressure];
        return (
          <div key={lane.label} className="flex items-center gap-1">
            {i > 0 && <div className="w-px h-2.5 bg-white/10" />}
            <div className={`w-6 h-2 rounded-sm ${c.bg}`} />
            <span className={`text-[7px] font-bold ${c.text}`}>{lane.label[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
