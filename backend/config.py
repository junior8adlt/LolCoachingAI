from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_path)


ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
RIOT_API_BASE: str = os.getenv("RIOT_API_BASE", "https://127.0.0.1:2999")
BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8420"))
AI_MODEL: str = os.getenv("AI_MODEL", "claude-sonnet-4-20250514")
POLLING_INTERVAL: float = float(os.getenv("POLLING_INTERVAL", "1.5"))
