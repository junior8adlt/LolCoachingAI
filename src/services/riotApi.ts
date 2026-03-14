import type {
  AllGameData,
  ActivePlayer,
  PlayerInfo,
  GameData,
  GameEvent,
  Item,
  Scores,
} from '../types/game';

// ── Riot API client ──
// Uses Electron IPC proxy to bypass SSL cert issues.
// Falls back to direct fetch if not in Electron.

interface ElectronRiotAPI {
  riotApiFetch?: (endpoint: string) => Promise<{ ok: boolean; data?: unknown; error?: string }>;
}

function getElectronAPI(): ElectronRiotAPI | null {
  return (window as unknown as { electronAPI?: ElectronRiotAPI }).electronAPI ?? null;
}

const BASE_URL = 'https://127.0.0.1:2999';
const REQUEST_TIMEOUT = 3000;

async function riotFetch<T>(endpoint: string): Promise<T> {
  // Try Electron IPC proxy first (bypasses SSL)
  const api = getElectronAPI();
  if (api?.riotApiFetch) {
    console.log(`[RiotAPI] IPC proxy -> ${endpoint}`);
    const result = await api.riotApiFetch(endpoint);
    if (!result.ok) {
      throw new RiotApiError(result.error ?? 'Riot API error', 0);
    }
    return result.data as T;
  }

  // Fallback: direct fetch (works in browser dev, may fail SSL in Electron)
  console.log(`[RiotAPI] No IPC, using direct fetch -> ${endpoint}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new RiotApiError(
        `Riot API returned ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof RiotApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new RiotApiError('Request timed out', 408);
    }
    throw new RiotApiError(
      `Failed to connect to League client: ${error instanceof Error ? error.message : String(error)}`,
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export class RiotApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'RiotApiError';
    this.statusCode = statusCode;
  }
}

export async function getAllGameData(eventId?: number): Promise<AllGameData> {
  const query = eventId !== undefined ? `?eventID=${eventId}` : '';
  return riotFetch<AllGameData>(`/liveclientdata/allgamedata${query}`);
}

export async function getActivePlayer(): Promise<ActivePlayer> {
  return riotFetch<ActivePlayer>('/liveclientdata/activeplayer');
}

export async function getPlayerList(): Promise<PlayerInfo[]> {
  return riotFetch<PlayerInfo[]>('/liveclientdata/playerlist');
}

export async function getGameStats(): Promise<GameData> {
  return riotFetch<GameData>('/liveclientdata/gamestats');
}

export async function getEventData(eventId?: number): Promise<GameEvent[]> {
  const query = eventId !== undefined ? `?eventID=${eventId}` : '';
  const result = await riotFetch<{ Events: GameEvent[] }>(
    `/liveclientdata/eventdata${query}`
  );
  return result.Events;
}

export async function getPlayerItems(summonerName: string): Promise<Item[]> {
  const encoded = encodeURIComponent(summonerName);
  return riotFetch<Item[]>(
    `/liveclientdata/playeritems?summonerName=${encoded}`
  );
}

export async function getPlayerScores(summonerName: string): Promise<Scores> {
  const encoded = encodeURIComponent(summonerName);
  return riotFetch<Scores>(
    `/liveclientdata/playerscores?summonerName=${encoded}`
  );
}

export async function isGameRunning(): Promise<boolean> {
  try {
    await riotFetch<GameData>('/liveclientdata/gamestats');
    return true;
  } catch {
    return false;
  }
}

export const riotApi = {
  getAllGameData,
  getActivePlayer,
  getPlayerList,
  getGameStats,
  getEventData,
  getPlayerItems,
  getPlayerScores,
  isGameRunning,
};
