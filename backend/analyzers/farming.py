from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class FarmingAnalysis:
    cs: int
    game_time_seconds: float
    cs_per_min: float
    target_cs_per_min: float
    efficiency: float
    grade: str
    issues: list[str] = field(default_factory=list)
    advice: list[str] = field(default_factory=list)


# CS/min benchmarks by rank tier and role
_CS_BENCHMARKS: dict[str, dict[str, float]] = {
    "iron": {"top": 4.5, "mid": 5.0, "adc": 5.5, "jungle": 4.5, "support": 1.0},
    "bronze": {"top": 5.0, "mid": 5.5, "adc": 6.0, "jungle": 5.0, "support": 1.2},
    "silver": {"top": 5.5, "mid": 6.0, "adc": 6.5, "jungle": 5.5, "support": 1.5},
    "gold": {"top": 6.0, "mid": 6.5, "adc": 7.0, "jungle": 6.0, "support": 1.5},
    "platinum": {"top": 6.5, "mid": 7.0, "adc": 7.5, "jungle": 6.5, "support": 1.8},
    "emerald": {"top": 7.0, "mid": 7.5, "adc": 8.0, "jungle": 7.0, "support": 2.0},
    "diamond": {"top": 7.5, "mid": 8.0, "adc": 8.5, "jungle": 7.5, "support": 2.0},
    "master": {"top": 8.0, "mid": 8.5, "adc": 9.0, "jungle": 8.0, "support": 2.2},
    "grandmaster": {"top": 8.5, "mid": 9.0, "adc": 9.5, "jungle": 8.5, "support": 2.5},
    "challenger": {"top": 9.0, "mid": 9.5, "adc": 10.0, "jungle": 9.0, "support": 2.5},
}

# Theoretical max CS at specific game times (solo lanes, approx)
_MAX_CS_BY_MINUTE: dict[int, int] = {
    5: 44,
    10: 107,
    15: 170,
    20: 234,
    25: 297,
    30: 360,
}


def get_cs_benchmark(rank: str, role: str) -> float:
    """Return target CS/min for a given rank and role."""
    rank = rank.lower()
    role = role.lower()

    if role in ("bot", "adc", "marksman"):
        role = "adc"
    elif role in ("jg", "jungle", "jungler"):
        role = "jungle"
    elif role in ("sup", "support", "supp"):
        role = "support"
    elif role in ("top", "toplane"):
        role = "top"
    elif role in ("mid", "middle", "midlane"):
        role = "mid"

    tier = _CS_BENCHMARKS.get(rank, _CS_BENCHMARKS["gold"])
    return tier.get(role, 6.0)


def calculate_efficiency(actual_cs: int, game_time_seconds: float) -> float:
    """Calculate CS efficiency as a percentage of theoretical maximum."""
    if game_time_seconds <= 0:
        return 0.0

    game_minutes = game_time_seconds / 60.0
    max_cs = _interpolate_max_cs(game_minutes)
    if max_cs <= 0:
        return 0.0

    return min(round((actual_cs / max_cs) * 100, 1), 100.0)


def _interpolate_max_cs(game_minutes: float) -> float:
    """Interpolate theoretical max CS for the given game time."""
    if game_minutes <= 0:
        return 0.0

    minute_int = int(game_minutes)
    sorted_marks = sorted(_MAX_CS_BY_MINUTE.keys())

    if minute_int <= sorted_marks[0]:
        return _MAX_CS_BY_MINUTE[sorted_marks[0]] * (game_minutes / sorted_marks[0])

    if minute_int >= sorted_marks[-1]:
        per_min = _MAX_CS_BY_MINUTE[sorted_marks[-1]] / sorted_marks[-1]
        return per_min * game_minutes

    lower = max(m for m in sorted_marks if m <= minute_int)
    upper = min(m for m in sorted_marks if m > minute_int)
    lower_cs = _MAX_CS_BY_MINUTE[lower]
    upper_cs = _MAX_CS_BY_MINUTE[upper]
    fraction = (game_minutes - lower) / (upper - lower)
    return lower_cs + (upper_cs - lower_cs) * fraction


def detect_farming_issues(cs_history: list[tuple[float, int]]) -> list[str]:
    """Detect farming issues from a history of (timestamp, cs) tuples.

    Returns a list of identified problems.
    """
    issues: list[str] = []

    if len(cs_history) < 2:
        return issues

    cs_history = sorted(cs_history, key=lambda x: x[0])

    for i in range(1, len(cs_history)):
        t_prev, cs_prev = cs_history[i - 1]
        t_curr, cs_curr = cs_history[i]
        dt_minutes = (t_curr - t_prev) / 60.0
        if dt_minutes <= 0:
            continue

        dcs = cs_curr - cs_prev
        rate = dcs / dt_minutes

        if rate < 2.0 and dt_minutes >= 1.0:
            minute_mark = int(t_curr / 60)
            issues.append(
                f"Very low CS rate ({rate:.1f}/min) around minute {minute_mark}. "
                "Likely dead, roaming excessively, or missing last hits."
            )

    first_t, first_cs = cs_history[0]
    last_t, last_cs = cs_history[-1]
    total_minutes = (last_t - first_t) / 60.0
    if total_minutes > 0:
        overall_rate = (last_cs - first_cs) / total_minutes
        if overall_rate < 5.0 and total_minutes >= 5.0:
            issues.append(
                f"Overall CS rate is low ({overall_rate:.1f}/min). "
                "Focus on catching side waves and jungle camps between fights."
            )

    late_entries = [
        (t, cs) for t, cs in cs_history if t >= 900  # after 15 min
    ]
    if len(late_entries) >= 2:
        lt_first = late_entries[0]
        lt_last = late_entries[-1]
        dt = (lt_last[0] - lt_first[0]) / 60.0
        if dt > 0:
            late_rate = (lt_last[1] - lt_first[1]) / dt
            if late_rate < 4.0:
                issues.append(
                    f"Mid/late game CS rate dropped to {late_rate:.1f}/min. "
                    "Remember to catch waves between objectives and fights."
                )

    return issues


def analyze_farming(cs: int, game_time_seconds: float, role: str, rank: str = "gold") -> FarmingAnalysis:
    """Full farming analysis for the current game state."""
    if game_time_seconds <= 0:
        return FarmingAnalysis(
            cs=cs,
            game_time_seconds=0,
            cs_per_min=0.0,
            target_cs_per_min=get_cs_benchmark(rank, role),
            efficiency=0.0,
            grade="N/A",
        )

    game_minutes = game_time_seconds / 60.0
    cs_per_min = round(cs / game_minutes, 1) if game_minutes > 0 else 0.0
    target = get_cs_benchmark(rank, role)
    efficiency = calculate_efficiency(cs, game_time_seconds)

    ratio = cs_per_min / target if target > 0 else 0
    if ratio >= 1.1:
        grade = "S"
    elif ratio >= 0.95:
        grade = "A"
    elif ratio >= 0.8:
        grade = "B"
    elif ratio >= 0.6:
        grade = "C"
    else:
        grade = "D"

    advice: list[str] = []
    issues: list[str] = []

    if cs_per_min < target * 0.7:
        issues.append(f"CS/min ({cs_per_min}) is significantly below target ({target}).")
        advice.append("Practice last-hitting in practice tool for 10 minutes daily.")
        if game_minutes > 10:
            advice.append("Catch side waves that crash into your turrets.")
    elif cs_per_min < target * 0.85:
        issues.append(f"CS/min ({cs_per_min}) is slightly below target ({target}).")
        advice.append("Focus on not missing cannon minions - they are worth the most gold.")

    if game_minutes > 15 and efficiency < 50:
        advice.append(
            "After laning phase, keep farming side lanes and jungle camps "
            "between objective fights."
        )

    if role.lower() in ("support", "sup", "supp"):
        advice.clear()
        issues.clear()
        if cs_per_min > 3.0:
            issues.append("Taking too much CS as support - leave farm for carries.")

    return FarmingAnalysis(
        cs=cs,
        game_time_seconds=game_time_seconds,
        cs_per_min=cs_per_min,
        target_cs_per_min=target,
        efficiency=efficiency,
        grade=grade,
        issues=issues,
        advice=advice,
    )
