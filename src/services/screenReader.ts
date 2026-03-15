// ── Screen Reader: Enemy HP Detection via Screen Capture ──
// Captures the game screen and analyzes pixel colors to detect enemy health bars.
// Enemy health bars in LoL are RED (HSV H:2-5, S:123-255, V:132-255).
// Only works in borderless windowed mode.
//
// Architecture:
//   Main Process captures screen → sends frame to renderer via IPC → analyze pixels
//   We do this in main process to avoid desktopCapturer limitations.

// This module runs in the RENDERER. It receives analyzed HP data from the main process.

export interface EnemyHPReading {
  detected: boolean;
  healthPercent: number;    // 0-1 estimated
  confidence: number;       // 0-1 how sure we are
  lastUpdate: number;       // timestamp
  barCount: number;         // how many red health bars detected
}

let latestReading: EnemyHPReading = {
  detected: false,
  healthPercent: 1,
  confidence: 0,
  lastUpdate: 0,
  barCount: 0,
};

export function updateHPReading(reading: EnemyHPReading): void {
  latestReading = reading;
}

export function getEnemyHPEstimate(): EnemyHPReading {
  // If reading is older than 5 seconds, it's stale
  if (Date.now() - latestReading.lastUpdate > 5000) {
    return { ...latestReading, confidence: Math.max(0, latestReading.confidence - 0.3) };
  }
  return { ...latestReading };
}

export function isEnemyLow(): boolean {
  const hp = latestReading;
  return hp.detected && hp.healthPercent < 0.35 && hp.confidence > 0.4;
}

export function isEnemyVeryLow(): boolean {
  const hp = latestReading;
  return hp.detected && hp.healthPercent < 0.2 && hp.confidence > 0.5;
}

// Setup IPC listener for HP data from main process
export function initScreenReader(): void {
  const api = (window as unknown as { electronAPI?: {
    onEnemyHP?: (cb: (data: EnemyHPReading) => void) => () => void
  }}).electronAPI;

  if (api?.onEnemyHP) {
    api.onEnemyHP((data) => {
      updateHPReading(data);
    });
    console.log('[ScreenReader] Listening for enemy HP data from main process');
  } else {
    console.log('[ScreenReader] No IPC bridge for screen capture - enemy HP detection disabled');
  }
}
