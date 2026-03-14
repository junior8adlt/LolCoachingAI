import { useState, useRef, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = 'lolcoach_panel_positions';

function loadPositions(): Record<string, Position> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function savePositions(positions: Record<string, Position>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch { /* noop */ }
}

export function useDraggable(panelId: string, defaultPos?: Position) {
  const allPositions = useRef(loadPositions());
  const saved = allPositions.current[panelId];

  const [position, setPosition] = useState<Position>(
    saved ?? defaultPos ?? { x: 0, y: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const usesDefault = !saved && !defaultPos;
  const onDragEndRef = useRef<(() => void) | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setPosition((pos) => {
        const all = loadPositions();
        all[panelId] = pos;
        savePositions(all);
        return pos;
      });
      // Notify that drag ended (re-enable click-through)
      onDragEndRef.current?.();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, panelId]);

  const style: React.CSSProperties = usesDefault
    ? {}
    : {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 9999 : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
      };

  const resetPosition = useCallback(() => {
    const def = defaultPos ?? { x: 0, y: 0 };
    setPosition(def);
    const all = loadPositions();
    delete all[panelId];
    savePositions(all);
  }, [panelId, defaultPos]);

  return {
    style,
    handleMouseDown,
    isDragging,
    position,
    resetPosition,
    hasSavedPosition: !!saved,
    onDragEndRef,
  };
}
