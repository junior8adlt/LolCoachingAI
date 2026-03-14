from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class CoachingTip(BaseModel):
    message: str
    priority: Priority = Priority.MEDIUM
    category: str = "general"


class CoachingRequest(BaseModel):
    game_state: dict[str, Any]
    player_name: str
    game_time: float


class CoachingResponse(BaseModel):
    tips: list[CoachingTip] = Field(default_factory=list)
    reasoning: str = ""
    ai_state: str = "ready"


class MatchupRequest(BaseModel):
    your_champion: str
    enemy_champion: str
    lane: str
    game_time: float = 0.0


class MatchupResponse(BaseModel):
    difficulty: int = 3
    tips: list[str] = Field(default_factory=list)
    power_spikes: dict[str, list[str]] = Field(default_factory=dict)
    lane_summary: str = ""


class JunglePredictionRequest(BaseModel):
    game_state: dict[str, Any]
    events: list[dict[str, Any]] = Field(default_factory=list)


class JunglePredictionResponse(BaseModel):
    predicted_side: str = "unknown"
    confidence: float = 0.0
    gank_risk: dict[str, float] = Field(default_factory=dict)
    reasoning: str = ""


class GradeBreakdown(BaseModel):
    laning: str = "B"
    farming: str = "B"
    fighting: str = "B"
    vision: str = "B"
    objectives: str = "B"
    overall: str = "B"


class PostGameRequest(BaseModel):
    game_data: dict[str, Any]
    events_history: list[dict[str, Any]] = Field(default_factory=list)


class PostGameResponse(BaseModel):
    grades: GradeBreakdown = Field(default_factory=GradeBreakdown)
    key_mistakes: list[str] = Field(default_factory=list)
    improvement_tips: list[str] = Field(default_factory=list)
    stats: dict[str, Any] = Field(default_factory=dict)
    summary: str = ""
