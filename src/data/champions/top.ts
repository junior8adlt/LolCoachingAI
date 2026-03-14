export interface ChampionCoaching {
  combos: string[];
  tradingPatterns: string[];
  earlyGame: string;
  midGame: string;
  lateGame: string;
  commonMistakes: string[];
  powerSpikeReminders: string[];
}

export const topChampions: Record<string, ChampionCoaching> = {
  Aatrox: {
    combos: [
      "Q1 > E forward > Q2 > Q3 (chain all three Qs with E repositioning for sweetspot hits)",
      "W > Q1 sweetspot > E > Q2 sweetspot > Q3 (use W pull to guarantee Q sweetspots)",
      "Flash > Q3 > R (flash onto backline with final Q knockup then ult for teamfight engage)",
    ],
    tradingPatterns: [
      "Walk up and Q1 sweetspot the enemy when they go for a last hit, then immediately E back to safety before they can retaliate.",
      "Land W first to force the enemy to sidestep, then chain Q1 and Q2 sweetspots while they are slowed or pulled back.",
      "Short trade with Q1 sweetspot into passive auto for bonus damage, then disengage and wait for cooldowns.",
    ],
    earlyGame: "Play around Q cooldown windows and look for sweetspot poke when the enemy walks up to CS; your level 3 all-in with Q-E-W is very strong if you land sweetspots.",
    midGame: "Group for skirmishes and use R aggressively to drain-tank through fights; look for flanks where you can land multi-man Q knockups.",
    lateGame: "Serve as a frontline threat who forces the enemy to focus you during World Ender; prioritize hitting backline carries with Q3 flash engage.",
    commonMistakes: [
      "Using E aggressively for gap closing instead of saving it to reposition Q sweetspots during the combo.",
      "Activating R too early before a fight starts, wasting the revive timer and bonus AD window.",
      "Spamming Q without aiming for sweetspots, losing the majority of your damage and knockup potential.",
    ],
    powerSpikeReminders: [
      "Level 3 with all three abilities is your first strong all-in window with full Q combo and W chain.",
      "Eclipse or Black Cleaver completion makes your sustained trades significantly stronger with armor shred or shield procs.",
      "Level 6 R gives you the drain-tank identity; force an all-in immediately when you hit 6 before the opponent if possible.",
    ],
  },

  Ambessa: {
    combos: [
      "E dash in > Q > W > auto > Q recast (gap close then burst with ability weave and passive autos)",
      "R engage > E > Q > W > auto resets (ult onto target then chain full rotation with passive procs)",
      "W > Flash > R > E > Q (flash-ult engage from fog of war for picks)",
    ],
    tradingPatterns: [
      "Use E to dash in for a quick Q-auto trade, then immediately dash back out with E recast to minimize retaliation.",
      "Wait for the enemy to use a key cooldown, then W in for the shield and trade aggressively with Q and autos.",
      "Poke with Q at max range when the enemy goes for CS, saving E for disengage if they try to engage back.",
    ],
    earlyGame: "Trade aggressively with your passive-empowered autos after abilities and look to snowball through short trades; manage your stamina resource carefully to avoid going empty mid-fight.",
    midGame: "Use R to make picks in side lanes or flank in skirmishes; your mobility and burst make you an excellent diver on squishy targets.",
    lateGame: "Look for flanks with R to access enemy carries in teamfights; you scale well with items but need to find angles rather than running straight into the frontline.",
    commonMistakes: [
      "Burning all dashes aggressively and having no escape when the enemy jungler arrives for a gank.",
      "Ignoring passive auto resets between abilities, losing a large chunk of your total damage output.",
      "Using R purely for damage instead of using it as a repositioning tool to access priority targets.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q and E gives you strong short trade potential with dash-in, Q, dash-out patterns.",
      "First item completion spikes your burst significantly; look for aggressive all-ins once you finish your mythic.",
      "Level 6 R transforms you into a dive threat; coordinate with your jungler for tower dives.",
    ],
  },

  Camille: {
    combos: [
      "E onto wall > E2 stun > Q1 auto > W slow > Q2 true damage auto (standard engage combo)",
      "R > E onto wall > E2 stun > Q1 > W > Q2 (lock down target with ult then full rotation)",
      "E > Flash (redirect E2 mid-flight to stun from unexpected angle)",
    ],
    tradingPatterns: [
      "Charge Q1 on a minion, wait for the true damage timer on Q2, then E in for a quick Q2 true damage auto and immediately walk away.",
      "Use W at max range to poke and heal when the enemy stands in the outer half; this is your safest trading tool in losing matchups.",
      "E onto a wall near the enemy, land the stun, auto-Q1-auto, then walk away before Q2 timer to take a safe short trade.",
    ],
    earlyGame: "Play for short trades with Q2 true damage procs and W sustain; avoid extended trades before Sheen as your base stats are weaker than most bruisers early.",
    midGame: "Split push with Trinity Force and use E mobility to escape ganks; take 1v1s aggressively as your Q2 true damage shreds anyone.",
    lateGame: "Use R to isolate and lock down the enemy carry in teamfights; your Q2 true damage percentage scaling makes you a lethal assassin-bruiser late game.",
    commonMistakes: [
      "Using E aggressively without vision and getting collapsed on with no escape route.",
      "Not waiting for Q2 true damage timer before hitting the enemy, wasting your biggest damage source.",
      "Using W for poke but standing too close, missing the outer half bonus damage and heal.",
    ],
    powerSpikeReminders: [
      "Sheen on first back transforms your Q2 trade damage; look for aggressive E-Q2 trades immediately.",
      "Trinity Force completion is your biggest power spike; you win most 1v1s at this point.",
      "Level 6 R gives you guaranteed lockdown for ganks and 1v1 kill threat on squishy targets.",
    ],
  },

  "Cho'Gath": {
    combos: [
      "Q knockup > W silence > auto > E auto (layer CC and weave autos with E spikes)",
      "Flash > R feast (flash onto a low target for execute with feast true damage)",
      "Q > Flash (redirect Q placement during cast animation for surprise knockup)",
    ],
    tradingPatterns: [
      "Land Q on the enemy when they walk up to last hit, then follow with W silence to prevent retaliation abilities and walk away.",
      "Use E-empowered autos to poke in lane whenever the enemy stands near their minion wave for splash damage.",
      "Play safe and farm with E spike autos from range in difficult matchups, using passive sustain to stay healthy.",
    ],
    earlyGame: "Farm safely with E-empowered autos and use passive sustain to survive lane; look for Q knockups when the enemy overextends but do not force trades.",
    midGame: "Stack R on cannon minions and champions whenever possible; group for objectives where your R can secure dragon or baron.",
    lateGame: "Serve as a massive frontline tank with stacked R health; use Q and W to peel for carries or flash-R to execute a priority target.",
    commonMistakes: [
      "Missing Q consistently because of the long delay; aim where the enemy is walking, not where they currently stand.",
      "Wasting R feast on minions when a champion kill or objective fight is coming soon.",
      "Not using W silence to interrupt key enemy channels and dashes during fights.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you enormous burst and starts your health stacking; try to use it on champions for permanent stacks.",
      "Rod of Ages or Heartsteel completion combined with R stacks makes you unkillable in mid-game fights.",
      "Each R stack permanently increases your health and R damage; you outscale most top laners if you stack efficiently.",
    ],
  },

  Darius: {
    combos: [
      "E pull > auto > W reset > Q heal (pull in, auto-W for slow, then Q blade edge for heal and bleed)",
      "E > auto > W > auto > Q > R (full stack combo into Noxian Guillotine execute at 5 bleed stacks)",
      "Flash > E > auto > W > Q > R (flash-pull engage for guaranteed kill combo)",
    ],
    tradingPatterns: [
      "Walk into the enemy and auto-W for a quick bleed stack trade, then Q at the edge as they disengage to heal and add another stack.",
      "Use E pull only when the enemy uses their dash or escape, then run them down with ghost and auto-W resets to stack bleed.",
      "In losing matchups, use Q blade edge at max range to farm and poke simultaneously while sustaining with the heal.",
    ],
    earlyGame: "Darius is one of the strongest level 1 champions; auto-attack aggressively with passive bleed and zone the enemy off CS from the start.",
    midGame: "Use Ghost to run down enemies in side lane and look for teleport flanks in teamfights where you can stack bleed on multiple targets for R resets.",
    lateGame: "You fall off against kiting comps so look for flanks and Ghost engages; if you get 5-stack resets in a teamfight you can still pentakill.",
    commonMistakes: [
      "Using E pull at the start of a trade when the enemy still has their escape ability available.",
      "Hitting Q too close to the enemy (handle damage instead of blade edge), missing both the bonus damage and heal.",
      "Using R before reaching 5 passive bleed stacks, losing massive true damage and the reset potential.",
    ],
    powerSpikeReminders: [
      "Level 1 with passive bleed is your strongest relative power point; auto-attack the enemy repeatedly to establish lane dominance.",
      "Trinity Force or Stridebreaker completion gives you the sticking power to run down anyone in a 1v1.",
      "Level 6 R execute combined with 5-stack passive is a guaranteed kill on anyone below 30-40% HP.",
    ],
  },

  "Dr. Mundo": {
    combos: [
      "Q cleavers to slow > E auto reset > auto > Q (poke with Q, close gap, E empowered auto for burst)",
      "R > Ghost > Q > E auto > run them down (activate ult for regen and move speed then chase)",
      "Q > Flash > E auto (flash-E for surprise burst on a fleeing low-health target)",
    ],
    tradingPatterns: [
      "Throw Q cleavers at the enemy whenever they walk up to CS; the percentage health damage and slow chips them down safely from range.",
      "Activate E and walk up for an empowered auto-attack trade when the enemy misses a key ability, then immediately walk back.",
      "Farm safely with Q from range in hard matchups and rely on passive canister pickups for sustain until you outscale.",
    ],
    earlyGame: "Survive lane with Q farming and passive health canister pickups; you are weak pre-6 so avoid extended trades against fighters and play for CS.",
    midGame: "With R and one completed item you become nearly unkillable in side lane; shove waves and draw pressure while your team takes objectives.",
    lateGame: "Run at the enemy backline with R and force them to focus you; your tank stats and regeneration will absorb enormous damage for your team.",
    commonMistakes: [
      "Playing aggressively before level 6 when Mundo is one of the weakest early-game top laners.",
      "Not picking up passive health canisters that drop, losing significant free sustain in lane.",
      "Building full damage instead of tank; Mundo scales with health and needs to be unkillable to function.",
    ],
    powerSpikeReminders: [
      "Level 6 R transforms you from a weak laner into a sustain monster; play aggressively once you hit 6.",
      "Heartsteel or Warmog's completion synergizes with your ultimate's percentage health regeneration.",
      "Level 11 and 16 R upgrades massively increase your regen; you become a raid boss at 2-3 items.",
    ],
  },

  Fiora: {
    combos: [
      "Q dash to vital > auto > E1 slow > E2 crit > Q to next vital (chain vitals with Q resets)",
      "W riposte (time it to block enemy CC) > Q to vital > auto > E (block CC then punish during their recovery)",
      "R > Q vital > auto > E > Q vital > Q vital > Q vital (pop all four ult vitals rapidly for the heal zone)",
    ],
    tradingPatterns: [
      "Q to a vital proc when the enemy walks up, auto once, then immediately walk away; the vital burst and move speed make this trade heavily in your favor.",
      "Stand near a wall to force the vital to spawn in an accessible position, then Q-auto for a guaranteed proc.",
      "Bait the enemy's key CC ability, then W riposte it for the attack speed slow and stun, converting their aggression into your kill window.",
    ],
    earlyGame: "Trade with Q-vital procs and disengage; respect strong early laners until you have Sheen, then start taking longer trades with E auto resets.",
    midGame: "Split push relentlessly with Trinity Force; you win almost every 1v1 and can 1v2 if you riposte correctly and proc R vitals.",
    lateGame: "You are the strongest 1v1 champion in the game late; maintain side lane pressure and force multiple enemies to answer you.",
    commonMistakes: [
      "Using W riposte randomly instead of timing it to block enemy CC for the guaranteed stun return.",
      "Chasing enemies without proccing vitals, losing the majority of your damage and healing.",
      "Grouping for teamfights instead of split pushing where Fiora excels as a 1v1 duelist.",
    ],
    powerSpikeReminders: [
      "Sheen on first back makes your vital Q procs deal massive burst; look for aggressive trades immediately.",
      "Ravenous Hydra completion gives you wave clear and sustain to split push indefinitely.",
      "Level 6 R makes you a 1v1 kill threat against any champion if you can proc all four vitals.",
    ],
  },

  Gangplank: {
    combos: [
      "Passive auto > Q Parrrley (apply passive burn then Q for bonus damage and Silver Serpent gold)",
      "E barrel at feet > auto barrel at 1 HP > chain E second barrel > Q second barrel (one-part barrel into chain for poke)",
      "E barrel > E barrel chain > Q first barrel (triple barrel chain: place two barrels, Q the first to chain explode for long-range burst)",
    ],
    tradingPatterns: [
      "Place a barrel near the enemy wave, wait for it to tick to 1 HP, then Q the barrel to zone and chunk with splash damage.",
      "Walk up with passive-empowered auto attack for the true damage burn, then Q as you disengage for a two-hit trade.",
      "In hard matchups, use Q on the enemy only when Grasp is charged to sustain and poke; otherwise Q minions for gold.",
    ],
    earlyGame: "Farm with Q for Silver Serpents and Grasp procs; your early game is weak so focus on CS and scale for your barrel power spikes.",
    midGame: "Look for barrel combo poke in skirmishes and use R globally to assist your team; your barrel crits start chunking squishies hard with Essence Reaver.",
    lateGame: "Full-build GP barrel crits can one-shot an entire backline; position barrels in chokepoints and look for multi-man chains before objectives.",
    commonMistakes: [
      "Placing barrels too early and letting the enemy auto them down before you can chain.",
      "Forgetting to W cleanse CC early enough in fights, dying to burst that could have been survived.",
      "Not farming enough Silver Serpents early; you need to upgrade R to make your global presence impactful.",
    ],
    powerSpikeReminders: [
      "Sheen first back makes your Q poke significantly stronger; start bullying with Grasp-Q trades.",
      "Essence Reaver plus Infinity Edge is your critical power spike where barrel crits start deleting squishies.",
      "Each R upgrade from Silver Serpents massively increases your global teamfight impact.",
    ],
  },

  Garen: {
    combos: [
      "Q silence > E spin > R execute (run in with Q speed, silence, spin on them, ult when low)",
      "Flash > Q > E > Ignite > R (flash-Q surprise engage for guaranteed kill combo)",
      "Q > E > W shield (trade with Q-E while using W to block the enemy's retaliation damage)",
    ],
    tradingPatterns: [
      "Activate Q for the move speed, run at the enemy for the empowered auto silence, then immediately E spin and walk away after 2-3 ticks.",
      "Use W defensively at the start of the enemy's trade to reduce their damage by 30%, then retaliate with Q-E when their cooldowns are spent.",
      "Stay in the bush to drop minion aggro between trades and use passive regeneration to heal up for the next trade window.",
    ],
    earlyGame: "Trade with Q-E short trades and disengage; use bushes to drop aggro and abuse passive regen to outsustain the enemy in short bursts.",
    midGame: "Split push with your strong wave clear and look to run at squishy targets with Q in skirmishes; your villain R execute damage is lethal.",
    lateGame: "Serve as a tanky frontline who can flash-Q-silence a carry and spin on them; your R execute secures kills even on tanky targets.",
    commonMistakes: [
      "Running at the enemy predictably without Q move speed, getting kited and poked before reaching them.",
      "Using W randomly instead of timing it to block the enemy's key damage ability for maximum damage reduction.",
      "Ulting too early when the enemy is above execute threshold; wait for the red indicator showing the kill threshold.",
    ],
    powerSpikeReminders: [
      "Level 6 R execute is one of the highest burst abilities in the game; force all-ins when the enemy is around 30% HP.",
      "Berserker Greaves plus attack speed build makes your E spin deal significantly more ticks of damage.",
      "Level 11 R upgrade increases execute threshold substantially; you can finish targets from surprisingly high HP.",
    ],
  },

  Gnar: {
    combos: [
      "Mini: Q boomerang > auto > auto > auto (kite with Q slow and hyper passive stacks for percent HP burst)",
      "Mega: R into wall > W stun > Q slow > E hop (slam enemies into a wall with R then chain all CC)",
      "Mini: E hop > transform mid-air to Mega > R > W > Q (hop in while transforming for surprise Mega engage)",
    ],
    tradingPatterns: [
      "In Mini form, auto-Q-auto for three hits of Hyper passive percent HP damage, then use E hop to disengage safely.",
      "Manage rage meter to transform at the right moment; threaten Mega all-in when rage is high to zone the enemy off CS.",
      "In Mini form against melee champions, kite backwards with Q slow and Hyper procs, never letting them reach you.",
    ],
    earlyGame: "Poke and kite in Mini Gnar with auto-Q-auto Hyper procs; avoid all-ins from bruisers and manage your rage to transform at opportune moments.",
    midGame: "Look for Mega Gnar R engages in skirmishes, especially near walls and in jungle corridors where you can stun multiple enemies.",
    lateGame: "Your Mega Gnar R into a wall can single-handedly win teamfights; position to transform near objectives and look for multi-man wall slams.",
    commonMistakes: [
      "Transforming into Mega Gnar at the wrong time, either wasting it in lane or not having it for a teamfight.",
      "Standing too close to melee champions in Mini form instead of using your range advantage to kite.",
      "Using Mega R without a wall nearby, missing the stun component which is the majority of its value.",
    ],
    powerSpikeReminders: [
      "Level 6 Mega R is a massive teamfight engage tool; communicate with your team to fight when your rage is high.",
      "Black Cleaver completion makes your Mini Gnar kiting shred armor stacks rapidly with Hyper and Q.",
      "Frozen Mallet or similar slow items make Mini Gnar kiting inescapable for melee champions.",
    ],
  },

  Gragas: {
    combos: [
      "E body slam > auto > W empowered auto > Q (E in, auto, W reset auto for burst, Q as they flee)",
      "E > Flash (redirect body slam mid-dash for surprise long-range stun) > W auto > Q > R",
      "R > E > Q (ult to displace a target into your team, then E follow for the stun)",
    ],
    tradingPatterns: [
      "E into the enemy for the stun, immediately W-empowered auto for burst, then Q on the ground as you walk away for deferred damage.",
      "Charge Q in a bush and wait for the enemy to walk over it, then detonate for poke damage without committing your E.",
      "Use W damage reduction before trading to tank the enemy's retaliation while your W-empowered auto deals percentage HP damage.",
    ],
    earlyGame: "Trade with E-stun into W-auto for short burst trades; your W damage reduction and sustain let you outtrade most champions in short exchanges.",
    midGame: "Roam with your E-flash engage and R displacement to set up picks; Gragas is excellent at creating advantages across the map.",
    lateGame: "Use R to displace key targets into your team or peel enemy divers away from your carries; your displacement utility is game-changing.",
    commonMistakes: [
      "Using R offensively and accidentally knocking enemies to safety instead of into your team.",
      "Not activating W before trading, missing both the damage reduction and the empowered auto damage.",
      "Detonating Q too early before it charges to full damage; let it tick for maximum burst.",
    ],
    powerSpikeReminders: [
      "Level 3 with E-W-Q gives you a strong burst trade combo that most top laners cannot match.",
      "Iceborn Gauntlet or Hextech Rocketbelt completion defines your playstyle as tank or AP burst.",
      "Level 6 R displacement is one of the best playmaking tools in the game; look for picks immediately.",
    ],
  },

  Gwen: {
    combos: [
      "Auto x4 > Q snip (stack passive with 4 autos then Q for empowered center snips)",
      "E attack speed steroid > auto x4 > Q > R1 > auto > R2 > auto > R3 (full all-in with E steroid and R weaving)",
      "W mist > E in > auto x4 > Q > R (use W for untargetability zone, E in for range and attack speed, then full combo)",
    ],
    tradingPatterns: [
      "Auto minions to 2-3 stacks, then E toward the enemy for an empowered auto and Q with stacked snips, then walk out.",
      "Use W mist to deny ranged harass and force melee champions to walk into your zone where you win with sustained damage.",
      "Short trade with E-auto-Q when you have stacks, using the E bonus range and attack speed to get the trade done quickly.",
    ],
    earlyGame: "Stack your passive on minions before trading and look for short E-auto-Q trades; your early game is weak so focus on CS and hitting level 6.",
    midGame: "Split push with Riftmaker and look for 1v1s; your sustained damage with stacked Q and R melts anyone who fights you extended.",
    lateGame: "In teamfights, use W to zone enemy ranged threats and R to deal massive AP damage; Gwen shreds tanks with passive percent HP damage.",
    commonMistakes: [
      "Using Q without stacking passive autos first, dealing minimal damage with unempowered snips.",
      "Placing W poorly and either trapping yourself or not covering the zone you need protection from.",
      "Not weaving auto attacks between R casts; the autos are a massive portion of your total damage.",
    ],
    powerSpikeReminders: [
      "Nashor's Tooth completion makes your auto-attack stacking significantly faster and adds on-hit AP damage.",
      "Riftmaker completion gives you omnivamp that synergizes perfectly with your sustained damage pattern.",
      "Level 6 R adds enormous burst to your all-in; force a fight when you hit 6 with stacked passive.",
    ],
  },

  Heimerdinger: {
    combos: [
      "Place H-28G turrets (Q) in triangle > W rockets > E stun (set up turrets then poke and CC enemies in the kill zone)",
      "E stun > W rockets > R-Q mega turret (land stun, burst with W, then drop empowered turret for sustained zone damage)",
      "R-E mega stun grenade > W > Q turrets (use upgraded stun for massive AoE CC in teamfights)",
    ],
    tradingPatterns: [
      "Set up three turrets in a triangle near the wave and let them poke the enemy whenever they walk up to CS; you win attrition trades passively.",
      "Land E stun on the enemy when they commit to attacking a turret, then W rockets for a burst trade while they are locked down.",
      "In ganks, place turrets between you and the threat and kite backwards; Heimer turns ganks into double kills with turret zone control.",
    ],
    earlyGame: "Set up turrets to control the wave and zone the enemy; you auto-push so ward deeply and use turret placement to survive ganks.",
    midGame: "Group for objectives and set up turrets around dragon or baron; your zone control makes it extremely difficult for enemies to contest.",
    lateGame: "Stay with your team and create turret fortifications around objectives; R-E mega stun can single-handedly win teamfights with AoE CC.",
    commonMistakes: [
      "Placing all three turrets in one spot where they can be cleared by a single AoE ability.",
      "Pushing without vision and getting ganked repeatedly; Heimer's push is constant so deep wards are mandatory.",
      "Using R-Q mega turret when R-E mega stun would have been better for teamfight CC.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q turrets and W rockets gives you incredible lane pressure that most melees cannot handle.",
      "Zhonya's Hourglass lets you bait enemies into your turret zone, stasis, and let turrets finish them.",
      "Level 6 R upgrades give you either massive zone damage (R-Q), burst (R-W), or CC (R-E) depending on the situation.",
    ],
  },

  Illaoi: {
    combos: [
      "E grab spirit > Q tentacle slam > W leap (pull spirit, slam it with Q, then W to trigger tentacle attacks on spirit)",
      "E spirit > R leap (slam for tentacles) > W > Q (pull spirit then ult for multiple tentacle spawns that all slam the spirit)",
      "Flash > E > R > W > Q (flash-E grab into immediate R for a guaranteed kill zone)",
    ],
    tradingPatterns: [
      "Land E to pull the enemy's spirit, then attack it with Q and W to transfer damage while they either fight in your tentacle zone or run and take damage.",
      "Use Q at max range to poke through the minion wave and heal off the slam; this is safe harass that zones the enemy.",
      "Position near walls with tentacles and bait the enemy into trading near them; W activates all nearby tentacles to slam.",
    ],
    earlyGame: "Poke with Q and look for E spirit grabs; if you land E, commit to attacking the spirit to chunk the enemy from range.",
    midGame: "Set up tentacles in side lane and look for 1v2 outplays when ganked; R in a tentacle-rich area can win any numbers disadvantage.",
    lateGame: "Stay in side lane where your tentacle zone is strongest; in teamfights, land E on a frontliner and R for massive AoE healing and damage.",
    commonMistakes: [
      "Missing E consistently and becoming useless; without E, Illaoi cannot force meaningful trades.",
      "Using R without landing E first, losing the spirit interaction that multiplies tentacle slams.",
      "Not setting up tentacles on walls before fighting; your damage relies on having tentacles nearby to slam.",
    ],
    powerSpikeReminders: [
      "Level 3 with E gives you kill pressure; landing E near tentacles forces the enemy to either fight or take massive damage.",
      "Black Cleaver completion makes your tentacle slams shred armor stacks, amplifying all subsequent hits.",
      "Level 6 R in a tentacle zone is one of the strongest 1v2 tools in the game; bait ganks near your tentacles.",
    ],
  },

  Irelia: {
    combos: [
      "E1 > Q to minion > E2 stun > Q to stunned enemy > auto > Q (set up stun while dashing through minions for passive stacks)",
      "R mark > Q reset > auto > Q (ult to mark and slow, then Q for reset and passive stacking)",
      "E1 > Flash > E2 (flash-redirect E stun for unexpected angle) > Q > auto > W > Q",
    ],
    tradingPatterns: [
      "Stack passive to 4 on minions with Q resets, then all-in the enemy with fully stacked auto attacks that deal massive bonus damage.",
      "Look for low-health caster minions near the enemy, Q through them for resets, then E stun the enemy and Q onto them.",
      "Use W damage reduction to tank the enemy's burst ability, then retaliate with Q and passive-stacked autos.",
    ],
    earlyGame: "Stack passive on minions before trading; with 4 passive stacks your auto attacks are massively empowered and you win almost every level 1-2 fight.",
    midGame: "Look for flanks in teamfights where you can Q through the backline and stick to carries; Irelia with BotRK melts anyone.",
    lateGame: "You fall off in 5v5 teamfights; split push and look for picks on isolated targets where your 1v1 dueling excels.",
    commonMistakes: [
      "Fighting without 4 passive stacks; Irelia without passive is one of the weakest champions in the game.",
      "Using Q on a minion that is not low enough to kill, losing the reset and leaving you stranded.",
      "E-ing in panic and missing the stun; take your time to place E1 and E2 at correct angles.",
    ],
    powerSpikeReminders: [
      "Blade of the Ruined King is Irelia's biggest power spike; you win every 1v1 in the game after completing it.",
      "Level 5 Q has enough base damage to one-shot caster minions for reliable resets in fights.",
      "Level 6 R gives you a long-range engage and mark for guaranteed Q resets on the enemy.",
    ],
  },

  Jax: {
    combos: [
      "Q leap > auto > W reset > auto (jump in, auto-attack, W empowered auto reset for burst)",
      "E counterstrike > Q onto enemy > auto > W > E stun (activate E first, jump in, trade, then stun at the end)",
      "R passive proc (every 3rd auto) > auto > W reset > Q (weave R passive empowered autos with W reset)",
    ],
    tradingPatterns: [
      "Activate E counterstrike, Q onto the enemy, auto-W, then let E stun proc; walk away after the stun for a winning short trade.",
      "Wait for the enemy to auto-attack a minion, then Q in and trade while their auto is on cooldown; Jax punishes bad spacing.",
      "Use E to block the enemy's auto-attack-based trade, then retaliate with autos and W when their damage is negated.",
    ],
    earlyGame: "Jax is weak levels 1-5 against most bruisers; farm with Q-W on minions and look for trades only when E counterstrike can block the enemy's key auto-attack damage.",
    midGame: "Split push with Trinity Force and take towers rapidly; you win most 1v1s and your E makes you extremely hard to duel.",
    lateGame: "Jax is one of the best late-game duelists; split push and force multiple enemies to answer you while your team takes objectives.",
    commonMistakes: [
      "Using Q aggressively without E counterstrike ready, leaving you with no defensive tool after jumping in.",
      "Not weaving auto attacks between abilities; Jax's DPS comes from auto attacks and passive stacking.",
      "Using E too early and stunning nothing; hold E to block enemy autos and time the stun for when they try to disengage.",
    ],
    powerSpikeReminders: [
      "Trinity Force completion transforms Jax into a split push monster who wins most 1v1s.",
      "Level 6 R gives you bonus resistances and every-third-auto empowered strike; your all-in power spikes significantly.",
      "Level 11+ with 2 items, Jax can 1v2 most combinations; play aggressively in side lanes.",
    ],
  },

  Jayce: {
    combos: [
      "Ranged: Q through E gate > W autos (accelerated Q poke then switch to rapid-fire W autos)",
      "Ranged Q-E poke > R transform to Hammer > Q leap > W > E knockback (poke then melee all-in)",
      "Hammer E knockback into wall > W > Q > auto > R transform > Ranged W > autos (melee burst then ranged follow-up)",
    ],
    tradingPatterns: [
      "In Cannon form, use Q through E acceleration gate for long-range poke when the enemy walks up to CS.",
      "Switch to Hammer form and Q-leap onto the enemy after landing a ranged Q poke to finish them with melee burst.",
      "Use Hammer E knockback to disengage when the enemy jumps on you, then switch to Cannon for ranged retaliation.",
    ],
    earlyGame: "Abuse your range advantage in Cannon form with Q-E poke; Jayce is strongest in early levels so establish a CS lead and bully melee champions off the wave.",
    midGame: "Use ranged Q-E poke to siege towers and chunk enemies before teamfights; switch to Hammer for cleanup when enemies are low.",
    lateGame: "You fall off compared to scaling champions; focus on poking with Q-E and peeling with Hammer E knockback rather than diving in.",
    commonMistakes: [
      "Staying in Hammer form and trying to melee trade against champions who outduel you up close.",
      "Using Q without E acceleration gate, dealing significantly less damage and missing the speed boost.",
      "Not utilizing both forms in trades; Jayce's combo power comes from switching between Cannon and Hammer.",
    ],
    powerSpikeReminders: [
      "Level 1-3 Jayce is one of the strongest laners in the game; zone the enemy aggressively with Cannon Q-E poke.",
      "Muramana completion makes your poke deal massive damage; Q-E through gate chunks squishies for 40-50% HP.",
      "Dirk on first back amplifies your lethality poke significantly; look for aggressive plays after buying it.",
    ],
  },

  "K'Sante": {
    combos: [
      "Q > Q > Q3 knockup > W charge > E dash (stack Q twice then knock up with Q3, follow with W and E)",
      "R (slam into wall to enter All Out form) > Q > Q > Q3 > E > W (ult a target through wall then burst in empowered form)",
      "W charge through enemy > Flash (redirect W) > Q3 knockup > R (surprise W-flash engage into ult)",
    ],
    tradingPatterns: [
      "Stack Q twice on minions, then Q3 the enemy for the knockup and follow with a quick auto-W trade before disengaging.",
      "Use E dash through a minion toward the enemy for a quick Q poke, then E back to a minion for safety.",
      "Hold W charge and release it when the enemy commits to a trade, using the damage reduction and dash-through to outtrade.",
    ],
    earlyGame: "Stack Q on minions and look for Q3 knockup trades; your base damage is respectable and W gives you good short trades against aggressive laners.",
    midGame: "Look for R engages to slam a priority target through a wall, isolating them in your All Out form where you deal massively increased damage.",
    lateGame: "Serve as a frontline tank who can R a carry to isolate and delete them; your ability to switch between tank and assassin is unique.",
    commonMistakes: [
      "Using R without a wall behind the enemy, losing the wall slam damage and the isolation value.",
      "Not stacking Q on minions before fights, losing access to the Q3 knockup when you need it.",
      "Staying in All Out form too long and dying because you lose your tank stats during the transformation.",
    ],
    powerSpikeReminders: [
      "Level 6 R fundamentally changes your kit; look for wall-slam opportunities to delete squishy targets.",
      "Iceborn Gauntlet completion gives you tank stats and slow fields that synergize with your Q stacking.",
      "Level 3 with Q3 knockup access gives you strong short trade potential in lane.",
    ],
  },

  Kayle: {
    combos: [
      "Q slow > E empowered auto > auto (poke with Q slow into E execute auto for short trade)",
      "R invulnerability > W heal/speed > Q > E > autos (ult yourself for invulnerability then DPS freely)",
      "Flash > Q > E > autos (flash-Q to catch a fleeing target and run them down with ranged autos post-11)",
    ],
    tradingPatterns: [
      "Pre-6, only trade when the enemy wastes a cooldown; Q-E-auto and immediately back off to minimize retaliation.",
      "At level 6 with ranged autos, poke the enemy with auto attacks whenever they walk up, using Q slow to kite if they engage.",
      "Use W move speed to dodge enemy skillshots and reposition for better trading angles in lane.",
    ],
    earlyGame: "Survive at all costs; Kayle is the weakest early-game champion in top lane so give up CS if necessary and soak XP until level 6 ranged autos.",
    midGame: "Farm side lanes aggressively with your ranged autos and wave clear; avoid teamfights unless you can R a key ally or yourself to turn the fight.",
    lateGame: "Full-build Kayle is one of the strongest champions in the game; position like an ADC and R yourself or a carry when burst comes in.",
    commonMistakes: [
      "Fighting aggressively before level 6 and dying repeatedly; Kayle must play to survive early.",
      "Using R aggressively for damage instead of saving it defensively for the invulnerability.",
      "Not farming enough; Kayle needs items and levels more than almost any other champion.",
    ],
    powerSpikeReminders: [
      "Level 6 gives you permanent ranged auto attacks; the lane dynamic shifts entirely in your favor against melees.",
      "Level 11 gives you AoE waves on auto attacks; your teamfight damage becomes enormous.",
      "Level 16 gives you permanent ascended form with increased range and damage; you are a raid boss at this point.",
    ],
  },

  Kennen: {
    combos: [
      "E lightning rush > W passive auto (mark) > W activate > Q shuriken (E in, apply marks for stun, burst with Q)",
      "E > Flash > R > W > Zhonya's (flash-ult engage into Zhonya's for guaranteed AoE damage and stuns)",
      "Q > W passive auto > W activate (poke from range with Q mark into W proc for stun)",
    ],
    tradingPatterns: [
      "Auto attack with W passive (every 5th auto for mark), then immediately W to proc the mark and add a second mark, creating stun threat.",
      "Q the enemy when they go to CS, then follow with a W passive auto and W activate for the stun if they walk too close.",
      "Use E to dodge enemy engage, then turn and auto-W-Q while they have no cooldowns.",
    ],
    earlyGame: "Abuse your ranged advantage against melee top laners with auto attacks and Q poke; stack W passive marks for stun threats to zone them off CS.",
    midGame: "Look for TP flanks or roams where you can E-flash-R into multiple enemies; Kennen's teamfight engage with ult is devastating.",
    lateGame: "Your primary job is landing a 3+ man R in teamfights; use E-flash-Zhonya's to guarantee maximum AoE stun and damage.",
    commonMistakes: [
      "Using R in lane 1v1 instead of saving it for teamfight-winning multi-man engages.",
      "Standing too close to melee bruisers who can all-in you; maintain max auto-attack range and kite.",
      "Not building Zhonya's Hourglass which is essential for surviving inside your own ult.",
    ],
    powerSpikeReminders: [
      "Level 6 R makes you a teamfight threat; communicate with your team to group for fights.",
      "Hextech Rocketbelt gives you extra engage range to get into the backline for R.",
      "Zhonya's Hourglass lets you E-flash-R-Zhonya's for guaranteed teamfight damage without dying.",
    ],
  },

  Kled: {
    combos: [
      "Q beartrap > E charge > auto > W autos (4 fast hits) > Q pull (Q to tether, E in, W rapid autos, Q pulls after delay)",
      "R charge > E > Q > W autos > E2 (ult in, E through, Q tether, W burst, E2 chase)",
      "Dismount > Q pocket pistol > remount by attacking enemy > full combo (use dismounted Q poke to stack courage, then remount and all-in)",
    ],
    tradingPatterns: [
      "Land Q beartrap and wait for the tether to pull, then E in and W for 4 rapid auto attacks during the pull CC.",
      "Activate W, then E into the enemy to deliver all 4 rapid auto attacks with the attack speed steroid before they can react.",
      "When dismounted, play cautiously and last-hit with Q to build courage; once close to remounting, auto attack aggressively to remount and surprise the enemy.",
    ],
    earlyGame: "Kled is one of the strongest level 2-3 all-in champions; Q tether into E-W burst forces most enemies to burn flash or die.",
    midGame: "Use R to charge across the map and engage fights; Kled ult into a teamfight is one of the best engage tools for starting skirmishes.",
    lateGame: "Look for flanks with R and focus on dismounting management; if you dismount in a bad position you will die instantly.",
    commonMistakes: [
      "Using W randomly on minions when the enemy is nearby; W has a long cooldown and is your primary trading tool.",
      "Getting dismounted and trying to fight instead of backing off to remount safely.",
      "Ulting into the entire enemy team alone without your team close enough to follow up.",
    ],
    powerSpikeReminders: [
      "Level 2-3 with Q and W gives you one of the strongest early all-ins in top lane.",
      "Level 6 R gives you a massive engage tool; look for roams mid or charge back to lane for kill pressure.",
      "Black Cleaver completion makes your W rapid autos shred armor in under a second.",
    ],
  },

  Malphite: {
    combos: [
      "R unstoppable engage > E attack speed slow > Q slow > auto (ult in, E to cripple, Q to slow and chase)",
      "Flash > R (extend ult range for surprise engage) > E > Q > auto",
      "Q poke > Comet proc > walk away (safe ranged poke with Q and Arcane Comet in lane)",
    ],
    tradingPatterns: [
      "Use Q to poke the enemy and steal their move speed; this is your primary trading tool in most matchups.",
      "Let the enemy break your passive shield, back off to let it regenerate, then trade again with Q; you win attrition trades with passive cycling.",
      "In melee matchups, auto-E when the enemy tries to trade to reduce their attack speed, then Q-walk away.",
    ],
    earlyGame: "Farm with Q poke and passive shield cycling; Malphite is weak early so avoid extended trades and focus on reaching level 6.",
    midGame: "Look for R engages on grouped enemies; Malphite ult is one of the best engage tools in the game and you should fight whenever it is available.",
    lateGame: "Your only job is to land a multi-man R on the enemy carries; wait for the right moment and flash-R to guarantee the engage.",
    commonMistakes: [
      "Using R on a single frontline tank instead of waiting to hit multiple squishies in the backline.",
      "Spamming Q and running out of mana early; manage mana carefully and only Q when you can follow up or the enemy cannot retaliate.",
      "Building AP when your team needs a frontline tank; tank Malphite is almost always more valuable than AP Malphite.",
    ],
    powerSpikeReminders: [
      "Level 6 R is your champion's entire identity; you go from a weak laner to one of the best teamfight engagers in the game.",
      "Iceborn Gauntlet or Frozen Heart makes your E attack speed slow even more crippling against AD champions.",
      "Level 11 and 16 R upgrades increase the damage and are huge spikes for your teamfight engage.",
    ],
  },

  Mordekaiser: {
    combos: [
      "E pull > Q slam > auto > auto > auto (pull in, slam with isolated Q, then passive autos with Darkness Rise)",
      "R death realm > E > Q > auto > passive burn (ult to isolate, then full combo in death realm)",
      "Flash > E pull > Q > R (flash-pull for guaranteed engage into ult isolation)",
    ],
    tradingPatterns: [
      "Land E pull to drag the enemy in, then Q for isolated bonus damage and walk away; this short trade is heavily in your favor.",
      "Activate passive with Q-auto-auto on minions near the enemy, then walk at them with the Darkness Rise burn aura and auto attack.",
      "Use Q at max range to poke when the enemy walks up to CS; the isolated Q damage is significant even without E.",
    ],
    earlyGame: "Trade with E pull into isolated Q for burst; once you have passive activated, walk at the enemy with the burn aura for extended trades.",
    midGame: "Use R to isolate the enemy jungler or carry in teamfights, removing them from the fight while your team wins the 4v3.",
    lateGame: "R the enemy carry to delete them in death realm with your stats; even if you die, removing their carry wins the fight for your team.",
    commonMistakes: [
      "Missing E pull and then trying to walk at the enemy; without E, Mordekaiser is easily kited.",
      "Ulting the wrong target; always R the highest-value enemy, not the nearest one.",
      "Not using Q on isolated targets; Q deals 40% bonus damage to isolated enemies which is massive.",
    ],
    powerSpikeReminders: [
      "Level 6 R isolates any target and steals their stats; force a 1v1 in death realm when you hit 6.",
      "Riftmaker completion gives you omnivamp that makes you nearly unkillable in extended fights.",
      "Rylai's Crystal Scepter makes your passive burn slow enemies, ensuring they cannot escape your aura.",
    ],
  },

  Nasus: {
    combos: [
      "Q stack on cannon/minion > repeat (farm Q stacks relentlessly for scaling)",
      "W wither > R > E armor shred > Q empowered auto (wither to slow, ult for stats, E to shred armor, Q to delete)",
      "Flash > W > R > E > Q (flash-wither engage into full combo on a squishy target)",
    ],
    tradingPatterns: [
      "Do not trade early; focus entirely on farming Q stacks and use E only to thin the wave if pushed under tower.",
      "After level 6, activate R and run at the enemy with W wither; your R stats and Q stacks make you a 1v1 threat.",
      "W wither the enemy carry and E the ground under them for armor shred, then Q for a massive damage spike.",
    ],
    earlyGame: "Farm Q stacks and survive; Nasus is one of the weakest early-game champions so give up CS if needed to avoid dying and just soak XP.",
    midGame: "Split push with stacked Q and destroy towers; use W to kite-proof yourself and win 1v1s in side lanes with R.",
    lateGame: "With 500+ Q stacks you two-shot squishies; split push or flank in teamfights to W and delete the enemy carry.",
    commonMistakes: [
      "Trading in lane instead of focusing on Q stacks; every Q last-hit you miss delays your power curve.",
      "Using E to push the wave when you should be freezing near your tower for safe Q farming.",
      "Not using W on the enemy ADC in teamfights; wither is one of the strongest single-target slows in the game.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you bonus health, resistances, and AoE damage; you can fight most champions 1v1 after this.",
      "200 Q stacks is your first meaningful damage threshold; you start winning trades at this point.",
      "Trinity Force or Divine Sunderer completion combined with stacks makes your Q hit like a truck.",
    ],
  },

  Olaf: {
    combos: [
      "Q throw > pick up axe > Q again > auto > E true damage (chain Q throws by picking up axes, then E for burst)",
      "R unstoppable > Ghost > Q > auto > E > Q pickup > auto > E (ult for CC immunity, run at target, chain axes and E)",
      "W lifesteal > auto > E > auto > Q (activate W for attack speed and lifesteal, then trade with E true damage)",
    ],
    tradingPatterns: [
      "Throw Q at the enemy's feet, walk over the axe to pick it up and Q again; the chain-Q damage is Olaf's primary trading pattern.",
      "At low HP, Olaf's passive gives massive attack speed; use W lifesteal and E to turn fights that enemies think they are winning.",
      "E true damage trade when the enemy walks up; it costs health but deals guaranteed damage that ignores armor.",
    ],
    earlyGame: "Olaf is one of the strongest early duelists; throw Q axes at the enemy and run them down with W attack speed; your low-HP passive makes you deceptively strong.",
    midGame: "R and Ghost to run at the enemy backline with CC immunity; you are unkillable and un-CC-able during R.",
    lateGame: "You fall off significantly late game; look to end the game early or use R to dive the backline before you get outscaled.",
    commonMistakes: [
      "Not picking up Q axes to reset the cooldown; axe pickup is essential for sustained damage output.",
      "Using R preemptively before the enemy uses their CC; wait until CC is thrown at you then R to cleanse and be immune.",
      "Playing passively despite being one of the strongest early-game champions; Olaf needs to snowball.",
    ],
    powerSpikeReminders: [
      "Level 1-3 Olaf wins almost every trade with Q-auto-E; fight aggressively from the start.",
      "Goredrinker completion lets you sustain through fights with the active heal at low HP.",
      "Level 6 R CC immunity means you cannot be peeled; use it to dive enemy carries fearlessly.",
    ],
  },

  Ornn: {
    combos: [
      "Q pillar > W breath > E charge into pillar (knockup from E hitting pillar) > auto brittle proc",
      "R ram send > R2 redirect ram back > E into Q pillar > W > auto brittle (chain ult CC into full combo)",
      "W breathfire > auto brittle proc > Q > E into pillar (apply brittle with W, proc it, then combo the rest)",
    ],
    tradingPatterns: [
      "Q a pillar behind the enemy, W fire breath for brittle, then auto to proc brittle for bonus damage and walk away.",
      "Use W fire breath at the end of the enemy's trade to apply brittle and negate damage with the unstoppable shield; then auto for the brittle proc.",
      "Place Q pillar and E charge into it for a knockup when the enemy walks up aggressively; this punishes dive attempts.",
    ],
    earlyGame: "Trade with W brittle into auto proc for short burst trades; use Q-E for disengage and to punish aggressive enemies with knockup.",
    midGame: "Upgrade ally items with passive and look for R engages in teamfights; Ornn provides enormous value through item upgrades alone.",
    lateGame: "Your R engage and ally item upgrades make you one of the most valuable late-game tanks; focus on landing multi-man R rams in teamfights.",
    commonMistakes: [
      "Not upgrading ally items when available; Ornn's passive item upgrades are a massive gold advantage for the team.",
      "Missing E into Q pillar combo, losing the knockup which is your primary CC tool in combos.",
      "Sending R too predictably; vary your R angle and timing to catch enemies off guard.",
    ],
    powerSpikeReminders: [
      "Level 13+ lets you start upgrading ally items; this gives your team thousands of gold worth of free stats.",
      "Level 6 R is a game-changing teamfight engage tool; group with your team when ult is available.",
      "Ornn can buy items in lane with passive, giving you a sustain and stat advantage without needing to recall.",
    ],
  },

  Pantheon: {
    combos: [
      "W empowered stun > auto > Q tap > E (jump-stun, auto, short Q, then E to block damage while retreating)",
      "Empowered W (5 stacks) > auto > auto > auto > empowered Q (full stun with 3 autos then empowered Q execute)",
      "R semi-global drop > E > empowered W > Q (ult behind enemy team, E shield, then W-Q burst)",
    ],
    tradingPatterns: [
      "W stun the enemy, auto attack, tap Q, then E to block their retaliation as you walk away; this is a zero-counterplay short trade.",
      "Save empowered ability for Q execute when the enemy is below 30% HP; empowered Q deals massively increased damage to low targets.",
      "Poke with Q throw at range when the enemy walks up to CS; stack passive to 5 for an empowered ability trade.",
    ],
    earlyGame: "Pantheon has one of the strongest early games; W-auto-Q trades are almost unbeatable and you should aggressively zone enemies from CS.",
    midGame: "Use R to semi-globally impact other lanes and objectives; Pantheon's roaming with R is his biggest mid-game strength.",
    lateGame: "You fall off hard late game; transition to a utility role with W point-click stun and E damage blocking for your carries.",
    commonMistakes: [
      "Wasting empowered ability on E shield instead of saving it for W stun or Q execute.",
      "Not roaming with R mid-game; Pantheon's ult is wasted if you only use it to return to lane.",
      "Trying to split push late game against scaling champions who will outscale you in 1v1s.",
    ],
    powerSpikeReminders: [
      "Level 2-3 Pantheon with W and Q is one of the strongest early all-in champions in the game.",
      "Level 6 R gives you semi-global pressure; look to ult mid lane or to objectives immediately.",
      "Eclipse or Youmuu's first item maximizes your early-game burst; force fights before enemies can itemize armor.",
    ],
  },

  Poppy: {
    combos: [
      "E wall slam > Q > auto > auto (charge into wall for stun, Q buckler, then auto with passive shield)",
      "E wall slam > Q > R charged knockup (wall stun into Q damage then charged R for extended CC)",
      "W anti-dash > E > Q > R tap (block enemy dash with W, then E-Q combo, tap R to knock up)",
    ],
    tradingPatterns: [
      "Look for E wall slam opportunities when the enemy stands near terrain; the stun into Q is Poppy's highest burst combo.",
      "Throw passive buckler by auto-attacking the enemy, pick up the shield, and trade while the shield absorbs their retaliation.",
      "Use W to block enemy dashes reactively, then punish with E-Q while they have no escape.",
    ],
    earlyGame: "Look for E wall slams near terrain and trade with passive shield autos; Poppy is strong into dash-reliant champions with W.",
    midGame: "Peel for your carries with W anti-dash and E wall slams; use R to send away enemy divers or to start picks.",
    lateGame: "Your primary value is W anti-dash zone and R displacement; peel for your carries and deny enemy engage champions.",
    commonMistakes: [
      "Using E away from walls, losing the stun which is the majority of the combo's CC and damage.",
      "Holding R charge too long and getting CC'd, canceling the channel.",
      "Not using W to deny enemy dashes; this is Poppy's most unique and powerful defensive tool.",
    ],
    powerSpikeReminders: [
      "Level 2 with E and Q gives you massive burst if you can find a wall slam.",
      "Sunfire Aegis completion makes you an immovable object in lane with sustained AoE damage.",
      "Against dash-heavy comps, Poppy's value scales enormously; W alone can shut down champions like Irelia or Lee Sin.",
    ],
  },

  Quinn: {
    combos: [
      "E vault > auto (passive Harrier proc) > Q blind > auto (vault off enemy for Harrier mark, auto-proc, blind, auto again)",
      "Q blind > auto Harrier > E vault > auto Harrier (blind first, proc passive, vault, proc second passive)",
      "R behind enemy > cancel R with E vault > Q > auto (roam with R, engage with vault for burst)",
    ],
    tradingPatterns: [
      "Auto the enemy when Harrier passive marks them, then E vault off to safety with the bonus damage; this is a zero-risk short trade.",
      "Q blind the enemy when they try to auto-attack trade, negating their DPS entirely while you auto them freely.",
      "Use E vault to disengage whenever a melee champion gaps closes on you, creating distance and getting a free Harrier auto.",
    ],
    earlyGame: "Bully melee top laners relentlessly with your range advantage and Harrier passive procs; Quinn is a lane kingdom champion who must snowball.",
    midGame: "Use R to roam to other lanes and create leads; Quinn's ult move speed makes her one of the best roaming top laners.",
    lateGame: "You fall off against grouped teams; look for picks on isolated targets with R speed and split push to draw pressure.",
    commonMistakes: [
      "Using E aggressively into a bruiser who can all-in you after the vault; save E for disengaging.",
      "Not roaming with R mid-game; if you stay in top lane, you waste Quinn's biggest strength.",
      "Getting caught in teamfights without E vault available; position like an ADC and save E for self-peel.",
    ],
    powerSpikeReminders: [
      "Level 1-2 Quinn with passive Harrier and E vault is oppressive against every melee top laner.",
      "Level 6 R gives you insane roam speed; look to impact mid lane and jungle immediately.",
      "Sanguine Blade or Stormrazor first item maximizes your early dueling and snowball potential.",
    ],
  },

  Renekton: {
    combos: [
      "E dash in > W stun > auto > Q > E dash out (slice in, stun, auto-Q, dice out for safe trade)",
      "E > empowered W (50 fury) > Q > E out (dash in with fury W stun-break, Q heal, dash out)",
      "E > Flash > empowered W > R > Q > E (E-flash surprise engage into empowered combo with ult)",
    ],
    tradingPatterns: [
      "Build 50 fury, E through minions to the enemy, empowered W stun, Q to heal, then E back out; this is Renekton's bread-and-butter trade.",
      "Use empowered Q on the minion wave when low to heal massively; the fury-empowered Q heals for triple against champions.",
      "Short trade with E-W-Q-E out; never extend the trade unless you are going for a kill as Renekton wins short but loses long.",
    ],
    earlyGame: "Renekton is the king of lane bullying; manage fury to have 50 for empowered W stun and force short E-W-Q-E trades that enemies cannot answer.",
    midGame: "Use your early lead to roam and dive with R; Renekton falls off so convert your lane advantage into team advantages quickly.",
    lateGame: "You are outscaled by most top laners; play for team utility with W stun and R frontline rather than trying to 1v1 split push.",
    commonMistakes: [
      "Using empowered Q for wave clear instead of saving fury for empowered W stun in trades.",
      "E-ing in without enough fury for empowered W, making the trade much weaker.",
      "Not converting early leads into objectives; Renekton falls off hard so you must snowball.",
    ],
    powerSpikeReminders: [
      "Level 3 with all abilities and 50 fury is your first massive power spike; force a trade or all-in immediately.",
      "Blade of the Ruined King makes your empowered W stun deal insane burst with on-hit procs.",
      "Level 6 R gives you bonus health and fury generation; you can tower dive most champions with ult.",
    ],
  },

  Rengar: {
    combos: [
      "Jump from bush > empowered Q > auto > W > E (leap from bush with ferocity Q, auto-W-E burst)",
      "Jump > Q > W > E > empowered Q (leap, full rotation to build ferocity, then empowered Q for double burst)",
      "R stealth > jump to target > empowered Q > Q > W > E (ult for guaranteed crit leap into full combo)",
    ],
    tradingPatterns: [
      "Trade only from bushes; leap from a bush, Q-auto-W, then immediately walk back into the bush to drop aggro and set up another leap.",
      "Use W to heal after taking damage; the grey health return makes short trades favorable if you W the damage back.",
      "Stack ferocity to 3 in the bush, leap with Q for the auto-reset, then use an empowered ability depending on the situation.",
    ],
    earlyGame: "Abuse bushes relentlessly; leap-Q trades from bushes are your entire lane identity and most top laners cannot handle the repeated burst.",
    midGame: "Use R to assassinate squishy targets in side lanes or roam to other lanes for kills; one-shot potential with R crit is enormous.",
    lateGame: "You are an assassin; use R to find and delete the enemy carry before teamfights begin.",
    commonMistakes: [
      "Fighting outside of bush range where you have no leap and lose your primary trading tool.",
      "Using empowered W for damage instead of saving it for the CC cleanse and heal in crucial moments.",
      "Not managing ferocity stacks; entering a fight without ferocity means you cannot use an empowered ability when you need it.",
    ],
    powerSpikeReminders: [
      "Level 1-2 with bush control, Rengar wins almost every trade with leap-Q-auto burst.",
      "Level 6 R gives you stealth and guaranteed crit leap; this is a massive assassination power spike.",
      "Duskblade or Essence Reaver first item makes your leap-Q burst lethal on squishies.",
    ],
  },

  Riven: {
    combos: [
      "Fast Q: Q -> move cmd -> AA -> Q -> move cmd -> AA -> Q -> AA: Cancel Q animation with move command for ~66% faster combo. Core mechanic.",
      "E -> R1 -> Flash -> W -> AA -> Hydra -> Q -> AA -> Q -> AA -> Q -> R2: The Shy combo — instant one-shot from E shield into Flash stun.",
      "E -> W+Q (simultaneously): Doublecast — E cancels W animation, allowing W and Q to cast instantly together for burst.",
      "E -> W (stun) -> AA -> Q away: Safe short trade. Shield in, instant stun, auto, Q out before they can retaliate.",
    ],
    tradingPatterns: [
      "Fast Q combo: Q -> move -> AA between EVERY Q. This roughly doubles your DPS and is the #1 skill to learn on Riven.",
      "E shield -> W stun -> AA -> Q away: Safe repeatable short trade that enemies can't answer during stun.",
      "Doublecast: E -> (W+Q simultaneously) for instant burst without animation delay. Practice this in practice tool.",
      "Stack passive with abilities before trading — Runic Blade empowers autos after each ability use.",
    ],
    earlyGame: "Short trades with E-W-AA-Q. Don't extend fights unless you land all Q sweetspots. Practice fast Q combo for max DPS — it's essential.",
    midGame: "Snowball your lead with split-push or flanks. Riven is feast-or-famine. E-R1-Flash-W combo one-shots carries from fog of war.",
    lateGame: "Flank teamfights. E-R1-Flash-W onto carries for instant deletion. CDR is essential for spell rotation in extended fights. Split-push is also strong.",
    commonMistakes: [
      "Not learning fast Q combo (Q-move-AA) — it roughly DOUBLES your DPS and is non-negotiable for Riven players.",
      "Using E for engage instead of saving it as shield — E is both your defense and animation cancel enabler.",
      "All 3 Qs forward without auto-attacking between them — massive DPS loss from skipping passive procs.",
      "Not using doublecast (E+WQ) — this is a major part of Riven's burst that many players skip.",
      "Fighting with all abilities on cooldown — Riven without abilities is completely useless, disengage and wait.",
    ],
    powerSpikeReminders: [
      "Level 1: Q auto-spacing is strong. Can cheese level 1 against many matchups with fast Q.",
      "Level 3: Full Q-W-E kit online. Short trades become very strong with all tools available.",
      "Level 6: R1 gives bonus AD and R2 executes. Kill potential roughly doubles.",
      "Eclipse: CDR + burst. Your combos start one-shotting squishies.",
      "CDR breakpoints: Every CDR increase makes Riven significantly stronger — prioritize ability haste.",
    ],
  },

  Rumble: {
    combos: [
      "E harpoon slow > Q flamethrower > overheat > auto attacks (slow with E, then Q at close range, overheat for empowered autos)",
      "R equalizer > E slow > Q > E (drop ult, slow them in it, then flamethrower for maximum damage)",
      "Flash > R > E > Q > W shield (flash-ult surprise engage with full combo and shield for survival)",
    ],
    tradingPatterns: [
      "Q flamethrower the enemy when they walk up to CS, staying in the Danger Zone (50-80 heat) for bonus damage on all abilities.",
      "E harpoon to slow and poke from range; landing both E charges gives a strong slow that lets you follow with Q.",
      "Manage heat to stay in Danger Zone (50-80) for bonus damage, but avoid overheating at bad times which silences you.",
    ],
    earlyGame: "Trade with Q flamethrower in Danger Zone heat for bonus damage; poke with E harpoons and use W shield to absorb retaliation.",
    midGame: "Look for R Equalizer in teamfights and skirmishes; a well-placed ult in a chokepoint wins fights single-handedly.",
    lateGame: "Position to land multi-man R in teamfights; your ultimate is one of the highest-damage AoE abilities in the game on grouped targets.",
    commonMistakes: [
      "Overheating accidentally and being silenced when you need abilities, losing fights that were winnable.",
      "Dropping R Equalizer perpendicular instead of parallel to enemy movement, letting them walk out immediately.",
      "Not staying in Danger Zone heat range; below 50 heat your abilities deal significantly less damage.",
    ],
    powerSpikeReminders: [
      "Level 2-3 Rumble with Q and E in Danger Zone outtrades most melee champions.",
      "Level 6 R Equalizer is one of the highest-damage ultimates in the game; force fights in jungle corridors.",
      "Liandry's Torment makes your Q and R burn deal devastating sustained damage over time.",
    ],
  },

  Sett: {
    combos: [
      "Q move speed > auto > auto (Q reset) > E pull > W haymaker (Q in for autos, E to pull back if they run, W to finish)",
      "E pull both sides for stun > auto > Q autos > W true damage center (E stun, auto-Q burst, then W grit for massive damage)",
      "Flash > R suplex carry into team > E > W (flash-suplex a tank into the backline, then E-W for AoE)",
    ],
    tradingPatterns: [
      "Activate Q and run at the enemy with the move speed, auto-Q auto for the quick burst, then walk away; this is your safest short trade.",
      "Use E to pull the enemy in when they try to disengage, guaranteeing your Q empowered auto attacks land.",
      "Take damage to build W grit bar, then W haymaker for the shield and massive true damage in the center; this turns lost trades into won trades.",
    ],
    earlyGame: "Walk at the enemy with Q move speed and auto-Q-auto for short trades; Sett has one of the highest base AD values and wins most early trades.",
    midGame: "Look for R suplex engages on frontline tanks into the enemy backline; the AoE damage based on the suplexed target's HP is enormous.",
    lateGame: "Serve as a frontline brawler who can R a tank into carries; your W true damage center punch can one-shot squishies in teamfights.",
    commonMistakes: [
      "Missing W haymaker center true damage; the outer edge deals physical and is much weaker than the center.",
      "Using R on a squishy instead of a tank; R damage scales with the target's max HP so suplexing a tank does more damage.",
      "Not building grit before using W; without stored damage, W does minimal damage and gives a tiny shield.",
    ],
    powerSpikeReminders: [
      "Level 1-3 Sett with Q and E wins almost every trade with raw auto-attack damage and pull.",
      "Level 6 R gives you a teamfight-changing suplex; look for flanks to suplex frontliners into backliners.",
      "Blade of the Ruined King or Stridebreaker first item makes your sticking power and burst significantly stronger.",
    ],
  },

  Shen: {
    combos: [
      "E taunt dash > auto > auto > auto (Q empowered) > W dodge zone (taunt in, empowered autos with Q, W to block retaliation)",
      "E > Flash (redirect taunt mid-dash for extended range) > Q autos > W",
      "R global shield on ally > TP to fight > E taunt > Q autos (ult to protect carry, then taunt enemies in the fight)",
    ],
    tradingPatterns: [
      "Drag Q sword through the enemy for empowered autos, trade with 3 empowered auto attacks, then W to block their retaliation autos.",
      "E taunt through the enemy, auto with Q-empowered attacks, then disengage before the taunt wears off.",
      "Use W spirit blade reflexively when the enemy tries to auto-attack trade; it blocks all auto attacks in the zone.",
    ],
    earlyGame: "Trade with Q-empowered auto attacks and use E to engage or disengage; always watch the map for R opportunities to save allies.",
    midGame: "Split push and use R to join fights globally; Shen's map pressure from R forces enemies to make difficult decisions.",
    lateGame: "Your primary role is to R-shield your carry and taunt enemy divers; Shen is a utility tank who enables his team.",
    commonMistakes: [
      "Not watching the map for R opportunities; Shen's global shield ult is wasted if you are not paying attention to ally HP bars.",
      "Using E aggressively and having no escape when ganked; save E for disengage in risky situations.",
      "Ignoring split push pressure to group; Shen should be in a side lane and R to join fights.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you global map presence; you can split push and join any fight instantly.",
      "Titanic Hydra gives you wave clear and burst that makes your split push and Q trades much stronger.",
      "Bambi's Cinder or Sunfire completion lets you push waves and trade effectively as a tank.",
    ],
  },

  Singed: {
    combos: [
      "Ghost > R > Q poison trail > W glue > E fling back into poison (run at them, glue, fling into your poison)",
      "E fling > W glue (fling enemy into your glue for grounding and slow) > Q poison trail",
      "Flash > E fling into tower > W > Q (flash behind enemy, fling them into tower range with glue and poison)",
    ],
    tradingPatterns: [
      "Proxy farm behind the enemy tower, drawing jungle attention while your team takes objectives on the other side of the map.",
      "Run at the enemy with Q poison and force them to choose between fighting in poison or giving up CS.",
      "E fling the enemy into your minion wave and poison trail when they walk up too close, then run away with Q trailing.",
    ],
    earlyGame: "Farm with Q poison trail and look for E flings when enemies walk too close; avoid extended fights and focus on wave control and proxy potential.",
    midGame: "Proxy waves and draw pressure or group for teamfights where your R stats and W grounding create chaos.",
    lateGame: "Run through the enemy team with Ghost and R, spreading poison and flinging carries; your job is to create chaos and zone the backline.",
    commonMistakes: [
      "Running directly at the enemy without Ghost or R move speed, getting kited and taking free damage.",
      "Proxying without proper vision and dying to jungle collapses repeatedly.",
      "Not using W grounding to prevent enemy dashes; grounding is incredibly powerful against mobile champions.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you massive bonus stats; you transform from weak to a stat-check monster.",
      "Rylai's Crystal Scepter makes your Q poison trail slow, meaning anyone who touches it can never escape.",
      "Demonic Embrace adds burn damage to your poison, making your DoT significantly more threatening.",
    ],
  },

  Sion: {
    combos: [
      "E shout (slow with minion) > Q charge > W shield detonate > auto (E slow to set up Q knockup, W burst, auto)",
      "R charge from fog > Q channel > W > E (ult from out of vision, Q the stunned target, W-E burst)",
      "Flash > fully charged Q > W detonate > E > R away or chase (flash for surprise fully charged Q knockup)",
    ],
    tradingPatterns: [
      "E a minion into the enemy for the slow and armor shred, then walk up for a charged Q while they are slowed.",
      "Charge Q in a bush and release when the enemy walks over it for a surprise knockup and burst.",
      "Use W shield and detonate it on the enemy during a short trade for additional burst damage.",
    ],
    earlyGame: "Poke with E through minions and look for Q knockup opportunities; Sion's laning is safe with E poke and Q zone control.",
    midGame: "Use R to roam cross-map or engage teamfights from fog of war; a full-speed Sion ult into multiple enemies is devastating.",
    lateGame: "Stack infinite HP with W passive and serve as an unkillable frontline; even your passive zombie form threatens enemies after death.",
    commonMistakes: [
      "Fully charging Q when the enemy can easily walk out; tap Q for a guaranteed shorter knockup instead.",
      "Using R in a straight line where the enemy can easily sidestep; aim to cut off escape routes.",
      "Not farming enough for W passive HP stacking; every minion kill permanently increases your HP.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you a semi-global engage and roaming tool; look for cross-map plays.",
      "Hullbreaker makes Sion an unstoppable split pusher; even if you die, your passive takes the tower.",
      "Every minute of farming increases your HP permanently through W passive; Sion has infinite scaling potential.",
    ],
  },

  Teemo: {
    combos: [
      "Auto > Q blind > auto > auto (auto-Q-auto for quick burst while enemy is blinded)",
      "R shroom placement > auto poke > Q blind > auto (bait enemy into shroom, then burst while they are slowed)",
      "W move speed > auto > Q > auto > run away (W for chase/escape speed, burst, then disengage)",
    ],
    tradingPatterns: [
      "Auto attack the enemy with E poison when they walk up to CS; your range advantage and poison DoT win attrition trades.",
      "Wait for the enemy to try an auto-attack trade, then Q blind them to negate their damage completely while you auto freely.",
      "Place R shrooms in the enemy's path to CS, punishing them every time they try to farm.",
    ],
    earlyGame: "Bully melee champions with auto-attack poke and E poison; use Q blind defensively when they try to trade to negate their auto-attack damage.",
    midGame: "Place R shrooms at objectives and jungle paths for vision and damage; split push with your consistent poke damage.",
    lateGame: "Control the map with shroom fields around objectives; in teamfights, Q blind the enemy ADC to negate their damage for the duration.",
    commonMistakes: [
      "Using Q aggressively for poke instead of saving it to blind the enemy when they try to trade or all-in.",
      "Not placing shrooms strategically; random shroom placement wastes your strongest utility tool.",
      "Playing aggressively against champions who can gap-close and one-shot you; respect all-in threats.",
    ],
    powerSpikeReminders: [
      "Level 1 E poison auto attacks win almost every trade against melee champions; zone them from level 1.",
      "Level 6 R shrooms give you map control and area denial; place them where enemies will walk.",
      "Nashor's Tooth completion massively amplifies your auto-attack damage with on-hit AP.",
    ],
  },

  Trundle: {
    combos: [
      "W attack speed zone > Q bite (AD steal auto reset) > auto > auto (W buff, Q bite for AD steal and reset, then chase)",
      "E pillar behind enemy > W > Q > auto > auto (pillar to cut escape, then run them down with W-Q)",
      "R drain tank > W > Q > E > auto (ult to steal resistances, then all-in with stat advantage)",
    ],
    tradingPatterns: [
      "Q bite the enemy for the auto-reset and AD steal, then auto attack them with your stolen AD while they have reduced AD.",
      "Place W zone and fight inside it for the attack speed and healing; the stat boost from W swings trades in your favor.",
      "E pillar the enemy when they try to disengage, forcing them to either path around it or fight you.",
    ],
    earlyGame: "Trade with Q bite for the AD steal and auto-reset; standing in W zone gives you a significant stat advantage in extended trades.",
    midGame: "Split push and use R on the enemy frontline tank to steal their resistances; Trundle melts tanks and wins most 1v1s.",
    lateGame: "Use R on the enemy's tankiest member to steal their armor and MR; you become incredibly tanky while they become squishy.",
    commonMistakes: [
      "Not fighting inside W zone; the attack speed, healing, and move speed buff are essential for winning trades.",
      "Using E pillar to block the enemy's path instead of placing it directly on them for the slow and knockback.",
      "Ulting a squishy target instead of the enemy tank; R steals a percentage of resistances so tanks give you more.",
    ],
    powerSpikeReminders: [
      "Level 1 Q with Lethal Tempo gives Trundle one of the strongest level 1s in the game.",
      "Level 6 R stealing tank resistances makes you win every 1v1 against tanks and bruisers.",
      "Blade of the Ruined King combined with R resistance steal makes you an unstoppable duelist.",
    ],
  },

  Tryndamere: {
    combos: [
      "E spin through enemy > auto > auto > auto > Q heal when low (spin in, auto attack repeatedly, Q to heal if needed)",
      "E spin > auto > W slow (when turning away) > auto > auto > R at low HP (spin in, force trades, ult to survive)",
      "Flash > E > auto > Ignite > R (flash-spin onto enemy for surprise all-in, ult to survive the trade)",
    ],
    tradingPatterns: [
      "Auto attack the enemy at every opportunity to build fury; at high fury, your crit chance is enormous and you can randomly crit for massive damage.",
      "E spin through the enemy for the damage and gap close, then auto attack twice and walk away; the crit RNG can chunk enemies hard.",
      "Use W slow when the enemy turns away from you; the AD reduction and slow only apply if they are facing away.",
    ],
    earlyGame: "Build fury to max with auto attacks on minions and look for all-ins when you have high crit chance; Tryndamere level 1-2 with fury crits can kill anyone.",
    midGame: "Split push relentlessly; Tryndamere is one of the best split pushers in the game and forces multiple enemies to answer him.",
    lateGame: "Keep split pushing and use R to survive tower dives and 1v2s; you take towers faster than almost any champion with E auto-resets.",
    commonMistakes: [
      "Using R too early when you still have HP; wait until you are nearly dead to maximize the 5 seconds of undying.",
      "Teamfighting instead of split pushing; Tryndamere is kited easily in teamfights but dominates side lanes.",
      "Fighting with low fury; your crit chance comes from fury so you need stacks before trading.",
    ],
    powerSpikeReminders: [
      "Level 1-2 with full fury, Tryndamere can crit repeatedly and kill any champion in the game.",
      "Level 6 R makes you immortal for 5 seconds; force tower dives and all-ins that enemies cannot answer.",
      "Kraken Slayer or Navori Quickblades makes your auto attacks and E resets lethal against anyone.",
    ],
  },

  Urgot: {
    combos: [
      "E flip > auto > W shotgun knees > Q slow (flip enemy, auto to start passive legs, W for sustained damage, Q to slow)",
      "Flash > E flip > W > Q > R execute (flash-flip surprise engage into full combo and execute ult)",
      "Q slow > E flip > W > R at 25% HP (poke with Q, engage with E, W for DPS, R to execute)",
    ],
    tradingPatterns: [
      "E flip the enemy and activate W to cycle through passive shotgun knee legs; each leg that fires deals percentage HP damage.",
      "Q slow the enemy from range to poke; if they walk up, E flip them and W for the full passive rotation.",
      "Walk around the enemy during W to trigger as many different passive shotgun knee legs as possible for maximum damage.",
    ],
    earlyGame: "Trade with E flip into W for passive shotgun leg procs; manage which legs have been used and position to trigger fresh ones.",
    midGame: "Split push and bully 1v1s with your superior sustained damage; R execute is guaranteed death for anyone below 25% HP.",
    lateGame: "Serve as a frontline bruiser who deals percentage HP damage; R fear chain can disrupt entire teams when the target is executed.",
    commonMistakes: [
      "Not tracking which passive legs have been fired; rotate around enemies to trigger unused legs for maximum damage.",
      "Missing E flip which is your only engage and CC tool; without E, Urgot cannot force trades.",
      "Using R too early when the enemy is above 25% HP; the execute only works below the threshold.",
    ],
    powerSpikeReminders: [
      "Level 9 W becomes a toggle with no mana cost; your sustained damage becomes permanent and oppressive.",
      "Level 6 R execute gives you guaranteed kills on anyone below 25% HP; bait enemies to low HP then R.",
      "Black Cleaver completion makes your W rapidly shred armor with each hit applying stacks.",
    ],
  },

  Volibear: {
    combos: [
      "Q stun charge > auto > W bite > E (Q run at enemy, stun auto, W bite for mark, E for AoE)",
      "R tower disable leap > Q stun > W > E > W2 (ult onto enemy under tower, stun, full combo, second W for heal)",
      "E predict > Q stun > auto > W > wait > W2 heal (E ahead, stun into it, W twice for bonus damage and heal)",
    ],
    tradingPatterns: [
      "Activate Q and run at the enemy for the stun auto, then W bite for the mark; walk away and re-engage with second W when it comes off cooldown for the bonus damage and heal.",
      "Place E slightly behind the enemy so they run into it after being stunned by Q; the shield and damage add up.",
      "Short trade with Q stun into W, then back off and W again when it is ready for the wound proc heal.",
    ],
    earlyGame: "Run at enemies with Q stun and trade with W bite; Volibear is strong early and wins most level 1-3 trades with his stun and sustain.",
    midGame: "Use R to tower dive with tower disable; Volibear is one of the safest tower divers in the game with R.",
    lateGame: "Serve as a frontline engage tank who can R to disable towers and zone enemies; your tower disable is invaluable for siege.",
    commonMistakes: [
      "Not using W twice; the second W on a marked target deals bonus damage and heals significantly.",
      "Using R for damage instead of strategically to disable enemy towers during dives or sieges.",
      "Chasing too far with Q and getting kited; use Q stun then trade and disengage if the kill is not guaranteed.",
    ],
    powerSpikeReminders: [
      "Level 1-3 Volibear with Q stun and W bite wins most trades through sheer stats and sustain.",
      "Level 6 R tower disable makes you a guaranteed tower dive champion; coordinate dives with your jungler.",
      "Nashor's Tooth (AP) or Trinity Force (bruiser) first item defines your damage profile significantly.",
    ],
  },

  Warwick: {
    combos: [
      "Q hold (dash through) > auto > E fear > auto > R suppress (Q behind them, auto-E fear, then R to lock down)",
      "R long-range leap > Q > auto > E fear > Q (ult from max range, then full combo while suppressed and after)",
      "E1 damage reduction > Q > auto > auto > E2 fear (activate E for damage reduction, trade, then fear at the end)",
    ],
    tradingPatterns: [
      "Q tap for quick damage and heal in short trades; save Q hold-through for when you need to dodge a skillshot or reposition.",
      "Activate E for damage reduction when the enemy trades into you, auto attack them, then E2 fear when they try to disengage.",
      "At low HP, Warwick's passive healing and attack speed increase massively; bait enemies into fighting you at low HP where you are strongest.",
    ],
    earlyGame: "Trade with Q sustain and E damage reduction; Warwick's level 1-3 is surprisingly strong with passive healing and W attack speed at low HP.",
    midGame: "Use R to lock down targets in skirmishes and split push; Warwick heals so much that he can 1v2 in many situations.",
    lateGame: "Serve as a frontline who dives carries with R suppress; your healing makes you deceptively tanky in extended fights.",
    commonMistakes: [
      "Not using E1 before trading to benefit from the damage reduction; always activate E before taking damage.",
      "Q tapping when you should Q hold to follow enemy dashes or reposition behind them.",
      "Building full damage instead of bruiser; Warwick needs some tankiness to survive long enough to heal.",
    ],
    powerSpikeReminders: [
      "Below 50% HP, Warwick's passive tripled healing and W attack speed make him incredibly hard to kill.",
      "Level 6 R gives you a long-range suppress engage; you can leap a massive distance onto targets.",
      "Blade of the Ruined King synergizes perfectly with Warwick's on-hit kit and attack speed.",
    ],
  },

  Wukong: {
    combos: [
      "E dash > auto > Q auto reset > W clone (E in, auto-Q burst, then W to clone and disengage or extend)",
      "E > auto > Q > R spin > R2 second spin (E engage, burst with Q, then double-knock-up with R)",
      "W clone > E through to enemy > Q > R > R2 (stealth with clone, E gap close, Q burst, double ult spin)",
    ],
    tradingPatterns: [
      "E dash to the enemy, auto-Q for the burst, then W clone away; the clone also attacks for additional damage.",
      "Use W stealth to walk up, then E-auto-Q when the enemy cannot see you coming for a surprise trade.",
      "Short trade with E-auto-Q then W out; this combo is quick enough that most enemies cannot retaliate.",
    ],
    earlyGame: "E-auto-Q short trades and W clone out; Wukong's level 2-3 burst is surprisingly high and most enemies underestimate the clone damage.",
    midGame: "Look for teamfight engages with R double knockup; Wukong ult in a teamfight is devastating with the AoE knockup.",
    lateGame: "Flank and R into the enemy backline for double knockup; your teamfight presence is among the best for any bruiser.",
    commonMistakes: [
      "Using W randomly to dodge one ability instead of saving it for the stealth engage or disengage in trades.",
      "Only pressing R once; the second R cast gives another knockup which doubles your teamfight CC.",
      "Not using the clone's damage; the clone autos and copies your abilities, contributing significant DPS.",
    ],
    powerSpikeReminders: [
      "Level 2 with E and Q gives you strong burst trades that most top laners do not expect.",
      "Level 6 R double knockup is a massive teamfight spike; look to group and fight when ult is available.",
      "Divine Sunderer or Trinity Force completion makes your Q auto-reset deal enormous Sheen-proc burst.",
    ],
  },

  Yorick: {
    combos: [
      "Q grave spawn > Q > Q > Q (auto minions to create graves) > E mark > W cage > release ghouls (stack graves, mark enemy, cage, summon ghouls to swarm)",
      "E mark > W cage > Q summon ghouls > R maiden (throw E, cage, summon 4 ghouls, ult maiden for massive push damage)",
      "W cage on enemy > Q auto reset > E mark (cage first to trap, Q burst, then E so ghouls leap to marked target)",
    ],
    tradingPatterns: [
      "Stack 3-4 graves with Q last hits, then E mark the enemy and summon ghouls; the ghouls leap to the marked target for massive damage.",
      "W cage the enemy when they are near your ghouls and maiden; the summons deal enormous damage while the enemy is trapped.",
      "Short trade with Q empowered auto for the bonus damage and grave; avoid fighting without ghouls available.",
    ],
    earlyGame: "Farm with Q to create graves and look for E-ghoul trades when you have 3-4 ghouls ready; without ghouls, Yorick is weak so focus on stacking.",
    midGame: "Split push with Maiden and ghouls; Yorick takes towers faster than almost any champion and creates enormous side lane pressure.",
    lateGame: "Continue split pushing and force multiple enemies to answer your Maiden push; leave Maiden in a lane to push while you join fights if needed.",
    commonMistakes: [
      "Fighting without ghouls; Yorick without summons is one of the weakest champions in a 1v1.",
      "Recalling Maiden unnecessarily; Maiden pushes lanes autonomously and creates pressure even when you are elsewhere.",
      "Not using W cage to trap enemies near your ghouls; the cage forces them to auto-attack it 2-4 times, wasting time in your ghoul swarm.",
    ],
    powerSpikeReminders: [
      "Level 6 Maiden summon gives you a permanent pushing companion that makes your split push oppressive.",
      "Trinity Force or Hullbreaker first item makes your tower-taking speed absurd with Q auto-resets.",
      "4 ghouls plus Maiden is more damage than most players expect; force fights when you have full summons.",
    ],
  },
};
