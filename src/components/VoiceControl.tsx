import { useState, useEffect, useCallback } from 'react';
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

export function VoiceControl() {
  const [voiceState, setVoiceState] = useState(getVoiceInputState());
  const [ttsEnabled, setTtsEnabled] = useState(isVoiceEnabled());
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    return onVoiceInputStateChange(setVoiceState);
  }, []);

  // F2 = push-to-talk, F3 = toggle TTS
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F2' && !isHolding) {
      e.preventDefault();
      setIsHolding(true);
      startListening();
    }
    if (e.key === 'F3') {
      e.preventDefault();
      const next = !isVoiceEnabled();
      setVoiceEnabled(next);
      setTtsEnabled(next);
    }
  }, [isHolding]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault();
      setIsHolding(false);
      stopListening();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const { isListening, transcript, isProcessing } = voiceState;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Mic button */}
      <button
        onMouseDown={() => { setIsHolding(true); startListening(); }}
        onMouseUp={() => { setIsHolding(false); stopListening(); }}
        onMouseLeave={() => { if (isHolding) { setIsHolding(false); stopListening(); } }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? 'bg-gaming-neon-red/30 border-2 border-gaming-neon-red shadow-neon animate-pulse-neon'
            : isProcessing
            ? 'bg-gaming-neon-purple/20 border border-gaming-neon-purple/50'
            : 'bg-gaming-surface/80 border border-gaming-border/40 hover:border-gaming-neon-blue/40 hover:bg-gaming-surface'
        }`}
      >
        {isListening ? (
          // Mic active icon (recording)
          <svg className="w-5 h-5 text-gaming-neon-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        ) : isProcessing ? (
          // Processing spinner
          <div className="w-4 h-4 border-2 border-gaming-neon-purple/30 border-t-gaming-neon-purple rounded-full animate-spin" />
        ) : (
          // Mic idle icon
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        )}
      </button>

      {/* Status label */}
      <span className={`text-[8px] data-text ${
        isListening ? 'text-gaming-neon-red' : isProcessing ? 'text-gaming-neon-purple' : 'text-gray-600'
      }`}>
        {isListening
          ? t('ui_mic_listening')
          : isProcessing
          ? t('ui_mic_processing')
          : 'F2'}
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

      {/* Live transcript bubble */}
      {(isListening || isProcessing) && transcript && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 glass-panel-accent px-3 py-2 max-w-[300px] animate-fade-in">
          <p className="text-[11px] text-gray-200 italic">
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}
