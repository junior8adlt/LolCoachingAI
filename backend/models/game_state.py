from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class Scores(BaseModel):
    kills: int = 0
    deaths: int = 0
    assists: int = 0
    creepScore: int = 0
    wardScore: float = 0.0


class ChampionStats(BaseModel):
    abilityPower: float = 0.0
    armor: float = 0.0
    armorPenetrationFlat: float = 0.0
    armorPenetrationPercent: float = 0.0
    attackDamage: float = 0.0
    attackRange: float = 0.0
    attackSpeed: float = 0.0
    bonusArmorPenetrationPercent: float = 0.0
    bonusMagicPenetrationPercent: float = 0.0
    cooldownReduction: float = 0.0
    critChance: float = 0.0
    critDamage: float = 0.0
    currentHealth: float = 0.0
    healthRegenRate: float = 0.0
    lifeSteal: float = 0.0
    magicLethality: float = 0.0
    magicPenetrationFlat: float = 0.0
    magicPenetrationPercent: float = 0.0
    magicResist: float = 0.0
    maxHealth: float = 0.0
    moveSpeed: float = 0.0
    omnivamp: float = 0.0
    physicalLethality: float = 0.0
    physicalVamp: float = 0.0
    resourceMax: float = 0.0
    resourceRegenRate: float = 0.0
    resourceType: str = "MANA"
    resourceValue: float = 0.0
    spellVamp: float = 0.0
    tenacity: float = 0.0


class Ability(BaseModel):
    abilityLevel: int = 0
    displayName: str = ""
    id: str = ""
    rawDescription: str = ""
    rawDisplayName: str = ""


class Abilities(BaseModel):
    E: Ability = Field(default_factory=Ability)
    Passive: Ability = Field(default_factory=Ability)
    Q: Ability = Field(default_factory=Ability)
    R: Ability = Field(default_factory=Ability)
    W: Ability = Field(default_factory=Ability)


class Rune(BaseModel):
    displayName: str = ""
    id: int = 0
    rawDescription: str = ""
    rawDisplayName: str = ""


class FullRunes(BaseModel):
    generalRunes: list[Rune] = Field(default_factory=list)
    keystone: Rune = Field(default_factory=Rune)
    primaryRuneTree: Rune = Field(default_factory=Rune)
    secondaryRuneTree: Rune = Field(default_factory=Rune)
    statRunes: list[Rune] = Field(default_factory=list)


class ActivePlayer(BaseModel):
    abilities: Abilities = Field(default_factory=Abilities)
    championStats: ChampionStats = Field(default_factory=ChampionStats)
    currentGold: float = 0.0
    fullRunes: FullRunes = Field(default_factory=FullRunes)
    level: int = 1
    summonerName: str = ""
    teamRelativeColors: bool = False


class ItemData(BaseModel):
    canUse: bool = False
    consumable: bool = False
    count: int = 0
    displayName: str = ""
    itemID: int = 0
    price: int = 0
    rawDescription: str = ""
    rawDisplayName: str = ""
    slot: int = 0


class SummonerSpell(BaseModel):
    displayName: str = ""
    rawDescription: str = ""
    rawDisplayName: str = ""


class SummonerSpells(BaseModel):
    summonerSpellOne: SummonerSpell = Field(default_factory=SummonerSpell)
    summonerSpellTwo: SummonerSpell = Field(default_factory=SummonerSpell)


class PlayerInfo(BaseModel):
    championName: str = ""
    isBot: bool = False
    isDead: bool = False
    items: list[ItemData] = Field(default_factory=list)
    level: int = 1
    position: str = ""
    rawChampionName: str = ""
    rawSkinName: str = ""
    respawnTimer: float = 0.0
    runes: FullRunes = Field(default_factory=FullRunes)
    scores: Scores = Field(default_factory=Scores)
    skinID: int = 0
    skinName: str = ""
    summonerName: str = ""
    summonerSpells: SummonerSpells = Field(default_factory=SummonerSpells)
    team: str = "ORDER"


class GameEvent(BaseModel):
    EventID: int = 0
    EventName: str = ""
    EventTime: float = 0.0
    KillerName: str = ""
    VictimName: str = ""
    Assisters: list[str] = Field(default_factory=list)
    Result: str = ""
    DragonType: str = ""
    Stolen: str = ""
    TurretKilled: str = ""
    InhibKilled: str = ""
    Acer: str = ""
    AcingTeam: str = ""


class GameData(BaseModel):
    gameMode: str = ""
    gameTime: float = 0.0
    mapName: str = ""
    mapNumber: int = 0
    mapTerrain: str = ""


class GameState(BaseModel):
    activePlayer: ActivePlayer = Field(default_factory=ActivePlayer)
    allPlayers: list[PlayerInfo] = Field(default_factory=list)
    events: dict[str, list[GameEvent]] = Field(default_factory=lambda: {"Events": []})
    gameData: GameData = Field(default_factory=GameData)

    @property
    def game_time(self) -> float:
        return self.gameData.gameTime

    @property
    def game_events(self) -> list[GameEvent]:
        return self.events.get("Events", [])

    def get_player(self, summoner_name: str) -> PlayerInfo | None:
        for p in self.allPlayers:
            if p.summonerName == summoner_name:
                return p
        return None

    def get_allies(self, summoner_name: str) -> list[PlayerInfo]:
        player = self.get_player(summoner_name)
        if not player:
            return []
        return [p for p in self.allPlayers if p.team == player.team and p.summonerName != summoner_name]

    def get_enemies(self, summoner_name: str) -> list[PlayerInfo]:
        player = self.get_player(summoner_name)
        if not player:
            return []
        return [p for p in self.allPlayers if p.team != player.team]

    def get_team_gold(self, team: str) -> float:
        return sum(
            sum(item.price * item.count for item in p.items)
            for p in self.allPlayers
            if p.team == team
        )

    def get_team_kills(self, team: str) -> int:
        return sum(p.scores.kills for p in self.allPlayers if p.team == team)

    def to_summary(self) -> dict[str, Any]:
        """Compact summary suitable for AI context."""
        players_summary = []
        for p in self.allPlayers:
            players_summary.append({
                "name": p.summonerName,
                "champion": p.championName,
                "team": p.team,
                "level": p.level,
                "kda": f"{p.scores.kills}/{p.scores.deaths}/{p.scores.assists}",
                "cs": p.scores.creepScore,
                "items": [i.displayName for i in p.items if i.displayName],
                "isDead": p.isDead,
                "position": p.position,
            })
        return {
            "gameTime": round(self.gameData.gameTime, 1),
            "gameMode": self.gameData.gameMode,
            "activePlayer": {
                "name": self.activePlayer.summonerName,
                "level": self.activePlayer.level,
                "gold": round(self.activePlayer.currentGold, 0),
                "stats": {
                    "ad": round(self.activePlayer.championStats.attackDamage, 1),
                    "ap": round(self.activePlayer.championStats.abilityPower, 1),
                    "hp": round(self.activePlayer.championStats.currentHealth, 0),
                    "maxHp": round(self.activePlayer.championStats.maxHealth, 0),
                    "armor": round(self.activePlayer.championStats.armor, 1),
                    "mr": round(self.activePlayer.championStats.magicResist, 1),
                    "moveSpeed": round(self.activePlayer.championStats.moveSpeed, 0),
                },
            },
            "players": players_summary,
            "recentEvents": [
                {
                    "name": e.EventName,
                    "time": round(e.EventTime, 1),
                    "killer": e.KillerName,
                    "victim": e.VictimName,
                }
                for e in self.game_events[-15:]
            ],
        }
