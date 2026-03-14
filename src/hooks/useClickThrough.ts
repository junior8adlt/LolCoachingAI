import { useCallback } from 'react';

// Toggle click-through on the Electron window.
// When mouse enters a panel, disable click-through so we can interact.
// When mouse leaves, re-enable so clicks go to the game.

interface ElectronAPI {
  setClickThrough?: (enabled: boolean) => Promise<boolean>;
}

function getAPI(): ElectronAPI | null {
  return (window as unknown as { electronAPI?: ElectronAPI }).electronAPI ?? null;
}

export function useClickThrough() {
  const disableClickThrough = useCallback(() => {
    getAPI()?.setClickThrough?.(false);
  }, []);

  const enableClickThrough = useCallback(() => {
    getAPI()?.setClickThrough?.(true);
  }, []);

  return { disableClickThrough, enableClickThrough };
}
