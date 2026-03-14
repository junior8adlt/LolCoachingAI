export interface ChampionAbility {
  abilityLevel: number;
  displayName: string;
  id: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface ChampionAbilities {
  E: ChampionAbility;
  Passive: ChampionAbility;
  Q: ChampionAbility;
  R: ChampionAbility;
  W: ChampionAbility;
}

export interface ChampionStats {
  abilityHaste: number;
  abilityPower: number;
  armor: number;
  armorPenetrationFlat: number;
  armorPenetrationPercent: number;
  attackDamage: number;
  attackRange: number;
  attackSpeed: number;
  bonusArmorPenetrationPercent: number;
  bonusMagicPenetrationPercent: number;
  critChance: number;
  critDamage: number;
  currentHealth: number;
  healShieldPower: number;
  healthRegenRate: number;
  lifeSteal: number;
  magicLethality: number;
  magicPenetrationFlat: number;
  magicPenetrationPercent: number;
  magicResist: number;
  maxHealth: number;
  moveSpeed: number;
  omnivamp: number;
  physicalLethality: number;
  physicalVamp: number;
  resourceMax: number;
  resourceRegenRate: number;
  resourceType: string;
  resourceValue: number;
  spellVamp: number;
  tenacity: number;
}

export interface RuneInfo {
  displayName: string;
  id: number;
  rawDescription: string;
  rawDisplayName: string;
}

export interface RuneTree {
  id: number;
  displayName: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface FullRunes {
  generalRunes: RuneInfo[];
  keystone: RuneInfo;
  primaryRuneTree: RuneTree;
  secondaryRuneTree: RuneTree;
  statRunes: RuneInfo[];
}

export interface ActivePlayer {
  abilities: ChampionAbilities;
  championStats: ChampionStats;
  currentGold: number;
  fullRunes: FullRunes;
  level: number;
  summonerName: string;
  teamRelativeColors: boolean;
}

export interface Item {
  canUse: boolean;
  consumable: boolean;
  count: number;
  displayName: string;
  itemID: number;
  price: number;
  rawDescription: string;
  rawDisplayName: string;
  slot: number;
}

export interface Scores {
  assists: number;
  creepScore: number;
  deaths: number;
  kills: number;
  wardScore: number;
}

export interface SummonerSpell {
  displayName: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface SummonerSpells {
  summonerSpellOne: SummonerSpell;
  summonerSpellTwo: SummonerSpell;
}

export interface PlayerRunes {
  keystone: RuneInfo;
  primaryRuneTree: RuneTree;
  secondaryRuneTree: RuneTree;
}

export interface PlayerInfo {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  items: Item[];
  level: number;
  position: string;
  rawChampionName: string;
  rawSkinName: string;
  respawnTimer: number;
  runes: PlayerRunes;
  scores: Scores;
  skinID: number;
  skinName: string;
  summonerName: string;
  summonerSpells: SummonerSpells;
  team: 'ORDER' | 'CHAOS';
}

export interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface GameEvent {
  EventID: number;
  EventName: string;
  EventTime: number;
  Assisters?: string[];
  DragonType?: string;
  KillerName?: string;
  Recipient?: string;
  Result?: string;
  Stolen?: boolean;
  TurretKilled?: string;
  VictimName?: string;
  InhibKilled?: string;
}

export interface EventData {
  Events: GameEvent[];
}

export interface AllGameData {
  activePlayer: ActivePlayer;
  allPlayers: PlayerInfo[];
  events: EventData;
  gameData: GameData;
}
