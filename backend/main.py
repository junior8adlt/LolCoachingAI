from __future__ import annotations

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import BACKEND_PORT, POLLING_INTERVAL
from models.coaching import (
    CoachingRequest,
    CoachingResponse,
    JunglePredictionRequest,
    JunglePredictionResponse,
    MatchupRequest,
    MatchupResponse,
    PostGameRequest,
    PostGameResponse,
)
from models.game_state import GameState
from services.ai_coach import ai_coach
from services.game_monitor import game_monitor
from services.riot_client import riot_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# WebSocket connection manager
# ---------------------------------------------------------------------------

class ConnectionManager:
    def __init__(self) -> None:
        self._connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self._connections.append(ws)
        logger.info("WebSocket client connected (%d total)", len(self._connections))

    def disconnect(self, ws: WebSocket) -> None:
        if ws in self._connections:
            self._connections.remove(ws)
        logger.info("WebSocket client disconnected (%d remaining)", len(self._connections))

    async def broadcast(self, data: dict[str, Any]) -> None:
        dead: list[WebSocket] = []
        for ws in self._connections:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


# ---------------------------------------------------------------------------
# Game monitor callbacks
# ---------------------------------------------------------------------------

async def _on_state_update(state: GameState) -> None:
    summary = state.to_summary()
    await manager.broadcast({"type": "game_state", "data": summary})


async def _on_game_start(state: GameState) -> None:
    logger.info("Game detected - broadcasting start event")
    await manager.broadcast({"type": "game_start", "data": state.to_summary()})


async def _on_game_end(state: GameState) -> None:
    logger.info("Game ended - broadcasting end event")
    await manager.broadcast({"type": "game_end", "data": state.to_summary()})


async def _on_events(events: list[dict[str, Any]]) -> None:
    await manager.broadcast({"type": "game_events", "data": events})


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    game_monitor.on_state_update(_on_state_update)
    game_monitor.on_game_start(_on_game_start)
    game_monitor.on_game_end(_on_game_end)
    game_monitor.on_events(_on_events)
    game_monitor.start()
    logger.info("LolCoachingAI backend started on port %d", BACKEND_PORT)
    yield
    game_monitor.stop()
    logger.info("LolCoachingAI backend stopped")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="LolCoachingAI",
    description="AI-powered League of Legends coaching backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health & game status endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "LolCoachingAI"}


@app.get("/api/game/status")
async def game_status() -> dict[str, Any]:
    running = await riot_client.is_game_running()
    return {
        "running": running,
        "monitor_active": game_monitor.is_running,
    }


@app.get("/api/game/state")
async def game_state() -> dict[str, Any]:
    running = await riot_client.is_game_running()
    if not running:
        return {"running": False, "state": None}

    try:
        raw = await riot_client.get_all_game_data()
        state = GameState(**raw)
        return {"running": True, "state": state.to_summary()}
    except Exception as exc:
        logger.error("Failed to fetch game state: %s", exc)
        return {"running": False, "state": None, "error": str(exc)}


# ---------------------------------------------------------------------------
# Coaching endpoints
# ---------------------------------------------------------------------------

@app.post("/api/coaching/advice", response_model=CoachingResponse)
async def coaching_advice(request: CoachingRequest) -> CoachingResponse:
    try:
        state = GameState(**request.game_state)
    except Exception:
        state = GameState()

    return await ai_coach.generate_coaching_tips(state, request.player_name)


@app.post("/api/coaching/matchup", response_model=MatchupResponse)
async def matchup_analysis(request: MatchupRequest) -> MatchupResponse:
    return await ai_coach.analyze_matchup(
        your_champion=request.your_champion,
        enemy_champion=request.enemy_champion,
        lane=request.lane,
        game_time=request.game_time,
    )


@app.post("/api/coaching/reasoning")
async def coaching_reasoning(request: CoachingRequest) -> dict[str, Any]:
    try:
        state = GameState(**request.game_state)
    except Exception:
        state = GameState()

    return await ai_coach.generate_reasoning(state, request.player_name)


@app.post("/api/coaching/jungle-prediction", response_model=JunglePredictionResponse)
async def jungle_prediction(request: JunglePredictionRequest) -> JunglePredictionResponse:
    try:
        state = GameState(**request.game_state)
    except Exception:
        state = GameState()

    return await ai_coach.predict_jungle(state, request.events)


@app.post("/api/coaching/ask")
async def ask_coach(request: dict[str, Any]) -> dict[str, Any]:
    """Voice question endpoint - player asks the AI coach a question."""
    question = request.get("question", "")
    language = request.get("language", "es")
    game_state_raw = request.get("game_state", {})

    try:
        state = GameState(**game_state_raw) if game_state_raw else GameState()
    except Exception:
        state = GameState()

    return await ai_coach.answer_question(question, state, language)


@app.post("/api/transcribe")
async def transcribe_audio(request: dict[str, Any]) -> dict[str, Any]:
    """Transcribe audio from the overlay mic. Converts WebM to WAV then uses Google STT."""
    import base64
    import tempfile
    import os
    import speech_recognition as sr
    from pydub import AudioSegment

    audio_b64 = request.get("audio", "")
    lang = request.get("language", "es-MX")

    if not audio_b64:
        return {"text": "", "error": "No audio data"}

    try:
        audio_bytes = base64.b64decode(audio_b64)

        # Save raw audio (WebM from MediaRecorder)
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
            f.write(audio_bytes)
            webm_path = f.name

        # Convert WebM to WAV using pydub + ffmpeg
        wav_path = webm_path.replace(".webm", ".wav")
        audio_segment = AudioSegment.from_file(webm_path, format="webm")
        audio_segment.export(wav_path, format="wav")

        # Transcribe with Google Speech Recognition (free, no API key)
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio = recognizer.record(source)

        text = recognizer.recognize_google(audio, language=lang)
        logger.info("Transcribed: %s", text)

        # Cleanup temp files
        try:
            os.unlink(webm_path)
            os.unlink(wav_path)
        except Exception:
            pass

        return {"text": text}
    except sr.UnknownValueError:
        return {"text": "", "error": "Could not understand audio"}
    except sr.RequestError as e:
        return {"text": "", "error": f"Speech service error: {e}"}
    except Exception as e:
        logger.error("Transcription error: %s", e)
        return {"text": "", "error": str(e)}


@app.post("/api/coaching/post-game", response_model=PostGameResponse)
async def post_game_report(request: PostGameRequest) -> PostGameResponse:
    return await ai_coach.generate_post_game_report(
        game_data=request.game_data,
        events_history=request.events_history,
    )


# ---------------------------------------------------------------------------
# WebSocket
# ---------------------------------------------------------------------------

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await manager.connect(ws)
    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_json({"type": "error", "data": "invalid json"})
                continue

            msg_type = msg.get("type", "")

            if msg_type == "ping":
                await ws.send_json({"type": "pong"})

            elif msg_type == "request_state":
                if game_monitor.current_state:
                    await ws.send_json({
                        "type": "game_state",
                        "data": game_monitor.current_state.to_summary(),
                    })
                else:
                    await ws.send_json({"type": "game_state", "data": None})

            elif msg_type == "request_advice":
                player_name = msg.get("player_name", "")
                if game_monitor.current_state and player_name:
                    response = await ai_coach.generate_coaching_tips(
                        game_monitor.current_state, player_name
                    )
                    await ws.send_json({
                        "type": "coaching_advice",
                        "data": response.model_dump(),
                    })
                else:
                    await ws.send_json({
                        "type": "coaching_advice",
                        "data": {"tips": [], "reasoning": "No active game or player name.", "ai_state": "idle"},
                    })

            else:
                await ws.send_json({"type": "error", "data": f"unknown message type: {msg_type}"})

    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        logger.error("WebSocket error", exc_info=True)
        manager.disconnect(ws)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=BACKEND_PORT,
        reload=True,
        log_level="info",
    )
