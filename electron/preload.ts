import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleOverlay: () => ipcRenderer.invoke("toggle-overlay"),
  minimize: () => ipcRenderer.invoke("minimize"),
  setClickThrough: (enabled: boolean) =>
    ipcRenderer.invoke("set-clickthrough", enabled),
  getOverlayState: () => ipcRenderer.invoke("get-overlay-state"),

  // Keybinds sync with main process
  updateKeybinds: (binds: Record<string, string>) =>
    ipcRenderer.invoke("update-keybinds", binds),
  getKeybinds: () => ipcRenderer.invoke("get-keybinds"),

  // Listen for global hotkeys fired from main process
  onGlobalKey: (callback: (action: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, action: string) =>
      callback(action);
    ipcRenderer.on("global-key", handler);
    return () => ipcRenderer.removeListener("global-key", handler);
  },

  onOverlayToggled: (callback: (visible: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, visible: boolean) =>
      callback(visible);
    ipcRenderer.on("overlay-toggled", handler);
    return () => ipcRenderer.removeListener("overlay-toggled", handler);
  },

  onClickThroughChanged: (callback: (enabled: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, enabled: boolean) =>
      callback(enabled);
    ipcRenderer.on("clickthrough-changed", handler);
    return () => ipcRenderer.removeListener("clickthrough-changed", handler);
  },
});
