export interface ChampionCoaching {
  combos: string[];
  tradingPatterns: string[];
  earlyGame: string;
  midGame: string;
  lateGame: string;
  commonMistakes: string[];
  powerSpikeReminders: string[];
}

export const supportChampions: Record<string, ChampionCoaching> = {
  Alistar: {
    combos: [
      "W (Headbutt) into Q (Pulverize): close the gap then immediately Q mid-dash for a guaranteed knock-up combo.",
      "Flash Q into W toward your team: flash on top of the enemy, knock them up, then headbutt them into your carries for a pick.",
      "E (Trample) auto-weave after W-Q: after the knock-up, stay on top of the target to stack Trample and land the empowered stun auto.",
    ],
    tradingPatterns: [
      "Walk up and threaten W-Q when the enemy ADC steps forward to last-hit a cannon minion; the threat alone creates zoning pressure.",
      "Use E passive healing by standing near dying minions to sustain through poke lanes without spending mana.",
      "At level 2, immediately look for an all-in with W-Q if you hit level 2 first off the first wave plus three melee minions.",
    ],
    earlyGame:
      "Play around your level 2 and level 3 all-in windows; otherwise, stay healthy with E passive and wait for jungle ganks to chain CC.",
    midGame:
      "Roam mid after shoving a wave with your ADC, and look for tower dives using R (Unbreakable Will) to tank 3-4 tower shots safely.",
    lateGame:
      "Flank from fog of war to land a multi-man W-Q engage in teamfights, then immediately R to soak damage while your team follows up.",
    commonMistakes: [
      "Using W-Q combo when your ADC has no mana or cooldowns to follow up, resulting in a wasted engage and a lost trade.",
      "Popping R too early before the enemy commits damage; save it for when you are being focused to maximize the damage reduction.",
      "Headbutting enemies away from your carries to safety instead of toward your team; always W toward your damage dealers.",
    ],
    powerSpikeReminders: [
      "Level 2 (W+Q) is one of the strongest level 2 all-ins in bot lane; always try to hit it before the enemy support.",
      "Level 6 with Unbreakable Will makes you nearly unkillable in extended trades; force fights when R is available.",
      "Boots of Mobility completion lets you roam mid and top effectively; time roams when your ADC can safely farm under tower.",
    ],
  },

  Bard: {
    combos: [
      "Q (Cosmic Binding) through a minion into the enemy champion to land a guaranteed stun by using the minion as the second target.",
      "E (Magical Journey) behind the enemy into Q: portal through a wall to flank, then Q stun them against the wall you just came from.",
      "R (Tempered Fate) on the enemy backline, then set up Q angles while they are in stasis so you stun them the instant it ends.",
    ],
    tradingPatterns: [
      "Auto-attack with Meeps for burst poke; each Meep-empowered auto deals significant magic damage and slows, so weave autos between abilities.",
      "Place W (Caretaker's Shrine) on your ADC's path preemptively so they can pick it up mid-trade for a speed boost and heal.",
      "Roam to collect chimes between waves when the lane is pushed; return with extra Meeps and XP to pressure the next trade window.",
    ],
    earlyGame:
      "Trade aggressively with Meep-empowered autos and Q stuns through minions, then roam to collect chimes during downtime between waves.",
    midGame:
      "Create picks with E portals through terrain for flanks and use R to isolate priority targets or zone enemies off objectives.",
    lateGame:
      "Land multi-target R on clumped enemies before Dragon or Baron fights, and use E to give your team creative engage angles through terrain.",
    commonMistakes: [
      "Roaming for chimes and leaving your ADC in a 1v2 during a dangerous wave state; only roam when the lane is pushed or your ADC is safe.",
      "Using R on your own team during a fight accidentally; aim Tempered Fate precisely on enemies or use it to zone, never on allies mid-combat.",
      "Forgetting to place W shrines ahead of time; place them in lane and along rotation paths so they charge to full heal value.",
    ],
    powerSpikeReminders: [
      "Every 5 chimes upgrades your Meeps with more damage and eventually AoE and multi-Meep spawns; keep collecting to scale.",
      "Level 6 R gives massive pick and teamfight potential; look for plays on the enemy jungler at objectives as soon as you hit 6.",
      "First item (usually Imperial Mandate or Solstice Sleigh) plus tier-2 boots is when your roaming becomes extremely oppressive.",
    ],
  },

  Blitzcrank: {
    combos: [
      "Q (Rocket Grab) into E (Power Fist) auto-attack knock-up into R (Static Field) silence: the full burst combo that deletes squishies.",
      "E first to knock up a nearby target, then Q a different fleeing enemy to grab them back into your team.",
      "W (Overdrive) to run at enemies and force them to sidestep, then Q when they commit to a dodge direction for a predictable grab.",
    ],
    tradingPatterns: [
      "Stand in the lane bush and threaten Q from fog of war; the enemy has to respect the hook threat and will zone themselves off CS.",
      "Walk up with W and E to force flash or dash, then save Q for after they use their escape for a guaranteed hook.",
      "Hook the enemy support rather than the ADC if the support is squishy; pulling a Sona or Soraka into your team is often a free kill.",
    ],
    earlyGame:
      "Threaten hooks from brush and angles to zone enemies off CS; even missed hooks apply pressure if you have short cooldowns.",
    midGame:
      "Set up vision around mid lane and jungle chokes to land picks on isolated targets rotating between lanes.",
    lateGame:
      "A single Q on a carry wins the game; play around fog of war and narrow chokepoints near Baron and Dragon to maximize hook angles.",
    commonMistakes: [
      "Spamming Q on cooldown and missing; a Blitzcrank with hook up is far more threatening than one who just missed it.",
      "Hooking a tank or bruiser into your backline, giving the enemy a free engage; only grab squishy or isolated targets.",
      "Using W to run at enemies without thinking about the self-slow afterward; the decaying speed can leave you stranded.",
    ],
    powerSpikeReminders: [
      "Level 1 invade with Q is one of the best in the game; look for a hook on the enemy jungle entrance before minions spawn.",
      "Level 6 R adds a massive AoE burst to your combo; all-in when you hit 6 for kill pressure the enemy may not expect.",
      "Hextech Alternator or first item completion spikes your burst so Q-E-R can 100-to-0 enemy ADCs with your carry's follow-up.",
    ],
  },

  Braum: {
    combos: [
      "Q (Winter's Bite) slow into W (Stand Behind Me) to an ally near the target, then auto-attack to proc the 4-hit passive stun.",
      "R (Glacial Fissure) knock-up into Q and auto-attacks to quickly stack passive and chain CC the target for 3+ seconds.",
      "Flash R sideways to knock up the entire enemy team in a line, then E (Unbreakable) to block follow-up projectiles.",
    ],
    tradingPatterns: [
      "Land Q poke on the enemy ADC when they step up to CS; the slow and passive mark pressure forces them to back off or risk a stun.",
      "W to your ADC when the enemy engages to give them bonus armor and magic resist, then E to block incoming damage.",
      "Walk up and auto-attack after landing Q to apply passive stacks; your ADC can also auto to help proc the stun faster.",
    ],
    earlyGame:
      "Use Q poke to establish lane presence and look for passive stun procs with your ADC to win short trades at level 2-3.",
    midGame:
      "Peel for your ADC in skirmishes with E to block key abilities and R to disengage or counter-engage when the enemy dives.",
    lateGame:
      "Stand in front of your carries with E up to block critical abilities like hooks or skillshots, and R to peel or engage based on team needs.",
    commonMistakes: [
      "Using E in the wrong direction or too late; always face the E shield toward the biggest incoming threat.",
      "Jumping W to an ally who is too far from the fight, taking you out of position to peel or stack passive.",
      "Using R offensively when your team needs you to peel; save R defensively if the enemy has dive threats like assassins.",
    ],
    powerSpikeReminders: [
      "Level 1 passive makes Braum strong in invades; coordinate with your team to stack the stun on one target for a quick kill.",
      "Level 6 R is a massive teamfight ultimate; look for multi-man knock-ups when the enemy groups for objectives.",
      "Locket of the Iron Solari completion gives your entire team a shield; use it when enemies commit AoE burst in fights.",
    ],
  },

  Janna: {
    combos: [
      "Fully charged Q (Howling Gale) into W (Zephyr) slow: channel Q from fog of war for maximum knock-up duration, then W to keep them in place.",
      "Flash R (Monsoon) to knock enemies away from your carry, then immediately cancel R and Q-W to peel further.",
      "E (Eye of the Storm) your ADC as they auto-attack, then W the enemy to slow them so your ADC gets more shielded autos off.",
    ],
    tradingPatterns: [
      "W poke the enemy support or ADC when they step up for CS; Janna's W has surprisingly high base damage and the slow enables your ADC to trade back.",
      "Shield your ADC with E right before they auto-attack for a trade; the bonus AD on E makes their return damage significantly higher.",
      "Hold Q as a disengage threat rather than using it offensively; the threat of tornado keeps engage supports from jumping in.",
    ],
    earlyGame:
      "Poke with W and shield your ADC's trades with E to win short exchanges; save Q for disengage against enemy all-ins.",
    midGame:
      "Roam with your jungler using W slow and Q to set up ganks; Janna's movement speed passive makes her an excellent roaming support.",
    lateGame:
      "Position behind your carries and use R to reset fights when enemies dive; your peeling with Q, W slow, and R keeps your ADC alive through anything.",
    commonMistakes: [
      "Using Q aggressively and having no disengage when the enemy engages on your ADC; always keep Q available for peel.",
      "Channeling R for the full heal in bad positions; sometimes a quick R tap to knock enemies away is better than the heal channel.",
      "Not using E proactively before trades; the shield needs to be on your ADC BEFORE the damage comes in, not reactively after.",
    ],
    powerSpikeReminders: [
      "Level 2 with W and E gives strong trade potential; shield your ADC and poke with W for efficient short trades.",
      "Moonstone Renewer or first item completion makes your shields and heals significantly stronger; look to group and teamfight.",
      "Staff of Flowing Water amplifies your shield with bonus AP for your carries; complete it to massively boost your ADC's damage.",
    ],
  },

  Karma: {
    combos: [
      "R+Q (Inner Flame with Mantra): empowered Q deals massive AoE damage and slows; use it to chunk enemies before fights start.",
      "R+E (Defiance): empowered E shields your entire team and gives a movement speed burst; use it to engage or disengage teamfights.",
      "R+W (Focused Resolve) for the enhanced root and self-heal: use it when being dived to survive and lock down the diver.",
    ],
    tradingPatterns: [
      "Poke with Q through the minion wave to hit the enemy ADC or support; position at angles where the AoE splash behind the first target hits them.",
      "Auto-attack between abilities to proc passive and reduce R cooldown; every auto and ability hit lowers Mantra's cooldown.",
      "Use W tether on the enemy when they commit to a trade; if they stay, they get rooted, if they run, you win the trade by zoning.",
    ],
    earlyGame:
      "Abuse your strong early R+Q poke to establish lane dominance; Karma is strongest relative to other supports in levels 1-5.",
    midGame:
      "Decide between R+Q for poke or R+E for team utility based on your composition; poke comps want R+Q, teamfight comps want R+E.",
    lateGame:
      "Primarily use R+E to speed up and shield your team for engages or disengages, as R+Q poke falls off compared to your utility scaling.",
    commonMistakes: [
      "Always using R+Q when R+E would be more impactful; in teamfights, the team-wide shield and speed boost often outvalues one Q poke.",
      "Wasting R on Q poke right before a fight starts, leaving you without empowered E when your team needs the shield to engage.",
      "Not auto-attacking in trades to reduce R cooldown; Karma's passive rewards aggressive auto-weaving significantly.",
    ],
    powerSpikeReminders: [
      "Level 1 R+Q is one of the strongest level 1 abilities in the game; use it to chunk enemies and establish lane control immediately.",
      "Ionian Boots of Lucidity rush gives ability haste that directly reduces how often you can use Mantra; prioritize these early.",
      "Karma's power is front-loaded early; play aggressively before level 6 because she does not gain a new ultimate like other champions.",
    ],
  },

  Leona: {
    combos: [
      "E (Zenith Blade) into Q (Shield of Daybreak) auto-attack stun: dash to the target and immediately auto-Q for a guaranteed stun.",
      "R (Solar Flare) at range into E-Q follow-up: ult to stun or slow from distance, then E in to chain the CC.",
      "Flash Q on a priority target, then R on top of them and E if they flash away for a multi-CC lock-down chain.",
    ],
    tradingPatterns: [
      "Hit level 2 first off the first wave plus three melee minions, then immediately E-Q the enemy ADC for first blood pressure.",
      "Stand in the bush and zone the enemy off CS with the threat of E; they have to respect your engage range or get punished.",
      "Coordinate engages with your ADC's ability cooldowns; ping before you go in so they are ready to follow up immediately.",
    ],
    earlyGame:
      "Rush level 2 and all-in with E-Q; Leona's level 2 is one of the most lethal in bot lane and can snowball the lane off one engage.",
    midGame:
      "Roam mid or invade with your jungler; Leona's CC chain is devastating in 2v2 skirmishes and can secure kills on isolated targets.",
    lateGame:
      "Look for multi-man R engages in teamfights around choke points at Baron or Dragon; a 3+ person Solar Flare can win the game.",
    commonMistakes: [
      "Engaging when your ADC is too far away to follow up; always check your ADC's position and mana before going in.",
      "Using E into a full-health enemy team without your team ready; Leona has no disengage once she goes in.",
      "Not using W (Eclipse) before engaging; the bonus resistances and damage are essential for surviving after you dive in.",
    ],
    powerSpikeReminders: [
      "Level 2 E+Q is a massive power spike; it is one of the strongest level 2 all-ins in the entire game for support.",
      "Level 6 R adds long-range engage and AoE stun; you can now start fights from outside the enemy's reaction range.",
      "Aftershock proc combined with W makes Leona extremely tanky for 2.5 seconds after landing CC; time your engages around this.",
    ],
  },

  Lulu: {
    combos: [
      "E (Help, Pix!) on the enemy into Q (Glitterlance) from Pix's position: this extends Q range and makes it nearly impossible to dodge.",
      "W (Whimsy) polymorph the enemy diver, then E-shield your carry and Q slow the diver for a full peel rotation.",
      "R (Wild Growth) your diving bruiser or assassin to knock up enemies around them, then W speed them up to stick to targets.",
    ],
    tradingPatterns: [
      "E the enemy champion to place Pix on them, then Q through Pix for guaranteed poke; this is your primary harass combo in lane.",
      "Auto-attack frequently with Pix bonus damage; Lulu's autos deal extra magic damage from Pix bolts and add up in trades.",
      "Save W defensively against engage lanes; polymorphing an engaging Leona or Nautilus completely negates their all-in.",
    ],
    earlyGame:
      "Poke aggressively with E-Q and auto-attacks to establish lane dominance; Lulu is one of the strongest lane bullies among enchanter supports.",
    midGame:
      "Stick with your carry and provide constant buffs; W speed-up, E shield, and R knock-up make your ADC nearly unkillable in skirmishes.",
    lateGame:
      "Prioritize keeping your highest-DPS carry alive with R, E, and W; a well-protected hypercarry with Lulu buffs is the strongest win condition.",
    commonMistakes: [
      "Using W offensively to polymorph when your carry is about to be dove; save W for the biggest threat diving your backline.",
      "Ulting yourself instead of the carry who is being focused; R should almost always go on whoever the enemy is trying to kill.",
      "Forgetting that E can be used on allies for a shield or enemies for Pix placement; be flexible with your target choice.",
    ],
    powerSpikeReminders: [
      "Level 2 with E+Q gives strong poke; use E on the enemy then Q through Pix to chunk them from unexpected angles.",
      "Level 6 R is one of the best peeling ultimates in the game; it makes your ADC survive burst that would otherwise kill them.",
      "Ardent Censer completion empowers your shielded ally with attack speed and on-hit damage; this is a massive spike for auto-attack ADCs.",
    ],
  },

  Lux: {
    combos: [
      "Q (Light Binding) root into E (Lucent Singularity) placed on them, then pop E and R (Final Spark) for a full burst combo.",
      "E slow zone to force movement, then Q where they are walking for a predictable root; use E to set up Q rather than the other way.",
      "R through a minion wave to hit the enemy behind it when they think they are safe; Final Spark goes through all units.",
    ],
    tradingPatterns: [
      "Poke with E at max range when enemies step up to CS; the AoE zone forces them to either eat damage or give up the minion.",
      "Auto-attack after landing any ability to proc passive (Illumination) for bonus damage; this significantly increases your trade output.",
      "Hold Q as a deterrent against engages; a Lux with Q up zones melee supports from engaging on your ADC.",
    ],
    earlyGame:
      "Poke with E and auto-attack passive procs to whittle enemies down; look for Q roots into full combo for kill opportunities at level 3+.",
    midGame:
      "Use E to check bushes and control vision around objectives; land Q picks on enemies face-checking to create number advantages.",
    lateGame:
      "Stay far behind your frontline and look for Q picks on out-of-position carries; a single binding on an ADC from fog of war wins fights.",
    commonMistakes: [
      "Missing Q and having no self-peel; Lux is extremely vulnerable if her root is on cooldown against dive champions.",
      "Not auto-attacking to proc passive in lane; Lux passive does substantial damage and many players leave it on the table.",
      "Building full AP instead of support items; support Lux scales better with utility items that also help the team.",
    ],
    powerSpikeReminders: [
      "Level 3 with all three abilities gives kill pressure with a full Q-E-auto-R combo; look for all-in if enemies are below 60% HP.",
      "Level 6 R adds long-range execute potential; ping your ADC to poke enemies down, then R to finish kills across the map.",
      "Luden's Companion or first item completion massively increases your poke damage; your E alone can chunk squishies for 25% HP.",
    ],
  },

  Milio: {
    combos: [
      "Q (Ultra Mega Fire Kick) to knock back and stun an engaging enemy, then W (Cozy Campfire) your carry to heal and buff their range.",
      "E (Warm Hugs) shield onto your engage partner before they dive, then Q to knock enemies into them for follow-up CC.",
      "R (Breath of Life) to cleanse and heal your entire team when the enemy drops hard CC or AoE burst in a teamfight.",
    ],
    tradingPatterns: [
      "Use W on your ADC during trades to extend their auto-attack range, letting them hit enemies who cannot trade back effectively.",
      "Poke with Q through minions; it bounces and can hit enemies behind the wave for surprising damage and a brief stun.",
      "Shield your ADC with E proactively when they step up to CS; the bonus movement speed helps them reposition after trading.",
    ],
    earlyGame:
      "Buff your ADC with W range extension to win trades where they can auto-attack from outside the enemy's range, creating free damage.",
    midGame:
      "Stay with your carry and provide constant W and E buffs; Milio's strength is making his ADC stronger rather than making solo plays.",
    lateGame:
      "Hold R for the critical moment in teamfights when enemies commit CC chains; a well-timed R can cleanse 3+ stuns and swing the fight.",
    commonMistakes: [
      "Using R too early before the enemy uses their critical CC abilities; hold it until the most impactful CC chain is applied.",
      "Positioning too far forward as an enchanter; Milio should stay behind his carries and buff from the backline.",
      "Forgetting to keep W on your ADC during fights; the range extension is a constant DPS increase that many players overlook.",
    ],
    powerSpikeReminders: [
      "Level 2 with W+E gives your ADC a significant range and shield advantage in trades; use this to establish lane control.",
      "Level 6 R is a teamfight-changing cleanse for your entire team; communicate with your team to bait enemy CC before you ult.",
      "Moonstone Renewer or Shurelya's completion amplifies all your healing and shielding; group with your team to maximize value.",
    ],
  },

  Morgana: {
    combos: [
      "Q (Dark Binding) root into W (Tormented Shadow) placed under them: the root guarantees full W ticks for maximum damage.",
      "Flash R (Soul Shackles) into the enemy team, Zhonya's during the R channel, then Q whoever tries to escape the stun tether.",
      "E (Black Shield) your engaging ally before they go in, then follow up with Q on whoever the engage target is.",
    ],
    tradingPatterns: [
      "Place W on the caster minions to push the wave and poke simultaneously; if enemies stand in it they take significant damage over time.",
      "Hold Q and threaten it rather than throwing it randomly; Morgana with Q up zones harder than Morgana who just missed Q.",
      "Use E reactively to block enemy CC on your ADC; predict the enemy's engage pattern and time the shield to absorb the CC ability.",
    ],
    earlyGame:
      "Push the wave with W to gain level advantages and deny the enemy CS under tower while looking for Q bindings on enemies who step too far forward.",
    midGame:
      "Set up picks with Q in the jungle and river; a landed Q on a squishy target is often a guaranteed kill with team follow-up.",
    lateGame:
      "Use E to protect your carry from critical CC in teamfights and look for flash-R engages when the enemy team is grouped in tight spaces.",
    commonMistakes: [
      "Using E on yourself instead of your carry; Black Shield should almost always go on the teammate who is being targeted with CC.",
      "Wasting Q at max range with low accuracy; walk closer or wait for the enemy to use a dash before throwing Q for higher hit rates.",
      "Standing in the frontline trying to R when you do not have Zhonya's; without the stasis, you will die before R stuns.",
    ],
    powerSpikeReminders: [
      "Level 1 Q or W start both give strong lane presence; Q for kill lanes and W for push-and-poke lanes.",
      "Level 6 R with Flash gives teamfight engage threat; communicate to your team that you can flash-R for a multi-man stun.",
      "Zhonya's Hourglass completion is the most important spike; it enables the flash-R-Zhonya's combo that defines Morgana's teamfight pattern.",
    ],
  },

  Nami: {
    combos: [
      "W (Ebb and Flow) bounce off yourself to an enemy to an ally: position to maximize the three-hit bounce for damage and healing.",
      "R (Tidal Wave) long range into Q (Aqua Prison) bubble as they are knocked up: chain CC for extended lock-down.",
      "E (Tidecaller's Blessing) your ADC, then they auto-attack to slow, followed by your Q on the slowed target for an easy bubble.",
    ],
    tradingPatterns: [
      "E your ADC before they auto-attack for the bonus damage and slow; this makes their trades significantly stronger with minimal mana cost.",
      "W bounce poke: hit the enemy with W and let it bounce to you for a heal, winning the health trade in your favor.",
      "Threaten Q when enemies are locked in auto-attack animations on CS; the brief animation lock makes bubbles easier to land.",
    ],
    earlyGame:
      "Trade aggressively with W bounces and E-empowered ADC autos to establish lane dominance; Nami wins most 2v2 trades at levels 1-3.",
    midGame:
      "Group with your team and use R to disengage or engage; Tidal Wave's speed boost to allies who it passes through enables teamfight rotations.",
    lateGame:
      "Use R from far range to initiate fights or peel for your carry, and keep E on your ADC at all times for the slow and bonus damage.",
    commonMistakes: [
      "Using Q predictively without setup; raw Q is easy to dodge. Always slow first with E or R to guarantee the bubble.",
      "W bouncing only once instead of maximizing all three bounces; position to ensure the ability hits enemy-ally-enemy or ally-enemy-ally.",
      "Forgetting to E your ADC before they trade; the bonus damage and slow are free value that many Nami players forget to apply.",
    ],
    powerSpikeReminders: [
      "Level 2 with W+E gives exceptional trade power; E your ADC and W the enemy for a trade you almost always win.",
      "Level 6 R gives engage and disengage; use it reactively against dives or offensively to chain into Q for kills.",
      "Moonstone or Mandate completion boosts your healing and poke respectively; choose based on whether your team needs sustain or damage.",
    ],
  },

  Nautilus: {
    combos: [
      "Q (Dredge Line) hook into passive auto-attack root, then E (Riptide) slow followed by another auto to maximize CC chain duration.",
      "R (Depth Charge) on a backline target, then Q the knocked-up target and auto-E for an inescapable CC sequence.",
      "Flash auto-attack (passive root) into Q if they flash away, then E slow to keep them locked down without needing to land Q first.",
    ],
    tradingPatterns: [
      "Walk up and auto-attack the enemy with your passive root when they step too close; the root is point-and-click and very strong at level 1.",
      "Hook the enemy ADC when they auto a minion; the animation lock from CS-ing makes dodging Q much harder.",
      "Level 2 with Q+E or Q+passive allows a devastating all-in; hit level 2 first and immediately threaten an engage.",
    ],
    earlyGame:
      "Abuse your strong level 1 passive root and level 2 all-in to establish lane dominance; Nautilus wins most early trades with his CC chain.",
    midGame:
      "Roam to mid lane and use R on the enemy mid laner for a near-guaranteed kill with your mid's follow-up damage.",
    lateGame:
      "In teamfights, R the enemy carry to knock up everyone between you and the target, then Q a priority target for chain CC.",
    commonMistakes: [
      "Hooking the enemy tank into your team; always Q squishy targets or use Q on terrain to reposition instead.",
      "Forgetting that Q can hook terrain for escapes; in bad situations, Q a wall to pull yourself to safety.",
      "Using R on the nearest target instead of the backline carry; R knocks up everyone in its path, so aim it at the farthest priority target.",
    ],
    powerSpikeReminders: [
      "Level 1 passive root is extremely powerful; invade or trade at level 1 since your point-and-click CC is hard to beat.",
      "Level 6 R is a point-and-click engage on any target; use it to guarantee kills on the enemy mid laner during roams.",
      "Locket completion gives your team a teamfight shield; combine it with your CC chain for strong engage-and-protect fights.",
    ],
  },

  Pyke: {
    combos: [
      "Charged Q (Bone Skewer) pull into E (Phantom Undertow) dash-through stun for a double-CC engage combo.",
      "E through the target first to stun, then Q tap (not charged) for close-range damage when you are already on top of them.",
      "R (Death from Below) execute resets: chain R across multiple low-health enemies in teamfights for multi-kill gold generation.",
    ],
    tradingPatterns: [
      "Use W (Ghostwater Dive) camouflage to reposition behind enemies, then E through them into Q for a hard-to-react-to engage.",
      "Charge Q from brush to pull enemies into your ADC; the fog of war hides the animation and gives less time to react.",
      "After trading, use W passive to regenerate health in fog of war; Pyke's grey health recovery means he wins attrition trades.",
    ],
    earlyGame:
      "Look for aggressive hooks from brush and all-in at level 2-3; Pyke's kill pressure in lane is among the highest of all supports.",
    midGame:
      "Roam constantly with Mobility Boots and W; Pyke is the best roaming support and should look for picks in mid and jungle.",
    lateGame:
      "Stay near teamfights and look for R executes on low-health targets; the gold sharing from R keeps your team ahead in economy.",
    commonMistakes: [
      "Holding R for too long trying to get the perfect multi-execute; sometimes using R on one target is enough to win the fight.",
      "Building health items; Pyke's passive converts bonus health to AD, so health items are less efficient than lethality.",
      "Forgetting to use W for grey health regeneration after trades; duck into fog of war to heal before re-engaging.",
    ],
    powerSpikeReminders: [
      "Level 6 R gives execute and gold generation; this is when Pyke becomes a carry-support hybrid with snowball potential.",
      "Mobility Boots completion makes your roams deadly; you should be looking to roam mid after every base.",
      "Duskblade or first lethality item spikes your damage so Q-E-auto-R can execute most squishies from 40% HP.",
    ],
  },

  Rakan: {
    combos: [
      "W (Grand Entrance) dash-knock-up into E (Battle Dance) back to your ADC: engage and immediately return to safety.",
      "R (The Quickness) charm rush into W knock-up: activate R for speed, run through enemies to charm them, then W to knock up charmed targets.",
      "Flash W into R for an instant AoE engage that gives enemies almost no time to react; the fastest initiation in the game.",
    ],
    tradingPatterns: [
      "W forward to knock up the enemy, auto-attack and Q (Gleaming Quill) for the heal proc, then E back to your ADC to avoid retaliation.",
      "Q poke from range and walk toward an ally to proc the heal; Q has decent range and the heal helps sustain through poke lanes.",
      "With Xayah as your ADC, use the extended E range to engage from much farther away; the Xayah-Rakan synergy doubles your engage range.",
    ],
    earlyGame:
      "Look for W engages when enemies misposition, then E back to safety; Rakan's hit-and-run style makes him hard to punish in lane.",
    midGame:
      "Group with your team and look for R-W engages in the river and jungle; Rakan's engage range with R speed boost is enormous.",
    lateGame:
      "Flank from fog of war with R active and flash-W into the enemy backline for a multi-man charm and knock-up to start teamfights.",
    commonMistakes: [
      "W-ing in without an ally in E range to dash back to; always make sure you have an E target before engaging.",
      "Using R too early and getting CC'd before reaching the enemy backline; wait until you are close or use flash to close the gap instantly.",
      "Not using E back to your carry after engaging; staying in the enemy team without dashing out is almost always a death sentence.",
    ],
    powerSpikeReminders: [
      "Level 2 with W+E gives a safe engage-disengage pattern; W in for damage and knock-up, then E back to your ADC.",
      "Level 6 R massively increases your engage range and adds charm; this is when Rakan becomes one of the best engage supports.",
      "Shurelya's Battlesong completion gives extra speed for your R engage and helps your entire team follow up on your initiation.",
    ],
  },

  Rell: {
    combos: [
      "W (Ferromancy: Crash Down) jump into E (Attract and Repel) stun: jump onto enemies to knock up, then E a bound ally to stun everyone between you.",
      "R (Magnet Storm) pull enemies together during W knock-up for a multi-target CC chain that groups them for your team's AoE.",
      "Flash W into R for an instant AoE knock-up into pull; one of the most devastating engage combos for teamfights.",
    ],
    tradingPatterns: [
      "W onto the enemy ADC when they step forward to CS; the knock-up and shield give you a favorable short trade.",
      "Use E bind on your ADC and walk up to threaten the stun between you; enemies must respect the E range or get stunned.",
      "Poke with Q (Shattering Strike) to break shields and deal damage; Q steals resistances which helps win extended trades.",
    ],
    earlyGame:
      "Look for level 2 all-ins with W+E; the double CC chain is hard to survive and can force summoners or kills immediately.",
    midGame:
      "Group for teamfights where your AoE CC is most valuable; Rell excels in 5v5 fights around Dragon and Herald.",
    lateGame:
      "Flash-W-R into the enemy team to group them for your team's AoE damage; coordinate with teammates who have AoE ultimates.",
    commonMistakes: [
      "W-ing in without follow-up from your team; Rell is very slow in dismounted form and will die if her team does not engage with her.",
      "Forgetting the dismounted movement speed penalty after W; plan your positioning knowing you will be very slow after engaging.",
      "Not binding E to the right ally; bind it to whoever will be closest to enemies so the stun connects between you.",
    ],
    powerSpikeReminders: [
      "Level 2 W+E is a powerful double-CC engage that most bot lanes cannot handle; prioritize hitting level 2 first.",
      "Level 6 R adds a vacuum effect that groups enemies for your team; look for multi-man R combos in skirmishes.",
      "Locket or Radiant Virtue completion makes you much tankier and gives team utility; you can survive longer after engaging.",
    ],
  },

  "Renata Glasc": {
    combos: [
      "Q (Handshake) grab into throw: grab an enemy and throw them into another enemy to root both targets.",
      "R (Hostile Takeover) berserk into Q: ult the enemy team to make them attack each other, then Q stragglers who try to escape.",
      "E (Loyalty Program) through the minion wave to poke both enemy laners, then Q whoever is slowed for a guaranteed grab.",
    ],
    tradingPatterns: [
      "Poke with E through minions to damage and slow enemies; E has a large hitbox and is hard to sidestep in the minion wave.",
      "Use Q to grab an enemy and throw them behind you into your ADC's damage range; the displacement is excellent for picks.",
      "W (Bailout) your ADC before a fight to give them attack speed and the zombie state safety net; this makes all-ins heavily favor you.",
    ],
    earlyGame:
      "Poke with E through the wave and look for Q grabs on enemies who are slowed; Renata's CC chain is surprisingly strong at level 3.",
    midGame:
      "Look for R flanks from fog of war to berserk the enemy backline; a good Hostile Takeover on 2+ carries wins any teamfight.",
    lateGame:
      "Position to land R on the maximum number of enemy champions; late-game Hostile Takeover on a fed ADC can single-handedly win the fight.",
    commonMistakes: [
      "Using R when the enemy team is spread out; wait for them to group around an objective or chokepoint for maximum value.",
      "Forgetting to W your carry before a fight; the attack speed and zombie passive are Renata's most consistent ability.",
      "Throwing Q targets in the wrong direction; always aim to throw enemies toward your team or into other enemies for the root.",
    ],
    powerSpikeReminders: [
      "Level 3 with all abilities gives strong pick potential; E slow into Q grab is a reliable CC combo.",
      "Level 6 R is a game-changing teamfight ultimate; ping your team to bait a grouped fight around Dragon or Herald.",
      "Shurelya's or Imperial Mandate completion enhances your team's ability to follow up on your R and Q engages.",
    ],
  },

  Senna: {
    combos: [
      "Auto-attack into Q (Piercing Darkness) into auto-attack: weave Q between autos for maximum damage and soul collection.",
      "W (Last Embrace) root into charged auto and Q: W the target, wait for the root to proc, then auto-Q for guaranteed damage.",
      "R (Dawning Shadow) across the map to shield allies and damage enemies; use it to turn fights happening in other lanes.",
    ],
    tradingPatterns: [
      "Auto-attack the enemy and immediately Q to cancel the animation; this two-hit trade is fast and efficient for stacking souls.",
      "Collect souls aggressively from minions and enemy champions; each soul increases your range, AD, and crit, making Senna a scaling monster.",
      "Position behind minions to Q through them and heal your ADC while poking the enemy; Q hits all units in a line.",
    ],
    earlyGame:
      "Focus on collecting souls through auto-attacks and minion drops to scale your range and damage; every soul matters for your late-game power.",
    midGame:
      "Use your increasing range to poke safely from behind your team and R to assist fights across the map for cross-map impact.",
    lateGame:
      "With high soul stacks, Senna's auto-attack range exceeds most champions; position far back and DPS like an ADC while healing your team with Q.",
    commonMistakes: [
      "Ignoring soul drops to CS or trade; souls are Senna's scaling mechanic and missing them delays your power significantly.",
      "Standing too far forward despite being a squishy ranged support; Senna should use her long range to stay safe, not face-check.",
      "Using R only for damage; the global shield on allies can save teammates across the map and should not be held just for kills.",
    ],
    powerSpikeReminders: [
      "Every 20 souls gives significant stat breakpoints; track your soul count and play more aggressively when nearing thresholds.",
      "Level 6 R gives global presence; always watch the minimap for opportunities to R across the map to influence fights.",
      "Eclipse or first lethality item combined with souls makes Senna's poke extremely threatening; look to force trades after this spike.",
    ],
  },

  Seraphine: {
    combos: [
      "E (Beat Drop) slow or root (with Echo passive) into R (Encore) charm extension for a long-range CC chain.",
      "R through as many enemies as possible, as it extends range with each champion hit, then follow up with E for chain CC.",
      "Double-cast E (using passive Echo) to root instead of slow, then Q (High Note) on the rooted targets for guaranteed damage.",
    ],
    tradingPatterns: [
      "Poke with Q at max range on enemies near low-health minions; Q deals more damage to low-health targets.",
      "Use W (Surround Sound) shield and heal when trading to ensure you come out ahead in health; the shield absorbs return damage.",
      "Track your passive Echo stacks and use the double-cast on E for a root in trades rather than wasting it on Q or W.",
    ],
    earlyGame:
      "Poke with Q and auto-attacks from range; manage your passive stacks to have Echo ready on E when your jungler ganks for a guaranteed root.",
    midGame:
      "Group with your team and look for multi-man R engages; Seraphine's strength scales with how many champions she can hit with R.",
    lateGame:
      "Land R on multiple enemies in teamfights; a 4-5 person Encore that extends through the enemy team is one of the most impactful abilities in the game.",
    commonMistakes: [
      "Wasting Echo passive on Q poke instead of saving it for E root; the root from double E is far more valuable than extra Q damage.",
      "Using R on a single target; Seraphine R extends range per champion hit, so always aim for multiple targets.",
      "Standing too close to the enemy team; Seraphine is squishy and should use her long range to stay safe while casting.",
    ],
    powerSpikeReminders: [
      "Level 3 with passive Echo on E gives a root that enables aggressive trades; manage your passive stacks carefully.",
      "Level 6 R is a massive teamfight engage tool; it can engage from very long range if it passes through multiple champions.",
      "Moonstone or Echoes of Helia completion makes your W healing and shielding substantial in extended teamfights.",
    ],
  },

  Sona: {
    combos: [
      "Q (Hymn of Valor) auto-attack with Power Chord: Q then auto for empowered damage; this is your primary poke combo.",
      "W (Aria of Perseverance) Power Chord auto on the enemy ADC to reduce their damage by 25% with the diminuendo passive.",
      "R (Crescendo) flash stun into Q Power Chord auto for burst; the AoE stun sets up your team perfectly.",
    ],
    tradingPatterns: [
      "Poke with Q and the empowered auto from range when enemies step up for CS; Sona's Q auto is one of the highest damage poke combos.",
      "Use W aura to heal and shield your ADC after trades; the small heal adds up over multiple exchanges and sustains the lane.",
      "Stack passive to 3 and choose which Power Chord to use: Q chord for damage, W chord for damage reduction, E chord for slow.",
    ],
    earlyGame:
      "Poke aggressively with Q and Power Chord autos while managing mana; Sona is weak to all-ins so poke safely and avoid getting engaged on.",
    midGame:
      "Group with your team and provide aura buffs; Sona's passive auras affect nearby allies and she scales better in groups.",
    lateGame:
      "Sona is a late-game hyperscaler; with multiple items, her auras, heals, shields, and R are teamfight-defining abilities.",
    commonMistakes: [
      "Getting caught out of position while trying to Q poke; Sona is extremely squishy and dies instantly to hard engage.",
      "Using R on only one person; always try to hit 2+ enemies with Crescendo for maximum impact.",
      "Not switching Power Chord based on the situation; W chord is better than Q chord when peeling, and E chord is better when chasing.",
    ],
    powerSpikeReminders: [
      "Sona is weakest in early lane; play safe levels 1-5 and focus on poking without getting engaged on.",
      "Level 6 R gives a strong AoE stun that compensates for Sona's weak early game; look for 2+ man ults.",
      "Moonstone and Seraphs Embrace give Sona massive sustain and mana; after these items, she becomes a team-buffing machine.",
    ],
  },

  Soraka: {
    combos: [
      "Q (Starcall) hit on the enemy into W (Astral Infusion) heal on your ADC: Q landing gives Soraka health regen which offsets W's health cost.",
      "E (Equinox) silence zone on an engaging enemy to cancel dashes and channels, then Q the silenced target for the slow and damage.",
      "R (Wish) globally to heal all allies when a teammate is low in a fight across the map; always watch your minimap for R opportunities.",
    ],
    tradingPatterns: [
      "Land Q consistently on the enemy when they walk up to CS; the center hit deals more damage and gives a larger heal over time.",
      "Hit Q first before using W to heal your ADC; the rejuvenation buff from Q landing offsets the health cost of W significantly.",
      "Place E on top of enemies who are channeling or dashing to silence them and cancel their abilities; this is key against engage supports.",
    ],
    earlyGame:
      "Poke with Q to sustain yourself and your ADC with W; Soraka wins lane by out-sustaining the enemy through constant Q hits.",
    midGame:
      "Stay with your ADC and heal them through fights; watch the map for R opportunities to turn fights across the map.",
    lateGame:
      "Position far behind your carries and spam W heals on whoever is being focused; Soraka's sustained healing in late-game fights is unmatched.",
    commonMistakes: [
      "Using W without landing Q first; healing without the rejuvenation buff from Q drains Soraka's own health dangerously fast.",
      "Standing in the frontline and getting caught; Soraka needs to stay alive in the backline to heal her team.",
      "Forgetting to use R for cross-map plays; Wish can save teammates in other lanes and should be used proactively.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q+W gives incredible sustain; if you land Q consistently, you and your ADC can out-heal almost any poke lane.",
      "Level 6 R gives global healing presence; look at the minimap constantly for opportunities to save teammates.",
      "Moonstone Renewer or Warmog's Armor completion lets Soraka heal without worrying about her own health, removing her biggest weakness.",
    ],
  },

  Swain: {
    combos: [
      "E (Nevermove) root into passive pull (Ravenous) into W (Vision of Empire) placed on the pulled target for guaranteed damage.",
      "R (Demonic Ascension) activation in a fight, then E-passive-W for CC while draining; the sustain from R makes extended fights heavily favor Swain.",
      "Flash E to surprise root an enemy at close range, then passive pull into W and Q (Death's Hand) for burst.",
    ],
    tradingPatterns: [
      "Land E through the minion wave; it passes through minions on the way out and roots on the way back, making it a deceptive skillshot.",
      "Use W at long range to zone enemies off CS or check bushes; the vision and slow from W are useful even without follow-up.",
      "Pull enemies with passive after your ADC or jungler lands CC; Swain passive works off any allied immobilize, not just his own E.",
    ],
    earlyGame:
      "Focus on landing E through the minion wave and pulling enemies with passive to stack your soul fragments for scaling.",
    midGame:
      "Look for fights in tight jungle areas where R drains multiple enemies; Swain excels in skirmishes around objectives.",
    lateGame:
      "Activate R and front-line for your team; with enough soul stacks and items, Swain becomes a drain-tanking menace in teamfights.",
    commonMistakes: [
      "Throwing E directly at champions instead of through minions; E roots on the return, so casting it through the wave extends its effective range.",
      "Not collecting soul fragments from passive pulls; each fragment increases Swain's max health and is essential for scaling.",
      "Using R outside of fights; the drain needs nearby enemies to be effective, so only activate it when enemies are in range.",
    ],
    powerSpikeReminders: [
      "Level 3 with E+passive+W gives strong pick potential; a landed E-pull-W combo chunks enemies for 30-40% HP.",
      "Level 6 R transforms Swain into a drain tank; force fights when R is up because Swain is much weaker without it.",
      "Liandry's Anguish or Rod of Ages completion massively increases Swain's sustained damage and survivability in fights.",
    ],
  },

  "Tahm Kench": {
    combos: [
      "Q (Tongue Lash) slow into three auto-attacks to stack passive, then Q again to stun when at 3 stacks (An Acquired Taste).",
      "W (Abyssal Dive) dive onto enemies for a knock-up, then auto-Q-auto to stack passive quickly for a follow-up stun.",
      "R (Devour) an ally to save them from burst, spit them out in a safe position, then turn with Q and W to peel.",
    ],
    tradingPatterns: [
      "Walk up and auto-attack to stack passive; Tahm Kench's melee damage with passive stacks is surprisingly high.",
      "Q poke from range and slow enemies who try to CS; the slow enables you to walk up and auto for passive stacks.",
      "Use E (Thick Skin) grey health shield to absorb damage in trades, then back off to regenerate; this makes you win attrition fights.",
    ],
    earlyGame:
      "Walk up aggressively and stack passive with autos and Q; Tahm Kench wins most melee-range trades with his raw stats and passive damage.",
    midGame:
      "Peel your carry with R (Devour) when they are being dived, and use W to engage or reposition in skirmishes.",
    lateGame:
      "Stay near your ADC and use R to swallow them when assassins or divers commit; the save potential of Devour is unmatched for peeling.",
    commonMistakes: [
      "Using R offensively to eat enemies when your ADC needs the save; almost always prioritize defensive R on your carry.",
      "Forgetting to use E shield before it decays; the grey health window is short and must be activated to get value.",
      "Chasing too deep with W; Abyssal Dive has a long cooldown and leaves you without an escape if the engage fails.",
    ],
    powerSpikeReminders: [
      "Level 1-3 Tahm Kench has some of the highest base stats in the game; trade aggressively in melee range.",
      "Level 6 R (Devour) gives unmatched peel for your ADC; communicate to your carry that you can swallow them to save them.",
      "Heartsteel or Hollow Radiance completion makes Tahm Kench much tankier and his passive damage scales with max HP.",
    ],
  },

  Taric: {
    combos: [
      "E (Dazzle) stun through your linked W (Bastion) ally for double stun coverage; the stun casts from both you and your bonded ally.",
      "W link to your engaging ally, then E when they dive in to stun enemies from your ally's position rather than your own.",
      "R (Cosmic Radiance) on your team before a dive or engage for 2.5 seconds of invulnerability; time it so invulnerability hits when enemies commit damage.",
    ],
    tradingPatterns: [
      "Auto-attack between abilities to reduce cooldowns with passive (Bravado); each ability cast gives two empowered autos that reduce all cooldowns.",
      "E through your ADC when the enemy walks up; the stun range from your bonded ally's position catches enemies off guard.",
      "Use Q (Starlight's Touch) healing with passive auto-attack weaving to sustain through trades; auto-Q-auto for efficient healing.",
    ],
    earlyGame:
      "Trade in melee range with passive empowered autos and E stun; Taric wins extended trades with his sustain and damage from passive.",
    midGame:
      "Coordinate R with your team's engage; tell your engage champion to dive and time R so the invulnerability hits as the enemy uses burst.",
    lateGame:
      "R your team when committing to a fight; 2.5 seconds of invulnerability on your entire team during a teamfight is game-winning if timed correctly.",
    commonMistakes: [
      "Using R too late so it pops after your team is already dead; the 2.5 second delay means you need to predict when damage is coming.",
      "Not auto-attacking to reduce cooldowns; Taric's passive is the core of his kit and skipping autos halves your effectiveness.",
      "Linking W to the wrong ally; always bind to whoever will be closest to enemies to maximize E stun angles.",
    ],
    powerSpikeReminders: [
      "Level 2 with E+Q gives strong melee trading; stun with E, then auto-Q-auto for empowered trades with healing.",
      "Level 6 R is a teamfight-defining ability; coordinate with your team and practice the timing of the 2.5 second delay.",
      "Locket plus Knight's Vow completion gives massive team protection on top of your existing healing and invulnerability.",
    ],
  },

  Thresh: {
    combos: [
      "Q (Death Sentence) hook, reactivate Q to fly in, then E (Flay) backward to pull the enemy deeper into your team.",
      "E flay forward into Q: flay the enemy toward you first to slow them, then Q for an easy hook on the slowed target.",
      "R (The Box) after flying in with Q: place the Box around the hooked target to trap them in the slow walls.",
    ],
    tradingPatterns: [
      "Walk up and E (Flay) auto-attack poke with the empowered passive auto; Thresh's charged auto deals significant bonus magic damage.",
      "Hold Q and walk forward threateningly; the threat of hook zones harder than throwing it and missing.",
      "W (Dark Passage) lantern to your jungler for gank setup; drop lantern in the jungle for your jungler to click for a surprise engage.",
    ],
    earlyGame:
      "Poke with charged E passive autos and threaten Q hooks from brush to establish lane control; Thresh's level 2 with Q+E is a strong all-in.",
    midGame:
      "Roam with your jungler and use W lantern to bring them into ganks from unexpected angles that enemies cannot react to.",
    lateGame:
      "Look for Q picks on out-of-position carries and use W lantern to save allies or bring your engagers deep into the enemy team.",
    commonMistakes: [
      "Always reactivating Q to fly into the enemy team; sometimes holding the hook without flying in is better to keep your ADC safe.",
      "Throwing W lantern too late to save an ally; anticipate when your teammate will need the lantern and throw it early.",
      "Neglecting E passive auto-attack poke; the charged auto is free damage that many Thresh players forget to use in lane.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q+E gives kill threat; if you land Q you can fly in and E back for a deadly CC chain.",
      "Boots of Mobility completion makes Thresh's roams and lantern delivery far more effective; roam every time you recall.",
      "Thresh's soul collection from passive scales him infinitely; collect every soul you can to increase your armor and AP over time.",
    ],
  },

  "Vel'Koz": {
    combos: [
      "W (Void Rift) placed on the target, then Q (Plasma Fission) to slow them inside the W for both W hits and a passive stack.",
      "E (Tectonic Disruption) knock-up into W on the knocked-up target, then Q for three passive stacks into R (Lifeform Disintegration Ray) to proc true damage.",
      "Q angle split: fire Q to the side and reactivate to split it at a 90-degree angle to hit enemies hiding behind minions.",
    ],
    tradingPatterns: [
      "Poke with Q through angles; Vel'Koz Q splits at 90 degrees, so cast it to the side of the wave to hit enemies behind minions.",
      "Land W on the enemy when they walk in a straight line; both W hits proc passive stacks and deal significant damage.",
      "Stay at maximum range and use E only defensively to knock up enemies who engage on you; do not waste your only self-peel offensively.",
    ],
    earlyGame:
      "Poke from max range with Q angles and W; Vel'Koz's base damage is extremely high and can force enemies out of lane before level 6.",
    midGame:
      "Control objectives by standing far back and using Q-W poke to whittle enemies before a fight starts; zone with E if anyone dives you.",
    lateGame:
      "In teamfights, wait for enemies to commit cooldowns, then channel R to melt their team; a full-duration R with passive procs deals massive true damage.",
    commonMistakes: [
      "Using R too early in the fight before enemies commit their gap closers; you will get interrupted instantly.",
      "Standing too close to enemies; Vel'Koz's entire kit is long-range and he dies instantly if caught in melee range.",
      "Not utilizing Q angle splits; firing Q straight is predictable. Use the geometry to hit enemies from unexpected angles.",
    ],
    powerSpikeReminders: [
      "Level 3 with all abilities gives three passive stacks into true damage proc; every full combo chunks for 40%+ HP.",
      "Level 6 R is a massive damage ultimate; with passive stacks already applied, R procs the true damage repeatedly.",
      "Luden's Companion completion spikes your poke damage so each Q alone takes 20-25% of a squishy's health bar.",
    ],
  },

  Xerath: {
    combos: [
      "W (Eye of Destruction) center hit slow into Q (Arcanopulse) charged through the slowed target for guaranteed poke.",
      "E (Shocking Orb) stun into W center into Q: the stun guarantees the W center hit which guarantees the Q follow-up.",
      "R (Rite of the Arcane) to snipe low-health enemies from across the map; lead your shots slightly ahead of where they are walking.",
    ],
    tradingPatterns: [
      "Poke with Q through the wave from max range to hit enemies safely behind their minions; Xerath Q goes through all units.",
      "Auto-attack minions to proc passive mana restore; Xerath passive gives mana back on autos, which sustains his poke pattern.",
      "Use W to zone enemies off CS by placing it where they want to walk; the center hit slow is strong enough to enable follow-up.",
    ],
    earlyGame:
      "Poke relentlessly with Q and W from max range; Xerath's lane dominance comes from chunking enemies without them being able to trade back.",
    midGame:
      "Use R from safe positions to poke enemies at objectives or snipe low-health targets retreating from fights.",
    lateGame:
      "Stay far behind your team and siege with Q-W poke; before fights, use R to chunk enemies so your team engages with a health advantage.",
    commonMistakes: [
      "Standing too close and getting engaged on; Xerath has no mobility and dies to any hard engage if out of position.",
      "Not using passive auto-attacks on minions for mana; skipping passive autos means running out of mana much faster.",
      "Firing R shots too fast; take your time to aim each R shot, leading slightly ahead of moving targets for accuracy.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q+W gives strong poke; W slow into Q is reliable harass that enemies struggle to avoid in lane.",
      "Level 6 R gives cross-map snipe potential; immediately look at other lanes for low-health enemies to finish off.",
      "Luden's Companion completion massively boosts poke damage; a single Q takes 30%+ of a squishy champion's health.",
    ],
  },

  Yuumi: {
    combos: [
      "Detach, auto-attack for passive shield and mana, then Q (Prowling Projectile) and reattach to your carry with W (You and Me!).",
      "R (Final Chapter) waves while attached to a diving ally: ride your bruiser or assassin into the enemy team while channeling R for multi-hit roots.",
      "E (Zoomies) speed boost your attached ally to chase or run, then Q to slow the enemy for your carry to finish.",
    ],
    tradingPatterns: [
      "Detach to auto-attack for passive shield and mana restoration whenever it is safe; the mana sustain from passive is essential for laning.",
      "Q from your attached ally to poke enemies; the guided missile deals more damage at max range and the slow is useful for trades.",
      "Attach to whichever ally is winning their lane or carrying the game; Yuumi amplifies strong allies more than she helps struggling ones.",
    ],
    earlyGame:
      "Detach frequently to auto-attack for passive mana and shield, then reattach; Yuumi's laning is strongest when she procs passive often.",
    midGame:
      "Attach to your team's strongest carry and amplify them; roam by riding your jungler or mid laner between lanes without walking.",
    lateGame:
      "Stay attached to your highest-priority carry and use E for heals and speed, Q for poke, and R to root enemies in teamfights.",
    commonMistakes: [
      "Never detaching in lane; without passive procs, Yuumi runs out of mana quickly and provides minimal lane presence.",
      "Attaching to a tank or losing teammate instead of the carry who can use the buffs most effectively.",
      "Using R on only one target; R channels multiple waves, so position with your attached ally to hit as many enemies as possible.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q+W gives safe poke while attached; trade with Q from your carry's position for safe harass.",
      "Level 6 R gives AoE root potential; ride your engager into the enemy team and channel R for a multi-man root.",
      "Moonstone or Staff of Flowing Water completion makes your heals substantially stronger; group with your best carry after this spike.",
    ],
  },

  Zilean: {
    combos: [
      "Q (Time Bomb) on the target, then W (Rewind) to reset Q, then Q again on the same target for a guaranteed double-bomb AoE stun.",
      "E (Time Warp) speed yourself up to run at an enemy, then Q-W-Q double bomb for a stun on a target you could not otherwise reach.",
      "E slow the enemy, then Q-W-Q on them while they are slowed for an easy double-bomb stun setup.",
    ],
    tradingPatterns: [
      "Q-W-Q double bomb is your primary combo; place the first bomb, immediately W to reset, then place the second for the stun.",
      "Use E to speed up your ADC or slow an enemy; E's movement speed manipulation is one of the most versatile basic abilities.",
      "Place single Q bombs on minions near the enemy to zone; even without the stun, the AoE explosion chunks nearby enemies.",
    ],
    earlyGame:
      "Poke with Q bombs and look for Q-W-Q double-bomb stuns on enemies who walk too close; the stun combined with your ADC's damage is lethal.",
    midGame:
      "Speed up your engager with E and follow up with double-bomb stuns; Zilean is excellent at enabling divers and assassins.",
    lateGame:
      "R (Chronoshift) your carry the instant they are about to die in teamfights; a well-timed ult effectively gives your team a second life.",
    commonMistakes: [
      "Missing the second Q bomb and not getting the stun; practice the Q-W-Q timing until the double bomb is consistent.",
      "Using R too early before the enemy commits their kill combo; wait until your carry is actually about to die so the enemy wastes cooldowns.",
      "Forgetting to use E on allies for speed boosts; E is an extremely powerful ability that many Zilean players underutilize.",
    ],
    powerSpikeReminders: [
      "Level 2 with Q+W gives the double-bomb stun; this is one of the strongest level 2 power spikes for poke supports.",
      "Level 6 R (Chronoshift) is a game-changing resurrection; communicate to your carry that they can play aggressively because you have R.",
      "Ability haste items reduce W cooldown, which reduces Q cooldown, which means more double-bomb stuns; prioritize haste in your build.",
    ],
  },

  Zyra: {
    combos: [
      "E (Grasping Roots) through seeds to spawn Vine Lashers (slowing plants), then Q (Deadly Spines) on more seeds for Thorn Spitters (ranged plants).",
      "R (Stranglethorns) on top of your plants and enemies: the ult knocks up enemies and enrages all plants in the zone for bonus attack speed.",
      "E root into W (Rampant Growth) seed on the rooted target, then Q through the seed for two plants attacking a CC'd target.",
    ],
    tradingPatterns: [
      "Place seeds in the lane brush and near CS paths; when enemies walk near them, Q or E through the seeds to spawn plants for free damage.",
      "Poke with Q through seeds to spawn Thorn Spitters; the ranged plants auto-attack nearby enemies and force them off the wave.",
      "Save E for disengage against engage supports; the root combined with spawned Vine Lashers makes it very hard to reach Zyra.",
    ],
    earlyGame:
      "Place seeds aggressively and poke with Q-spawned plants to whittle enemies down; Zyra's plant damage in early levels is surprisingly high.",
    midGame:
      "Control Dragon and Baron areas with seeds and plants for vision and zone control; Zyra is one of the best supports at objective fights.",
    lateGame:
      "Land a multi-target E root into R knock-up in teamfights; Zyra's AoE CC and plant damage make her a teamfight powerhouse from the support role.",
    commonMistakes: [
      "Placing seeds randomly instead of near where enemies are walking; seeds are limited and should be placed where you will Q or E.",
      "Using R without plants in the zone; Stranglethorns enrages plants, so always have seeds down before ulting for maximum damage.",
      "Standing too far forward; Zyra is very squishy and will die instantly if caught by engage without E available for self-peel.",
    ],
    powerSpikeReminders: [
      "Level 3 with all three abilities plus seeds gives strong lane pressure; two plants attacking an enemy chunks them quickly.",
      "Level 6 R adds massive AoE knock-up and plant enrage; look for multi-man ults in Dragon and Baron fights.",
      "Liandry's Anguish completion makes Zyra's plants apply burn damage over time; this dramatically increases her teamfight DPS.",
    ],
  },
};
