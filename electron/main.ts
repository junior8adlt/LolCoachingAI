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
  pushToTalk: "F8",
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
    focusable: true, // Must be true for drag/click to work on panels
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

  // Don't steal focus when shown - the game keeps focus
  mainWindow.showInactive();
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

  // Push-to-talk: iohook handles hold mode (keydown+keyup).
  // Also register globalShortcut as FALLBACK (toggle mode) in case iohook fails.
  if (!pttKey.startsWith("Mouse")) {
    try {
      globalShortcut.register(normalizeForElectron(pttKey), () => {
        // Toggle mode fallback: press to start, press again to stop
        mainWindow?.webContents.send("global-key", "pushToTalk-toggle");
      });
      console.log(`[Hotkey] PTT "${pttKey}" registered as globalShortcut fallback (toggle mode)`);
    } catch (e) {
      console.error(`[Hotkey] Failed to register PTT fallback:`, e);
    }
  }

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

    if (!isMouseBind) {
      // Keyboard PTT uses globalShortcut, no need for iohook
      console.log(`[iohook] Skipping - keyboard PTT uses globalShortcut`);
      return;
    }

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
      // Keyboard PTT: handled by globalShortcut (toggle mode), NOT iohook
      // iohook keyboard conflicts with globalShortcut - only use iohook for mouse
      console.log(`[iohook] Keyboard PTT "${pttBind}" handled by globalShortcut, not iohook`);
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

// ── Screen Capture: Enemy HP Detection ──
// Captures a region of the screen and counts red pixels (enemy health bars).

let screenCaptureInterval: ReturnType<typeof setInterval> | null = null;

async function startScreenCapture(): Promise<void> {
  if (screenCaptureInterval) return;

  let Monitor: any;
  let sharp: any;
  try {
    const nsModule = require("node-screenshots");
    Monitor = nsModule.Monitor;
    sharp = require("sharp");
    console.log("[ScreenCapture] Libraries loaded");
  } catch (err) {
    console.error("[ScreenCapture] Failed to load libraries:", err);
    return;
  }

  screenCaptureInterval = setInterval(async () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    try {
      const monitors = Monitor.all();
      if (monitors.length === 0) return;
      const monitor = monitors[0];

      // Capture the screen
      const image = monitor.captureImageSync();
      if (!image) return;

      const width = image.width;
      const height = image.height;

      // Analyze the CENTER area of screen where fights happen
      // Enemy health bars are above champions, usually in the middle 60% of screen
      const regionX = Math.floor(width * 0.2);
      const regionY = Math.floor(height * 0.15);
      const regionW = Math.floor(width * 0.6);
      const regionH = Math.floor(height * 0.5);

      const rawBuf = image.toRaw();
      if (!rawBuf || rawBuf.length === 0) return;

      // Use sharp to extract the region
      const region = await sharp(rawBuf, {
        raw: { width, height, channels: 4 }
      })
        .extract({ left: regionX, top: regionY, width: regionW, height: regionH })
        .raw()
        .toBuffer();

      // Count RED pixels (enemy health bars)
      // Enemy HP bar: R > 180, G < 60, B < 60 (bright red)
      // Also check for the specific HSV range H:2-5
      let redPixels = 0;
      let totalSignificantPixels = 0;
      let redRunLengths: number[] = []; // consecutive red pixels = health bar width
      let currentRun = 0;

      const pixelCount = region.length / 3;
      for (let i = 0; i < region.length; i += 3) {
        const r = region[i];
        const g = region[i + 1];
        const b = region[i + 2];

        // Is this an enemy health bar pixel?
        const isEnemyHP = r > 160 && g < 70 && b < 70 && r > g * 2.5 && r > b * 2.5;

        if (isEnemyHP) {
          redPixels++;
          currentRun++;
        } else {
          if (currentRun > 15) { // Minimum bar width ~15 pixels
            redRunLengths.push(currentRun);
          }
          currentRun = 0;
        }

        if (r > 40 || g > 40 || b > 40) {
          totalSignificantPixels++;
        }
      }

      // A health bar is typically 60-120 pixels wide
      const validBars = redRunLengths.filter((len) => len >= 15 && len <= 200);
      const barCount = validBars.length;

      // Estimate enemy HP from the ratio of red pixels in detected bars
      // More red = more HP remaining
      let healthPercent = 1.0;
      let confidence = 0;
      let detected = false;

      if (barCount > 0 && redPixels > 50) {
        detected = true;
        // Average bar width compared to expected full bar (~100px at 1080p)
        const avgBarWidth = validBars.reduce((a, b) => a + b, 0) / validBars.length;
        const expectedFullBar = Math.min(120, width / 16); // Scale with resolution
        healthPercent = Math.min(1, avgBarWidth / expectedFullBar);
        confidence = Math.min(0.8, barCount * 0.15 + (redPixels > 200 ? 0.2 : 0));
      }

      mainWindow.webContents.send("enemy-hp-update", {
        detected,
        healthPercent: Math.round(healthPercent * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        lastUpdate: Date.now(),
        barCount,
      });

    } catch {
      // Silently fail - screen capture is best-effort
    }
  }, 2000); // Every 2 seconds

  console.log("[ScreenCapture] Started (2s interval)");
}

function stopScreenCapture(): void {
  if (screenCaptureInterval) {
    clearInterval(screenCaptureInterval);
    screenCaptureInterval = null;
  }
}

// ── Neural TTS (Microsoft Edge voices) ──

let ttsReady = false;
let MsEdgeTTS: any = null;
let ttsInstance: any = null;

let OUTPUT_FORMAT: any = null;

async function initTTS(): Promise<void> {
  try {
    const msedge = require("msedge-tts");
    MsEdgeTTS = msedge.MsEdgeTTS;
    OUTPUT_FORMAT = msedge.OUTPUT_FORMAT;
    ttsInstance = new MsEdgeTTS();
    await ttsInstance.setMetadata("es-MX-DaliaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    ttsReady = true;
    console.log("[TTS] Microsoft Edge neural voice initialized (es-MX-DaliaNeural)");
  } catch (err) {
    console.error("[TTS] Failed to init neural TTS:", err);
    ttsReady = false;
  }
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
    // Start screen capture for enemy HP detection
    startScreenCapture();
  });

  // Renderer tells us keybinds changed -> re-register global shortcuts
  ipcMain.handle("update-keybinds", (_event, newBinds: typeof keybinds) => {
    keybinds = { ...keybinds, ...newBinds };
    registerGlobalShortcuts();
    return true;
  });

  // Renderer requests current keybinds
  ipcMain.handle("get-keybinds", () => keybinds);

  // Neural TTS - speak with Microsoft Edge voice
  ipcMain.handle("speak-neural", async (_event, text: string, lang: string) => {
    if (!ttsReady || !ttsInstance) return { ok: false };
    try {
      // Switch voice based on language
      const voice = lang === "es" ? "es-MX-DaliaNeural" : "en-US-GuyNeural";
      await ttsInstance.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const ttsDir = require("path").join(require("os").tmpdir(), "lolcoach_tts");
      require("fs").mkdirSync(ttsDir, { recursive: true });
      const result = await ttsInstance.toFile(ttsDir, text);
      const audioPath = result.audioFilePath;
      console.log("[TTS] Generated:", audioPath);

      // Play MP3 from main process using Windows Media Player COM object
      const { exec } = require("child_process");
      const psCommand = `
        Add-Type -AssemblyName presentationCore
        $p = New-Object System.Windows.Media.MediaPlayer
        $p.Open([Uri]'${audioPath.replace(/\\/g, '/')}')
        $p.Play()
        Start-Sleep -Seconds 10
      `.replace(/\n/g, '; ');
      exec(`powershell -NoProfile -Command "${psCommand}"`, { windowsHide: true });
      // Also send to renderer as backup
      mainWindow?.webContents.send("play-tts-audio", audioPath);
      return { ok: true };
    } catch (err) {
      console.error("[TTS] Speak error:", err);
      return { ok: false };
    }
  });

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
  initTTS();
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
  stopScreenCapture();
  if (tray) {
    tray.destroy();
    tray = null;
  }
});
