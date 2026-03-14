import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from './stores/gameStore';
import { Overlay } from './components/Overlay';
import { StatusIndicator } from './components/StatusIndicator';
import { startPolling, stopPolling } from './services/gameLoop';
import { matchesKeybind, keyEventToName } from './services/keybinds';

function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const overlayVisible = useGameStore((s) => s.overlayVisible);
  const toggleOverlay = useGameStore((s) => s.toggleOverlay);
  const pollingStarted = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (matchesKeybind('toggleOverlay', keyEventToName(e))) {
        e.preventDefault();
        toggleOverlay();
      }
    },
    [toggleOverlay],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!pollingStarted.current) {
      pollingStarted.current = true;
      startPolling();
    }
    return () => {
      stopPolling();
      pollingStarted.current = false;
    };
  }, []);

  // Listen for overlay toggle from Electron main process (global hotkey)
  useEffect(() => {
    const api = (window as unknown as { electronAPI?: { onOverlayToggled?: (cb: (v: boolean) => void) => () => void } }).electronAPI;
    if (api?.onOverlayToggled) {
      return api.onOverlayToggled((visible: boolean) => {
        const store = useGameStore.getState();
        if (store.overlayVisible !== visible) {
          store.toggleOverlay();
        }
      });
    }
  }, []);

  const isInGame = gamePhase === 'EARLY_GAME' || gamePhase === 'MID_GAME' || gamePhase === 'LATE_GAME';

  return (
    <div className="w-full h-full relative select-none" style={{ background: 'transparent' }}>
      {/* Status indicator always visible */}
      <StatusIndicator />

      {/* Waiting state */}
      {gamePhase === 'WAITING' && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="glass-panel-accent p-6 text-center max-w-sm">
            <div className="text-gaming-neon-blue text-lg font-bold mb-2 text-shadow-neon">
              LolCoachingAI
            </div>
            <div className="text-gray-400 text-sm mb-3">
              Waiting for game to start...
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gaming-neon-blue animate-pulse-neon" />
              <span className="text-xs text-gray-500 data-text">
                Polling game client
              </span>
            </div>
            <div className="mt-4 text-[10px] text-gray-600">
              Press <kbd className="px-1.5 py-0.5 rounded bg-gaming-surface text-gray-400 border border-gaming-border">F9</kbd> to toggle overlay
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {gamePhase === 'LOADING' && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="glass-panel-accent p-6 text-center max-w-md">
            <div className="text-gaming-neon-blue text-lg font-bold mb-2 text-shadow-neon">
              Game Loading
            </div>
            <div className="text-gray-400 text-sm mb-4">
              Analyzing matchup and preparing coaching...
            </div>
            <div className="w-full h-1 bg-gaming-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gaming-neon-blue to-gaming-neon-purple rounded-full"
                style={{
                  animation: 'loading-bar 2s ease-in-out infinite',
                  width: '60%',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main overlay (in-game and post-game) */}
      {(isInGame || gamePhase === 'POST_GAME') && overlayVisible && (
        <Overlay />
      )}
    </div>
  );
}

export default App;
