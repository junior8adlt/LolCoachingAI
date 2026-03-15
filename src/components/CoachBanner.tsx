import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { CoachingTip } from '../types/coaching';

// ── Coach Banner ──
// The ONE thing the player sees. Big, bold, temporary.
// Appears → stays 5s → fades out. Color-coded by intent.

type BannerIntent = 'aggressive' | 'danger' | 'info' | 'opportunity';

function getIntent(tip: CoachingTip): BannerIntent {
  const msg = tip.message.toLowerCase();
  if (tip.priority === 'danger') return 'danger';
  if (msg.includes('kill') || msg.includes('all-in') || msg.includes('fight now') || msg.includes('play aggressive')) return 'aggressive';
  if (msg.includes('advantage') || msg.includes('spike') || msg.includes('window') || msg.includes('flash down') || msg.includes('dead!')) return 'opportunity';
  if (msg.includes('avoid') || msg.includes('don\'t') || msg.includes('safe') || msg.includes('behind') || msg.includes('disengage')) return 'danger';
  return 'info';
}

// Extract reasoning keywords from tip for the AI reasoning display
function extractReasoning(tip: CoachingTip): string[] {
  const reasons: string[] = [];
  const msg = tip.message.toLowerCase();
  if (msg.includes('level')) reasons.push('Level advantage');
  if (msg.includes('item')) reasons.push('Item spike');
  if (msg.includes('flash down')) reasons.push('Enemy flash down');
  if (msg.includes('ult down')) reasons.push('Enemy ult down');
  if (msg.includes('gold')) reasons.push('Gold lead');
  if (msg.includes('wave')) reasons.push('Wave state');
  if (msg.includes('dragon') || msg.includes('baron')) reasons.push('Objective timing');
  if (msg.includes('dead')) reasons.push('Number advantage');
  if (msg.includes('jungle') || msg.includes('gank')) reasons.push('Jungle tracking');
  if (msg.includes('roam') || msg.includes('missing')) reasons.push('Roam detected');
  return reasons.slice(0, 3);
}

const INTENT_STYLES: Record<BannerIntent, {
  bg: string;
  border: string;
  glow: string;
  accent: string;
  label: string;
  labelColor: string;
  stripe: string;
}> = {
  aggressive: {
    bg: 'bg-emerald-950/85',
    border: 'border-emerald-400/40',
    glow: '0 0 30px rgba(52,211,153,0.15), 0 0 60px rgba(52,211,153,0.05)',
    accent: 'text-emerald-300',
    label: 'GO',
    labelColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    stripe: 'bg-emerald-400',
  },
  danger: {
    bg: 'bg-red-950/85',
    border: 'border-red-400/40',
    glow: '0 0 30px rgba(248,113,113,0.2), 0 0 60px rgba(248,113,113,0.08)',
    accent: 'text-red-300',
    label: 'DANGER',
    labelColor: 'bg-red-500/20 text-red-300 border-red-400/30',
    stripe: 'bg-red-400',
  },
  opportunity: {
    bg: 'bg-amber-950/85',
    border: 'border-amber-400/40',
    glow: '0 0 30px rgba(251,191,36,0.12), 0 0 60px rgba(251,191,36,0.05)',
    accent: 'text-amber-300',
    label: 'OPPORTUNITY',
    labelColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    stripe: 'bg-amber-400',
  },
  info: {
    bg: 'bg-sky-950/80',
    border: 'border-sky-400/30',
    glow: '0 0 20px rgba(56,189,248,0.1)',
    accent: 'text-sky-300',
    label: 'COACH',
    labelColor: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
    stripe: 'bg-sky-400',
  },
};

interface BannerState {
  tip: CoachingTip | null;
  intent: BannerIntent;
  visible: boolean;
  exiting: boolean;
}

export function CoachBanner() {
  const coachingTips = useGameStore((s) => s.coachingTips);
  const dismissTip = useGameStore((s) => s.dismissTip);
  const activePlayer = useGameStore((s) => s.activePlayer);
  const gameData = useGameStore((s) => s.gameData);

  const [banner, setBanner] = useState<BannerState>({
    tip: null,
    intent: 'info',
    visible: false,
    exiting: false,
  });

  const shownTips = useRef(new Set<string>());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Find the latest active tip we haven't shown yet
  const activeTips = coachingTips.filter((t) => !t.dismissed && !shownTips.current.has(t.id));
  const latestTip = activeTips.length > 0 ? activeTips[activeTips.length - 1] : null;

  useEffect(() => {
    if (!latestTip || banner.visible) return;

    // Show this tip
    shownTips.current.add(latestTip.id);
    const intent = getIntent(latestTip);

    setBanner({ tip: latestTip, intent, visible: true, exiting: false });

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Short duration: 3s normal, 4s danger (coach says it fast, player glances)
    const duration = intent === 'danger' ? 4000 : 3000;
    timerRef.current = setTimeout(() => {
      setBanner((prev) => ({ ...prev, exiting: true }));
      // Remove after fade animation
      setTimeout(() => {
        setBanner({ tip: null, intent: 'info', visible: false, exiting: false });
        dismissTip(latestTip.id);
      }, 500);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [latestTip?.id, banner.visible, dismissTip]);

  if (!banner.tip || !banner.visible) return null;

  const s = INTENT_STYLES[banner.intent];
  const reasoning = banner.tip ? extractReasoning(banner.tip) : [];
  const myChampion = gameData?.allPlayers.find(
    (p) => p.summonerName === activePlayer?.summonerName
  )?.championName;

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-xl
        ${s.bg} ${s.border}
        ${banner.exiting ? 'coach-banner-exit' : 'coach-banner-enter'}
        ${banner.intent === 'danger' ? 'coach-banner-shake' : ''}
      `}
      style={{ boxShadow: s.glow }}
    >
      {/* Top accent stripe */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.stripe} opacity-60`} />

      {/* Scan line for danger */}
      {banner.intent === 'danger' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div
            className="absolute left-0 right-0 h-[1px] bg-red-400/20"
            style={{ animation: 'scan-line 2s linear infinite' }}
          />
        </div>
      )}

      <div className="px-5 py-4 flex items-start gap-4">
        {/* Left: Intent badge */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
          <div className={`px-2 py-0.5 rounded border text-[9px] font-black tracking-[0.2em] ${s.labelColor}`}>
            {s.label}
          </div>
          {myChampion && (
            <span className="text-[8px] text-gray-500 tracking-wide uppercase">
              {myChampion}
            </span>
          )}
        </div>

        {/* Center: The message */}
        <div className="flex-1 min-w-0">
          <p className={`text-[15px] font-semibold leading-snug ${s.accent}`}
             style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            {banner.tip.message}
          </p>
          {/* AI Reasoning chain (shows WHY the coach said this) */}
          {reasoning.length > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              {reasoning.map((r, i) => (
                <span key={i} className="text-[7px] text-gray-500/50 uppercase tracking-wider flex items-center gap-1">
                  {i > 0 && <span className="text-gray-600/30">→</span>}
                  {r}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[8px] text-gray-500/60 uppercase tracking-wider">
              {banner.tip.category}
            </span>
            {banner.intent === 'aggressive' && (
              <span className="text-[8px] text-emerald-500/60 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                high confidence
              </span>
            )}
            {banner.intent === 'opportunity' && (
              <span className="text-[8px] text-amber-400/60 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                window open
              </span>
            )}
            {banner.intent === 'danger' && (
              <span className="text-[8px] text-red-400/70 tracking-wider uppercase animate-pulse flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400" />
                act now
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar (time remaining) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className={`h-full ${s.stripe} opacity-40`}
          style={{
            animation: `coach-progress ${banner.intent === 'danger' ? '4' : '3'}s linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
