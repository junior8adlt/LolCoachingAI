export type ChampionArchetype = 'early' | 'mid' | 'late';
export type ChampionRole = 'top' | 'mid' | 'adc' | 'sup' | 'jng';

export interface PowerSpikeData {
  levelSpikes: number[];
  itemSpikes: string[];
  archetype: ChampionArchetype;
  role: ChampionRole;
}

const powerSpikeDatabase: Record<string, PowerSpikeData> = {
  // ===== Top Lane =====
  Darius: {
    levelSpikes: [1, 3, 6],
    itemSpikes: ['Trinity Force', 'Sterak\'s Gage'],
    archetype: 'early',
    role: 'top',
  },
  Garen: {
    levelSpikes: [1, 6, 11],
    itemSpikes: ['Berserker\'s Greaves', 'Stridebreaker'],
    archetype: 'mid',
    role: 'top',
  },
  Fiora: {
    levelSpikes: [1, 6, 11],
    itemSpikes: ['Ravenous Hydra', 'Divine Sunderer'],
    archetype: 'mid',
    role: 'top',
  },
  Camille: {
    levelSpikes: [1, 2, 6, 16],
    itemSpikes: ['Trinity Force', 'Ravenous Hydra'],
    archetype: 'mid',
    role: 'top',
  },
  Jax: {
    levelSpikes: [1, 6, 11, 16],
    itemSpikes: ['Blade of the Ruined King', 'Trinity Force'],
    archetype: 'late',
    role: 'top',
  },
  Riven: {
    levelSpikes: [1, 3, 6],
    itemSpikes: ['Eclipse', 'Black Cleaver'],
    archetype: 'early',
    role: 'top',
  },
  Aatrox: {
    levelSpikes: [1, 3, 6],
    itemSpikes: ['Eclipse', 'Black Cleaver'],
    archetype: 'early',
    role: 'top',
  },
  Sett: {
    levelSpikes: [1, 3, 6],
    itemSpikes: ['Blade of the Ruined King', 'Stridebreaker'],
    archetype: 'early',
    role: 'top',
  },
  Mordekaiser: {
    levelSpikes: [2, 6, 11],
    itemSpikes: ['Riftmaker', 'Rylai\'s Crystal Scepter'],
    archetype: 'mid',
    role: 'top',
  },
  Irelia: {
    levelSpikes: [1, 4, 6],
    itemSpikes: ['Blade of the Ruined King', 'Wit\'s End'],
    archetype: 'mid',
    role: 'top',
  },
  Nasus: {
    levelSpikes: [6, 11, 16],
    itemSpikes: ['Divine Sunderer', 'Frozen Heart'],
    archetype: 'late',
    role: 'top',
  },

  // ===== Mid Lane =====
  Zed: {
    levelSpikes: [3, 6, 11],
    itemSpikes: ['Duskblade of Draktharr', 'Youmuu\'s Ghostblade'],
    archetype: 'mid',
    role: 'mid',
  },
  Ahri: {
    levelSpikes: [3, 6, 11],
    itemSpikes: ['Lost Chapter', 'Luden\'s Tempest'],
    archetype: 'mid',
    role: 'mid',
  },
  Yasuo: {
    levelSpikes: [2, 6, 13],
    itemSpikes: ['Berserker\'s Greaves', 'Kraken Slayer', 'Infinity Edge'],
    archetype: 'mid',
    role: 'mid',
  },
  Syndra: {
    levelSpikes: [3, 6, 9],
    itemSpikes: ['Lost Chapter', 'Luden\'s Tempest'],
    archetype: 'mid',
    role: 'mid',
  },
  Fizz: {
    levelSpikes: [3, 6, 11],
    itemSpikes: ['Hextech Rocketbelt', 'Lich Bane'],
    archetype: 'mid',
    role: 'mid',
  },
  Katarina: {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Nashor\'s Tooth', 'Hextech Rocketbelt'],
    archetype: 'early',
    role: 'mid',
  },
  Akali: {
    levelSpikes: [3, 6, 11],
    itemSpikes: ['Hextech Rocketbelt', 'Shadowflame'],
    archetype: 'mid',
    role: 'mid',
  },
  LeBlanc: {
    levelSpikes: [2, 3, 6, 11],
    itemSpikes: ['Luden\'s Tempest', 'Shadowflame'],
    archetype: 'early',
    role: 'mid',
  },
  Kassadin: {
    levelSpikes: [6, 11, 16],
    itemSpikes: ['Rod of Ages', 'Archangel\'s Staff'],
    archetype: 'late',
    role: 'mid',
  },

  // ===== ADC =====
  'Kai\'Sa': {
    levelSpikes: [2, 6, 11],
    itemSpikes: ['Kraken Slayer', 'Nashor\'s Tooth'],
    archetype: 'mid',
    role: 'adc',
  },
  Jinx: {
    levelSpikes: [2, 6, 11],
    itemSpikes: ['Kraken Slayer', 'Rapid Firecannon'],
    archetype: 'late',
    role: 'adc',
  },
  Ezreal: {
    levelSpikes: [2, 6, 11],
    itemSpikes: ['Manamune', 'Trinity Force'],
    archetype: 'mid',
    role: 'adc',
  },
  Draven: {
    levelSpikes: [1, 2, 6],
    itemSpikes: ['B.F. Sword', 'Kraken Slayer'],
    archetype: 'early',
    role: 'adc',
  },
  Lucian: {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Blade of the Ruined King', 'Kraken Slayer'],
    archetype: 'early',
    role: 'adc',
  },
  Caitlyn: {
    levelSpikes: [1, 6, 11],
    itemSpikes: ['Infinity Edge', 'Rapid Firecannon'],
    archetype: 'early',
    role: 'adc',
  },
  Jhin: {
    levelSpikes: [1, 4, 6],
    itemSpikes: ['Galeforce', 'Rapid Firecannon'],
    archetype: 'mid',
    role: 'adc',
  },
  'Miss Fortune': {
    levelSpikes: [1, 2, 6],
    itemSpikes: ['Eclipse', 'The Collector'],
    archetype: 'early',
    role: 'adc',
  },

  // ===== Jungle =====
  'Lee Sin': {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Goredrinker', 'Black Cleaver'],
    archetype: 'early',
    role: 'jng',
  },
  Evelynn: {
    levelSpikes: [6, 11, 16],
    itemSpikes: ['Hextech Rocketbelt', 'Rabadon\'s Deathcap'],
    archetype: 'late',
    role: 'jng',
  },

  // ===== Support =====
  Thresh: {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Locket of the Iron Solari', 'Knight\'s Vow'],
    archetype: 'early',
    role: 'sup',
  },
  Leona: {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Locket of the Iron Solari', 'Knight\'s Vow'],
    archetype: 'early',
    role: 'sup',
  },
  Nautilus: {
    levelSpikes: [2, 3, 6],
    itemSpikes: ['Locket of the Iron Solari', 'Zeke\'s Convergence'],
    archetype: 'early',
    role: 'sup',
  },
};

export function getPowerSpike(championName: string): PowerSpikeData | null {
  return powerSpikeDatabase[championName] ?? null;
}

export function isAtPowerSpike(
  championName: string,
  level: number
): boolean {
  const data = powerSpikeDatabase[championName];
  if (!data) return false;
  return data.levelSpikes.includes(level);
}

export function getArchetype(
  championName: string
): ChampionArchetype | null {
  const data = powerSpikeDatabase[championName];
  if (!data) return null;
  return data.archetype;
}

export function getItemSpikes(championName: string): string[] {
  const data = powerSpikeDatabase[championName];
  if (!data) return [];
  return data.itemSpikes;
}

export function getChampionRole(championName: string): ChampionRole | null {
  const data = powerSpikeDatabase[championName];
  if (!data) return null;
  return data.role;
}

export function getAllChampionsWithSpikes(): string[] {
  return Object.keys(powerSpikeDatabase);
}
