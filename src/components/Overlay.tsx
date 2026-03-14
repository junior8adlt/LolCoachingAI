import { useGameStore } from '../stores/gameStore';
import { AIThinkingPanel } from './AIThinkingPanel';
import { CoachingTipPanel } from './CoachingTipPanel';
import { EnemyThreatList } from './EnemyThreatList';
import { FarmTracker } from './FarmTracker';
import { JungleTracker } from './JungleTracker';
import { ObjectiveTimers } from './ObjectiveTimers';
import { MatchupAnalysis } from './MatchupAnalysis';
import { PostGameReport } from './PostGameReport';

export function Overlay() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const matchupInfo = useGameStore((s) => s.matchupInfo);
  const postGameAnalysis = useGameStore((s) => s.postGameAnalysis);

  const showMatchup = matchupInfo && (gamePhase === 'LOADING' || gamePhase === 'EARLY_GAME');

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-left: AI Thinking Panel */}
      <div className="absolute top-3 left-3 pointer-events-auto animate-slide-in-left">
        <AIThinkingPanel />
      </div>

      {/* Top-right: Enemy Threat List */}
      <div className="absolute top-3 right-3 pointer-events-auto animate-slide-in-right">
        <EnemyThreatList />
      </div>

      {/* Bottom-left: Farm Tracker + Jungle Tracker */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-2 pointer-events-auto">
        <div className="animate-slide-in-left">
          <FarmTracker />
        </div>
        <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          <JungleTracker />
        </div>
      </div>

      {/* Bottom-right: Objective Timers */}
      <div className="absolute bottom-3 right-3 pointer-events-auto animate-slide-in-right">
        <ObjectiveTimers />
      </div>

      {/* Center-bottom: Coaching Tip Panel */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto animate-slide-in-up">
        <CoachingTipPanel />
      </div>

      {/* Matchup Analysis - shows during loading/early game */}
      {showMatchup && (
        <div className="absolute top-14 left-3 pointer-events-auto animate-fade-in">
          <MatchupAnalysis />
        </div>
      )}

      {/* Full-screen Post-game report */}
      {gamePhase === 'POST_GAME' && postGameAnalysis && (
        <div className="absolute inset-0 pointer-events-auto">
          <PostGameReport />
        </div>
      )}
    </div>
  );
}
