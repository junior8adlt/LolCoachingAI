import React from 'react';
import { useGameStore } from '../stores/gameStore';
import type { PerformanceGrade, TipPriority } from '../types/coaching';

const GRADE_CLASSES: Record<string, string> = {
  'S+': 'grade-s',
  S: 'grade-s',
  A: 'grade-a',
  B: 'grade-b',
  C: 'grade-c',
  D: 'grade-d',
  F: 'grade-f',
};

const SEVERITY_COLORS: Record<TipPriority, string> = {
  info: 'text-gaming-neon-blue',
  warning: 'text-gaming-neon-gold',
  danger: 'text-gaming-neon-red',
};

function GradeCard({ label, grade }: { label: string; grade: PerformanceGrade }) {
  return (
    <div className="glass-panel p-4 text-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold">
        {label}
      </div>
      <div className={`text-4xl font-bold ${GRADE_CLASSES[grade] || 'text-gray-400'}`}>
        {grade}
      </div>
    </div>
  );
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gaming-border/20 last:border-0">
      <span className="text-[11px] text-gray-400">{label}</span>
      <div className="text-right">
        <span className="text-[12px] text-gray-200 font-medium data-text">{value}</span>
        {sub && <span className="text-[9px] text-gray-500 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatMistakeTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Disable click-through when report is showing so buttons work
function useDisableClickThrough() {
  const api = (window as unknown as { electronAPI?: { setClickThrough?: (v: boolean) => Promise<boolean> } }).electronAPI;

  React.useEffect(() => {
    // Disable click-through so we can click buttons
    api?.setClickThrough?.(false);
    return () => {
      // Re-enable click-through when report closes
      api?.setClickThrough?.(true);
    };
  }, [api]);
}

export function PostGameReport() {
  const postGameAnalysis = useGameStore((s) => s.postGameAnalysis);
  const setPostGameAnalysis = useGameStore((s) => s.setPostGameAnalysis);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const reset = useGameStore((s) => s.reset);

  useDisableClickThrough();

  if (!postGameAnalysis) return null;

  const { grades, stats, keyMistakes, improvementTips, duration } = postGameAnalysis;

  const handleClose = () => {
    setPostGameAnalysis(null);
    setGamePhase('WAITING');
    reset();
  };

  const kdaRatio = stats.deaths > 0
    ? ((stats.kills + stats.assists) / stats.deaths).toFixed(2)
    : 'Perfect';

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in z-50">
      <div className="glass-panel-accent w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gaming-border/30">
          <div>
            <h2 className="text-lg font-bold text-white text-shadow-neon">
              Post-Game Report
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5 data-text">
              Game Duration: {formatDuration(duration)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Performance Grades */}
          <div>
            <div className="text-[10px] text-gaming-neon-blue/70 font-bold uppercase tracking-[0.15em] mb-3">
              Performance Grades
            </div>
            <div className="grid grid-cols-3 gap-3">
              <GradeCard label="Overall" grade={grades.overall} />
              <GradeCard label="Laning" grade={grades.laning} />
              <GradeCard label="Farming" grade={grades.farming} />
              <GradeCard label="Vision" grade={grades.vision} />
              <GradeCard label="Teamfighting" grade={grades.teamfighting} />
              <GradeCard label="Objectives" grade={grades.objectives} />
            </div>
          </div>

          {/* Key Stats */}
          <div>
            <div className="text-[10px] text-gaming-neon-blue/70 font-bold uppercase tracking-[0.15em] mb-2">
              Key Stats
            </div>
            <div className="glass-panel p-3">
              <StatRow
                label="KDA"
                value={`${stats.kills}/${stats.deaths}/${stats.assists}`}
                sub={`${kdaRatio} ratio`}
              />
              <StatRow label="Total CS" value={String(stats.cs)} />
              <StatRow label="CS/min" value={stats.csPerMin.toFixed(1)} />
              <StatRow label="Vision Score" value={String(stats.visionScore)} />
              <StatRow label="Gold Earned" value={stats.goldEarned.toLocaleString()} />
              <StatRow label="Damage Dealt" value={stats.damageDealt.toLocaleString()} />
              <StatRow label="Kill Participation" value={`${(stats.killParticipation * 100).toFixed(0)}%`} />
            </div>
          </div>

          {/* Improvement Tips */}
          {improvementTips.length > 0 && (
            <div>
              <div className="text-[10px] text-gaming-neon-green/70 font-bold uppercase tracking-[0.15em] mb-2">
                Improvement Tips
              </div>
              <div className="glass-panel p-3 space-y-2">
                {improvementTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gaming-neon-green text-[10px] mt-0.5 flex-shrink-0">+</span>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Mistakes */}
          {keyMistakes.length > 0 && (
            <div>
              <div className="text-[10px] text-gaming-neon-red/70 font-bold uppercase tracking-[0.15em] mb-2">
                Key Mistakes
              </div>
              <div className="glass-panel p-3 space-y-2">
                {keyMistakes.map((mistake, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 py-1.5 border-b border-gaming-border/15 last:border-0"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-[9px] text-gaming-neon-red data-text font-bold">
                        {formatMistakeTime(mistake.timestamp)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gaming-neon-gold/60 font-bold uppercase tracking-wider">
                          {mistake.category}
                        </span>
                        <span className={`text-[8px] font-bold uppercase ${SEVERITY_COLORS[mistake.severity]}`}>
                          {mistake.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                        {mistake.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gaming-border/30 flex items-center justify-between">
          <span className="text-[9px] text-gray-600">
            Analysis powered by LolCoachingAI
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded text-[11px] font-medium bg-gaming-neon-blue/20 text-gaming-neon-blue border border-gaming-neon-blue/30 hover:bg-gaming-neon-blue/30 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
