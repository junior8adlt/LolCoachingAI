from __future__ import annotations

import logging
from typing import Any

import httpx

from config import RIOT_API_BASE

logger = logging.getLogger(__name__)


class RiotClient:
    """Client for the League of Legends Live Client Data API (localhost)."""

    def __init__(self, base_url: str | None = None) -> None:
        self._base_url = (base_url or RIOT_API_BASE).rstrip("/")

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self._base_url,
            verify=False,
            timeout=httpx.Timeout(5.0, connect=3.0),
        )

    async def get_all_game_data(self) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get("/liveclientdata/allgamedata")
            resp.raise_for_status()
            return resp.json()

    async def get_active_player(self) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get("/liveclientdata/activeplayer")
            resp.raise_for_status()
            return resp.json()

    async def get_player_list(self) -> list[dict[str, Any]]:
        async with self._client() as client:
            resp = await client.get("/liveclientdata/playerlist")
            resp.raise_for_status()
            return resp.json()

    async def get_game_stats(self) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get("/liveclientdata/gamestats")
            resp.raise_for_status()
            return resp.json()

    async def get_events(self, event_id: int = 0) -> list[dict[str, Any]]:
        async with self._client() as client:
            resp = await client.get(
                "/liveclientdata/eventdata",
                params={"eventID": event_id},
            )
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, dict):
                return data.get("Events", [])
            return data

    async def is_game_running(self) -> bool:
        try:
            async with self._client() as client:
                resp = await client.get("/liveclientdata/gamestats")
                return resp.status_code == 200
        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.ReadTimeout, OSError):
            return False
        except Exception:
            logger.debug("Unexpected error checking game status", exc_info=True)
            return False


riot_client = RiotClient()
