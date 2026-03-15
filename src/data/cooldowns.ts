// Champion Ultimate Cooldowns Database
// Data sourced from League of Legends Wiki (wiki.leagueoflegends.com) - Season 2025-2026
// Last verified: March 2026

export interface ChampionCooldowns {
  ultCooldown: [number, number, number]; // [rank1, rank2, rank3] in seconds
  flashInteraction?: string; // Special flash combos (e.g., "R-Flash" for Gragas)
  summonerSpellNotes?: string; // e.g., "Takes Teleport 90% of the time"
}

export const championCooldownsDB: Record<string, ChampionCooldowns> = {
  Aatrox: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Can Flash during Q casts for repositioning",
    summonerSpellNotes: "Takes Teleport or Ignite top lane",
  },
  Ahri: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "E-Flash charm redirect is a key engage combo",
    summonerSpellNotes: "Takes Ignite mid, Teleport in some matchups",
  },
  Akali: {
    ultCooldown: [120, 90, 60],
    flashInteraction: "R1-Flash for gap close, E-Flash for surprise engage",
    summonerSpellNotes: "Takes Ignite or Teleport mid",
  },
  Akshan: {
    ultCooldown: [100, 85, 70],
    summonerSpellNotes: "Takes Ignite or Barrier mid",
  },
  Alistar: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "W-Q-Flash (Headbutt-Pulverize combo with Flash)",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Ambessa: {
    ultCooldown: [130, 115, 100],
    summonerSpellNotes: "Takes Ignite or Teleport top lane",
  },
  Amumu: {
    ultCooldown: [150, 125, 100],
    flashInteraction: "R-Flash for instant AoE stun engage",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Anivia: {
    ultCooldown: [4, 3, 2], // Toggle ability, this is the recast cooldown
    summonerSpellNotes: "Takes Teleport mid, Flash always",
  },
  Annie: {
    ultCooldown: [130, 115, 100],
    flashInteraction: "Flash-R (Tibbers) for instant AoE stun engage, one of the best Flash combos in the game",
    summonerSpellNotes: "Takes Ignite or Ghost mid",
  },
  Aphelios: {
    ultCooldown: [120, 110, 100],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Ashe: {
    ultCooldown: [100, 80, 60],
    flashInteraction: "R-Flash not needed due to global range",
    summonerSpellNotes: "Takes Heal bot lane, sometimes Ghost",
  },
  "Aurelion Sol": {
    ultCooldown: [120, 110, 100],
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  Aurora: {
    ultCooldown: [140, 120, 100],
    summonerSpellNotes: "Takes Teleport or Ignite",
  },
  Azir: {
    ultCooldown: [120, 105, 90],
    flashInteraction: "E-Q-Flash (Shurima Shuffle) for insec-style play",
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  Bard: {
    ultCooldown: [110, 95, 80],
    flashInteraction: "Flash-R for surprise Tempered Fate",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  "Bel'Veth": {
    ultCooldown: [1, 1, 1], // Requires Void Coral from epic monsters/champs
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Blitzcrank: {
    ultCooldown: [60, 40, 20],
    flashInteraction: "Flash-Q (Rocket Grab) for surprise hook",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Brand: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Ignite support, Barrier mid",
  },
  Braum: {
    ultCooldown: [130, 115, 100],
    flashInteraction: "R-Flash for redirected Glacial Fissure",
    summonerSpellNotes: "Takes Exhaust or Ignite support",
  },
  Briar: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Caitlyn: {
    ultCooldown: [90, 90, 90], // Flat cooldown at all ranks
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Camille: {
    ultCooldown: [140, 115, 90],
    flashInteraction: "E-Flash for extended hookshot range engage",
    summonerSpellNotes: "Takes Teleport top, Ignite in some matchups",
  },
  Cassiopeia: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for instant Petrifying Gaze",
    summonerSpellNotes: "Takes Teleport or Ignite mid",
  },
  "Cho'Gath": {
    ultCooldown: [80, 70, 60],
    flashInteraction: "Flash-R for surprise execute Feast",
    summonerSpellNotes: "Takes Teleport top, Flash + Smite if jungle",
  },
  Corki: {
    ultCooldown: [2, 2, 2], // Missile Barrage recharge: 20s per missile, 2s between shots
    summonerSpellNotes: "Takes Teleport mid",
  },
  Darius: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-E (Apprehend) for surprise pull, Flash-R for execute",
    summonerSpellNotes: "Takes Ghost + Flash top, Ghost + Teleport sometimes",
  },
  Diana: {
    ultCooldown: [100, 90, 80],
    flashInteraction: "E-Flash to reposition Moonfall pull",
    summonerSpellNotes: "Takes Flash + Smite jungle, Ignite mid",
  },
  "Dr. Mundo": {
    ultCooldown: [120, 120, 120], // Flat cooldown at all ranks
    summonerSpellNotes: "Takes Teleport + Ghost top lane 90% of the time",
  },
  Draven: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Ekko: {
    ultCooldown: [110, 80, 50],
    summonerSpellNotes: "Takes Ignite mid, Flash + Smite jungle",
  },
  Elise: {
    ultCooldown: [4, 4, 4], // Transform: Spider Form / Human Form, no real ult cooldown
    flashInteraction: "Flash-E (Cocoon) for surprise stun",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Evelynn: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for extended execute range",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Ezreal: {
    ultCooldown: [120, 105, 90],
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Fiddlesticks: {
    ultCooldown: [140, 110, 80],
    flashInteraction: "R-Flash (Crowstorm-Flash) for instant repositioned channel",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Fiora: {
    ultCooldown: [110, 90, 70],
    summonerSpellNotes: "Takes Teleport + Flash top, Ignite in some matchups",
  },
  Fizz: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for point blank shark",
    summonerSpellNotes: "Takes Ignite mid",
  },
  Galio: {
    ultCooldown: [180, 160, 140],
    flashInteraction: "W-Flash for instant taunt engage",
    summonerSpellNotes: "Takes Teleport mid for roam synergy with R",
  },
  Gangplank: {
    ultCooldown: [160, 140, 120],
    flashInteraction: "Flash-Barrel combo for surprise damage",
    summonerSpellNotes: "Takes Teleport top lane 90% of the time",
  },
  Garen: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for surprise execute",
    summonerSpellNotes: "Takes Ignite + Flash top, sometimes Ghost",
  },
  Gnar: {
    ultCooldown: [90, 60, 30], // Only usable in Mega Gnar form
    flashInteraction: "R-Flash (GNAR!-Flash) for redirected wall slam",
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Gragas: {
    ultCooldown: [100, 85, 70],
    flashInteraction: "R-Flash for redirected Explosive Cask, E-Flash for extended body slam",
    summonerSpellNotes: "Takes Flash + Smite jungle, Ignite mid",
  },
  Graves: {
    ultCooldown: [100, 80, 60],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Gwen: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Teleport + Flash top",
  },
  Hecarim: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "E-Flash for extended devastating charge",
    summonerSpellNotes: "Takes Ghost + Smite jungle often, sometimes Flash",
  },
  Heimerdinger: {
    ultCooldown: [100, 85, 70],
    summonerSpellNotes: "Takes Teleport or Ignite top/mid",
  },
  Hwei: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Barrier or Teleport mid",
  },
  Illaoi: {
    ultCooldown: [120, 95, 70],
    flashInteraction: "Flash-R for surprise Leap of Faith in teamfights",
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Irelia: {
    ultCooldown: [125, 105, 85],
    flashInteraction: "Flash-E for surprise stun setup",
    summonerSpellNotes: "Takes Teleport or Ignite top/mid",
  },
  Ivern: {
    ultCooldown: [140, 130, 120],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Janna: {
    ultCooldown: [130, 115, 100],
    flashInteraction: "Flash-R for repositioned Monsoon knockback",
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  "Jarvan IV": {
    ultCooldown: [120, 105, 90],
    flashInteraction: "E-Q-Flash (Flag-Drag-Flash) for extended knockup range",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Jax: {
    ultCooldown: [110, 100, 90],
    flashInteraction: "Q-Flash or E-Flash for engage",
    summonerSpellNotes: "Takes Teleport top, Flash + Smite jungle",
  },
  Jayce: {
    ultCooldown: [6, 6, 6], // Transform ability, no traditional ult
    flashInteraction: "Flash-E (Thundering Blow) for insec-style knockback",
    summonerSpellNotes: "Takes Teleport top/mid",
  },
  Jhin: {
    ultCooldown: [120, 105, 90],
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Jinx: {
    ultCooldown: [85, 65, 45],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  "K'Sante": {
    ultCooldown: [120, 100, 80],
    flashInteraction: "W-Flash for repositioned All Out engage",
    summonerSpellNotes: "Takes Teleport top lane",
  },
  "Kai'Sa": {
    ultCooldown: [130, 100, 70],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Kalista: {
    ultCooldown: [160, 140, 120],
    summonerSpellNotes: "Takes Heal bot lane, synergy with bonded support",
  },
  Karma: {
    ultCooldown: [40, 38, 36], // Very short CD, 4 ranks (using first 3)
    flashInteraction: "Flash-W for surprise root setup",
    summonerSpellNotes: "Takes Ignite or Exhaust support, Teleport mid",
  },
  Karthus: {
    ultCooldown: [200, 180, 160],
    summonerSpellNotes: "Takes Flash + Smite jungle, Exhaust mid",
  },
  Kassadin: {
    ultCooldown: [5, 3.5, 2], // Riftwalk, extremely low CD blink
    summonerSpellNotes: "Takes Teleport + Flash mid",
  },
  Katarina: {
    ultCooldown: [75, 60, 45],
    flashInteraction: "Flash-R for instant Death Lotus positioning (rarely used since she has Shunpo)",
    summonerSpellNotes: "Takes Ignite mid",
  },
  Kayle: {
    ultCooldown: [160, 120, 80],
    summonerSpellNotes: "Takes Teleport top lane, scales heavily",
  },
  Kayn: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Kennen: {
    ultCooldown: [120, 120, 120], // Flat cooldown at all ranks
    flashInteraction: "Flash-R (Slicing Maelstrom) for instant teamfight engage, E-Flash",
    summonerSpellNotes: "Takes Teleport top lane for teamfight flanks",
  },
  "Kha'Zix": {
    ultCooldown: [100, 85, 70],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Kindred: {
    ultCooldown: [160, 140, 120],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Kled: {
    ultCooldown: [140, 125, 110],
    summonerSpellNotes: "Takes Ignite + Flash top (no Teleport, can use R to roam)",
  },
  "Kog'Maw": {
    ultCooldown: [2, 1.5, 1], // Living Artillery, low CD poke
    summonerSpellNotes: "Takes Heal bot lane",
  },
  LeBlanc: {
    ultCooldown: [45, 35, 25],
    flashInteraction: "W-Flash or E-Flash for extended chain range",
    summonerSpellNotes: "Takes Ignite mid",
  },
  "Lee Sin": {
    ultCooldown: [110, 85, 60],
    flashInteraction: "R-Flash (Dragon's Rage-Flash) for insec kick, one of the most iconic Flash combos",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Leona: {
    ultCooldown: [90, 75, 60],
    flashInteraction: "Flash-R for surprise Solar Flare engage, E-Flash",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Lillia: {
    ultCooldown: [150, 130, 110],
    flashInteraction: "Flash-E or Flash-W for sleep setup",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Lissandra: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for instant lockdown, E-Flash for engage",
    summonerSpellNotes: "Takes Teleport or Ignite mid",
  },
  Lucian: {
    ultCooldown: [110, 100, 90],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Lulu: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  Lux: {
    ultCooldown: [60, 50, 40],
    summonerSpellNotes: "Takes Barrier mid, Ignite support",
  },
  Malphite: {
    ultCooldown: [130, 115, 100],
    flashInteraction: "R-Flash for extended Unstoppable Force range, devastating teamfight engage",
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Malzahar: {
    ultCooldown: [140, 110, 80],
    flashInteraction: "Flash-R for surprise suppression",
    summonerSpellNotes: "Takes Teleport mid",
  },
  Maokai: {
    ultCooldown: [130, 110, 90],
    summonerSpellNotes: "Takes Flash + Smite jungle, Exhaust support",
  },
  "Master Yi": {
    ultCooldown: [85, 85, 85], // Flat cooldown at all ranks
    summonerSpellNotes: "Takes Flash + Smite jungle, sometimes Ghost",
  },
  Mel: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Barrier or Teleport mid",
  },
  Milio: {
    ultCooldown: [160, 145, 130],
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  "Miss Fortune": {
    ultCooldown: [120, 110, 100],
    flashInteraction: "Flash-R for repositioned Bullet Time",
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Mordekaiser: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "Flash-E for surprise pull, Flash-R for targeted Realm of Death",
    summonerSpellNotes: "Takes Teleport or Ignite top",
  },
  Morgana: {
    ultCooldown: [120, 110, 100],
    flashInteraction: "Flash-R for instant Soul Shackles engage (with Zhonya's)",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Naafiri: {
    ultCooldown: [110, 95, 80],
    summonerSpellNotes: "Takes Ignite mid",
  },
  Nami: {
    ultCooldown: [120, 110, 100],
    flashInteraction: "Flash-R for redirected Tidal Wave",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Nasus: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-W for surprise Wither engage",
    summonerSpellNotes: "Takes Teleport + Flash top, sometimes Ghost",
  },
  Nautilus: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-Q for surprise Dredge Line hook",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Neeko: {
    ultCooldown: [120, 105, 90], // 5-rank ult (120/112.5/105/97.5/90), using ranks 1/3/5
    flashInteraction: "Flash-R for instant Pop Blossom, extremely strong teamfight engage",
    summonerSpellNotes: "Takes Ignite or Teleport mid",
  },
  Nidalee: {
    ultCooldown: [3, 3, 3], // Transform: Cougar Form, no real ult cooldown
    flashInteraction: "Flash-Q (spear) for surprise damage",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Nilah: {
    ultCooldown: [110, 95, 80],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Nocturne: {
    ultCooldown: [140, 115, 90],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  "Nunu & Willump": {
    ultCooldown: [110, 100, 90],
    flashInteraction: "Flash-R for repositioned Absolute Zero",
    summonerSpellNotes: "Takes Flash + Smite jungle, sometimes Ghost",
  },
  Olaf: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Ghost + Flash top, Flash + Smite jungle",
  },
  Orianna: {
    ultCooldown: [110, 95, 80],
    flashInteraction: "Flash-R (Flash-Shockwave) for surprise AoE, E-ally into Flash-R combo",
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  Ornn: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "Flash-R2 for redirected ram headbutt",
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Pantheon: {
    ultCooldown: [180, 165, 150],
    flashInteraction: "Flash-W for surprise stun engage",
    summonerSpellNotes: "Takes Ignite top/mid, Flash + Smite jungle",
  },
  Poppy: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "Flash-R for surprise Keeper's Verdict knockup",
    summonerSpellNotes: "Takes Teleport top, Flash + Smite jungle",
  },
  Pyke: {
    ultCooldown: [100, 85, 70],
    flashInteraction: "Flash-R for repositioned Death from Below execute",
    summonerSpellNotes: "Takes Ignite support",
  },
  Qiyana: {
    ultCooldown: [120, 120, 120], // Flat cooldown at all ranks
    flashInteraction: "Flash-R for surprise Supreme Display of Talent wall shockwave",
    summonerSpellNotes: "Takes Ignite mid",
  },
  Quinn: {
    ultCooldown: [3, 3, 3], // Behind Enemy Lines transform, very low CD
    summonerSpellNotes: "Takes Teleport or Ignite top",
  },
  Rakan: {
    ultCooldown: [130, 110, 90],
    flashInteraction: "R-Flash-W for instant charmed engage, one of the best engage combos",
    summonerSpellNotes: "Takes Ignite support",
  },
  Rammus: {
    ultCooldown: [120, 105, 90],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  "Rek'Sai": {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-E (unburrowed) for unburrow knockup",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Rell: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for instant Magnet Storm pull",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  "Renata Glasc": {
    ultCooldown: [150, 130, 110],
    flashInteraction: "Flash-R for redirected Hostile Takeover",
    summonerSpellNotes: "Takes Exhaust or Ignite support",
  },
  Renekton: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-W for surprise empowered stun",
    summonerSpellNotes: "Takes Ignite + Flash top",
  },
  Rengar: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle, Ignite top",
  },
  Riven: {
    ultCooldown: [120, 90, 60],
    flashInteraction: "Flash-W for instant AoE stun, R2-Flash for Wind Slash redirect",
    summonerSpellNotes: "Takes Ignite + Flash top",
  },
  Rumble: {
    ultCooldown: [130, 105, 80],
    flashInteraction: "Flash-R for repositioned Equalizer placement",
    summonerSpellNotes: "Takes Teleport top, Flash + Smite jungle",
  },
  Ryze: {
    ultCooldown: [180, 160, 140],
    summonerSpellNotes: "Takes Teleport mid (synergy with R for team transport)",
  },
  Samira: {
    ultCooldown: [5, 5, 5], // Static cooldown, requires Style grade S to cast
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Sejuani: {
    ultCooldown: [120, 105, 90],
    flashInteraction: "Flash-R for surprise Glacial Prison stun",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Senna: {
    ultCooldown: [140, 120, 100],
    summonerSpellNotes: "Takes Heal bot lane ADC, Exhaust support",
  },
  Seraphine: {
    ultCooldown: [160, 140, 120],
    flashInteraction: "Flash-R for surprise Encore engage",
    summonerSpellNotes: "Takes Exhaust or Heal support, Barrier mid",
  },
  Sett: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for surprise Show Stopper grab, Flash-E for extended Facebreaker",
    summonerSpellNotes: "Takes Teleport or Ignite top",
  },
  Shaco: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Ignite + Smite jungle",
  },
  Shen: {
    ultCooldown: [200, 180, 160],
    flashInteraction: "Flash-E (Shadow Dash) for extended taunt range",
    summonerSpellNotes: "Takes Teleport + Flash top (both TP and R for global presence)",
  },
  Shyvana: {
    ultCooldown: [0, 0, 0], // Fury-based, no traditional cooldown
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Singed: {
    ultCooldown: [100, 100, 100], // Flat cooldown at all ranks
    flashInteraction: "Flash-E (Fling) for surprise throw",
    summonerSpellNotes: "Takes Ghost + Teleport top, sometimes no Flash",
  },
  Sion: {
    ultCooldown: [140, 100, 60],
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Sivir: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Skarner: {
    ultCooldown: [120, 105, 90],
    flashInteraction: "Flash-R for surprise Impale suppression and drag",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Smolder: {
    ultCooldown: [120, 110, 100],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Sona: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "Flash-R for instant Crescendo stun",
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  Soraka: {
    ultCooldown: [150, 135, 120],
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  Swain: {
    ultCooldown: [120, 120, 120], // Flat cooldown at all ranks
    flashInteraction: "Flash-E for surprise Nevermove root",
    summonerSpellNotes: "Takes Ignite or Exhaust support, Teleport mid",
  },
  Sylas: {
    ultCooldown: [80, 55, 30], // Hijack - steals enemy ult
    flashInteraction: "Flash-E for extended engage, uses stolen ult Flash combos",
    summonerSpellNotes: "Takes Ignite or Teleport mid",
  },
  Syndra: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-E for surprise Scatter the Weak stun",
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  "Tahm Kench": {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-Q for surprise tongue lash",
    summonerSpellNotes: "Takes Ignite or Exhaust support, Teleport top",
  },
  Taliyah: {
    ultCooldown: [180, 150, 120],
    summonerSpellNotes: "Takes Flash + Smite jungle, Teleport mid",
  },
  Talon: {
    ultCooldown: [100, 80, 60],
    flashInteraction: "R-Flash for repositioned Shadow Assault",
    summonerSpellNotes: "Takes Ignite mid",
  },
  Taric: {
    ultCooldown: [180, 150, 120],
    summonerSpellNotes: "Takes Exhaust or Ignite support",
  },
  Teemo: {
    ultCooldown: [0.25, 0.25, 0.25], // Trap placement CD; recharge: 35/30/25s per charge
    summonerSpellNotes: "Takes Ignite or Teleport top",
  },
  Thresh: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-E (Flay) for surprise knockback, Flash-Q for hook",
    summonerSpellNotes: "Takes Ignite or Exhaust support",
  },
  Tristana: {
    ultCooldown: [100, 100, 100], // Flat cooldown at all ranks
    flashInteraction: "W-R (Rocket Jump + Buster Shot) combo for assassination or peel",
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Trundle: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle, Teleport top",
  },
  Tryndamere: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-E for gap close during Undying Rage",
    summonerSpellNotes: "Takes Ignite + Ghost or Flash top",
  },
  "Twisted Fate": {
    ultCooldown: [170, 140, 110],
    flashInteraction: "Flash-W (Gold Card) for instant stun",
    summonerSpellNotes: "Takes Teleport mid (double global with R)",
  },
  Twitch: {
    ultCooldown: [90, 90, 90], // Flat cooldown at all ranks
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Udyr: {
    ultCooldown: [0, 0, 0], // No traditional ultimate, 4 basic abilities with stance system
    summonerSpellNotes: "Takes Flash + Smite jungle, sometimes Ghost",
  },
  Urgot: {
    ultCooldown: [100, 85, 70],
    flashInteraction: "Flash-E for surprise Disdain flip engage",
    summonerSpellNotes: "Takes Teleport or Ignite top",
  },
  Varus: {
    ultCooldown: [100, 80, 60],
    flashInteraction: "Flash-R for surprise Chain of Corruption root",
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Vayne: {
    ultCooldown: [100, 85, 70],
    summonerSpellNotes: "Takes Heal bot lane, Teleport top",
  },
  Veigar: {
    ultCooldown: [100, 80, 60],
    flashInteraction: "Flash-E for surprise Event Horizon cage",
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  "Vel'Koz": {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Barrier mid, Ignite support",
  },
  Vex: {
    ultCooldown: [140, 120, 100],
    flashInteraction: "Flash-W for fear, Flash-R for extended engage range",
    summonerSpellNotes: "Takes Ignite or Teleport mid",
  },
  Vi: {
    ultCooldown: [140, 115, 90],
    flashInteraction: "Flash-Q for extended Vault Breaker engage",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Viego: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Viktor: {
    ultCooldown: [120, 100, 80],
    summonerSpellNotes: "Takes Teleport or Barrier mid",
  },
  Vladimir: {
    ultCooldown: [120, 120, 120], // Flat cooldown at all ranks
    flashInteraction: "Flash-R-E for surprise Hemoplague engage",
    summonerSpellNotes: "Takes Teleport + Ignite mid (often no Flash), or Flash + Ignite",
  },
  Volibear: {
    ultCooldown: [160, 135, 110],
    flashInteraction: "Flash-E for repositioned Stormbringer dive",
    summonerSpellNotes: "Takes Teleport top, Flash + Smite jungle",
  },
  Warwick: {
    ultCooldown: [110, 90, 70],
    flashInteraction: "R-Flash for extended Infinite Duress range, key engage combo",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Wukong: {
    ultCooldown: [130, 110, 90],
    flashInteraction: "Flash-R for instant Cyclone engage",
    summonerSpellNotes: "Takes Ignite top, Flash + Smite jungle",
  },
  Xayah: {
    ultCooldown: [140, 120, 100],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Xerath: {
    ultCooldown: [130, 115, 100],
    summonerSpellNotes: "Takes Barrier or Teleport mid",
  },
  "Xin Zhao": {
    ultCooldown: [120, 110, 100],
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Yasuo: {
    ultCooldown: [70, 50, 30],
    flashInteraction: "EQ-Flash (Beyblade) for repositioned tornado knockup",
    summonerSpellNotes: "Takes Ignite or Teleport mid, Exhaust or Teleport top",
  },
  Yone: {
    ultCooldown: [120, 100, 80],
    flashInteraction: "Flash-R for instant Fate Sealed engage",
    summonerSpellNotes: "Takes Teleport mid/top",
  },
  Yorick: {
    ultCooldown: [160, 130, 100],
    summonerSpellNotes: "Takes Teleport top lane",
  },
  Yunara: {
    ultCooldown: [100, 90, 80],
    summonerSpellNotes: "Takes Heal bot lane",
  },
  Yuumi: {
    ultCooldown: [120, 110, 100],
    summonerSpellNotes: "Takes Exhaust or Heal support",
  },
  Zaahen: {
    ultCooldown: [110, 95, 80],
    summonerSpellNotes: "Takes Flash + Smite jungle, Teleport top",
  },
  Zac: {
    ultCooldown: [120, 105, 90],
    flashInteraction: "E-Flash for extended Elastic Slingshot engage",
    summonerSpellNotes: "Takes Flash + Smite jungle",
  },
  Zed: {
    ultCooldown: [120, 110, 100],
    flashInteraction: "W-E-Q-Flash or R-Flash for extended shadow play",
    summonerSpellNotes: "Takes Ignite mid",
  },
  Zeri: {
    ultCooldown: [80, 75, 70],
    summonerSpellNotes: "Takes Heal or Cleanse bot lane",
  },
  Ziggs: {
    ultCooldown: [120, 95, 70],
    summonerSpellNotes: "Takes Barrier or Teleport mid",
  },
  Zilean: {
    ultCooldown: [120, 90, 60],
    flashInteraction: "Flash-E for surprise slow/speed, Flash-R for clutch revive positioning",
    summonerSpellNotes: "Takes Exhaust or Heal support, Teleport mid",
  },
  Zoe: {
    ultCooldown: [11, 8, 5], // Portal Jump, very short CD repositioning tool
    flashInteraction: "R-Flash for extended Portal Jump range (snaps back to original location)",
    summonerSpellNotes: "Takes Ignite or Barrier mid",
  },
  Zyra: {
    ultCooldown: [110, 100, 90],
    flashInteraction: "Flash-R for surprise Stranglethorns knockup",
    summonerSpellNotes: "Takes Ignite support",
  },
};

// Summoner Spell Cooldowns (Season 2025-2026, Summoner's Rift)
// Source: wiki.leagueoflegends.com
export const summonerSpellCooldowns: Record<string, number> = {
  Flash: 300,
  Teleport: 420,
  Heal: 240,
  Ignite: 180,
  Exhaust: 240,
  Barrier: 180,
  Cleanse: 240,
  Ghost: 240,
  Smite: 90,
  Clarity: 240, // ARAM only
  Mark: 80, // ARAM (Snowball) only
};

/**
 * Returns the ultimate cooldown in seconds based on champion level.
 * - Levels 6-10: Rank 1
 * - Levels 11-15: Rank 2
 * - Levels 16-18: Rank 3
 *
 * Returns -1 if champion not found or level is below 6.
 */
export function getUltCooldown(champion: string, level: number): number {
  const data = championCooldownsDB[champion];
  if (!data) return -1;
  if (level < 6) return -1;
  if (level >= 16) return data.ultCooldown[2];
  if (level >= 11) return data.ultCooldown[1];
  return data.ultCooldown[0];
}

/**
 * Returns the ultimate cooldown in seconds for a specific rank (1, 2, or 3).
 * Returns -1 if champion not found.
 */
export function getUltCooldownByRank(
  champion: string,
  rank: 1 | 2 | 3
): number {
  const data = championCooldownsDB[champion];
  if (!data) return -1;
  return data.ultCooldown[rank - 1];
}

/**
 * Returns true if any rank of the champion's ultimate has a cooldown under 60 seconds.
 * This includes champions with special mechanics (transforms, fury-based, etc.)
 * that have very low or zero cooldowns on their R ability.
 */
export function hasShortUltCD(champion: string): boolean {
  const data = championCooldownsDB[champion];
  if (!data) return false;
  return data.ultCooldown.some((cd) => cd < 60);
}

// ── Convenience lookups ──

/**
 * Returns all champions whose ultimate cooldown at any rank is under the
 * specified threshold (default 60s). Useful for identifying champions
 * whose ults may be available for every fight.
 */
export function getChampionsWithShortUlt(
  thresholdSeconds: number = 60
): string[] {
  return Object.entries(championCooldownsDB)
    .filter(([, data]) => data.ultCooldown.some((cd) => cd < thresholdSeconds))
    .map(([name]) => name);
}

/**
 * Returns all champions whose ultimate cooldown at rank 1 is above the
 * specified threshold (default 150s). Useful for tracking high-impact,
 * long-cooldown ultimates that should be played around.
 */
export function getChampionsWithLongUlt(
  thresholdSeconds: number = 150
): string[] {
  return Object.entries(championCooldownsDB)
    .filter(([, data]) => data.ultCooldown[0] > thresholdSeconds)
    .map(([name]) => name);
}
