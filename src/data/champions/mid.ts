export interface ChampionCoaching {
  combos: string[];
  tradingPatterns: string[];
  earlyGame: string;
  midGame: string;
  lateGame: string;
  commonMistakes: string[];
  powerSpikeReminders: string[];
}

export const midChampions: Record<string, ChampionCoaching> = {
  Ahri: {
    combos: [
      "E -> W -> Q: Charm first to guarantee full Q true-damage return and W foxfire locks on",
      "R -> E -> W -> Q -> R -> R: Use first R dash to close gap, Charm at close range for guaranteed hit, weave remaining R dashes for damage and reposition",
      "Flash -> E -> Q -> W -> Ignite: Flash-Charm pick combo for instant kill pressure on squishy targets",
    ],
    tradingPatterns: [
      "Land Q through the wave to push and poke simultaneously; the return true damage chunks hard if they walk predictably",
      "At level 3, hold E as a threat to zone them off CS, then Q through minions when they respect the Charm",
      "Use W passively during trades to proc Electrocute — walk into range, W auto Q for quick burst then back off",
    ],
    earlyGame: "Focus on pushing the wave with Q while poking through minions, and look for Charm angles when the enemy steps past their caster line.",
    midGame: "Roam with R to sidelanes after shoving mid, and use Charm picks on isolated targets to convert into objectives.",
    lateGame: "Stay with your team and fish for Charm on priority targets before fights; one landed E on a carry wins the teamfight.",
    commonMistakes: [
      "Throwing E predictably after dashing — good players will sidestep; wait a beat or use R to reposition before casting Charm",
      "Using all three R charges aggressively and getting caught with no escape — always save at least one dash for safety",
      "Not tracking the Q return damage — position so Q comes back through the target for the true damage portion",
    ],
    powerSpikeReminders: [
      "Level 6 all-in with R + Ignite is a kill threat on most mids; look for it immediately when you hit 6 first",
      "Luden's completion gives massive waveclear and burst — force a roam or fight right after buying it",
      "After two items you can one-shot squishies with a full combo; start playing for picks aggressively",
    ],
  },

  Akali: {
    combos: [
      "Q -> walk back (passive ring) -> empowered AA -> Q: Core laning trade. Cross ring for empowered auto damage and energy restore.",
      "R1 -> Q -> AA -> E1 -> E2 -> Q -> AA -> R2 (execute): Full all-in. R2 deals more damage the lower the target's HP.",
      "W -> Q -> AA (stealth) -> Q -> AA (stealth) -> repeat: Shroud lets you weave in and out for repeated trades.",
      "E1 -> Flash -> E2 -> Q -> Auto -> R1 -> R2: Flash redirect on E1 for surprise engage from unexpected angles",
    ],
    tradingPatterns: [
      "Q at max range -> step BACK through passive ring -> empowered AA -> Q again. This is Akali's core trading pattern — the passive ring gives energy and bonus damage.",
      "Use W shroud to trade in and out of stealth, forcing enemies to miss targeted abilities between your attacks.",
      "At level 6, poke with Q-passive-AA until they're at 60% HP, then commit with R1 -> full combo -> R2 execute.",
      "E (Shuriken Flip) to mark enemy, E2 to dash to them for hard commit — only use when kill is likely.",
    ],
    earlyGame: "Trade with Q -> passive ring -> empowered AA pattern. Use W to survive ganks and extend trades. Conserve energy by not spamming Q on wave.",
    midGame: "Assassinate in side lanes. Use R mobility to engage and escape. Roam constantly for picks on isolated targets.",
    lateGame: "Flank teamfights from fog of war. R1 in, burst a carry, W for safety, R2 to execute or escape. Wait for key enemy CCs to be used first.",
    commonMistakes: [
      "Not stepping back through passive ring for empowered auto — massive damage and energy loss if you skip it",
      "Using W to engage instead of saving it for sustained trading safety or escape",
      "Committing R2 execute too early — R2 scales with missing HP, wait until target is low",
      "Running out of energy by spamming Q without using passive ring autos for energy restore",
      "Not roaming post-6 — Akali's map pressure with R is one of her biggest strengths",
    ],
    powerSpikeReminders: [
      "Level 3: Full Q-passive-E trading pattern available. Start looking for aggressive trades.",
      "Level 6 with Ignite: R1 and R2 give engage and execute. Kill threat on any squishy below 70% HP.",
      "Hextech Rocketbelt: Extra dash + burst. Assassination range increases significantly.",
      "Shadowflame: Magic pen makes your burst lethal to squishies even with some MR.",
    ],
  },

  Akshan: {
    combos: [
      "E -> Q -> Auto -> Auto -> Auto: Swing with E, throw Q during the swing for extra damage, cancel E early near target for passive double-shot autos",
      "W stealth -> E -> Q -> R: Approach in camouflage, engage with swing for burst, then R to finish if they flash away",
      "Q -> Flash -> Auto -> Auto -> E away: Flash in to proc passive double-shot for quick burst, E out to safety",
    ],
    tradingPatterns: [
      "Q boomerang through the wave so it returns through the enemy champion for double hit plus waveclear simultaneously",
      "Use E swing off terrain to close distance, auto twice for passive proc, then E back or to terrain to disengage",
      "In short trades, auto -> Q -> auto to proc passive double-shot and win almost every level 1-2 trade against mages",
    ],
    earlyGame: "Abuse your range and passive double-shot to bully melee mids; push the wave and roam with W camouflage to scuttle fights or bot lane.",
    midGame: "Use W camouflage to roam constantly and collect takedowns for Dirty Fighting gold; prioritize picking off isolated targets with E engages.",
    lateGame: "Play as a flanking marksman who cleans up fights with passive revives; stay near walls for E escape routes.",
    commonMistakes: [
      "Using E aggressively without nearby terrain to escape to — always have a swing-out path planned before engaging",
      "Channeling R in the open where it gets blocked by minions or tanks; reposition to a flank angle first",
      "Forgetting W passive revive mechanic — focus the enemy who got the kills to bring your team back",
    ],
    powerSpikeReminders: [
      "Level 2 with E you can swing-trade and outtrade most mids who don't have their full kit yet",
      "Kraken Slayer completion makes your double-shot autos chunk squishies for 40% HP in a single trade",
      "At two items your R can execute from 50% HP; use it to finish targets who flash away from fights",
    ],
  },

  Anivia: {
    combos: [
      "Q -> detonate Q -> E -> R -> E: Double damage E on stunned chilled target, place R for sustained zone, E again when off cooldown for second chilled proc",
      "R -> E -> Q -> detonate Q -> E: Lead with R for guaranteed chill, E for double damage, then Q stun for follow-up E",
      "Wall -> Q -> detonate Q -> R -> E: Cut off escape with W, stun with Q, lay R on top for DPS and chilled E",
    ],
    tradingPatterns: [
      "Place R on the wave and the enemy simultaneously; if they stay in it, E for double damage, if they walk out, you get free waveclear",
      "Throw Q through the wave toward the enemy — even if they dodge, you can detonate it for waveclear and zone",
      "At level 6, R on the wave forces them to choose between CS and taking chill damage; E any time they're chilled for massive poke",
    ],
    earlyGame: "Farm safely with autos and Q waveclear; your kill pressure is low pre-6 so focus on not dying and scaling to your R power spike.",
    midGame: "Control objectives with R zone and W terrain blocking; you can single-handedly block jungle chokepoints in dragon and baron fights.",
    lateGame: "Place R in teamfight chokepoints, wall off priority targets, and spam E on chilled enemies; your DPS in sustained fights is among the highest in the game.",
    commonMistakes: [
      "Using E without the target being chilled — unchilled E does pitiful damage; always R or Q first",
      "Placing wall poorly and blocking your own teammates' escape routes or pushing enemies to safety",
      "Relying on egg passive as a safety net — good players will just wait and kill you in egg form easily",
    ],
    powerSpikeReminders: [
      "Level 6 is your biggest single spike — R gives waveclear, zone control, and makes E deal double damage consistently",
      "Tear + Lost Chapter solves all mana issues; from this point you can permanently control the wave",
      "Rod of Ages fully stacked + Seraph's makes you deceptively tanky with egg passive as backup",
    ],
  },

  Annie: {
    combos: [
      "Flash -> R (with stun) -> W -> Q -> Ignite: Flash-Tibbers stun is the most reliable engage in mid lane; W and Q finish the kill",
      "Q (stun) -> W -> R -> Ignite: Use Q stun to lock them down, W for burst, R on top for the kill and Tibbers DPS",
      "E -> Q -> W -> Q -> R (stun ready): Stack passive with E and Q on minions, then Flash-R when stun is loaded",
    ],
    tradingPatterns: [
      "Last-hit with Q to refund mana, then when stun is at 3 stacks, Q a minion to get to 4 and zone with threat of stun",
      "With stun ready, walk up and Q the enemy for a guaranteed stun into W auto for a chunk trade",
      "Hold stun passive as a zoning tool — the threat of Flash-Tibbers stun keeps enemies at max range permanently",
    ],
    earlyGame: "Farm with Q for mana efficiency, stack passive to 3-4 stacks to create kill threat, and look for Flash-stun all-in at level 6.",
    midGame: "Group with your team and look for multi-man Tibbers stuns in jungle skirmishes; your Flash-R engage decides fights.",
    lateGame: "Stay with your ADC for peel or Flash-R the enemy backline; a 3+ man Tibbers stun wins any teamfight outright.",
    commonMistakes: [
      "Using stun on a minion wave to push and then having no kill pressure for 30+ seconds",
      "Walking up without Flash to try to engage — Annie without Flash is not a real threat at higher elos",
      "Ignoring Tibbers after casting him — re-command Tibbers with R to focus priority targets for significant extra DPS",
    ],
    powerSpikeReminders: [
      "Level 6 with Flash is your kill condition — ping your jungler and force an all-in with Flash-R stun",
      "After Luden's you can one-shot any squishy with a full combo; play around Flash cooldown timers",
      "Flash cooldown is your real ultimate cooldown — track it and play aggressive every time it's available",
    ],
  },

  "Aurelion Sol": {
    combos: [
      "Q -> Q -> Q (stacking) -> W -> R: Stack Q three times for the stardust, W for burst and more stacks, then R for massive AoE damage",
      "E -> Q -> Q -> Q -> W: Use E flight to reposition over terrain, then stack Q from a safe angle and burst with W",
      "R -> Q -> Q -> Q -> W: Open with R to slow and chunk, then follow up with stacked Qs and W for cleanup",
    ],
    tradingPatterns: [
      "Q the wave and enemy simultaneously to stack stardust while pushing; every Q hit on a champion builds your scaling",
      "Use W after landing two or more Qs for the empowered burst; don't W raw unless you need the waveclear",
      "Poke from max range with Q in lane, only stepping up for W when they're CC'd by your jungler or they misposition",
    ],
    earlyGame: "Stack stardust aggressively by Qing through the wave into the enemy; your scaling depends entirely on stardust accumulation so prioritize stacks over kills.",
    midGame: "Use E to roam to sidelane fights from unexpected angles, and continue stacking stardust in every skirmish you can find.",
    lateGame: "With high stardust stacks, your R covers half the screen — use it to zone or engage teamfights from extreme range before cleaning up with Q and W.",
    commonMistakes: [
      "Not stacking stardust fast enough — you should be hitting champions with Q on every wave, not just farming passively",
      "Using E aggressively without ward coverage — E is your only escape and has a massive cooldown",
      "Channeling R too long trying to get a bigger cast when a quick R would secure the kill or zone effectively",
    ],
    powerSpikeReminders: [
      "75 stardust stacks upgrades Q to execute minions — your waveclear becomes effortless and you can roam freely",
      "At 150 stardust your W singularity is enormous; teamfights become trivial with this much area control",
      "Rod of Ages fully stacked combined with high stardust makes you a scaling monster that outranges and out-DPSs everyone",
    ],
  },

  Aurora: {
    combos: [
      "Q -> Q recast -> E -> Auto -> W: Throw Q, recast for return damage, dash in with E for passive proc, W out to safety",
      "R -> Q -> Q recast -> E -> Auto -> Auto -> Auto: Ult to trap them, land free Q both ways, then dash in to proc passive in the zone",
      "E -> Flash -> R -> Q -> Q recast: Surprise engage with E-Flash, immediately R to lock them in, then free Q combo",
    ],
    tradingPatterns: [
      "Q through the wave so both casts hit the enemy and minions — you waveclear and trade at the same time",
      "E forward for a quick auto and passive proc, then W to disengage before they can trade back",
      "Poke with Q at max range and save E for disengaging ganks; you outrange most melee mids with this pattern",
    ],
    earlyGame: "Poke with Q through the wave for simultaneous farm and harass; use E defensively against ganks and only trade with E offensively when you have vision.",
    midGame: "Look for R engages on 2-3 enemies in jungle chokepoints; your ultimate traps people for your team to collapse.",
    lateGame: "Use R to zone the enemy backline in teamfights, separating their frontline from carries, and burst anyone trapped inside with full combo.",
    commonMistakes: [
      "Using E aggressively and getting ganked with no escape — E is both your engage and disengage, use it wisely",
      "Ulting a single target in a teamfight when you could trap 2-3 by waiting a moment longer",
      "Not recasting Q for the return damage — always double-tap for the full burst",
    ],
    powerSpikeReminders: [
      "Level 6 with R gives massive gank setup — coordinate with your jungler for guaranteed kills",
      "First item completion makes your Q poke chunk for 30%+ HP; start playing more aggressively on the map",
      "Two items lets you 100-0 any squishy trapped in your R; look for picks aggressively",
    ],
  },

  Azir: {
    combos: [
      "W -> Q -> Auto -> Auto -> Auto: Place soldier, Q reposition soldier through enemy, auto through soldier for sustained DPS",
      "W -> W -> Q -> E -> R (Shurima Shuffle): Place two soldiers, Q them toward the enemy, E dash to soldier, then R to knock them into your team",
      "W -> Q -> Auto -> Auto -> W -> Q -> Auto: Extended trade repositioning soldiers to stay in auto range with Q resets",
    ],
    tradingPatterns: [
      "Place W soldier between the caster minions and enemy, Q through them when they step up to CS for poke plus wave push",
      "Auto through soldiers at max range whenever the enemy goes for a last hit — the spacing threat zones them off CS",
      "Save Q to reposition soldiers only when the enemy commits to a trade; the burst and slow from Q repositioning wins short trades",
    ],
    earlyGame: "Survive early levels by farming with soldiers and poking when safe; your mana is precious so don't waste W-Q combos that don't hit the enemy.",
    midGame: "Push sidelanes with soldiers for safe waveclear, then group for objectives where your R shuffle can turn fights instantly.",
    lateGame: "Position soldiers in the backline to DPS while staying safe, and look for a game-winning Shurima Shuffle on priority targets.",
    commonMistakes: [
      "Going for the Shurima Shuffle too often — it's high risk; most of your damage should come from backline soldier DPS",
      "Placing soldiers on top of yourself instead of max range, losing the spacing advantage that makes Azir strong",
      "Not managing soldier timers — if your soldiers expire mid-fight you have zero DPS for several seconds",
    ],
    powerSpikeReminders: [
      "Nashor's Tooth first item transforms your DPS — soldiers hit like trucks and you can actually push waves",
      "Level 6 Shurima Shuffle immediately threatens a kill; ping your jungler for a coordinated dive or shuffle",
      "Three items with Nashor's, Luden's, and Zhonya's is your full power spike — you're the strongest DPS mage in the game at this point",
    ],
  },

  Brand: {
    combos: [
      "E -> Q -> W: E to apply ablaze, Q stun on ablazed target, W on stunned target for guaranteed max damage",
      "W -> E -> Q -> R: W poke into E spread, Q stun, then R bouncing between ablazed targets for maximum bounce damage",
      "R -> E -> Q -> W: In teamfights, R first onto clumped targets, E to spread ablaze, Q stun a priority target, W for AoE",
    ],
    tradingPatterns: [
      "W the wave and enemy at the same time for poke plus push; if it hits, immediately E -> Q for the full stun combo",
      "E a minion near the enemy to spread passive, then Q the ablazed enemy for a surprise stun from minion spread",
      "Poke with W from max range repeatedly — even without follow-up, W chunks hard with passive burn damage",
    ],
    earlyGame: "Poke with W through the wave and look for E-Q stun combos; your passive burn damage adds up quickly so keep applying ablaze stacks.",
    midGame: "Group for dragon fights where your passive and R bounce in tight spaces; Brand in jungle chokes is devastating.",
    lateGame: "Stay behind your frontline and dump your entire combo onto clumped enemies; your passive percentage HP burn melts tanks and squishies alike.",
    commonMistakes: [
      "Throwing Q without ablaze on the target — an unstunned Q is just a slow-moving skillshot that does mediocre damage",
      "Using R on a single isolated target where it can't bounce — R needs at least two targets nearby for real damage",
      "Facechecking as Brand — you have zero mobility and one misstep means death; always let your team facecheck",
    ],
    powerSpikeReminders: [
      "Level 3 with E-Q-W combo available is your first real kill threat; play aggressive with Ignite",
      "Liandry's completion makes your passive burn deal absurd damage — every ability chunks for 10%+ HP over time",
      "Rylai's second item means your W and passive slow permanently, making it nearly impossible to escape your damage",
    ],
  },

  Cassiopeia: {
    combos: [
      "Q -> E -> E -> E -> E: Hit Q poison, then spam E for empowered fangs while poison lasts; this is your primary DPS rotation",
      "W -> E -> E -> Q -> E -> E -> E: Throw W to ground and slow them, spam E, reapply poison with Q, keep spamming E",
      "Flash -> R -> Q -> E -> E -> E -> E: Flash behind them for guaranteed face-direction R stun, then full DPS rotation",
    ],
    tradingPatterns: [
      "Q at max range when enemy steps up to CS, then E spam if it lands — if Q misses, don't E because unpoisoned E is terrible",
      "W the ground behind the enemy to cut off their escape, then Q on top of them for guaranteed poison into E spam",
      "Short trade with Q -> E -> E -> back off; this chunks hard and costs relatively little mana with E refund on poisoned kills",
    ],
    earlyGame: "Focus on hitting Qs and last-hitting with E for mana sustain; if you land Q, immediately E spam for a winning trade since your sustained DPS is unmatched.",
    midGame: "Push waves rapidly with Q-E and rotate to fights; you win every extended fight in the game so look for 2v2 and 3v3 skirmishes.",
    lateGame: "Kite frontline with Q-E spam while looking for a game-changing Flash-R stun on multiple enemies to win the fight instantly.",
    commonMistakes: [
      "Spamming E on unpoisoned targets — it costs more mana, does less damage, and doesn't refund; only E when they're poisoned",
      "Using R as an opener without confirming enemies are facing you — a slowed R instead of a stunned R loses fights",
      "Not buying boots — Cassiopeia gets free movement speed from passive and cannot buy boots; spend gold on combat stats",
    ],
    powerSpikeReminders: [
      "Tear early solves all mana problems — once you have Tear you can E spam freely and dominate trades",
      "Level 6 R is a fight-winning ability; any gank with R up should result in a kill for your team",
      "Seraph's + Liandry's two-item spike makes you the highest DPS mage in the game; force fights around objectives",
    ],
  },

  Corki: {
    combos: [
      "R (Big One) -> Q -> E -> Auto -> Auto: Poke with empowered R, Q for burst, E armor shred while auto-attacking",
      "W -> Q -> E -> R -> Auto -> Auto -> Auto: Valkyrie in, Q burst, E shred, then R and autos for DPS",
      "R -> R -> R -> Q -> W in -> E -> Auto: Soften with R poke, then all-in with Package W for massive AoE burn",
    ],
    tradingPatterns: [
      "Poke with R rockets at max range — every third R is the Big One that chunks hard; track your ammo count",
      "Auto -> Q -> Auto for quick burst trades using Sheen proc if building Trinity; back off before they can respond",
      "Use E through the wave while autoing the enemy to push and trade simultaneously; the armor shred is huge for autos",
    ],
    earlyGame: "Farm safely until first package arrives; use Q and autos to last-hit and R poke for gradual harass without overcommitting.",
    midGame: "Abuse Package W for massive roam plays bot or top; the burn trail does insane damage and the knockback disrupts everything.",
    lateGame: "Poke with Big One rockets before fights, then dive in with W Package for AoE burn; your mixed damage is extremely hard to itemize against.",
    commonMistakes: [
      "Using normal W aggressively in lane — without Package it's your only escape and has a long cooldown",
      "Not tracking R ammo and Big One timer — the Big One does triple damage; always know when it's loaded",
      "Forgetting to pick up Package from base — the timer is easy to miss but Package roams are game-changing",
    ],
    powerSpikeReminders: [
      "First Package spawn at 8 minutes is your biggest early spike; push wave and roam to a sidelane with it",
      "Trinity Force completion makes your auto-weaving burst extremely high; start forcing 1v1 fights mid",
      "Three items with mixed magic and physical damage makes you nearly impossible to itemize against in teamfights",
    ],
  },

  Diana: {
    combos: [
      "Q -> E -> E (reset) -> W -> Auto -> Auto -> Auto: Land Q for moonlight, E dash to proc passive, E reset, W shield for trading",
      "Q -> R -> E -> W -> E: In teamfights, Q to mark multiple targets, R to pull them all in, E for cleanup",
      "E -> Flash -> Q -> R -> W: Gap close with E, Flash to extend range, Q for moonlight mark, R pull for multi-man wombo",
    ],
    tradingPatterns: [
      "Q through the wave to poke, and only E in when Q moonlight mark is on the enemy for the reset dash",
      "At level 3, Q -> E -> W -> Auto -> Auto trades win against most mids because of passive attack speed and shield",
      "Poke with Q until they're at 50-60% HP then commit with E all-in for the kill; Diana is all-or-nothing",
    ],
    earlyGame: "Farm with Q and passive cleave, poking the enemy with Q arcs; look for all-in at level 3 if Q lands and they're below 70% HP.",
    midGame: "Farm jungle camps between waves with passive and W, then group for objectives where your R can hit 3+ enemies.",
    lateGame: "Flank from fog of war and R -> Zhonya's in the middle of 3+ enemies; your team follows up on the pull for a won fight.",
    commonMistakes: [
      "E dashing in without Q mark — you lose your reset and are stuck in melee with no escape",
      "Using R on a single target in teamfights — Diana R is a teamfight nuke; wait for 3+ enemy clumps",
      "Building full glass cannon without Zhonya's — you dive into 5 people and need the stasis to survive",
    ],
    powerSpikeReminders: [
      "Level 3 all-in with Q mark E reset is surprisingly strong; many mids underestimate Diana's early damage",
      "Level 6 R transforms you from a skirmisher into a teamfight monster; group with your team immediately",
      "Nashor's Tooth makes you an insane split-pusher and duelist; take towers and 1v1 anyone in a sidelane",
    ],
  },

  Ekko: {
    combos: [
      "E -> Q -> Auto (passive proc): Dash with E, throw Q through them, empowered auto for 3-hit passive proc and movement speed to disengage",
      "E -> Auto -> Q -> W (placed earlier) -> Auto -> Auto -> R: E in, auto, Q return, walk them into pre-placed W stun, DPS, R if needed",
      "W (predict) -> E -> Q -> Auto -> Auto -> R: Place W on predicted position, E-Q burst inside the zone, auto for passive, R out if it goes wrong",
    ],
    tradingPatterns: [
      "E -> Auto -> Q and walk away — the Q return hit plus passive proc is a guaranteed chunk with Electrocute",
      "Throw Q through the wave from max range for safe poke and push; the return hit does more damage so position for it",
      "Place W behind the enemy as a zone threat while trading — they either walk into the stun or retreat out of the fight",
    ],
    earlyGame: "Farm with Q through the wave and look for E-Q-passive proc trades that chunk the enemy while also pushing; avoid extended trades where you lose.",
    midGame: "Push waves and roam with E mobility; your W stun sets up ganks perfectly and R keeps you safe from collapses.",
    lateGame: "Flank the backline with E-Q-passive burst combo, and R back to safety or for damage; you should never die in fights with R available.",
    commonMistakes: [
      "Using R aggressively as damage instead of keeping it as a safety net — only R offensively when you're sure of the kill",
      "Placing W on your current position when engaging — always predict where the fight will be 2 seconds later",
      "Not tracking your R hologram position — always know where you'll end up if you press R",
    ],
    powerSpikeReminders: [
      "Level 2 E-Q trade with passive is deceptively strong; most mids don't expect the burst and you can chunk them to 60%",
      "Level 6 R makes you nearly unkillable in lane — play aggressively knowing you can always undo a mistake",
      "Hextech Rocketbelt adds another dash for E-Rocketbelt-Auto-Q combos that close massive gaps",
    ],
  },

  Fizz: {
    combos: [
      "Q -> Auto -> W (reset) -> E -> E: Q through them, auto immediately, W reset auto, E out for disengage or E damage",
      "R -> Q -> Auto -> W -> E: Land shark from range, Q in as it knocks up, auto-W for burst, E out",
      "E -> Flash -> Q -> Auto -> W -> Ignite: E into Flash for unavoidable engage, full burst for the kill",
    ],
    tradingPatterns: [
      "At level 3, Q through the enemy, auto-W for the burst, then E out before they can trade back — this wins every short trade",
      "Use E to dodge the enemy's key ability, then immediately Q-W them while it's on cooldown for a free trade",
      "Pre-6, poke with W-enhanced autos when they walk up to CS; the bleed damage adds up faster than they expect",
    ],
    earlyGame: "Survive levels 1-2 by last-hitting with W autos; at level 3 you can start Q-W-E trading and winning against almost every matchup.",
    midGame: "Roam to sidelanes with shark R for guaranteed picks on immobile carries; Fizz with R is a kill every 60 seconds.",
    lateGame: "Look for R on a squishy carry from fog of war; one shark landing on the ADC means an instant kill and a 4v5 fight.",
    commonMistakes: [
      "Using E aggressively and getting ganked with no escape — E is your invulnerability and disengage; don't waste it to push waves",
      "Missing R and still going in — without shark your damage is halved and you'll lose the trade or die",
      "Picking fights at levels 1-2 when Fizz is at his absolute weakest; just farm and wait for level 3",
    ],
    powerSpikeReminders: [
      "Level 3 is your first real power spike — Q-W-E can chunk most mids for 40% HP in a single trade",
      "Level 6 shark all-in with Ignite kills almost any mid from 70% HP; force it the moment you hit 6",
      "Lich Bane completion makes your Q-auto-W burst absurd; one rotation kills squishies without even needing R",
    ],
  },

  Galio: {
    combos: [
      "E -> W (charge) -> Flash -> Q: E dash forward, charge W, Flash on top of them for taunt, Q on taunted target for full damage",
      "E -> Auto (passive) -> W (tap) -> Q -> Auto: Dash in, passive empowered auto, quick taunt, Q on top, another passive auto",
      "R (to ally) -> E -> W -> Q: Ultimate to a skirmish, E dash into enemies, W taunt, Q for AoE burst",
    ],
    tradingPatterns: [
      "Passive auto on the enemy when they walk up to CS — Galio passive auto does huge magic damage early; auto the wave for push then auto the enemy",
      "E forward through the wave, W tap taunt the enemy, Q on top, passive auto — a full short trade that wins against most mids",
      "Use Q through the wave for waveclear and poke; the tornado stays on the ground for decent zone damage",
    ],
    earlyGame: "Shove the wave with passive autos and Q, look for E-W-Q short trades against mages who can't handle your magic damage reduction and taunt.",
    midGame: "Push mid and use R to join sidelane fights for 3v2 or 4v3 number advantages; Galio R is a global teamfight presence.",
    lateGame: "Peel for your carries with E-W taunt or look for a Flash-W multi-man taunt to engage; R to protect any ally that gets dived.",
    commonMistakes: [
      "Charging W for too long — the damage reduction is great but enemies just walk away; tap-taunt for quick CC is usually better",
      "Using R only for damage instead of for the teamfight-swinging global presence; always look at sidelanes before using R",
      "Not autoing enough in trades — Galio passive auto does more damage than people realize; weave autos between every ability",
    ],
    powerSpikeReminders: [
      "Level 6 R makes every lane a 2v1 or 3v2 — ping your sidelanes to play aggressive because you can always join",
      "After first item you can shove waves in 2 seconds with Q-passive; perma-roam with R and E",
      "Flash-W is a massive teamfight engage at every stage — always track your Flash cooldown and play around it",
    ],
  },

  Hwei: {
    combos: [
      "QQ (long range) -> QW (AoE) -> EE (pull) -> QE (damage amp): Open with line poke, AoE explosion, pull them in, then amplify damage with fear zone",
      "EE (pull) -> QW (AoE on pull location) -> QQ -> R: Pull enemies in, AoE on top, line nuke, R for ult wave",
      "WW (shield) -> EE (pull) -> QW -> QQ -> R: Shield yourself first, engage with pull, burst with AoE and line, finish with R",
    ],
    tradingPatterns: [
      "QQ through the wave for long-range poke — this is your safest and most consistent trading pattern in lane",
      "EE pull when the enemy walks past their minion wave, then QW on the pull location for guaranteed AoE burst",
      "Use WE movement speed to reposition after trading, preventing the enemy from trading back effectively",
    ],
    earlyGame: "Poke with QQ through the wave for simultaneous harass and waveclear; play around cooldowns carefully since each spell set has a shared timer.",
    midGame: "Provide utility from range in skirmishes with EE pulls and WW shields while DPSing with Q spells; you're a teamfight swiss army knife.",
    lateGame: "Zone fights with R, peel with EE and EW, and DPS from max range with QQ and QW; your versatility is highest when all cooldowns are managed properly.",
    commonMistakes: [
      "Only using Q spells for damage and neglecting W utility (shields, mana) and E crowd control in trades and fights",
      "Choosing the wrong Q variant — QQ is for poke, QW for AoE burst, QE for zone; match the spell to the situation",
      "Panic-casting random spells under pressure — learn the muscle memory for each sub-spell so you pick the right one instantly",
    ],
    powerSpikeReminders: [
      "Level 6 R is a wide slow-zone that deals strong damage; use it to zone objectives or catch clumped enemies",
      "Luden's completion gives your QQ poke terrifying chunk potential from a full screen away",
      "At three items, your EE -> QW -> QQ combo does 70% of a squishy's HP from max range; play for picks",
    ],
  },

  Irelia: {
    combos: [
      "E1 -> Q (minion) -> Q (minion) -> E2 -> Q (stunned enemy) -> Auto -> Auto -> Auto -> Q: Set E1, Q to gap-close through marked minions, place E2 for stun, Q reset to enemy, auto for passive stacks",
      "R -> Q -> Auto -> Auto -> Auto -> E -> Q -> Auto -> Auto: R to mark and slow, Q reset, stack passive with autos, E stun, Q reset again",
      "E1 -> E2 -> Flash -> Q -> W -> Auto -> Auto -> Auto -> Q: Place E1, E2 immediately, Flash to extend stun angle, Q in, W damage reduction mid-fight",
    ],
    tradingPatterns: [
      "Q to a low minion near the enemy, auto them with passive stacks, then Q to another low minion to disengage — free trade",
      "Stack passive to 4 on minions with Q resets, then walk at the enemy — fully stacked Irelia wins every auto-attack trade in the game",
      "At level 5 with maxed Q, look to Q to the caster line, kill all three for resets, and engage on the enemy with full passive stacks",
    ],
    earlyGame: "Stack passive on minions before trading; fully stacked Irelia wins every level 1-2 auto-attack fight against any mid laner.",
    midGame: "Split push with your insane 1v1 dueling and use TP to join fights; or group and dive backlines with Q resets through the frontline.",
    lateGame: "In teamfights, R for the mark, then Q reset through the entire team; your job is to delete the backline carries and sustain through the fight.",
    commonMistakes: [
      "Engaging without passive stacks — Irelia without 4 stacks loses most fights; always stack up before committing",
      "Using Q without a reset target — if Q doesn't kill, you lose your only gap-close and mobility",
      "Not using W damage reduction during burst windows — W can save your life against mages if timed to absorb their combo",
    ],
    powerSpikeReminders: [
      "Level 4-5 with maxed Q is your biggest early spike; Q one-shots casters for free resets and gap-closing",
      "Blade of the Ruined King makes you nearly unbeatable in sidelane 1v1s; force fights immediately after buying it",
      "Level 6 R mark gives a free Q reset on the enemy; always look for an all-in when R comes up",
    ],
  },

  Kassadin: {
    combos: [
      "R -> E -> Auto (W) -> Q: Rift Walk on top of them, E slow (should be stacked from enemy casting), W-empowered auto, Q to finish and interrupt",
      "R -> Flash -> E -> W Auto -> Q -> R -> R: Flash extends R range for surprise burst, full combo, then R to chase or escape",
      "R -> R -> R -> E -> W Auto -> Q -> Ignite: Triple stack R for massive damage, dump entire kit for the one-shot",
    ],
    tradingPatterns: [
      "Q the enemy when they try to cast a spell — the magic damage shield absorbs their ability and you win the trade for free",
      "Pre-6, play passive and Q for CS and the occasional trade; after 6, R on top of them for an E-W-Q burst then R out",
      "Stack E by standing near the enemy as they cast abilities on the wave, then use the E slow to land a favorable trade",
    ],
    earlyGame: "Survive at all costs — take Q first for magic shield trades, give up CS if needed, and TP back if forced out; you outscale everyone.",
    midGame: "Start split pushing with R mobility and look for picks on isolated targets; with two items you can 1v1 any squishy.",
    lateGame: "You are the strongest champion in the game at 16 with items — R into the backline, one-shot the carry, R out; repeat until the fight is won.",
    commonMistakes: [
      "Fighting before level 6 and your first item — Kassadin pre-6 is one of the weakest champions; give up CS rather than die",
      "Spamming R without tracking the stacking mana cost — triple-stacked R costs 800 mana; you can OOM instantly",
      "Picking Kassadin into AD heavy comps — your Q shield and passive only work against magic damage",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you a blink on a 5-second cooldown; you go from weakest mid to a real threat instantly",
      "Level 11 with R rank 2 plus two items is where Kassadin starts taking over games; play for this timing",
      "Level 16 with 3+ items makes you arguably the strongest champion in League; every fight should be a win",
    ],
  },

  Katarina: {
    combos: [
      "E -> W -> Q -> E (to dagger) -> Auto -> R: Shunpo in, W drop, throw Q, E to Q dagger for reset pickup, auto, R to finish",
      "Q -> E (to Q dagger) -> W -> Auto -> E (to W dagger) -> R: Throw Q, Shunpo to dagger landing spot, W for second dagger, E to W dagger, R for channel",
      "E -> Q -> E (to dagger) -> W -> R -> E (reset on kill) -> Q -> E: Full teamfight reset chain weaving daggers for resets",
    ],
    tradingPatterns: [
      "Q -> wait for dagger to land -> E to dagger -> W -> E to W dagger out: This guarantees two dagger pickups for massive burst",
      "W on top of yourself, walk at the enemy, pick up dagger as they back off for free damage, then E out to a minion",
      "At level 2, E to a minion near the enemy, Q them, E to the Q dagger for a surprisingly strong early trade",
    ],
    earlyGame: "Farm with Q bounces and look for dagger pickup trades at level 2-3; your early damage with Electrocute and dagger pickups surprises people.",
    midGame: "Roam constantly after shoving with Q-W; Katarina's roam speed and cleanup potential with resets make her the best roaming assassin.",
    lateGame: "Wait for key cooldowns to be used in teamfights, then E in for the cleanup — a single kill gives you a full reset to chain through the entire team.",
    commonMistakes: [
      "E-ing into a fight without a dagger on the ground — your damage comes from dagger pickups, not raw E damage",
      "Using R in the middle of a full health enemy team — your R gets interrupted instantly; use it to finish low targets",
      "Going in first in teamfights — Katarina is a cleanup champion; wait for abilities to be used then E in for resets",
    ],
    powerSpikeReminders: [
      "Level 2-3 dagger trades with Electrocute can kill unprepared enemies who don't respect your burst",
      "Level 6 with Ignite is a kill on any mid laner below 70% HP; force the all-in immediately",
      "After first item your roams are deadly — push and roam after every wave; you should be in a sidelane every 90 seconds",
    ],
  },

  LeBlanc: {
    combos: [
      "Q -> W -> Auto: Mark with Q, dash with W to proc the mark, auto for Electrocute, W back to starting position for free trade",
      "W -> Q -> R(Q) -> E -> Ignite: Dash in, Q for mark, mimicked Q for second mark and both procs, E root to finish",
      "E -> R(E) -> Q -> W: Double chain for guaranteed root, Q mark on rooted target, W dash through for burst",
    ],
    tradingPatterns: [
      "Q -> W -> W back: This is your bread-and-butter trade — Q mark, W in to proc and deal burst, immediately W back; they can never trade back",
      "W onto the wave and enemy for push plus poke, then W back — even without Q this pokes while pushing",
      "Throw E from fog of war after roaming; the chain root into Q-W burst is a guaranteed kill on any squishy",
    ],
    earlyGame: "Q-W poke every time it's up — this is the most oppressive level 2-3 trade pattern in mid lane and most enemies have no answer to it.",
    midGame: "Shove and roam to sidelanes; LeBlanc's pick potential with double chains or Q-W burst is unmatched for catching enemies in rotations.",
    lateGame: "Look for picks on isolated targets with E chains from fog of war; a caught carry means a free objective or fight win.",
    commonMistakes: [
      "Not W-ing back after trading — staying in after W means you have no escape and LeBlanc is squishy",
      "Using R(W) for damage when R(Q) or R(E) would be better — R(Q) is for burst, R(E) is for double root CC, R(W) is for AoE or escape",
      "Chaining abilities too fast and not proccing Q marks — the mark needs to be detonated by another ability for bonus damage",
    ],
    powerSpikeReminders: [
      "Level 2 Q-W trade chunks most mids for 35-40% HP; you have kill pressure from level 2 with Ignite",
      "Level 6 mimicked Q-W combo can 100-0 squishy targets; immediately look for an all-in",
      "Luden's completion means Q-W-R(Q) one-shots any squishy from full HP; play extremely aggressively",
    ],
  },

  Lissandra: {
    combos: [
      "E -> E recast -> W -> Q -> R (self or enemy): Claw forward, reactivate to teleport, W root on arrival, Q through them, R for damage or self-cast for stasis",
      "Flash -> W -> Q -> R (on enemy) -> Q: Flash-root for instant engage, Q burst, R lockdown on priority target, Q again on cooldown",
      "W -> Q -> R (self) -> Zhonya's: Engage, dump damage, self-R for stasis and AoE zone, then Zhonya's for even more stalling",
    ],
    tradingPatterns: [
      "Q through the wave into the enemy for simultaneous push and poke — this is your main laning pattern",
      "If they step too close, W root -> Q for a guaranteed hit and a free chunk trade",
      "E aggressively through the wave as a zoning threat — they have to respect that you might recast and engage",
    ],
    earlyGame: "Push waves with Q through minions and enemy, and look for W-Q trades when they step forward; your waveclear lets you control the tempo.",
    midGame: "Set up picks with E engages or Flash-W into R lockdown; Lissandra excels at catching people and CCing them for the team.",
    lateGame: "Engage teamfights with E-W-R or Flash-W-R, then Zhonya's for the double stasis; you zone and CC the entire enemy team for 5+ seconds.",
    commonMistakes: [
      "Using E aggressively and not having an escape — E is your mobility and engage; if you teleport forward you can't get out",
      "Always self-casting R instead of using it on the enemy carry — offensive R is often better for lockdown and kill confirmation",
      "Not using Q through minions to extend its range to poke — raw Q is shorter range; the shatter extends it significantly",
    ],
    powerSpikeReminders: [
      "Level 6 R makes you ungankable with self-cast and gives you kill setup with enemy-cast; adapt based on the situation",
      "Zhonya's completion enables the self-R into Zhonya's double-stasis combo that makes you a teamfight menace",
      "Flash cooldown is your real engage timer — Lissandra with Flash is terrifying; without it you have to use E which is telegraphed",
    ],
  },

  Lux: {
    combos: [
      "Q -> E -> Auto (passive) -> R -> Auto (passive): Root with Q, E on top for damage, auto to proc Illumination, R laser to detonate passive again, auto once more",
      "E -> R -> Q: Throw E for slow, immediately R to combo with E damage, then Q root for follow-up or escape",
      "Flash -> Q -> E -> R -> Auto: Flash for surprise range, root, burst with E and R for instant kill",
    ],
    tradingPatterns: [
      "E at max range on the enemy when they walk up to CS — even if they dodge, you zone them off the minions",
      "Auto the enemy to apply Illumination passive, then E or Q to proc it for extra burst damage in short trades",
      "At level 6, poke with E until they're at 50% then Q -> E -> R for the full kill combo from a safe distance",
    ],
    earlyGame: "Poke with E from max range and push the wave; look for Q bindings when the enemy steps past their minion wave for a free chunk or kill.",
    midGame: "Stay with your team and provide long-range Q picks and E vision control; one landed Q on a carry means a kill with full combo follow-up.",
    lateGame: "Never leave your team — your Q root into R burst can one-shot any squishy from max range; zone objectives with E and fish for bindings.",
    commonMistakes: [
      "Throwing Q through the minion wave — it stops on the second target hit; throw it when the path is clear or from the side",
      "Using R without landing Q first — without the root, mobile enemies just dodge the laser",
      "Standing too close to fights — Lux has massive range; if you're close enough to get engaged on, you're too close",
    ],
    powerSpikeReminders: [
      "Level 6 Q-E-R combo can kill any mid laner from 60% HP; look for the all-in immediately at level 6",
      "Luden's completion makes E poke chunk for 30% HP from max range; you can poke people out before fights start",
      "At two items, your R laser on a 30-second cooldown can snipe kills across the map; always check other lanes",
    ],
  },

  Malzahar: {
    combos: [
      "E -> W -> Q -> R: Apply E space aids, summon voidlings with W to attack E'd target, Q silence, R suppress for guaranteed kill",
      "Q (through wave) -> E -> W: Silence the wave and enemy, E bounces through silenced targets, W voidlings clean up",
      "Flash -> R -> E -> W -> Q -> Ignite: Flash-suppress for ganks, apply damage over time during R, full combo after",
    ],
    tradingPatterns: [
      "E the wave and let it bounce to the enemy champion — Malefic Visions bouncing is free poke with no commitment",
      "E -> W the enemy when your jungler ganks; the voidlings focus the E target and R locks them down for a guaranteed kill",
      "Q through the wave to push and silence the enemy simultaneously — the silence prevents retaliation for 2 seconds",
    ],
    earlyGame: "Push waves with E bounces and Q, build passive shield for safety; you don't need to kill in lane, just push and scale.",
    midGame: "Shove mid constantly with E-W and roam to pick off targets with Flash-R suppress; buy a Void Staff to melt through MR.",
    lateGame: "Stay with your team and use R on the most important enemy target in fights; a 2.5 second suppress on the fed carry wins any teamfight.",
    commonMistakes: [
      "Using R without your team nearby to follow up — R locks YOU in place too; you need someone to deal damage during suppress",
      "Not buying QSS-clearing ability opponents' QSS — if the target has QSS your R is instantly cancelled; choose a different target",
      "Forgetting about passive void shield — it blocks one ability; don't waste it by tanking random poke before important fights",
    ],
    powerSpikeReminders: [
      "Level 6 R makes you the best gank-setup mid laner in the game; ping your jungler every time R is up",
      "Lost Chapter solves all mana problems and lets you perma-push; the game opens up from this point",
      "Liandry's completion makes your damage over time (E + R + voidlings) melt anyone; you're a DPS monster in extended fights",
    ],
  },

  Naafiri: {
    combos: [
      "W -> Q -> Q -> Q -> Auto -> E: W dash to close gap, triple Q for burst, auto, E to chase or finish",
      "R -> W -> Q -> Q -> Q -> Auto -> E -> Auto: R for movement speed and packmate reset, W gap-close, full burst rotation",
      "E -> Flash -> W -> Q -> Q -> Q -> Ignite: E to bleed, Flash for surprise, W dash, full Q burst for the kill",
    ],
    tradingPatterns: [
      "Q through the wave to push and poke simultaneously; the second and third Q casts are stronger so commit if the first lands",
      "W dash through the enemy for a short trade and back off — the W return deals damage too so you chunk without committing",
      "At level 6, R for movespeed and packmate reset then run the enemy down with W-Q combo; R's execute damage finishes",
    ],
    earlyGame: "Push with Q through the wave and trade with W dash when the enemy disrespects your range; your packmates add surprising damage to trades.",
    midGame: "Roam to sidelanes with R movespeed for devastating ganks; Naafiri's roam speed and burst make her excellent at picking off carries.",
    lateGame: "Flank from fog of war with R, burst the backline carry with W-Q combo, and use E to survive long enough to get out.",
    commonMistakes: [
      "Using W aggressively without a plan to escape — W is your only dash and without it you have no mobility",
      "Not waiting for all three Q casts — the damage ramps up; throwing one Q and walking away wastes your strongest burst",
      "Teamfighting front-to-back as Naafiri — you're an assassin; wait for flanks and picks, don't fight the frontline",
    ],
    powerSpikeReminders: [
      "Level 3 with all abilities is your first all-in opportunity; W-Q combo with Ignite can kill at 60% HP",
      "Level 6 R gives massive movespeed, packmate reset, and execute — look for an immediate kill or roam",
      "After Serylda's Grudge your Q slows make it impossible for targets to escape your full combo",
    ],
  },

  Neeko: {
    combos: [
      "E -> Q -> R -> W (clone): Root with E, Q on rooted target, R while approaching for the big stun, W clone to confuse",
      "W (passive disguise) -> walk up -> R -> E -> Q: Disguise as an ally to get close, R for stun, E root, Q burst",
      "Flash -> R -> E -> Q -> Ignite: Flash-ult for unavoidable stun, E root follow-up, Q for burst, Ignite to finish",
    ],
    tradingPatterns: [
      "E through the minion wave — it gets bigger and does more damage passing through units, rooting the enemy at the end",
      "Q on the wave and enemy simultaneously; the second and third blooms deal strong damage if they stay in the area",
      "Use W clone running at the enemy to bait abilities, then trade while their cooldowns are wasted",
    ],
    earlyGame: "Push with Q and trade with E through the wave for root-Q combos; your level 1-3 burst with E root into Q is underestimated.",
    midGame: "Look for Flash-R plays in skirmishes and objectives; a 3+ man Neeko R stun wins any fight outright.",
    lateGame: "Disguise as your ADC or support to bait enemies, then Flash-R for a massive team stun; your engage is top-tier with proper setup.",
    commonMistakes: [
      "Using R without a way to get in range — R channel is visible; Flash-R or Rocketbelt-R for guaranteed hits",
      "Throwing E at close range where it's thin and easy to dodge — always E through minions for a wider hitbox",
      "Forgetting about passive disguise for creative ganks — disguising as jungler and walking into lane is a free kill setup",
    ],
    powerSpikeReminders: [
      "Level 2 E-Q combo chunks most mids for 30% HP and is very hard to dodge through the wave",
      "Level 6 Flash-R is one of the most powerful teamfight engages in the game; coordinate with your jungler",
      "Rocketbelt gives you a reliable way to get into R range without burning Flash; your engage frequency doubles",
    ],
  },

  Orianna: {
    combos: [
      "Q -> W -> Auto -> Auto -> Auto: Move ball, W for burst and slow, auto-weave with passive for DPS",
      "Q -> R -> W -> Auto: Ball position, R shockwave pull, W on clumped enemies, autos for cleanup",
      "E (ally) -> R -> W -> Q: Shield a diving ally, R when they're in the enemy team, W slow, Q for cleanup",
    ],
    tradingPatterns: [
      "Q the enemy through the minion wave, then auto them 2-3 times — Orianna passive makes autos do increasing damage on the same target",
      "Q -> W for a quick burst trade then back off; the W slow prevents them from retaliating effectively",
      "Keep the ball between you and the enemy as a threat — they have to respect Q-W range or eat free poke",
    ],
    earlyGame: "Harass with Q-auto-auto-auto trades using your passive; you out-trade almost every mid laner in extended auto-attack trades early.",
    midGame: "Group and position the ball on your engage champions for multi-man R shockwaves; Orianna's teamfight impact is decided by ball placement.",
    lateGame: "Stay with your team and look for the 3+ man Shockwave on clumped enemies; one good R wins the entire game.",
    commonMistakes: [
      "Losing track of your ball position — always know where the ball is; a Q from unexpected ball position is much harder to dodge",
      "Only using R on one person — Orianna R is a teamfight-winning ability; be patient and wait for clumps unless it's a key pick",
      "Not using E shield and passive autos in trades — Orianna's auto attacks are very strong; don't just cast and run",
    ],
    powerSpikeReminders: [
      "Level 1 passive autos make you one of the strongest level 1 mid laners — auto-attack aggressively from the start",
      "Lost Chapter lets you spam Q for wave control and poke; your mana issues disappear and you can bully freely",
      "Luden's + Seraph's gives you enough burst to one-shot with Q-R-W on a squishy; start looking for picks",
    ],
  },

  Qiyana: {
    combos: [
      "Water Q (slow) -> E -> Auto -> W (swap element) -> Q -> Auto -> R: Slow with water Q, dash in, auto, swap element, Q for second burst, R for wall stun",
      "E -> Auto -> Ice Q -> W (swap) -> Q -> R: Dash to target, auto, ice Q root, swap element, Q again, R to wall",
      "Grass W (stealth) -> E -> Auto -> Q -> R -> Ignite: Stealth approach, dash in, auto-Q burst, R to wall for the kill",
    ],
    tradingPatterns: [
      "W to grab ice element, Q for root, auto, W to grab another element, Q again — the double Q with element swap is your bread and butter",
      "Grab grass element with W, go invisible, walk up and E-auto-Q for a free trade they can't see coming",
      "Poke with water Q at range for the slow, then decide whether to commit based on if it lands",
    ],
    earlyGame: "Look for level 3 all-ins with double Q element swap combos; Qiyana's burst at level 3 is among the highest of any assassin.",
    midGame: "Roam to river fights where your R can stun multiple enemies against terrain; Qiyana's R in jungle chokes is gamebreaking.",
    lateGame: "Flank teamfights from bushes with grass stealth, then R multiple enemies into a wall for a massive stun; follow up with Q burst on priority targets.",
    commonMistakes: [
      "Not tracking which element you currently have — each element does something different; using the wrong one wastes kill pressure",
      "Using R in the middle of a lane with no walls nearby — R only stuns if enemies hit terrain; always position near walls",
      "Going in without W swap available — you need W to reset Q cooldown for the double-Q burst pattern",
    ],
    powerSpikeReminders: [
      "Level 3 double-Q all-in with Ignite kills most mids from 80% HP — this is one of the strongest level 3 spikes in the game",
      "First Serrated Dirk makes your burst lethal; buy it and force a fight immediately",
      "Level 6 R near river or jungle walls creates massive outplay potential; fight near terrain always",
    ],
  },

  Ryze: {
    combos: [
      "E -> E -> Q: Double E to spread flux, then Q for AoE burst through all fluxed targets — your main waveclear and teamfight combo",
      "E -> Q -> E -> Q -> W -> E -> Q: Sustained DPS combo weaving E-Q repeatedly, W when they try to run",
      "W -> E -> Q: Root first for guaranteed E-Q follow-up; use this when ganking or when you need CC immediately",
    ],
    tradingPatterns: [
      "E -> Q for quick poke — the Q deals bonus damage on E-fluxed targets and this is mana-efficient for consistent trades",
      "E the wave to spread flux, then Q for AoE waveclear that also hits the enemy if they're standing near minions",
      "W root when enemy overextends, then E -> Q for guaranteed burst while they're locked down",
    ],
    earlyGame: "Farm with E-Q combos for fast waveclear and stack Tear; your scaling depends on getting Tear stacks as fast as possible.",
    midGame: "Push sidelanes rapidly with E-E-Q AoE, then use R to teleport your team for flanks or objective rushes.",
    lateGame: "DPS in teamfights with E-Q spam, using W to peel for yourself; fully stacked Ryze with 4+ items has insane sustained magic damage.",
    commonMistakes: [
      "Not stacking Tear fast enough — spam E-Q on waves and in trades to stack; every E-Q cycle stacks it",
      "Forgetting that R is a team utility teleport, not just for yourself — coordinate flanks or repositioning with team",
      "Using W offensively when you need it to peel — W root is your only self-peel against divers",
    ],
    powerSpikeReminders: [
      "Tear + Lost Chapter means unlimited mana and fast stacking; your waveclear becomes the best in mid lane",
      "Rod of Ages fully stacked + Seraph's is your massive two-item spike; you're tanky, have huge mana, and deal great damage",
      "Level 6 R enables creative roam plays and team flanks; use it proactively to create number advantages",
    ],
  },

  Syndra: {
    combos: [
      "Q -> E (stun) -> W (grab sphere) -> Q -> W (throw) -> R: Q for sphere, E stun through sphere, W grab, Q again for more spheres, W throw, R with max spheres",
      "Q -> Q -> Q -> E (multi-stun) -> W -> R: Stack spheres on the ground, E through all of them for a wide stun zone, W throw, R for max damage",
      "Flash -> E -> Q -> W -> R -> Ignite: Flash-stun for surprise engage, full combo with Ignite for guaranteed kill",
    ],
    tradingPatterns: [
      "Q on the enemy when they walk up to CS — it's low cooldown and strong damage; just keep Qing and they have to respect it",
      "Q -> E stun through the sphere when they walk predictably; the stun into follow-up Q-W chunks for 40% HP",
      "W grab a siege minion or sphere and throw it at the enemy for poke — the slow makes follow-up Q easy to land",
    ],
    earlyGame: "Bully with Q poke on every CS attempt; you out-range most mids and your Q spam is extremely oppressive in lane.",
    midGame: "Set up picks with Q-E stuns from fog of war and one-shot squishies with R at max spheres; your single-target burst is the highest in the game.",
    lateGame: "Stay behind your frontline, poke with Q-W, look for E stuns on priority targets, and R to delete whoever gets caught.",
    commonMistakes: [
      "Using R with only 3 spheres — Syndra R damage scales with sphere count; always have 6-7 spheres out for maximum damage",
      "Throwing E without a sphere in the path — E only stuns if it pushes a sphere; always Q first then E through it",
      "Spamming W on cooldown for poke and not having it for the actual combo when the kill opportunity comes",
    ],
    powerSpikeReminders: [
      "Level 6 with 6+ spheres out means R does absurd single-target damage; one-shot potential is immediate",
      "Luden's makes Q poke chunk for 25%+ HP; enemies can't stay in lane against Syndra Q spam",
      "At three items your R deletes any squishy regardless of their HP; position to R the priority target",
    ],
  },

  Sylas: {
    combos: [
      "E1 -> E2 -> Auto (passive) -> Q -> Auto (passive) -> W -> Auto (passive): E dash, E2 knockup, weave passive autos between every ability for maximum DPS",
      "E2 -> R (stolen ult) -> Auto -> Q -> Auto -> W -> Auto: Engage with E2, immediately use stolen R, then full rotation weaving passive",
      "Flash -> E2 -> Auto -> W -> Auto -> Q -> Auto -> R: Flash-E2 engage for guaranteed knockup, full burst with passive weaving",
    ],
    tradingPatterns: [
      "E2 into the enemy, passive auto, Q both parts, passive auto, W for heal and damage — you outtrade every mid in extended fights with passive",
      "Short trade with Q both hits then back off — the Q intersection damage is high and you don't need to commit",
      "At low HP, bait an all-in and W for the massive heal — W heals more the lower HP you are; this turns fights",
    ],
    earlyGame: "Look for all-in trades at level 3 where you can weave passive autos between every ability; Sylas wins extended trades against almost everyone.",
    midGame: "Steal the most impactful enemy ultimate and use it better than they can; prioritize stealing teamfight ultimates like Malphite R, Amumu R, etc.",
    lateGame: "Dive the backline with E2 engage, heal through damage with W, and use the best stolen R to turn the fight; you're a bruiser-mage hybrid that's hard to kill.",
    commonMistakes: [
      "Not weaving passive empowered autos between abilities — passive is a huge portion of your damage; never double-cast abilities without autoing",
      "Stealing bad ultimates — always know which enemy R you want before the fight; stealing a bad ult wastes your R",
      "Using W too early when at high HP — W heal scales inversely with your HP; wait until you're below 40% for the maximum heal",
    ],
    powerSpikeReminders: [
      "Level 3 all-in with passive weaving is one of the strongest in mid lane; most mids underestimate Sylas burst",
      "Level 6 with a good stolen ultimate (like Amumu or Malphite R) makes you a more dangerous version of that champion",
      "Everfrost gives you personal CC plus another passive proc setup; your kill pressure skyrockets on purchase",
    ],
  },

  Talon: {
    combos: [
      "W -> Q (melee range) -> Auto -> passive proc: W rake, Q crit-range melee, auto to proc three-hit passive bleed for massive burst",
      "R -> W -> Q -> Auto -> passive proc: R for stealth and blade ring, W through them, Q melee range, auto for triple passive bleed",
      "W -> Flash -> Q -> Auto -> R out: W into Flash for surprise range extension, melee Q crit, auto proc, R stealth to escape",
    ],
    tradingPatterns: [
      "W through the wave and the enemy — both parts of the rake must hit for the passive stack; position so the return hits",
      "At level 2, W -> Q (melee) -> auto procs passive bleed for a 40% HP chunk — this is the strongest level 2 in mid lane",
      "Poke with W return from max range — the return does more damage; back off after throwing W and let the blade come back through them",
    ],
    earlyGame: "Play for a level 2 all-in with W-Q-auto passive proc; Talon's level 2 is the strongest of any mid laner and forces summoner spells or kills.",
    midGame: "Perma-roam after pushing the wave with W; use E parkour to cross terrain and appear in sidelanes from unexpected angles.",
    lateGame: "Flank with R stealth, one-shot the ADC or support with W-Q-passive, then R-stealth out or E over a wall to escape.",
    commonMistakes: [
      "Using Q at range (dash) instead of melee range — melee Q crits for double damage; walk up or W slow first to get in melee range",
      "Not hitting both parts of W — only one W hit doesn't apply a passive stack; position for the return blade",
      "Using E on terrain that you need for escape — every wall has a cooldown once used; plan your parkour route before committing",
    ],
    powerSpikeReminders: [
      "Level 2 W-Q is the strongest level 2 all-in in mid lane — if you land both W parts and melee Q, the passive bleed is a kill",
      "Serrated Dirk makes your passive bleed lethal; buy it and force an all-in or roam immediately",
      "Level 6 R stealth enables free roams through warded areas — start roaming constantly after hitting 6",
    ],
  },

  Taliyah: {
    combos: [
      "W -> E -> Q: Knock them backward with W into your E minefield, then Q while they're slowed on the mines for full burst",
      "E -> W (knock into E) -> Q -> Q: Place E first, W to knock them back through the mines, Q spam while they're slowed",
      "R (wall ride) -> W -> E -> Q: Surf wall into lane for a roam, W knock into E mines, Q for cleanup",
    ],
    tradingPatterns: [
      "Q through the wave and enemy from max range — your Q is on a low cooldown and is your primary poke and waveclear",
      "Place E behind the enemy, then W to knock them through the mines — this guarantees mine procs for massive burst",
      "At level 1, Q spam is one of the strongest level 1 abilities; zone the enemy off the first wave with repeated Qs",
    ],
    earlyGame: "Poke with Q at max range and push the wave; look for W-E combos when the enemy mispositons past their minion line.",
    midGame: "Use R wall to roam to sidelanes for ganks or to cut off enemy rotations; Taliyah R is one of the best roaming tools in the game.",
    lateGame: "Zone teamfights with E minefield and W knockback; your area denial is massive and a W into E kills any squishy.",
    commonMistakes: [
      "W-ing in the wrong direction — W can knock toward or away from you; practice the vector casting to knock enemies into your E",
      "Not using R for roams — Taliyah R is a global positioning tool; use it to join fights, not just for the wall block",
      "Standing on worked ground where Q does reduced damage — reposition so your Q comes from unworked ground",
    ],
    powerSpikeReminders: [
      "Level 1 Q spam is extremely strong for early lane dominance and river level 1 fights",
      "Level 6 R gives you the best roaming tool in mid lane; push and roam to bot lane immediately for a free kill",
      "Luden's makes Q poke chunk hard and E-W combo can one-shot; you hit your assassination spike at first item",
    ],
  },

  "Twisted Fate": {
    combos: [
      "W (Gold Card) -> Auto -> Q -> Auto: Lock gold card, auto-stun, throw Q through stunned target for guaranteed hit, auto again",
      "R (Destiny) -> R recast (teleport) -> W (Gold Card) -> Auto -> Q -> Ignite: Ult to reveal, teleport behind target, gold card stun, Q burst, Ignite finish",
      "E (stacked) -> W (Blue or Gold) -> Auto -> Q: Stack E passive for empowered auto, combine with W card pick for burst plus mana or stun",
    ],
    tradingPatterns: [
      "Lock Gold Card, walk up and auto-stun, throw Q through them for guaranteed damage, walk away — this is a free trade every time W is up",
      "Use Blue Card to last hit cannon minions for mana sustain; never Gold Card a minion unless you're about to roam and need push",
      "Q through the wave for poke and push simultaneously; if they sidestep, they lose CS positioning",
    ],
    earlyGame: "Push with Q and Red Card AoE, then look for R ganks to sidelanes starting at level 6; TF's value comes from map pressure, not solo kills.",
    midGame: "Push mid wave with Q-Red Card, immediately R to a sidelane for a Gold Card gank; repeat every R cooldown for constant map pressure.",
    lateGame: "Use R to catch isolated enemies with Gold Card, or use Destiny vision to track enemy positioning before objectives; your R is a team-wide wallhack.",
    commonMistakes: [
      "Accidentally locking Red or Blue card in a fight when you needed Gold — practice the W timing until gold card lock is muscle memory",
      "Not roaming enough — TF without R roams is just a weak mage; you MUST roam every time R is up or you're wasting the champion",
      "Using R in plain sight of the enemy — they'll collapse on your teleport destination; R from fog of war for surprise ganks",
    ],
    powerSpikeReminders: [
      "Level 6 R is your biggest spike — the first R gank should get a kill or summoner spell; ping your team and commit",
      "Rapid Firecannon extends your Gold Card stun range; the extra auto range makes picks much more consistent",
      "Lich Bane + RFC makes Gold Card auto chunk for 50% HP; you become a pick machine with this two-item combo",
    ],
  },

  Veigar: {
    combos: [
      "E (cage edge) -> W -> Q -> R: Place cage to trap them at the edge stun, W on stunned target, Q through them, R execute",
      "Flash -> R -> Q -> E -> W: Flash execute R on low target, Q for burst, E cage to trap remaining enemies, W for AoE",
      "E -> Q -> W -> Auto -> Auto -> R: Cage to zone, Q for stacks and damage, W if they're trapped, autos for passive stacks, R to execute",
    ],
    tradingPatterns: [
      "Q through two minions and the enemy champion for stacks and poke simultaneously — always line up Q for double value",
      "Place E cage edge on the enemy to force them to stand still or get stunned; throw W on top for guaranteed damage either way",
      "Last hit with Q for infinite AP stacking — every Q kill gives permanent AP; prioritize stacking over trading early",
    ],
    earlyGame: "Stack Q on every minion kill possible — Veigar's infinite scaling means early stacks equal late game power; farm is more important than kills.",
    midGame: "Use E cage to control chokepoints in objective fights; even without hitting R, your cage zones entire teams out of fights.",
    lateGame: "With 500+ AP from stacks, your R executes from 40% HP; E cage a priority target, full combo, and they disappear instantly.",
    commonMistakes: [
      "Placing E directly on the enemy instead of at the edge — the stun is on the cage WALLS, not inside it; place it so the edge hits them",
      "Not stacking Q — if you're not getting 2-3 stacks per wave you're falling behind on your infinite scaling",
      "Using R too early in the combo — R does more damage the lower the target's HP; always use it as a finisher, not an opener",
    ],
    powerSpikeReminders: [
      "Level 6 R execute damage is already threatening on low HP targets; combine with E-W for kill pressure even with low stacks",
      "At 200 AP stacks (around 20 minutes if farming well), you start one-shotting squishies with basic combos",
      "Rabadon's Deathcap multiplies ALL your stacked AP by 35%; this item on Veigar is the biggest single-item power spike in the game",
    ],
  },

  Vex: {
    combos: [
      "R -> R recast -> E -> W -> Q -> Auto (passive): Ult to target, recast to dash in, fear with E, W for shield and burst, Q through them, passive-empowered auto",
      "E -> Q -> Auto (passive fear): Throw E for gloom mark, Q through it for damage, auto to proc passive fear for a free trade",
      "Flash -> W (fear) -> E -> Q -> R -> R recast: Flash-fear multiple enemies, E-Q burst, R to chase the escaping target",
    ],
    tradingPatterns: [
      "E -> Q combo through the wave for push and poke; if both hit, auto them to proc passive fear for extra damage and a free disengage",
      "Hold W for when the enemy dashes — Vex passive fears on enemy dashes; W them instantly when they engage for a counter-trade",
      "At level 6, poke with E-Q until they're at 60%, then R for the all-in; R recast is free if R1 hits",
    ],
    earlyGame: "Push with E-Q combos and punish any enemy dashes with passive fear; you hard-counter mobile assassins in lane.",
    midGame: "Look for R picks on squishy targets from max range; one R hit into full combo kills any squishy and resets R if you get the kill.",
    lateGame: "Fish for R on priority targets from max range; R reset on kill lets you chain through multiple targets in teamfights.",
    commonMistakes: [
      "Wasting passive fear on a minion wave — your fear is your strongest trading tool; save it for champion trades",
      "Using R1 at max range where it's easy to dodge — get within mid range for a more reliable hit or use E slow first",
      "Panicking and W-ing immediately when an assassin dashes on you — wait for them to use their second dash, then W for the fear",
    ],
    powerSpikeReminders: [
      "Level 1 passive fear auto-attack is surprisingly strong for contesting early waves; auto the enemy whenever they step up",
      "Level 6 R gives you long-range pick potential that you didn't have before; look for kills immediately",
      "Luden's completion makes E-Q poke devastate squishies; start playing for picks and poke before fights",
    ],
  },

  Viktor: {
    combos: [
      "Q -> Auto (empowered) -> E -> R: Q shield and empower auto, auto for burst, E laser through them, R for ongoing damage",
      "E (upgraded) -> R -> Q -> Auto -> E aftershock: Lead with E poke, R on top, Q auto for burst while E aftershock hits",
      "Flash -> R -> W -> E -> Q -> Auto: Flash-R for surprise engage, W gravity field on R zone, E laser, Q auto for burst",
    ],
    tradingPatterns: [
      "Q -> empowered auto is your bread-and-butter short trade — the shield absorbs retaliation and the empowered auto chunks hard",
      "E laser through the wave and enemy for push plus poke; after first upgrade, E aftershock adds massive damage",
      "Place W gravity field on top of yourself when an assassin engages; they get stunned trying to fight you and you Q-auto-E them for free",
    ],
    earlyGame: "Focus on farming for first Hex Core upgrade; use Q-auto for short trades and E for waveclear, but conserve mana for key moments.",
    midGame: "After E upgrade, your waveclear is instant — shove waves in 2 seconds and rotate to fights or objectives.",
    lateGame: "Stay behind the frontline and DPS with E-Q-auto from range; upgraded R zone melts teams in extended fights.",
    commonMistakes: [
      "Not upgrading E first — E upgrade gives your best waveclear and poke; always augment E first with Hex Cores",
      "Forgetting Q empowered auto — Q by itself is weak; the power is in the empowered auto that follows; always auto after Q",
      "Placing W reactively instead of predictively — W takes time to arm; place it where the fight will be, not where it currently is",
    ],
    powerSpikeReminders: [
      "First Hex Core E upgrade is your biggest early spike — E waveclear becomes instant and poke damage doubles",
      "Q upgrade second gives you movespeed on Q cast; you become much harder to catch and can kite effectively",
      "Three items with full augments makes Viktor one of the highest DPS mages in teamfights; play for 5v5s",
    ],
  },

  Vladimir: {
    combos: [
      "E (charge) -> Flash -> R -> E release -> Q (empowered) -> Ignite: Charge E, Flash into backline, R for amplification, release E, empowered Q for healing burst",
      "R -> E (charge) -> Q -> W (pool) -> Q -> E: R to amplify, E charge, empowered Q, pool to dodge abilities, Q again when pool ends, E for wave",
      "Q -> E -> Q -> E -> Q (empowered third Q) -> Flash -> R -> E -> Q: Stack Q to empowered, then Flash-R engage with empowered Q for maximum burst",
    ],
    tradingPatterns: [
      "Empowered Q (every third Q, glowing bar) does massive damage and heals hugely — track your Q bar and trade aggressively when empowered Q is ready",
      "Short trade with Q then back off — you sustain through minion Q healing and they can't heal back; repeat to whittle them down",
      "Charge E while walking toward the enemy, Q for the poke, release E for damage, then W pool away if they try to trade back",
    ],
    earlyGame: "Sustain with Q healing and trade with empowered Q when it's available; you lose most early all-ins but win through attrition and sustain.",
    midGame: "Push sidelanes with E-Q waveclear and TP for teamfights; you scale harder than almost any mid laner and need to hit item spikes.",
    lateGame: "Flash-R-E-Q into the enemy backline for massive AoE damage; your R amplifies ALL your team's damage on affected targets, making it a teamfight nuke.",
    commonMistakes: [
      "Using W pool to dodge poke instead of saving it for all-ins and ganks — pool has a 28s cooldown and costs 20% current HP",
      "Not tracking empowered Q timer — your empowered Q is your main trading tool; trading with normal Q is much weaker",
      "Going in too early in teamfights — Vladimir needs to wait for key CC to be used then Flash-R the backline; going first means instant CC and death",
    ],
    powerSpikeReminders: [
      "Level 9 with maxed Q gives you massive sustain and trade power; the healing becomes very noticeable at this point",
      "Hextech Rocketbelt gives you an engage tool beyond Flash; your threat range increases significantly",
      "Rabadon's Deathcap on Vladimir is a game-changing spike — your healing and damage both scale with AP and the spike is enormous",
    ],
  },

  Xerath: {
    combos: [
      "E -> W -> Q (charged): Stun with E, W on stunned target for slow and percent damage, charge Q through them for guaranteed hit",
      "W -> Q -> E: W for slow, Q through slowed target, E to stun if they try to engage on you",
      "R -> R -> R -> R -> R: Channel R from safety and snipe with each shot; use W slow between shots if they're in range to help land follow-ups",
    ],
    tradingPatterns: [
      "Q through the wave to push and poke simultaneously — charge Q for range but don't hold too long or they'll sidestep",
      "W on the enemy when they go for a last hit — the slow makes follow-up Q much easier to land",
      "Save E for self-peel against assassins; the stun is your only defense so never waste it offensively unless you're safe",
    ],
    earlyGame: "Poke with Q through the wave from max range and scale with mana items; you want to farm safely and poke, not fight up close.",
    midGame: "Stay behind your team and siege with Q-W poke; use R to finish low targets or snipe enemies after fights.",
    lateGame: "Poke from 1500+ range with Q and W before fights; your R can execute fleeing enemies or zone objectives from a screen away.",
    commonMistakes: [
      "Holding Q charge too long — the enemy sees you slowing down and easily sidesteps; quick-release Q is harder to dodge",
      "Using R in the middle of a teamfight where you get interrupted — R from safety, behind a wall or far back",
      "Standing too close to the fight — Xerath has the longest range in the game; if an assassin can reach you, you're mispositioned",
    ],
    powerSpikeReminders: [
      "Lost Chapter removes all mana problems — from here you can spam Q on every wave for constant poke and push",
      "Luden's makes your Q poke chunk for 30%+ HP from a full screen away; start sieging towers aggressively",
      "At three items your R shots each deal 500+ damage; five R shots can kill anyone from full HP if they all land",
    ],
  },

  Yasuo: {
    combos: [
      "Q -> Q -> E (through minions) -> EQ (tornado) -> R: Stack Q twice, E through minion wave to gap close, EQ spin for airborne tornado, R for Last Breath",
      "E -> Q -> Auto -> E -> Q -> Auto -> EQ (tornado) -> R: Dash through minions weaving Q and autos, EQ tornado, R suspend",
      "Flash -> Q3 (tornado) -> R -> Auto -> Auto -> Q -> E: Flash-tornado for surprise engage, R for armor pen, auto-Q-E for maximum DPS",
    ],
    tradingPatterns: [
      "E through a minion to gap close, Q and auto, then E through another minion to disengage — this is a free trade using minion dashes",
      "Stack Q tornado off the wave, then threaten with EQ spin dash for an instant airborne that's very hard to dodge",
      "W windwall to block the enemy's key projectile, then E-Q trade aggressively while their ability is on cooldown",
    ],
    earlyGame: "Stack Q on minions and threaten with tornado; use E through minions to create trading angles and escape routes; W blocks key abilities for free trades.",
    midGame: "Split push with your strong dueling or group for teamfights where your R can follow up allied knockups; always ask what knockups your team has.",
    lateGame: "Look for multi-man knockups from your tornado or allied abilities to R on; Last Breath armor pen makes your autos shred after R.",
    commonMistakes: [
      "E-ing aggressively through the entire minion wave with no minions left to E out — always keep a minion behind you for escape",
      "Using W windwall too early or on the wrong ability — windwall has a long cooldown; save it for the key ability (Syndra R, Jinx R, etc.)",
      "Building too aggressively without lifesteal — Yasuo needs sustain to survive; Shieldbow or early Vampiric Scepter is essential",
    ],
    powerSpikeReminders: [
      "Level 2 with E-Q dash trade is very strong against ranged mids who don't expect the gap close",
      "100% crit at two items (Shieldbow + IE) is Yasuo's massive power spike; your autos hit like a truck from here",
      "Level 6 R gives you kill pressure whenever you land a tornado or your jungler has knockup CC; coordinate ganks",
    ],
  },

  Yone: {
    combos: [
      "Q -> Q -> E -> Q3 (tornado) -> R -> Auto -> Auto -> Q -> W -> E return: Stack Q, soul form, tornado engage, R knockup, DPS with passive autos, W shield, snap back",
      "E -> Flash -> Q3 -> R -> Auto -> Q -> W -> Auto -> E return: E soul unbound, Flash-tornado for surprise range, R, full DPS, snap back safely",
      "R -> Q3 -> Auto -> Q -> W -> Auto -> Auto: R engage into tornado follow-up for extended CC chain, auto-weave for passive mixed damage",
    ],
    tradingPatterns: [
      "E forward for soul form, Q-W-auto trade aggressively, then snap back to safety — E ensures you always win trades by returning to safety",
      "Stack Q on minions, then E -> Q3 tornado for a guaranteed aggressive trade with escape plan",
      "W through the enemy and minions for a shield while autoing — the shield lets you win auto-attack trades in lane",
    ],
    earlyGame: "Farm and stack Q on minions; trade with E soul form to guarantee safe trades, always snapping back before the enemy can punish.",
    midGame: "Look for flanks with E -> R for massive teamfight engage; Yone's E-R can engage from a screen away and CC the entire team.",
    lateGame: "You're a teamfight monster — E soul form, R into the backline, DPS with autos and Q, then snap back; you deal mixed damage that's impossible to itemize against.",
    commonMistakes: [
      "Not snapping E back in time and getting caught out — always watch your E timer and have an exit plan",
      "Using R as primary engage without E safety net — always E first so you can snap back if the R engage goes badly",
      "Ignoring passive mixed damage — Yone autos alternate physical and magic damage; auto-weaving in combos is essential for DPS",
    ],
    powerSpikeReminders: [
      "Level 3 with E enables safe all-in trades — E forward, full combo, snap back; most mids can't match this pattern",
      "100% crit at two items (Shieldbow + IE) spikes your DPS massively; start forcing fights and sidelane duels",
      "Level 6 R engage combined with E soul form makes you the best teamfight engage in mid lane; group and fight",
    ],
  },

  Zed: {
    combos: [
      "W -> E -> Q -> W swap -> Auto -> Auto: Shadow placement, E slow, triple Q (self + shadow), swap to shadow for melee autos with passive",
      "R -> Auto -> E -> Q -> W behind them -> E -> Q -> R swap back: Death Mark, auto for passive, E slow, Q through, W behind for more Qs, swap back safely",
      "W -> Q -> W swap -> Auto -> E -> R out: Poke with W-Q, swap to shadow for commit, auto-E, R a nearby target to escape or finish",
    ],
    tradingPatterns: [
      "W to the side of the enemy, Q through both your shadow and yourself for double shuriken hit, E for slow — don't swap to shadow, walk away",
      "Walk up and auto-E-Q for a quick melee trade — Zed passive does bonus damage on low HP targets so this is strong if they're poked down",
      "At level 6, poke with W-Q until they're at 60% then R for the Death Mark all-in; the mark pop damage finishes them",
    ],
    earlyGame: "Poke with W-Q combo at range for consistent chip damage; look for level 6 all-in when they're below 70% HP with Ignite.",
    midGame: "Split push with your strong 1v1 and use R to outplay 1v2s; or roam for picks where your R burst kills any squishy.",
    lateGame: "Flank from fog of war and R the enemy ADC or mage; one-shot them and R-swap or W-swap back to safety before the team can react.",
    commonMistakes: [
      "Swapping to W shadow aggressively and being stuck with no escape — W is your only mobility pre-6; save swap for emergencies",
      "Using R too early before poking the target down — Death Mark does damage based on damage dealt during the mark; more damage in = bigger pop",
      "Not tracking the shadow timer — shadows expire after a few seconds; don't try to swap to an expired shadow",
    ],
    powerSpikeReminders: [
      "Level 3 W-E-Q combo chunks for 40% HP from range; you win most poke trades from this point",
      "Level 6 Death Mark with Ignite kills any mid from 70% HP; force the all-in immediately on hitting 6",
      "First Serrated Dirk makes your combo lethal; buy Dirk and force a fight or roam for a kill",
    ],
  },

  Zoe: {
    combos: [
      "E (sleep) -> Q behind you -> R forward -> Q recast: Bubble sleep, throw Q backward for range, R to extend Q range, recast Q through the sleeping target for max damage",
      "R -> E -> Q behind -> Q recast: Peek with R to land E bubble, throw Q backward, Q recast for burst on sleeping target as you snap back",
      "E (over wall) -> Q -> R -> Q recast -> W (summoner spell): Bubble through terrain for surprise sleep, max range Q through R, use picked-up summoner for chase",
    ],
    tradingPatterns: [
      "E bubble through the wave — it leaves a trap on the ground if it hits a minion, zoning the enemy; if it hits, free max-range Q",
      "Q backward then forward through the enemy for poke — the longer Q travels, the more damage it does; throw it behind you first",
      "Pick up minion-dropped summoner spells and items with W for surprise burst and utility in trades",
    ],
    earlyGame: "Poke with extended-range Q through the wave and fish for E bubble hits; one landed E means a guaranteed max-damage Q and potentially a kill.",
    midGame: "Roam with E bubbles through terrain walls for surprise long-range sleeps; one bubble from fog of war sets up a free kill.",
    lateGame: "Siege with max-range Q poke and E bubbles through walls; a single landed E on a squishy means instant death from max-range Q.",
    commonMistakes: [
      "Throwing Q forward directly — Q damage scales with distance traveled; always throw Q behind you first for maximum damage",
      "Using R aggressively without E bubble as setup — R snaps you back to start position; without E setup you waste the peek",
      "Not picking up W drops from minions — the summoner spell shards give free Flash, Ignite, etc. in trades; always grab them",
    ],
    powerSpikeReminders: [
      "Level 2 E into max-range Q can chunk for 50% HP — most mids don't expect Zoe's burst this early",
      "Luden's makes your Q poke one-shot the caster wave and chunk champions for 40%+ HP from max range",
      "At two items, a landed E into max-range Q one-shots any squishy from 100-0; you're a sniper from this point",
    ],
  },

  Ziggs: {
    combos: [
      "E (minefield) -> W (satchel) -> Q -> Q -> Q: Place mines, satchel to knock them through mines, spam Q on slowed targets",
      "Q -> Q -> Q -> W (execute turret) -> R (cross map): Poke with Q, satchel a low turret for execute, R a fight happening elsewhere",
      "Flash -> W (satchel under them) -> E -> Q -> R: Flash-satchel to displace, mines for zone, Q for burst, R for AoE finish",
    ],
    tradingPatterns: [
      "Q bounce over minions to hit the enemy — Q bouncing makes it unpredictable; aim slightly short so it bounces over the wave",
      "Place E mines on the enemy's path when they walk up to CS; the slow makes follow-up Q much easier",
      "Auto the enemy tower whenever you can — Ziggs passive empowered auto does huge damage to structures; you take towers faster than any mage",
    ],
    earlyGame: "Push waves with Q and passive-empowered autos on minions; create push leads to poke under tower and look for plates with passive.",
    midGame: "Siege towers aggressively with W execute and passive; use R to influence fights across the map without leaving your lane.",
    lateGame: "Poke with Q from max range before fights, use W to peel divers, E to zone chokes, and R for massive AoE on clumped fights.",
    commonMistakes: [
      "Not using W to execute low-HP towers — Ziggs W does massive damage to structures below 25% HP; always W towers when they're low",
      "Throwing Q at max range every time — shorter range Q doesn't bounce as high and is harder to dodge; mix up ranges",
      "Using R on a single target — Ziggs R is massive AoE; save it for 3+ man clumps or to waveclear a sidelane from across the map",
    ],
    powerSpikeReminders: [
      "Lost Chapter means unlimited Q spam — you can shove and poke every single wave without running out of mana",
      "Luden's makes your Q poke chunk for 25%+ HP; siege becomes oppressive at this point",
      "At three items your R does 1000+ damage in the center; one good R on clumped enemies wins the teamfight",
    ],
  },

  Mel: {
    combos: [
      "Q -> W -> Auto -> Auto -> E -> Q: Poke with Q, W for empower, auto-weave, E for crowd control, follow-up Q",
      "E -> R -> Q -> W -> Auto -> Auto: Engage with E, R for burst zone, Q for damage, W empower for autos",
      "Flash -> E -> R -> Q -> W -> Ignite: Flash engage for surprise CC, R for burst, full combo with Ignite to finish",
    ],
    tradingPatterns: [
      "Poke with Q at range for consistent chip damage; your Q is long range and good for harassing while farming",
      "Use W empowerment before trading to maximize auto-attack and ability damage in short trades",
      "Place E to zone the enemy off CS, then Q through them when they reposition to avoid the zone",
    ],
    earlyGame: "Farm safely with Q and look for poke trades when the enemy walks up to CS; manage your cooldowns carefully and don't overcommit early.",
    midGame: "Group for objectives and use R for AoE burst in teamfights; your utility and burst combined make you a strong teamfight mage.",
    lateGame: "Stay with your team and look for multi-target R opportunities in fights; your combined burst and utility scale well into late game.",
    commonMistakes: [
      "Overcommitting in early levels when your damage is still scaling — play patient and farm for your item spikes",
      "Wasting R on a single target when you could hit multiple enemies — be patient for the clump",
      "Not using W empowerment before trading — W buff is free damage that you should always apply before committing",
    ],
    powerSpikeReminders: [
      "Level 6 R gives you significant teamfight burst; look for grouped enemies at objectives",
      "First item completion ramps up your poke and burst; start playing more aggressively on the map",
      "At two items your combo can 100-0 squishies; look for picks on isolated targets with E engage",
    ],
  },
};
