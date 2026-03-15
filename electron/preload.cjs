const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleOverlay: () => ipcRenderer.invoke("toggle-overlay"),
  minimize: () => ipcRenderer.invoke("minimize"),
  setClickThrough: (enabled) => ipcRenderer.invoke("set-clickthrough", enabled),
  getOverlayState: () => ipcRenderer.invoke("get-overlay-state"),

  // Keybinds
  updateKeybinds: (binds) => ipcRenderer.invoke("update-keybinds", binds),
  getKeybinds: () => ipcRenderer.invoke("get-keybinds"),

  // Riot API proxy (bypasses SSL + CORS)
  riotApiFetch: (endpoint) => ipcRenderer.invoke("riot-api-fetch", endpoint),

  // Force overlay on top
  forceOverlayShow: () => ipcRenderer.invoke("force-overlay-show"),

  // Enemy HP from screen capture
  onEnemyHP: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("enemy-hp-update", handler);
    return () => ipcRenderer.removeListener("enemy-hp-update", handler);
  },

  // Global hotkeys from main process
  onGlobalKey: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on("global-key", handler);
    return () => ipcRenderer.removeListener("global-key", handler);
  },

  onOverlayToggled: (callback) => {
    const handler = (_event, visible) => callback(visible);
    ipcRenderer.on("overlay-toggled", handler);
    return () => ipcRenderer.removeListener("overlay-toggled", handler);
  },

  onClickThroughChanged: (callback) => {
    const handler = (_event, enabled) => callback(enabled);
    ipcRenderer.on("clickthrough-changed", handler);
    return () => ipcRenderer.removeListener("clickthrough-changed", handler);
  },
});
