from __future__ import annotations

from typing import Any

# Built-in matchup knowledge base for common matchups.
# Keys are sorted alphabetically: "ChampA|ChampB"
# Values: difficulty (from ChampA perspective), tips, power spikes.

_MATCHUP_DB: dict[str, dict[str, Any]] = {
    "Darius|Garen": {
        "difficulty": 3,
        "tips_a": [
            "Use E to pull Garen out of his spin range.",
            "Stack passive early for kill pressure.",
            "Punish his Q approach with W slow then combo.",
        ],
        "tips_b": [
            "Short trades with Q - don't let Darius stack passive.",
            "Use W to reduce his burst damage.",
            "Passive heals help sustain through poke.",
        ],
        "spikes_a": ["Level 1-3 (strong all-in)", "Phage spike", "Level 6 execute"],
        "spikes_b": ["Level 6 execute", "Berserker + Stridebreaker", "Level 11 R upgrade"],
    },
    "Ahri|Zed": {
        "difficulty": 3,
        "tips_a": [
            "Save E (Charm) for when Zed uses R.",
            "Rush Zhonya's Hourglass second item.",
            "Poke with Q from max range in lane.",
        ],
        "tips_b": [
            "Dodge Ahri E before ulting.",
            "Use W shadows to poke safely.",
            "All-in at 6 if she wastes Charm.",
        ],
        "spikes_a": ["Lost Chapter", "Level 6 mobility", "Zhonya's completion"],
        "spikes_b": ["Level 3 WEQ combo", "Dirk spike", "Level 6 all-in"],
    },
    "Jinx|Caitlyn": {
        "difficulty": 4,
        "tips_a": [
            "Caitlyn outranges you - farm safely with rockets from distance.",
            "Avoid walking into traps at all costs.",
            "Power spike at level 6 and Kraken Slayer.",
        ],
        "tips_b": [
            "Abuse range advantage early.",
            "Place traps behind minions to zone Jinx.",
            "Push for early plates with headshot poke.",
        ],
        "spikes_a": ["Level 6 global R", "Kraken Slayer", "3 items hypercarry"],
        "spikes_b": ["BF Sword", "Level 2 all-in", "First item spike"],
    },
    "Leona|Thresh": {
        "difficulty": 2,
        "tips_a": [
            "Engage through minions - Thresh can't flay you out of E.",
            "You out-tank Thresh in all-ins.",
            "Look for level 2 engage.",
        ],
        "tips_b": [
            "Flay Leona E to cancel her engage.",
            "Lantern your ADC to safety if caught.",
            "Poke with auto attacks from range.",
        ],
        "spikes_a": ["Level 2 all-in", "Level 3 full combo", "Level 6 team lockdown"],
        "spikes_b": ["Level 2 hook/flay", "Mobility boots roam", "Level 6 zone control"],
    },
    "Yasuo|Yone": {
        "difficulty": 3,
        "tips_a": [
            "Windwall blocks Yone's W projectile.",
            "Short trades with E-Q then dash out.",
            "Match his roams - you have similar waveclear.",
        ],
        "tips_b": [
            "Your W gives shield for trades.",
            "E3 (snap-back) lets you trade safely.",
            "R sets up ganks better than Yasuo R.",
        ],
        "spikes_a": ["Level 1-2 (if stacked Q)", "Berserker Greaves", "100% crit spike"],
        "spikes_b": ["Level 3 E trades", "BORK spike", "Level 6 all-in"],
    },
    "Garen|Mordekaiser": {
        "difficulty": 4,
        "tips_a": [
            "Don't fight inside Mordekaiser's passive.",
            "Short Q-E trades and walk out.",
            "Buy QSS to cleanse his R.",
        ],
        "tips_b": [
            "Ult Garen to remove his team from fights.",
            "Land isolated Q for poke.",
            "Passive wins extended trades.",
        ],
        "spikes_a": ["Level 6", "Berserker + Stride", "QSS purchase"],
        "spikes_b": ["Level 6 isolation", "Riftmaker", "Rylai's kiting"],
    },
}

# Champion general power spike profiles
_POWER_SPIKES: dict[str, dict[str, list[str]]] = {
    "early": {
        "Draven": ["Level 1-2 axes", "BF Sword", "Level 6 global"],
        "Renekton": ["Level 3 combo", "BORK spike", "Fury management"],
        "Pantheon": ["Level 2-3 stun combo", "Lethality items", "Pre-14 min roams"],
        "LeBlanc": ["Level 2-3 burst", "Lost Chapter", "Level 6 clone mind games"],
        "Lucian": ["Level 2 all-in", "Noonquiver", "Level 6 ult pressure"],
    },
    "mid": {
        "Viktor": ["Hex Core upgrades", "Level 9 E waveclear", "2 item spike"],
        "Orianna": ["Lost Chapter", "Level 9 Q spam", "Deathcap spike"],
        "Irelia": ["BORK completion", "Level 9 Q reset", "Trinity Force"],
        "Camille": ["Level 6 ult", "Triforce spike", "Level 16 scaling"],
        "Sylas": ["Level 6 ult steal", "Everfrost", "2 item spike"],
    },
    "late": {
        "Kassadin": ["Level 16 R upgrade", "3 items", "Seraph's + Deathcap"],
        "Kayle": ["Level 6 ranged", "Level 11 waves", "Level 16 true damage"],
        "Vayne": ["Guinsoo's spike", "3 items", "Level 13 Q cooldown"],
        "Jinx": ["Kraken + Hurricane", "3 items", "Passive resets in fights"],
        "Azir": ["Nashor's spike", "3 items", "Level 16 shuffle"],
    },
}


def get_matchup_difficulty(champ1: str, champ2: str) -> int:
    """Return difficulty from champ1's perspective (1=easy, 5=very hard)."""
    key_a = f"{champ1}|{champ2}"
    key_b = f"{champ2}|{champ1}"

    if key_a in _MATCHUP_DB:
        return _MATCHUP_DB[key_a]["difficulty"]
    if key_b in _MATCHUP_DB:
        return 6 - _MATCHUP_DB[key_b]["difficulty"]
    return 3  # unknown = neutral


def get_lane_tips(champ1: str, champ2: str) -> list[str]:
    """Return lane tips for champ1 vs champ2."""
    key_a = f"{champ1}|{champ2}"
    key_b = f"{champ2}|{champ1}"

    if key_a in _MATCHUP_DB:
        return _MATCHUP_DB[key_a]["tips_a"]
    if key_b in _MATCHUP_DB:
        return _MATCHUP_DB[key_b]["tips_b"]
    return [
        f"No specific tips found for {champ1} vs {champ2}.",
        "Focus on fundamentals: CS, trading when abilities are on cooldown, vision.",
    ]


def get_power_spike_comparison(champ1: str, champ2: str) -> dict[str, list[str]]:
    """Return power spikes for both champions."""
    key_a = f"{champ1}|{champ2}"
    key_b = f"{champ2}|{champ1}"

    if key_a in _MATCHUP_DB:
        return {
            "yours": _MATCHUP_DB[key_a]["spikes_a"],
            "theirs": _MATCHUP_DB[key_a]["spikes_b"],
        }
    if key_b in _MATCHUP_DB:
        return {
            "yours": _MATCHUP_DB[key_b]["spikes_b"],
            "theirs": _MATCHUP_DB[key_b]["spikes_a"],
        }

    yours = _find_champion_spikes(champ1)
    theirs = _find_champion_spikes(champ2)
    return {"yours": yours, "theirs": theirs}


def _find_champion_spikes(champion: str) -> list[str]:
    """Look up a champion's general power spikes."""
    for _tier, champs in _POWER_SPIKES.items():
        if champion in champs:
            return champs[champion]
    return [f"No specific spike data for {champion}. Check item completions and ult upgrades."]
