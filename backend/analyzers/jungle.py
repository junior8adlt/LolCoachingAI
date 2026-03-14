from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class JunglePrediction:
    predicted_side: str  # "topside", "botside", "mid", "base", "unknown"
    confidence: float  # 0.0 - 1.0
    last_seen_time: float  # game seconds
    last_seen_location: str
    reasoning: str


# Standard first clear routes for popular junglers
_STANDARD_CLEARS: dict[str, list[str]] = {
    "LeeSin": ["Red", "Raptors", "Wolves", "Blue", "Gromp", "Gank top/mid"],
    "Elise": ["Red", "Blue", "Gromp", "Gank mid/top"],
    "Evelynn": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Karthus": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Graves": ["Red", "Krugs", "Raptors", "Wolves", "Blue", "Gromp", "Full clear"],
    "Nidalee": ["Blue", "Gromp", "Red", "Gank"],
    "Viego": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Kayn": ["Red", "Raptors", "Wolves", "Blue", "Gromp", "Full clear"],
    "Hecarim": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Jarvan IV": ["Red", "Blue", "Gromp", "Gank"],
    "Vi": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Warwick": ["Blue", "Gromp", "Wolves", "Red", "Raptors", "Gank"],
    "Amumu": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Diana": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Shaco": ["Red (box stack)", "Raptors", "Gank mid/bot"],
    "RekSai": ["Red", "Raptors", "Wolves", "Blue", "Gromp", "Gank"],
    "Kindred": ["Red", "Raptors", "Wolves", "Blue", "Gromp", "Invade/Contest marks"],
    "Lillia": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Sejuani": ["Blue", "Gromp", "Wolves", "Red", "Raptors", "Gank"],
    "Zac": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Gank with E"],
    "Nocturne": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Udyr": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Xinzhao": ["Red", "Blue", "Gromp", "Gank"],
    "Ivern": ["Red (mark)", "Blue (mark)", "Gromp", "Wolves", "Raptors", "Collect all"],
    "BelVeth": ["Blue", "Gromp", "Wolves", "Raptors", "Red", "Krugs", "Full clear"],
    "Briar": ["Red", "Raptors", "Wolves", "Blue", "Gromp", "Gank"],
}

# Camp respawn timers in seconds
CAMP_TIMERS: dict[str, float] = {
    "Blue": 300.0,
    "Red": 300.0,
    "Gromp": 135.0,
    "Wolves": 135.0,
    "Raptors": 135.0,
    "Krugs": 135.0,
    "Scuttle": 150.0,
}

# Camp initial spawn times
CAMP_INITIAL_SPAWN: dict[str, float] = {
    "Blue": 90.0,
    "Red": 90.0,
    "Gromp": 90.0,
    "Wolves": 90.0,
    "Raptors": 90.0,
    "Krugs": 90.0,
    "Scuttle": 210.0,
}


def get_standard_clear(champion: str) -> list[str]:
    """Return the standard jungle clear route for a champion."""
    return _STANDARD_CLEARS.get(champion, [
        "Unknown clear path. Watch for their first gank timing.",
        "Most junglers finish first clear around 3:15-3:30.",
    ])


def estimate_camp_timers(events: list[dict[str, Any]], game_time: float) -> dict[str, dict[str, Any]]:
    """Estimate camp respawn timers based on observed events.

    Returns a dict of camp_name -> {status, next_spawn_estimate, confidence}.
    """
    camps = {}
    for camp_name, initial in CAMP_INITIAL_SPAWN.items():
        if game_time < initial:
            camps[camp_name] = {
                "status": "not_spawned",
                "next_spawn_estimate": initial,
                "confidence": 1.0,
            }
        else:
            camps[camp_name] = {
                "status": "unknown",
                "next_spawn_estimate": None,
                "confidence": 0.0,
            }

    # Parse kill events that might indicate camp takes
    for event in events:
        event_name = event.get("EventName", "")
        event_time = event.get("EventTime", 0.0)

        if event_name == "DragonKill":
            respawn = event_time + 300.0
            camps["Dragon"] = {
                "status": "dead",
                "next_spawn_estimate": respawn if respawn > game_time else None,
                "confidence": 1.0,
            }
        elif event_name == "HeraldKill":
            respawn = event_time + 360.0
            camps["Herald"] = {
                "status": "dead",
                "next_spawn_estimate": respawn if respawn > game_time and game_time < 1200 else None,
                "confidence": 1.0,
            }
        elif event_name == "BaronKill":
            respawn = event_time + 360.0
            camps["Baron"] = {
                "status": "dead",
                "next_spawn_estimate": respawn if respawn > game_time else None,
                "confidence": 1.0,
            }

    return camps


def predict_jungler_location(
    events: list[dict[str, Any]],
    game_time: float,
    champion: str,
    enemy_team: str = "CHAOS",
) -> JunglePrediction:
    """Predict the enemy jungler's current location based on available data."""
    appearances: list[tuple[float, str]] = []

    for event in events:
        event_time = event.get("EventTime", 0.0)
        killer = event.get("KillerName", "")
        victim = event.get("VictimName", "")
        assisters = event.get("Assisters", [])
        event_name = event.get("EventName", "")

        # If the jungler was involved in a kill/assist
        all_participants = [killer] + assisters
        if champion in all_participants or champion == victim:
            location = _infer_location_from_event(event_name, event)
            if location:
                appearances.append((event_time, location))

    if not appearances:
        return _predict_from_clear(game_time, champion)

    appearances.sort(key=lambda x: x[0], reverse=True)
    last_time, last_location = appearances[0]
    time_since_seen = game_time - last_time

    if time_since_seen < 30:
        return JunglePrediction(
            predicted_side=last_location,
            confidence=0.8,
            last_seen_time=last_time,
            last_seen_location=last_location,
            reasoning=f"{champion} was seen {last_location} {time_since_seen:.0f}s ago.",
        )
    elif time_since_seen < 60:
        opposite = _opposite_side(last_location)
        return JunglePrediction(
            predicted_side=opposite,
            confidence=0.5,
            last_seen_time=last_time,
            last_seen_location=last_location,
            reasoning=(
                f"{champion} was seen {last_location} {time_since_seen:.0f}s ago. "
                f"Likely moved to {opposite} by now."
            ),
        )
    else:
        return JunglePrediction(
            predicted_side="unknown",
            confidence=0.2,
            last_seen_time=last_time,
            last_seen_location=last_location,
            reasoning=(
                f"{champion} last seen {last_location} {time_since_seen:.0f}s ago. "
                "Location is uncertain - play safe and ward."
            ),
        )


def calculate_gank_probability(
    prediction: JunglePrediction, lane: str
) -> float:
    """Calculate the probability of a gank on a specific lane.

    lane should be 'top', 'mid', or 'bot'.
    """
    lane = lane.lower()

    if prediction.predicted_side == "unknown":
        return 0.33

    side_to_lanes: dict[str, dict[str, float]] = {
        "topside": {"top": 0.7, "mid": 0.4, "bot": 0.1},
        "botside": {"top": 0.1, "mid": 0.4, "bot": 0.7},
        "mid": {"top": 0.3, "mid": 0.6, "bot": 0.3},
        "base": {"top": 0.15, "mid": 0.15, "bot": 0.15},
    }

    lane_probs = side_to_lanes.get(prediction.predicted_side, {"top": 0.33, "mid": 0.33, "bot": 0.33})
    base_prob = lane_probs.get(lane, 0.33)
    return round(base_prob * prediction.confidence, 2)


def _predict_from_clear(game_time: float, champion: str) -> JunglePrediction:
    """Predict location based on standard clear timing when no events seen."""
    clear = get_standard_clear(champion)

    if game_time < 120:
        return JunglePrediction(
            predicted_side="unknown",
            confidence=0.4,
            last_seen_time=0.0,
            last_seen_location="fountain",
            reasoning=f"{champion} is likely doing first clear. Standard path: {', '.join(clear[:3])}.",
        )
    elif game_time < 210:
        if clear and "Red" in clear[0]:
            predicted = "botside"
        else:
            predicted = "topside"
        return JunglePrediction(
            predicted_side=predicted,
            confidence=0.4,
            last_seen_time=0.0,
            last_seen_location="jungle",
            reasoning=f"{champion} likely finishing first clear around {predicted}. Watch for gank.",
        )
    elif game_time < 240:
        return JunglePrediction(
            predicted_side="mid",
            confidence=0.3,
            last_seen_time=0.0,
            last_seen_location="jungle",
            reasoning=f"{champion} likely looking for first gank or scuttle contest.",
        )
    else:
        return JunglePrediction(
            predicted_side="unknown",
            confidence=0.15,
            last_seen_time=0.0,
            last_seen_location="unknown",
            reasoning=f"No data on {champion}'s position. Ward river and play safe.",
        )


def _infer_location_from_event(event_name: str, event: dict[str, Any]) -> str | None:
    """Infer map location from an event."""
    if event_name == "DragonKill":
        return "botside"
    if event_name in ("HeraldKill", "BaronKill"):
        return "topside"

    turret = event.get("TurretKilled", "")
    if turret:
        if "Top" in turret or "T1_C_01" in turret:
            return "topside"
        if "Bot" in turret or "T1_C_07" in turret:
            return "botside"
        if "Mid" in turret:
            return "mid"

    if event_name == "ChampionKill":
        return "unknown"  # can't tell location from kill event alone

    return None


def _opposite_side(side: str) -> str:
    mapping = {"topside": "botside", "botside": "topside", "mid": "mid", "base": "unknown"}
    return mapping.get(side, "unknown")
