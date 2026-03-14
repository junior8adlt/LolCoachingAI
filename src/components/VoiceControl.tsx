import { useState, useEffect, useCallback, useRef } from 'react';
import {
  startListening,
  stopListening,
  onVoiceInputStateChange,
  getVoiceInputState,
} from '../services/voiceInput';
import {
  isVoiceEnabled,
  setVoiceEnabled,
} from '../services/voiceCoach';
import { t } from '../services/i18n';
import {
  getKeybinds,
  getKeybindLabel,
  setKeybind,
  matchesKeybind,
  mouseButtonToName,
  keyEventToName,
  onKeybindsChange,
  onGlobalKey,
  type KeybindMap,
} from '../services/keybinds';

export function VoiceControl() {
  const [voiceState, setVoiceState] = useState(getVoiceInputState());
  const [ttsEnabled, setTtsEnabled] = useState(isVoiceEnabled());
  const [_isHolding, setIsHolding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [keybinds, setKeybindsState] = useState(getKeybinds());
  const holdingRef = useRef(false);

  useEffect(() => {
    return onVoiceInputStateChange(setVoiceState);
  }, []);

  useEffect(() => {
    return onKeybindsChange(setKeybindsState);
  }, []);

  // Listen for global hotkeys from Electron main process (works when game has focus)
  useEffect(() => {
    return onGlobalKey((action: string) => {
      // Toggle mode (keyboard): press once to start, press again to stop
      if (action === 'pushToTalk-toggle') {
        if (holdingRef.current) {
          holdingRef.current = false;
          setIsHolding(false);
          stopListening();
        } else {
          holdingRef.current = true;
          setIsHolding(true);
          startListening();
          // Auto-stop after 15s if user forgets
          setTimeout(() => {
            if (holdingRef.current) {
              holdingRef.current = false;
              setIsHolding(false);
              stopListening();
            }
          }, 15000);
        }
      }
      // Hold mode (mouse buttons): down to start, up to stop
      if (action === 'pushToTalk-down' && !holdingRef.current) {
        holdingRef.current = true;
        setIsHolding(true);
        startListening();
      }
      if (action === 'pushToTalk-up' && holdingRef.current) {
        // Small delay to let SpeechRecognition capture the last words
        setTimeout(() => {
          holdingRef.current = false;
          setIsHolding(false);
          stopListening();
        }, 500);
      }
      if (action === 'toggleVoice') {
        const next = !isVoiceEnabled();
        setVoiceEnabled(next);
        setTtsEnabled(next);
      }
    });
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const name = keyEventToName(e);

    if (matchesKeybind('pushToTalk', name) && !holdingRef.current) {
      e.preventDefault();
      holdingRef.current = true;
      setIsHolding(true);
      startListening();
    }
    if (matchesKeybind('toggleVoice', name)) {
      e.preventDefault();
      const next = !isVoiceEnabled();
      setVoiceEnabled(next);
      setTtsEnabled(next);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const name = keyEventToName(e);
    if (matchesKeybind('pushToTalk', name)) {
      e.preventDefault();
      holdingRef.current = false;
      setIsHolding(false);
      stopListening();
    }
  }, []);

  // Mouse handler for mouse button binds
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const name = mouseButtonToName(e.button);
    if (name && matchesKeybind('pushToTalk', name) && !holdingRef.current) {
      e.preventDefault();
      holdingRef.current = true;
      setIsHolding(true);
      startListening();
    }
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    const name = mouseButtonToName(e.button);
    if (name && matchesKeybind('pushToTalk', name)) {
      e.preventDefault();
      holdingRef.current = false;
      setIsHolding(false);
      stopListening();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    // Prevent context menu on right-click if bound
    const preventContext = (e: MouseEvent) => {
      const name = mouseButtonToName(e.button);
      if (name && (matchesKeybind('pushToTalk', name) || matchesKeybind('toggleVoice', name))) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', preventContext);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', preventContext);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp]);

  const { isListening, transcript, isProcessing } = voiceState;

  return (
    <div className="flex flex-col items-center gap-1.5 relative">
      {/* Mic button */}
      <button
        onMouseDown={() => { holdingRef.current = true; setIsHolding(true); startListening(); }}
        onMouseUp={() => { holdingRef.current = false; setIsHolding(false); stopListening(); }}
        onMouseLeave={() => { if (holdingRef.current) { holdingRef.current = false; setIsHolding(false); stopListening(); } }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? 'bg-gaming-neon-red/30 border-2 border-gaming-neon-red shadow-neon animate-pulse-neon'
            : isProcessing
            ? 'bg-gaming-neon-purple/20 border border-gaming-neon-purple/50'
            : 'bg-gaming-surface/80 border border-gaming-border/40 hover:border-gaming-neon-blue/40 hover:bg-gaming-surface'
        }`}
      >
        {isListening ? (
          <svg className="w-5 h-5 text-gaming-neon-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        ) : isProcessing ? (
          <div className="w-4 h-4 border-2 border-gaming-neon-purple/30 border-t-gaming-neon-purple rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        )}
      </button>

      {/* Keybind label */}
      <span className={`text-[8px] data-text ${
        isListening ? 'text-gaming-neon-red' : isProcessing ? 'text-gaming-neon-purple' : 'text-gray-600'
      }`}>
        {isListening
          ? t('ui_mic_listening')
          : isProcessing
          ? t('ui_mic_processing')
          : getKeybindLabel('pushToTalk')}
      </span>

      {/* TTS toggle */}
      <button
        onClick={() => {
          const next = !ttsEnabled;
          setVoiceEnabled(next);
          setTtsEnabled(next);
        }}
        className={`px-1.5 py-0.5 rounded text-[7px] data-text transition-colors ${
          ttsEnabled
            ? 'bg-gaming-neon-green/15 text-gaming-neon-green border border-gaming-neon-green/30'
            : 'bg-gaming-surface/50 text-gray-600 border border-gaming-border/30'
        }`}
      >
        {ttsEnabled ? t('ui_voice_on') : t('ui_voice_off')}
      </button>

      {/* Settings gear */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:text-gaming-neon-blue hover:bg-gaming-surface/50 transition-colors mt-1"
        title="Keybinds"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings panel */}
      {showSettings && (
        <KeybindSettings
          keybinds={keybinds}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Live transcript bubble */}
      {(isListening || isProcessing) && transcript && (
        <div className="absolute bottom-24 right-0 glass-panel-accent px-3 py-2 max-w-[280px] animate-fade-in">
          <p className="text-[11px] text-gray-200 italic">
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}

// ── Keybind settings popup ──

function KeybindSettings({
  keybinds,
  onClose,
}: {
  keybinds: KeybindMap;
  onClose: () => void;
}) {
  const [rebinding, setRebinding] = useState<keyof KeybindMap | null>(null);

  const actions: { key: keyof KeybindMap; label: string }[] = [
    { key: 'toggleOverlay', label: 'Overlay' },
    { key: 'pushToTalk', label: 'Push-to-Talk' },
    { key: 'toggleVoice', label: 'Voz On/Off' },
  ];

  // Listen for new keybind when rebinding
  useEffect(() => {
    if (!rebinding) return;

    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        setRebinding(null);
        return;
      }
      const name = keyEventToName(e);
      setKeybind(rebinding, name);
      setRebinding(null);
    };

    const onMouse = (e: MouseEvent) => {
      // Only capture side/extra buttons for rebind, not left/right click
      if (e.button <= 2) return;
      e.preventDefault();
      e.stopPropagation();
      const name = mouseButtonToName(e.button);
      if (name) {
        setKeybind(rebinding, name);
        setRebinding(null);
      }
    };

    window.addEventListener('keydown', onKey, true);
    window.addEventListener('mousedown', onMouse, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('mousedown', onMouse, true);
    };
  }, [rebinding]);

  return (
    <div className="absolute right-12 top-0 glass-panel-accent p-3 w-[200px] animate-fade-in z-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-gaming-neon-blue font-bold uppercase tracking-wider">
          Keybinds
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-[14px] leading-none"
        >
          x
        </button>
      </div>

      <div className="space-y-2">
        {actions.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">{label}</span>
            <button
              onClick={() => setRebinding(rebinding === key ? null : key)}
              className={`px-2 py-0.5 rounded text-[10px] data-text min-w-[60px] text-center transition-colors ${
                rebinding === key
                  ? 'bg-gaming-neon-red/20 text-gaming-neon-red border border-gaming-neon-red/40 animate-pulse-neon'
                  : 'bg-gaming-surface text-gray-300 border border-gaming-border/40 hover:border-gaming-neon-blue/40'
              }`}
            >
              {rebinding === key ? '...' : keybinds[key]}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[8px] text-gray-600 leading-relaxed">
        Click un boton y presiona la tecla o boton del mouse que quieras asignar. Esc para cancelar.
      </div>
    </div>
  );
}
