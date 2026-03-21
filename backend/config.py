from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# Try backend/.env first, then project root .env
_backend_env = Path(__file__).resolve().parent / ".env"
_root_env = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_backend_env)
load_dotenv(_root_env)  # Project root .env (where the key actually is)


ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
RIOT_API_BASE: str = os.getenv("RIOT_API_BASE", "https://127.0.0.1:2999")
BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8420"))
AI_MODEL: str = os.getenv("AI_MODEL", "claude-sonnet-4-6")
POLLING_INTERVAL: float = float(os.getenv("POLLING_INTERVAL", "1.5"))
