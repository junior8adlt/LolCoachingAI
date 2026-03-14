import { contextBridge, ipcRenderer } from "electron";

export interface ElectronAPI {
  toggleOverlay: () => Promise<boolean>;
  minimize: () => Promise<void>;
  setClickThrough: (enabled: boolean) => Promise<boolean>;
  getOverlayState: () => Promise<{
    isVisible: boolean;
    isClickThrough: boolean;
  }>;
  onOverlayToggled: (callback: (visible: boolean) => void) => () => void;
  onClickThroughChanged: (callback: (enabled: boolean) => void) => () => void;
  onGameStateUpdate: (callback: (state: unknown) => void) => () => void;
}

contextBridge.exposeInMainWorld("electronAPI", {
  toggleOverlay: () => ipcRenderer.invoke("toggle-overlay"),

  minimize: () => ipcRenderer.invoke("minimize"),

  setClickThrough: (enabled: boolean) =>
    ipcRenderer.invoke("set-clickthrough", enabled),

  getOverlayState: () => ipcRenderer.invoke("get-overlay-state"),

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

  onGameStateUpdate: (callback: (state: unknown) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: unknown) =>
      callback(state);
    ipcRenderer.on("game-state-update", handler);
    return () => ipcRenderer.removeListener("game-state-update", handler);
  },
} satisfies ElectronAPI);
