export type ChampionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type ChampionArchetype =
  | 'assassin'
  | 'tank'
  | 'bruiser'
  | 'mage'
  | 'marksman'
  | 'enchanter'
  | 'engage_support'
  | 'specialist'
  | 'diver'
  | 'juggernaut'
  | 'artillery'
  | 'skirmisher';
export type ChampionRole = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

export interface ChampionMeta {
  riotApiName: string;
  displayName: string;
  roles: ChampionRole[];
  difficulty: ChampionDifficulty;
  archetypes: ChampionArchetype[];
}

export const championMetaDB: Record<string, ChampionMeta> = {
  // ===== A =====
  'Aatrox': {
    riotApiName: 'Aatrox',
    displayName: 'Aatrox',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut', 'bruiser'],
  },
  'Ahri': {
    riotApiName: 'Ahri',
    displayName: 'Ahri',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage', 'assassin'],
  },
  'Akali': {
    riotApiName: 'Akali',
    displayName: 'Akali',
    roles: ['mid', 'top'],
    difficulty: 'hard',
    archetypes: ['assassin'],
  },
  'Akshan': {
    riotApiName: 'Akshan',
    displayName: 'Akshan',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['marksman', 'assassin'],
  },
  'Alistar': {
    riotApiName: 'Alistar',
    displayName: 'Alistar',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['engage_support', 'tank'],
  },
  'Ambessa': {
    riotApiName: 'Ambessa',
    displayName: 'Ambessa',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['bruiser', 'diver'],
  },
  'Amumu': {
    riotApiName: 'Amumu',
    displayName: 'Amumu',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['tank', 'engage_support'],
  },
  'Anivia': {
    riotApiName: 'Anivia',
    displayName: 'Anivia',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Annie': {
    riotApiName: 'Annie',
    displayName: 'Annie',
    roles: ['mid'],
    difficulty: 'easy',
    archetypes: ['mage'],
  },
  'Aphelios': {
    riotApiName: 'Aphelios',
    displayName: 'Aphelios',
    roles: ['adc'],
    difficulty: 'expert',
    archetypes: ['marksman'],
  },
  'Ashe': {
    riotApiName: 'Ashe',
    displayName: 'Ashe',
    roles: ['adc'],
    difficulty: 'easy',
    archetypes: ['marksman'],
  },
  'Aurelion Sol': {
    riotApiName: 'AurelionSol',
    displayName: 'Aurelion Sol',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Aurora': {
    riotApiName: 'Aurora',
    displayName: 'Aurora',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage', 'assassin'],
  },
  'Azir': {
    riotApiName: 'Azir',
    displayName: 'Azir',
    roles: ['mid'],
    difficulty: 'expert',
    archetypes: ['mage', 'specialist'],
  },

  // ===== B =====
  'Bard': {
    riotApiName: 'Bard',
    displayName: 'Bard',
    roles: ['support'],
    difficulty: 'hard',
    archetypes: ['enchanter', 'specialist'],
  },
  "Bel'Veth": {
    riotApiName: 'Belveth',
    displayName: "Bel'Veth",
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['skirmisher', 'diver'],
  },
  'Blitzcrank': {
    riotApiName: 'Blitzcrank',
    displayName: 'Blitzcrank',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['engage_support', 'tank'],
  },
  'Brand': {
    riotApiName: 'Brand',
    displayName: 'Brand',
    roles: ['mid', 'support'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Braum': {
    riotApiName: 'Braum',
    displayName: 'Braum',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['engage_support', 'tank'],
  },
  'Briar': {
    riotApiName: 'Briar',
    displayName: 'Briar',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['diver', 'assassin'],
  },

  // ===== C =====
  'Caitlyn': {
    riotApiName: 'Caitlyn',
    displayName: 'Caitlyn',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },
  'Camille': {
    riotApiName: 'Camille',
    displayName: 'Camille',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['diver', 'bruiser'],
  },
  'Cassiopeia': {
    riotApiName: 'Cassiopeia',
    displayName: 'Cassiopeia',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  "Cho'Gath": {
    riotApiName: 'Chogath',
    displayName: "Cho'Gath",
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['tank', 'mage'],
  },
  'Corki': {
    riotApiName: 'Corki',
    displayName: 'Corki',
    roles: ['mid', 'adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'mage'],
  },

  // ===== D =====
  'Darius': {
    riotApiName: 'Darius',
    displayName: 'Darius',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut'],
  },
  'Diana': {
    riotApiName: 'Diana',
    displayName: 'Diana',
    roles: ['jungle', 'mid'],
    difficulty: 'medium',
    archetypes: ['diver', 'assassin'],
  },
  'Draven': {
    riotApiName: 'Draven',
    displayName: 'Draven',
    roles: ['adc'],
    difficulty: 'expert',
    archetypes: ['marksman'],
  },
  'Dr. Mundo': {
    riotApiName: 'DrMundo',
    displayName: 'Dr. Mundo',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut', 'tank'],
  },

  // ===== E =====
  'Ekko': {
    riotApiName: 'Ekko',
    displayName: 'Ekko',
    roles: ['jungle', 'mid'],
    difficulty: 'hard',
    archetypes: ['assassin', 'diver'],
  },
  'Elise': {
    riotApiName: 'Elise',
    displayName: 'Elise',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['diver', 'mage'],
  },
  'Evelynn': {
    riotApiName: 'Evelynn',
    displayName: 'Evelynn',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['assassin'],
  },
  'Ezreal': {
    riotApiName: 'Ezreal',
    displayName: 'Ezreal',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },

  // ===== F =====
  'Fiddlesticks': {
    riotApiName: 'Fiddlesticks',
    displayName: 'Fiddlesticks',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['mage', 'specialist'],
  },
  'Fiora': {
    riotApiName: 'Fiora',
    displayName: 'Fiora',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'diver'],
  },
  'Fizz': {
    riotApiName: 'Fizz',
    displayName: 'Fizz',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['assassin'],
  },

  // ===== G =====
  'Galio': {
    riotApiName: 'Galio',
    displayName: 'Galio',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['tank', 'mage'],
  },
  'Gangplank': {
    riotApiName: 'Gangplank',
    displayName: 'Gangplank',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['specialist', 'bruiser'],
  },
  'Garen': {
    riotApiName: 'Garen',
    displayName: 'Garen',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut'],
  },
  'Gnar': {
    riotApiName: 'Gnar',
    displayName: 'Gnar',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['bruiser', 'tank'],
  },
  'Gragas': {
    riotApiName: 'Gragas',
    displayName: 'Gragas',
    roles: ['top', 'jungle', 'mid'],
    difficulty: 'medium',
    archetypes: ['mage', 'tank', 'bruiser'],
  },
  'Graves': {
    riotApiName: 'Graves',
    displayName: 'Graves',
    roles: ['jungle', 'top'],
    difficulty: 'medium',
    archetypes: ['marksman', 'bruiser'],
  },
  'Gwen': {
    riotApiName: 'Gwen',
    displayName: 'Gwen',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'diver'],
  },

  // ===== H =====
  'Hecarim': {
    riotApiName: 'Hecarim',
    displayName: 'Hecarim',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['diver', 'bruiser'],
  },
  'Heimerdinger': {
    riotApiName: 'Heimerdinger',
    displayName: 'Heimerdinger',
    roles: ['top', 'mid', 'support'],
    difficulty: 'medium',
    archetypes: ['mage', 'specialist'],
  },
  'Hwei': {
    riotApiName: 'Hwei',
    displayName: 'Hwei',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage', 'artillery'],
  },

  // ===== I =====
  'Illaoi': {
    riotApiName: 'Illaoi',
    displayName: 'Illaoi',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut'],
  },
  'Irelia': {
    riotApiName: 'Irelia',
    displayName: 'Irelia',
    roles: ['top', 'mid'],
    difficulty: 'hard',
    archetypes: ['diver', 'skirmisher'],
  },
  'Ivern': {
    riotApiName: 'Ivern',
    displayName: 'Ivern',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['enchanter', 'specialist'],
  },

  // ===== J =====
  'Janna': {
    riotApiName: 'Janna',
    displayName: 'Janna',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Jarvan IV': {
    riotApiName: 'JarvanIV',
    displayName: 'Jarvan IV',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['diver', 'tank'],
  },
  'Jax': {
    riotApiName: 'Jax',
    displayName: 'Jax',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['skirmisher', 'diver'],
  },
  'Jayce': {
    riotApiName: 'Jayce',
    displayName: 'Jayce',
    roles: ['top', 'mid'],
    difficulty: 'hard',
    archetypes: ['bruiser', 'artillery'],
  },
  'Jhin': {
    riotApiName: 'Jhin',
    displayName: 'Jhin',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },
  'Jinx': {
    riotApiName: 'Jinx',
    displayName: 'Jinx',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },

  // ===== K =====
  "Kai'Sa": {
    riotApiName: 'Kaisa',
    displayName: "Kai'Sa",
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'assassin'],
  },
  'Kalista': {
    riotApiName: 'Kalista',
    displayName: 'Kalista',
    roles: ['adc'],
    difficulty: 'expert',
    archetypes: ['marksman'],
  },
  'Karma': {
    riotApiName: 'Karma',
    displayName: 'Karma',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter', 'mage'],
  },
  'Karthus': {
    riotApiName: 'Karthus',
    displayName: 'Karthus',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Kassadin': {
    riotApiName: 'Kassadin',
    displayName: 'Kassadin',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['assassin', 'mage'],
  },
  'Katarina': {
    riotApiName: 'Katarina',
    displayName: 'Katarina',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['assassin'],
  },
  'Kayle': {
    riotApiName: 'Kayle',
    displayName: 'Kayle',
    roles: ['top', 'mid'],
    difficulty: 'medium',
    archetypes: ['specialist', 'marksman'],
  },
  'Kayn': {
    riotApiName: 'Kayn',
    displayName: 'Kayn',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['assassin', 'skirmisher'],
  },
  'Kennen': {
    riotApiName: 'Kennen',
    displayName: 'Kennen',
    roles: ['top', 'mid'],
    difficulty: 'medium',
    archetypes: ['mage', 'bruiser'],
  },
  "Kha'Zix": {
    riotApiName: 'Khazix',
    displayName: "Kha'Zix",
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['assassin'],
  },
  'Kindred': {
    riotApiName: 'Kindred',
    displayName: 'Kindred',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['marksman', 'skirmisher'],
  },
  'Kled': {
    riotApiName: 'Kled',
    displayName: 'Kled',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['diver', 'bruiser'],
  },
  "Kog'Maw": {
    riotApiName: 'KogMaw',
    displayName: "Kog'Maw",
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'artillery'],
  },
  "K'Sante": {
    riotApiName: 'KSante',
    displayName: "K'Sante",
    roles: ['top'],
    difficulty: 'expert',
    archetypes: ['tank', 'skirmisher'],
  },

  // ===== L =====
  'LeBlanc': {
    riotApiName: 'Leblanc',
    displayName: 'LeBlanc',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['assassin', 'mage'],
  },
  'Lee Sin': {
    riotApiName: 'LeeSin',
    displayName: 'Lee Sin',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['diver', 'assassin'],
  },
  'Leona': {
    riotApiName: 'Leona',
    displayName: 'Leona',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['engage_support', 'tank'],
  },
  'Lillia': {
    riotApiName: 'Lillia',
    displayName: 'Lillia',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['mage', 'skirmisher'],
  },
  'Lissandra': {
    riotApiName: 'Lissandra',
    displayName: 'Lissandra',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Lucian': {
    riotApiName: 'Lucian',
    displayName: 'Lucian',
    roles: ['adc', 'mid'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },
  'Lulu': {
    riotApiName: 'Lulu',
    displayName: 'Lulu',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Lux': {
    riotApiName: 'Lux',
    displayName: 'Lux',
    roles: ['mid', 'support'],
    difficulty: 'easy',
    archetypes: ['mage', 'artillery'],
  },

  // ===== M =====
  'Malphite': {
    riotApiName: 'Malphite',
    displayName: 'Malphite',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['tank'],
  },
  'Malzahar': {
    riotApiName: 'Malzahar',
    displayName: 'Malzahar',
    roles: ['mid'],
    difficulty: 'easy',
    archetypes: ['mage'],
  },
  'Maokai': {
    riotApiName: 'Maokai',
    displayName: 'Maokai',
    roles: ['support', 'jungle'],
    difficulty: 'easy',
    archetypes: ['tank', 'engage_support'],
  },
  'Master Yi': {
    riotApiName: 'MasterYi',
    displayName: 'Master Yi',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['skirmisher', 'assassin'],
  },
  'Mel': {
    riotApiName: 'Mel',
    displayName: 'Mel',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Milio': {
    riotApiName: 'Milio',
    displayName: 'Milio',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Miss Fortune': {
    riotApiName: 'MissFortune',
    displayName: 'Miss Fortune',
    roles: ['adc'],
    difficulty: 'easy',
    archetypes: ['marksman'],
  },
  'Mordekaiser': {
    riotApiName: 'Mordekaiser',
    displayName: 'Mordekaiser',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut'],
  },
  'Morgana': {
    riotApiName: 'Morgana',
    displayName: 'Morgana',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter', 'mage'],
  },

  // ===== N =====
  'Naafiri': {
    riotApiName: 'Naafiri',
    displayName: 'Naafiri',
    roles: ['mid'],
    difficulty: 'easy',
    archetypes: ['assassin'],
  },
  'Nami': {
    riotApiName: 'Nami',
    displayName: 'Nami',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['enchanter'],
  },
  'Nasus': {
    riotApiName: 'Nasus',
    displayName: 'Nasus',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut'],
  },
  'Nautilus': {
    riotApiName: 'Nautilus',
    displayName: 'Nautilus',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['engage_support', 'tank'],
  },
  'Neeko': {
    riotApiName: 'Neeko',
    displayName: 'Neeko',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Nidalee': {
    riotApiName: 'Nidalee',
    displayName: 'Nidalee',
    roles: ['jungle'],
    difficulty: 'expert',
    archetypes: ['assassin', 'mage'],
  },
  'Nilah': {
    riotApiName: 'Nilah',
    displayName: 'Nilah',
    roles: ['adc'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'marksman'],
  },
  'Nocturne': {
    riotApiName: 'Nocturne',
    displayName: 'Nocturne',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['assassin', 'diver'],
  },
  'Nunu & Willump': {
    riotApiName: 'Nunu',
    displayName: 'Nunu & Willump',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['tank', 'mage'],
  },

  // ===== O =====
  'Olaf': {
    riotApiName: 'Olaf',
    displayName: 'Olaf',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut', 'diver'],
  },
  'Orianna': {
    riotApiName: 'Orianna',
    displayName: 'Orianna',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Ornn': {
    riotApiName: 'Ornn',
    displayName: 'Ornn',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['tank'],
  },

  // ===== P =====
  'Pantheon': {
    riotApiName: 'Pantheon',
    displayName: 'Pantheon',
    roles: ['top', 'mid', 'jungle', 'support'],
    difficulty: 'easy',
    archetypes: ['bruiser', 'diver'],
  },
  'Poppy': {
    riotApiName: 'Poppy',
    displayName: 'Poppy',
    roles: ['jungle', 'top', 'support'],
    difficulty: 'medium',
    archetypes: ['tank', 'diver'],
  },
  'Pyke': {
    riotApiName: 'Pyke',
    displayName: 'Pyke',
    roles: ['support'],
    difficulty: 'hard',
    archetypes: ['assassin', 'engage_support'],
  },

  // ===== Q =====
  'Qiyana': {
    riotApiName: 'Qiyana',
    displayName: 'Qiyana',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['assassin'],
  },
  'Quinn': {
    riotApiName: 'Quinn',
    displayName: 'Quinn',
    roles: ['top', 'mid'],
    difficulty: 'medium',
    archetypes: ['marksman', 'assassin'],
  },

  // ===== R =====
  'Rakan': {
    riotApiName: 'Rakan',
    displayName: 'Rakan',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['engage_support', 'enchanter'],
  },
  'Rammus': {
    riotApiName: 'Rammus',
    displayName: 'Rammus',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['tank'],
  },
  "Rek'Sai": {
    riotApiName: 'RekSai',
    displayName: "Rek'Sai",
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['diver', 'skirmisher'],
  },
  'Rell': {
    riotApiName: 'Rell',
    displayName: 'Rell',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['engage_support', 'tank'],
  },
  'Renata Glasc': {
    riotApiName: 'Renata',
    displayName: 'Renata Glasc',
    roles: ['support'],
    difficulty: 'hard',
    archetypes: ['enchanter', 'mage'],
  },
  'Renekton': {
    riotApiName: 'Renekton',
    displayName: 'Renekton',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['bruiser', 'diver'],
  },
  'Rengar': {
    riotApiName: 'Rengar',
    displayName: 'Rengar',
    roles: ['jungle', 'top'],
    difficulty: 'hard',
    archetypes: ['assassin', 'diver'],
  },
  'Riven': {
    riotApiName: 'Riven',
    displayName: 'Riven',
    roles: ['top'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'bruiser'],
  },
  'Rumble': {
    riotApiName: 'Rumble',
    displayName: 'Rumble',
    roles: ['top', 'mid'],
    difficulty: 'hard',
    archetypes: ['mage', 'bruiser'],
  },
  'Ryze': {
    riotApiName: 'Ryze',
    displayName: 'Ryze',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },

  // ===== S =====
  'Samira': {
    riotApiName: 'Samira',
    displayName: 'Samira',
    roles: ['adc'],
    difficulty: 'hard',
    archetypes: ['marksman', 'assassin'],
  },
  'Sejuani': {
    riotApiName: 'Sejuani',
    displayName: 'Sejuani',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['tank', 'engage_support'],
  },
  'Senna': {
    riotApiName: 'Senna',
    displayName: 'Senna',
    roles: ['adc', 'support'],
    difficulty: 'medium',
    archetypes: ['marksman', 'enchanter'],
  },
  'Seraphine': {
    riotApiName: 'Seraphine',
    displayName: 'Seraphine',
    roles: ['mid', 'support', 'adc'],
    difficulty: 'easy',
    archetypes: ['mage', 'enchanter'],
  },
  'Sett': {
    riotApiName: 'Sett',
    displayName: 'Sett',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut', 'bruiser'],
  },
  'Shaco': {
    riotApiName: 'Shaco',
    displayName: 'Shaco',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['assassin', 'specialist'],
  },
  'Shen': {
    riotApiName: 'Shen',
    displayName: 'Shen',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['tank'],
  },
  'Shyvana': {
    riotApiName: 'Shyvana',
    displayName: 'Shyvana',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['juggernaut', 'mage'],
  },
  'Singed': {
    riotApiName: 'Singed',
    displayName: 'Singed',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['specialist', 'tank'],
  },
  'Sion': {
    riotApiName: 'Sion',
    displayName: 'Sion',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['tank'],
  },
  'Sivir': {
    riotApiName: 'Sivir',
    displayName: 'Sivir',
    roles: ['adc'],
    difficulty: 'easy',
    archetypes: ['marksman'],
  },
  'Skarner': {
    riotApiName: 'Skarner',
    displayName: 'Skarner',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['tank', 'diver'],
  },
  'Smolder': {
    riotApiName: 'Smolder',
    displayName: 'Smolder',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'mage'],
  },
  'Sona': {
    riotApiName: 'Sona',
    displayName: 'Sona',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Soraka': {
    riotApiName: 'Soraka',
    displayName: 'Soraka',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Swain': {
    riotApiName: 'Swain',
    displayName: 'Swain',
    roles: ['mid', 'support', 'adc'],
    difficulty: 'medium',
    archetypes: ['mage', 'bruiser'],
  },
  'Sylas': {
    riotApiName: 'Sylas',
    displayName: 'Sylas',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage', 'assassin'],
  },
  'Syndra': {
    riotApiName: 'Syndra',
    displayName: 'Syndra',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },

  // ===== T =====
  'Tahm Kench': {
    riotApiName: 'TahmKench',
    displayName: 'Tahm Kench',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['tank', 'engage_support'],
  },
  'Taliyah': {
    riotApiName: 'Taliyah',
    displayName: 'Taliyah',
    roles: ['jungle', 'mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Talon': {
    riotApiName: 'Talon',
    displayName: 'Talon',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['assassin'],
  },
  'Taric': {
    riotApiName: 'Taric',
    displayName: 'Taric',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['enchanter', 'tank'],
  },
  'Teemo': {
    riotApiName: 'Teemo',
    displayName: 'Teemo',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['specialist', 'marksman'],
  },
  'Thresh': {
    riotApiName: 'Thresh',
    displayName: 'Thresh',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['engage_support', 'tank'],
  },
  'Tristana': {
    riotApiName: 'Tristana',
    displayName: 'Tristana',
    roles: ['adc', 'mid'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },
  'Trundle': {
    riotApiName: 'Trundle',
    displayName: 'Trundle',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['juggernaut', 'diver'],
  },
  'Tryndamere': {
    riotApiName: 'Tryndamere',
    displayName: 'Tryndamere',
    roles: ['top'],
    difficulty: 'easy',
    archetypes: ['skirmisher'],
  },
  'Twisted Fate': {
    riotApiName: 'TwistedFate',
    displayName: 'Twisted Fate',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage', 'specialist'],
  },
  'Twitch': {
    riotApiName: 'Twitch',
    displayName: 'Twitch',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'assassin'],
  },

  // ===== U =====
  'Udyr': {
    riotApiName: 'Udyr',
    displayName: 'Udyr',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['juggernaut', 'bruiser'],
  },
  'Urgot': {
    riotApiName: 'Urgot',
    displayName: 'Urgot',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut'],
  },

  // ===== V =====
  'Varus': {
    riotApiName: 'Varus',
    displayName: 'Varus',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman', 'artillery'],
  },
  'Vayne': {
    riotApiName: 'Vayne',
    displayName: 'Vayne',
    roles: ['adc'],
    difficulty: 'hard',
    archetypes: ['marksman', 'assassin'],
  },
  'Veigar': {
    riotApiName: 'Veigar',
    displayName: 'Veigar',
    roles: ['mid', 'support', 'adc'],
    difficulty: 'easy',
    archetypes: ['mage'],
  },
  "Vel'Koz": {
    riotApiName: 'Velkoz',
    displayName: "Vel'Koz",
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['mage', 'artillery'],
  },
  'Vex': {
    riotApiName: 'Vex',
    displayName: 'Vex',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Vi': {
    riotApiName: 'Vi',
    displayName: 'Vi',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['diver', 'bruiser'],
  },
  'Viego': {
    riotApiName: 'Viego',
    displayName: 'Viego',
    roles: ['jungle'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'assassin'],
  },
  'Viktor': {
    riotApiName: 'Viktor',
    displayName: 'Viktor',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage'],
  },
  'Vladimir': {
    riotApiName: 'Vladimir',
    displayName: 'Vladimir',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
  'Volibear': {
    riotApiName: 'Volibear',
    displayName: 'Volibear',
    roles: ['jungle', 'top'],
    difficulty: 'easy',
    archetypes: ['juggernaut', 'diver'],
  },

  // ===== W =====
  'Warwick': {
    riotApiName: 'Warwick',
    displayName: 'Warwick',
    roles: ['jungle', 'top'],
    difficulty: 'easy',
    archetypes: ['diver', 'juggernaut'],
  },
  'Wukong': {
    riotApiName: 'MonkeyKing',
    displayName: 'Wukong',
    roles: ['jungle', 'top'],
    difficulty: 'medium',
    archetypes: ['diver', 'bruiser'],
  },

  // ===== X =====
  'Xayah': {
    riotApiName: 'Xayah',
    displayName: 'Xayah',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },
  'Xerath': {
    riotApiName: 'Xerath',
    displayName: 'Xerath',
    roles: ['mid', 'support'],
    difficulty: 'medium',
    archetypes: ['mage', 'artillery'],
  },
  'Xin Zhao': {
    riotApiName: 'XinZhao',
    displayName: 'Xin Zhao',
    roles: ['jungle'],
    difficulty: 'easy',
    archetypes: ['diver', 'skirmisher'],
  },

  // ===== Y =====
  'Yasuo': {
    riotApiName: 'Yasuo',
    displayName: 'Yasuo',
    roles: ['mid', 'top', 'adc'],
    difficulty: 'hard',
    archetypes: ['skirmisher'],
  },
  'Yone': {
    riotApiName: 'Yone',
    displayName: 'Yone',
    roles: ['mid', 'top'],
    difficulty: 'hard',
    archetypes: ['skirmisher', 'assassin'],
  },
  'Yorick': {
    riotApiName: 'Yorick',
    displayName: 'Yorick',
    roles: ['top'],
    difficulty: 'medium',
    archetypes: ['juggernaut', 'specialist'],
  },
  'Yuumi': {
    riotApiName: 'Yuumi',
    displayName: 'Yuumi',
    roles: ['support'],
    difficulty: 'easy',
    archetypes: ['enchanter'],
  },
  'Yunara': {
    riotApiName: 'Yunara',
    displayName: 'Yunara',
    roles: ['adc'],
    difficulty: 'medium',
    archetypes: ['marksman'],
  },

  // ===== Z =====
  'Zac': {
    riotApiName: 'Zac',
    displayName: 'Zac',
    roles: ['jungle'],
    difficulty: 'medium',
    archetypes: ['tank', 'diver'],
  },
  'Zaahen': {
    riotApiName: 'Zaahen',
    displayName: 'Zaahen',
    roles: ['top', 'jungle'],
    difficulty: 'medium',
    archetypes: ['skirmisher', 'bruiser'],
  },
  'Zed': {
    riotApiName: 'Zed',
    displayName: 'Zed',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['assassin'],
  },
  'Zeri': {
    riotApiName: 'Zeri',
    displayName: 'Zeri',
    roles: ['adc'],
    difficulty: 'hard',
    archetypes: ['marksman'],
  },
  'Ziggs': {
    riotApiName: 'Ziggs',
    displayName: 'Ziggs',
    roles: ['mid'],
    difficulty: 'medium',
    archetypes: ['mage', 'artillery'],
  },
  'Zilean': {
    riotApiName: 'Zilean',
    displayName: 'Zilean',
    roles: ['support'],
    difficulty: 'medium',
    archetypes: ['enchanter', 'mage'],
  },
  'Zoe': {
    riotApiName: 'Zoe',
    displayName: 'Zoe',
    roles: ['mid'],
    difficulty: 'hard',
    archetypes: ['mage', 'artillery'],
  },
  'Zyra': {
    riotApiName: 'Zyra',
    displayName: 'Zyra',
    roles: ['mid', 'support'],
    difficulty: 'medium',
    archetypes: ['mage'],
  },
};

// ===== Reverse lookup: Riot API name -> display name =====
const apiNameToDisplayName: Record<string, string> = {};
for (const [displayName, meta] of Object.entries(championMetaDB)) {
  apiNameToDisplayName[meta.riotApiName.toLowerCase()] = displayName;
}

// ===== Helper Functions =====

/**
 * Get full champion metadata by display name.
 * Performs a case-insensitive lookup.
 */
export function getChampionMeta(name: string): ChampionMeta | null {
  if (championMetaDB[name]) {
    return championMetaDB[name];
  }
  // Case-insensitive fallback
  const lower = name.toLowerCase();
  for (const [key, meta] of Object.entries(championMetaDB)) {
    if (key.toLowerCase() === lower) {
      return meta;
    }
  }
  return null;
}

/**
 * Get all viable roles for a champion by display name.
 */
export function getChampionRoles(name: string): ChampionRole[] {
  const meta = getChampionMeta(name);
  return meta ? meta.roles : [];
}

/**
 * Get the difficulty rating for a champion by display name.
 */
export function getChampionDifficulty(name: string): ChampionDifficulty | null {
  const meta = getChampionMeta(name);
  return meta ? meta.difficulty : null;
}

/**
 * Get all archetypes for a champion by display name.
 */
export function getChampionArchetypes(name: string): ChampionArchetype[] {
  const meta = getChampionMeta(name);
  return meta ? meta.archetypes : [];
}

/**
 * Convert a Riot API internal name (e.g. "AurelionSol", "DrMundo", "MonkeyKing")
 * to the display name used by the Live Client Data API (e.g. "Aurelion Sol", "Dr. Mundo", "Wukong").
 */
export function resolveChampionName(riotApiName: string): string | null {
  const result = apiNameToDisplayName[riotApiName.toLowerCase()];
  return result ?? null;
}

/**
 * Returns true if the champion is viable in 2 or more roles.
 */
export function isFlexPick(name: string): boolean {
  const meta = getChampionMeta(name);
  return meta ? meta.roles.length >= 2 : false;
}
