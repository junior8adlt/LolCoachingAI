import type { PlayerInfo } from '../types/game';
import type { CoachingTip } from '../types/coaching';
import { getChampionMeta } from '../data/championMeta';

// ── Champion Threat Model ──
// Maps each enemy champion to their SPECIFIC threat type and generates
// contextual warnings a real coach would give.

export type ThreatType =
  | 'hook'        // Blitzcrank, Thresh, Nautilus, Pyke
  | 'burst'       // Zed, LeBlanc, Fizz, Rengar
  | 'engage'      // Malphite, Leona, Amumu, Rakan
  | 'dive'        // Camille, Irelia, Vi, Diana
  | 'poke'        // Xerath, Lux, Ziggs, Vel'Koz
  | 'stealth'     // Evelynn, Shaco, Twitch, Rengar
  | 'splitpush'   // Fiora, Jax, Tryndamere, Yorick
  | 'scaling'     // Kassadin, Kayle, Veigar, Vayne
  | 'zone'        // Heimerdinger, Zyra, Viktor, Rumble
  | 'cc_chain'    // Morgana, Lissandra, Sejuani, Nautilus
  | 'sustain';    // Dr. Mundo, Aatrox, Vladimir, Soraka

interface ChampionThreat {
  types: ThreatType[];
  warning: string;        // What to watch out for
  counterplay: string;    // How to play against it
}

const CHAMPION_THREATS: Record<string, ChampionThreat> = {
  // ── Hook champions ──
  Blitzcrank: { types: ['hook'], warning: 'Hook threat', counterplay: 'Stay behind minions at all times. If he misses Q, punish for 16s.' },
  Thresh: { types: ['hook', 'engage'], warning: 'Hook + lantern engage', counterplay: 'Stand behind minions. Watch for flay forward into hook.' },
  Nautilus: { types: ['hook', 'cc_chain'], warning: 'Hook + CC chain', counterplay: 'Stay behind minions. His ult is point-click, save flash for it.' },
  Pyke: { types: ['hook', 'stealth'], warning: 'Stealth hook + execute', counterplay: 'Pink ward the bush. Stay above execute threshold.' },

  // ── Burst assassins ──
  Zed: { types: ['burst'], warning: 'Burst assassin', counterplay: 'Respect his level 6 all-in. Build Zhonya if AP. Track his W shadow cooldown.' },
  LeBlanc: { types: ['burst'], warning: 'Burst + mobility', counterplay: 'She dashes back to W pad. Punish her return position. Don\'t chase.' },
  Fizz: { types: ['burst', 'dive'], warning: 'Untargetable + burst', counterplay: 'Bait his E (troll pole) before committing. It has 16s CD early.' },
  Katarina: { types: ['burst'], warning: 'Reset assassin', counterplay: 'Don\'t clump in teamfights. CC her during ult. Save CC for her E resets.' },
  Rengar: { types: ['burst', 'stealth'], warning: 'Bush/ult stealth burst', counterplay: 'Group with team. Pink ward nearby. Don\'t face-check bushes.' },
  Evelynn: { types: ['burst', 'stealth'], warning: 'Permanent stealth post-6', counterplay: 'Buy control wards. She\'s visible within detection radius. Track her camps.' },
  Talon: { types: ['burst'], warning: 'Wall-hop roamer', counterplay: 'Ward raptors. Ping missing immediately. He roams faster than any mid.' },
  Akali: { types: ['burst', 'dive'], warning: 'Shroud makes her untargetable to autos', counterplay: 'Use AoE/skillshots into shroud. Don\'t waste targeted abilities.' },

  // ── Engage tanks ──
  Malphite: { types: ['engage'], warning: 'Unstoppable ult engage', counterplay: 'Don\'t group too tight. Spread out. Flash sideways, not backwards.' },
  Leona: { types: ['engage', 'cc_chain'], warning: 'Level 2 all-in', counterplay: 'Respect her E range. Don\'t stand next to your ADC so she can\'t stun both.' },
  Amumu: { types: ['engage', 'cc_chain'], warning: 'AoE stun ult', counterplay: 'Spread out in teamfights. Poke before he engages. QSS his ult.' },
  Rakan: { types: ['engage'], warning: 'Fast dash + knockup', counterplay: 'He needs to W in. Sidestep the knockup or flash it. Punish when W is down.' },
  Rell: { types: ['engage', 'cc_chain'], warning: 'AoE engage', counterplay: 'She\'s very slow after dismounting. Disengage after her initial combo.' },

  // ── Divers ──
  Camille: { types: ['dive'], warning: 'Ult traps you in a zone', counterplay: 'She needs E to engage. If she misses hookshot, she has no gap close for 16s.' },
  Irelia: { types: ['dive'], warning: 'Q reset dashes', counterplay: 'Don\'t let her stack passive to 5 on minions near you. Fight when passive is low.' },
  Vi: { types: ['dive'], warning: 'Point-click ult', counterplay: 'Her ult is undodgeable. Position so she has to ult through your team to reach you.' },
  Diana: { types: ['dive', 'burst'], warning: 'AoE dive', counterplay: 'She wants to E into your clumped team. Spread out. Burst her before she ults.' },
  Hecarim: { types: ['dive', 'engage'], warning: 'Speed charge + fear', counterplay: 'Ward deep in jungle to see him coming. His ganks are fast but telegraphed.' },

  // ── Poke ──
  Xerath: { types: ['poke'], warning: 'Long range poke', counterplay: 'Dodge sideways, not forwards/backwards. All-in him - he has no escape.' },
  Lux: { types: ['poke', 'burst'], warning: 'Q root + burst combo', counterplay: 'Stay behind minions to block Q. If she misses Q, she can\'t kill you.' },
  Ziggs: { types: ['poke', 'zone'], warning: 'Constant poke + tower execute', counterplay: 'Engage on him. He has no escape except W. Force fights, don\'t poke back.' },
  "Vel'Koz": { types: ['poke'], warning: 'True damage combo', counterplay: 'Dodge Q geometry (it splits). All-in him, he\'s immobile.' },
  Jayce: { types: ['poke', 'burst'], warning: 'Ranged poke + melee burst', counterplay: 'Fight him when he\'s in cannon form (no melee burst). Respect hammer E knockback.' },

  // ── Stealth ──
  Shaco: { types: ['stealth', 'burst'], warning: 'Invisible ganks', counterplay: 'Pink ward the bush he\'ll come from. His Q has a poof animation before vanishing.' },
  Twitch: { types: ['stealth'], warning: 'Stealth ambush + AoE', counterplay: 'Pink ward in lane. He\'s extremely weak in direct 1v1 early. Punish if he\'s visible.' },

  // ── Splitpush ──
  Fiora: { types: ['splitpush'], warning: 'Cannot be matched 1v1 late', counterplay: 'Group as 5 and force objectives. Don\'t send one person to match her.' },
  Jax: { types: ['splitpush', 'dive'], warning: 'Strongest 1v1 duelist late', counterplay: 'Same as Fiora - don\'t try to 1v1. Force 5v4 when he splits.' },
  Tryndamere: { types: ['splitpush'], warning: '5s undying ult', counterplay: 'Don\'t waste burst on his ult. Kite him for 5s, then kill. CC after ult ends.' },
  Yorick: { types: ['splitpush'], warning: 'Maiden + ghouls pressure', counterplay: 'Kill the Maiden (his pet). Without it his split push is much weaker.' },
  Nasus: { types: ['splitpush', 'scaling'], warning: 'Infinite stacking Q', counterplay: 'Punish him hard before 20 min. Don\'t let him free-farm. Kite him in fights.' },

  // ── Scaling threats ──
  Kassadin: { types: ['scaling', 'burst'], warning: 'Hyperscaler - level 16 monster', counterplay: 'End the game before 30 min. Punish his weak early game hard.' },
  Kayle: { types: ['scaling'], warning: 'Level 16 hypercarry', counterplay: 'Dive her pre-6. She has no ult and is melee. Shut her down early or lose late.' },
  Veigar: { types: ['scaling', 'zone'], warning: 'Infinite AP + cage', counterplay: 'Don\'t walk into his E cage edges. Flash or dash through. End early.' },
  Vayne: { types: ['scaling'], warning: 'True damage tank shredder', counterplay: 'CC her. She\'s squishy. Burst before she can kite. Don\'t let games go to 30+ min.' },

  // ── Sustain ──
  "Dr. Mundo": { types: ['sustain'], warning: 'Unkillable with ult', counterplay: 'Buy anti-heal. Ignite his ult. Focus carries, not him.' },
  Aatrox: { types: ['sustain', 'dive'], warning: 'Heals from hitting you', counterplay: 'Anti-heal is mandatory. Dodge his Q sweetspots (edges). Kite backwards.' },
  Vladimir: { types: ['sustain', 'scaling'], warning: 'Pool dodges everything + sustain', counterplay: 'Bait his W pool (28s CD). All-in when pool is down. Buy anti-heal.' },
  Soraka: { types: ['sustain'], warning: 'Global heal + lane sustain', counterplay: 'Focus Soraka first. Anti-heal. She\'s squishy - burst her down quickly.' },
  Yuumi: { types: ['sustain'], warning: 'Untargetable on ally', counterplay: 'Kill her when she detaches for passive. CC the champion she\'s on.' },

  // ── ADC ──
  Ashe: { types: ['engage', 'poke'], warning: 'Global stun arrow + perma-slow', counterplay: 'Sidestep her R. She has no dash - all-in her when arrow is down. Dodge W poke.' },
  Caitlyn: { types: ['poke', 'zone'], warning: 'Longest auto range ADC + trap zone', counterplay: 'Don\'t step on traps. All-in her inside her auto range. She\'s weak mid-game.' },
  Draven: { types: ['burst'], warning: 'Massive early damage with axes', counterplay: 'Watch where his axes land and trade into him there. He\'s weak if he drops axes.' },
  Ezreal: { types: ['poke'], warning: 'Safe poke ADC with E blink', counterplay: 'He\'s slippery but low DPS. Hard engage beats him. Bait his E before committing.' },
  Jhin: { types: ['poke', 'zone'], warning: 'Root + long range ult', counterplay: 'All-in after his 4th shot (he reloads). He has no escape. Engage on him directly.' },
  Jinx: { types: ['scaling'], warning: 'Reset hypercarry', counterplay: 'Don\'t let her get the first kill in fights. Focus her early, she has no escape.' },
  "Kai'Sa": { types: ['burst', 'dive'], warning: 'Ult dashes into backline', counterplay: 'She needs allies to apply passive stacks. Peel when she ults in - she\'s squishy.' },
  Kalista: { types: ['engage'], warning: 'Ult launches support into you', counterplay: 'Watch for her support being pulled in. She can\'t cancel autos - CC her to stop kiting.' },
  "Kog'Maw": { types: ['scaling', 'poke'], warning: 'Tank shredder with W range', counterplay: 'All-in him. He has zero escapes. Dive him when W is on cooldown (17s early).' },
  Lucian: { types: ['burst'], warning: 'Strong short trades with passive', counterplay: 'He\'s short range. Poke from outside 500 range. He falls off hard late game.' },
  "Miss Fortune": { types: ['poke', 'zone'], warning: 'AoE ult shreds in chokepoints', counterplay: 'Don\'t clump in narrow areas. Interrupt her ult with any CC. She\'s immobile.' },
  Samira: { types: ['burst', 'dive'], warning: 'Windwall + AoE ult resets', counterplay: 'CC her during ult. Don\'t throw single projectiles into her W. Poke her down first.' },
  Sivir: { types: ['poke'], warning: 'Spellshield + waveclear', counterplay: 'Bait her spellshield with a weak ability, then use your important CC. She\'s short range.' },
  Tristana: { types: ['burst', 'dive'], warning: 'W jump all-in + bomb burst', counterplay: 'Respect her level 2/3 all-in. Her W resets on kills - don\'t die to start the chain.' },
  Varus: { types: ['poke', 'cc_chain'], warning: 'Poke + AoE root ult', counterplay: 'Dodge Q poke sideways. Spread out so his R doesn\'t chain to multiple people.' },
  Xayah: { types: ['burst', 'zone'], warning: 'Feather root + untargetable ult', counterplay: 'Don\'t stand between her and her feathers. Track feather positions. Engage after R.' },
  Zeri: { types: ['scaling'], warning: 'Hyperscaling kite machine', counterplay: 'Hard engage and CC her. She\'s squishy. Don\'t let her stack ult MS in extended fights.' },
  Aphelios: { types: ['burst', 'zone'], warning: 'Weapon-dependent threat', counterplay: 'Track his weapons. Infernum (purple) + ult is devastating - spread out. He has no escape.' },
  Nilah: { types: ['dive', 'sustain'], warning: 'Short-range melee ADC with W dodge', counterplay: 'Poke her from range. Her W blocks autos - use abilities. She loses to range advantage hard.' },
  Smolder: { types: ['scaling', 'poke'], warning: 'Infinite stacking Q scaling', counterplay: 'Punish his weak early game. End before 225 stacks. He\'s immobile - all-in him.' },
  Yunara: { types: ['poke', 'zone'], warning: 'Wind-based kiting ADC', counterplay: 'Hard engage her. She\'s squishy and relies on spacing. Close the gap and burst.' },

  // ── Mid ──
  Ahri: { types: ['burst'], warning: 'Charm + triple dash ult', counterplay: 'Dodge charm (E). Without it she can\'t burst. She\'s safe but low kill pressure if behind.' },
  Annie: { types: ['burst', 'engage'], warning: 'Flash Tibbers stun', counterplay: 'Track her passive stun stacks (shown by swirling particles). Respect flash range at stun-ready.' },
  "Aurelion Sol": { types: ['scaling', 'zone'], warning: 'Hyperscaling AoE mage', counterplay: 'All-in him early. He\'s vulnerable to gap closers. Don\'t let him free-farm stacks.' },
  Aurora: { types: ['burst', 'zone'], warning: 'Ult creates inescapable zone', counterplay: 'Flash or dash out of her R immediately. Without ult she has limited engage.' },
  Azir: { types: ['scaling', 'zone'], warning: 'Soldier zone + shuffle engage', counterplay: 'He\'s weak early. All-in before he scales. Dodge sideways from his shuffle combo.' },
  Brand: { types: ['burst', 'zone'], warning: 'AoE burn + bouncing ult', counterplay: 'Spread out so R doesn\'t bounce. Dodge his W circle. All-in him - no escape.' },
  Cassiopeia: { types: ['scaling', 'zone'], warning: 'DPS mage + petrifying ult', counterplay: 'Turn away from her R to avoid stun. She has no boots - gap close or kite at max range.' },
  Corki: { types: ['poke', 'burst'], warning: 'Package roam + mixed damage', counterplay: 'Ping when he has Package (visible on him). He\'s weak without it. Respect his level 6 poke.' },
  Ekko: { types: ['burst', 'dive'], warning: 'Ult rewind resets fights', counterplay: 'Track his ult ghost position. Don\'t chase past it. He\'ll snap back and heal.' },
  Galio: { types: ['engage', 'cc_chain'], warning: 'AoE taunt + global ult', counterplay: 'Don\'t clump for his W taunt. Ping when he hits 6 - he can ult to any skirmish.' },
  Hwei: { types: ['poke', 'zone'], warning: 'Long range multi-ability poke', counterplay: 'Sidestep his abilities. All-in him - he\'s immobile. His kit has long animations to punish.' },
  Lissandra: { types: ['engage', 'cc_chain', 'burst'], warning: 'Point-click ult + AoE lockdown', counterplay: 'She needs to claw (E) in. Punish her if she uses E aggressively. QSS her ult.' },
  Malzahar: { types: ['cc_chain', 'zone'], warning: 'Point-click suppress ult', counterplay: 'Buy QSS. Don\'t stand in his voidlings. Without ult he has weak kill pressure.' },
  Naafiri: { types: ['burst', 'dive'], warning: 'Pack assassin with gap close', counterplay: 'Kill her packmates to reduce her damage. She\'s weaker without full pack. CC her mid-dash.' },
  Neeko: { types: ['engage', 'cc_chain'], warning: 'Disguise + AoE stun ult', counterplay: 'Watch for her running at you (likely ulting). Her clone doesn\'t cast spells. Spread out.' },
  Orianna: { types: ['zone', 'burst'], warning: 'Ball zone control + AoE ult', counterplay: 'Track the ball position at all times. Don\'t clump near it. Punish when ball is far from her.' },
  Qiyana: { types: ['burst'], warning: 'Element burst + terrain stun', counterplay: 'Don\'t fight near walls (her R stuns off walls). She\'s weak if she misses Q.' },
  Ryze: { types: ['scaling', 'burst'], warning: 'Short-range DPS mage + ult portal', counterplay: 'All-in him early. He\'s short range. Watch for his team using R portal to flank.' },
  Syndra: { types: ['burst'], warning: 'Point-click ult burst', counterplay: 'She needs setup (Q spheres on ground). Engage when she has no spheres ready. Build HP.' },
  Sylas: { types: ['burst', 'sustain'], warning: 'Steals your ult', counterplay: 'Track which ult he stole. His own kit is weak without stolen ult. Anti-heal his W.' },
  Taliyah: { types: ['zone', 'burst'], warning: 'Worked ground zone + wall ult', counterplay: 'Sidestep her W knockup. She\'s weaker on worked ground. All-in her if she misses W+E.' },
  "Twisted Fate": { types: ['cc_chain', 'engage'], warning: 'Global ult ganks + point-click stun', counterplay: 'Ping when he hits 6. Ward deep to see his ult channel. His 1v1 is weak - fight him.' },
  Vex: { types: ['burst', 'engage'], warning: 'Anti-dash mage + long range ult', counterplay: 'Don\'t dash near her when passive (fear) is up. She\'s vulnerable when R is down.' },
  Viktor: { types: ['zone', 'burst'], warning: 'Gravity field + laser burst', counterplay: 'Don\'t stand in his W gravity field. Respect his augmented E poke after first back.' },
  Yasuo: { types: ['dive', 'scaling'], warning: 'Windwall + dash through minions', counterplay: 'Fight in open areas with no minions. Bait windwall before using projectile ults. CC him.' },
  Yone: { types: ['dive', 'engage'], warning: 'E spirit form + R knockup', counterplay: 'Track his E snapback position. He returns to it. CC him during E to force bad snaps.' },
  Zoe: { types: ['poke', 'burst'], warning: 'Sleep bubble + one-shot Q', counterplay: 'Stay behind minions to block E bubble. If hit, cleanse/QSS the sleep before Q lands.' },
  Mel: { types: ['burst', 'zone'], warning: 'Light zone control + burst', counterplay: 'Avoid standing in her light zones. She\'s immobile - hard engage her directly.' },

  // ── Top ──
  Ambessa: { types: ['dive', 'burst'], warning: 'Dash-heavy bruiser', counterplay: 'Her dashes are short. Kite her out of range. She\'s weak without energy - punish downtime.' },
  "Cho'Gath": { types: ['cc_chain', 'sustain'], warning: 'Silence + knockup + true damage ult', counterplay: 'Dodge his Q knockup (1s delay). Kite him - he\'s slow. Don\'t get low HP (ult execute).' },
  Darius: { types: ['sustain'], warning: '5-stack passive bleed execute', counterplay: 'Short trades only - never let him 5-stack. Disengage after his E pull. Kite backwards.' },
  Gangplank: { types: ['scaling', 'poke'], warning: 'Barrel one-shot + global ult', counterplay: 'Auto his barrels at 1 HP to defuse them. He\'s weak in melee without barrels. Punish early.' },
  Garen: { types: ['burst', 'sustain'], warning: 'Silence + ult execute', counterplay: 'Kite him. He has no gap close except Q MS. Poke him to prevent passive regen.' },
  Gnar: { types: ['engage', 'poke'], warning: 'Mega Gnar wall stun', counterplay: 'Track his rage bar. Disengage when he\'s about to transform. Don\'t fight near walls in Mega.' },
  Gragas: { types: ['burst', 'engage'], warning: 'Body slam engage + ult displacement', counterplay: 'Respect his E flash combo. His R displaces your team - don\'t clump near objectives.' },
  Gwen: { types: ['sustain', 'scaling'], warning: 'W mist makes her immune to ranged', counterplay: 'Walk into her W mist to hit her or wait it out. Anti-heal her passive. She\'s weak early.' },
  Heimerdinger: { types: ['zone'], warning: 'Turret zone control', counterplay: 'Kill his turrets first (3 autos each). Never fight in his turret setup. Gank him pre-6.' },
  Illaoi: { types: ['sustain', 'zone'], warning: 'Tentacle zone + ult healing', counterplay: 'NEVER fight her inside her ult. Walk away when she Rs. Dodge her E spirit pull.' },
  Kennen: { types: ['engage', 'burst'], warning: 'Flash/E into AoE stun ult', counterplay: 'Spread out in teamfights. Disengage when he pops ult. Poke him in lane - he\'s squishy.' },
  Kled: { types: ['dive', 'engage'], warning: 'Ult charges at you + remount', counterplay: 'Kill Skaarl first, then burst Kled before he remounts. His ult path is telegraphed.' },
  Mordekaiser: { types: ['zone', 'sustain'], warning: 'Death realm isolates one target', counterplay: 'Buy QSS to escape his R. Kite him in Death Realm - he\'s slow. Anti-heal his passive.' },
  Olaf: { types: ['dive', 'sustain'], warning: 'Ult makes him CC-immune', counterplay: 'Kite backwards when he ults - CC won\'t work. Wait out his ult (6s), then engage. Anti-heal.' },
  Ornn: { types: ['engage', 'cc_chain'], warning: 'Ram ult engage + brittle proc', counterplay: 'Dodge his R ram (comes from behind him). Don\'t auto him when you have Brittle debuff.' },
  Pantheon: { types: ['dive', 'burst'], warning: 'Point-click stun + early burst', counterplay: 'He falls off hard after 20 min. Survive his early aggression. He\'s useless late game.' },
  Poppy: { types: ['cc_chain'], warning: 'W blocks all dashes + wall stun', counterplay: 'Don\'t dash near her when W is up. Avoid fighting near walls (E stun). She\'s weak without walls.' },
  Quinn: { types: ['poke', 'burst'], warning: 'Ranged top bully + roam ult', counterplay: 'She\'s squishy. All-in her at level 6 (her R is for roaming, not fighting). Ping her roams.' },
  Renekton: { types: ['burst', 'dive'], warning: 'Early lane bully with empowered W stun', counterplay: 'He falls off late. Survive lane. Trade after he uses empowered W (long CD). Short trades.' },
  Riven: { types: ['burst', 'dive'], warning: 'Animation cancel burst + shield dash', counterplay: 'Trade when her abilities are on CD. She has no sustain - poke her. Respect level 6 all-in.' },
  Rumble: { types: ['zone'], warning: 'Ult zone denies areas', counterplay: 'Don\'t fight in his Equalizer (R). Sidestep it. He overheats if he spams - punish silence state.' },
  Sett: { types: ['engage', 'sustain'], warning: 'W true damage shield', counterplay: 'Dodge the center of his W (true damage). Fight him when W is on CD. Don\'t let him stack Grit.' },
  Shen: { types: ['engage'], warning: 'Global ult shield', counterplay: 'Cancel his ult channel with CC. Ping when he hits 6. Win his lane while he ults away.' },
  Singed: { types: ['zone'], warning: 'Proxy farming + poison trail', counterplay: 'Don\'t chase him. Ever. Let him run into your team. Freeze the wave near your tower.' },
  Sion: { types: ['engage', 'cc_chain'], warning: 'Ult charge + full AD burst or tank', counterplay: 'Dodge his R by sidestepping. His Q is telegraphed - interrupt it with CC. Kite his passive.' },
  Teemo: { types: ['poke', 'zone'], warning: 'Blind + mushroom map control', counterplay: 'Buy sweeper lens for mushrooms. All-in him - he\'s squishy. Don\'t auto during blind.' },
  Trundle: { types: ['sustain', 'splitpush'], warning: 'Ult steals tank stats', counterplay: 'Don\'t let him ult your tank. His pillar blocks paths - flash over it. He\'s kitable.' },
  Urgot: { types: ['sustain', 'burst'], warning: 'Execute ult below 25% HP', counterplay: 'Stay above 25% HP to avoid R execute. Kite him - he\'s slow. His shotgun knees have per-leg CD.' },
  Volibear: { types: ['dive', 'sustain'], warning: 'Tower-disabling ult dive', counterplay: 'Back off tower when he ults (disables it). Anti-heal his passive. Kite him after initial burst.' },
  Warwick: { types: ['dive', 'sustain'], warning: 'Blood hunt chases low HP targets', counterplay: 'Don\'t get low - his W gives MS toward wounded. Anti-heal hard. CC him during R channel.' },
  Wukong: { types: ['engage', 'burst'], warning: 'Clone + double knockup ult', counterplay: 'Track his clone (it stands still). Spread out for his R. He\'s squishy if behind.' },
  "K'Sante": { types: ['dive', 'cc_chain'], warning: 'Ult pushes you behind him', counterplay: 'Respect his R (drags you through walls). He\'s tanky in base form, squishy in ult form - burst him then.' },

  // ── Jungle ──
  "Bel'Veth": { types: ['scaling', 'dive'], warning: 'Infinite stacking attack speed', counterplay: 'End early. She\'s weak before first Rift Herald/Baron form. CC her in fights - she\'s squishy.' },
  Briar: { types: ['dive', 'burst'], warning: 'Frenzy all-in + global ult', counterplay: 'CC her during frenzy (she can\'t stop). She has no escape when E is used. Anti-heal her.' },
  Elise: { types: ['dive', 'burst'], warning: 'Early game tower dive queen', counterplay: 'She falls off hard late. Survive her early ganks. She becomes spider to dodge with rappel.' },
  Fiddlesticks: { types: ['engage', 'zone'], warning: 'Surprise channel ult from fog', counterplay: 'Ward flanks and bushes near objectives. His ult needs fog of war. Interrupt drain with CC.' },
  Graves: { types: ['burst'], warning: 'Burst + smoke screen blind', counterplay: 'Walk out of his smoke screen. His autos push him back - chase him into walls. He\'s short range.' },
  Ivern: { types: ['zone', 'cc_chain'], warning: 'Daisy knockup + bush control', counterplay: 'Kill Daisy first. He\'s a support jungler - invade him early. He can\'t 1v1.' },
  "Jarvan IV": { types: ['engage', 'dive'], warning: 'Flag+drag combo + ult cage', counterplay: 'Flash or dash out of his R arena. Sidestep E+Q combo. He\'s predictable.' },
  Karthus: { types: ['scaling', 'poke'], warning: 'Global ult + death passive damage', counterplay: 'Build Zhonya/health to survive his R. Walk away from his passive - he\'s still casting.' },
  Kayn: { types: ['dive'], warning: 'Walks through walls (both forms)', counterplay: 'Blue Kayn: group up, he can\'t one-shot through peel. Red Kayn: anti-heal, don\'t let him drain.' },
  "Kha'Zix": { types: ['burst', 'stealth'], warning: 'Isolation burst + evolved stealth', counterplay: 'Stay near teammates - his Q does double damage to isolated targets. Pink ward for evolved R.' },
  Kindred: { types: ['scaling'], warning: 'Ult prevents all deaths in area', counterplay: 'Walk out of her R circle if you\'re the one about to die. Contest her passive marks on camps.' },
  "Lee Sin": { types: ['dive', 'engage'], warning: 'Q kick insec combo', counterplay: 'Dodge his Q (he needs it to gap close). Ward behind you so he can\'t ward-hop kick.' },
  Lillia: { types: ['scaling', 'zone'], warning: 'Speed ramping + sleep ult', counterplay: 'Don\'t get hit by her abilities before she ults (each applies sleep mark). CC her - she\'s squishy.' },
  "Master Yi": { types: ['scaling', 'dive'], warning: 'Untargetable Q + reset machine', counterplay: 'Save hard CC specifically for him. Point-click CC is best. Burst him during Q cooldown.' },
  Nidalee: { types: ['poke'], warning: 'Spear poke + early invades', counterplay: 'Stay behind minions for spear. She falls off hard late. She can\'t gank well without hitting spear.' },
  Nocturne: { types: ['dive', 'engage'], warning: 'Paranoia (darkness) + dash ult', counterplay: 'Group when his ult is up. Stay near turret. Spell shield only blocks one ability - use a junk spell first.' },
  "Nunu & Willump": { types: ['engage', 'zone'], warning: 'Snowball gank + objective secure', counterplay: 'Ward river to see snowball coming. His ult has massive AoE - walk out or interrupt it.' },
  Rammus: { types: ['engage', 'cc_chain'], warning: 'Powerball taunt locks you down', counterplay: 'Don\'t auto him with W up (thornmail passive). Interrupt his Q roll. He can\'t kill you without you autoing.' },
  "Rek'Sai": { types: ['dive', 'burst'], warning: 'Tunnel ganks + true damage ult', counterplay: 'Destroy her tunnels when you see them. She\'s predictable from underground (tremor sense shows her).' },
  Sejuani: { types: ['engage', 'cc_chain'], warning: 'Multi-CC tank engage', counterplay: 'Spread so her R doesn\'t hit multiple people. She\'s slow without engage. Poke comp beats her.' },
  Shyvana: { types: ['dive', 'burst'], warning: 'Dragon form burst', counterplay: 'Dodge her E fireball in dragon form (it\'s her main damage). She\'s weak in human form pre-6.' },
  Skarner: { types: ['engage', 'cc_chain'], warning: 'Suppress ult drags target', counterplay: 'QSS his ult. Don\'t let him flash R your carry. Kite him - he needs to get in melee range.' },
  Udyr: { types: ['dive', 'sustain'], warning: 'Fast bear stance stun + tanky', counterplay: 'Kite him. He has no gap close besides running at you. Slow him and create distance.' },
  Viego: { types: ['dive', 'stealth'], warning: 'Possesses dead champions + resets', counterplay: 'Don\'t die near him (he possesses you). Burst him in teamfights. Anti-heal his Q passive.' },
  "Xin Zhao": { types: ['dive', 'engage'], warning: 'Early duelist + ult blocks ranged', counterplay: 'His R blocks damage from outside the circle. Walk into his R or wait it out. He falls off late.' },
  Zac: { types: ['engage', 'cc_chain'], warning: 'Long-range slingshot engage', counterplay: 'Ward deep to see him charging E. Interrupt his E slingshot. Kill his blobs so he can\'t revive.' },

  // ── Support ──
  Alistar: { types: ['engage', 'cc_chain'], warning: 'Headbutt-pulverize combo', counterplay: 'Stay behind minions. His combo is short range. Punish hard when W+Q is on cooldown (17s).' },
  Bard: { types: ['engage', 'zone'], warning: 'Magical journey flanks + ult stasis', counterplay: 'Watch for him roaming through portals. His ult freezes everyone - it can hit his own team too.' },
  Braum: { types: ['engage', 'cc_chain'], warning: 'Shield wall + passive stun', counterplay: 'Don\'t auto him/his allies 4 times quickly (applies stun). Play around his E shield cooldown.' },
  Janna: { types: ['zone'], warning: 'Disengage queen + tornado', counterplay: 'She counters engage. Poke comp beats her. Bait her tornado before engaging. Her R heals team.' },
  Karma: { types: ['poke'], warning: 'Empowered Q poke + shield speed', counterplay: 'Dodge her R+Q (wide AoE). She\'s strong early but falls off. Engage on her - she\'s squishy.' },
  Lulu: { types: ['zone', 'cc_chain'], warning: 'Polymorph + ult peel', counterplay: 'Bait her polymorph before diving. Her ult gives HP + knockup. She can\'t be dove easily.' },
  Milio: { types: ['sustain', 'zone'], warning: 'Range buff + cleansing ult', counterplay: 'His R cleanses all CC from allies. Bait it before using important CC. He\'s immobile - engage him.' },
  Morgana: { types: ['cc_chain', 'zone'], warning: 'Q root (3s!) + spell shield', counterplay: 'Dodge her Q - it\'s a 3 second root. Her E blocks one spell - pop it with a junk ability first.' },
  Nami: { types: ['sustain', 'engage'], warning: 'Bubble CC + ult wave engage', counterplay: 'Sidestep her Q bubble (small AoE). Dodge her R wave. She\'s squishy - all-in her.' },
  "Renata Glasc": { types: ['cc_chain', 'zone'], warning: 'Berserk ult + bailout revive', counterplay: 'Dodge her R (makes your team attack each other). Kill targets with her W buff twice to prevent revive.' },
  Senna: { types: ['scaling', 'poke'], warning: 'Infinite range scaling + global ult', counterplay: 'She\'s squishy and immobile. Hard engage her. Don\'t let her auto you for free souls.' },
  Seraphine: { types: ['poke', 'cc_chain'], warning: 'Extended range ult through allies', counterplay: 'Don\'t stand behind her allies (ult extends through champions). Engage on her - she\'s immobile.' },
  Sona: { types: ['scaling', 'sustain'], warning: 'AoE stun ult + scaling auras', counterplay: 'All-in her early (she\'s the squishiest champion). She can\'t handle burst. Kill her before late game.' },
  Swain: { types: ['sustain', 'engage'], warning: 'Pull + drain ult sustain', counterplay: 'Anti-heal his R drain. Kite out of his ult range. Focus him to pop him out of drain.' },
  "Tahm Kench": { types: ['engage', 'sustain'], warning: 'Devour saves allies + tanky', counterplay: 'He eats his ally to save them. Wait out his W, then re-engage. Poke him - he\'s immobile.' },
  Taric: { types: ['sustain', 'engage'], warning: 'Invulnerability ult on team', counterplay: 'His R has a 2.5s delay. Disengage when you see it charging, then re-engage after it expires.' },
  Zilean: { types: ['scaling', 'zone'], warning: 'Revive ult + double bomb stun', counterplay: 'Track his R cooldown. Burst the target with Zilean ult, then kill again. Dodge double bombs.' },
  Zyra: { types: ['zone', 'poke'], warning: 'Plant zone control + root', counterplay: 'Kill her plants (one auto each). Dodge her E root. All-in her - she\'s squishy with no escape.' },

  // ── Additional champions ──
  Anivia: { types: ['zone', 'scaling'], warning: 'Wall + ult zone denial + egg passive', counterplay: 'Kill the egg (she revives). She\'s immobile - all-in her. Bait her wall before fighting in jungle.' },
  Maokai: { types: ['engage', 'cc_chain'], warning: 'Root + saplings + ult wave', counterplay: 'Don\'t walk into bush saplings. His R wave is slow - sidestep it. He\'s tanky but low damage.' },
};

let tipCounter = 0;

function createThreatTip(message: string, priority: 'info' | 'warning' | 'danger'): CoachingTip {
  tipCounter++;
  return {
    id: `threat-${Date.now()}-${tipCounter}`,
    message,
    priority,
    category: 'positioning',
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ── Get threat info for a champion ──

export function getChampionThreat(championName: string): ChampionThreat | null {
  return CHAMPION_THREATS[championName] ?? null;
}

// ── Generate threat warnings for the current game ──

const recentThreatTips = new Map<string, number>(); // champion → last tip time

export function generateThreatWarnings(
  enemies: PlayerInfo[],
  gameTime: number
): CoachingTip[] {
  const tips: CoachingTip[] = [];
  const now = Date.now();

  // Only generate threat tips in early/mid game and not too often
  if (gameTime < 60 || gameTime > 1800) return tips;

  for (const enemy of enemies) {
    if (enemy.isDead) continue;

    const threat = CHAMPION_THREATS[enemy.championName];
    if (!threat) continue;

    // Cooldown: don't repeat same champion warning within 3 minutes
    const lastTip = recentThreatTips.get(enemy.championName);
    if (lastTip && now - lastTip < 180000) continue;

    // Only warn about fed or relevant enemies
    const isFed = enemy.scores.kills >= 3 || (enemy.scores.kills - enemy.scores.deaths >= 2);
    const isHighThreat = threat.types.includes('burst') || threat.types.includes('hook') || threat.types.includes('engage');

    if (isFed || (isHighThreat && gameTime < 600)) {
      const priority = isFed ? 'warning' as const : 'info' as const;
      const tip = createThreatTip(
        `${enemy.championName} (${threat.warning}): ${threat.counterplay}`,
        priority
      );
      tips.push(tip);
      recentThreatTips.set(enemy.championName, now);
      break; // Only one threat tip per cycle
    }
  }

  return tips;
}

// ── Matchup-specific fight context ──

export function getMatchupFightContext(
  myChampion: string,
  enemyChampion: string
): string | null {
  const myMeta = getChampionMeta(myChampion);
  const enemyMeta = getChampionMeta(enemyChampion);
  if (!myMeta || !enemyMeta) return null;

  const myIsRanged = myMeta.archetypes.some((a) => a === 'marksman' || a === 'artillery' || a === 'mage');
  const enemyIsRanged = enemyMeta.archetypes.some((a) => a === 'marksman' || a === 'artillery' || a === 'mage');
  const enemyIsTank = enemyMeta.archetypes.some((a) => a === 'tank' || a === 'juggernaut');
  const enemyIsAssassin = enemyMeta.archetypes.some((a) => a === 'assassin');
  const myIsAssassin = myMeta.archetypes.some((a) => a === 'assassin');

  // Ranged vs Melee
  if (myIsRanged && !enemyIsRanged) {
    return `You outrange ${enemyChampion}. Kite backwards and auto between their cooldowns. Never let them get on top of you.`;
  }

  // Melee vs Ranged
  if (!myIsRanged && enemyIsRanged) {
    return `${enemyChampion} outranges you. Use bushes to drop aggro. Look for an all-in when they waste a key ability.`;
  }

  // Assassin vs Tank
  if (myIsAssassin && enemyIsTank) {
    return `${enemyChampion} is too tanky to burst. Don't waste combo on them. Roam and find squishier targets.`;
  }

  // ADC vs Assassin
  if (myIsRanged && enemyIsAssassin) {
    return `${enemyChampion} wants to one-shot you. Position with your team. Save flash for their engage.`;
  }

  return null;
}

export function resetThreatModel(): void {
  recentThreatTips.clear();
  tipCounter = 0;
}
