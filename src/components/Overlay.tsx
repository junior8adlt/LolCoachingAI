import { useGameStore } from '../stores/gameStore';
import { AIThinkingPanel } from './AIThinkingPanel';
import { CoachingTipPanel } from './CoachingTipPanel';
import { EnemyThreatList } from './EnemyThreatList';
import { FarmTracker } from './FarmTracker';
import { JungleTracker } from './JungleTracker';
import { ObjectiveTimers } from './ObjectiveTimers';
import { MatchupAnalysis } from './MatchupAnalysis';
import { PostGameReport } from './PostGameReport';
import { VoiceControl } from './VoiceControl';
import { DraggablePanel } from './DraggablePanel';

export function Overlay() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const matchupInfo = useGameStore((s) => s.matchupInfo);
  const postGameAnalysis = useGameStore((s) => s.postGameAnalysis);

  const showMatchup = matchupInfo && (gamePhase === 'LOADING' || gamePhase === 'EARLY_GAME');

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-left: AI Thinking Panel */}
      <div className="absolute top-3 left-3 animate-slide-in-left">
        <DraggablePanel id="ai-thinking">
          <AIThinkingPanel />
        </DraggablePanel>
      </div>

      {/* Top-right: Enemy Threat List */}
      <div className="absolute top-3 right-3 animate-slide-in-right">
        <DraggablePanel id="enemy-threats">
          <EnemyThreatList />
        </DraggablePanel>
      </div>

      {/* Bottom-left: Farm Tracker + Jungle Tracker */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-2">
        <DraggablePanel id="farm-tracker">
          <FarmTracker />
        </DraggablePanel>
        <DraggablePanel id="jungle-tracker">
          <JungleTracker />
        </DraggablePanel>
      </div>

      {/* Bottom-right: Objective Timers */}
      <div className="absolute bottom-3 right-3 animate-slide-in-right">
        <DraggablePanel id="objectives">
          <ObjectiveTimers />
        </DraggablePanel>
      </div>

      {/* Center-bottom: Coaching Tip Panel */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-slide-in-up">
        <DraggablePanel id="coaching-tips">
          <CoachingTipPanel />
        </DraggablePanel>
      </div>

      {/* Right-center: Voice Control */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto">
        <VoiceControl />
      </div>

      {/* Matchup Analysis */}
      {showMatchup && (
        <div className="absolute top-14 left-3 animate-fade-in">
          <DraggablePanel id="matchup">
            <MatchupAnalysis />
          </DraggablePanel>
        </div>
      )}

      {/* Post-game report */}
      {gamePhase === 'POST_GAME' && postGameAnalysis && (
        <div className="absolute inset-0 pointer-events-auto">
          <PostGameReport />
        </div>
      )}
    </div>
  );
}
