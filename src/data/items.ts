// ============================================================================
// League of Legends Item Database - Season 2026 (Current as of Patch 26.S1)
// ============================================================================

export type ItemCategory =
  | 'starter'
  | 'boots'
  | 'component'
  | 'legendary'
  | 'consumable'
  | 'trinket';

export type ItemStat =
  | 'ad' | 'ap' | 'health' | 'armor' | 'mr' | 'attack_speed'
  | 'crit' | 'lethality' | 'magic_pen' | 'armor_pen'
  | 'lifesteal' | 'omnivamp' | 'ability_haste' | 'mana' | 'move_speed';

export type ItemTag =
  | 'anti_heal'
  | 'anti_shield'
  | 'tank_shred'
  | 'burst'
  | 'sustain'
  | 'defensive'
  | 'poke'
  | 'crit'
  | 'on_hit'
  | 'lethality'
  | 'ap_burst'
  | 'ap_sustain'
  | 'support'
  | 'tank'
  | 'split_push'
  | 'teamfight';

export interface ItemData {
  id: number;
  name: string;
  price: number;
  category: ItemCategory;
  stats: ItemStat[];
  tags: ItemTag[];
  goodAgainst: string;
  description: string;
}

// ============================================================================
// ITEM DATABASE
// ============================================================================

export const itemDatabase: Record<string, ItemData> = {

  // ==========================================================================
  // CONSUMABLES
  // ==========================================================================

  'Health Potion': {
    id: 2003,
    name: 'Health Potion',
    price: 50,
    category: 'consumable',
    stats: ['health'],
    tags: ['sustain'],
    goodAgainst: 'Early lane sustain',
    description: 'Buy at the start of the game or on early backs for lane sustain. Restores 120 HP over 15 seconds.',
  },

  'Refillable Potion': {
    id: 2031,
    name: 'Refillable Potion',
    price: 150,
    category: 'consumable',
    stats: ['health'],
    tags: ['sustain'],
    goodAgainst: 'Lanes where you need repeated sustain',
    description: 'Gold efficient if you back more than 3 times. Great on junglers and safe laners who want long-term value.',
  },

  'Control Ward': {
    id: 2055,
    name: 'Control Ward',
    price: 75,
    category: 'consumable',
    stats: [],
    tags: ['support', 'defensive'],
    goodAgainst: 'Enemy vision and stealth champions',
    description: 'Buy one every back. Essential for vision control. Place in river, tribush, or around objectives before fights.',
  },

  // ==========================================================================
  // STARTER ITEMS
  // ==========================================================================

  "Doran's Blade": {
    id: 1055,
    name: "Doran's Blade",
    price: 450,
    category: 'starter',
    stats: ['ad', 'health', 'lifesteal'],
    tags: ['sustain'],
    goodAgainst: 'Standard AD start for trading and sustain',
    description: 'Default start for most ADCs and AD melee laners. Gives you trading power and sustain through omnivamp.',
  },

  "Doran's Ring": {
    id: 1056,
    name: "Doran's Ring",
    price: 400,
    category: 'starter',
    stats: ['ap', 'health', 'mana'],
    tags: ['ap_burst'],
    goodAgainst: 'Standard AP start for mana sustain and trading',
    description: 'Default start for most AP mids and AP tops. Passive mana restore on unit kill helps with mana management.',
  },

  "Doran's Shield": {
    id: 1054,
    name: "Doran's Shield",
    price: 450,
    category: 'starter',
    stats: ['health'],
    tags: ['sustain', 'defensive'],
    goodAgainst: 'Poke-heavy lanes or ranged vs melee matchups',
    description: 'Start this into poke lanes (Teemo, Quinn, ranged tops). The passive regen after taking damage keeps you healthy.',
  },

  'Dark Seal': {
    id: 1082,
    name: 'Dark Seal',
    price: 350,
    category: 'starter',
    stats: ['ap', 'health', 'mana'],
    tags: ['ap_burst'],
    goodAgainst: 'When you expect to get early kills and snowball',
    description: 'Snowball AP item. Buy early if you are confident in getting kills. Sells efficiently. Upgrades to Mejai\'s.',
  },

  'Cull': {
    id: 1083,
    name: 'Cull',
    price: 450,
    category: 'starter',
    stats: ['ad', 'lifesteal'],
    tags: ['sustain'],
    goodAgainst: 'Passive farm lanes where you want to scale',
    description: 'Buy when you plan to farm passively. Gives 450 bonus gold after 100 minion kills. Do not buy in kill lanes.',
  },

  'World Atlas': {
    id: 3865,
    name: 'World Atlas',
    price: 400,
    category: 'starter',
    stats: ['health', 'ability_haste'],
    tags: ['support'],
    goodAgainst: 'Support starting item that generates gold',
    description: 'Standard support starter. Generates gold through the Tribute or Spoils of War passive. Upgrades automatically.',
  },

  'Tear of the Goddess': {
    id: 3070,
    name: 'Tear of the Goddess',
    price: 400,
    category: 'starter',
    stats: ['mana'],
    tags: ['sustain'],
    goodAgainst: 'Champions who need large mana pools (Ryze, Ezreal, Cassiopeia)',
    description: 'Buy early if your champion needs the mana stacking. Upgrades into Archangel\'s Staff or Manamune.',
  },

  // ==========================================================================
  // BOOTS
  // ==========================================================================

  'Berserker\'s Greaves': {
    id: 3006,
    name: 'Berserker\'s Greaves',
    price: 1100,
    category: 'boots',
    stats: ['attack_speed', 'move_speed'],
    tags: ['crit', 'on_hit'],
    goodAgainst: 'Default ADC and on-hit champion boots',
    description: 'Standard boots for ADCs and attack speed champions. Rush these for DPS. Upgrade to Gunmetal Greaves as T3.',
  },

  'Sorcerer\'s Shoes': {
    id: 3020,
    name: 'Sorcerer\'s Shoes',
    price: 1100,
    category: 'boots',
    stats: ['magic_pen', 'move_speed'],
    tags: ['ap_burst'],
    goodAgainst: 'Squishy enemies without MR',
    description: 'Best boots for AP burst mages. The flat magic pen is huge in early-mid game vs targets with low MR. Upgrade to Spellslinger\'s Shoes as T3.',
  },

  'Plated Steelcaps': {
    id: 3047,
    name: 'Plated Steelcaps',
    price: 1100,
    category: 'boots',
    stats: ['armor', 'move_speed'],
    tags: ['defensive', 'tank'],
    goodAgainst: 'vs heavy AD and auto-attackers (ADCs, Tryndamere, Yasuo)',
    description: 'Buy vs AD-heavy comps or fed ADCs. Reduces auto-attack damage by 12%. Upgrade to Armored Advance as T3.',
  },

  'Mercury\'s Treads': {
    id: 3111,
    name: 'Mercury\'s Treads',
    price: 1100,
    category: 'boots',
    stats: ['mr', 'move_speed'],
    tags: ['defensive', 'tank'],
    goodAgainst: 'vs heavy AP and CC-heavy teams',
    description: 'Buy vs AP threats and heavy CC comps. The 30% tenacity reduces CC duration significantly. Upgrade to Chainlaced Crushers as T3.',
  },

  'Ionian Boots of Lucidity': {
    id: 3158,
    name: 'Ionian Boots of Lucidity',
    price: 900,
    category: 'boots',
    stats: ['ability_haste', 'move_speed'],
    tags: ['support'],
    goodAgainst: 'When you want cheaper boots with CDR',
    description: 'Cheapest boots option. Great for supports and ability-reliant champs. Also reduces summoner spell cooldowns. Upgrade to Crimson Lucidity as T3.',
  },

  'Boots of Swiftness': {
    id: 3009,
    name: 'Boots of Swiftness',
    price: 900,
    category: 'boots',
    stats: ['move_speed'],
    tags: ['defensive'],
    goodAgainst: 'vs slow-heavy teams (Ashe, Nasus, Rylai\'s users)',
    description: 'Highest base move speed boots. Buy vs perma-slow comps. The slow resistance is underrated. Upgrade to Swiftmarch as T3.',
  },

  // Tier 3 Boot Upgrades (require Blessing of Noxus + 2 Legendary items)
  'Gunmetal Greaves': {
    id: 4401,
    name: 'Gunmetal Greaves',
    price: 1500,
    category: 'boots',
    stats: ['attack_speed', 'lifesteal', 'move_speed'],
    tags: ['crit', 'sustain'],
    goodAgainst: 'Upgraded Berserker\'s for sustained DPS and lifesteal',
    description: 'T3 upgrade of Berserker\'s Greaves. Grants 40% AS, 5% lifesteal, and 45 MS. Upgrade once you have 2 legendaries.',
  },

  'Spellslinger\'s Shoes': {
    id: 4402,
    name: 'Spellslinger\'s Shoes',
    price: 1500,
    category: 'boots',
    stats: ['magic_pen', 'move_speed'],
    tags: ['ap_burst'],
    goodAgainst: 'Upgraded Sorc Shoes for max magic pen',
    description: 'T3 upgrade of Sorcerer\'s Shoes. Grants 8% magic pen instead of flat pen, scaling better into late game.',
  },

  'Armored Advance': {
    id: 4403,
    name: 'Armored Advance',
    price: 1500,
    category: 'boots',
    stats: ['armor', 'move_speed', 'health'],
    tags: ['defensive', 'tank'],
    goodAgainst: 'Upgraded Steelcaps for maximum armor and shielding',
    description: 'T3 upgrade of Plated Steelcaps. Grants 35 armor, 45 MS, and a shield based on bonus health.',
  },

  'Chainlaced Crushers': {
    id: 4404,
    name: 'Chainlaced Crushers',
    price: 1500,
    category: 'boots',
    stats: ['mr', 'move_speed'],
    tags: ['defensive', 'tank'],
    goodAgainst: 'Upgraded Mercs for magic damage shield and tenacity',
    description: 'T3 upgrade of Mercury\'s Treads. Grants 30 MR, 50 MS, 30% tenacity, and a magic damage shield.',
  },

  'Crimson Lucidity': {
    id: 4405,
    name: 'Crimson Lucidity',
    price: 1500,
    category: 'boots',
    stats: ['ability_haste', 'move_speed'],
    tags: ['support'],
    goodAgainst: 'Upgraded Lucidity boots with movement speed on ability use',
    description: 'T3 upgrade of Ionian Boots. 25 AH, 50 MS, summoner spell haste, and bonus MS when healing/shielding allies or damaging enemies.',
  },

  'Swiftmarch': {
    id: 4406,
    name: 'Swiftmarch',
    price: 1500,
    category: 'boots',
    stats: ['move_speed'],
    tags: ['defensive'],
    goodAgainst: 'Maximum mobility and slow resistance',
    description: 'T3 upgrade of Boots of Swiftness. 65 MS, 40% slow resist, and adaptive force equal to 5% of total MS. For roaming champs.',
  },

  // ==========================================================================
  // AD / CRIT LEGENDARY ITEMS
  // ==========================================================================

  'Infinity Edge': {
    id: 3031,
    name: 'Infinity Edge',
    price: 3400,
    category: 'legendary',
    stats: ['ad', 'crit'],
    tags: ['crit', 'burst'],
    goodAgainst: 'Multiplies crit damage for maximum late-game DPS',
    description: 'Core 3rd item for crit ADCs. Only buy when you already have 40%+ crit chance. This is YOUR scaling item - it makes crits hit for 210% instead of 200%.',
  },

  'Bloodthirster': {
    id: 3072,
    name: 'Bloodthirster',
    price: 3400,
    category: 'legendary',
    stats: ['ad', 'crit', 'lifesteal'],
    tags: ['crit', 'sustain'],
    goodAgainst: 'When you need sustain and a shield against burst',
    description: 'Best lifesteal item for ADCs. The overheal shield protects against burst. Buy when you need to survive assassins or poke.',
  },

  'Lord Dominik\'s Regards': {
    id: 3036,
    name: 'Lord Dominik\'s Regards',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'crit', 'armor_pen'],
    tags: ['crit', 'tank_shred'],
    goodAgainst: 'vs tanks and armor stackers (Malphite, Rammus, Leona)',
    description: 'Must-buy vs 2+ tanks or any armor stacker. The % armor pen shreds tanks. Build 3rd or 4th as ADC when enemy has tanky frontline.',
  },

  'Mortal Reminder': {
    id: 3033,
    name: 'Mortal Reminder',
    price: 2600,
    category: 'legendary',
    stats: ['ad', 'crit', 'armor_pen'],
    tags: ['crit', 'anti_heal'],
    goodAgainst: 'vs heavy healing (Soraka, Yuumi, Aatrox, Vladimir)',
    description: 'The ADC anti-heal option. Buy when enemy has significant healing. Applies 40% Grievous Wounds on physical damage.',
  },

  'Blade of the Ruined King': {
    id: 3153,
    name: 'Blade of the Ruined King',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'lifesteal'],
    tags: ['on_hit', 'tank_shred', 'sustain'],
    goodAgainst: 'vs high-HP tanks and bruisers',
    description: 'Rush on fighters and some ADCs vs tanky comps. Deals %HP on-hit damage. The slow helps kiting. Great on Vayne, Kog\'Maw, Irelia.',
  },

  'Kraken Slayer': {
    id: 6672,
    name: 'Kraken Slayer',
    price: 3100,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'crit'],
    tags: ['crit', 'tank_shred', 'on_hit'],
    goodAgainst: 'vs tanky frontlines when you need DPS',
    description: 'High DPS crit item. Every 3rd attack deals bonus true damage. Great for ADCs who auto-attack frequently like Jinx, Kog\'Maw, Vayne.',
  },

  'Phantom Dancer': {
    id: 3046,
    name: 'Phantom Dancer',
    price: 2600,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit'],
    goodAgainst: 'When you need attack speed and kiting potential',
    description: 'Great attack speed + crit item with ghosting passive. Buy for kiting-heavy ADCs like Ashe, Jinx. The move speed helps reposition in fights.',
  },

  'Rapid Firecannon': {
    id: 3094,
    name: 'Rapid Firecannon',
    price: 2700,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit', 'poke'],
    goodAgainst: 'When you need extra range for safe poke or sieging',
    description: 'Extends your auto-attack range when energized. Great for siege comps and poking. Buy on Caitlyn, Jinx, or when you need to stay safe.',
  },

  'Statikk Shiv': {
    id: 3095,
    name: 'Statikk Shiv',
    price: 2700,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit', 'burst'],
    goodAgainst: 'When you need waveclear and AoE magic damage',
    description: 'Best waveclear crit item. Chain lightning passive clears waves fast. Good rush for ADCs who need waveclear early.',
  },

  'Navori Flickerblade': {
    id: 6675,
    name: 'Navori Flickerblade',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'crit', 'ability_haste'],
    tags: ['crit'],
    goodAgainst: 'Ability-reliant ADCs who want CDR with crits',
    description: 'Crits reduce your basic ability cooldowns. Core on ability-reliant ADCs like Xayah, Sivir, Lucian. Synergizes with high crit chance.',
  },

  'Essence Reaver': {
    id: 3508,
    name: 'Essence Reaver',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'crit', 'ability_haste', 'mana'],
    tags: ['crit'],
    goodAgainst: 'Mana-hungry AD casters who also build crit',
    description: 'Sheen proc + crit + mana sustain. Great on Ezreal, Gangplank, Lucian. The Spellblade proc adds burst to your combos.',
  },

  'Stormrazor': {
    id: 3095,
    name: 'Stormrazor',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'crit'],
    tags: ['crit', 'burst'],
    goodAgainst: 'When you need energized burst and movement speed',
    description: 'Returned in Season 2026. Moving charges up your next auto for bonus damage and a slow. Great on ADCs who weave in and out of fights.',
  },

  'Fiendhunter Bolts': {
    id: 2512,
    name: 'Fiendhunter Bolts',
    price: 2650,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit', 'burst'],
    goodAgainst: 'ADCs with strong ultimates who want crit synergy',
    description: 'New S2026 item. 30 Ultimate Haste plus bonus AS and auto-crit after ulting. Great on Jinx, Twitch, Miss Fortune, Zeri. Buy to empower your ult windows.',
  },

  'Hexoptics C44': {
    id: 2513,
    name: 'Hexoptics C44',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'crit'],
    tags: ['crit', 'poke'],
    goodAgainst: 'Long-range ADCs who want damage from safe distance',
    description: 'New S2026 item. Gain bonus AD based on distance from target + extra range on takedowns. Perfect for Caitlyn, Jinx, Senna.',
  },

  'Night Vigil': {
    id: 2514,
    name: 'Night Vigil',
    price: 2650,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit', 'burst'],
    goodAgainst: 'ADCs with impactful ults (Jinx, MF, Twitch)',
    description: 'Grants 30 Ultimate Haste. After casting ult, next 3 attacks gain 50% AS and auto-crit. Massive in teamfight ult windows.',
  },

  'The Collector': {
    id: 6676,
    name: 'The Collector',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'crit', 'lethality'],
    tags: ['crit', 'lethality', 'burst'],
    goodAgainst: 'vs squishy comps where you want execute burst',
    description: 'Hybrid crit + lethality with an execute under 5% HP. Good early in snowball games. Falls off vs tanks late game.',
  },

  'Yun Tal Wildarrows': {
    id: 6677,
    name: 'Yun Tal Wildarrows',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'crit'],
    tags: ['crit', 'burst'],
    goodAgainst: 'When you want extra crit damage on ability-empowered autos',
    description: 'Empowered attacks deal bonus damage based on crit chance. Good on champions who weave abilities and autos like Lucian, Draven.',
  },

  'Runaan\'s Hurricane': {
    id: 3085,
    name: 'Runaan\'s Hurricane',
    price: 2600,
    category: 'legendary',
    stats: ['attack_speed', 'crit', 'move_speed'],
    tags: ['crit', 'teamfight', 'on_hit'],
    goodAgainst: 'When you need AoE auto-attacks for teamfights',
    description: 'Bolts hit 2 extra targets. Core on Jinx, Aphelios, Kog\'Maw, Twitch for teamfight AoE. Also great for waveclear.',
  },

  'Immortal Shieldbow': {
    id: 6673,
    name: 'Immortal Shieldbow',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'crit', 'lifesteal'],
    tags: ['crit', 'sustain', 'defensive'],
    goodAgainst: 'vs assassins or dive-heavy comps as an ADC',
    description: 'Lifeline shield pops when you drop low. Buy when you need to survive burst. Good on Samira, Yasuo, and ADCs vs assassins.',
  },

  'Guinsoo\'s Rageblade': {
    id: 3124,
    name: 'Guinsoo\'s Rageblade',
    price: 2800,
    category: 'legendary',
    stats: ['attack_speed', 'crit'],
    tags: ['on_hit'],
    goodAgainst: 'On-hit builds that want to convert crit to on-hit damage',
    description: 'Converts crit into on-hit damage. Core for on-hit builds (Kog\'Maw, Varus, Vayne). Do NOT pair with Infinity Edge.',
  },

  // ==========================================================================
  // AD / BRUISER / FIGHTER LEGENDARY ITEMS
  // ==========================================================================

  'Trinity Force': {
    id: 3078,
    name: 'Trinity Force',
    price: 3333,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'health', 'ability_haste'],
    tags: ['split_push', 'burst'],
    goodAgainst: 'Bruisers who auto-attack weave between abilities',
    description: 'Sheen proc + attack speed + health. Core on Jax, Camille, Irelia. Great for split-pushing with the Threefold Strike stacking AD.',
  },

  'Black Cleaver': {
    id: 3071,
    name: 'Black Cleaver',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'health', 'ability_haste'],
    tags: ['tank_shred', 'teamfight'],
    goodAgainst: 'vs armor stackers, especially with your AD teammates',
    description: 'Shreds armor for your entire team. Buy on AD casters (Riven, Pantheon) vs tanky comps. The armor shred stacks help your ADC too.',
  },

  'Spear of Shojin': {
    id: 6609,
    name: 'Spear of Shojin',
    price: 3100,
    category: 'legendary',
    stats: ['ad', 'health', 'ability_haste'],
    tags: ['burst', 'split_push'],
    goodAgainst: 'Ability-reliant fighters who chain spells in combos',
    description: 'Abilities deal bonus damage after hitting with 2 other abilities. Core on Riven, Renekton, Jax. Makes your combo rotations hit much harder.',
  },

  'Sterak\'s Gage': {
    id: 3053,
    name: 'Sterak\'s Gage',
    price: 3100,
    category: 'legendary',
    stats: ['ad', 'health'],
    tags: ['defensive', 'teamfight'],
    goodAgainst: 'When you need to survive burst as a bruiser',
    description: 'Lifeline shield based on bonus HP. Essential for bruisers diving into teamfights. Buy 2nd or 3rd on Darius, Garen, Sett.',
  },

  'Death\'s Dance': {
    id: 6333,
    name: 'Death\'s Dance',
    price: 3100,
    category: 'legendary',
    stats: ['ad', 'armor', 'ability_haste'],
    tags: ['sustain', 'defensive'],
    goodAgainst: 'vs AD threats; delays damage and heals on takedown',
    description: 'Stores damage as a bleed. On takedown, the bleed is cleansed and you heal. Insanely good when ahead. Core on Riven, Fiora, Aatrox.',
  },

  'Maw of Malmortius': {
    id: 3156,
    name: 'Maw of Malmortius',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'mr', 'ability_haste'],
    tags: ['defensive'],
    goodAgainst: 'vs AP burst (LeBlanc, Syndra, Akali)',
    description: 'Lifeline magic damage shield. Buy on AD champions vs heavy AP burst. Cannot stack with Sterak\'s or Shieldbow lifeline passives.',
  },

  'Guardian Angel': {
    id: 3026,
    name: 'Guardian Angel',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'armor'],
    tags: ['defensive'],
    goodAgainst: 'When you are the carry and cannot afford to die in fights',
    description: 'Revives you after death with 50% base HP. Buy when you are the win condition. 300s cooldown - play around it.',
  },

  'Mercurial Scimitar': {
    id: 3139,
    name: 'Mercurial Scimitar',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'mr', 'crit', 'lifesteal'],
    tags: ['defensive'],
    goodAgainst: 'vs hard CC that will kill you (Malzahar ult, Skarner ult, Mordekaiser ult)',
    description: 'Active: Cleanse all CC. Mandatory vs Malzahar, Skarner, Mordekaiser. Do not waste it on minor slows.',
  },

  'Ravenous Hydra': {
    id: 3074,
    name: 'Ravenous Hydra',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'ability_haste', 'lifesteal'],
    tags: ['sustain', 'split_push'],
    goodAgainst: 'Melee champions who need waveclear and sustain',
    description: 'AoE cleave on autos + omnivamp. Great on Fiora, Riven, Talon for waveclear and sustain. Helps with split-pushing.',
  },

  'Titanic Hydra': {
    id: 3748,
    name: 'Titanic Hydra',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'health'],
    tags: ['tank', 'split_push'],
    goodAgainst: 'When you build HP and want damage to scale with it',
    description: 'Auto-attack cleave that scales with max HP. Core on HP-stacking bruisers like Sion, Cho\'Gath, Tahm Kench. Pairs with Heartsteel.',
  },

  'Profane Hydra': {
    id: 6698,
    name: 'Profane Hydra',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'lethality', 'ability_haste'],
    tags: ['lethality', 'split_push'],
    goodAgainst: 'AD assassins who need waveclear for split-pushing',
    description: 'Lethality Hydra with active AoE burst. Buy on Talon, Qiyana, Kha\'Zix when split-pushing. The active adds burst to your combo.',
  },

  'Stridebreaker': {
    id: 6631,
    name: 'Stridebreaker',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'health', 'ability_haste'],
    tags: ['teamfight'],
    goodAgainst: 'Juggernauts who need a slow to reach targets',
    description: 'Active AoE slow helps immobile fighters stick to targets. Good on Darius, Garen, Sett. Helps you run down enemies.',
  },

  'Sundered Sky': {
    id: 6694,
    name: 'Sundered Sky',
    price: 3100,
    category: 'legendary',
    stats: ['ad', 'health', 'ability_haste'],
    tags: ['sustain', 'split_push'],
    goodAgainst: 'Bruisers who want burst healing on their first hit',
    description: 'First hit on a champion heals you and deals bonus damage. Great sustain in extended trades. Core on many bruisers and divers.',
  },

  'Hullbreaker': {
    id: 3181,
    name: 'Hullbreaker',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'health'],
    tags: ['split_push'],
    goodAgainst: 'When you plan to split-push and 1v1',
    description: 'Massively buffs split-pushing. Empowers nearby siege minions and grants bonus resists when alone. Core for dedicated split-pushers.',
  },

  'Experimental Hexplate': {
    id: 6697,
    name: 'Experimental Hexplate',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'health', 'attack_speed', 'ability_haste'],
    tags: ['burst'],
    goodAgainst: 'Ult-reliant fighters and divers',
    description: 'After ulting, gain attack speed and move speed. Great on ult-reliant champs like Nocturne, Vi, Hecarim. Empowers your engage.',
  },

  'Wit\'s End': {
    id: 3091,
    name: 'Wit\'s End',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'attack_speed', 'mr'],
    tags: ['on_hit', 'defensive'],
    goodAgainst: 'vs AP threats when you want damage + MR',
    description: 'On-hit magic damage + MR. Hybrid offensive/defensive vs AP. Great on Irelia, Kog\'Maw, Varus. The move speed on-hit helps kiting.',
  },

  'Endless Hunger': {
    id: 2515,
    name: 'Endless Hunger',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'omnivamp'],
    tags: ['sustain'],
    goodAgainst: 'When you need omnivamp and tenacity as a fighter',
    description: 'New S2026 item. 60 AD, 5% omnivamp, 20% tenacity. Great on fighters like Aatrox, Riven, Olaf who want sustain and CC reduction.',
  },

  'Hextech Gunblade': {
    id: 3146,
    name: 'Hextech Gunblade',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'ap', 'lifesteal'],
    tags: ['burst', 'sustain'],
    goodAgainst: 'Hybrid champions who deal both AD and AP damage',
    description: 'Returned in S2026. 80 AP, 40 AD, 10% lifesteal. Active deals damage and slows. Core on Katarina, Akali, Kayle - any hybrid champ.',
  },

  // ==========================================================================
  // LETHALITY / ASSASSIN ITEMS
  // ==========================================================================

  'Youmuu\'s Ghostblade': {
    id: 3142,
    name: 'Youmuu\'s Ghostblade',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality', 'move_speed'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'vs squishies; great for roaming assassins',
    description: 'Out-of-combat move speed + active burst of speed. Rush on roaming assassins (Zed, Talon). The mobility helps you roam and pick targets.',
  },

  'Edge of Night': {
    id: 3814,
    name: 'Edge of Night',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality', 'health'],
    tags: ['lethality', 'defensive'],
    goodAgainst: 'vs single key CC ability that stops your engage',
    description: 'Spell shield blocks one ability. Buy when one enemy ability stops your combo (Morgana Q, Lux Q). The health also makes you less squishy.',
  },

  'Serpent\'s Fang': {
    id: 6696,
    name: 'Serpent\'s Fang',
    price: 2500,
    category: 'legendary',
    stats: ['ad', 'lethality'],
    tags: ['lethality', 'anti_shield'],
    goodAgainst: 'vs heavy shielding (Lulu, Janna, Karma, Sett)',
    description: 'Your damage reduces enemy shields by 50%. Mandatory vs shield-heavy comps. Very cost-efficient lethality item.',
  },

  'Eclipse': {
    id: 6692,
    name: 'Eclipse',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality'],
    tags: ['lethality', 'sustain'],
    goodAgainst: 'When you need lethality with omnivamp sustain',
    description: 'Hitting 2 attacks/abilities on a champ deals bonus damage, gives a shield, and grants move speed. Good on bruiser-assassins.',
  },

  'Opportunity': {
    id: 6701,
    name: 'Opportunity',
    price: 2700,
    category: 'legendary',
    stats: ['ad', 'lethality', 'move_speed'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'When you want to one-shot from out of vision',
    description: 'Gain a damage amp when unseen by enemies. Great for assassins flanking or coming from fog of war. Pairs with Duskblade.',
  },

  'Voltaic Cyclosword': {
    id: 6699,
    name: 'Voltaic Cyclosword',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality', 'move_speed'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'Assassins who want energized burst for picks',
    description: 'Energized attack slows and deals bonus damage. Great for pick-oriented assassins. Charges while moving for a guaranteed slow.',
  },

  'Hubris': {
    id: 6697,
    name: 'Hubris',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality', 'ability_haste'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'When you expect to get kills and snowball with bonus AD',
    description: 'Gain bonus AD on champion takedowns. Snowball lethality item. Buy when you are already ahead and want to press your lead.',
  },

  'Axiom Arc': {
    id: 6693,
    name: 'Axiom Arc',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'lethality', 'ability_haste'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'Ult-reliant assassins who want ult CDR on kills',
    description: 'Takedowns refund a portion of your ultimate cooldown. Core on Pyke, Kha\'Zix, Nocturne. Makes reset assassins terrifying in teamfights.',
  },

  'Umbral Glaive': {
    id: 6695,
    name: 'Umbral Glaive',
    price: 2300,
    category: 'legendary',
    stats: ['ad', 'lethality', 'ability_haste'],
    tags: ['lethality', 'support'],
    goodAgainst: 'Clearing enemy vision cheaply (support assassins, junglers)',
    description: 'Reveals and one-shots wards. Core on Pyke support. Great on any lethality champion who wants to deny enemy vision cheaply.',
  },

  'Spectral Cutlass': {
    id: 3152,
    name: 'Spectral Cutlass',
    price: 2800,
    category: 'legendary',
    stats: ['ad', 'lethality', 'move_speed'],
    tags: ['lethality', 'burst'],
    goodAgainst: 'Assassins who need a safe escape after going in',
    description: 'Active marks your position, then you can reactivate to return. Go in, burst someone, and escape. Great on melee assassins.',
  },

  'Bastionbreaker': {
    id: 3185,
    name: 'Bastionbreaker',
    price: 3200,
    category: 'legendary',
    stats: ['ad', 'lethality', 'ability_haste'],
    tags: ['lethality', 'anti_shield'],
    goodAgainst: 'vs shielding and when you want lethality burst',
    description: 'New S2026 item. 55 AD, 22 lethality, 15 AH. Deals bonus damage to shielded targets. Great vs shield-heavy comps alongside Serpent\'s Fang.',
  },

  // ==========================================================================
  // AP / MAGE LEGENDARY ITEMS
  // ==========================================================================

  'Rabadon\'s Deathcap': {
    id: 3089,
    name: 'Rabadon\'s Deathcap',
    price: 3600,
    category: 'legendary',
    stats: ['ap'],
    tags: ['ap_burst'],
    goodAgainst: 'When you want maximum AP for late-game scaling',
    description: 'Increases total AP by 35%. Buy as 3rd or 4th item after you have a solid AP base. THE AP scaling multiplier. Mandatory on most mages late.',
  },

  'Void Staff': {
    id: 3135,
    name: 'Void Staff',
    price: 2800,
    category: 'legendary',
    stats: ['ap', 'magic_pen'],
    tags: ['ap_burst', 'tank_shred'],
    goodAgainst: 'vs MR stackers and tanks (2+ enemies with MR items)',
    description: '40% magic pen. Must-buy when enemies build MR. If 2+ enemies have Mercs or MR items, this is your best damage increase.',
  },

  'Zhonya\'s Hourglass': {
    id: 3157,
    name: 'Zhonya\'s Hourglass',
    price: 3000,
    category: 'legendary',
    stats: ['ap', 'armor', 'ability_haste'],
    tags: ['ap_burst', 'defensive'],
    goodAgainst: 'vs AD assassins (Zed, Talon) or when you need stasis',
    description: 'Rush vs Zed or any AD assassin mid. The 2.5s stasis active saves your life. Also dodge key abilities like Karthus ult.',
  },

  'Banshee\'s Veil': {
    id: 3102,
    name: 'Banshee\'s Veil',
    price: 2500,
    category: 'legendary',
    stats: ['ap', 'mr', 'ability_haste'],
    tags: ['ap_burst', 'defensive'],
    goodAgainst: 'vs AP burst or one key engage spell (Blitz hook, Ashe arrow)',
    description: 'Spell shield blocks the first enemy ability. Buy vs pick comps or when one enemy spell means death. Refreshes out of combat.',
  },

  'Lich Bane': {
    id: 3100,
    name: 'Lich Bane',
    price: 2700,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'move_speed'],
    tags: ['ap_burst', 'split_push'],
    goodAgainst: 'AP champions who weave autos between spells',
    description: 'Spellblade proc on auto after using ability. Core on Fizz, Ekko, Twisted Fate, Akali. Also helps AP champs take towers.',
  },

  'Nashor\'s Tooth': {
    id: 3115,
    name: 'Nashor\'s Tooth',
    price: 3000,
    category: 'legendary',
    stats: ['ap', 'attack_speed'],
    tags: ['on_hit', 'split_push'],
    goodAgainst: 'AP auto-attackers and on-hit AP champs',
    description: 'AP on-hit damage + attack speed. Core on Kayle, Teemo, Diana, Gwen. Makes your autos deal magic damage. Great for split-pushing.',
  },

  'Cosmic Drive': {
    id: 4629,
    name: 'Cosmic Drive',
    price: 2900,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'move_speed'],
    tags: ['ap_burst', 'teamfight'],
    goodAgainst: 'When you need AP + movespeed + CDR for kiting',
    description: 'Move speed on ability hits. Great for kite mages like Cassiopeia, Ryze, Ahri. The AH + MS combo helps you stay safe while dealing damage.',
  },

  'Horizon Focus': {
    id: 4628,
    name: 'Horizon Focus',
    price: 2700,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'health'],
    tags: ['ap_burst', 'poke'],
    goodAgainst: 'Long-range mages who can proc Hypershot consistently',
    description: 'Bonus damage on long-range abilities or CC. Core on Xerath, Lux, Vel\'Koz. If you land your CC or hit from long range, damage is amplified.',
  },

  'Shadowflame': {
    id: 4645,
    name: 'Shadowflame',
    price: 3000,
    category: 'legendary',
    stats: ['ap', 'magic_pen'],
    tags: ['ap_burst'],
    goodAgainst: 'vs squishy targets with low MR',
    description: 'Flat magic pen item. Best vs squishy targets who have no MR. Buy for burst combos on assassin mages. Stacks with Sorc Shoes.',
  },

  'Stormsurge': {
    id: 4646,
    name: 'Stormsurge',
    price: 2900,
    category: 'legendary',
    stats: ['ap', 'magic_pen', 'move_speed'],
    tags: ['ap_burst', 'burst'],
    goodAgainst: 'When you want to burst squishy targets and roam',
    description: 'If you deal 35% of a champ\'s HP in 2.5s, they are struck by lightning after a delay. Great on roaming AP assassins like Fizz, Ekko, Katarina.',
  },

  'Luden\'s Tempest': {
    id: 6655,
    name: 'Luden\'s Tempest',
    price: 2850,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste', 'magic_pen'],
    tags: ['ap_burst', 'poke'],
    goodAgainst: 'Burst mages who want poke damage and flat pen',
    description: 'Echo passive deals bonus AoE magic damage. Core on burst mages (Syndra, Viktor, Ahri). The flat pen + echo passive chunks squishies.',
  },

  'Malignance': {
    id: 4636,
    name: 'Malignance',
    price: 2700,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste'],
    tags: ['ap_burst'],
    goodAgainst: 'Ult-reliant mages who want Ultimate Haste',
    description: 'Grants Ultimate Haste and creates a damage zone on ult cast. Core on Neeko, Morgana, Zyra, Fiddlesticks. Makes your ult come up faster.',
  },

  'Rod of Ages': {
    id: 3027,
    name: 'Rod of Ages',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'health', 'mana'],
    tags: ['ap_sustain'],
    goodAgainst: 'Scaling mages who want to survive and scale',
    description: 'Stacks over 10 minutes, gaining AP, health, and mana. Buy EARLY or not at all. Core on Kassadin, Ryze, Anivia. Rewards patient scaling.',
  },

  'Archangel\'s Staff': {
    id: 3003,
    name: 'Archangel\'s Staff',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste'],
    tags: ['ap_sustain'],
    goodAgainst: 'Mana-hungry mages who spam abilities (Cassiopeia, Ryze, Anivia)',
    description: 'Upgrades from Tear. Transforms into Seraph\'s Embrace at max stacks, granting AP based on bonus mana + a heal active. Stack early.',
  },

  'Seraph\'s Embrace': {
    id: 3040,
    name: 'Seraph\'s Embrace',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste', 'health'],
    tags: ['ap_sustain', 'defensive'],
    goodAgainst: 'Upgraded Archangel\'s for mana-scaling mages',
    description: 'Fully stacked Archangel\'s. Grants AP scaling with mana and a heal. Pairs with other mana items for maximum AP.',
  },

  'Riftmaker': {
    id: 4633,
    name: 'Riftmaker',
    price: 3000,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'omnivamp'],
    tags: ['ap_sustain'],
    goodAgainst: 'AP bruisers who want sustained damage and healing',
    description: 'Ramp up damage in combat + omnivamp. Core on Mordekaiser, Gwen, Akali. The longer the fight goes, the more damage you deal.',
  },

  'Hextech Rocketbelt': {
    id: 3152,
    name: 'Hextech Rocketbelt',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste'],
    tags: ['ap_burst'],
    goodAgainst: 'AP assassins who need a gap closer',
    description: 'Active: dash forward firing rockets. Closes the gap on targets. Core on Diana, Annie, Galio. The dash enables engages on squishy backlines.',
  },

  'Cryptbloom': {
    id: 4644,
    name: 'Cryptbloom',
    price: 2850,
    category: 'legendary',
    stats: ['ap', 'magic_pen'],
    tags: ['ap_burst', 'support', 'teamfight'],
    goodAgainst: 'AP mages who want to support their team with heals on kills',
    description: 'Takedowns create healing zones for allies. Buy on AP mages in teamfight-oriented comps. Provides %magic pen and team utility.',
  },

  'Blackfire Torch': {
    id: 4637,
    name: 'Blackfire Torch',
    price: 2800,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste'],
    tags: ['ap_burst', 'poke'],
    goodAgainst: 'DoT mages and mages fighting multiple enemies',
    description: 'Deals bonus burn damage. Gains AP for each enemy champion affected. Great on AoE/DoT mages like Brand, Malzahar, Zyra.',
  },

  'Liandry\'s Torment': {
    id: 3068,
    name: 'Liandry\'s Torment',
    price: 3000,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste'],
    tags: ['ap_burst', 'tank_shred'],
    goodAgainst: 'vs high-HP tanks and frontlines',
    description: 'Burns enemies for %max HP over time. Buy vs tanky comps. Core on Brand, Malzahar, Zyra. The burn shreds tanks your burst can\'t kill.',
  },

  'Morellonomicon': {
    id: 3165,
    name: 'Morellonomicon',
    price: 2500,
    category: 'legendary',
    stats: ['ap', 'health'],
    tags: ['ap_burst', 'anti_heal'],
    goodAgainst: 'vs heavy healing as an AP champion',
    description: 'AP anti-heal item. Applies Grievous Wounds on magic damage. Buy vs Soraka, Yuumi, Vladimir, Aatrox, or any heavy healing.',
  },

  'Rylai\'s Crystal Scepter': {
    id: 3116,
    name: 'Rylai\'s Crystal Scepter',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'health'],
    tags: ['ap_burst', 'teamfight'],
    goodAgainst: 'When you need to slow enemies with your abilities',
    description: 'Abilities slow enemies. Great for kiting and chasing. Core on Brand, Mordekaiser, Singed. Makes landing follow-up abilities easier.',
  },

  'Zaz\'Zak\'s Realmspike': {
    id: 4647,
    name: 'Zaz\'Zak\'s Realmspike',
    price: 2600,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste'],
    tags: ['ap_burst', 'poke'],
    goodAgainst: 'AP supports and mages who want poke damage',
    description: 'Abilities create void explosions on the ground. Extra poke damage for mage supports. Good on Zyra, Brand, Vel\'Koz support.',
  },

  'Mejai\'s Soulstealer': {
    id: 3041,
    name: 'Mejai\'s Soulstealer',
    price: 1600,
    category: 'legendary',
    stats: ['ap', 'move_speed'],
    tags: ['ap_burst'],
    goodAgainst: 'When you are snowballing and can avoid dying',
    description: 'Stacks AP on kills/assists, loses stacks on death. Buy when ahead and you rarely die. At max stacks gives 145 AP. Very high risk/reward.',
  },

  'Dusk and Dawn': {
    id: 2516,
    name: 'Dusk and Dawn',
    price: 3100,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'attack_speed'],
    tags: ['ap_sustain', 'on_hit', 'split_push'],
    goodAgainst: 'AP fighters who auto-attack between abilities',
    description: 'New S2026 AP Sheen item. Doubles on-hits after abilities. Core on Gwen, Kayle, and AP auto-attackers. Great for split-pushing with on-hit.',
  },

  'Actualizer': {
    id: 2517,
    name: 'Actualizer',
    price: 2800,
    category: 'legendary',
    stats: ['ap', 'mana', 'ability_haste'],
    tags: ['ap_burst'],
    goodAgainst: 'Mana-rich mages who want to empower their burst window',
    description: 'New S2026 item. Active: double mana costs but increased ability damage, healing/shielding, and 30% CDR for 8s. Big burst windows on Ryze, Kassadin.',
  },

  'Bloodletter\'s Curse': {
    id: 2518,
    name: 'Bloodletter\'s Curse',
    price: 2800,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste'],
    tags: ['ap_sustain', 'anti_heal'],
    goodAgainst: 'AP bruisers vs healing enemies',
    description: 'AP item with health. Provides anti-heal utility for AP bruisers. Good on Mordekaiser, Swain, and other AP fighters who stay in extended fights.',
  },

  // ==========================================================================
  // TANK LEGENDARY ITEMS
  // ==========================================================================

  'Sunfire Aegis': {
    id: 3068,
    name: 'Sunfire Aegis',
    price: 2700,
    category: 'legendary',
    stats: ['health', 'armor', 'mr'],
    tags: ['tank', 'teamfight'],
    goodAgainst: 'General-purpose tank damage aura',
    description: 'Immolate passive deals AoE burn damage. Buy for mixed-damage tankiness. Good first item for engage tanks like Leona, Amumu, Zac.',
  },

  'Hollow Radiance': {
    id: 3069,
    name: 'Hollow Radiance',
    price: 2800,
    category: 'legendary',
    stats: ['health', 'mr', 'ability_haste'],
    tags: ['tank', 'teamfight'],
    goodAgainst: 'Tanks who want waveclear with an MR-focused Immolate',
    description: 'MR + Immolate burn. Buy vs AP-heavy comps when you still want the burn aura. Pairs waveclear with magic resistance.',
  },

  'Heartsteel': {
    id: 6664,
    name: 'Heartsteel',
    price: 3000,
    category: 'legendary',
    stats: ['health', 'ability_haste'],
    tags: ['tank'],
    goodAgainst: 'When you want to infinitely stack HP as a tank',
    description: 'Charged attacks deal bonus damage and grant permanent HP. Core on HP-stackers: Sion, Cho\'Gath, Dr. Mundo. Pairs with Titanic Hydra.',
  },

  'Iceborn Gauntlet': {
    id: 6662,
    name: 'Iceborn Gauntlet',
    price: 2600,
    category: 'legendary',
    stats: ['health', 'armor', 'ability_haste', 'mana'],
    tags: ['tank'],
    goodAgainst: 'Tanks who use Sheen proc and need armor + slowing zone',
    description: 'Spellblade creates a slow zone on auto. Great for peeling and sticking. Good on Nasus, Poppy, tank Ezreal.',
  },

  'Jak\'Sho, The Protean': {
    id: 6665,
    name: 'Jak\'Sho, The Protean',
    price: 3000,
    category: 'legendary',
    stats: ['health', 'armor', 'mr'],
    tags: ['tank', 'teamfight'],
    goodAgainst: 'vs mixed damage comps; ramps resistances in combat',
    description: 'Gain stacking armor and MR in combat, then deal AoE damage and heal. Best tank item vs mixed damage. Buy when both AD and AP threaten you.',
  },

  'Randuin\'s Omen': {
    id: 3143,
    name: 'Randuin\'s Omen',
    price: 2700,
    category: 'legendary',
    stats: ['health', 'armor'],
    tags: ['tank', 'defensive', 'teamfight'],
    goodAgainst: 'vs crit ADCs (Jinx, Caitlyn, Yasuo)',
    description: 'Reduces incoming crit damage. Active slows nearby enemies. Buy vs crit-heavy comps. The active disrupts teamfights.',
  },

  'Frozen Heart': {
    id: 3110,
    name: 'Frozen Heart',
    price: 2500,
    category: 'legendary',
    stats: ['armor', 'ability_haste', 'mana'],
    tags: ['tank', 'defensive'],
    goodAgainst: 'vs auto-attackers; reduces enemy attack speed',
    description: 'Rock Solid passive + AS slow aura. Counters ADCs and auto-attackers. The mana is useful on tanks like Malphite, Nasus. Very gold efficient.',
  },

  'Thornmail': {
    id: 3075,
    name: 'Thornmail',
    price: 2450,
    category: 'legendary',
    stats: ['health', 'armor'],
    tags: ['tank', 'anti_heal'],
    goodAgainst: 'vs auto-attackers with healing (Yone, Yasuo, Aatrox, ADCs with lifesteal)',
    description: 'Reflects damage to auto-attackers and applies Grievous Wounds when they hit you. Buy vs heavy AA teams with healing. You don\'t need to aim it.',
  },

  'Dead Man\'s Plate': {
    id: 3742,
    name: 'Dead Man\'s Plate',
    price: 2900,
    category: 'legendary',
    stats: ['health', 'armor', 'move_speed'],
    tags: ['tank'],
    goodAgainst: 'Tanks and bruisers who need to close gaps and roam',
    description: 'Build momentum while moving. First auto slows. Great for roaming tanks and engage. Buy on Sion, Garen, Darius for gap-closing.',
  },

  'Force of Nature': {
    id: 4401,
    name: 'Force of Nature',
    price: 2800,
    category: 'legendary',
    stats: ['health', 'mr', 'move_speed'],
    tags: ['tank', 'defensive'],
    goodAgainst: 'vs sustained AP damage (Cassiopeia, Ryze, Brand)',
    description: 'Stack MR when taking magic damage, up to 25% magic damage reduction. Best MR tank item vs sustained AP. Also grants move speed.',
  },

  'Spirit Visage': {
    id: 3065,
    name: 'Spirit Visage',
    price: 2700,
    category: 'legendary',
    stats: ['health', 'mr', 'ability_haste'],
    tags: ['tank', 'sustain'],
    goodAgainst: 'When you have self-healing or a healer on your team',
    description: 'Increases all healing and shielding received by 25%. Buy on self-healers (Mundo, Aatrox, Warwick) or when you have Soraka/Yuumi.',
  },

  'Abyssal Mask': {
    id: 3001,
    name: 'Abyssal Mask',
    price: 2500,
    category: 'legendary',
    stats: ['health', 'mr'],
    tags: ['tank', 'teamfight'],
    goodAgainst: 'When your team has AP threats and you want to amplify their damage',
    description: 'Nearby enemies take 12% increased magic damage. Buy on engage tanks (Leona, Amumu) when your mid/bot deals AP. Force multiplier for your mages.',
  },

  'Gargoyle Stoneplate': {
    id: 3193,
    name: 'Gargoyle Stoneplate',
    price: 3200,
    category: 'legendary',
    stats: ['armor', 'mr', 'ability_haste'],
    tags: ['tank', 'teamfight', 'defensive'],
    goodAgainst: 'When you need a massive shield in the middle of teamfights',
    description: 'Active: gain a massive shield based on bonus HP. Buy on frontline tanks who dive in. The shield lets you survive the initial burst when engaging.',
  },

  'Warmog\'s Armor': {
    id: 3083,
    name: 'Warmog\'s Armor',
    price: 3000,
    category: 'legendary',
    stats: ['health', 'ability_haste'],
    tags: ['tank', 'sustain'],
    goodAgainst: 'Poke comps where you need to regen between fights',
    description: 'Rapidly regenerate HP out of combat. Counters poke comps. You can tank poke, walk back, heal to full, and re-engage.',
  },

  'Kaenic Rookern': {
    id: 4403,
    name: 'Kaenic Rookern',
    price: 2900,
    category: 'legendary',
    stats: ['health', 'mr'],
    tags: ['tank', 'defensive'],
    goodAgainst: 'vs AP burst (protects against initial magic damage combo)',
    description: 'Grants a magic damage shield that regenerates out of combat. Best vs AP burst mages. The shield absorbs their initial combo.',
  },

  'Unending Despair': {
    id: 3084,
    name: 'Unending Despair',
    price: 2800,
    category: 'legendary',
    stats: ['health', 'armor', 'ability_haste'],
    tags: ['tank', 'sustain'],
    goodAgainst: 'Tanks who want sustained drain in teamfights',
    description: 'Periodically drains HP from nearby enemies and heals you. Best on tanks who stay in melee range in long teamfights.',
  },

  'Overlord\'s Bloodmail': {
    id: 3085,
    name: 'Overlord\'s Bloodmail',
    price: 2800,
    category: 'legendary',
    stats: ['health', 'ad'],
    tags: ['tank', 'sustain'],
    goodAgainst: 'HP-stacking bruisers who want damage scaling with HP',
    description: 'Gain bonus AD based on HP and heal for a portion of damage dealt when above a health threshold. Great on tanky fighters.',
  },

  'Protoplasm Harness': {
    id: 2519,
    name: 'Protoplasm Harness',
    price: 2500,
    category: 'legendary',
    stats: ['health', 'ability_haste'],
    tags: ['tank', 'defensive'],
    goodAgainst: 'Tanks who want a last-stand survival effect',
    description: 'New S2026 item. 600 HP, 15 AH. When you drop below 30% HP, gain bonus HP, healing, tenacity, and grow in size. Clutch survival for frontliners.',
  },

  'Bandlepipes': {
    id: 2520,
    name: 'Bandlepipes',
    price: 2300,
    category: 'legendary',
    stats: ['health', 'ability_haste', 'armor', 'mr'],
    tags: ['tank', 'support', 'teamfight'],
    goodAgainst: 'Tank supports who want to buff ally attack speed',
    description: 'New S2026 item. When you CC an enemy, nearby allies gain 30% AS (melee) or 20% AS (ranged) for 4 seconds. Great on engage supports.',
  },

  // ==========================================================================
  // SUPPORT LEGENDARY ITEMS
  // ==========================================================================

  'Redemption': {
    id: 3107,
    name: 'Redemption',
    price: 2300,
    category: 'legendary',
    stats: ['health', 'mana', 'ability_haste'],
    tags: ['support', 'teamfight'],
    goodAgainst: 'Teamfight-oriented supports who want AoE healing',
    description: 'Active: AoE heal zone after a delay. Use in teamfights to heal your team. Works even while dead. Good on all enchanters.',
  },

  'Mikael\'s Blessing': {
    id: 3222,
    name: 'Mikael\'s Blessing',
    price: 2300,
    category: 'legendary',
    stats: ['mr', 'ability_haste', 'mana'],
    tags: ['support', 'defensive'],
    goodAgainst: 'vs hard CC on your carry (Morgana Q, Ashe arrow, Varus ult)',
    description: 'Active: cleanse all CC on an ally and heal them. Mandatory vs teams that chain CC your carry. Learn to use it reactively.',
  },

  'Ardent Censer': {
    id: 3504,
    name: 'Ardent Censer',
    price: 2100,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'mana'],
    tags: ['support'],
    goodAgainst: 'When your ADC is the carry and benefits from attack speed',
    description: 'Your heals/shields give allies bonus attack speed and on-hit damage. Core on enchanter supports (Lulu, Janna) when your ADC is fed.',
  },

  'Staff of Flowing Water': {
    id: 6616,
    name: 'Staff of Flowing Water',
    price: 2100,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'mana'],
    tags: ['support'],
    goodAgainst: 'When your team has AP carries who want ability haste',
    description: 'Your heals/shields give you and allies AP and AH. Buy when your carries are AP-heavy. The AP buff helps mage carries more than Ardent.',
  },

  'Knight\'s Vow': {
    id: 3109,
    name: 'Knight\'s Vow',
    price: 2200,
    category: 'legendary',
    stats: ['health', 'ability_haste'],
    tags: ['support', 'tank', 'defensive'],
    goodAgainst: 'When your carry is the win condition and needs protection',
    description: 'Bond to an ally: redirect damage they take to you and heal when they deal damage. Best on tank supports protecting a fed carry.',
  },

  'Locket of the Iron Solari': {
    id: 3190,
    name: 'Locket of the Iron Solari',
    price: 2200,
    category: 'legendary',
    stats: ['armor', 'mr', 'ability_haste'],
    tags: ['support', 'tank', 'teamfight'],
    goodAgainst: 'vs AoE burst comps; protects your whole team',
    description: 'Active: shield all nearby allies. Buy on engage/tank supports vs burst-heavy comps. The AoE shield can turn teamfights.',
  },

  'Shurelya\'s Battlesong': {
    id: 2065,
    name: 'Shurelya\'s Battlesong',
    price: 2200,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'mana'],
    tags: ['support', 'teamfight'],
    goodAgainst: 'When your team needs engage speed or disengage',
    description: 'Active: burst of move speed for nearby allies. Helps your team engage or disengage. Good on Karma, Janna, Nami for pick-oriented comps.',
  },

  'Imperial Mandate': {
    id: 4005,
    name: 'Imperial Mandate',
    price: 2200,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'mana'],
    tags: ['support', 'teamfight'],
    goodAgainst: 'Poke supports who can frequently apply CC or slows',
    description: 'Your CC marks enemies; allies consume marks for bonus damage. Great on Nami, Janna, Ashe support. Provides damage through your team.',
  },

  'Echoes of Helia': {
    id: 6617,
    name: 'Echoes of Helia',
    price: 2200,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'mana'],
    tags: ['support', 'sustain'],
    goodAgainst: 'Enchanter supports who poke and heal',
    description: 'Damaging enemies charges shards; healing allies releases them for bonus healing. Good on Sona, Nami, Soraka who poke and heal.',
  },

  'Moonstone Renewer': {
    id: 6632,
    name: 'Moonstone Renewer',
    price: 2200,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste', 'mana'],
    tags: ['support', 'sustain', 'teamfight'],
    goodAgainst: 'When your team needs sustained healing in long fights',
    description: 'Heals and shields are amplified on low-HP allies. Best in long teamfights with sustained healing. Core on Soraka, Sona, Lulu.',
  },

  'Dream Maker': {
    id: 6618,
    name: 'Dream Maker',
    price: 2100,
    category: 'legendary',
    stats: ['health', 'ability_haste', 'armor', 'mr'],
    tags: ['support', 'defensive'],
    goodAgainst: 'When your ADC needs bonus damage and a shield',
    description: 'Sleeping charges empower your next heal/shield on allies, adding bonus damage and a shield to their autos. Good on tank supports.',
  },

  'Trailblazer': {
    id: 6619,
    name: 'Trailblazer',
    price: 2200,
    category: 'legendary',
    stats: ['health', 'ability_haste', 'armor', 'mr'],
    tags: ['support', 'tank', 'teamfight'],
    goodAgainst: 'Engage supports who want to lead their team forward',
    description: 'Moving toward enemies builds momentum, granting a shield and empowering your next immobilizing ability. Great on Leona, Nautilus, Alistar.',
  },

  'Celestial Opposition': {
    id: 6620,
    name: 'Celestial Opposition',
    price: 2200,
    category: 'legendary',
    stats: ['armor', 'mr', 'ability_haste'],
    tags: ['support', 'tank', 'defensive'],
    goodAgainst: 'When you need to slow down enemy engage on your team',
    description: 'When hit in combat, create a zone that slows enemies. Helps peel for your carries against dive comps.',
  },

  'Zeke\'s Convergence': {
    id: 3050,
    name: 'Zeke\'s Convergence',
    price: 2200,
    category: 'legendary',
    stats: ['health', 'armor', 'ability_haste', 'mana'],
    tags: ['support', 'tank', 'teamfight'],
    goodAgainst: 'When you want to empower your ADC\'s damage output',
    description: 'Your immobilizing abilities empower your bonded ally\'s damage. Pair with a strong ADC. Good on Leona, Nautilus, Thresh.',
  },

  'Solstice Sleigh': {
    id: 6621,
    name: 'Solstice Sleigh',
    price: 2200,
    category: 'legendary',
    stats: ['health', 'ability_haste', 'mana'],
    tags: ['support', 'sustain'],
    goodAgainst: 'When you want to heal and speed up allies on CC',
    description: 'Immobilizing an enemy champion heals and speeds up nearby allies. Good on CC-heavy supports like Nautilus, Leona.',
  },

  'Dawncore': {
    id: 6622,
    name: 'Dawncore',
    price: 2400,
    category: 'legendary',
    stats: ['ap', 'ability_haste', 'mana'],
    tags: ['support'],
    goodAgainst: 'Enchanters who want to maximize heal/shield power',
    description: 'Increases heal and shield power. Stacks bonus heal/shield power when healing or shielding allies. Core for heal-bot enchanters.',
  },

  'Sword of Blossoming Dawn': {
    id: 4011,
    name: 'Sword of Blossoming Dawn',
    price: 2500,
    category: 'legendary',
    stats: ['ap', 'health', 'ability_haste'],
    tags: ['support', 'on_hit'],
    goodAgainst: 'Enchanter supports who also auto-attack',
    description: 'New S2026. 45 AP, 200 HP, 12% HSP, 15 AH. Autos heal your most wounded nearby ally. Great on Senna, Sona, Nami who weave autos.',
  },

  'Whispering Circlet': {
    id: 4012,
    name: 'Whispering Circlet',
    price: 2250,
    category: 'legendary',
    stats: ['health', 'mana'],
    tags: ['support', 'sustain'],
    goodAgainst: 'Mana-hungry enchanters who want Tear + enchanter stats',
    description: 'New S2026. Upgradeable Tear item for enchanters. 200 HP, 300 mana, 8% HSP. Transforms into Diadem of Songs at max mana stacks.',
  },

  'Diadem of Songs': {
    id: 4013,
    name: 'Diadem of Songs',
    price: 2250,
    category: 'legendary',
    stats: ['health', 'mana', 'ap'],
    tags: ['support', 'sustain'],
    goodAgainst: 'Upgraded Whispering Circlet for mana-scaling enchanters',
    description: 'Upgraded Whispering Circlet. Heals your lowest nearby ally every second in combat, scaling with mana. Core on Seraphine, Sona.',
  },

  // ==========================================================================
  // ANTI-HEAL ITEMS (consolidated references)
  // ==========================================================================

  'Chempunk Chainsword': {
    id: 6609,
    name: 'Chempunk Chainsword',
    price: 2600,
    category: 'legendary',
    stats: ['ad', 'health', 'ability_haste'],
    tags: ['anti_heal'],
    goodAgainst: 'vs heavy healing as an AD bruiser or fighter',
    description: 'AD anti-heal item with health. Applies Grievous Wounds on physical damage. Buy on bruisers vs Aatrox, Vladimir, Soraka.',
  },

  // ==========================================================================
  // OTHER LEGENDARY ITEMS
  // ==========================================================================

  'Manamune': {
    id: 3004,
    name: 'Manamune',
    price: 2600,
    category: 'legendary',
    stats: ['ad', 'mana', 'ability_haste'],
    tags: ['poke'],
    goodAgainst: 'AD casters who need mana and scale with it (Ezreal, Jayce)',
    description: 'Stacks mana from abilities and autos. Transforms into Muramana for bonus damage scaling with mana. Rush Tear early, complete later.',
  },

  'Muramana': {
    id: 3042,
    name: 'Muramana',
    price: 2600,
    category: 'legendary',
    stats: ['ad', 'mana', 'ability_haste'],
    tags: ['poke', 'burst'],
    goodAgainst: 'Fully stacked Manamune for maximum mana-scaling damage',
    description: 'Fully stacked Manamune. Abilities and autos deal bonus damage based on mana. Core on Ezreal, Jayce, Varus. Massive power spike on completion.',
  },

  'Fimbulwinter': {
    id: 3119,
    name: 'Fimbulwinter',
    price: 2600,
    category: 'legendary',
    stats: ['health', 'mana', 'ability_haste'],
    tags: ['tank', 'defensive'],
    goodAgainst: 'Tanks who use Tear and want a shield based on mana',
    description: 'Tank Tear upgrade. Immobilizing enemies grants a shield based on mana. Good on CC-heavy tanks like Nautilus, Malphite.',
  },

  'Terminus': {
    id: 6670,
    name: 'Terminus',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'attack_speed'],
    tags: ['on_hit', 'defensive'],
    goodAgainst: 'On-hit champs who want hybrid penetration and resists',
    description: 'Alternates between granting armor/MR pen and bonus defenses every 3 autos. Great on Kog\'Maw, Vayne, and on-hit builds.',
  },

  'Serylda\'s Grudge': {
    id: 6694,
    name: 'Serylda\'s Grudge',
    price: 3000,
    category: 'legendary',
    stats: ['ad', 'ability_haste', 'armor_pen'],
    tags: ['poke', 'tank_shred'],
    goodAgainst: 'AD casters vs tanks who need armor pen + slow',
    description: 'Abilities slow enemies. 30% armor pen for AD casters. Great on Jayce, Varus, Pantheon vs armored targets. The slow helps kiting.',
  },

  'Atma\'s Reckoning': {
    id: 3005,
    name: 'Atma\'s Reckoning',
    price: 2900,
    category: 'legendary',
    stats: ['health', 'armor', 'mr'],
    tags: ['tank', 'split_push'],
    goodAgainst: 'Tanks who want bonus damage scaling with resists',
    description: 'Deals bonus damage on autos based on your armor and MR. Buy on tanks who want extra damage without sacrificing tankiness.',
  },

  'Rite of Ruin': {
    id: 2521,
    name: 'Rite of Ruin',
    price: 2700,
    category: 'legendary',
    stats: ['health', 'ability_haste', 'armor'],
    tags: ['tank', 'teamfight'],
    goodAgainst: 'Tanks who want to disrupt enemies with CC',
    description: 'Empowers your immobilizing abilities with additional effects. Buy on CC-heavy tanks who want to maximize their disruption.',
  },

  'Bounty of Worlds': {
    id: 2522,
    name: 'Bounty of Worlds',
    price: 2400,
    category: 'legendary',
    stats: ['health', 'ability_haste'],
    tags: ['support', 'teamfight'],
    goodAgainst: 'Supports who want to generate team-wide value',
    description: 'Utility support item that provides value across your team through various team-oriented passives.',
  },

  'Bloodsong': {
    id: 3866,
    name: 'Bloodsong',
    price: 400,
    category: 'starter',
    stats: ['ad', 'ability_haste'],
    tags: ['support'],
    goodAgainst: 'AD-oriented support start for poke damage',
    description: 'Support starter item that upgrades from World Atlas. For damage-oriented supports like Pyke, Senna. Generates gold.',
  },

  // ==========================================================================
  // BASIC COMPONENTS (most commonly referenced)
  // ==========================================================================

  'Long Sword': {
    id: 1036,
    name: 'Long Sword',
    price: 350,
    category: 'component',
    stats: ['ad'],
    tags: [],
    goodAgainst: 'Flexible AD start that builds into many items',
    description: 'Start with Long Sword + 3 pots for aggressive early power. Builds into Serrated Dirk, Vampiric Scepter, and many AD items.',
  },

  'Amplifying Tome': {
    id: 1052,
    name: 'Amplifying Tome',
    price: 435,
    category: 'component',
    stats: ['ap'],
    tags: [],
    goodAgainst: 'Flexible AP component',
    description: 'Basic AP component. Builds into many AP items. Buy on early backs when you can\'t afford a larger component.',
  },

  'B.F. Sword': {
    id: 1038,
    name: 'B.F. Sword',
    price: 1300,
    category: 'component',
    stats: ['ad'],
    tags: ['crit'],
    goodAgainst: 'Large AD component for crit items',
    description: 'Big AD component. Buy on first back if you have 1300g as an ADC. Builds into Infinity Edge, Bloodthirster, and more.',
  },

  'Needlessly Large Rod': {
    id: 1058,
    name: 'Needlessly Large Rod',
    price: 1250,
    category: 'component',
    stats: ['ap'],
    tags: ['ap_burst'],
    goodAgainst: 'Large AP component for Rabadon\'s and other big AP items',
    description: 'Big AP component. If you back with 1250g as a mage, buy this. Builds into Rabadon\'s Deathcap and other major AP items.',
  },

  // ==========================================================================
  // TRINKETS
  // ==========================================================================

  'Stealth Ward': {
    id: 3340,
    name: 'Stealth Ward',
    price: 0,
    category: 'trinket',
    stats: [],
    tags: ['support'],
    goodAgainst: 'Default trinket for vision',
    description: 'Free ward trinket. Place in river, jungle entrances, and around objectives. Swap to Oracle Lens at level 9 as support.',
  },

  'Oracle Lens': {
    id: 3364,
    name: 'Oracle Lens',
    price: 0,
    category: 'trinket',
    stats: [],
    tags: ['support'],
    goodAgainst: 'Clearing enemy vision',
    description: 'Reveals and disables nearby wards. Supports should swap to this after getting their support item wards. Use before ganks and objectives.',
  },

  'Farsight Alteration': {
    id: 3363,
    name: 'Farsight Alteration',
    price: 0,
    category: 'trinket',
    stats: [],
    tags: ['support'],
    goodAgainst: 'Long-range vision scouting for ADCs and mages',
    description: 'Long-range ward. ADCs should swap to this at level 9. Safely scout bushes and objectives without face-checking.',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getItemByName(name: string): ItemData | null {
  return itemDatabase[name] ?? null;
}

export function getItemById(id: number): ItemData | null {
  for (const item of Object.values(itemDatabase)) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

export function getAntiHealItems(): ItemData[] {
  return Object.values(itemDatabase).filter(item =>
    item.tags.includes('anti_heal')
  );
}

export function getArmorItems(): ItemData[] {
  return Object.values(itemDatabase).filter(item =>
    item.stats.includes('armor') && item.category === 'legendary'
  );
}

export function getMRItems(): ItemData[] {
  return Object.values(itemDatabase).filter(item =>
    item.stats.includes('mr') && item.category === 'legendary'
  );
}

export function getTankShredItems(): ItemData[] {
  return Object.values(itemDatabase).filter(item =>
    item.tags.includes('tank_shred')
  );
}

export function getItemsForSituation(situation: ItemTag): ItemData[] {
  return Object.values(itemDatabase).filter(item =>
    item.tags.includes(situation) && item.category === 'legendary'
  );
}

export function recommendItems(
  myArchetype: string,
  enemyComp: { tanks: number; ap: number; ad: number; healers: number }
): string[] {
  const recommendations: string[] = [];
  const archetype = myArchetype.toLowerCase();

  // --------------------------------------------------------------------------
  // ADC / Marksman recommendations
  // --------------------------------------------------------------------------
  if (archetype === 'adc' || archetype === 'marksman') {
    // Core crit items
    recommendations.push('Infinity Edge');

    // Anti-tank
    if (enemyComp.tanks >= 2) {
      recommendations.push("Lord Dominik's Regards");
      recommendations.push('Kraken Slayer');
    } else if (enemyComp.tanks >= 1) {
      recommendations.push("Lord Dominik's Regards");
    }

    // Anti-heal
    if (enemyComp.healers >= 1) {
      recommendations.push('Mortal Reminder');
    }

    // Survivability
    if (enemyComp.ad >= 3) {
      recommendations.push('Guardian Angel');
    }
    if (enemyComp.ap >= 3) {
      recommendations.push("Maw of Malmortius");
    }

    // Default DPS
    if (recommendations.length < 4) {
      recommendations.push('Bloodthirster');
      recommendations.push('Phantom Dancer');
    }
  }

  // --------------------------------------------------------------------------
  // Mage recommendations
  // --------------------------------------------------------------------------
  else if (archetype === 'mage' || archetype === 'ap_carry') {
    recommendations.push("Rabadon's Deathcap");

    if (enemyComp.tanks >= 2) {
      recommendations.push('Void Staff');
      recommendations.push("Liandry's Torment");
    } else if (enemyComp.tanks >= 1) {
      recommendations.push('Void Staff');
    }

    if (enemyComp.healers >= 1) {
      recommendations.push('Morellonomicon');
    }

    if (enemyComp.ad >= 3) {
      recommendations.push("Zhonya's Hourglass");
    }

    if (enemyComp.ap >= 3) {
      recommendations.push("Banshee's Veil");
    }

    if (recommendations.length < 4) {
      recommendations.push("Luden's Tempest");
      recommendations.push('Shadowflame');
    }
  }

  // --------------------------------------------------------------------------
  // Assassin recommendations
  // --------------------------------------------------------------------------
  else if (archetype === 'assassin' || archetype === 'ad_assassin') {
    recommendations.push("Youmuu's Ghostblade");
    recommendations.push('Opportunity');

    if (enemyComp.tanks >= 2) {
      recommendations.push('Black Cleaver');
      recommendations.push("Serylda's Grudge");
    }

    if (enemyComp.healers >= 1) {
      recommendations.push('Chempunk Chainsword');
    }

    if (enemyComp.ap >= 2) {
      recommendations.push('Maw of Malmortius');
      recommendations.push('Edge of Night');
    }

    if (recommendations.length < 4) {
      recommendations.push('Hubris');
      recommendations.push('Profane Hydra');
    }
  }

  // --------------------------------------------------------------------------
  // Bruiser / Fighter recommendations
  // --------------------------------------------------------------------------
  else if (archetype === 'bruiser' || archetype === 'fighter') {
    recommendations.push('Trinity Force');
    recommendations.push("Sterak's Gage");

    if (enemyComp.tanks >= 2) {
      recommendations.push('Black Cleaver');
      recommendations.push('Blade of the Ruined King');
    }

    if (enemyComp.healers >= 1) {
      recommendations.push('Chempunk Chainsword');
    }

    if (enemyComp.ad >= 3) {
      recommendations.push("Death's Dance");
    }

    if (enemyComp.ap >= 3) {
      recommendations.push('Maw of Malmortius');
      recommendations.push("Wit's End");
    }

    if (recommendations.length < 4) {
      recommendations.push('Sundered Sky');
      recommendations.push('Spear of Shojin');
    }
  }

  // --------------------------------------------------------------------------
  // Tank recommendations
  // --------------------------------------------------------------------------
  else if (archetype === 'tank') {
    recommendations.push("Jak'Sho, The Protean");

    if (enemyComp.ad >= 3) {
      recommendations.push('Frozen Heart');
      recommendations.push("Randuin's Omen");
      recommendations.push('Thornmail');
    } else if (enemyComp.ad >= 2) {
      recommendations.push('Frozen Heart');
    }

    if (enemyComp.ap >= 3) {
      recommendations.push('Force of Nature');
      recommendations.push('Kaenic Rookern');
      recommendations.push('Spirit Visage');
    } else if (enemyComp.ap >= 2) {
      recommendations.push('Force of Nature');
    }

    if (enemyComp.healers >= 1) {
      recommendations.push('Thornmail');
    }

    if (recommendations.length < 4) {
      recommendations.push("Warmog's Armor");
      recommendations.push('Gargoyle Stoneplate');
    }
  }

  // --------------------------------------------------------------------------
  // Support (enchanter) recommendations
  // --------------------------------------------------------------------------
  else if (archetype === 'support' || archetype === 'enchanter') {
    recommendations.push('Moonstone Renewer');

    if (enemyComp.healers >= 1) {
      recommendations.push('Morellonomicon');
    }

    if (enemyComp.ad >= 3) {
      recommendations.push('Locket of the Iron Solari');
      recommendations.push("Knight's Vow");
    }

    if (enemyComp.ap >= 3) {
      recommendations.push("Mikael's Blessing");
    }

    // Default enchanter items
    if (recommendations.length < 4) {
      recommendations.push('Ardent Censer');
      recommendations.push('Staff of Flowing Water');
      recommendations.push('Redemption');
    }
  }

  // --------------------------------------------------------------------------
  // AP Bruiser / AP Fighter
  // --------------------------------------------------------------------------
  else if (archetype === 'ap_bruiser' || archetype === 'ap_fighter') {
    recommendations.push('Riftmaker');

    if (enemyComp.tanks >= 2) {
      recommendations.push("Liandry's Torment");
      recommendations.push('Void Staff');
    }

    if (enemyComp.healers >= 1) {
      recommendations.push('Morellonomicon');
    }

    if (enemyComp.ad >= 3) {
      recommendations.push("Zhonya's Hourglass");
    }

    if (recommendations.length < 4) {
      recommendations.push("Nashor's Tooth");
      recommendations.push("Rabadon's Deathcap");
      recommendations.push('Cosmic Drive');
    }
  }

  // --------------------------------------------------------------------------
  // Fallback: generic recommendations based on enemy comp
  // --------------------------------------------------------------------------
  else {
    if (enemyComp.tanks >= 2) {
      recommendations.push("Lord Dominik's Regards");
      recommendations.push('Void Staff');
    }
    if (enemyComp.healers >= 1) {
      recommendations.push('Mortal Reminder');
      recommendations.push('Morellonomicon');
    }
    if (enemyComp.ad >= 3) {
      recommendations.push("Zhonya's Hourglass");
      recommendations.push("Randuin's Omen");
    }
    if (enemyComp.ap >= 3) {
      recommendations.push("Banshee's Veil");
      recommendations.push('Force of Nature');
    }
  }

  // Deduplicate
  return [...new Set(recommendations)];
}
