from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from models.game_state import PlayerInfo


@dataclass
class ThreatProfile:
    champion: str
    threat_type: str  # "engage", "burst", "poke", "dps", "utility", "tank"
    damage_type: str  # "physical", "magic", "mixed", "true"
    mobility: str  # "low", "medium", "high"
    cc_level: str  # "none", "low", "medium", "high"
    key_abilities: list[str] = field(default_factory=list)
    counter_tips: list[str] = field(default_factory=list)


@dataclass
class ThreatAssessment:
    champion: str
    summoner_name: str
    threat_level: str  # "low", "medium", "high", "extreme"
    threat_score: float  # 0.0 - 10.0
    profile: ThreatProfile
    reasoning: str = ""
    is_fed: bool = False


# Champion threat profiles database
_THREAT_PROFILES: dict[str, ThreatProfile] = {
    "Zed": ThreatProfile(
        champion="Zed", threat_type="burst", damage_type="physical",
        mobility="high", cc_level="none",
        key_abilities=["R (Death Mark) - untargetable dash + death mark", "W-E-Q poke combo"],
        counter_tips=["Rush Zhonya's Hourglass", "Stay near minions to block Q", "Track W shadow cooldown (22s)"],
    ),
    "Ahri": ThreatProfile(
        champion="Ahri", threat_type="burst", damage_type="magic",
        mobility="high", cc_level="medium",
        key_abilities=["E (Charm) - single target CC", "R (Spirit Rush) - 3 dashes"],
        counter_tips=["Dodge Charm sideways", "She is weak without R", "Banshee's blocks Charm"],
    ),
    "Yasuo": ThreatProfile(
        champion="Yasuo", threat_type="dps", damage_type="physical",
        mobility="high", cc_level="medium",
        key_abilities=["W (Wind Wall) blocks projectiles", "Q3 tornado into R knockup"],
        counter_tips=["Play around Wind Wall cooldown (30s)", "Non-projectile abilities bypass wall", "CC him in fights"],
    ),
    "Darius": ThreatProfile(
        champion="Darius", threat_type="dps", damage_type="physical",
        mobility="low", cc_level="medium",
        key_abilities=["Passive (5 stacks = massive AD)", "R (Noxian Guillotine) - true damage execute"],
        counter_tips=["Don't let him 5-stack passive", "Kite and poke from range", "Disengage short trades"],
    ),
    "Leona": ThreatProfile(
        champion="Leona", threat_type="engage", damage_type="magic",
        mobility="medium", cc_level="high",
        key_abilities=["E (Zenith Blade) - dash", "R (Solar Flare) - AOE stun"],
        counter_tips=["Stay behind minions to block E", "Punish when E is down (12s)", "Cleanse or QSS her CC chain"],
    ),
    "Thresh": ThreatProfile(
        champion="Thresh", threat_type="utility", damage_type="magic",
        mobility="medium", cc_level="high",
        key_abilities=["Q (Death Sentence) - hook", "W (Lantern) - ally rescue", "E (Flay) - displacement"],
        counter_tips=["Sidestep hooks - he winds up visibly", "Stand on Lantern to block clicks", "Engage when Q is down (20s)"],
    ),
    "Jinx": ThreatProfile(
        champion="Jinx", threat_type="dps", damage_type="physical",
        mobility="low", cc_level="low",
        key_abilities=["Passive (Get Excited) - move speed on kill", "Q toggle - AOE rockets", "R - global execute"],
        counter_tips=["Focus her in fights - no escapes", "Dive before she gets passive reset", "Dodge W and E traps"],
    ),
    "Vayne": ThreatProfile(
        champion="Vayne", threat_type="dps", damage_type="mixed",
        mobility="high", cc_level="low",
        key_abilities=["W (Silver Bolts) - true damage every 3 hits", "R+Q stealth tumble", "E (Condemn) - stun against wall"],
        counter_tips=["Don't fight near walls (Condemn stun)", "Burst her before she kites", "She is weak early - abuse it"],
    ),
    "LeBlanc": ThreatProfile(
        champion="LeBlanc", threat_type="burst", damage_type="magic",
        mobility="high", cc_level="medium",
        key_abilities=["W (Distortion) - dash + return", "Passive (Mirror Image) - clone at low HP"],
        counter_tips=["Stand on her W pad to trade when she returns", "Build MR early", "She is weak at waveclearing"],
    ),
    "Malphite": ThreatProfile(
        champion="Malphite", threat_type="engage", damage_type="magic",
        mobility="low", cc_level="high",
        key_abilities=["R (Unstoppable Force) - massive AOE knockup", "Passive shield regenerates"],
        counter_tips=["Spread out to limit R impact", "Poke down passive shield", "Flash his R if possible"],
    ),
    "Katarina": ThreatProfile(
        champion="Katarina", threat_type="burst", damage_type="magic",
        mobility="high", cc_level="none",
        key_abilities=["E (Shunpo) - blink to daggers/units", "R (Death Lotus) - AOE spin"],
        counter_tips=["Save hard CC to interrupt her R", "Avoid standing on daggers", "She has no CC - just burst"],
    ),
    "Syndra": ThreatProfile(
        champion="Syndra", threat_type="burst", damage_type="magic",
        mobility="low", cc_level="medium",
        key_abilities=["E (Scatter the Weak) - AOE stun with balls", "R (Unleashed Power) - targeted burst"],
        counter_tips=["Edge of Darkness blocks R spheres", "Dodge balls to avoid E stun", "All-in when abilities on CD"],
    ),
    "KhaZix": ThreatProfile(
        champion="KhaZix", threat_type="burst", damage_type="physical",
        mobility="high", cc_level="low",
        key_abilities=["Passive - isolation damage bonus", "R - stealth", "E - leap reset on kill"],
        counter_tips=["Stay near allies to avoid isolation", "Pink wards reveal stealth", "He is weak in teamfights"],
    ),
    "Lux": ThreatProfile(
        champion="Lux", threat_type="poke", damage_type="magic",
        mobility="low", cc_level="medium",
        key_abilities=["Q (Light Binding) - root 2 targets", "R (Final Spark) - long range laser"],
        counter_tips=["Dodge Q sideways - it's slow", "Punish when Q is down (she's immobile)", "Build Banshee's"],
    ),
    "Rengar": ThreatProfile(
        champion="Rengar", threat_type="burst", damage_type="physical",
        mobility="medium", cc_level="low",
        key_abilities=["R (Thrill of the Hunt) - camouflage + leap", "Passive - bush leap"],
        counter_tips=["Group so he can't pick solo targets", "Wards near bushes", "Zhonya's/GA vs his burst"],
    ),
    "Morgana": ThreatProfile(
        champion="Morgana", threat_type="utility", damage_type="magic",
        mobility="low", cc_level="high",
        key_abilities=["Q (Dark Binding) - 3s root", "E (Black Shield) - spell shield ally"],
        counter_tips=["Sidestep Q - it has a narrow hitbox", "Bait out E before using CC", "Punish her immobility"],
    ),
    "Lee Sin": ThreatProfile(
        champion="LeeSin", threat_type="burst", damage_type="physical",
        mobility="high", cc_level="medium",
        key_abilities=["Q (Sonic Wave) - dash to target", "R (Dragon's Rage) - kick back"],
        counter_tips=["Dodge Q - he loses most damage", "Ward behind you vs insec", "Falls off late game"],
    ),
    "Viego": ThreatProfile(
        champion="Viego", threat_type="dps", damage_type="physical",
        mobility="high", cc_level="low",
        key_abilities=["Passive - possess dead enemies", "R - untargetable dash"],
        counter_tips=["Focus burst so he can't possess", "Grievous wounds reduce his healing", "CC him before he gets resets"],
    ),
}


def get_champion_threat_profile(champion: str) -> ThreatProfile:
    """Return the threat profile for a champion."""
    if champion in _THREAT_PROFILES:
        return _THREAT_PROFILES[champion]
    return ThreatProfile(
        champion=champion,
        threat_type="unknown",
        damage_type="mixed",
        mobility="medium",
        cc_level="medium",
        key_abilities=[f"Unknown abilities for {champion}. Check wiki."],
        counter_tips=["Build defensively against their primary damage type."],
    )


def calculate_threat_level(
    champion: str,
    level: int,
    items: list[dict[str, Any]],
    kills: int,
    deaths: int,
    assists: int,
    game_time: float,
) -> tuple[str, float]:
    """Calculate dynamic threat level based on current game state.

    Returns (threat_level_str, threat_score_float).
    """
    score = 5.0  # baseline

    # KDA contribution
    kda_value = (kills + assists * 0.5) - deaths
    if kda_value > 5:
        score += 2.0
    elif kda_value > 2:
        score += 1.0
    elif kda_value < -3:
        score -= 2.0
    elif kda_value < 0:
        score -= 1.0

    # Level advantage (relative to game time)
    game_minutes = game_time / 60.0
    expected_level = min(18, 1 + game_minutes * 0.8)
    if level > expected_level + 1:
        score += 1.0
    elif level < expected_level - 1:
        score -= 1.0

    # Item count contribution
    completed_items = sum(1 for item in items if item.get("price", 0) >= 2000)
    if completed_items >= 3:
        score += 1.5
    elif completed_items >= 2:
        score += 0.5

    # Champion archetype scaling
    profile = get_champion_threat_profile(champion)
    if profile.threat_type == "burst" and kills >= 3:
        score += 1.0  # fed assassins are scarier
    if profile.threat_type == "dps" and game_minutes > 25:
        score += 1.0  # DPS champions scale
    if profile.threat_type == "engage":
        score += 0.5  # engage is always threatening

    # Clamp
    score = max(0.0, min(10.0, score))

    if score >= 8.0:
        level_str = "extreme"
    elif score >= 6.0:
        level_str = "high"
    elif score >= 4.0:
        level_str = "medium"
    else:
        level_str = "low"

    return level_str, round(score, 1)


def assess_threats(
    enemies: list[PlayerInfo], game_time: float
) -> list[ThreatAssessment]:
    """Assess all enemy threats and return sorted by threat score."""
    assessments: list[ThreatAssessment] = []

    for enemy in enemies:
        profile = get_champion_threat_profile(enemy.championName)
        items_data = [
            {"price": item.price, "displayName": item.displayName}
            for item in enemy.items
        ]

        level_str, score = calculate_threat_level(
            champion=enemy.championName,
            level=enemy.level,
            items=items_data,
            kills=enemy.scores.kills,
            deaths=enemy.scores.deaths,
            assists=enemy.scores.assists,
            game_time=game_time,
        )

        is_fed = (enemy.scores.kills >= 5 and enemy.scores.deaths <= 2) or (
            enemy.scores.kills - enemy.scores.deaths >= 4
        )

        reasoning_parts = [f"{enemy.championName} ({enemy.scores.kills}/{enemy.scores.deaths}/{enemy.scores.assists})"]
        if is_fed:
            reasoning_parts.append("is fed")
        reasoning_parts.append(f"- {profile.threat_type} threat, {profile.damage_type} damage")
        if level_str in ("high", "extreme"):
            reasoning_parts.append("- HIGH PRIORITY TARGET")

        assessments.append(
            ThreatAssessment(
                champion=enemy.championName,
                summoner_name=enemy.summonerName,
                threat_level=level_str,
                threat_score=score,
                profile=profile,
                reasoning=" ".join(reasoning_parts),
                is_fed=is_fed,
            )
        )

    assessments.sort(key=lambda a: a.threat_score, reverse=True)
    return assessments
