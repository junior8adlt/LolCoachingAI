import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { AIStatusType } from '../types/coaching';

const STATUS_LABELS: Record<AIStatusType, string> = {
  idle: 'READY',
  thinking: 'THINKING',
  analyzing: 'ANALYZING',
  coaching: 'COACHING',
};

const STATUS_COLORS: Record<AIStatusType, string> = {
  idle: 'text-gray-400',
  thinking: 'text-gaming-neon-blue',
  analyzing: 'text-gaming-neon-purple',
  coaching: 'text-gaming-neon-green',
};

function AnimatedDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-4 text-left">{dots}</span>;
}

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-blink text-gaming-neon-blue">|</span>
      )}
    </span>
  );
}

export function AIThinkingPanel() {
  const aiState = useGameStore((s) => s.aiState);
  const isActive = aiState.status !== 'idle';

  return (
    <div className="glass-panel w-[250px]">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-gaming-neon-blue animate-pulse-neon' : 'bg-gray-500'
            }`}
          />
          <span>AI Coach</span>
        </div>
        <span className={`text-[9px] ${STATUS_COLORS[aiState.status]}`}>
          {STATUS_LABELS[aiState.status]}
          {isActive && <AnimatedDots />}
        </span>
      </div>

      {/* Thoughts / Reasoning Chain */}
      <div className="p-2 max-h-[180px] overflow-y-auto space-y-1.5">
        {aiState.reasoningChain.length === 0 && !aiState.currentThought && (
          <div className="text-[11px] text-gray-500 italic px-1 py-2 text-center">
            {aiState.status === 'idle'
              ? 'AI coach standing by...'
              : 'Processing game state...'}
          </div>
        )}

        {aiState.reasoningChain.map((thought, i) => {
          const isLatest = i === aiState.reasoningChain.length - 1 && !aiState.currentThought;
          return (
            <div
              key={`thought-${i}`}
              className={`text-[11px] leading-relaxed px-1 ${
                isLatest ? 'text-gray-200' : 'text-gray-500'
              }`}
            >
              <span className="text-gaming-neon-blue/40 mr-1 data-text text-[9px]">
                {'>'}
              </span>
              {isLatest ? (
                <TypewriterText text={thought} speed={20} />
              ) : (
                <span>{thought}</span>
              )}
            </div>
          );
        })}

        {/* Current thought (latest, being typed) */}
        {aiState.currentThought && (
          <div className="text-[11px] leading-relaxed px-1 text-gray-200">
            <span className="text-gaming-neon-blue/40 mr-1 data-text text-[9px]">
              {'>'}
            </span>
            <TypewriterText text={aiState.currentThought} speed={20} />
          </div>
        )}
      </div>

      {/* Scan line effect when active */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gaming-neon-blue/20 to-transparent"
            style={{ animation: 'scan-line 3s linear infinite' }}
          />
        </div>
      )}
    </div>
  );
}
