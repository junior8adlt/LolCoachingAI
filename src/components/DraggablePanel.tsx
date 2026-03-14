import { type ReactNode, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { useClickThrough } from '../hooks/useClickThrough';

interface DraggablePanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DraggablePanel({ id, children, className = '' }: DraggablePanelProps) {
  const { style, handleMouseDown, isDragging, hasSavedPosition, onDragEndRef } = useDraggable(id);
  const { disableClickThrough, enableClickThrough } = useClickThrough();

  // When drag ends, re-enable click-through
  useEffect(() => {
    onDragEndRef.current = enableClickThrough;
  }, [enableClickThrough, onDragEndRef]);

  return (
    <div
      style={hasSavedPosition ? style : undefined}
      className={`pointer-events-auto ${className} ${isDragging ? 'opacity-90' : ''}`}
      onMouseEnter={disableClickThrough}
      onMouseLeave={() => {
        // Only re-enable if not currently dragging
        if (!isDragging) enableClickThrough();
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-2 rounded-t cursor-grab active:cursor-grabbing transition-colors flex items-center justify-center ${
          isDragging
            ? 'bg-gaming-neon-blue/40'
            : 'bg-transparent hover:bg-gaming-neon-blue/20'
        }`}
        title="Arrastra para mover"
      >
        <div className="w-8 h-0.5 rounded bg-gray-600/50" />
      </div>
      {children}
    </div>
  );
}
