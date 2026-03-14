import {
  app,
  BrowserWindow,
  ipcMain,
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

const isDev = !app.isPackaged;

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

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
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

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
      label: "Toggle Overlay",
      click: () => toggleOverlay(),
    },
    {
      label: "Toggle Click-Through",
      click: () => setClickThrough(!isClickThrough),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    toggleOverlay();
  });
}

function toggleOverlay(): void {
  if (!mainWindow) return;

  isOverlayVisible = !isOverlayVisible;

  if (isOverlayVisible) {
    mainWindow.show();
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
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  createTray();
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

app.on("before-quit", () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
});
