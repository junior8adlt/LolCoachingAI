import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  session,
  Tray,
  Menu,
  nativeImage,
  screen,
} from "electron";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Allow Riot's self-signed SSL cert
app.commandLine.appendSwitch("ignore-certificate-errors");

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
  toggleOverlay: "F9",
  pushToTalk: "Mouse5",
  toggleVoice: "F10",
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
      preload: path.join(__dirname, "../electron/preload.cjs"),
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
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Periodically re-assert alwaysOnTop (games can reset window z-order)
  setInterval(() => {
    if (mainWindow && isOverlayVisible && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
      mainWindow.moveTop();
    }
  }, 2000);
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
      const ok = globalShortcut.register(normalizeForElectron(overlayKey), () => {
        console.log(`[Hotkey] ${overlayKey} pressed -> toggle overlay`);
        toggleOverlay();
      });
      console.log(`[Hotkey] Register ${overlayKey}: ${ok ? "SUCCESS" : "FAILED"}`);
    } catch (e) {
      console.error(`[Hotkey] Failed to register "${overlayKey}":`, e);
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

  // Push-to-talk: handled by iohook (supports both keydown AND keyup)
  // No need for globalShortcut for PTT - iohook handles it with proper hold mode
  console.log(`[Hotkey] PTT "${pttKey}" will be handled by iohook (hold mode)`);

  // Start iohook for PTT (handles both mouse buttons and keyboard with keyup)
  startMousePolling();
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

// ── Global Input Hook (iohook) ──
// Captures keyboard AND mouse buttons globally, including keyup.
// Works even when game has focus. No PowerShell polling needed.

import { createRequire } from "module";
const require = createRequire(import.meta.url);

let iohookInstance: any = null;
let pttMouseDown = false;
let pttKeyDown = false;

// Map our bind names to iohook button/key codes
function getIohookMouseButton(name: string): number | null {
  switch (name) {
    case "Mouse4": return 4;
    case "Mouse5": return 5;
    case "MouseMiddle": return 2;
    default: return null;
  }
}

// Map key names to iohook keycodes (common ones)
const KEY_TO_IOHOOK: Record<string, number> = {
  F1: 59, F2: 60, F3: 61, F4: 62, F5: 63, F6: 64,
  F7: 65, F8: 66, F9: 67, F10: 68, F11: 87, F12: 88,
  Escape: 1, Tab: 15, Space: 57,
  "1": 2, "2": 3, "3": 4, "4": 5, "5": 6,
  "6": 7, "7": 8, "8": 9, "9": 10, "0": 11,
  Q: 16, W: 17, E: 18, R: 19, T: 20, Y: 21, U: 22, I: 23, O: 24, P: 25,
  A: 30, S: 31, D: 32, F: 33, G: 34, H: 35, J: 36, K: 37, L: 38,
  Z: 44, X: 45, C: 46, V: 47, B: 48, N: 49, M: 50,
};

function startMousePolling(): void {
  if (iohookInstance) return;

  try {
    const iohook = require("@tkomde/iohook");
    iohookInstance = iohook;

    const pttBind = keybinds.pushToTalk;
    const isMouseBind = pttBind.startsWith("Mouse");

    if (isMouseBind) {
      const targetButton = getIohookMouseButton(pttBind);
      if (!targetButton) {
        console.log(`[iohook] Unknown mouse button: ${pttBind}`);
        return;
      }

      console.log(`[iohook] Listening for ${pttBind} (button ${targetButton})`);

      iohook.on("mousedown", (event: { button: number }) => {
        if (event.button === targetButton && !pttMouseDown) {
          pttMouseDown = true;
          console.log(`[iohook] ${pttBind} DOWN`);
          mainWindow?.webContents.send("global-key", "pushToTalk-down");
        }
      });

      iohook.on("mouseup", (event: { button: number }) => {
        if (event.button === targetButton && pttMouseDown) {
          pttMouseDown = false;
          console.log(`[iohook] ${pttBind} UP`);
          mainWindow?.webContents.send("global-key", "pushToTalk-up");
        }
      });
    } else {
      // Keyboard PTT with keyup support via iohook
      const keycode = KEY_TO_IOHOOK[pttBind];
      if (keycode) {
        console.log(`[iohook] Listening for ${pttBind} (keycode ${keycode}) with keyup`);

        iohook.on("keydown", (event: { keycode: number }) => {
          if (event.keycode === keycode && !pttKeyDown) {
            pttKeyDown = true;
            mainWindow?.webContents.send("global-key", "pushToTalk-down");
          }
        });

        iohook.on("keyup", (event: { keycode: number }) => {
          if (event.keycode === keycode && pttKeyDown) {
            pttKeyDown = false;
            mainWindow?.webContents.send("global-key", "pushToTalk-up");
          }
        });
      }
    }

    iohook.start();
    console.log("[iohook] Global input hook started");

  } catch (err) {
    console.error("[iohook] Failed to start:", err);
    console.log("[iohook] Push-to-talk may not work for mouse buttons. Use a keyboard key instead.");
  }
}

function stopMousePolling(): void {
  if (mousePoller) {
    clearInterval(mousePoller);
    mousePoller = null;
  }
  if (iohookInstance) {
    try {
      iohookInstance.stop();
    } catch { /* ignore */ }
    iohookInstance = null;
  }
  pttMouseDown = false;
  pttKeyDown = false;
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

// ── Riot API proxy (Node.js https, bypasses SSL issues) ──

function riotApiFetch(endpoint: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const url = `https://127.0.0.1:2999${endpoint}`;
    const req = https.get(url, { rejectUnauthorized: false, timeout: 3000 }, (res) => {
      let data = "";
      res.on("data", (chunk: string) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON from Riot API"));
        }
      });
    });
    req.on("error", (err: Error) => reject(err));
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
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

  // Game detected - aggressively force overlay on top
  ipcMain.handle("force-overlay-show", () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    isOverlayVisible = true;
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    mainWindow.moveTop();
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
    // Re-assert several times rapidly to beat the game's window management
    const reassert = () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
        mainWindow.moveTop();
      }
    };
    setTimeout(reassert, 500);
    setTimeout(reassert, 1500);
    setTimeout(reassert, 3000);
    setTimeout(reassert, 5000);
  });

  // Renderer tells us keybinds changed -> re-register global shortcuts
  ipcMain.handle("update-keybinds", (_event, newBinds: typeof keybinds) => {
    keybinds = { ...keybinds, ...newBinds };
    registerGlobalShortcuts();
    return true;
  });

  // Renderer requests current keybinds
  ipcMain.handle("get-keybinds", () => keybinds);

  // ── Riot API proxy calls ──
  ipcMain.handle("riot-api-fetch", async (_event, endpoint: string) => {
    try {
      const data = await riotApiFetch(endpoint);
      console.log(`[RiotProxy] OK: ${endpoint}`);
      return { ok: true, data };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`[RiotProxy] FAIL: ${endpoint} -> ${msg}`);
      return { ok: false, error: msg };
    }
  });
}

// ── App lifecycle ──

// Accept Riot's self-signed SSL certificate on 127.0.0.1:2999
app.on("certificate-error", (event, _webContents, url, _error, _cert, callback) => {
  if (url.startsWith("https://127.0.0.1:2999")) {
    event.preventDefault();
    callback(true); // trust it
  } else {
    callback(false);
  }
});

app.whenReady().then(() => {
  // Grant microphone permission for voice input (SpeechRecognition)
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['media', 'mediaKeySystem', 'midi', 'notifications', 'audioCapture'];
    callback(allowed.includes(permission));
  });

  // Also grant via permission check handler
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media' || (permission as string) === 'audioCapture';
  });

  // Trust Riot's self-signed cert on 127.0.0.1 for renderer fetch()
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    if (request.hostname === "127.0.0.1") {
      callback(0); // Trust
    } else {
      callback(-2); // Use default Chromium verification
    }
  });

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
