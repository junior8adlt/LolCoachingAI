from __future__ import annotations

import asyncio
import logging
from typing import Any, Callable, Coroutine

from config import POLLING_INTERVAL
from models.game_state import GameState
from services.riot_client import riot_client

logger = logging.getLogger(__name__)

Callback = Callable[[GameState], Coroutine[Any, Any, None]]
EventCallback = Callable[[list[dict[str, Any]]], Coroutine[Any, Any, None]]


class GameMonitor:
    """Polls the Riot Live Client API and triggers callbacks on state changes."""

    def __init__(self) -> None:
        self._running = False
        self._task: asyncio.Task[None] | None = None
        self._game_active = False
        self._last_event_id = 0
        self._current_state: GameState | None = None

        self._on_game_start: list[Callback] = []
        self._on_game_end: list[Callback] = []
        self._on_state_update: list[Callback] = []
        self._on_events: list[EventCallback] = []

    @property
    def is_running(self) -> bool:
        return self._running

    @property
    def game_active(self) -> bool:
        return self._game_active

    @property
    def current_state(self) -> GameState | None:
        return self._current_state

    def on_game_start(self, callback: Callback) -> None:
        self._on_game_start.append(callback)

    def on_game_end(self, callback: Callback) -> None:
        self._on_game_end.append(callback)

    def on_state_update(self, callback: Callback) -> None:
        self._on_state_update.append(callback)

    def on_events(self, callback: EventCallback) -> None:
        self._on_events.append(callback)

    def start(self) -> None:
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._poll_loop())
        logger.info("Game monitor started (interval=%.1fs)", POLLING_INTERVAL)

    def stop(self) -> None:
        self._running = False
        if self._task and not self._task.done():
            self._task.cancel()
        self._task = None
        logger.info("Game monitor stopped")

    async def _poll_loop(self) -> None:
        while self._running:
            try:
                await self._poll_once()
            except asyncio.CancelledError:
                break
            except Exception:
                logger.debug("Poll error", exc_info=True)
            await asyncio.sleep(POLLING_INTERVAL)

    async def _poll_once(self) -> None:
        game_running = await riot_client.is_game_running()

        if game_running and not self._game_active:
            self._game_active = True
            self._last_event_id = 0
            logger.info("Game started")
            state = await self._fetch_state()
            if state:
                self._current_state = state
                await self._fire_callbacks(self._on_game_start, state)

        elif not game_running and self._game_active:
            self._game_active = False
            logger.info("Game ended")
            if self._current_state:
                await self._fire_callbacks(self._on_game_end, self._current_state)
            self._current_state = None
            return

        if not game_running:
            return

        state = await self._fetch_state()
        if not state:
            return

        self._current_state = state
        await self._fire_callbacks(self._on_state_update, state)
        await self._process_events()

    async def _fetch_state(self) -> GameState | None:
        try:
            raw = await riot_client.get_all_game_data()
            return GameState(**raw)
        except Exception:
            logger.debug("Failed to parse game state", exc_info=True)
            return None

    async def _process_events(self) -> None:
        try:
            events = await riot_client.get_events(self._last_event_id)
            if not events:
                return

            new_events = [e for e in events if e.get("EventID", 0) >= self._last_event_id]
            if new_events:
                max_id = max(e.get("EventID", 0) for e in new_events)
                self._last_event_id = max_id + 1

                significant = self._filter_significant(new_events)
                if significant:
                    for cb in self._on_events:
                        try:
                            await cb(significant)
                        except Exception:
                            logger.error("Event callback error", exc_info=True)
        except Exception:
            logger.debug("Event processing error", exc_info=True)

    @staticmethod
    def _filter_significant(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        significant_types = {
            "ChampionKill",
            "DragonKill",
            "HeraldKill",
            "BaronKill",
            "TurretKilled",
            "InhibKilled",
            "Multikill",
            "Ace",
            "FirstBlood",
            "GameEnd",
        }
        return [e for e in events if e.get("EventName") in significant_types]

    @staticmethod
    async def _fire_callbacks(callbacks: list[Callback], state: GameState) -> None:
        for cb in callbacks:
            try:
                await cb(state)
            except Exception:
                logger.error("Callback error", exc_info=True)


game_monitor = GameMonitor()
