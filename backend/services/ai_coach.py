from __future__ import annotations

import json
import logging
from typing import Any

import anthropic

from config import AI_MODEL, ANTHROPIC_API_KEY
from models.coaching import (
    CoachingResponse,
    CoachingTip,
    GradeBreakdown,
    MatchupResponse,
    JunglePredictionResponse,
    PostGameResponse,
    Priority,
)
from models.game_state import GameState

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Challenger-level League of Legends coach providing real-time advice.

Rules:
- Analyze the game state data provided and give specific, actionable advice.
- Consider champion matchups, power spikes, gold/XP advantages.
- Track objective timers and jungle pressure.
- Be concise - players need quick advice they can read during the game.
- Prioritize the most impactful advice first.
- Reference specific game data (gold diff, KDA, CS) in your reasoning.
- Consider the current game time when giving advice (early/mid/late game).
- Always respond with valid JSON matching the requested schema."""

MATCHUP_PROMPT = """You are a Challenger-level League of Legends coach specializing in champion matchups.

Provide detailed matchup analysis between two champions in a specific lane.
Consider:
- Win conditions for both sides
- Power spike timings (levels 1-3, 6, 11, 16, item spikes)
- Trading patterns
- All-in windows
- Jungle gank setup and vulnerability
- Itemization advice

Always respond with valid JSON matching the requested schema."""

POST_GAME_PROMPT = """You are a Challenger-level League of Legends coach doing a post-game review.

Analyze the full game data and provide:
- Performance grades (S/A/B/C/D) for each category
- Key mistakes with timestamps
- Specific improvement tips
- Statistical analysis

Be honest but constructive. Focus on patterns, not individual plays.
Always respond with valid JSON matching the requested schema."""


class AICoach:
    """Claude-powered coaching engine."""

    def __init__(self) -> None:
        self._client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        self._matchup_cache: dict[str, MatchupResponse] = {}

    async def generate_coaching_tips(
        self, game_state: GameState, player_name: str
    ) -> CoachingResponse:
        summary = game_state.to_summary()
        player = game_state.get_player(player_name)
        enemies = game_state.get_enemies(player_name)
        allies = game_state.get_allies(player_name)

        team_kills = game_state.get_team_kills(player.team) if player else 0
        enemy_team = "CHAOS" if (player and player.team == "ORDER") else "ORDER"
        enemy_kills = game_state.get_team_kills(enemy_team)

        user_msg = json.dumps(
            {
                "game_state": summary,
                "player_name": player_name,
                "your_champion": player.championName if player else "Unknown",
                "your_kda": f"{player.scores.kills}/{player.scores.deaths}/{player.scores.assists}" if player else "0/0/0",
                "your_cs": player.scores.creepScore if player else 0,
                "team_kills": team_kills,
                "enemy_kills": enemy_kills,
                "enemies": [
                    {
                        "champion": e.championName,
                        "kda": f"{e.scores.kills}/{e.scores.deaths}/{e.scores.assists}",
                        "level": e.level,
                    }
                    for e in enemies
                ],
                "allies": [
                    {
                        "champion": a.championName,
                        "kda": f"{a.scores.kills}/{a.scores.deaths}/{a.scores.assists}",
                        "level": a.level,
                    }
                    for a in allies
                ],
                "response_schema": {
                    "tips": [{"message": "string", "priority": "low|medium|high|critical", "category": "string"}],
                    "reasoning": "string",
                },
            },
            indent=2,
        )

        try:
            response = await self._client.messages.create(
                model=AI_MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )

            raw = response.content[0].text
            data = _extract_json(raw)

            tips = [
                CoachingTip(
                    message=t.get("message", ""),
                    priority=Priority(t.get("priority", "medium")),
                    category=t.get("category", "general"),
                )
                for t in data.get("tips", [])
            ]

            return CoachingResponse(
                tips=tips,
                reasoning=data.get("reasoning", ""),
                ai_state="ready",
            )

        except anthropic.RateLimitError:
            logger.warning("AI rate limited")
            return CoachingResponse(
                tips=[CoachingTip(message="AI rate limited, try again shortly.", priority=Priority.LOW)],
                reasoning="",
                ai_state="rate_limited",
            )
        except Exception as exc:
            logger.error("AI coaching error: %s", exc, exc_info=True)
            return CoachingResponse(
                tips=[CoachingTip(message="Could not generate coaching advice.", priority=Priority.LOW)],
                reasoning=str(exc),
                ai_state="error",
            )

    async def analyze_matchup(
        self, your_champion: str, enemy_champion: str, lane: str, game_time: float = 0.0
    ) -> MatchupResponse:
        cache_key = f"{your_champion}|{enemy_champion}|{lane}"
        if cache_key in self._matchup_cache:
            return self._matchup_cache[cache_key]

        user_msg = json.dumps(
            {
                "your_champion": your_champion,
                "enemy_champion": enemy_champion,
                "lane": lane,
                "game_time": game_time,
                "response_schema": {
                    "difficulty": "int 1-5 (1=easy, 5=very hard)",
                    "tips": ["list of matchup tips"],
                    "power_spikes": {
                        "yours": ["your power spike descriptions"],
                        "theirs": ["enemy power spike descriptions"],
                    },
                    "lane_summary": "overall matchup summary",
                },
            },
            indent=2,
        )

        try:
            response = await self._client.messages.create(
                model=AI_MODEL,
                max_tokens=1024,
                system=MATCHUP_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )

            data = _extract_json(response.content[0].text)

            result = MatchupResponse(
                difficulty=int(data.get("difficulty", 3)),
                tips=data.get("tips", []),
                power_spikes=data.get("power_spikes", {}),
                lane_summary=data.get("lane_summary", ""),
            )
            self._matchup_cache[cache_key] = result
            return result

        except anthropic.RateLimitError:
            logger.warning("AI rate limited during matchup analysis")
            return MatchupResponse(lane_summary="AI rate limited. Try again shortly.")
        except Exception as exc:
            logger.error("Matchup analysis error: %s", exc, exc_info=True)
            return MatchupResponse(lane_summary=f"Error: {exc}")

    async def generate_reasoning(
        self, game_state: GameState, player_name: str
    ) -> dict[str, Any]:
        summary = game_state.to_summary()

        user_msg = json.dumps(
            {
                "game_state": summary,
                "player_name": player_name,
                "instruction": (
                    "Walk through your reasoning step by step about the current game state. "
                    "Evaluate win conditions, threats, and what the player should focus on."
                ),
                "response_schema": {
                    "chain_of_thought": ["step1", "step2", "..."],
                    "final_advice": "string",
                    "win_condition": "string",
                    "biggest_threat": "string",
                },
            },
            indent=2,
        )

        try:
            response = await self._client.messages.create(
                model=AI_MODEL,
                max_tokens=1500,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )
            return _extract_json(response.content[0].text)
        except Exception as exc:
            logger.error("Reasoning error: %s", exc, exc_info=True)
            return {
                "chain_of_thought": [f"Error: {exc}"],
                "final_advice": "Unable to generate reasoning.",
                "win_condition": "unknown",
                "biggest_threat": "unknown",
            }

    async def predict_jungle(
        self, game_state: GameState, events: list[dict[str, Any]]
    ) -> JunglePredictionResponse:
        summary = game_state.to_summary()

        user_msg = json.dumps(
            {
                "game_state": summary,
                "events": events[-30:],
                "instruction": (
                    "Based on the events and game state, predict where the enemy jungler "
                    "is most likely located. Assess gank risk for each lane."
                ),
                "response_schema": {
                    "predicted_side": "topside|botside|mid|base|unknown",
                    "confidence": "float 0-1",
                    "gank_risk": {"top": 0.0, "mid": 0.0, "bot": 0.0},
                    "reasoning": "string",
                },
            },
            indent=2,
        )

        try:
            response = await self._client.messages.create(
                model=AI_MODEL,
                max_tokens=800,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )
            data = _extract_json(response.content[0].text)
            return JunglePredictionResponse(
                predicted_side=data.get("predicted_side", "unknown"),
                confidence=float(data.get("confidence", 0.0)),
                gank_risk=data.get("gank_risk", {}),
                reasoning=data.get("reasoning", ""),
            )
        except Exception as exc:
            logger.error("Jungle prediction error: %s", exc, exc_info=True)
            return JunglePredictionResponse(reasoning=f"Error: {exc}")

    async def generate_post_game_report(
        self, game_data: dict[str, Any], events_history: list[dict[str, Any]]
    ) -> PostGameResponse:
        user_msg = json.dumps(
            {
                "game_data": game_data,
                "events": events_history[-100:],
                "response_schema": {
                    "grades": {
                        "laning": "S/A/B/C/D",
                        "farming": "S/A/B/C/D",
                        "fighting": "S/A/B/C/D",
                        "vision": "S/A/B/C/D",
                        "objectives": "S/A/B/C/D",
                        "overall": "S/A/B/C/D",
                    },
                    "key_mistakes": ["mistake with timestamp"],
                    "improvement_tips": ["specific tip"],
                    "stats": {"cs_per_min": 0, "kp": 0, "vision_score": 0},
                    "summary": "overall game summary",
                },
            },
            indent=2,
        )

        try:
            response = await self._client.messages.create(
                model=AI_MODEL,
                max_tokens=2000,
                system=POST_GAME_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )
            data = _extract_json(response.content[0].text)

            grades_data = data.get("grades", {})
            grades = GradeBreakdown(
                laning=grades_data.get("laning", "B"),
                farming=grades_data.get("farming", "B"),
                fighting=grades_data.get("fighting", "B"),
                vision=grades_data.get("vision", "B"),
                objectives=grades_data.get("objectives", "B"),
                overall=grades_data.get("overall", "B"),
            )

            return PostGameResponse(
                grades=grades,
                key_mistakes=data.get("key_mistakes", []),
                improvement_tips=data.get("improvement_tips", []),
                stats=data.get("stats", {}),
                summary=data.get("summary", ""),
            )
        except Exception as exc:
            logger.error("Post-game report error: %s", exc, exc_info=True)
            return PostGameResponse(summary=f"Error generating report: {exc}")


def _extract_json(text: str) -> dict[str, Any]:
    """Extract JSON from AI response, handling markdown code blocks."""
    text = text.strip()
    if text.startswith("```"):
        first_newline = text.index("\n")
        last_fence = text.rfind("```")
        if last_fence > first_newline:
            text = text[first_newline + 1 : last_fence].strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        raise


ai_coach = AICoach()
