export interface ChampionCoaching {
  combos: string[];
  tradingPatterns: string[];
  earlyGame: string;
  midGame: string;
  lateGame: string;
  commonMistakes: string[];
  powerSpikeReminders: string[];
}

export const adcChampions: Record<string, ChampionCoaching> = {
  Ashe: {
    combos: [
      "W > AA > Q (activate Q with full stacks for burst trade)",
      "R > W > AA with Q active (pick combo at 6, chain CC into full DPS)",
      "W > approach > AA > AA > AA > AA > Q > AA (stack passive then unleash Q)"
    ],
    tradingPatterns: [
      "Poke with W through the wave when enemy ADC goes for a last hit — the cone is wide enough to hit both minions and champions.",
      "At full Q stacks, look for an aggressive AA > Q trade; the attack speed steroid wins most extended trades against short-trade ADCs.",
      "Use R cross-map to start fights bot or assist jungle skirmishes, then follow up with W slow to kite."
    ],
    earlyGame: "Focus on W poke through minions to whittle enemies down, and use your passive slow to set up ganks for your jungler.",
    midGame: "Stay with your team and use R to initiate picks from fog of war; your utility is more valuable than solo sidelaning.",
    lateGame: "Position far back and keep Q active at all times in teamfights; your perma-slow and high attack speed make you an incredible DPS anchor.",
    commonMistakes: [
      "Wasting R on a close-range desperation play instead of using it as a long-range engage or cross-map assist.",
      "Not stacking Q passive before a fight starts — you lose massive DPS if Q isn't ready when the fight breaks out.",
      "Standing too far forward to W poke and getting engaged on by hook or all-in supports."
    ],
    powerSpikeReminders: [
      "Level 6: Your R is one of the best engage tools in the game — look for cross-map arrows or lane kills with support follow-up.",
      "Kraken Slayer completion: Your Q DPS spikes enormously; force extended trades whenever possible.",
      "3 items (Kraken + Runaan's + IE): You become a teamfight monster with AoE slows and massive Q DPS."
    ]
  },

  Caitlyn: {
    combos: [
      "W (under CC'd target) > Headshot AA > E > Q > Headshot AA (trap combo for massive burst)",
      "E > Q (cast Q during E dash for guaranteed hit) > AA Headshot (basic poke combo)",
      "Net backward > W where they walk > Headshot AA > Q > Headshot AA (kiting/zoning combo)"
    ],
    tradingPatterns: [
      "Abuse your 650 range to land free AAs when the enemy ADC walks up to CS — step up, auto, step back before they can retaliate.",
      "Place W behind minions about to die; when the enemy walks up to last hit they either give up the CS or step on the trap.",
      "After landing E > Q, immediately place a W at their feet for a potential second Headshot proc."
    ],
    earlyGame: "Bully with your range advantage relentlessly — every CS the enemy takes should cost them HP, and push for early plates with your passive headshots on turret.",
    midGame: "Set up trap lines around objectives 30 seconds before they spawn; your zone control in chokepoints is unmatched.",
    lateGame: "Stay at max range and cycle Headshot procs with W and E resets; one trap combo on a squishy target can delete them instantly.",
    commonMistakes: [
      "Not using Headshot passive on champions — letting it proc on minions when an enemy is in range is a huge waste of lane pressure.",
      "Placing W randomly instead of under CC'd targets or in predictable enemy pathing spots.",
      "Using E offensively to dash forward for a trade and then getting all-inned with no escape."
    ],
    powerSpikeReminders: [
      "Level 1-3: You have the strongest early lane in the game with 650 range; zone aggressively and stack a CS lead.",
      "B.F. Sword first back: Your Headshot crits chunk for 30%+ HP; play hyper-aggressive with this spike.",
      "Infinity Edge completion: Trap combos now one-shot squishies — look for picks around objectives."
    ]
  },

  Draven: {
    combos: [
      "AA (Q spinning) > W > AA (Q spinning) > E if they run (double axe burst trade)",
      "E > W > AA (Q) > AA (Q) > R if they flash (all-in combo with displacement into burst)",
      "R (long range) > Flash > E > W > AA (Q) > AA (Q) (surprise engage combo)"
    ],
    tradingPatterns: [
      "Always have two axes spinning before trading — the damage difference between one and two axes is massive in early fights.",
      "Trade when the enemy ADC walks up to CS; step forward with W, land a spinning axe, catch it, and land another before backing off.",
      "Use E to interrupt enemy dashes or cancel engage attempts, then punish with empowered autos while they're displaced."
    ],
    earlyGame: "Spin both axes before the wave meets and look for level 1 trades; you win every single level 1 all-in with double Q autos and W resets.",
    midGame: "Cash in your passive stacks on kills during skirmishes; roam mid with your support after shoving a wave to snowball your gold lead.",
    lateGame: "Position to catch axes safely — dropping an axe in a teamfight guts your DPS; sometimes it's better to let an axe drop than walk into danger to catch it.",
    commonMistakes: [
      "Catching axes into enemy skill shots — opponents can see where your axe will land and will aim abilities there.",
      "Not banking passive stacks (Adoration) and dying with 200+ stacks, losing a massive gold bounty.",
      "Tilting after a single death and forcing fights from behind — Draven can always come back with one big cash-in."
    ],
    powerSpikeReminders: [
      "Level 1-2: You are the strongest ADC in the game at level 1; fight immediately with double spinning axes.",
      "First kill with stacked passive: This can give you a 1000+ gold swing — buy B.F. Sword and dominate lane.",
      "Infinity Edge rush: Your Q autos with IE crit are devastating; force fights the moment you complete it."
    ]
  },

  Ezreal: {
    combos: [
      "E in > W > AA > Q (burst trade with passive stacking, E resets faster with Q hit)",
      "W > Q (detonate W with Q from range for safe poke combo)",
      "W > E onto target > AA > Q > R (maximum burst all-in combo)"
    ],
    tradingPatterns: [
      "Poke with W > Q through minion gaps — W passes through minions so you can detonate it with Q for safe harass.",
      "After hitting a Q, play forward for 2-3 seconds — a landed Q means your E cooldown is reduced and you have escape available.",
      "Save E defensively against all-in lanes (Draven/Leona, Lucian/Nami); only E offensively when you know enemy CC is on cooldown."
    ],
    earlyGame: "Farm safely with Q and look for W > Q poke to stack Tear; your level 1-5 is weak so don't force extended trades against stronger laners.",
    midGame: "Spike hard on Muramana + Trinity Force; start playing aggressively and look for picks with W > E > Q burst in skirmishes.",
    lateGame: "Kite fights from max Q range and use E only to dodge critical abilities; your sustained Q poke shreds front-liners over time.",
    commonMistakes: [
      "Using E aggressively and then dying to a gank or counter-engage — E is your only escape and has a long cooldown.",
      "Not weaving auto-attacks between Q casts; AA resets with passive attack speed stacks add significant DPS.",
      "Ignoring Tear stacking in early game — a delayed Muramana delays your biggest power spike by minutes."
    ],
    powerSpikeReminders: [
      "Sheen purchase: Your Q poke damage nearly doubles; start trading more aggressively with W > Q.",
      "Muramana completion: Massive damage spike on all abilities; you can look for solo kills with full combo.",
      "Level 6: R gives you wave clear, cross-map assists, and passive stacking — use it frequently to build stacks."
    ]
  },

  Jhin: {
    combos: [
      "W (root) > walk up > 4th shot AA > Q (bounce through low minions for bonus damage)",
      "E (trap) > W (root on trap proc) > 4th shot AA > Q (guaranteed root follow-up from trap)",
      "R channel > 4th R shot > Flash > 4th AA shot (execute combo with back-to-back 4th shots)"
    ],
    tradingPatterns: [
      "Save 4th shot for trading onto the enemy ADC — walk up, land 4th shot (which crits), then back off during the reload.",
      "Use Q on a low-HP minion near the enemy champion; the bounces deal increasing damage and the 4th bounce hurts heavily.",
      "W when your support lands CC for a guaranteed root; the W root duration is long enough to walk up for a 4th shot."
    ],
    earlyGame: "Poke with Q bounces off dying minions and look for W roots after your support's CC; save 4th shot for trades, not CS.",
    midGame: "Set up E traps in jungle chokepoints before objectives and use R to contribute to fights from 3000+ range.",
    lateGame: "Stay at the backline and cycle 4th shots in fights; your movespeed from crits lets you reposition — use R to clean up fleeing enemies.",
    commonMistakes: [
      "Wasting 4th shot on a minion when an enemy champion is nearby — that 4th shot is your primary trading tool.",
      "Using W raw without setup; it's slow and easy to dodge unless the target is already CC'd or slowed by your trap.",
      "Starting R too early in a fight — R is best used to clean up or zone, not as an opening engage tool."
    ],
    powerSpikeReminders: [
      "Level 1 with 4th shot: One of the strongest level 1 autos in the game — look for a 4th shot trade immediately.",
      "Galeforce/Collector completion: Your 4th shot execute damage combines with item passives for insane burst.",
      "3 items with IE: Your 4th shot can chunk tanks for 30% HP and one-shot squishies."
    ]
  },

  Jinx: {
    combos: [
      "Swap to Rocket (Q) > AA > W > AA > swap to Minigun for DPS (poke into sustained trade)",
      "E (chompers) > W (slow) > Rocket AA > swap Minigun > all-in (lockdown combo)",
      "Get Excited proc > R execute > chain resets with Minigun attack speed (teamfight cleanup)"
    ],
    tradingPatterns: [
      "Poke with single Rocket (Q) autos in lane — the splash damage can hit both the ADC and support if they stand near minions.",
      "Use W to slow, then follow up with Rocket autos for guaranteed splash hits; don't raw W without setup as it's too slow.",
      "At 3 Minigun stacks, take extended trades — your attack speed at max stacks out-DPSes most ADCs in a straight fight."
    ],
    earlyGame: "Farm safely with Minigun, poke with occasional Rocket autos, and avoid extended trades until you have 3 Minigun stacks — you outscale almost everyone.",
    midGame: "Group with your team for teamfights; your AoE rockets and reset passive make you the best teamfight ADC in the game.",
    lateGame: "Position patiently and wait for a kill or assist to proc Get Excited; once your passive activates, chase down the entire enemy team with Minigun.",
    commonMistakes: [
      "Overusing Rockets in lane and running out of mana; use Minigun for CS and Rockets only for poke or splash opportunities.",
      "Placing E (chompers) reactively instead of predictively — place them where enemies will dash or walk to, not where they currently are.",
      "Not using R to snipe low-HP targets across the map; Jinx R gains damage with distance and should be used cross-map frequently."
    ],
    powerSpikeReminders: [
      "Level 2 with Q + W: Your poke combination is strong; push for level 2 first and look for an aggressive trade.",
      "Infinity Edge completion: Rocket crits become devastating in teamfights with splash damage.",
      "3 items (IE + Runaan's + Zeal item): You become an AoE teamfight carry — a single reset can ace the enemy team."
    ]
  },

  "Kai'Sa": {
    combos: [
      "AA > AA > AA > AA > passive proc > Q (isolated) for burst (stack plasma then burst)",
      "W (long range) > R (dash to marked target) > AA > Q (isolated) > E (engage combo at 6)",
      "E (stealth + AS) > Flash > AA > Q (isolated) > AA (surprise burst combo)"
    ],
    tradingPatterns: [
      "Look for isolated Q damage — when the enemy ADC walks away from minions to trade, your Q focuses all missiles on them for massive damage.",
      "Stack plasma with AAs and ally CC, then proc the passive for burst; coordinate with your support's CC for easy stacks.",
      "Use W at max range to poke; if it hits, you can R in for a guaranteed kill setup on low-HP targets."
    ],
    earlyGame: "Focus on farming for your Q and E evolutions; trade only when Q can hit isolated targets and avoid extended fights against strong early ADCs.",
    midGame: "With Q evolution completed, look for picks with W > R and skirmish around objectives where isolated Q damage shines.",
    lateGame: "Use E stealth to reposition in teamfights and R to dodge critical abilities; your sustained DPS with evolved abilities is top-tier.",
    commonMistakes: [
      "Using Q into a full minion wave — the damage is split and deals almost nothing to the champion.",
      "R-ing aggressively into the enemy team without tracking key cooldowns; R should be used to dodge abilities or follow up on guaranteed kills.",
      "Delaying Q evolution by building inefficiently — always plan your build path to hit Q evolve (100 bonus AD) as early as possible."
    ],
    powerSpikeReminders: [
      "Q evolution (~100 bonus AD, usually first item + component): Massive waveclear and burst spike; play aggressively once evolved.",
      "E evolution (100% bonus AS): Stealth on E makes you incredibly slippery; you can now outplay most assassins.",
      "Level 6: R gives you an engage/escape tool; look for W > R picks on overextended enemies."
    ]
  },

  Kalista: {
    combos: [
      "AA > jump > AA > jump > E (rend) when spears stacked (kite and rend for burst)",
      "Q (pierce) through dying minion > AA > AA > E rend (transfer spears from minion to champion)",
      "R (launch support) > support knockup > AA > AA > AA > E rend (engage all-in with ultimate)"
    ],
    tradingPatterns: [
      "Stack spears with autos then E (rend) to burst — use the E minion reset mechanic to also secure CS while trading.",
      "Pierce Q through a low-HP minion into the enemy champion to transfer rend stacks; this is your most efficient poke pattern.",
      "Oathsworn (R) your support aggressively when they land engage; the knockup into stacked rend is one of the strongest level 6 all-ins."
    ],
    earlyGame: "Abuse your passive hop to dodge skill shots while auto-attacking; you win short trades with E rend and can kite melees forever.",
    midGame: "Secure every Dragon and Baron with E (rend) execute on epic monsters — your smite + rend is nearly impossible to outsmite.",
    lateGame: "Keep hopping and stacking spears on the nearest target; use R to save your support from assassins or re-engage fights.",
    commonMistakes: [
      "Not binding (Oathsworn) your support at the start of the game or accidentally binding the wrong ally.",
      "Forgetting to use E reset on minions — you can E to both last hit a minion and chunk a champion if both have spears.",
      "Standing still while autoing; Kalista's passive requires you to move between autos or you lose massive DPS."
    ],
    powerSpikeReminders: [
      "Level 2 with E: Your rend execute damage on stacked spears wins almost every level 2 trade.",
      "Level 6 with R: Your all-in with support knockup is one of the strongest in the game; look for kills immediately.",
      "Blade of the Ruined King: Your on-hit damage makes each spear much more threatening; force extended trades."
    ]
  },

  "Kog'Maw": {
    combos: [
      "W (activate range) > AA > AA > AA > Q (shred armor/MR) > AA > AA (DPS window combo)",
      "E (slow) > W > AA > AA > Q > AA > R (poke) (kiting combo with self-peel)",
      "R > R > R (poke to soften) > W activate > AA spam > Q (long range siege into all-in)"
    ],
    tradingPatterns: [
      "Only trade when W is active — your range extends to 710 and you deal %HP damage; back off completely when W is on cooldown.",
      "Use E to slow approaching enemies then kite backward with W autos; your DPS while kiting with W up is unmatched.",
      "Poke with R at low mana cost (first few casts) to soften targets before committing to a fight with W."
    ],
    earlyGame: "Play safe and farm; your W windows at early ranks are short — trade only during W and disengage immediately when it expires.",
    midGame: "Stay with your support or a peeler at all times; you have zero self-peel and die instantly if caught alone.",
    lateGame: "With 3+ items you melt anyone in seconds with W active; position behind your entire team and let them peel — you ARE the win condition.",
    commonMistakes: [
      "Trading or fighting when W is on cooldown — without W you are a low-range, low-damage ADC with no escape.",
      "Spamming R and running out of mana; R mana cost triples with rapid consecutive casts.",
      "Positioning too far forward because of W range — you still have no escape and die instantly to gap-closers."
    ],
    powerSpikeReminders: [
      "Level 9 with max W: Your W uptime and %HP damage become strong enough to shred tanks; play around this window.",
      "Guinsoo's Rageblade: On-hit build spikes enormously here; every W auto applies double on-hit effects.",
      "3 items (Rageblade + BotRK + Runaan's): You become the highest DPS champion in the game; teamfights should be played around you."
    ]
  },

  Lucian: {
    combos: [
      "AA > E (dash) > AA > W > AA > Q > AA (full passive weave combo for maximum burst)",
      "Q (through minion to extend range) > AA > AA > E > AA > AA (lane poke into trade)",
      "R channel to apply pressure or finish kills (use after blowing combo to fill cooldown window)"
    ],
    tradingPatterns: [
      "Always weave an AA between every ability — Lucian's passive (Lightslinger) doubles your autos after each spell, which is 60% of your damage.",
      "Use Q through a dying minion to poke the enemy ADC behind it; the extended hitbox catches people off guard.",
      "E forward aggressively when enemy key abilities are on cooldown; your short burst trade with passive weaving wins against almost everyone."
    ],
    earlyGame: "Look for level 2 all-in with E > AA > Q > AA > W > AA; Lucian's level 2 burst is one of the highest in bot lane.",
    midGame: "Pair with an enchanter or engage support and look for skirmishes in the river; your burst combo deletes squishies in 2 seconds.",
    lateGame: "Play as a short-range burst mage — dash in, unload your combo with passive weaves, then E out; don't try to be a sustained DPS carry.",
    commonMistakes: [
      "Not weaving passive autos between abilities — casting Q > W > E without autos between them loses over half your damage.",
      "Using E to dash forward without tracking enemy CC cooldowns; Lucian is short range and dies fast if caught.",
      "Ulting at the wrong time — R locks you in place; use it to finish kills or zone, not to open fights."
    ],
    powerSpikeReminders: [
      "Level 2 (Q + E): One of the strongest level 2 spikes in bot; push wave hard and fight the moment you hit 2.",
      "Navoris Flickerblade: Your E cooldown resets constantly in fights; you become extremely mobile.",
      "2 items (Essence Reaver + Navoris): Your burst combo with E resets makes you a skirmish monster."
    ]
  },

  "Miss Fortune": {
    combos: [
      "Q (bounce off dying minion) > AA with Love Tap (massive poke from safe range)",
      "E (slow field) > AA > Q > AA > R if committing (slow into burst into channel)",
      "Flash > R into clumped enemies (teamfight wombo combo, position behind your frontline)"
    ],
    tradingPatterns: [
      "Bounce Q off a low-HP minion into the enemy champion — the second bounce crits and deals enormous damage, especially with lethality.",
      "AA one target, then AA a different target to proc Love Tap passive; alternate targets for maximum auto-attack damage.",
      "Use E slow to zone enemies off CS; the slow field is wide and forces them to walk around or take harass."
    ],
    earlyGame: "Bully with Q bounces off dying minions and Love Tap passive; you are one of the strongest level 1-3 laners — punish passive ADCs hard.",
    midGame: "Look for teamfights in chokepoints (Dragon pit, jungle corridors) where you can land a full R channel on 3+ people.",
    lateGame: "Your entire teamfight contribution can be a single well-placed R; position to channel R through the whole enemy team from a safe angle.",
    commonMistakes: [
      "Using R in a bad position where it gets immediately interrupted by CC — wait for enemy CC to be used before channeling.",
      "Not utilizing Q bounce kills; always look for low minions near the enemy champion for free poke.",
      "Standing still to auto-attack when you should be kiting with W movespeed to reposition between autos."
    ],
    powerSpikeReminders: [
      "Level 1 (Q): Your Q bounce does crit damage if the first target dies; look for early poke bounces immediately.",
      "Serrated Dirk: Lethality makes your Q bounce and R deal significantly more damage; spike trade aggressively.",
      "Level 6: R in a 2v2 all-in is devastating; coordinate with your support's CC to channel uninterrupted."
    ]
  },

  Samira: {
    combos: [
      "AA > Q > AA > E (through target) > AA > Q > W > R at S rank (style combo to build grade)",
      "E (dash through enemy) > AA > Q (melee) > W (block) > AA > Q > R (aggressive all-in combo)",
      "Ally CC > passive knockup > AA > E in > Q > W > AA > R (follow-up engage combo)"
    ],
    tradingPatterns: [
      "Follow up on any allied CC with your passive knockup — this chains CC and lets you build style grade for R quickly.",
      "Use W to block key abilities (hooks, stuns) then immediately trade back with E > Q while enemy cooldowns are down.",
      "Build style grade to S before committing to all-in; AA > Q > AA > E > AA > Q > W gets you to S rank for R."
    ],
    earlyGame: "Look for aggressive level 2-3 all-ins with your support's CC into your passive knockup; Samira's early burst is insane if she can chain CC.",
    midGame: "Teamfight in the thick of it — E through frontliners to reach the backline and R at S rank for AoE lifesteal that heals you to full.",
    lateGame: "Wait for the right moment to E in and R; a well-timed S-rank R in a clumped fight heals you to full while dealing massive AoE damage.",
    commonMistakes: [
      "E-ing into the enemy team before building any style grade — you won't have R available and will die instantly.",
      "Using W too early; it blocks projectiles and should be saved for critical abilities like Nami bubble or Thresh hook.",
      "Going in 1v5 because you have R available — you still need your team to absorb cooldowns before you dive."
    ],
    powerSpikeReminders: [
      "Level 2 with E: Dash resets on kill; an early double kill snowballs the lane completely.",
      "Level 6 with R: Reaching S rank in a fight and pressing R is a massive AoE damage spike; look for all-ins.",
      "Immortal Shieldbow: You become extremely hard to burst down, which lets you play aggressively in teamfights with R lifesteal."
    ]
  },

  Sivir: {
    combos: [
      "Q (boomerang out + back) > W (ricochet) > AA reset > AA (fast burst trade)",
      "E (spellshield) > Q > W > AA > AA (block enemy ability then trade freely with mana refund)",
      "R (On The Hunt) > approach > W > AA bounces > Q through team (engage teamfight combo)"
    ],
    tradingPatterns: [
      "Q through the enemy for double-hit damage (out and back); position so the boomerang hits them on both passes.",
      "Spellshield (E) an enemy ability to restore mana, then immediately trade back — you've negated their damage and gained resources.",
      "Use W bounces to push the wave and harass simultaneously; ricochet bounces hit enemies standing near their minions."
    ],
    earlyGame: "Push waves fast with Q and W to get priority, then rotate with your jungler; Sivir's lane is about wave control, not 1v1 kills.",
    midGame: "Group with your team and use R to engage or disengage; your waveclear keeps side lanes pushed while you roam.",
    lateGame: "You are a teamfight-oriented ADC — use R for the movespeed engage and W bounces to shred the entire enemy team with ricochet crits.",
    commonMistakes: [
      "Using E (spellshield) too early or too late — practice the timing against specific abilities to consistently block them.",
      "Throwing Q at max range where only one pass hits; try to hit both the outgoing and returning damage for full value.",
      "Not using R for your team's benefit; the movespeed buff on R is a massive teamfight engage/disengage tool."
    ],
    powerSpikeReminders: [
      "Level 1 with Q: Boomerang double-hit at level 1 chunks hard; look for an aggressive trade if both passes connect.",
      "Essence Reaver: Mana sustain and Sheen proc make your trading and waveclear much stronger.",
      "3 items with IE: W bounce crits deal massive AoE damage in teamfights; you become a teamfight monster."
    ]
  },

  Tristana: {
    combos: [
      "E (bomb on target) > AA > AA > AA > AA (fully stack bomb for detonation burst)",
      "W (jump in) > E (bomb) > AA > AA > AA > AA > Q (attack speed steroid to stack bomb fast)",
      "W in > E > AA > R (knockback into your team) > bomb detonates (insec combo for picks)"
    ],
    tradingPatterns: [
      "At level 2 (E + W), jump on the enemy ADC, place E bomb, and auto to stack it — this is one of the strongest level 2 all-ins in the game.",
      "Place E on turret to take plates fast; Tristana takes towers faster than any other ADC with E + Q combo on structures.",
      "Use Q attack speed steroid to quickly stack E bomb in fights; without Q active, you often can't stack the bomb before they escape."
    ],
    earlyGame: "Push for level 2 first and immediately W > E > AA all-in; if you get a kill or assist, W resets and you can chain it for a double kill.",
    midGame: "Take towers aggressively with E bomb on structures and Q attack speed; rotate to any lane where you can siege plates.",
    lateGame: "Your range scales with level (up to 669 at 18) making you a safe DPS carry; use R to peel divers and W only to escape, never to engage.",
    commonMistakes: [
      "W-ing into the enemy team in mid/late game — your W is your only escape; using it aggressively in teamfights is suicidal.",
      "Not using E bomb on towers — Tristana's fastest path to winning is through turret destruction.",
      "Forgetting that W resets on full E detonation or kill/assist; track your E stacks to know when you can chain jumps."
    ],
    powerSpikeReminders: [
      "Level 2 (W + E): One of the strongest level 2 all-ins — push wave hard and fight immediately at level 2.",
      "Level 6 (R): R knockback adds burst to your bomb combo and gives you self-peel; look for W > E > AA > R kills.",
      "Infinity Edge completion: Your crit autos while stacking E bomb do enormous damage; E detonation crits are fight-winning."
    ]
  },

  Twitch: {
    combos: [
      "Q (stealth) > approach > AA > AA > AA > AA > AA > AA > E (expunge stacks for burst finish)",
      "Q (stealth) > R (spray and pray) > AA through team > E (6-stack expunge on multiple targets)",
      "W (slow) > AA > AA > AA > E (short trade with passive stacking into expunge)"
    ],
    tradingPatterns: [
      "Stealth with Q, walk behind the enemy, pop out with R active, and auto the entire team in a line for massive AoE DPS.",
      "Stack passive with autos (up to 6 stacks), then E (Contaminate) for burst; the more stacks, the more E damage.",
      "In lane, W slow into 2-3 autos then E for a quick trade; disengage before they can retaliate."
    ],
    earlyGame: "Look for level 2 cheese with Q stealth — walk to the enemy from fog, pop out at melee range, and stack passive for an E burst kill.",
    midGame: "Roam mid with Q stealth after shoving bot; a surprise Twitch gank mid is often a free kill and can swing the game.",
    lateGame: "Flank from stealth with R active in teamfights — a 5-man R spray through the backline can single-handedly win fights.",
    commonMistakes: [
      "Using E (Contaminate) with only 1-2 passive stacks — wait for 5-6 stacks for maximum burst damage.",
      "Not roaming with Q stealth in mid game; Twitch's biggest strength is appearing where the enemy doesn't expect him.",
      "Popping out of stealth too early or too close to enemy CC; wait for the right angle and timing."
    ],
    powerSpikeReminders: [
      "Level 2 with Q + E: Stealth engage into stacked E burst is a kill threat on any lane opponent.",
      "Level 6 (R): Your autos pierce through all enemies in a line; look for teamfights where you can hit 3+ people.",
      "Infinity Edge + Runaan's: R bolts with Runaan's and IE crits shred entire teams; this is your biggest spike."
    ]
  },

  Vayne: {
    combos: [
      "AA > Q (tumble) > AA (Silver Bolts proc on 3rd hit) (basic W proc combo)",
      "AA > AA > E (condemn into wall) > AA (stun guarantees 3rd silver bolt proc + wall stun burst)",
      "R > Q (tumble for stealth) > AA > AA > E (condemn) > AA (stealth into burst all-in)"
    ],
    tradingPatterns: [
      "Trade with short AA > Q > AA combos to proc Silver Bolts (W) — three hits then disengage before the enemy can retaliate.",
      "Use E (Condemn) to stun enemies into walls for a guaranteed extended trade; always track wall positions in lane.",
      "During R, use Q tumble stealth to reposition and dodge abilities between auto-attacks for maximum outplay potential."
    ],
    earlyGame: "Survive and farm — you lose almost every early 2v2; trade only with short AA > Q > AA procs and let your support control the lane.",
    midGame: "Split push a side lane with R available for 1v1s; Vayne's dueling at 2 items is nearly unmatched.",
    lateGame: "You are the hardest-scaling ADC in the game; Silver Bolts %HP true damage shreds everyone — kite patiently and proc W on repeat.",
    commonMistakes: [
      "Tumbling (Q) forward aggressively in lane and eating a full enemy combo — Q should be used sideways or backward for kiting.",
      "Condemning enemies away from your team to safety instead of into a wall; bad condemns save the enemy.",
      "Trying to fight early against lane bullies like Caitlyn or Draven instead of farming safely to outscale."
    ],
    powerSpikeReminders: [
      "Level 6 (R): R gives AD, stealth on Q, and massive outplay potential; your 1v1 power spikes hard at 6.",
      "Blade of the Ruined King: Combined with W true damage, you shred tanks and squishies alike; start taking fights.",
      "3 items (BotRK + Guinsoo's + Phantom Dancer): Silver Bolts proc every 2 autos with Guinsoo's; you melt anyone in seconds."
    ]
  },

  Varus: {
    combos: [
      "W (passive stack with autos) > AA > AA > AA > Q (fully charged, detonates W stacks for burst)",
      "E (slow) > AA > AA > AA > Q (charged, poke combo with W stack detonation)",
      "R (root spread) > AA > AA > AA > W active > Q (full burst combo on locked-down target)"
    ],
    tradingPatterns: [
      "Stack 3 W (Blight) stacks with autos, then pop them with Q or E for massive %HP burst — this is your primary trading pattern.",
      "Fully charge Q from fog of war or behind minions for long-range poke; it deals more damage the longer you charge it.",
      "Use E to slow, apply blight stacks during the slow, then detonate with Q for a full burst rotation."
    ],
    earlyGame: "Poke with charged Q from range and look for W-stack detonations; Varus has strong early damage but no mobility, so respect all-in lanes.",
    midGame: "Use R to start picks in jungle corridors; the root spreads to nearby enemies and can catch entire teams in chokepoints.",
    lateGame: "Stay at max range and siege with charged Q poke; use R defensively to peel divers or offensively to start teamfights from long range.",
    commonMistakes: [
      "Fully charging Q without any W blight stacks on the target — raw Q poke is decent but detonating stacks is where the real damage is.",
      "Not using R to self-peel against divers; Varus has no dash, so R is your only way to stop assassins from killing you.",
      "Standing still to charge Q and getting engaged on; charge Q from fog of war or behind your team."
    ],
    powerSpikeReminders: [
      "Level 1-3 with W + Q: Your blight stack detonation with Q chunks for 25%+ HP; trade aggressively in early levels.",
      "Lethality Mythic (for poke build): Charged Q poke from fog can half-HP squishies; siege towers relentlessly.",
      "Level 6 (R): R root chains to nearby enemies — look for 2v2 all-ins where R can root both bot laners."
    ]
  },

  Xayah: {
    combos: [
      "AA > AA > AA > E (recall feathers for root and burst damage through target)",
      "Q (double feather) > AA > AA > E (fast root combo with Q feathers + auto feathers)",
      "W (attack speed) > AA > AA > Q > AA > E (root) > R (if needed for safety) (full all-in combo)"
    ],
    tradingPatterns: [
      "Place feathers behind the enemy with Q and autos, then E (Bladecaller) to recall them; enemies rooted by passing feathers take heavy damage.",
      "W gives attack speed to both you and your support (if Rakan); activate it before trades for maximum DPS.",
      "Use Q through the wave to poke and leave feathers behind the enemy; E to recall feathers catches people who forget about their positioning."
    ],
    earlyGame: "Set up feathers behind enemies with Q + autos, then E for root; your level 2-3 burst with a root follow-up wins most trades.",
    midGame: "Group for teamfights where your feather root can hit multiple enemies; R gives you untargetability to dodge crucial abilities.",
    lateGame: "Position feathers through fights with Q and autos, then E for a multi-person root; R into a feather-dense area for massive burst.",
    commonMistakes: [
      "Using E (Bladecaller) with only 1-2 feathers out — wait until you have 3+ feathers behind the enemy for a guaranteed root.",
      "Forgetting to use R for its untargetability to dodge critical abilities (Zed R, Karthus R, tower shots in dives).",
      "Not pairing with Rakan when possible — their shared W attack speed buff and R synergy are extremely powerful."
    ],
    powerSpikeReminders: [
      "Level 2 (Q + E): Fast Q > E combo can root and burst enemies who don't respect feather positioning.",
      "Level 6 (R): Untargetability lets you survive all-ins and dives; use it to dodge burst then E feathers left behind.",
      "Infinity Edge completion: Your feather recall (E) crits deal devastating damage; a 5-feather E can one-shot squishies."
    ]
  },

  Zeri: {
    combos: [
      "Q > AA (right click for slow) > Q > Q > Q (weave charged auto with Q bursts)",
      "E (dash through wall) > W (laser through wall for crit) > Q spam > R (wall dash engage combo)",
      "R (activate) > E (dash, longer during R) > Q spam with movespeed (teamfight kite combo)"
    ],
    tradingPatterns: [
      "Use right-click (charged auto) to slow, then follow up with rapid Q bursts while they're slowed.",
      "E through thin walls to surprise enemies from unexpected angles; your wall dash range is much longer than normal dash.",
      "During R, your movespeed and E range increase dramatically — kite around fights like a lightning bolt."
    ],
    earlyGame: "Farm with Q and look for short trades with charged AA (right-click) slow into Q spam; don't force extended fights before your first item.",
    midGame: "Look for teamfights where you can R and start stacking movespeed from champion hits; Zeri needs team fights to ramp up.",
    lateGame: "In teamfights, R immediately and kite with massive movespeed; Q spam with Overcharge stacks makes you nearly uncatchable while dealing AoE damage.",
    commonMistakes: [
      "Using E aggressively through a wall and having no escape when enemies collapse on you.",
      "Not auto-attacking (right-click) enough — Zeri's charged auto applies on-hit effects and slows, it's not just Q spam.",
      "Ulting too late in fights; R needs champion hits to maintain stacks, so activate it early to build Overcharge."
    ],
    powerSpikeReminders: [
      "Level 6 (R): R gives you movespeed, AoE damage on Q, and extended E range; teamfights become your playground.",
      "Sheen/Trinity Force: Q procs Sheen on every cast, giving you massive sustained DPS.",
      "3 items (Trinity + Runaan's + IE): You become an unstoppable kiting machine in teamfights with R active."
    ]
  },

  Aphelios: {
    combos: [
      "Calibrum (sniper) Q > AA (mark proc from range) > swap to Gravitum > Q (root) (long range root combo)",
      "Crescendum (chakram) > R (infernum or gravitum ult into close range) > AA with stacked chakrams (close range shred)",
      "Infernum (flamethrower) R into grouped enemies > swap > Crescendum AA with stacked chakrams (teamfight nuke combo)"
    ],
    tradingPatterns: [
      "With Calibrum (green/sniper), Q at max range and proc the mark for a free long-range auto — this is your safest poke pattern.",
      "Gravitum (purple) auto > Q for a guaranteed root, then swap to Crescendum or Infernum for follow-up damage.",
      "Infernum (blue) + Crescendum (white) is the strongest weapon combo — Infernum R gives chakram stacks for devastating close-range DPS."
    ],
    earlyGame: "Track your weapon rotation carefully and manage ammo so you enter fights with your strongest weapon combo; Calibrum + Gravitum is best for laning.",
    midGame: "Look for Infernum R on grouped enemies at objectives; a 3+ person Infernum ult can single-handedly win teamfights.",
    lateGame: "Cycle to Crescendum + Infernum before major fights; your close-range DPS with stacked chakrams from Infernum R is the highest burst in the game.",
    commonMistakes: [
      "Not tracking weapon rotation and entering fights with weak weapon combinations (e.g., Severum + Gravitum with no burst).",
      "Wasting Infernum R on a single target instead of saving it for grouped enemies where the AoE damage shines.",
      "Running out of ammo on your strong weapon mid-fight because you didn't manage ammo before the engage."
    ],
    powerSpikeReminders: [
      "Calibrum + Gravitum in lane: Long-range poke into root is your strongest laning combo; play around this weapon pair.",
      "Infernum + Crescendum at any point: This is your highest damage combo; force fights when you have both weapons.",
      "Level 6: Your R applies the current weapon's effect in AoE — Infernum R on 3+ enemies is game-changing."
    ]
  },

  Nilah: {
    combos: [
      "E (dash) > Q (empowered autos) > AA > AA > AA > W (dodge) (engage into sustained trade with W safety net)",
      "E > E (double dash through minions/allies to enemy) > Q > AA > W > AA > AA (gap close combo)",
      "R (whirlpool pull) > Q > AA > AA > W (AoE pull into burst with Q empowered autos)"
    ],
    tradingPatterns: [
      "Double E through a minion then to the enemy champion to close distance, then Q for empowered autos and W to block their retaliation.",
      "Use W to dodge enemy ADC auto-attacks during extended trades; Nilah wins any fight where the enemy can't auto her.",
      "R pulls enemies toward you — use it when enemies try to disengage to drag them back into melee range."
    ],
    earlyGame: "Look for level 2 all-ins with E + Q; your melee DPS with empowered autos is incredibly high if you can close the gap.",
    midGame: "Group for teamfights where your R and W shine — Nilah is a teamfight monster who heals her team through passive XP sharing.",
    lateGame: "Dive into the enemy team with E > R > Q > W; your lifesteal and W dodge make you deceptively tanky in the middle of fights.",
    commonMistakes: [
      "Trying to farm from range — Nilah is melee and needs to use E aggressively to CS and trade; passive play loses lane.",
      "Using W too early and wasting the auto-attack dodge window; save it for when the enemy commits to auto-attacking you.",
      "Not utilizing passive XP sharing; Nilah gains bonus XP from last hits near allies, so stay near your support."
    ],
    powerSpikeReminders: [
      "Level 2 (E + Q): Double dash into empowered autos is a strong all-in; play aggressive with melee supports.",
      "Level 6 (R): AoE pull and damage lets you lock down the entire enemy bot lane for a double kill.",
      "Infinity Edge: Your crit-scaling passive and empowered Q autos hit like a truck; force fights at this spike."
    ]
  },

  Smolder: {
    combos: [
      "Q (fireball) > AA > Q > AA (weave autos between Q spam for stack building)",
      "W (long range fire breath) > Q > AA (poke from range with W slow into Q)",
      "E (fly over terrain) > W > Q > AA > R (engage or escape combo with E repositioning)"
    ],
    tradingPatterns: [
      "Poke with Q at max range to build stacks safely; each Q hit on a champion gives you a stack toward your scaling breakpoints.",
      "Use W for long-range poke in lane; the slow lets you follow up with Q for additional stacks.",
      "Play for stacks, not kills; your power comes from hitting Q breakpoints (25, 125, 225 stacks) rather than early aggression."
    ],
    earlyGame: "Focus entirely on stacking Q by hitting it on champions and last-hitting with it; you are weak early and need stacks to scale into a monster.",
    midGame: "At 125 stacks your Q gains AoE explosions — start grouping for teamfights where you can splash damage across multiple enemies.",
    lateGame: "At 225 stacks your Q applies max-HP burn and you become one of the strongest carries in the game; play teamfights patiently and Q spam from safety.",
    commonMistakes: [
      "Playing aggressively early before you have stacks — Smolder is one of the weakest early ADCs and should not force fights.",
      "Not hitting Q on champions to stack faster; only farming minions with Q dramatically slows your scaling.",
      "Using E (flight) aggressively — it is your only escape and has a very long cooldown."
    ],
    powerSpikeReminders: [
      "25 Q stacks: Q gains a small burn effect; your poke starts to sting — trade a bit more in lane.",
      "125 Q stacks: Q gains AoE explosions; this is your first major power spike and when you start winning teamfights.",
      "225 Q stacks: Q applies max-HP burn; you now hard-carry teamfights and shred tanks and squishies alike."
    ]
  },

  Yunara: {
    combos: [
      "Stack Q to 8 on minions → activate Q → W (slow) → AA spam during empowered window",
      "W (slow) → R → RE (dash) → RW (Arc of Ruin) → AA for max burst combo",
      "Cast W BEFORE pressing R — the upgraded RW comes off cooldown in ~2s, giving you two W's quickly"
    ],
    tradingPatterns: [
      "Pre-stack Q to 7-8 on the wave, then activate Q and walk at the enemy for empowered autos. Back off when Q expires.",
      "Short trades: W to slow → 2-3 empowered autos → walk back. Only commit with Q active, never without stacks.",
      "Your passive gives bonus magic damage on crits — crit builds make you a hybrid threat that's hard to itemize against."
    ],
    earlyGame: "Stack Q on the first wave, hit level 2 first, W slow into activated Q for one of the strongest level 2 all-ins among ADCs.",
    midGame: "With R your abilities all upgrade — Q is always active, W has no mana cost, E becomes a dash. Use R early in fights, don't hold it.",
    lateGame: "Hypercarry with crit scaling + passive magic damage. In R form you have splash damage, dashes, and constant DPS — play teamfights patiently from max range.",
    commonMistakes: [
      "Holding R for the perfect moment — you are MUCH weaker without Transcendent upgrades. Press R early in fights, not as a last resort.",
      "Fighting without Q stacks pre-6 — without Q active your DPS drops massively. Always have stacks before engaging.",
      "Forgetting to check mana before pressing R — you need mana for the upgraded E dash. Running OOM in R form is a death sentence."
    ],
    powerSpikeReminders: [
      "Level 2: One of the strongest ADC level 2 spikes. Pre-stack Q on wave, unlock W, and all-in immediately.",
      "Level 6: R upgrades ALL abilities. Q auto-activates, W has no cost, E becomes a dash. Massive power spike.",
      "First crit item: Passive bonus magic damage on crits kicks in hard. Your damage becomes hybrid and hard to itemize against."
    ]
  }
};
