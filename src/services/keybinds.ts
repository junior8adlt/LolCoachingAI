// ── Keybind system: configurable hotkeys with mouse button support ──
// Syncs with Electron main process for global shortcuts (work even when game has focus)

export interface KeybindMap {
  toggleOverlay: string;
  pushToTalk: string;
  toggleVoice: string;
}

const STORAGE_KEY = 'lolcoach_keybinds';

const DEFAULT_KEYBINDS: KeybindMap = {
  toggleOverlay: 'F9',       // F1-F5 are used by LoL
  pushToTalk: 'F8',
  toggleVoice: 'F10',
};

let keybinds: KeybindMap = { ...DEFAULT_KEYBINDS };

// ── Electron bridge ──

interface ElectronAPI {
  updateKeybinds?: (binds: Record<string, string>) => Promise<boolean>;
  onGlobalKey?: (callback: (action: string) => void) => () => void;
}

function getElectronAPI(): ElectronAPI | null {
  return (window as unknown as { electronAPI?: ElectronAPI }).electronAPI ?? null;
}

// ── Persistence ──

function loadKeybinds(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<KeybindMap>;
      // Migrate old F1/F3 defaults that conflict with LoL
      if (parsed.toggleOverlay === 'F1') parsed.toggleOverlay = DEFAULT_KEYBINDS.toggleOverlay;
      if (parsed.toggleVoice === 'F3') parsed.toggleVoice = DEFAULT_KEYBINDS.toggleVoice;
      keybinds = { ...DEFAULT_KEYBINDS, ...parsed };
      saveKeybinds(); // persist migration
    }
  } catch {
    keybinds = { ...DEFAULT_KEYBINDS };
  }
}

function saveKeybinds(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keybinds));
  } catch { /* noop */ }
}

// Sync keybinds to Electron main process so globalShortcut updates
async function syncToMain(): Promise<void> {
  const api = getElectronAPI();
  if (api?.updateKeybinds) {
    try {
      await api.updateKeybinds({ ...keybinds });
    } catch {
      // Not in Electron context
    }
  }
}

// ── Public API ──

export function getKeybinds(): KeybindMap {
  return { ...keybinds };
}

export function setKeybind(action: keyof KeybindMap, key: string): void {
  keybinds[action] = key;
  saveKeybinds();
  syncToMain();
  notifyListeners();
}

export function resetKeybinds(): void {
  keybinds = { ...DEFAULT_KEYBINDS };
  saveKeybinds();
  syncToMain();
  notifyListeners();
}

// ── Input matching ──

export function mouseButtonToName(button: number): string | null {
  switch (button) {
    case 0: return 'MouseLeft';
    case 1: return 'MouseMiddle';
    case 2: return 'MouseRight';
    case 3: return 'Mouse4';
    case 4: return 'Mouse5';
    default: return `Mouse${button}`;
  }
}

export function keyEventToName(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey && e.key !== 'Shift') parts.push('Shift');

  let key = e.key;
  if (key === ' ') key = 'Space';
  if (key.length === 1) key = key.toUpperCase();

  parts.push(key);
  return parts.join('+');
}

export function matchesKeybind(action: keyof KeybindMap, inputName: string): boolean {
  return keybinds[action] === inputName;
}

export function isMouseBind(action: keyof KeybindMap): boolean {
  return keybinds[action].startsWith('Mouse');
}

export function getKeybindLabel(action: keyof KeybindMap): string {
  return keybinds[action];
}

// ── Global key listener (from Electron main process) ──

type GlobalKeyCallback = (action: string) => void;
const globalKeyCallbacks: GlobalKeyCallback[] = [];

export function onGlobalKey(cb: GlobalKeyCallback): () => void {
  globalKeyCallbacks.push(cb);
  return () => {
    const idx = globalKeyCallbacks.indexOf(cb);
    if (idx >= 0) globalKeyCallbacks.splice(idx, 1);
  };
}

function setupGlobalKeyListener(): void {
  const api = getElectronAPI();
  if (api?.onGlobalKey) {
    api.onGlobalKey((action: string) => {
      for (const cb of globalKeyCallbacks) {
        cb(action);
      }
    });
  }
}

// ── Change listeners ──

type KeybindChangeCallback = (binds: KeybindMap) => void;
const listeners: KeybindChangeCallback[] = [];

function notifyListeners(): void {
  const current = getKeybinds();
  for (const cb of listeners) cb(current);
}

export function onKeybindsChange(cb: KeybindChangeCallback): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

// ── Initialize ──
loadKeybinds();
syncToMain();
setupGlobalKeyListener();
