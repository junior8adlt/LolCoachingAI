from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from models.game_state import GameState


@dataclass
class MacroAnalysis:
    phase: str  # "early", "mid", "late"
    objectives_advice: list[str] = field(default_factory=list)
    vision_assessment: str = ""
    macro_mistakes: list[str] = field(default_factory=list)
    recommended_actions: list[str] = field(default_factory=list)


# Objective spawn timers (seconds)
OBJECTIVE_SPAWNS: dict[str, float] = {
    "Dragon": 300.0,
    "Rift Herald": 480.0,
    "Baron Nashor": 1200.0,
    "Elder Dragon": 2100.0,
    "Void Grubs": 360.0,
}

OBJECTIVE_RESPAWNS: dict[str, float] = {
    "Dragon": 300.0,
    "Rift Herald": 360.0,
    "Baron Nashor": 360.0,
    "Elder Dragon": 360.0,
}


def _get_game_phase(game_time: float) -> str:
    if game_time < 840:  # 14 minutes
        return "early"
    elif game_time < 1500:  # 25 minutes
        return "mid"
    return "late"


def check_objective_setup(game_time: float, events: list[dict[str, Any]]) -> list[str]:
    """Check upcoming objectives and provide setup advice."""
    advice: list[str] = []

    dragon_kills = [e for e in events if e.get("EventName") == "DragonKill"]
    herald_kills = [e for e in events if e.get("EventName") == "HeraldKill"]
    baron_kills = [e for e in events if e.get("EventName") == "BaronKill"]

    # Dragon check
    if not dragon_kills:
        if game_time >= 270 and game_time < 300:
            advice.append("Dragon spawns at 5:00. Set up vision around dragon pit now.")
        elif game_time >= 300:
            advice.append("Dragon is available. Look for an opportunity after pushing bot wave.")
    else:
        last_dragon_time = max(e.get("EventTime", 0) for e in dragon_kills)
        next_dragon = last_dragon_time + OBJECTIVE_RESPAWNS["Dragon"]
        time_until = next_dragon - game_time
        if 0 < time_until <= 60:
            advice.append(
                f"Dragon respawns in ~{int(time_until)}s. "
                "Start setting up vision and push bot lane."
            )
        elif time_until <= 0 and game_time < 2100:
            advice.append("Dragon is available. Contest if team has priority.")

    # Rift Herald check
    if game_time < 1200:
        if not herald_kills:
            if game_time >= 420 and game_time < 480:
                advice.append("Void Grubs/Rift Herald spawns soon. Push top wave for setup.")
            elif game_time >= 480:
                advice.append("Rift Herald is available. Take it for first turret gold/plates.")
        else:
            last_herald_time = max(e.get("EventTime", 0) for e in herald_kills)
            next_herald = last_herald_time + OBJECTIVE_RESPAWNS["Rift Herald"]
            time_until = next_herald - game_time
            if 0 < time_until <= 60 and game_time < 1200:
                advice.append(f"Second Herald spawns in ~{int(time_until)}s.")

    # Baron check
    if game_time >= 1140:
        if not baron_kills:
            if game_time >= 1140 and game_time < 1200:
                advice.append("Baron spawns at 20:00. Start warding Baron pit entrance.")
            elif game_time >= 1200:
                advice.append("Baron is available. Group for Baron if you win a fight or get a pick.")
        else:
            last_baron_time = max(e.get("EventTime", 0) for e in baron_kills)
            next_baron = last_baron_time + OBJECTIVE_RESPAWNS["Baron Nashor"]
            time_until = next_baron - game_time
            if 0 < time_until <= 90:
                advice.append(
                    f"Baron respawns in ~{int(time_until)}s. Contest vision around pit."
                )

    # Elder Dragon check
    if game_time >= 2040:
        elder_events = [
            e for e in events
            if e.get("EventName") == "DragonKill" and e.get("EventTime", 0) >= 2100
        ]
        if not elder_events and game_time >= 2100:
            advice.append(
                "Elder Dragon is available. This is a game-winning objective. "
                "Group and fight for it."
            )

    return advice


def analyze_vision_control(ward_scores: dict[str, float], game_time: float) -> str:
    """Analyze vision control based on ward scores."""
    if not ward_scores:
        return "No ward score data available."

    game_minutes = game_time / 60.0
    if game_minutes <= 0:
        return "Game just started."

    assessments: list[str] = []

    for player_name, score in ward_scores.items():
        score_per_min = score / game_minutes
        if score_per_min >= 1.5:
            grade = "excellent"
        elif score_per_min >= 1.0:
            grade = "good"
        elif score_per_min >= 0.6:
            grade = "average"
        else:
            grade = "poor"
        assessments.append(f"{player_name}: {grade} vision ({score:.0f} score, {score_per_min:.1f}/min)")

    return "; ".join(assessments)


def detect_macro_mistakes(events: list[dict[str, Any]], game_state: GameState) -> list[str]:
    """Detect common macro mistakes from events and game state."""
    mistakes: list[str] = []
    game_time = game_state.game_time

    # Check for dying with objectives up
    kill_events = [e for e in events if e.get("EventName") == "ChampionKill"]
    for event in kill_events[-10:]:
        event_time = event.get("EventTime", 0.0)
        # Death right before dragon/baron spawn
        if abs(event_time - 300) < 30 and event_time > 270:
            victim = event.get("VictimName", "")
            if victim:
                mistakes.append(
                    f"{victim} died right before Dragon spawn. "
                    "Avoid risky fights when objectives are about to spawn."
                )
        if abs(event_time - 1200) < 60:
            victim = event.get("VictimName", "")
            if victim:
                mistakes.append(
                    f"{victim} died near Baron spawn time. Play safe before 20 minutes."
                )

    # Check for multiple deaths in short windows (getting caught out)
    if len(kill_events) >= 3:
        recent_kills = [e for e in kill_events if game_time - e.get("EventTime", 0) < 120]
        ally_deaths_recent = {}
        for e in recent_kills:
            victim = e.get("VictimName", "")
            ally_deaths_recent[victim] = ally_deaths_recent.get(victim, 0) + 1
        for player, count in ally_deaths_recent.items():
            if count >= 2:
                mistakes.append(
                    f"{player} died {count} times in the last 2 minutes. "
                    "Avoid face-checking and group with team."
                )

    # Check for no turret plates taken early
    turret_events = [e for e in events if e.get("EventName") == "TurretKilled"]
    if game_time > 840 and not turret_events:
        mistakes.append(
            "No turrets have been taken by 14 minutes. "
            "Look for Herald to crack open turrets."
        )

    # Check for dragon stacking by enemy
    dragon_events = [e for e in events if e.get("EventName") == "DragonKill"]
    enemy_dragons = 0
    ally_dragons = 0
    for de in dragon_events:
        killer = de.get("KillerName", "")
        player = game_state.get_player(killer)
        if player:
            for p in game_state.allPlayers:
                if p.summonerName == killer:
                    if p.team != game_state.allPlayers[0].team if game_state.allPlayers else "ORDER":
                        enemy_dragons += 1
                    else:
                        ally_dragons += 1
                    break
    if enemy_dragons >= 3 and ally_dragons == 0:
        mistakes.append(
            f"Enemy has {enemy_dragons} dragons uncontested. "
            "Prioritize dragon control - ward and group for next spawn."
        )

    return mistakes


def analyze_macro_state(game_state: GameState, events: list[dict[str, Any]] | None = None) -> MacroAnalysis:
    """Full macro state analysis."""
    game_time = game_state.game_time
    phase = _get_game_phase(game_time)
    all_events = events or [e.model_dump() for e in game_state.game_events]

    objectives_advice = check_objective_setup(game_time, all_events)

    ward_scores: dict[str, float] = {}
    for p in game_state.allPlayers:
        ward_scores[p.summonerName] = p.scores.wardScore
    vision_assessment = analyze_vision_control(ward_scores, game_time)

    macro_mistakes = detect_macro_mistakes(all_events, game_state)

    recommended: list[str] = []
    if phase == "early":
        recommended.extend([
            "Focus on CS and trading in lane.",
            "Track enemy jungler through ward placement.",
            "Look for turret plates when lane opponent backs.",
        ])
    elif phase == "mid":
        recommended.extend([
            "Group for objectives - dragon and Herald/Baron setup.",
            "Catch side waves between objective timers.",
            "Establish vision control around the next objective.",
        ])
    else:
        recommended.extend([
            "Stay grouped - getting caught loses games.",
            "Play around Elder Dragon and Baron.",
            "Look for picks before forcing objectives.",
        ])

    # Add team comp specific advice
    team_kills = {
        "ORDER": game_state.get_team_kills("ORDER"),
        "CHAOS": game_state.get_team_kills("CHAOS"),
    }
    total_kills = sum(team_kills.values())
    if total_kills > 0:
        your_team = game_state.allPlayers[0].team if game_state.allPlayers else "ORDER"
        your_kills = team_kills.get(your_team, 0)
        enemy_kills = team_kills.get("CHAOS" if your_team == "ORDER" else "ORDER", 0)

        if your_kills > enemy_kills + 5:
            recommended.append("You have a significant kill lead. Press your advantage with objectives.")
        elif enemy_kills > your_kills + 5:
            recommended.append(
                "You are behind in kills. Avoid fights and farm until you hit power spikes."
            )

    return MacroAnalysis(
        phase=phase,
        objectives_advice=objectives_advice,
        vision_assessment=vision_assessment,
        macro_mistakes=macro_mistakes,
        recommended_actions=recommended,
    )
