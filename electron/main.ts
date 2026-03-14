import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
  screen,
} from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isClickThrough = true;
let isOverlayVisible = true;
let mousePoller: ReturnType<typeof setInterval> | null = null;

const isDev = !app.isPackaged;

// ── Current keybind config (synced from renderer) ──
let keybinds = {
  toggleOverlay: "F1",
  pushToTalk: "Mouse4",
  toggleVoice: "F3",
};

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size; // full screen, not workArea

  mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    focusable: false, // Don't steal focus from the game
    type: "toolbar",   // Helps with game overlay on Windows
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Highest possible z-order for game overlays
  mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // Prevent the overlay from appearing in alt-tab
  mainWindow.setSkipTaskbar(true);

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Periodically re-assert alwaysOnTop (some games reset it)
  setInterval(() => {
    if (mainWindow && isOverlayVisible && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    }
  }, 3000);
}

// ── Global Shortcuts ──
// These work even when the game has focus

function registerGlobalShortcuts(): void {
  unregisterGlobalShortcuts();

  const overlayKey = keybinds.toggleOverlay;
  const voiceKey = keybinds.toggleVoice;
  const pttKey = keybinds.pushToTalk;

  // Toggle overlay
  if (!overlayKey.startsWith("Mouse")) {
    try {
      globalShortcut.register(normalizeForElectron(overlayKey), () => {
        toggleOverlay();
      });
    } catch (e) {
      console.error(`Failed to register overlay shortcut "${overlayKey}":`, e);
    }
  }

  // Toggle voice
  if (!voiceKey.startsWith("Mouse")) {
    try {
      globalShortcut.register(normalizeForElectron(voiceKey), () => {
        mainWindow?.webContents.send("global-key", "toggleVoice");
      });
    } catch (e) {
      console.error(`Failed to register voice shortcut "${voiceKey}":`, e);
    }
  }

  // Push-to-talk (keyboard keys only - mouse handled by polling)
  if (!pttKey.startsWith("Mouse")) {
    try {
      globalShortcut.register(normalizeForElectron(pttKey), () => {
        mainWindow?.webContents.send("global-key", "pushToTalk-down");
      });
    } catch (e) {
      console.error(`Failed to register PTT shortcut "${pttKey}":`, e);
    }
  }

  // Start mouse button polling if any bind uses mouse
  if (
    overlayKey.startsWith("Mouse") ||
    voiceKey.startsWith("Mouse") ||
    pttKey.startsWith("Mouse")
  ) {
    startMousePolling();
  } else {
    stopMousePolling();
  }
}

function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll();
}

// Normalize key names to Electron accelerator format
function normalizeForElectron(key: string): string {
  // Already in electron format for simple keys
  return key
    .replace("Ctrl+", "CommandOrControl+")
    .replace("Meta+", "Super+");
}

// ── Mouse Button Polling ──
// Electron doesn't have global mouse button events, so we poll
// Windows API GetAsyncKeyState for mouse side buttons

// Virtual key codes for mouse buttons
const VK_XBUTTON1 = 0x05; // Mouse4 (back)
const VK_XBUTTON2 = 0x06; // Mouse5 (forward)

function mouseNameToVK(name: string): number | null {
  switch (name) {
    case "Mouse4": return VK_XBUTTON1;
    case "Mouse5": return VK_XBUTTON2;
    default: return null;
  }
}

let pttMouseDown = false;

function startMousePolling(): void {
  if (mousePoller) return;

  // Try to load ffi for GetAsyncKeyState
  // If not available, fall back to a note in the console
  let getAsyncKeyState: ((vk: number) => number) | null = null;

  try {
    // Dynamic import of koffi or ffi-napi if available
    // For now, use a simpler approach: poll via PowerShell is too slow,
    // so we use Electron's built-in approach with a raw addon check
    //
    // Since we can't guarantee native modules, we use a polling approach
    // that checks mouse state via the renderer's pointer events
    console.log("[Main] Mouse button polling: using IPC bridge mode");
  } catch {
    console.log("[Main] Native mouse polling not available");
  }

  // Fallback: The renderer will handle mouse buttons directly since
  // the overlay window forwards mouse events. For global capture when
  // game has focus, we instruct users to use keyboard keys or we
  // provide a helper script.
  //
  // For Mouse4/Mouse5 to work IN-GAME, we'll create a tiny AHK-style
  // bridge or use the raw input approach.

  mousePoller = setInterval(() => {
    // This interval keeps the polling alive - actual mouse detection
    // is handled via the preload bridge for now
  }, 100);
}

function stopMousePolling(): void {
  if (mousePoller) {
    clearInterval(mousePoller);
    mousePoller = null;
  }
}

// ── Overlay toggle ──

function toggleOverlay(): void {
  if (!mainWindow) return;

  isOverlayVisible = !isOverlayVisible;

  if (isOverlayVisible) {
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
  } else {
    mainWindow.hide();
  }

  mainWindow.webContents.send("overlay-toggled", isOverlayVisible);
}

function setClickThrough(enabled: boolean): void {
  if (!mainWindow) return;

  isClickThrough = enabled;
  mainWindow.setIgnoreMouseEvents(enabled, { forward: true });
  mainWindow.webContents.send("clickthrough-changed", enabled);
}

// ── Tray ──

function createTray(): void {
  const iconPath = isDev
    ? path.join(__dirname, "../public/icon.png")
    : path.join(__dirname, "../dist/icon.png");

  let trayIcon: Electron.NativeImage;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
  } catch {
    trayIcon = nativeImage.createEmpty();
  }

  if (trayIcon.isEmpty()) {
    trayIcon = nativeImage.createFromBuffer(
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAADlJREFUOI1jYBhowEgqg/9TMDDcJ0cTIwMDwwVyNLEwMDAw/CdHEwsDAwMDuS5gIVcTCzawBhIAAH4FBgETVaomAAAAAElFTkSuQmCC",
        "base64"
      )
    );
  }

  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip("LolCoachingAI");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Toggle Overlay (or use hotkey)",
      click: () => toggleOverlay(),
    },
    {
      label: "Toggle Click-Through",
      click: () => setClickThrough(!isClickThrough),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => toggleOverlay());
}

// ── IPC Handlers ──

function registerIpcHandlers(): void {
  ipcMain.handle("toggle-overlay", () => {
    toggleOverlay();
    return isOverlayVisible;
  });

  ipcMain.handle("minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.handle("set-clickthrough", (_event, enabled: boolean) => {
    setClickThrough(enabled);
    return isClickThrough;
  });

  ipcMain.handle("get-overlay-state", () => ({
    isVisible: isOverlayVisible,
    isClickThrough,
  }));

  // Renderer tells us keybinds changed -> re-register global shortcuts
  ipcMain.handle("update-keybinds", (_event, newBinds: typeof keybinds) => {
    keybinds = { ...keybinds, ...newBinds };
    registerGlobalShortcuts();
    return true;
  });

  // Renderer requests current keybinds
  ipcMain.handle("get-keybinds", () => keybinds);
}

// ── App lifecycle ──

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  createTray();
  registerGlobalShortcuts();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  unregisterGlobalShortcuts();
  stopMousePolling();
  if (tray) {
    tray.destroy();
    tray = null;
  }
});
