import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { CoachBanner } from './CoachBanner';
import { MiniStats } from './MiniStats';
import { ObjectiveBar } from './ObjectiveBar';
import { PostGameReport } from './PostGameReport';
import { VoiceControl } from './VoiceControl';
import { DraggablePanel } from './DraggablePanel';
import { MapPressureBar } from './MapPressureBar';
import { EnemyThreatList } from './EnemyThreatList';
import { AIThinkingPanel } from './AIThinkingPanel';

export function Overlay() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const postGameAnalysis = useGameStore((s) => s.postGameAnalysis);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* ═══ THE COACH ═══ */}
      {/* Center-top: The main coaching banner — BIG, temporary, color-coded */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-full max-w-[520px] px-4">
        <CoachBanner />
      </div>

      {/* ═══ AMBIENT MICRO-WIDGETS ═══ */}
      {/* Bottom-left: CS + Jungle (tiny) */}
      <div className="absolute bottom-2 left-2">
        <DraggablePanel id="mini-stats">
          <MiniStats />
        </DraggablePanel>
      </div>

      {/* Bottom-right: Objective timers + Map pressure */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
        <DraggablePanel id="map-pressure">
          <MapPressureBar />
        </DraggablePanel>
        <DraggablePanel id="obj-bar">
          <ObjectiveBar />
        </DraggablePanel>
      </div>

      {/* Right edge: Voice control */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto">
        <VoiceControl />
      </div>

      {/* ═══ DEBUG / EXPANDED PANELS (hidden by default) ═══ */}
      {/* Toggle with backtick key or small button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="absolute top-1 left-1 pointer-events-auto w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[8px] text-gray-600 transition-colors z-50"
        title="Toggle debug panels"
      >
        {showDebug ? '−' : '+'}
      </button>

      {showDebug && (
        <>
          <div className="absolute top-8 left-2 animate-fade-in">
            <DraggablePanel id="debug-ai">
              <AIThinkingPanel />
            </DraggablePanel>
          </div>
          <div className="absolute top-8 right-2 animate-fade-in">
            <DraggablePanel id="debug-threats">
              <EnemyThreatList />
            </DraggablePanel>
          </div>
        </>
      )}

      {/* ═══ POST-GAME ═══ */}
      {gamePhase === 'POST_GAME' && postGameAnalysis && (
        <div className="absolute inset-0 pointer-events-auto">
          <PostGameReport />
        </div>
      )}
    </div>
  );
}
