export interface ChampionCoaching {
  combos: string[];
  tradingPatterns: string[];
  earlyGame: string;
  midGame: string;
  lateGame: string;
  commonMistakes: string[];
  powerSpikeReminders: string[];
}

export const jungleChampions: Record<string, ChampionCoaching> = {
  Amumu: {
    combos: [
      "Q (Bandage Toss) into auto > W toggle > E for burst gank; save second Q charge for flash or dash escapes.",
      "Flash > R (Curse of the Sad Mummy) onto grouped enemies, then Q the carry trying to flee for a lockdown chain.",
      "Q to a minion near the enemy laner to close distance, then R for an unexpected engage angle."
    ],
    tradingPatterns: [
      "Full clear starting blue side (Blue > Gromp > Wolves > Raptors > Red > Krugs) for a healthy level 4 with both buffs; your W sustain keeps you topped off.",
      "Three-camp into gank (Red > Krugs > Raptors > gank mid) works when mid is pushed up since Amumu's Q is near-guaranteed on immobile mids.",
      "Keep W toggled on during every camp and spam E off cooldown; E cooldown reduces with every hit you take, so tanking camps actually speeds your clear."
    ],
    earlyGame: "Focus on a full clear to level 4 since your pre-6 ganks are Q-dependent and risky; only force early ganks if lanes have reliable CC to chain with yours.",
    midGame: "Look for multi-man R engages around dragon and herald fights; your teamfight presence is your primary win condition so always be near objectives 30 seconds early.",
    lateGame: "Peel for your carries with Q and R if the enemy has divers, or flash-R the backline if your team has follow-up; one good ultimate wins the game.",
    commonMistakes: [
      "Wasting both Q charges aggressively and having no escape or follow-up CC when the gank fails.",
      "Forcing pre-6 ganks repeatedly instead of farming to your massive level 6 power spike.",
      "Building full AP when behind instead of transitioning to tank items that let you survive long enough to land R."
    ],
    powerSpikeReminders: [
      "Level 6 is your biggest spike; Curse of the Sad Mummy turns any 2v2 or teamfight in your favor.",
      "Jak'Sho or Sunfire completion makes you nearly unkillable in extended skirmishes while your W shreds.",
      "Demonic Embrace (if building AP) combined with W creates massive %HP burn in teamfights."
    ]
  },

  "Bel'Veth": {
    combos: [
      "E (Royal Maelstrom) during the enemy's burst to reduce damage and lifesteal, then Q (Void Surge) through them for the chase.",
      "W (Above and Below) knockup into auto-attack reset chain using Q dashes in each cardinal direction for maximum DPS.",
      "After killing Rift Herald or Baron (or any void-empowered camp), use your True Form to push aggressively with the void coral summon."
    ],
    tradingPatterns: [
      "Full clear is mandatory; start Red > Krugs > Raptors > Wolves > Blue > Gromp, using Q dashes to kite camps and reset autos efficiently.",
      "Save one Q dash direction for repositioning during clears; burning all four dashes on one camp leaves you slow-moving to the next.",
      "After 6, always take Rift Herald for True Form transformation; the voidling push pressure is worth more than a gank in most cases."
    ],
    earlyGame: "Power farm to 6 as fast as possible since your pre-6 ganks are weak without True Form; only skirmish if the enemy jungler invades you and you have lane priority.",
    midGame: "Secure Rift Herald and Baron to activate True Form and split-push with void minions; you scale incredibly hard with attack speed items so keep farming between plays.",
    lateGame: "In teamfights, wait for key cooldowns to be used before diving in with E; your sustained DPS with stacked passive makes you a hypercarry if you avoid getting bursted.",
    commonMistakes: [
      "Forcing ganks pre-6 when you should be full-clearing to hit your True Form power spike.",
      "Using E too early in a fight instead of saving it to tank burst abilities and lifesteal through them.",
      "Ignoring Rift Herald and Baron; these objectives are core to Bel'Veth's identity and True Form value."
    ],
    powerSpikeReminders: [
      "Level 6 with True Form from a void camp kill is your first major spike; the extra stats and range are massive.",
      "Blade of the Ruined King completion gives you the on-hit synergy your kit craves and makes dueling almost unbeatable.",
      "Each epic monster kill permanently enhances your True Form, so prioritize every dragon and Baron."
    ]
  },

  Briar: {
    combos: [
      "W (Blood Frenzy) to enter frenzy, Q (Head Rush) to stun and close distance, then let W auto-attacks shred the target.",
      "R (Certain Death) long-range to engage from fog of war, immediately Q the priority target to lock them down while your team follows.",
      "E (Chilling Scream) charge to interrupt dashes or knock back, then W > Q to re-engage on your terms."
    ],
    tradingPatterns: [
      "Start Red > Raptors > Wolves > Blue > Gromp for a fast 5-camp clear; W sustain keeps you healthy and your clear speed is excellent.",
      "Use W on every camp and let it auto-attack; Briar's frenzy clears camps extremely fast but make sure to E or wait out W before walking to the next camp.",
      "Gank early and often after your first clear; Briar's W > Q combo is one of the strongest level 3 ganks in the game."
    ],
    earlyGame: "Look for aggressive ganks after your first clear since your W frenzy damage is absurd early; prioritize lanes with CC to chain with your Q stun.",
    midGame: "Use R to pick off isolated targets from fog of war before objectives; Briar excels at creating number advantages before dragon or herald fights.",
    lateGame: "Your R engage is game-winning but also risky; only ult into grouped enemies if your team can follow up immediately, otherwise pick flanks on isolated carries.",
    commonMistakes: [
      "Activating W in a bad position and being unable to stop auto-attacking, running into the enemy team uncontrollably.",
      "Forgetting to charge E to cancel W frenzy when you need to disengage; E is your only self-peel.",
      "Using R carelessly into a full enemy team with no follow-up, getting CC-chained and killed instantly."
    ],
    powerSpikeReminders: [
      "Level 3 with W > Q is an incredibly strong gank combo; abuse this early before enemies respect it.",
      "Level 6 R gives you cross-map engage and pick potential; start looking for long-range snipes through fog.",
      "Blade of the Ruined King synergizes perfectly with your W attack speed steroid for massive sustained damage."
    ]
  },

  Diana: {
    combos: [
      "Q (Crescent Strike) to apply Moonlight, then E (Lunar Rush) for the reset, auto > W (Pale Cascade) > auto for passive proc burst.",
      "Flash > R (Moonfall) onto grouped enemies to pull them in, then Q > E the clumped targets for massive AoE damage.",
      "In ganks, E to a minion with Moonlight, walk up and Q the laner, then E again for the gap close with reset."
    ],
    tradingPatterns: [
      "Full clear starting Blue > Gromp > Wolves > Raptors > Red > Krugs; W shield and passive cleave make your clear both healthy and fast.",
      "Diana is one of the fastest full-clearers in the game; always full clear to 4 before looking for plays unless a free gank appears.",
      "Use your passive's cleave on multi-monster camps (Raptors, Krugs, Wolves) by positioning to hit all units with the third auto."
    ],
    earlyGame: "Full clear to level 4 as fast as possible (sub 3:15 is the goal) then look for a gank or scuttle contest with your strong dueling from W shield and passive.",
    midGame: "Post-6, look for 5-man R engages around objectives; a good Moonfall into a clumped team wins fights single-handedly with your AoE burst.",
    lateGame: "Play as a flanking assassin-bruiser; Flash > R onto the backline when the enemy groups, and Zhonya's immediately after dumping your combo to survive the counterattack.",
    commonMistakes: [
      "E-ing to a target without landing Q first, wasting the reset and leaving you stranded with no gap closer.",
      "Using R on only one target; Diana's R scales with the number of enemies pulled, so always look for multi-man ults.",
      "Skipping Zhonya's Hourglass; without it, Diana cannot survive after diving into the enemy team with R."
    ],
    powerSpikeReminders: [
      "Level 4 after full clear is when you become a threat; your passive, Q, and W together outduel most junglers.",
      "Level 6 Moonfall makes you a teamfight monster; force plays around dragon immediately after hitting 6.",
      "Nashor's Tooth completion gives you incredible clear speed and sustained damage that synergizes with your passive."
    ]
  },

  Ekko: {
    combos: [
      "E (Phase Dive) onto the target, auto (passive proc with Q return), Q (Timewinder) through them so the return hit also lands for the 3-hit passive proc and burst.",
      "W (Parallel Convergence) predictively on the enemy's escape path, then E > Q through them as the W stun lands for a guaranteed combo.",
      "In teamfights, place W on the fight zone, dive in with E > Q, burst the carry, then R (Chronobreak) back to safety for massive AoE damage and healing."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Q through the camp, kite back so the return hit lands, and use your passive move speed to reposition.",
      "Three-camp into gank (Red > Raptors > Krugs or Blue > Gromp > Wolves > gank) works well because Ekko's E gap close and passive slow make ganks strong at level 3.",
      "Always throw Q through the max number of monsters and kite back; the return damage is where most of your clear damage comes from."
    ],
    earlyGame: "Choose between a full clear for level 4 or a three-camp gank depending on lane states; your E gap close makes ganks viable early, but you scale well with farm too.",
    midGame: "Flank from fog of war with E onto carries; your W zoning and R safety net let you make aggressive plays that other assassins cannot.",
    lateGame: "Look for picks with W prediction into E engage; in teamfights, always track your R shadow position so you can deal damage and Chronobreak out safely.",
    commonMistakes: [
      "Placing W directly on top of the enemy instead of predicting where they will be in 2.5 seconds; it has a long delay.",
      "Using R purely for damage instead of saving it as a safety net; sometimes surviving is more valuable than the ult damage.",
      "Not tracking your ghost trail position, leading to R-ing into a worse position or into the enemy team."
    ],
    powerSpikeReminders: [
      "Level 3 with E gives you strong gank potential; the blink + auto is hard to react to and procs passive with Q.",
      "Hextech Rocketbelt completion gives you an extra gap closer that makes E > Rocketbelt > auto > Q combo nearly unavoidable.",
      "Rabadon's Deathcap as a second or third item pushes your burst to one-shot thresholds on squishies."
    ]
  },

  Elise: {
    combos: [
      "Human Q (Neurotoxin) > W (Volatile Spiderling) > E (Cocoon) stun, then Spider R > Spider Q (Venomous Bite) > Spider W (Skittering Frenzy) for full burst.",
      "E (Cocoon) from fog of war first for the guaranteed stun, then human Q > W, swap to spider, Q > W to finish.",
      "Tower dive with Cocoon stun, dump full combo, then spider E (Rappel) to drop tower aggro and walk out safely."
    ],
    tradingPatterns: [
      "Three-camp clear (Red > Krugs > Raptors or Blue > Gromp > Wolves) into an early gank; Elise is one of the strongest level 3 gankers in the game.",
      "Use spiderlings to tank camps; start in human form for Q > W, swap to spider and let spiderlings take aggro to stay healthy.",
      "Spider E (Rappel) can be used to dodge camp damage or drop aggro temporarily; use it on Gromp or Red if getting low."
    ],
    earlyGame: "Gank, gank, gank; Elise's entire identity is early game pressure with Cocoon ganks, so be on the map constantly and create leads for your laners before you fall off.",
    midGame: "Transition your early leads into objective control; use your tower dive threat to crack plates and rotate to dragon or herald with numbers advantage.",
    lateGame: "Elise falls off hard late; look for Cocoon picks from fog of war on isolated targets and focus on peeling with Cocoon if teamfighting.",
    commonMistakes: [
      "Full-clearing and farming instead of ganking early; Elise's power budget is entirely in her early game and she falls off hard if she doesn't generate leads.",
      "Missing Cocoon and still committing to the gank; without the stun, your damage isn't enough and you'll take a bad trade.",
      "Building too much AP instead of transitioning to utility/tank items mid-game when your burst becomes less relevant."
    ],
    powerSpikeReminders: [
      "Level 3 is your biggest power spike; Cocoon into full Human > Spider rotation deals absurd damage and most laners cannot survive it.",
      "Sorcerer's Shoes early amplify your magic penetration and make your base damages hit like a truck before enemies build MR.",
      "Night Harvester or Shadowflame as first item lets you one-shot squishies through the mid game before falling off."
    ]
  },

  Evelynn: {
    combos: [
      "Charm (W) mark the target, wait for it to fully cook, then Q (Hate Spike) first hit > E (Whiplash) > Q spam > R (Last Caress) to execute.",
      "For quick burst without charm cook time: E > Q > Q spam > R to execute; skip W entirely if the target is already low.",
      "Flank from behind with Demon Shade (passive stealth), W the carry, walk up with empowered E for the charm proc, Q spam, R out through the team for AoE execute damage."
    ],
    tradingPatterns: [
      "Full clear is mandatory; Blue > Gromp > Wolves > Raptors > Red > Krugs, using Q to kite and E to burst down single-target camps.",
      "Pre-6 you have no stealth, so avoid risky ganks; just power farm both sides of the jungle and track the enemy jungler to avoid invades.",
      "After level 6, start every gank from stealth; walk behind the enemy laner so they can't see you, W mark them, and wait for the charm to cook before engaging."
    ],
    earlyGame: "Full clear and avoid the enemy jungler at all costs; you are extremely weak pre-6 and any invade or skirmish will likely result in your death.",
    midGame: "With Demon Shade stealth, roam behind enemy lanes and pick off isolated targets; force the enemy to buy Control Wards, wasting their gold on vision.",
    lateGame: "Flank from stealth in teamfights, one-shot the enemy carry with charm-empowered combo, and R out; if you can't reach the carry, look for picks before the fight starts.",
    commonMistakes: [
      "Forcing ganks before level 6 when you have no stealth; pre-6 Evelynn ganks are telegraphed and easily avoided.",
      "Not waiting for W charm to fully cook before engaging; the difference between a slow and a charm is massive.",
      "Using R for damage instead of as an escape; Last Caress is your only way out after diving in, so always save it unless the kill is 100% guaranteed."
    ],
    powerSpikeReminders: [
      "Level 6 with Demon Shade stealth is your transformation into a real champion; the game fundamentally changes for your enemies.",
      "Hextech Rocketbelt gives you a gap closer from stealth that makes charm engagement almost unavoidable.",
      "Rabadon's Deathcap multiplies your already-high AP ratios into true one-shot territory against any squishy."
    ]
  },

  Fiddlesticks: {
    combos: [
      "Channel R (Crowstorm) from fog of war over a wall into the enemy team, then W (Bountiful Harvest) drain immediately for massive AoE damage plus healing.",
      "Q (Terrify) the highest-priority target after landing Crowstorm to fear them into your team, then E (Reap) for the silence on grouped enemies.",
      "Use effigies (passive) to trick enemies into thinking you're somewhere else, then Crowstorm from the opposite angle for an unexpected flank."
    ],
    tradingPatterns: [
      "Full clear starting Raptors with W (stand in center of camp) > Red with W > Krugs with W > Wolves with W > Blue with W > Gromp; Fiddle is one of the fastest full-clearers due to W AoE drain.",
      "Always stand in the center of multi-monster camps so W hits all units; this is the key to fast and healthy clears.",
      "Place effigies in river bushes to ward and mimic your appearance; enemies will waste abilities on them and reveal their position."
    ],
    earlyGame: "Full clear both sides as fast as possible; your pre-6 ganks are terrible without Crowstorm, so focus on farming and deep warding to track the enemy jungler.",
    midGame: "Set up Crowstorm flanks from fog of war at every objective fight; your R over a wall into a grouped team is the most impactful engage in the game.",
    lateGame: "Stay patient and look for the perfect Crowstorm angle; one 5-man ult wins the game, but a bad ult means you die instantly with no impact.",
    commonMistakes: [
      "Crowstorming from a visible position where enemies can see the channel and simply walk away or interrupt it.",
      "Canceling W drain early on camps; the final tick does the most healing and damage, so always let it finish.",
      "Not using effigies strategically; passive effigies are free wards and can bait enemy cooldowns."
    ],
    powerSpikeReminders: [
      "Level 6 Crowstorm is a game-changing spike; immediately look for a Crowstorm gank on a pushed-up lane.",
      "Zhonya's Hourglass is your most important item; Crowstorm in, W drain, then Zhonya's to survive while your damage ticks.",
      "Completing Hextech Rocketbelt gives you extra repositioning after Crowstorm lands to chase or stick to fleeing targets."
    ]
  },

  Graves: {
    combos: [
      "Auto > E (Quickdraw) to reload instantly > auto > Q (End of the Line) for a fast burst trade in close range.",
      "Q into a wall for instant detonation (double damage), then auto > E > auto for maximum close-range burst.",
      "W (Smoke Screen) the enemy carry to blind them, then kite forward with E > auto resets to shred them while they can't target you."
    ],
    tradingPatterns: [
      "Full clear is Graves' bread and butter; Red > Krugs > Raptors > Wolves > Blue > Gromp, using E to kite and auto-attack pushback to keep camps at max range for armor stacking.",
      "Kite camps away from their leash range slightly so your shotgun pellets all hit a single target; Graves deals more damage at point-blank range.",
      "Stack E armor passive by attacking camps repeatedly; going into a skirmish with 6-8 stacks of True Grit makes you deceptively tanky."
    ],
    earlyGame: "Full clear both sides and invade the enemy jungler at their second buff if you have lane priority; Graves wins almost every 1v1 early with his burst and E armor.",
    midGame: "Farm aggressively and look for invades; Graves with a gold lead is a carry jungler who can 1v1 anyone and take over the enemy jungle.",
    lateGame: "Play as a backline DPS carry using E repositioning and W to zone enemies; you deal ADC-level damage while being significantly tankier with True Grit stacks.",
    commonMistakes: [
      "Not auto-attacking between abilities to stack True Grit (E passive armor); the armor stacks are a huge part of your survivability.",
      "Using Q in open space instead of against walls; Q detonates instantly on wall contact for double damage.",
      "Forcing ganks on lanes with minion waves blocking your shotgun pellets; Graves' autos are blocked by units, so gank from angles where minions aren't in the way."
    ],
    powerSpikeReminders: [
      "Level 4 after full clear with stacked True Grit makes you one of the strongest duelists in the jungle.",
      "Eclipse completion gives you omnivamp, shield, and armor penetration that synergizes perfectly with your bruiser playstyle.",
      "Collector or Lord Dominik's as second item pushes your damage to carry levels while E keeps you tanky enough to front-to-back fight."
    ]
  },

  Hecarim: {
    combos: [
      "Ghost > E (Devastating Charge) to build up speed, slam into the enemy to knock them back toward your team, then Q (Rampage) spam while staying on top of them.",
      "R (Onslaught of Shadows) through the enemy team to fear them toward your towers/team, then E the carry and Q spam in the middle of the fight.",
      "Flash > E knockback at max charge to send the enemy in your desired direction; this is key for displacing carries into your team."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; spam Q on every camp to keep the rampage stack rolling for reduced cooldown.",
      "Hecarim can gank at level 4 extremely well with E movespeed; look for lanes that are pushed up after your first full clear.",
      "Keep Q stacks up between camps by using it while running; even hitting nothing maintains the reduced cooldown for faster clears."
    ],
    earlyGame: "Full clear into a Ghost-powered E gank on the most gankable lane; your movement speed from E plus Ghost makes you near-impossible to escape without flash.",
    midGame: "Force fights with Ghost + E + R engages; Hecarim is one of the best teamfight junglers in the game and thrives in chaotic mid-game skirmishes around objectives.",
    lateGame: "Use R to engage teamfights and fear the backline, then Q spam on top of grouped enemies; Hecarim's AoE damage in extended fights is devastating.",
    commonMistakes: [
      "Not using Ghost aggressively; Ghost is a huge part of your power budget and should be used for almost every gank and teamfight.",
      "E-ing too early before building up enough movespeed for the knockback; wait until E is fully charged for maximum displacement.",
      "Using R as a gap closer instead of for the fear displacement; the fear direction matters more than the damage."
    ],
    powerSpikeReminders: [
      "Level 4 with Ghost + E is your first gank timing; the movespeed makes you faster than almost any champion can escape.",
      "Sheen purchase on first back massively increases your Q spam damage; rush Trinity Force or Iceborn Gauntlet.",
      "Trinity Force completion is a massive spike; the Spellblade proc on every Q makes your sustained damage in fights incredible."
    ]
  },

  Ivern: {
    combos: [
      "Q (Rootcaller) the target, then your laner can dash to the rooted enemy by right-clicking them; follow up with E (Triggerseed) shield + slow.",
      "Place W (Brushmaker) brush during fights to gain ranged auto-attack bonus, then Q root > E shield bomb for peel or engage.",
      "R (Daisy!) > command Daisy onto a target, her 3rd hit knocks up; use Q and E to keep enemies in Daisy's range."
    ],
    tradingPatterns: [
      "Mark both buffs at level 1, then mark the camp next to each buff; Ivern doesn't kill camps but instead marks them and collects after a timer, so plan your pathing around timers.",
      "Start by marking Red > Raptors > run to Blue side > mark Blue > Wolves > Gromp; smite one buff to collect immediately and return for the other side when timers finish.",
      "Counter-jungle is free for Ivern; walk into the enemy jungle and mark their camps to steal them, since you don't take damage and clear instantly once the timer resolves."
    ],
    earlyGame: "Mark camps on both sides of your jungle and look for early ganks while waiting for camp timers to resolve; your Q root sets up ganks excellently even at level 2.",
    midGame: "Focus on shielding your carries with E and using Q to set up picks; Ivern is a support jungler, so play to enable your team rather than carry yourself.",
    lateGame: "Peel for your carries with E shields, Q roots, and Daisy; position like a support in teamfights and keep your highest-damage teammate alive.",
    commonMistakes: [
      "Trying to fight the enemy jungler 1v1; Ivern is a support and loses almost every direct duel.",
      "Forgetting to share buffs with laners; Ivern's passive creates buff copies for allies, and giving Red to your ADC and Blue to your mid is a massive team advantage.",
      "Not using Brushmaker (W) in fights for the ranged auto-attack empowerment and for breaking enemy vision."
    ],
    powerSpikeReminders: [
      "Level 5 buff sharing is a unique advantage; deliver Red and Blue to your carries to boost their power while maintaining your own clear.",
      "Moonstone Renewer completion turns you into a healing machine in extended fights through E shield spam.",
      "Redemption second item gives you massive teamfight utility with the active heal plus your shields."
    ]
  },

  "Jarvan IV": {
    combos: [
      "E (Demacian Standard) > Q (Dragon Strike) combo through the flag for the knockup engage, then auto > W (Golden Aegis) slow to stick to the target.",
      "E > Q knockup > R (Cataclysm) to trap the enemy in your arena immediately after knocking them up, preventing any escape.",
      "Flash > E > Q for an extended-range knockup engage that is nearly impossible to react to; use this to catch backline carries."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use E for attack speed on single-target camps and E > Q combo for AoE on multi-monster camps.",
      "Three-camp into gank (Red > Raptors > Wolves > gank mid or top) is strong because J4's E > Q knockup is one of the most reliable level 3 ganks.",
      "Place E (flag) before starting a camp for the attack speed aura, and use Q through the flag to pull yourself to reposition for kiting."
    ],
    earlyGame: "J4 is one of the best early gankers; look for E > Q knockup ganks after your first three camps, especially on lanes without dashes that can't escape Cataclysm.",
    midGame: "Force teamfights around dragon and herald with E > Q > R engages; your Cataclysm traps immobile carries and your flag provides team attack speed.",
    lateGame: "Peel with E > Q knockup for your carries or flash-engage on the enemy backline with Cataclysm; build tank items to survive after your engage.",
    commonMistakes: [
      "Missing E > Q combo and losing your only gap closer and CC; practice the combo angle consistently.",
      "Using R on a target with a dash or flash available; Cataclysm is useless if they can just jump out.",
      "Not placing the E flag for the attack speed aura during objectives like dragon and Baron; the team buff is significant."
    ],
    powerSpikeReminders: [
      "Level 2 with E > Q is already a potent gank combo; look for very early ganks if a lane is pushing into your side.",
      "Level 6 Cataclysm transforms your ganks from strong to near-guaranteed kills on immobile champions.",
      "Eclipse or Goredrinker completion gives you the sustain and damage to survive your own engages in mid-game fights."
    ]
  },

  Karthus: {
    combos: [
      "R (Requiem) when enemies across the map are low from fights; always watch other lanes for ult snipe opportunities.",
      "In skirmishes, land isolated Q (Lay Waste) on single targets for double damage, keep W (Wall of Pain) between you and melees for the slow.",
      "After dying, use your passive (Death Defied) to keep spamming Q and activate E (Defile) for 7 seconds of free damage."
    ],
    tradingPatterns: [
      "Full clear starting Raptors with Q (isolated hits on small raptors) > Red > Krugs > Wolves > Blue > Gromp; Karthus is one of the fastest full-clearers when you land isolated Q's.",
      "Always land Q on single targets (isolated) for double damage; this is the key to fast Karthus clears.",
      "After first full clear, continue farming and look for R (Requiem) snipes on low-health laners; you don't need to physically gank to impact the map."
    ],
    earlyGame: "Full clear as fast as possible and look for R snipes on low-health laners; Karthus's early game is all about power farming and global ult pressure.",
    midGame: "Keep farming to maintain your gold lead and use R to influence fights across the map; join fights only if they happen near you, otherwise farm and ult.",
    lateGame: "In teamfights, walk into the enemy team and deal as much Q and E damage as possible; when you die, your passive lets you keep dealing damage, so dying in a good position is actually fine.",
    commonMistakes: [
      "Using R on full-health targets; Requiem is an execute tool for low-health enemies, not an opener.",
      "Missing isolated Q's by hitting multiple targets, halving your damage output and slowing your clear dramatically.",
      "Not farming enough; Karthus needs to be the highest-CS jungler to be effective since he scales with raw AP."
    ],
    powerSpikeReminders: [
      "Level 6 R gives you global kill pressure; keep track of enemy health bars and snipe kills across the map.",
      "First item completion (Luden's Tempest or Liandry's Anguish) makes your R hit hard enough to execute most carries from 30-40% HP.",
      "Rabadon's Deathcap second or third item pushes your R damage and Q spam into game-ending territory."
    ]
  },

  Kayn: {
    combos: [
      "Shadow Assassin: W (Blade's Reach) from fog > R (Umbral Trespass) into target for passive bonus magic damage > Q (Reaping Slash) through them on exit.",
      "Rhaast: Q through the target > W knockup > auto > R when low on health to heal for a percentage of the enemy's max HP.",
      "Pre-form: Use E (Shadow Step) to gank through walls for unexpected angles, W to slow, Q through them to stick."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use Q to dash through camps and W for AoE on multi-monster camps.",
      "Kayn's wall-walking (E) lets you path through unconventional routes; use this to invade or gank from unexpected angles the enemy can't ward against.",
      "Focus on ganking the correct targets for your desired form; attack ranged champions for Shadow Assassin orbs or melee champions for Rhaast orbs."
    ],
    earlyGame: "Full clear and gank the champion types that give you the orbs for your desired transformation (ranged for Shadow Assassin, melee for Rhaast); your pre-form is weak, so focus on farming.",
    midGame: "Shadow Assassin: one-shot isolated squishies from fog of war. Rhaast: sustain-fight in the middle of teamfights with Q and R healing.",
    lateGame: "Shadow Assassin falls off late; end games early with picks. Rhaast scales incredibly well into late-game teamfights with his %max HP healing and drain-tanking.",
    commonMistakes: [
      "Choosing the wrong form for the game state; if the enemy is all squishy, go Shadow Assassin, if they have 2+ tanks/bruisers, go Rhaast.",
      "Forcing fights before your transformation; pre-form Kayn is one of the weakest champions in the game.",
      "As Shadow Assassin, trying to teamfight front-to-back instead of looking for backline assassination angles."
    ],
    powerSpikeReminders: [
      "Form transformation is your single biggest power spike; time your ganks and farm to get it as early as possible (ideally 10-12 minutes).",
      "Shadow Assassin with first lethality item can one-shot any squishy with full combo.",
      "Rhaast with Goredrinker or Eclipse becomes nearly impossible to kill in extended fights thanks to %max HP healing on Q and R."
    ]
  },

  "Kha'Zix": {
    combos: [
      "Leap (E) onto an isolated target > auto > Q (Taste Their Fear) > W (Void Spike) mid-air > auto for maximum burst on a single target.",
      "R (Void Assault) stealth to reposition > auto (passive Unseen Threat proc) > Q > W > R again to re-stealth and wait for Q cooldown > auto > Q to finish.",
      "W mid-leap for an AoE slow on landing, then Q the isolated target to burst them before they can escape."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use W to heal on multi-monster camps and Q isolated single monsters for bonus damage.",
      "Look for early invades at the enemy jungler's second buff; if they're doing a camp alone, your isolated Q damage wins most 1v1s at level 3.",
      "Always fight in the enemy jungle or river where targets are more likely to be isolated; avoid fighting in lane where minions break isolation."
    ],
    earlyGame: "Look for invades and duels in the enemy jungle where targets are isolated; Kha'Zix's early isolated Q damage is among the highest in the game for 1v1s.",
    midGame: "Roam through the enemy jungle and pick off isolated targets; evolved E leap resets on kills let you chain assassinations in skirmishes.",
    lateGame: "Wait for a teamfight to start, then flank from fog to assassinate an isolated carry; evolved E resets and R stealth let you clean up fights.",
    commonMistakes: [
      "Fighting targets who are not isolated; Kha'Zix deals dramatically less damage when enemies are near each other.",
      "Evolving the wrong ability; standard evolution order is Q > E > W or R depending on game state.",
      "Leaping into a grouped enemy team instead of waiting for isolation; patience is key to Kha'Zix's success."
    ],
    powerSpikeReminders: [
      "Level 6 with Q evolution is a massive spike; your isolated Q damage becomes lethal to any squishy.",
      "Level 11 with E evolution gives you leap resets on kills, enabling multi-kill outplays in teamfights.",
      "First lethality item (Duskblade or Eclipse) plus evolved Q lets you one-shot isolated targets reliably."
    ]
  },

  Kindred: {
    combos: [
      "E (Mounting Dread) the target first, then Q (Dance of Arrows) to reposition and auto > auto > auto for the E third-hit execute proc.",
      "W (Wolf's Frenzy) zone placement, then Q within the W zone for massively reduced Q cooldown; kite within the zone to maximize DPS.",
      "R (Lamb's Respite) under yourself when about to die, then reposition with Q during the invulnerability and burst the enemy as the heal pops."
    ],
    tradingPatterns: [
      "Plan your clear around passive mark spawns; your first mark always spawns on Scuttle Crab, so path toward scuttle side to collect it after your first three camps.",
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp, using Q to kite every camp within W zone for the reduced cooldown.",
      "Invade for marks aggressively when they spawn on enemy camps; Kindred needs stacks to scale, and falling behind on marks cripples your late game."
    ],
    earlyGame: "Path toward your passive marks and contest scuttle crabs aggressively; collect marks through ganks and invades since stacks are essential for Kindred's scaling.",
    midGame: "Skirmish around marks and objectives; with 4+ marks, your range and damage increase significantly and you can kite out most fighters.",
    lateGame: "Play as an ADC from the jungle; position behind your frontline, use Q for kiting, and use R to save yourself or your team from burst damage in critical moments.",
    commonMistakes: [
      "Ignoring passive marks and letting them expire; each mark is a permanent stat increase that Kindred desperately needs.",
      "Using R reactively on enemies by accident, saving them from death; be careful about R placement in chaotic fights.",
      "Not kiting within W zone; Q cooldown is halved inside Wolf's Frenzy, so dropping W and staying inside it is crucial for DPS."
    ],
    powerSpikeReminders: [
      "4 marks is a critical threshold where Q, W, and E all gain bonus effects and your auto-attack range increases.",
      "Kraken Slayer or Trinity Force completion gives you the attack speed to fully utilize your mark-enhanced kit.",
      "7 marks further increase your range and damage; at this point you outrange and outdamage most ADCs."
    ]
  },

  "Lee Sin": {
    combos: [
      "Q (Sonic Wave) > Q2 (Resonating Strike) to dash to the target > R (Dragon's Rage) kick them into your team (the Insec).",
      "Ward hop (W to a ward) behind the enemy > R kick them into your team > Q the kicked target > Q2 to follow up.",
      "Q > Q2 to gap close > auto > E (Tempest) slow > auto > auto (passive energy restoration) for a standard gank combo; save W for escape."
    ],
    tradingPatterns: [
      "Three-camp into gank (Red > Raptors > Krugs or Blue > Gromp > Wolves) is Lee Sin's standard opener; his level 3 ganks with Q are among the best in the game.",
      "Use passive efficiently on camps: auto twice between each ability for energy regeneration and bonus attack speed.",
      "Invade the enemy jungler at their buff after your three-camp clear; Lee Sin wins most level 3 1v1s with Q > auto > auto > E > auto > auto."
    ],
    earlyGame: "Gank early and often; Lee Sin's power curve peaks early, so create leads for your laners through constant pressure and invades before you get outscaled.",
    midGame: "Look for Insec kicks on enemy carries to displace them into your team; ward-hop > R is the highest-impact play Lee Sin can make in the mid game.",
    lateGame: "Lee Sin falls off hard; play as a peeler using R to kick divers away from your carries, or look for one game-winning Insec kick to end the game.",
    commonMistakes: [
      "Missing Q and still trying to force a play; without Q, Lee Sin has no gap closer and the gank is over.",
      "Full-clearing instead of ganking; Lee Sin is not a farming jungler and loses value every minute he spends in his own jungle.",
      "Kicking the enemy tank into your team instead of the carry; always Insec the highest-value target."
    ],
    powerSpikeReminders: [
      "Levels 2-3 are Lee Sin's strongest relative point in the game; abuse this with early ganks and invades.",
      "Level 6 Insec kick combo unlocks your playmaking potential; immediately look for a kick play.",
      "Goredrinker or Eclipse first item gives you enough sustain and damage to win any early-game skirmish."
    ]
  },

  Lillia: {
    combos: [
      "Q (Blooming Blows) the outer edge on enemies for max damage, then W (Watch Out! Eep!) center hit for massive burst; chain Q's to build passive movement speed.",
      "R (Lilting Lullaby) when multiple enemies have Dream Dust (passive) stacks, then W center hit the sleeping carry for a guaranteed burst combo.",
      "E (Swirlseed) long-range into a lane to apply Dream Dust, then R to put them to sleep for a cross-map gank setup."
    ],
    tradingPatterns: [
      "Full clear is essential; Blue > Gromp > Wolves > Raptors > Red > Krugs, spinning Q through every camp for AoE and building passive movespeed stacks.",
      "Lillia is one of the fastest full-clearers in the game; always Q through the center of multi-monster camps and keep moving to maintain passive speed.",
      "Use E (Swirlseed) to scout or apply Dream Dust on distant camps like Raptors while you clear Wolves; it rolls forever and applies your passive."
    ],
    earlyGame: "Full clear to level 4 as fast as possible (sub 3:10 is achievable); your passive movespeed after a full rotation makes you extremely fast for scuttle fights or ganks.",
    midGame: "Look for multi-man R plays in teamfights after applying Dream Dust with Q to several enemies; a 3-4 man sleep is one of the strongest abilities in the game.",
    lateGame: "Kite on the outskirts of fights with Q movespeed and look for multi-man sleep; Lillia scales very well with AP and her %max HP damage from passive shreds tanks.",
    commonMistakes: [
      "Not hitting the outer edge of Q (the true damage ring); the center does significantly less damage than the edge.",
      "Using R on only one target; Lillia's R is most valuable when it puts 3+ enemies to sleep simultaneously.",
      "Standing still in fights; Lillia's entire kit revolves around constant movement for passive stacks."
    ],
    powerSpikeReminders: [
      "Level 4 after full clear with 4-5 passive stacks makes you incredibly fast; use this speed advantage for ganks and scuttle contests.",
      "Liandry's Anguish completion amplifies your passive burn and makes you melt tanks with %HP damage over time.",
      "Level 11 with 2 items is when Lillia's teamfight damage becomes truly oppressive; force teamfights around objectives."
    ]
  },

  "Master Yi": {
    combos: [
      "Q (Alpha Strike) to dodge a key ability, then auto > E (Wuju Style) true damage > auto > auto; use Q again when it comes off cooldown.",
      "R (Highlander) before engaging for attack speed and movespeed, then Q onto the target > auto > W (Meditate) auto-reset > auto > Q again.",
      "W (Meditate) auto-attack reset: auto > W > immediately cancel W > auto for a quick double auto that procs on-hits."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use Q to hit all monsters in multi-monster camps and auto between Q cooldowns.",
      "Master Yi is a farming jungler; prioritize full clears and take every camp on cooldown to hit your item spikes as fast as possible.",
      "Use W (Meditate) to heal between camps; the damage reduction and healing keep you healthy enough to full clear without backing."
    ],
    earlyGame: "Farm to level 6 and your first item component; avoid early fights where CC will lock you down, only gank lanes that are heavily overextended.",
    midGame: "Look for skirmishes where you can clean up after enemies use their CC; Q untargetability and R reset on kills make you a teamfight cleaner, not an engager.",
    lateGame: "Yi with 3+ items is a hypercarry; split-push to draw pressure and use R to escape, or join teamfights late after CC is used and clean up with Q resets.",
    commonMistakes: [
      "Engaging fights first instead of waiting for the enemy to use CC; one stun and Yi dies instantly.",
      "Using Q randomly instead of saving it to dodge key abilities like stuns and knockups.",
      "Fighting before your item power spikes; Yi is weak without items and needs gold income from farming."
    ],
    powerSpikeReminders: [
      "Level 6 Highlander makes you immune to slows and gives massive attack speed; this is when you become a real threat.",
      "Guinsoo's Rageblade or Blade of the Ruined King first item gives you the on-hit damage that defines Yi's playstyle.",
      "3-item Yi (Kraken + Guinsoo's + BORK or similar) is one of the strongest 1v1 and 1v2 champions in the game."
    ]
  },

  Nidalee: {
    combos: [
      "Human Q (Javelin Toss) to mark the target, swap to Cougar > W (Pounce) for the extended leap to the marked target > Cougar E (Swipe) > Cougar Q (Takedown) for max execute damage.",
      "Human W (Bushwhack) trap placement for vision + mark, then Human Q spear > Cougar W leap > E > Q for a guaranteed all-in.",
      "Human E (Primal Surge) to heal yourself or an ally, then throw Q spear and swap to Cougar for the full combo."
    ],
    tradingPatterns: [
      "Nidalee can start any camp but Raptors start with Cougar W > E > Q > swap Human Q is one of the fastest openers; full clear quickly with form swapping.",
      "Swap between Human and Cougar forms constantly during clears; Human Q and traps deal extra damage to marked targets in Cougar form.",
      "Nidalee's clear speed is one of the highest in the game if executed correctly; practice the form-swap combos on each camp to shave seconds off your clear."
    ],
    earlyGame: "Invade and duel the enemy jungler constantly; Nidalee wins almost every early 1v1 with spear-mark into Cougar combo and her clear speed lets her be everywhere first.",
    midGame: "Use Javelin Toss poke to chunk enemies before objective fights; a max-range spear hitting a squishy forces them out of the fight entirely.",
    lateGame: "Nidalee falls off significantly; focus on spear poke from fog of war and use Cougar form to split-push with your fast clear, but avoid extended teamfights.",
    commonMistakes: [
      "Missing Javelin Toss and going in anyway; without the Hunt mark, Cougar form damage is drastically reduced.",
      "Not farming enough; Nidalee is one of the hardest junglers mechanically and poor clear execution wastes her speed advantage.",
      "Playing too passively; Nidalee needs to generate early leads because she falls off hard after 25 minutes."
    ],
    powerSpikeReminders: [
      "Level 3 with all abilities is when Nidalee's full combo comes online; immediately look for an invade or gank.",
      "Hextech Rocketbelt gives you an extra gap closer that makes landing the spear-to-Cougar combo more reliable.",
      "Nidalee's power curve peaks between 8-18 minutes; play aggressively during this window."
    ]
  },

  Nocturne: {
    combos: [
      "R (Paranoia) to dash to the target, immediately Q (Duskbringer) through them on landing for the AD steroid and movespeed trail, then auto > W (Shroud of Darkness) to block their CC > E (Unspeakable Horror) fear.",
      "Pre-6 gank: Q through the target for movespeed, run them down with auto > E fear tether, W to block their key ability.",
      "In teamfights, R the backline carry to create darkness and isolate them, then fear + burst them while your team engages the blinded frontline."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; Nocturne's Q and passive cleave make his clear healthy and fast.",
      "Use passive (Umbra Blades) cleave on multi-monster camps and time your auto-attacks to proc passive healing frequently.",
      "After level 6, use R from fog of war to gank any lane on the map; the darkness alone disrupts enemy coordination even if you don't kill anyone."
    ],
    earlyGame: "Full clear to level 6 as your priority; pre-6 ganks are okay with Q movespeed and E fear, but level 6 Paranoia transforms your map presence entirely.",
    midGame: "Use R off cooldown to pick off isolated laners or create number advantages; the darkness denies enemy vision and prevents them from collapsing on your ganks.",
    lateGame: "Flank with R onto the enemy ADC or mage; with lethality items you can one-shot squishies, and the darkness prevents the enemy team from peeling effectively.",
    commonMistakes: [
      "Using R when the target has their team stacked nearby; Nocturne gets blown up if he dives into a grouped team.",
      "Wasting W (Spell Shield) early instead of saving it to block the target's key CC or escape ability.",
      "Not using the darkness from R to your team's advantage; ping your team to engage while the enemy can't see each other."
    ],
    powerSpikeReminders: [
      "Level 6 Paranoia is one of the biggest power spikes in the game; the global darkness and targeted dash changes the entire game dynamic.",
      "Duskblade or Eclipse first item gives you enough burst to one-shot squishies when you R onto them.",
      "Level 11 with R rank 2 reduces the cooldown significantly, letting you use it for nearly every gank or fight."
    ]
  },

  "Nunu & Willump": {
    combos: [
      "W (Biggest Snowball Ever!) from fog of war to roll into lane and knock up the enemy, then E (Snowball Barrage) for the root, auto attacks, and Q (Consume) for burst/healing.",
      "Gank from behind the enemy so W pushes them toward your tower; E root prevents escape and Q secures the kill or heals you.",
      "In teamfights, channel R (Absolute Zero) in a bush or after W knockup for a guaranteed full-channel that deals massive AoE damage."
    ],
    tradingPatterns: [
      "Nunu should NOT full clear; start Red or Blue > immediately gank the nearest lane with W snowball at level 2 for the earliest possible gank.",
      "Use Q (Consume) to instantly smite camps for fast, healthy clears; Q deals massive true damage to monsters and heals you.",
      "Perma-gank and contest every objective; Nunu's Q + Smite combo deals more burst to objectives than any other jungler, making dragon/Baron steals nearly guaranteed."
    ],
    earlyGame: "Gank at level 2 with W snowball; Nunu's strength is his non-stop ganking and objective control, not his farming, so be on the map constantly.",
    midGame: "Force every dragon and herald; Q + Smite gives you the highest objective burst in the game, making smite fights almost unlosable.",
    lateGame: "Peel for carries with W knockup and E root; look for flanking R channels from fog of war to zone or burst the enemy team.",
    commonMistakes: [
      "Full-clearing instead of ganking; Nunu is the premier ganking jungler and wastes his power budget by farming.",
      "Rolling W in a straight line that the enemy can see coming; use terrain and fog of war to surprise them with the snowball.",
      "Not contesting every objective; Nunu's Q + Smite combo is your biggest advantage and you should abuse it."
    ],
    powerSpikeReminders: [
      "Level 2 with W is your first power spike; immediately gank a lane, Nunu is the earliest ganker in the game.",
      "Level 6 Absolute Zero in combination with W knockup or bush cheese deals devastating AoE damage.",
      "Dead Man's Plate gives you movespeed to make your roaming and snowball engages even more oppressive."
    ]
  },

  Poppy: {
    combos: [
      "E (Heroic Charge) the target into a wall for the stun, then Q (Hammer Shock) on top of them for both hits, and auto with passive shield.",
      "W (Steadfast Presence) to block enemy dashes, then E them into a wall > Q for a guaranteed burst combo.",
      "R (Keeper's Verdict) to knock away frontline divers from your carry, or tap R for a quick knockup to chain with E > Q."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Poppy's clear is slow but healthy with passive shield and W damage reduction.",
      "Look for ganks on lanes near walls; Poppy's E wall stun is one of the longest non-ultimate stuns in the game.",
      "Poppy hard-counters dash-reliant junglers; invade and fight champions like Lee Sin, Kindred, or Graves whose mobility you can block with W."
    ],
    earlyGame: "Look for ganks on lanes with walls near the action (top lane is ideal); E wall stun into Q deals surprising burst and the long stun guarantees your laner's follow-up.",
    midGame: "Peel your carries by blocking enemy dashes with W and knocking away divers with R; Poppy is one of the best anti-dive champions in the game.",
    lateGame: "Use R to knock away key enemy champions before a teamfight starts, creating a 5v4, or save it to peel; W blocks all dashes in a zone, shutting down assassins and engage champions.",
    commonMistakes: [
      "E-ing targets away from walls; without the wall stun, Poppy's E is just a short knockback with no follow-up.",
      "Using R fully charged in teamfights, sending enemies far away instead of tapping R for the instant knockup and damage.",
      "Not using W proactively to block dashes; the grounding zone is Poppy's most impactful ability against mobile teams."
    ],
    powerSpikeReminders: [
      "Level 3 with E + Q near a wall deals massive burst; gank top lane where walls are always nearby.",
      "Level 6 R gives you either a massive disengage tool or a quick knockup for teamfight CC chains.",
      "Iceborn Gauntlet or Jak'Sho completion makes you extremely tanky while your base damages remain relevant."
    ]
  },

  Rammus: {
    combos: [
      "Q (Powerball) to roll into the target for the knockup, then E (Frenzied Taunt) to taunt them into attacking you (triggering W return damage), W (Defensive Ball Curl) for damage reflection.",
      "R (Soaring Slam) to leap a wall and initiate, then Q > E taunt the carry while your W reflects all their damage back at them.",
      "Flash > E taunt the carry, then W > Q for a guaranteed lockdown combo when Powerball engage isn't possible."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; use W to reflect camp damage and Q to move between camps quickly.",
      "Rammus's clear is slow; focus on ganking after your first 3-4 camps since your Q > E gank is one of the most reliable in the game.",
      "Prioritize ganking AD-heavy lanes where your W armor and damage reflection are most effective; taunt an ADC and watch them kill themselves hitting you."
    ],
    earlyGame: "Gank frequently with Q rolls into E taunt; Rammus's ganks are simple but incredibly effective, especially against immobile laners.",
    midGame: "Build full armor into AD-heavy teams and become an unkillable CC machine; force fights where the enemy ADC has to hit you while taunted.",
    lateGame: "Taunt the enemy ADC in every teamfight and watch them deal zero damage while killing themselves on your W; position to peel or engage depending on team needs.",
    commonMistakes: [
      "Picking Rammus into heavy AP teams; his kit is designed to counter AD damage and he's much weaker against magic damage.",
      "Not using Q as a rotation tool between camps and ganks; the movespeed is just as important for map presence as it is for engage.",
      "Canceling W too early; the damage reflection and bonus resistances need to be active during the taunt duration for maximum effect."
    ],
    powerSpikeReminders: [
      "Level 3 with Q > E > W is a nearly guaranteed gank on any immobile laner; the taunt duration is long enough for your laner to follow up.",
      "Thornmail completion makes you a nightmare for auto-attack champions; they literally cannot hit you without taking massive damage.",
      "Level 11 with R rank 2 significantly reduces the cooldown of Soaring Slam for more frequent engages."
    ]
  },

  "Rek'Sai": {
    combos: [
      "Burrowed W (Unburrow) knockup > auto > unburrowed Q (Queen's Wrath) three enhanced autos > E (Furious Bite) at max fury for true damage.",
      "Burrowed E (Tunnel) to close distance from fog of war, then W knockup > Q > auto > E for a fast burst combo.",
      "R (Void Rush) to dash to a marked target (from previous damage), timing the untargetability to dodge a key enemy ability."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; alternate between burrowed (for tremor sense) and unburrowed (for Q damage) on each camp.",
      "Use burrowed Q to find enemies through tremor sense; this is free information that lets you track the enemy jungler without wards.",
      "Rek'Sai's tunnels persist on the map; create a tunnel network between camps and lanes for fast rotations throughout the game."
    ],
    earlyGame: "Rek'Sai is one of the strongest early game junglers; invade and fight the enemy jungler at their second buff, your knockup into full combo wins most level 3 1v1s.",
    midGame: "Use your tunnel network for rapid rotations between lanes and objectives; gank with burrowed E tunnel from unexpected angles for knockup ganks.",
    lateGame: "Rek'Sai falls off in teamfights; look for picks with tunnel flanks and use R to dive the backline carry, then E true damage to burst them before they can react.",
    commonMistakes: [
      "Not using E at full fury for the true damage conversion; partial fury E deals significantly less damage.",
      "Forgetting to build and maintain your tunnel network; tunnels are free mobility that the enemy has to actively destroy.",
      "Staying burrowed too long in fights; you need to be unburrowed to use Q and E for damage output."
    ],
    powerSpikeReminders: [
      "Level 3 is your strongest point; immediately invade or gank with knockup combo for first blood potential.",
      "Level 6 R gives you an execute-range dash that makes your burst combo lethal to any squishy.",
      "Eclipse or Prowler's Claw first item turns your already-strong early damage into one-shot potential on squishies."
    ]
  },

  Rengar: {
    combos: [
      "Leap from bush > Empowered Q (Savagery at 4 ferocity) for massive burst > W (Battle Roar) > E (Bola Strike) > Q again as ferocity rebuilds.",
      "R (Thrill of the Hunt) stealth > leap onto the target with Empowered Q > E mid-air for the root > W > Q for a one-shot combo.",
      "At 3 ferocity: Q > leap from bush (generates 4th stack) > Empowered Q immediately on landing for a double-Q burst."
    ],
    tradingPatterns: [
      "Start the camp nearest a bush so you can leap for free damage and ferocity generation; use bushes next to every camp to leap-auto for faster clears.",
      "Clear path Red > Krugs > Raptors using bush leaps near each camp; Rengar's clear speed depends on maximizing bush leaps for ferocity stacking.",
      "Always build 3-4 ferocity stacks before ganking so you can open with Empowered Q or Empowered E for the guaranteed root."
    ],
    earlyGame: "Look for ganks through lane bushes where you can leap onto enemies; top lane bush ganks are especially effective since the lane bushes give you free leaps.",
    midGame: "Use R to stalk and assassinate isolated squishies; the camouflage lets you bypass wards and the nearest-enemy indicator reveals their position.",
    lateGame: "One-shot the enemy carry from R stealth with Empowered Q leap combo; without bush access in open areas, R is your only reliable engage tool.",
    commonMistakes: [
      "Ganking lanes without nearby bushes; Rengar needs bushes to leap and without them you have no gap closer pre-6.",
      "Using Empowered W instead of Empowered Q for burst; save Empowered W only when you need the cleanse and heal to survive.",
      "Forgetting to stack ferocity before engaging; jumping in at 0 stacks means no empowered ability and a failed assassination."
    ],
    powerSpikeReminders: [
      "Level 3 with access to bush leaps is your first kill window; look for top lane ganks through the lane bushes.",
      "Level 6 R gives you stealth engage that bypasses all vision; this is when Rengar becomes a true assassin.",
      "Duskblade or Essence Reaver first item makes your Empowered Q burst lethal to any squishy target."
    ]
  },

  Sejuani: {
    combos: [
      "Q (Arctic Assault) dash to knock up the target, auto > W (Winter's Wrath) two-part swing > E (Permafrost) to stun when the passive stacks are applied.",
      "R (Glacial Prison) long-range to stun the primary target and slow the area, then Q in > W > E for a follow-up stun chain.",
      "In teamfights, R the grouped backline, Q into the stunned enemies, W for AoE damage, then E the closest target with frost stacks for another stun."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Sejuani's clear is slow but healthy due to her passive armor/MR and W damage.",
      "Sejuani has strong gank setup; after 3-4 camps, look for ganks where your Q knockup into E stun provides extended CC for your laners.",
      "Melee allies apply frost stacks to enemies Sejuani has damaged, so gank lanes with melee champions for faster E stun procs."
    ],
    earlyGame: "Clear to level 3-4 and look for Q knockup ganks; Sejuani's CC chain is extremely long and sets up kills for any laner with follow-up damage.",
    midGame: "Force teamfights around objectives where your R > Q > W > E combo provides massive AoE CC; Sejuani excels in grouped fights.",
    lateGame: "Frontline and peel for your team with your extensive CC toolkit; a well-placed R on 3+ enemies wins teamfights outright.",
    commonMistakes: [
      "Using Q purely for mobility instead of the knockup; Q is your primary engage tool and wasting it leaves you without follow-up.",
      "Popping E too early before max frost stacks are applied; wait until the target has enough stacks for the stun.",
      "Not playing around melee allies who help stack your passive frost; always gank lanes with melee champions when possible."
    ],
    powerSpikeReminders: [
      "Level 3 with Q knockup into E stun is a deadly gank combo that locks enemies down for over 2 seconds.",
      "Level 6 Glacial Prison gives you long-range engage that can start fights from a screen away.",
      "Iceborn Gauntlet or Radiant Virtue completion makes you nearly unkillable while providing constant CC in fights."
    ]
  },

  Shaco: {
    combos: [
      "Q (Deceive) stealth behind the target > auto (backstab bonus damage) > E (Two-Shiv Poison) slow > Ignite for an assassination combo.",
      "Place W (Jack in the Box) behind the target before ganking, then Q behind them to force them into the box fear.",
      "R (Hallucinate) to dodge a key ability with the untargetability, then use the clone to block skillshots or body-block escapes while you burst the target."
    ],
    tradingPatterns: [
      "Start with W (boxes); place 3 boxes at Raptors starting at 0:40 to instant-clear them, then move to Red > take Blue side for a fast level 3.",
      "Shaco's clear relies on box setup; always place a W box before starting a camp and let it tank damage while you auto from behind for backstab passive.",
      "Level 2 gank after Red with Q stealth is one of the cheesiest and most effective early ganks in the game; abuse it before enemies respect it."
    ],
    earlyGame: "Level 2 cheese gank with Q stealth from Red buff; Shaco's entire game plan revolves around snowballing early leads through creative ganks and invades.",
    midGame: "Split-push with R clone or continue picking off isolated targets with Q stealth; place boxes in high-traffic areas to create trap zones.",
    lateGame: "Shaco struggles in teamfights; focus on split-pushing with clone, placing box traps around objectives, and looking for picks on isolated enemies.",
    commonMistakes: [
      "Wasting Q (stealth) to gap close when you could walk up and save it for the escape; Q is both your engage and escape.",
      "Not placing boxes proactively in choke points and bushes; boxes are free wards and CC that control areas of the map.",
      "Building the same way every game; AD Shaco assassin works when ahead, AP Shaco utility works when behind."
    ],
    powerSpikeReminders: [
      "Level 2 with Q is your biggest early cheese window; the stealth backstab from Red buff start catches most players off guard.",
      "Level 6 R clone adds outplay potential and tower diving safety; the untargetability frame dodges abilities.",
      "Duskblade (AD) or Liandry's (AP) first item defines your playstyle and power spike; choose based on game state."
    ]
  },

  Shyvana: {
    combos: [
      "Human form: Q (Twin Bite) auto-reset > W (Burnout) > E (Flame Breath) mark > auto to proc mark damage.",
      "Dragon form: R (Dragon's Descent) to leap and transform, then E (fireball) through grouped enemies for massive AoE > Q double auto > W for AoE burn.",
      "Dragon E into a wall creates a lingering fire zone; combo with W burnout for massive area denial in teamfights."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; Shyvana's passive bonus damage to dragons means always prioritize dragon when available.",
      "W (Burnout) melts camps; keep it active throughout your clear and use Q auto-resets to maximize single-target DPS on Gromp and Red/Blue.",
      "Shyvana needs to farm to 6; her pre-6 ganks are weak without Dragon's Descent gap closer, so focus on full-clearing and tracking the enemy jungler."
    ],
    earlyGame: "Full clear to level 6 as fast as possible; Shyvana without her ult has no gap closer and terrible ganks, so farm and only fight if the enemy comes to you.",
    midGame: "Use Dragon's Descent to dive the backline with E fireball burst; Dragon form E into grouped enemies does absurd AP damage and zones the fight.",
    lateGame: "Wait for Dragon form and look for flanking R engages onto grouped enemies; Dragon E on 3+ targets wins teamfights single-handedly with AP build.",
    commonMistakes: [
      "Forcing ganks pre-6 without Dragon form; Shyvana has no CC or gap closer in human form and ganks almost always fail.",
      "Not taking every dragon; Shyvana's passive gives permanent bonus armor and MR per dragon killed, making each drake double value.",
      "Using R as a gap closer in human form instead of saving it for the Dragon form E damage and AoE in teamfights."
    ],
    powerSpikeReminders: [
      "Level 6 Dragon's Descent transforms you from a farming jungler into a teamfight powerhouse; look for your first R engage immediately.",
      "Nashor's Tooth (AP) or Blade of the Ruined King (AD) first item significantly boosts your DPS in both forms.",
      "Each dragon you take gives you permanent stats; after 2-3 dragons, you become noticeably tankier than other junglers."
    ]
  },

  Skarner: {
    combos: [
      "E (Ixtal's Impact) to stun by charging through terrain, then Q (Shattered Earth) > auto (empowered rock throw) > W (Seismic Bastion) shield for sticking power.",
      "R (Impale) to suppress and drag the enemy carry into your team, then Q > E > auto for follow-up damage while your team collapses.",
      "Flash > R the enemy carry to suppress and drag them out of position; this is Skarner's highest-impact play in teamfights."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Skarner's AoE from Q and passive make his clear healthy and moderately fast.",
      "Use E through terrain for the stun on ganks; this requires creative pathing near walls, so gank lanes where terrain is accessible.",
      "Skarner's clear is straightforward; focus on farming to level 6 where R suppress transforms your gank potential."
    ],
    earlyGame: "Farm to level 6 and look for E stun ganks through terrain; your pre-6 is decent but R is what makes Skarner's ganks terrifying.",
    midGame: "Flash > R the enemy carry in every teamfight to drag them into your team; one successful Impale decides entire fights around dragon and Baron.",
    lateGame: "Your sole job is to R the most important enemy champion and drag them to their death; position aggressively and Flash > R when the window opens.",
    commonMistakes: [
      "Using R on tanks instead of carries; Impale is most valuable when used on the enemy's highest-damage threat.",
      "Not using E through terrain for the stun; the ability requires wall interaction to CC, so path accordingly.",
      "Building full damage instead of tank; Skarner needs to survive long enough to get R off and drag the target to his team."
    ],
    powerSpikeReminders: [
      "Level 6 R (Impale) is your game-changing spike; the point-and-click suppress has zero counterplay other than QSS.",
      "Iceborn Gauntlet gives you the sticking power and tankiness to survive after dragging a carry into the enemy team.",
      "Level 11 with R rank 2 reduces the cooldown, letting you use Impale in nearly every skirmish."
    ]
  },

  Taliyah: {
    combos: [
      "W (Seismic Shove) to knock the target into the direction of your E (Unraveled Earth) minefield, then Q (Threaded Volley) for burst while they're slowed by E rocks.",
      "E field placement > W knockback through the E field forces the target to dash through the minefield, detonating all the rocks for massive damage.",
      "R (Weaver's Wall) to flank behind the enemy team, then W > E combo the grouped targets while they try to escape through your minefield."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use Q on each camp and keep moving to avoid standing on worked ground (which reduces Q to a single rock).",
      "Avoid fighting on worked ground; Q only fires one rock on previously-used terrain, so keep repositioning to fresh ground during clears and fights.",
      "After level 6, use R (wall ride) to gank from angles that are impossible to ward against; the wall creates a unique roaming tool."
    ],
    earlyGame: "Full clear to level 4 and look for W > E combo ganks on overextended lanes; your burst from the combo is high but requires landing the W knockback accurately.",
    midGame: "Use R to roam to side lanes for surprise ganks or flank in objective fights; the wall ride range is enormous and impossible to predict.",
    lateGame: "Zone teamfights with E minefield and W knockback; Taliyah controls space better than almost any jungler and forces enemies into bad positions.",
    commonMistakes: [
      "Standing on worked ground during fights, reducing Q from five rocks to one and gutting your damage.",
      "Knocking enemies away from your E field with W instead of into it; always W the target through your E for maximum rock detonation.",
      "Not using R for creative flanks and roams; the wall is not just an escape tool but your primary map-pressure ability."
    ],
    powerSpikeReminders: [
      "Level 3 with W > E combo deals surprising burst; the knock-through-minefield combo chunks most champions for 40%+ HP.",
      "Level 6 R wall ride gives you unmatched roaming speed and gank angles that bypass all wards.",
      "Luden's Tempest or Liandry's Anguish first item pushes your Q poke and combo burst to lethal levels."
    ]
  },

  Udyr: {
    combos: [
      "R (Wingborne Storm) for AoE DOT aura, then Q (Wilding Claw) for the burst auto-attacks while running them down with E (Blazing Stampede) stun.",
      "E stun the target first, then swap between Q (burst autos) and R (AoE storm) to maximize damage while W (Iron Mantle) keeps you alive with the shield and lifesteal.",
      "In teamfights, E into the backline to stun the carry, R for AoE storm damage on grouped enemies, then W to sustain through the counterattack."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; swap stances frequently to proc Udyr's passive (Awakened stance bonuses) for faster clears.",
      "Udyr can flex between Phoenix (R) clear for AoE and Tiger (Q) for single-target burst; R max is better for farming, Q max for dueling.",
      "E movespeed lets you run between camps quickly; always activate E when moving between camps to optimize clear time."
    ],
    earlyGame: "Full clear into a gank with E stun; Udyr's base stats are high and the point-and-click stun makes ganks reliable even without dashes.",
    midGame: "Split-push with your fast clear and duel anyone who tries to match you; Udyr with Trinity Force or Iceborn Gauntlet wins most 1v1 side-lane fights.",
    lateGame: "In teamfights, E-stun priority targets and R for AoE damage; in split-push, Udyr melts towers and clears waves faster than almost anyone.",
    commonMistakes: [
      "Not swapping stances frequently enough; Udyr's passive grants bonus effects on Awakened stance swaps, so cycle through abilities constantly.",
      "Chasing too deep with E; Udyr lacks dashes and can be kited, so know when to disengage.",
      "Maxing the wrong stance for the game; R max for teamfights and farming, Q max for dueling and pick-focused games."
    ],
    powerSpikeReminders: [
      "Level 3 with Q/R/E gives you strong gank and duel potential; the point-and-click stun is incredibly reliable.",
      "Trinity Force or Iceborn Gauntlet first item is a massive spike; Spellblade procs synergize perfectly with stance swapping.",
      "Level 9 with a maxed stance is when Udyr's sustained damage and clear speed peak relative to the game state."
    ]
  },

  Vi: {
    combos: [
      "Q (Vault Breaker) charge to gap close and knock back, then auto > E (Relentless Force) auto-reset for passive shield proc, auto > E again.",
      "R (Cease and Desist) the carry to lock them down with the suppress, then Q > auto > E > auto > E for the full burst follow-up.",
      "Flash > Q for an extended-range knockback engage that is nearly impossible to dodge; use this to catch backline carries."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use E auto-resets on every camp and charge Q to pull yourself through camps for AoE.",
      "Vi can gank effectively at level 3; Q charge from fog of war is a strong ganking tool even pre-6.",
      "Always auto > E > auto between Q charges for maximum DPS; E is an auto-attack reset so weave it between every auto."
    ],
    earlyGame: "Look for Q ganks from fog of war after your first clear; Vi's Q knockback into E burst is a reliable gank combo that works on all lanes.",
    midGame: "R the enemy carry in every fight to lock them down; Vi's point-and-click suppress on R is invaluable against mobile carries who are otherwise hard to catch.",
    lateGame: "Your job is to R the highest-value target and burst them with your team's help; build bruiser items so you survive long enough after the engage.",
    commonMistakes: [
      "Charging Q for too long and letting the enemy react; a fast-release Q from fog is better than a fully-charged Q they can see coming.",
      "Using R on tanks instead of carries; Cease and Desist should always target the enemy's primary damage threat.",
      "Not weaving auto-attacks between abilities; Vi's passive shield and E auto-reset require proper auto-weaving for maximum output."
    ],
    powerSpikeReminders: [
      "Level 3 with Q charge from fog of war is a strong and reliable gank; the knockback displaces enemies toward your laner.",
      "Level 6 R is a point-and-click suppress that is impossible to dodge; immediately look for a gank on the enemy's most important target.",
      "Trinity Force or Eclipse completion gives Vi enough damage and sustain to 1v1 almost any champion in the mid game."
    ]
  },

  Viego: {
    combos: [
      "W (Spectral Maw) charge and stun > Q (Blade of the Ruined King) stab > auto > auto (Q mark proc) for the double-hit passive.",
      "R (Heartbreaker) to execute a low-HP target, then possess their body with passive for a full ability reset and use their kit before R-ing again.",
      "In teamfights, damage multiple targets to mark them, possess the first kill for a full HP/ability reset, burst with their kit, then R out and repeat."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; Q passive healing on camps keeps you healthy and auto > Q auto-mark procs speed up single-target camps.",
      "Always auto-attack a target after Q to proc the double-hit mark; this is the majority of your early clear damage.",
      "Viego can gank at level 3 with W stun from fog; the charge stun is long-range and guarantees your follow-up Q and autos."
    ],
    earlyGame: "Full clear into a W stun gank; Viego's early ganks are decent and his passive resets in skirmishes can turn 2v2s in your favor if you get the first kill.",
    midGame: "Look for skirmishes where you can possess enemy champions after kills; each possession gives you a full reset, making Viego the best cleanup champion in the game.",
    lateGame: "In teamfights, damage everyone then wait for a kill to possess; chain possessions by taking enemy bodies, using their abilities, then R-ing to the next target.",
    commonMistakes: [
      "Engaging without W stun; going in without the CC lets enemies kite you easily since Viego has no other gap closer pre-6.",
      "Not possessing enemies after kills; the full HP reset and ability access is the most powerful part of Viego's kit.",
      "Using R for damage instead of resets; R should be used to execute then immediately possess the next target."
    ],
    powerSpikeReminders: [
      "Level 3 with W stun and Q double-hit gives you strong gank and duel potential.",
      "Blade of the Ruined King first item synergizes perfectly with your Q passive for massive on-hit damage.",
      "Trinity Force or Kraken Slayer further amplifies your auto-attack-heavy playstyle into a dominant dueling force."
    ]
  },

  Volibear: {
    combos: [
      "Q (Thundering Smash) to run at the target and stun with the empowered auto, then W (Frenzied Maul) bite > E (Sky Splitter) for the AoE slow and shield.",
      "R (Stormbringer) to leap and disable tower, then Q stun the target under their own tower > W > E for a guaranteed tower dive.",
      "E placement ahead of the target's escape path, then Q stun them into the E zone for the slow and shield while W-ing for damage."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Volibear's passive lightning chain and W healing make his clear healthy and decent speed.",
      "W a camp twice to proc the wound mark for bonus damage and healing on the second bite; always double-W large monsters.",
      "Volibear's tower-disabling R makes him the best tower-diving jungler in the game; gank pushed lanes and use R to disable the tower for free kills."
    ],
    earlyGame: "Gank with Q movespeed + stun after your first clear; Volibear's early damage and CC are strong, and his R makes tower dives safe starting at level 6.",
    midGame: "Force tower dives with R to crack plates and accelerate your team's gold lead; no other jungler can disable towers for risk-free dives.",
    lateGame: "Frontline in teamfights using Q stun on priority targets, W for sustain, and E for the shield; R can disable the enemy base towers for siege pressure.",
    commonMistakes: [
      "Not using R to disable towers during ganks; the tower disable is the most unique and powerful part of Volibear's kit.",
      "Forgetting to W a target twice for the empowered second bite; the wound mark bonus damage and healing is significant.",
      "Building full damage instead of bruiser/tank; Volibear needs to survive in the frontline to get multiple W bites off."
    ],
    powerSpikeReminders: [
      "Level 3 with Q stun + W bite + E shield gives you one of the strongest early gank combos in the game.",
      "Level 6 R tower disable is your signature power spike; immediately look for a tower dive gank.",
      "Iceborn Gauntlet or Trinity Force first item gives you the Spellblade proc and tankiness to dominate mid-game fights."
    ]
  },

  Warwick: {
    combos: [
      "Q (Jaws of the Beast) hold to dash through the target, then auto > E (Primal Howl) fear > auto > Q again for a full trade.",
      "R (Infinite Duress) to leap and suppress the target from long range, then Q through them > E fear for extended lockdown.",
      "When ganking, activate E for damage reduction, walk at the target (W gives movespeed toward low-HP enemies), auto > Q hold to follow flashes/dashes > E recast for fear."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; Warwick's passive healing and Q sustain keep him near full HP throughout the clear.",
      "Warwick's W blood scent gives movespeed toward low-HP enemies and reveals them; gank lanes where enemies are below 50% HP for free movespeed.",
      "Hold Q to follow dashes and flashes; if you press Q during the enemy's dash, Warwick will follow them to their destination."
    ],
    earlyGame: "Gank lanes with low-HP enemies using W blood scent for movespeed; Warwick's sustain and dueling power make him one of the strongest level 3 junglers.",
    midGame: "Use R to engage on priority targets from long range; Warwick's suppress is one of the longest CC abilities in the game and sets up kills for your team.",
    lateGame: "Frontline with E damage reduction and fear, then R a carry to lock them down; Warwick's sustain in extended fights makes him deceptively tanky.",
    commonMistakes: [
      "Tapping Q instead of holding it to follow dashes; hold-Q is one of Warwick's most important mechanics for sticking to mobile targets.",
      "Not activating E before engaging; the damage reduction keeps you alive during the initial burst, and the fear recast provides crucial CC.",
      "Using R at close range; Infinite Duress leap range scales with movespeed, so activate W blood scent for maximum R range."
    ],
    powerSpikeReminders: [
      "Level 3 with Q sustain, W blood scent, and E fear makes Warwick one of the best early duelists and gankers.",
      "Level 6 R gives you long-range engage with a suppress that is devastating in ganks and picks.",
      "Blade of the Ruined King synergizes perfectly with Warwick's attack speed steroid from W and on-hit passive."
    ]
  },

  Wukong: {
    combos: [
      "E (Nimbus Strike) to gap close > auto > Q (Crushing Blow) auto-reset for armor shred > R (Cyclone) to knock up and spin.",
      "W (Warrior Trickster) clone to stealth, reposition behind the target, then E > Q > R for a surprise engage from an unexpected angle.",
      "R1 (first spin) to knock up > walk with them during the spin > R2 (second spin) for a second knockup on grouped enemies for extended CC chain."
    ],
    tradingPatterns: [
      "Full clear Red > Krugs > Raptors > Wolves > Blue > Gromp; use E on multi-monster camps for AoE and Q auto-reset on every camp for faster clears.",
      "Wukong's clone (W) can tank camp damage; drop the clone and reposition to let it absorb hits while you deal damage.",
      "After level 6, Wukong's gank combo with E > Q > R is extremely powerful; look for ganks on lanes that are pushed up."
    ],
    earlyGame: "Full clear to level 4-5 then look for E > Q ganks; Wukong's pre-6 ganks are decent but his level 6 double-knockup is his real power spike.",
    midGame: "Force teamfights around objectives; Wukong's double R knockup on grouped enemies is one of the most devastating teamfight ultimates in the game.",
    lateGame: "Flank with W stealth and E > R into the backline; a 3+ man double knockup wins any teamfight and Wukong's armor shred from Q helps your entire team deal damage.",
    commonMistakes: [
      "Using R2 immediately after R1 instead of waiting; space out the two spins to maximize knockup duration and zone control.",
      "Forgetting to use W clone for stealth repositioning before engaging; the clone trick is crucial for flanks.",
      "Building full assassin instead of bruiser; Wukong needs to survive in the middle of the fight to get both R spins off."
    ],
    powerSpikeReminders: [
      "Level 6 with double R knockup is your biggest spike; the double knockup is nearly 2 seconds of CC on the entire enemy team.",
      "Black Cleaver first item synergizes with R multi-hit to shred armor on the entire enemy team simultaneously.",
      "Level 11 R rank 2 increases the spin damage significantly; you become a major teamfight threat at this point."
    ]
  },

  "Xin Zhao": {
    combos: [
      "E (Audacious Charge) to dash to the target > auto > Q (Three Talon Strike) for three enhanced autos (third hit knocks up) > W (Wind Becomes Lightning) during Q for AoE damage.",
      "W (thrust) poke from range > E dash when it hits > Q three autos for knockup > R (Crescent Guard) to knock back everyone except your target.",
      "R to isolate the enemy carry from their team, then E > Q knockup > auto them down inside your R circle while their team can't help."
    ],
    tradingPatterns: [
      "Three-camp into gank (Red > Raptors > Krugs or Blue > Gromp > Wolves) is Xin Zhao's ideal path; his level 3 ganks with E > Q knockup are among the best in the game.",
      "Xin Zhao clears with E to gap close to camps, auto > Q three-hit combo, and W for AoE; his single-target clear is fast but multi-camps are slower.",
      "Always look to gank or invade after your first three camps; Xin Zhao falls off with time so generating early leads is critical."
    ],
    earlyGame: "Three-camp into an aggressive gank or invade; Xin Zhao's level 3 with E > Q knockup is one of the strongest early ganks in the game.",
    midGame: "Use R to isolate carries in teamfights; dash to the enemy ADC, knock up with Q, then R to push away everyone else and 1v1 them.",
    lateGame: "Xin Zhao falls off late; your job is to peel or isolate one target with R and hope your team wins the rest of the fight.",
    commonMistakes: [
      "Full-clearing instead of ganking early; Xin Zhao's power budget is front-loaded and wasting it by farming is a losing strategy.",
      "Using R to engage instead of after diving in; R should be used to isolate your target from their team, not as a gap closer.",
      "Not finishing Q three-hit combo; the third hit knockup is your primary CC and skipping it by using abilities too fast wastes it."
    ],
    powerSpikeReminders: [
      "Level 3 with E dash + Q knockup is your strongest point relative to the game; force ganks and invades immediately.",
      "Level 6 R gives you carry isolation and damage immunity from outside the circle; use it to turn teamfights into 1v1s.",
      "Eclipse or Trinity Force first item gives you the damage and sustain to dominate early skirmishes and snowball the game."
    ]
  },

  Zac: {
    combos: [
      "E (Elastic Slingshot) to launch from fog of war for the long-range knockup, then Q (Stretching Strikes) to grab two enemies and slam them together, W (Unstable Matter) for AoE.",
      "E knockup into R (Let's Bounce!) to chain the knockup into bounces that displace the entire enemy team, then Q to slam two targets together.",
      "Flash during E charge to change your landing position, surprising enemies who thought they dodged the slingshot."
    ],
    tradingPatterns: [
      "Full clear Blue > Gromp > Wolves > Raptors > Red > Krugs; Zac's W AoE and blob pickup healing make his clear healthy, though slower than average.",
      "Always pick up blobs (passive chunks) during clears to heal; walking over them restores %max HP which is essential for staying healthy.",
      "Zac's E (slingshot) range is enormous; gank from deep in the jungle over multiple walls for angles that are impossible to ward against."
    ],
    earlyGame: "Full clear to level 4 and look for E slingshot ganks from unexpected angles over walls; Zac's gank range is the longest of any jungler in the game.",
    midGame: "Force teamfights with E > R engages; Zac's AoE knockup and displacement disrupts entire teams and sets up your carries to clean up.",
    lateGame: "Frontline with massive %HP scaling; E engage into R displacement controls entire teamfights, and your passive (revive) gives you a second chance if you die.",
    commonMistakes: [
      "Charging E from a visible position; always slingshot from fog of war or over walls where the enemy can't see you charging.",
      "Not picking up blobs during fights; each blob heals 4% max HP and Zac's survivability depends on collecting them.",
      "Using R immediately after E; sometimes it's better to Q two enemies together first, then R to displace the rest."
    ],
    powerSpikeReminders: [
      "Level 4 after full clear unlocks your long-range E slingshot ganks that bypass all conventional ward spots.",
      "Level 6 R adds massive teamfight disruption on top of your already-strong E knockup engage.",
      "Jak'Sho or Radiant Virtue completion makes you nearly impossible to kill while your %max HP damage remains relevant."
    ]
  }
};
