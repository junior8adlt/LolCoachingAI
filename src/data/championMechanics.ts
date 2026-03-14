export interface ChampionMechanics {
  animationCancels: string[];
  spacingTricks: string[];
  abilityBuffering: string[];
  advancedTips: string[];
}

export const championMechanicsDB: Record<string, ChampionMechanics> = {
  // ============================================================
  // RIVEN - Most animation cancels in the game
  // ============================================================
  Riven: {
    animationCancels: [
      "Fast Q Combo: AA -> Q -> move command (click ground) -> AA -> Q -> move command -> AA -> Q. The move command cancels Q's wind-down animation, letting you auto much faster between Qs.",
      "E cancels the cast time of any ability. Use E -> R1 to cast Blade of the Exile with zero delay.",
      "E -> W -> Q (Doublecast): During E's dash, input W then Q nearly simultaneously. Both W and Q will fire at the end of E's dash, effectively casting two abilities in one animation frame.",
      "E -> R1 -> W -> Q: Use E to cancel R1 animation, then doublecast W+Q for an extremely fast burst combo.",
      "E -> R2 -> Q3: E cancels R2 (Wind Slash) animation, then chain into Q3 knockup for burst + CC.",
      "W -> AA cancel: After W stuns, immediately auto attack. The stun duration guarantees the auto lands while the enemy cannot trade back.",
      "Hydra/Tiamat can be woven between Q autos to cancel auto-attack wind-down: AA -> Tiamat -> Q -> move -> AA.",
      "R1 -> E -> R2 -> Flash -> Q3: Full one-shot combo. R1 first (can be done early), E into range, R2 for execute, flash Q3 for knockup."
    ],
    spacingTricks: [
      "Use Q1 and Q2 forward to gap close, but save Q3 to disengage or reposition if the trade goes badly.",
      "E (Valor) can be used purely as a spacing tool. Dash backward to dodge skillshots while still casting W or Q.",
      "Q3 -> Flash redirects the knockup to a new location. Use this to surprise enemies who thought they were out of range.",
      "Use E toward a wall and then Q away from it for quick directional changes that confuse opponents.",
      "In lane, walk up with E shield to absorb poke, trade with W -> AA -> Q, then Q away to disengage."
    ],
    abilityBuffering: [
      "Buffer W during Q3 dash: press W while in Q3 animation, and W fires the instant Q3 lands.",
      "Buffer R2 during E dash: press R2 mid-E and it fires immediately at the end of E.",
      "Buffer Flash during Q3: input Flash mid-Q3 to redirect the knockup hitbox to a new position.",
      "Buffer Ignite/Smite during E to avoid losing any time on the dash animation.",
      "You can buffer Hextech item actives during E for instant activation after dash completes."
    ],
    advancedTips: [
      "The Shy Combo: E -> R1 -> Flash -> W -> AA -> Hydra -> R2 -> Q. This is the fastest possible one-shot combo used by top Riven players.",
      "Practice the fast combo in Practice Tool until you can consistently execute AA-Q-Move at max speed. A good benchmark is completing the full Q1-Q2-Q3 fast combo in under 2.5 seconds.",
      "Against ranged matchups, hold E for their poke and use Q1-Q2 to gap close, Q3 for the knockup, then W to lock them down.",
      "Track your Q timer (13s from first Q cast). If Q is about to expire, use Q3 aggressively then re-engage when the full Q cooldown resets.",
      "In teamfights, flank with E -> R1 -> Flash -> W (AoE stun) -> Hydra -> R2 for maximum AoE burst.",
      "You can extend wall-hops by pressing Q at the very edge of terrain. Many walls that seem too thick can be hopped with precise Q placement."
    ]
  },

  // ============================================================
  // YASUO
  // ============================================================
  Yasuo: {
    animationCancels: [
      "E -> Q (Sweeping Blade + Steel Tempest): Cast Q during E dash to perform a circular AoE slash. If Q is stacked (tornado), this becomes an AoE knockup.",
      "Auto attack resets: Yasuo can weave autos between every ability. After E -> Q, immediately auto attack for maximum DPS.",
      "E through a minion -> immediately Q toward the enemy champion to cancel E's end-lag with Q's animation.",
      "R (Last Breath) animation can be used to reposition: Yasuo always lands on the opposite side of the enemy from where he was when he pressed R."
    ],
    spacingTricks: [
      "Use E on minions to rapidly close distance to enemies or escape through the wave. Track which minions you have already dashed through (they are marked and cannot be dashed through again for several seconds).",
      "Wind Wall (W) placement: Place it slightly behind you when retreating so the enemy projectiles are blocked while you create distance.",
      "E through minions in a zigzag pattern to dodge skillshots while approaching or retreating.",
      "Use E on an enemy champion and immediately walk backward for a quick poke-and-disengage pattern."
    ],
    abilityBuffering: [
      "Buffer Q during E: Press Q at any point during your E dash and it will fire at the end of the dash as the spinning slash.",
      "Buffer R during E -> Q knockup: If your EQ knocks up a target, press R immediately to ult before they can Flash.",
      "Buffer Flash during E: You can Flash mid-E to redirect where you end up, catching enemies off guard.",
      "You can buffer Q during R's animation to have tornado ready immediately after landing."
    ],
    advancedTips: [
      "Beyblade: E -> Q (with tornado stacked) -> Flash. You dash to a minion, EQ for the spinning knockup, then Flash onto the real target. The knockup AoE follows the Flash.",
      "Airblade: Throw tornado from range, then E -> Q a minion/enemy as R becomes available from the tornado knockup. The EQ damage is added to the ult because it fires just as you press R.",
      "Keyblade: Combines Beyblade and Airblade. E -> Q (tornado) -> Flash (Beyblade) to knock up, then E -> Q another target and R. This is the hardest Yasuo combo and adds an extra EQ worth of damage to your ult.",
      "In lane, stack Q tornado on minions, then E through the wave to get in range and EQ -> R for a surprise all-in.",
      "Track enemy projectile-based abilities to use Wind Wall reactively. Blocking one critical ability (e.g., Thresh hook, Jinx ult) can win teamfights.",
      "During R (Last Breath), you gain maximum armor penetration bonus on crits for 15 seconds. Time your ult to maximize the armor pen window for your team's follow-up damage."
    ]
  },

  // ============================================================
  // YONE
  // ============================================================
  Yone: {
    animationCancels: [
      "E -> Q3 (Spirit Cleave dash + knockup): Cast E to enter spirit form, then use Q3 dash-knockup to engage. The E gives you a safe return point.",
      "Q -> Flash: Similar to Yasuo, Q3 dash can be redirected with Flash for a surprise knockup.",
      "R -> Flash: R can be buffered with Flash to extend the ultimate range or redirect it.",
      "Weave auto attacks after every Q cast. Yone Q applies on-hit effects, so AA -> Q -> AA maximizes DPS."
    ],
    spacingTricks: [
      "E (Soul Unbound) lets you trade aggressively then snap back to safety. Use E -> engage -> deal damage -> let E timer pull you back before the enemy can retaliate.",
      "Use Q3 dash to reposition through the enemy and escape toward your tower, not just for engaging.",
      "W (Spirit Cleave) grants a shield based on enemies hit. Use W toward multiple enemies in a trade to maximize your shield for survivability.",
      "E -> R -> Q3 extends your effective engage range massively. You can reach backline targets from over a screen away."
    ],
    abilityBuffering: [
      "Buffer Q during E activation. You can start stacking Q during the E spirit form to have Q3 ready for the engage.",
      "Buffer W during Q3 dash: Press W during Q3 dash so the shield procs instantly at the end of the dash.",
      "Buffer R during E: Cast R while in E spirit form for maximum range engage with a safe snap-back.",
      "You can input Flash during R cast for an extended/redirected ultimate."
    ],
    advancedTips: [
      "E -> Q3 -> R combo: Start in spirit form (E), dash forward with Q3 for a knockup, then R through the entire team. Snap back to safety with E recall.",
      "Track your E timer carefully. You have about 5 seconds to deal damage before being pulled back. All damage dealt in spirit form is repeated as a percentage when you snap back.",
      "In teamfights, aim R to hit the backline carry. R pulls enemies to the center of its path, grouping them for your team's AoE follow-up.",
      "Use Q3 -> Flash for Beyblade-style plays, then R for extended CC chains.",
      "Against ranged matchups, use E to trade. Even if you take some damage, the snap-back means you escape safely and the bonus damage from E makes the trade favorable."
    ]
  },

  // ============================================================
  // LEE SIN
  // ============================================================
  LeeSin: {
    animationCancels: [
      "Ward hop (W): Place a ward and immediately W to it. Bind your trinket to a comfortable key and use Quick Cast for faster execution.",
      "R -> Flash: Cast R (Dragon's Rage) on a target, then immediately Flash behind another enemy. The kick direction changes to where you flashed, allowing you to kick a priority target into your team.",
      "Q2 -> Ward -> W: After landing Q2 (Resonating Strike), immediately drop a ward and W to it for instant repositioning.",
      "AA cancel with abilities: Lee Sin's passive gives attack speed for 2 autos after each ability. Weave AA -> ability -> AA -> AA -> ability for maximum DPS in extended fights.",
      "E -> E2 cancel: You can cancel E1 animation with Tiamat/Hydra for faster burst in jungle clearing."
    ],
    spacingTricks: [
      "Use W to an allied minion or ward to escape ganks. Always keep a ward charge available for emergency escapes.",
      "Q1 is a skillshot with moderate range. Use it to check bushes safely instead of face-checking.",
      "In teamfights, position near your ADC and use W to peel (shield + dash to them) or R to kick divers away.",
      "Use Q1 -> Q2 on a minion near the enemy to gap-close without committing Q to the champion (saving Q for a guaranteed hit at closer range)."
    ],
    abilityBuffering: [
      "Buffer R during Q2 dash: Press R while flying toward the target with Q2, so the kick comes out instantly on arrival.",
      "Buffer W during Q2 dash: Place a ward and press W during Q2 travel to immediately hop to the ward after Q2 lands.",
      "Buffer Flash during R: Press Flash during R cast animation to redirect the kick direction.",
      "You can buffer Smite during Q2 dash to secure objectives the instant you arrive."
    ],
    advancedTips: [
      "Standard Insec: Q1 -> Q2 to target -> Ward behind them -> W to ward -> R (kick them into your team). Practice until you can do this in under 1 second.",
      "Chinese Insec: Q1 -> Ward in front of target -> W to ward -> R + Flash behind them. This is faster than the standard Insec because you skip Q2 travel time.",
      "Flash Insec: Walk up -> R -> Flash behind. The fastest Insec variation but requires being in melee range first.",
      "In jungle, use passive efficiently: ability -> AA -> AA -> ability -> AA -> AA. This conserves energy and maximizes damage.",
      "Track your energy carefully. A full combo (Q -> Q -> E -> E -> W) costs significant energy. Keep enough energy for a W escape.",
      "Use Q1 on a fleeing enemy, wait for them to use their dash/flash, then Q2 to follow. Do not immediately Q2 unless you are sure they cannot escape."
    ]
  },

  // ============================================================
  // ZED
  // ============================================================
  Zed: {
    animationCancels: [
      "W -> E -> Q: Cast W (Living Shadow), then immediately E and Q. Both Zed and his shadow cast E and Q simultaneously. E slows the target, making Q easier to land.",
      "W -> Q: For longer range poke, cast W toward the enemy then Q through the shadow. Two shurikens from different angles are harder to dodge.",
      "R -> E -> Q: After R (Death Mark) puts you behind the target, instantly E (guaranteed hit) then Q for maximum burst.",
      "Auto-attack weaving: After R teleport, AA -> E -> AA -> Q -> AA for maximum passive proc damage."
    ],
    spacingTricks: [
      "Place W shadow to the side of the enemy, not directly at them. Shurikens from an angle are much harder to dodge and more likely to both hit.",
      "Keep W shadow as an escape route. Do not W aggressively in lane if the enemy jungler is nearby.",
      "Use W -> W (reactivate) to swap with shadow for instant repositioning. This can dodge key abilities like hooks or stuns.",
      "R gives you a shadow at your pre-R position. After bursting the target, R again to swap back to safety."
    ],
    abilityBuffering: [
      "Buffer E and Q during R's dash: Press E and Q while R is teleporting you. Both fire instantly when you arrive.",
      "Buffer W during R: Place W in an escape direction during R animation so you have two shadows for escape after the burst.",
      "Buffer Flash during W cast: Flash can redirect where your shadow appears.",
      "You can buffer Ignite during R animation for extra damage on the Death Mark pop."
    ],
    advancedTips: [
      "R shadow management: After R, you have 3 positions (yourself, R shadow, and W shadow if placed). Use all 3 for juking and damage amplification.",
      "W -> E -> Q poke in lane: Position W beside the enemy, E to slow, Q to hit both shurikens. Do this repeatedly to whittle them down before an all-in at 6.",
      "R dodge: R gives brief untargetability. Time it to dodge key abilities like Syndra R, Karthus R, or tower shots.",
      "Triple shuriken: W -> Q (2 shurikens), then R -> Q (2 more from new positions). Landing all shurikens is devastating.",
      "In teamfights, flank from fog of war with R on the ADC -> full combo -> W swap back to safety or R swap back to pre-R position.",
      "Death Mark pop damage scales with all damage dealt during the mark duration. Stack as many abilities and autos as possible before it pops."
    ]
  },

  // ============================================================
  // KATARINA
  // ============================================================
  Katarina: {
    animationCancels: [
      "E (Shunpo) -> W: Cast W immediately after E to drop a dagger at your Shunpo destination. The dagger lands quickly and procs Voracity passive for AoE damage.",
      "E -> AA cancel: Shunpo resets your auto-attack timer. Always auto immediately after E for extra damage.",
      "Gunblade/Hextech item -> E: Use the item active during E for instant burst on arrival (in builds that include these actives).",
      "Picking up daggers via Shunpo (E to a dagger location) cancels E animation with the dagger spin damage."
    ],
    spacingTricks: [
      "Q (Bouncing Blade) bounces to nearby enemies and drops a dagger behind the primary target. Position so the dagger lands where you want to Shunpo.",
      "In lane, throw Q through the minion wave so the dagger lands behind the enemy champion. E to the dagger for burst, then E to a minion to escape.",
      "Use W dagger defensively: drop W and walk away. If the enemy chases onto the dagger, E back to it for a punishing trade.",
      "E to a minion or ward behind you to escape ganks. Always track available E targets."
    ],
    abilityBuffering: [
      "Buffer E during Q bounce: Press E on the dagger landing spot before the dagger has fully landed. Katarina will Shunpo the instant the dagger arrives.",
      "Buffer R immediately after E for instant Death Lotus activation on arrival.",
      "Buffer W during E so the dagger drops the moment Shunpo completes.",
      "You can Shunpo to daggers that are still in the air (mid-fall), making your combos significantly faster."
    ],
    advancedTips: [
      "Full burst combo: E to target -> W (drop dagger) -> Q (bounces and drops second dagger) -> E to first dagger (W dagger) -> auto -> E to second dagger (Q dagger). This chains Voracity resets for massive AoE damage.",
      "In teamfights, wait for CC to be used before going in. Katarina R is easily interrupted. Enter after key CC abilities are on cooldown.",
      "Track all dagger positions on the ground. Each dagger is a potential Shunpo reset and AoE damage source.",
      "Voracity passive: Champion kills and assists reduce all ability cooldowns by 15 seconds. In teamfights, getting one reset can chain into a pentakill.",
      "E -> Flash is possible: Shunpo to a dagger, then Flash to reposition before the dagger damage procs. This is extremely niche but can surprise enemies.",
      "Against melee champions in lane: Q -> walk up -> AA when they step on dagger -> E away. Short trades that abuse dagger placement."
    ]
  },

  // ============================================================
  // IRELIA
  // ============================================================
  Irelia: {
    animationCancels: [
      "Q (Bladesurge) resets on kill or on marked targets (from E or R). Chain Q through marked minions to gap-close to champions.",
      "Q -> AA cancel: Q resets your auto-attack timer. Always auto immediately after each Q for extra damage and passive stacking.",
      "E1 -> Q -> E2: Cast E1, then Q to a minion to reposition, then cast E2 from the new location for an unexpected stun angle.",
      "R -> Q: Cast R through the wave and champion, then Q to any marked target for instant gap close and reset."
    ],
    spacingTricks: [
      "Manage the minion wave to always have low-health minions for Q resets as an escape or engage path.",
      "E1 placement: Cast E1 behind you, then walk forward and E2 in front. The diagonal stun line is harder to dodge than a straight line.",
      "Use Q on marked caster minions in the backline to quickly reposition behind the enemy for flanking.",
      "W (Defiant Dance) reduces incoming damage during the channel. Use it to tank a key enemy ability, then release for damage."
    ],
    abilityBuffering: [
      "Buffer E2 during Q dash: Press E2 while dashing with Q so the stun fires instantly at your destination.",
      "Buffer R during Q dash for instant ultimate on arrival.",
      "Buffer W during Q dash to start channeling W immediately after arriving.",
      "You can Q to a minion and buffer Flash for an unexpected position change mid-reset chain."
    ],
    advancedTips: [
      "Passive stacking: Irelia gains attack speed per ability hit on champions (stacks up to 4). Fully stacked Irelias win most 1v1s. Stack passive on minions with Q before engaging.",
      "E prediction: Most enemies dodge sideways. Place E1 and E2 to cover the lateral escape path, not where the enemy currently stands.",
      "R -> E combo: R marks the entire wave and champions. E stuns. Use R to mark a wave, then Q through marked minions to reach the enemy, then E to stun.",
      "In teamfights, look for multi-champion R marks. R through a cluster of enemies, then chain Q resets through all marked targets.",
      "Against ranged matchups: Let the wave push to you. Q to a low minion, then Q to a marked (E) target for an all-in. Use W to absorb their burst.",
      "Track Q reset availability carefully. Running out of resets mid-fight leaves Irelia extremely vulnerable."
    ]
  },

  // ============================================================
  // CAMILLE
  // ============================================================
  Camille: {
    animationCancels: [
      "Q1 -> W: Cast W immediately after Q1 auto-attack. W's outer cone damage fires while Q1's animation is still winding down.",
      "Q is an auto-attack reset. AA -> Q1 -> AA -> Q2 for maximum DPS in the Q1-Q2 window.",
      "E -> Flash: During E2 (the dash toward the wall hook), Flash to redirect your landing position. This massively extends E's effective range and catches enemies off guard.",
      "W animation cancel: You can buffer E during W animation to cancel W's backswing. The W damage still goes through.",
      "R -> Q2: Use R (Hextech Ultimatum) to lock down the target, then time Q2 (true damage auto) for the guaranteed hit."
    ],
    spacingTricks: [
      "E1 (hookshot to wall) -> E2 (dash from wall) gives Camille massive engage range. Use fog of war to hide E1 casting.",
      "W (Tactical Sweep) outer cone slows and heals. Use it at max range to poke and sustain in lane trades.",
      "Use E defensively to hook onto terrain and dash away from ganks. The stun on E2 also works as peel.",
      "Q2 grants bonus movement speed. Use Q1 on a minion, wait for Q2 timer, then engage with the movement speed and true damage."
    ],
    abilityBuffering: [
      "Buffer Q2 during E2 dash: Press Q2 during E dash so the empowered auto fires instantly on arrival.",
      "Buffer W during E2 dash: W fires at the landing location immediately.",
      "Buffer R during E2 dash for instant lockdown on arrival.",
      "Buffer Flash during E2 for extended range hookshot-flash engages."
    ],
    advancedTips: [
      "Q2 timing: Q2 becomes available 1.5 seconds after Q1 and converts to true damage after a brief channel. In trades, use Q1 on a minion, wait for Q2 conversion, then E -> Q2 the champion for true damage burst.",
      "E -> Flash is Camille's most important advanced mechanic. Practice it until consistent. The stun and damage apply at the Flash destination.",
      "R (Hextech Ultimatum) traps an enemy in a zone. Use it on isolated carries in teamfights. Camille cannot be displaced out of R zone.",
      "In lane, short trade pattern: E in -> AA -> Q1 -> W (outer cone) -> Q2 -> E out (if wall is nearby).",
      "Camille's passive (Adaptive Defenses) gives a shield based on the damage type of the champion she attacks. Track whether the enemy deals more AD or AP to predict your shield type.",
      "W heal only works on champions hit by the outer half. Always aim to hit the enemy with the outer cone, not the inner cone."
    ]
  },

  // ============================================================
  // DRAVEN
  // ============================================================
  Draven: {
    animationCancels: [
      "W (Blood Rush) resets on catching a Spinning Axe. Use W -> catch axe -> W again for near-permanent attack speed and movement speed buffs.",
      "Cast W right before catching an axe to get the speed buff twice: once from W, then the cooldown resets so you can W again immediately.",
      "E (Stand Aside) can be cast during auto-attack wind-down to cancel the animation and immediately displace enemies.",
      "AA -> E -> AA: Use E between autos to cancel auto wind-down and maintain DPS while applying CC."
    ],
    spacingTricks: [
      "Axe landing is determined by your movement direction when the auto-attack hits the target. Click in the direction you want the axe to land immediately after attacking.",
      "In lane, direct axes toward the enemy to maintain aggression. In dangerous situations, direct axes toward your tower for safe farming.",
      "Use W movement speed to aggressively position forward for trades, then catch axes while backing off for kiting.",
      "E (Stand Aside) interrupts dashes. Save it for enemy engage abilities like Leona E or Thresh Q follow-up."
    ],
    abilityBuffering: [
      "Buffer W during R (Whirling Death) cast for instant speed boost after the global ult fires.",
      "Buffer E during auto-attack animation to cancel the backswing.",
      "You can catch axes while channeling R (Whirling Death return).",
      "Buffer Flash during E for extended range displacement."
    ],
    advancedTips: [
      "Always keep 2 axes spinning in lane. This requires constant axe management and is the hallmark of a good Draven player.",
      "Axe catching priority: Never catch an axe if it puts you in a dangerous position. A dropped axe is better than dying.",
      "W mana management: W costs significant mana. Do not spam it early. Use it when you need the speed boost for a trade or to catch an otherwise-missed axe.",
      "R (Whirling Death) can be recast to make it return early. Use this for snipes on low-health targets rather than letting it travel full distance.",
      "Draven's passive (League of Draven) stacks gold on kills. Cash in stacks on champion kills for massive gold leads. Avoid dying with high stacks.",
      "Attack speed affects axe landing timing. With higher attack speed, you need to catch axes faster. Practice at different attack speed thresholds."
    ]
  },

  // ============================================================
  // APHELIOS
  // ============================================================
  Aphelios: {
    animationCancels: [
      "Weapon swap -> AA: Swapping weapons resets your auto-attack timer. Weave a weapon swap between autos for extra burst.",
      "Q -> weapon swap -> Q: If both weapons' Q abilities are available, you can fire one Q, swap weapons, and fire another Q in quick succession.",
      "Calibrum Q (sniper) -> swap -> Gravitum Q (root): Poke from long range with Calibrum mark, then swap to Gravitum and Q to root the marked target from extreme distance.",
      "Severum Q (heal dash) -> auto-attack weaving: Continue issuing move commands and autos during Severum Q for repositioning while healing."
    ],
    spacingTricks: [
      "Calibrum (green) gives 100 extra range on marked targets. Use Q from fog of war to mark enemies, then auto from extreme distance.",
      "Gravitum (purple) autos apply a slow. Use this for kiting and peel against dive champions.",
      "Severum (red) Q dashes Aphelios and fires rapidly. Use it both offensively (chase) and defensively (kite backward while healing).",
      "Crescendum (white) turrets act as zone control. Place them in chokepoints to slow rotations and provide vision."
    ],
    abilityBuffering: [
      "Buffer R during Severum Q for instant Moonlight Vigil at the end of the heal-dash.",
      "Buffer weapon swap during Q animations to chain abilities faster.",
      "Calibrum marks can be consumed with any weapon's auto. Mark with Calibrum, swap, then auto with Gravitum for a ranged root.",
      "Buffer Flash during R for repositioning mid-ult."
    ],
    advancedTips: [
      "Infernum R (blue flamethrower ult) is Aphelios' strongest teamfight ability. It fires a burst in an AoE that splashes to nearby enemies. Always try to have Infernum as your main hand weapon for teamfights.",
      "Ideal weapon rotation for teamfights: Calibrum -> Severum -> Gravitum -> Infernum -> Crescendum. This ensures Infernum is available for key fights.",
      "Gravitum Q roots all enemies marked by Gravitum autos. In teamfights, auto multiple enemies with Gravitum, then Q for a multi-person root.",
      "Crescendum (white) + Severum (red) combo: Severum Q fires rapidly, and each shot creates a Crescendum mirror chakram. After Severum Q, your Crescendum autos deal massive damage due to stacked chakrams.",
      "Track your ammo on both weapons. Running out of ammo at the wrong time in a fight can leave you with suboptimal weapons.",
      "Infernum Q -> Gravitum swap -> Gravitum Q: AoE damage with Infernum, then root all hit targets with Gravitum for devastating teamfight CC."
    ]
  },

  // ============================================================
  // THRESH
  // ============================================================
  Thresh: {
    animationCancels: [
      "Flay (E) -> Hook (Q): Use E to displace the enemy into a predictable position, then immediately Q for a nearly guaranteed hook.",
      "Auto-attack (empowered by E passive) -> Flay -> Hook for burst damage into CC chain.",
      "Hook -> Q2 (dash to target) -> Flay -> R: Full engage combo. Hook, dash in, flay them back into your team, then ult to slow.",
      "E (Flay) can cancel enemy dashes if timed correctly. Use it reactively against Leona E, Tristana W, etc."
    ],
    spacingTricks: [
      "Flay direction depends on your cursor position relative to Thresh. Cursor behind Thresh = pull enemies toward you. Cursor in front = push them away.",
      "Walk up without hooking to pressure. Many players will Flash or dash preemptively when Thresh walks up. Throw hook after they panic-dodge.",
      "Lantern (W) max range is very long. Throw it to allies in fog of war to bring them into a fight or help them escape.",
      "Use E passive-empowered autos in lane for poke. The souls you collect increase Flay passive damage, making each auto meaningful."
    ],
    abilityBuffering: [
      "Buffer Flay during Q2 dash: Press E during the dash to the hooked target so Flay fires instantly on arrival.",
      "Buffer R during Q2 dash: Press R during dash so The Box activates immediately when you arrive.",
      "Buffer Lantern (W) before Q2: Throw lantern to your jungler, then Q2 in. The jungler clicks lantern and follows you.",
      "Buffer Flash during Q for redirected hook angle (Q -> Flash)."
    ],
    advancedTips: [
      "Hook prediction: Aim where the enemy will be, not where they are. Most enemies dodge sideways. Throw the hook to one side and they often walk into it.",
      "Lantern + ally combo: Throw lantern behind you to an ally (e.g., jungler). Hook an enemy, Q2 in, then your ally takes the lantern for a 2-man engage from nowhere.",
      "Flay -> Hook is often better than Hook -> Flay. Leading with Flay guarantees the slow and displacement, making the follow-up hook nearly free.",
      "In teamfights, peel with Flay and R (The Box) rather than always looking for hooks. Protecting your carry is often more valuable.",
      "Soul collection: Prioritize collecting souls safely. Each soul gives permanent armor and AP, scaling Thresh's damage and tankiness infinitely.",
      "Hook has a long cooldown early. Do not throw it randomly. A missed hook is a long window where the enemy can engage on you."
    ]
  },

  // ============================================================
  // VAYNE
  // ============================================================
  Vayne: {
    animationCancels: [
      "Tumble (Q) is an auto-attack reset. AA -> Q -> AA for instant burst. The Q-empowered auto fires faster than a normal auto.",
      "Tumble into a wall: If Vayne tumbles directly into terrain, the tumble animation is shortened because she does not travel. This results in a faster auto-attack reset.",
      "Condemn (E) -> Flash: Cast Condemn, then immediately Flash to a new position. The knockback direction updates to your post-Flash position, allowing wall stuns from unexpected angles.",
      "R -> Q: Activating R (Final Hour) can be woven between autos. Use R between AA -> R -> AA -> Q -> AA for no lost DPS."
    ],
    spacingTricks: [
      "Tumble (Q) forward into walls during fights to get the fastest possible auto-reset (wall-tumble cancel).",
      "Condemn geometry: Always be aware of nearby walls. Position so that enemies are between you and a wall for stun opportunities.",
      "R + Q grants invisibility during Final Hour. Use Q to go invisible, reposition, then auto from an unexpected angle.",
      "Use Condemn (E) as peel against divers. Do not save it for wall stuns if you are about to die."
    ],
    abilityBuffering: [
      "Buffer Condemn during Tumble: Press E during Q animation and it fires immediately after the tumble auto.",
      "Buffer Flash during Condemn cast for instant wall-stun angles.",
      "Buffer R during auto-attack animation to avoid losing DPS when activating Final Hour.",
      "Buffer Q immediately after Condemn to reposition while the enemy is knocked back."
    ],
    advancedTips: [
      "Silver Bolts (W passive): Every 3rd auto on the same target deals percent max health true damage. Never switch targets mid-fight unless absolutely necessary.",
      "Wall-tumble optimization: Practice tumbling into walls from different angles. The shorter the tumble distance (closer to the wall), the faster the auto reset.",
      "Condemn Flash: E -> Flash changes the angle of Condemn. This is one of the hardest Vayne mechanics but enables wall stuns from angles that should not be possible.",
      "During R, use Q invisibility to dodge skillshots and reposition. Each Q during R gives 1 second of invisibility.",
      "Against tanks: Vayne melts tanks with W true damage. Focus on kiting and getting consistent 3-hit procs rather than chasing flashy plays.",
      "Condemn can interrupt dashes and channels. Use it to stop Katarina R, Jhin R, Warwick R, etc."
    ]
  },

  // ============================================================
  // FIORA
  // ============================================================
  Fiora: {
    animationCancels: [
      "Q (Lunge) -> AA: Q resets auto-attack timer. Lunge to a vital, then immediately auto for extra damage.",
      "Q -> Tiamat/Hydra: Use Tiamat during Q animation for burst AoE damage while dashing.",
      "W (Riposte) can be cast during Q dash. Q toward the enemy and W mid-dash for a surprise parry.",
      "E (Bladework) -> AA: E resets auto-attack timer on first cast (attack speed) and second hit is a guaranteed crit. AA -> E1 -> AA -> AA (crit) for maximum trade damage."
    ],
    spacingTricks: [
      "Q range allows Fiora to lunge to vitals and then walk away before the enemy can retaliate. Short Q trades are Fiora's bread and butter in lane.",
      "Position so that favorable vitals (near you) are the ones exposed. Walk out of vision briefly to reset vital positions if the current vital is unfavorable.",
      "Use Q to lunge to minions when retreating. Q does not have to target champions.",
      "W (Riposte) slows if it does not block an immobilizing effect. Use it directionally to slow enemies chasing you."
    ],
    abilityBuffering: [
      "Buffer W during Q dash: Cast W while lunging with Q. The parry will activate at the Q destination, blocking abilities at the destination.",
      "Buffer E during Q for instant attack speed steroid on arrival.",
      "Buffer Tiamat/Hydra during Q dash for burst damage combo.",
      "Buffer Flash during Q for extended lunge range."
    ],
    advancedTips: [
      "Vital dance: When R is active (Grand Challenge), 4 vitals appear. Move around the target in a circle to proc all 4 vitals. Use Q to reach far vitals quickly.",
      "Vital patterns alternate between NE/SW and NW/SE. After procing one vital, the next spawns on the opposite diagonal. Use this knowledge to pre-position.",
      "W (Riposte) timing is everything. Against champions like Jax (E stun), Renekton (W stun), or Malzahar (R), time W to block the immobilize and return it as a stun.",
      "R (Grand Challenge) heals in a zone when all 4 vitals are proced. Use this heal to turn teamfights. Even if the target dies with only some vitals proced, the heal still activates.",
      "Against CC-heavy teams, save W for the most impactful ability. A well-timed W can stun an entire teamfight engage (e.g., blocking Malphite R and stunning him).",
      "Q cooldown is very low. Use it to constantly poke vitals in lane. Each vital proc gives movement speed to reposition for the next trade."
    ]
  },

  // ============================================================
  // AZIR
  // ============================================================
  Azir: {
    animationCancels: [
      "W -> Q: Place a soldier (W), then immediately Q to reposition it. The soldier attacks from the new position, extending your effective poke range.",
      "W -> E -> Q (Shurima Shuffle): Place a soldier, E (dash) to it, then Q during the dash to redirect the soldier and extend Azir's travel distance far beyond normal E range.",
      "W -> E -> Q -> R: The full Shurima Shuffle. Dash an extreme distance and ult the enemy team into yours.",
      "Auto-attack weaving between soldier attacks: Azir himself can auto-attack alongside soldier attacks for extra on-hit damage."
    ],
    spacingTricks: [
      "Keep soldiers between you and the enemy. Soldiers at max range zone enemies away from CS and poke when they walk into range.",
      "Do not stack soldiers. Spread them out to cover more ground and make it harder for enemies to avoid all soldier attack zones.",
      "Stay about 600+ units behind your soldiers. Standing too close makes you vulnerable to all-ins.",
      "Use W -> Q to poke from unexpected angles. Q repositions soldiers mid-flight for surprise damage."
    ],
    abilityBuffering: [
      "Buffer Q during E dash: This is the core of the Shurima Shuffle. Q redirects the soldier during your E dash, extending the travel distance.",
      "Buffer R during E -> Q dash for instant Emperor's Divide on arrival.",
      "Buffer Flash during E -> Q for even more extended shuffle range.",
      "Buffer W before E to ensure a soldier is available for the dash."
    ],
    advancedTips: [
      "Shurima Shuffle: W -> E -> Q -> R. Place soldier, dash to it, redirect soldier with Q mid-dash, then R the enemies into your team. This is one of the highest-impact plays in the game.",
      "Soldier positioning in teamfights: Place 2-3 soldiers in a line to create a damage zone. Q to reposition them as the fight moves.",
      "R (Emperor's Divide) creates an impassable wall. Use it to cut off escapes, peel for your team, or shove enemies into your tower.",
      "E shield: E gives a shield when Azir dashes. In desperation, E toward a soldier for a defensive shield even if you do not intend to engage.",
      "Track soldier count and cooldowns. Running out of soldiers mid-fight leaves Azir defenseless. Keep at least 1 W charge in reserve.",
      "In lane, poke with soldier autos (W -> AA through soldiers). Zone enemies off CS and look for Shuffle opportunities when they overextend."
    ]
  },

  // ============================================================
  // NIDALEE
  // ============================================================
  Nidalee: {
    animationCancels: [
      "Form swap (R) resets auto-attack timer. After an auto in human form, immediately R to cougar and auto again for a quick burst.",
      "Human Q (Javelin Toss) -> R -> Cougar W (Pounce): Throw spear, swap to cougar, and pounce to the hunted target for extended leap range.",
      "Cougar Q (Takedown) -> AA cancel: Cougar Q is an auto-attack reset. AA -> Q for burst execute damage.",
      "Human W (Bushwhack) -> Q: Place trap while throwing spear. Both can mark the target as Hunted."
    ],
    spacingTricks: [
      "Cougar W (Pounce) on Hunted targets has massively extended range. Use Human Q/W to mark targets before pouncing.",
      "Pounce resets on killing an enemy. Use this to chain through jungle camps or reset Pounce on a minion kill to escape.",
      "Human E (Primal Surge) heals and gives attack speed. Use it on yourself or allies for sustain and tower pushing.",
      "Use Human form for poking and Cougar form for finishing. Do not stay in Cougar form at range where you cannot reach the enemy."
    ],
    abilityBuffering: [
      "Buffer R (form swap) during Human Q travel time. Throw spear, swap to cougar while it flies, then pounce when it hits.",
      "Buffer Cougar W during Pounce landing for instant Swipe AoE on arrival.",
      "Buffer Cougar Q during Cougar W (Pounce) dash for instant Takedown on arrival.",
      "Buffer Human E on yourself during form swap for instant heal when switching back to human form."
    ],
    advancedTips: [
      "Full combo: Human Q -> Human W (optional trap) -> R -> Cougar W (extended pounce on Hunted) -> Cougar E (Swipe) -> Cougar Q (Takedown execute). Land the spear first, always.",
      "Spear damage scales with distance traveled. Throw spears from max range for maximum damage. A max-range spear can chunk 60%+ HP from a squishy.",
      "Hunt passive: Targets marked by Q or W take bonus damage from Cougar abilities and allow extended Pounce range. Always mark before engaging.",
      "In jungle, Nidalee's clear speed is one of the fastest. Use Human Q -> R -> Cougar combo on each camp. Kite camps with Cougar W for efficiency.",
      "Nidalee falls off if she cannot land spears. Practice spear prediction and aim. A missed spear means no Hunt mark and severely reduced damage.",
      "Pounce reset on kills allows escape after assassination. Kill the target, pounce to a minion or jungle camp, and escape."
    ]
  },

  // ============================================================
  // AKALI
  // ============================================================
  Akali: {
    animationCancels: [
      "Passive auto (Assassin's Mark) is unstoppable and can be buffered with any ability except R1 to speed up combos.",
      "E1 -> E2: Throw E (Shuriken Flip), then recast to dash to the marked target. AA between E1 and E2 for extra passive proc.",
      "W (Twilight Shroud) cancels auto-attack animation entirely. Use W after an auto to cancel the wind-down and reposition in the shroud.",
      "R2 animation can cancel auto-attack wind-down. Auto -> R2 for burst finish."
    ],
    spacingTricks: [
      "W (Twilight Shroud) provides invisibility and a movement speed burst. Use it to weave in and out of visibility for passive procs.",
      "Passive ring: After using an ability, a ring appears around the enemy. Cross the ring's edge to empower your next auto. Step out -> empowered AA -> step back in shroud.",
      "E1 can be thrown backward to create distance while still having E2 to dash back in. Use this to bait enemies into overextending.",
      "R1 is a targeted dash. R2 is a skillshot execution dash. Use R1 to gap-close, shroud for safety, then R2 to finish."
    ],
    abilityBuffering: [
      "Buffer E2 during Q: Cast Q to proc passive, then immediately E2 to dash back to the shuriken target.",
      "Buffer Q during E2 dash for instant damage on arrival.",
      "You can cast Zhonya's during E2 travel and still complete the dash and deal damage at the destination.",
      "Buffer R2 during E2 for a rapid double-dash combo."
    ],
    advancedTips: [
      "Full combo: R1 -> AA (passive) -> Q -> AA (passive) -> W -> AA (passive) -> E1 -> E2 -> AA (passive) -> Q -> R2. Maximize passive procs between every ability.",
      "Shroud energy restore: W restores energy. Use it in extended fights to avoid running out of energy.",
      "E1 through minions hits the first target. Be aware of your E angle relative to the minion wave.",
      "R2 is an execute. It deals more damage to low HP targets. Do not use R2 at the start of a combo. Save it for the finish.",
      "Akali can dive towers with shroud. Tower cannot target you while invisible. Time shroud with tower aggro to reset tower shots.",
      "In teamfights, flank from fog of war. R1 -> burst -> W for safety -> R2 to finish or escape."
    ]
  },

  // ============================================================
  // LEBLANC
  // ============================================================
  LeBlanc: {
    animationCancels: [
      "W (Distortion) -> Q -> R (Mimic Q): Dash in with W, immediately Q -> R(Q) for instant burst. The entire combo takes less than a second.",
      "Q -> R (Mimic Q) -> W: Cast Q -> R(Q) for the proc, then W forward for the proc damage while closing distance.",
      "AA cancel with Q: Q is instant cast. Weave autos between abilities for extra damage, especially early lane trades.",
      "W -> return -> W (Mimic): Use W to dash in, return to pad, then R(W) for a second dash. Both pads remain for double escape routes."
    ],
    spacingTricks: [
      "W (Distortion) pad persists for 4 seconds. Always have a return pad available. Dash in for burst, then return to safety.",
      "Use W purely as a dodge. Dash to the side to dodge a skillshot, deal some damage, then return to pad.",
      "R (Mimic W) creates a second Distortion pad. With both W and R(W) pads active, LeBlanc has 3 possible positions, making her nearly impossible to catch.",
      "E (Ethereal Chains) has long range. Use it as you return to W pad to snare enemies while retreating."
    ],
    abilityBuffering: [
      "Buffer Q during W dash for instant burst on arrival.",
      "Buffer E during W dash to immediately tether the target on arrival.",
      "Buffer R during W for instant mimic ability after dashing in.",
      "Buffer Flash during W for extended dash range."
    ],
    advancedTips: [
      "Q -> W proc combo: Q marks the target, W dashes in and procs the mark for burst damage. Return to W pad immediately. This is the safest poke pattern.",
      "W -> Q -> R(Q) -> E: Full burst combo. Dash in, Q, Mimic Q (pops mark), then E for tether CC. Return to W if they survive.",
      "E (Ethereal Chains) tethers. If the target does not break the tether, they are rooted. Use W to stay in tether range if needed.",
      "Clone (passive): When LeBlanc drops below a health threshold, she becomes invisible and creates a clone. Use the stealth window to reposition or escape.",
      "In teamfights, look for picks on isolated targets. W -> Q -> R(Q) one-shots squishies. Do not dive into grouped enemies.",
      "Track your return pads. W pad and R(W) pad positions are critical for escape. Do not lose track of where they are."
    ]
  },

  // ============================================================
  // QIYANA
  // ============================================================
  Qiyana: {
    animationCancels: [
      "E -> Q: Dash with E, then immediately Q during the dash. Q fires from Qiyana's ending position, guaranteed to hit the E target.",
      "W -> Q: Grab an element with W, then immediately Q to throw it. The element enchantment applies instantly.",
      "R -> Flash: Cast R (Supreme Display of Talent), then Flash mid-animation to redirect the shockwave. Enemies rarely expect the Flash range extension.",
      "AA -> W -> AA: W resets auto-attack timer. Weave an auto before and after W for extra damage."
    ],
    spacingTricks: [
      "W (Terrashape) gives movement speed when near the selected element's terrain. Use grass element W near river/bushes for enhanced movespeed.",
      "Ice element (river) Q roots enemies. Use it for picks and peel.",
      "Grass element Q gives stealth in an AoE zone. Use it to set up ambushes or escape by creating a stealth field.",
      "Rock element (wall) Q deals bonus damage to low HP targets. Use it as an execute."
    ],
    abilityBuffering: [
      "Buffer Q during E dash for guaranteed Q hit at the end of the dash.",
      "Buffer W during E for instant element pickup mid-dash.",
      "Buffer Flash during R for extended/redirected shockwave.",
      "Buffer E during W for instant dash after element pickup."
    ],
    advancedTips: [
      "E -> Flash -> R combo: E to a target, Flash to redirect, then R to shove enemies into terrain. The R shockwave stuns and deals massive damage when enemies hit a wall.",
      "R (Supreme Display of Talent) explodes on terrain contact. Always aim R so that enemies are pushed into walls, river edge, or jungle terrain for the stun and bonus damage.",
      "Element cycling: W has a short cooldown. Constantly cycle elements based on the situation: Ice for CC, Grass for stealth/disengage, Rock for burst.",
      "In lane, short trade: E -> Q (rock element for damage) -> W to reset element -> Q (ice for root) -> walk away. Two Qs in rapid succession chunks most midlaners.",
      "Teamfight R: Flank from fog of war and R 3+ enemies into a wall. This is one of the highest-impact ultimates in the game.",
      "R also interacts with player-made terrain (Anivia wall, Jarvan ult, Trundle pillar). Coordinate with teammates for guaranteed R stuns."
    ]
  },

  // ============================================================
  // KINDRED
  // ============================================================
  Kindred: {
    animationCancels: [
      "Q (Dance of Arrows) during W (Wolf's Frenzy): Q cooldown is massively reduced inside W's zone. Spam Q for constant repositioning and DPS.",
      "Q -> AA: Q is an auto-attack reset. Always auto immediately after every Q hop for maximum DPS.",
      "E -> Q -> AA: Apply E (Mounting Dread) to a target, then Q -> AA -> AA to pop the 3-hit proc quickly.",
      "R (Lamb's Respite) can be cast instantly with no animation. Use it reactively to save yourself or allies."
    ],
    spacingTricks: [
      "Q dash inside W zone has a very low cooldown (about 2 seconds). Stay inside W zone during fights for constant repositioning.",
      "Use Q to hop over thin walls for escapes or chases.",
      "W zone controls the area. Place it in chokepoints to force enemies to fight in your zone of reduced Q cooldown.",
      "E slow helps kite. Apply E early in a fight to slow the enemy while you auto them down."
    ],
    abilityBuffering: [
      "Buffer AA during Q hop for instant auto on arrival.",
      "Buffer E during Q for instant Mounting Dread application after hopping.",
      "Buffer W during Q to place Wolf's Frenzy at the landing spot.",
      "Buffer R during any ability for instant Lamb's Respite activation."
    ],
    advancedTips: [
      "R (Lamb's Respite) prevents anything inside from dying (going below a health threshold) for a duration. Use it for tower dives, objective fights, or saving allies from burst.",
      "Mark collection: Prioritize collecting passive marks (both champion marks and jungle marks) for range and damage scaling. Plan jungle pathing around mark spawns.",
      "Kindred is a scaling marksman jungler. In early game, play for marks. In late game, your DPS rivals most ADCs.",
      "R can save enemies too. Be careful not to use it in a position where it protects the enemy team. You can Flash or Q out of your own R zone to execute enemies as the invulnerability ends.",
      "E executes based on missing health. Save E proc (3rd hit) for when the target is low.",
      "In teamfights, stay at range and use Q inside W for constant kiting. Kindred is a marksman first, do not dive in."
    ]
  },

  // ============================================================
  // KALISTA
  // ============================================================
  Kalista: {
    animationCancels: [
      "Martial Poise (passive): Every auto-attack causes Kalista to hop in the direction she is moving. Issue a move command immediately after each auto to hop in your desired direction.",
      "Q (Pierce) -> move command: Animation cancel Pierce wind-down with a movement command to hop immediately after the spear throw.",
      "E (Rend) -> AA: Rend has no cast time and can be woven between autos with no DPS loss.",
      "Attack speed directly improves hop frequency. Higher attack speed = more hops = more mobility."
    ],
    spacingTricks: [
      "Kalista cannot cancel auto-attacks once started. Kiting is built into her passive. Always issue move commands between autos to maintain mobility.",
      "Hop toward walls or allies to escape. Hop into enemies to chase. The direction is entirely determined by your move command.",
      "E (Rend) is Kalista's execute. Stack spears in a target, then E when they are low. E refunds mana and resets cooldown if it kills a target.",
      "Use the mana refund from E kills on minions to sustain in lane. E a minion with 1 spear to last-hit and get mana back."
    ],
    abilityBuffering: [
      "Buffer move commands during auto-attack wind-up to control hop direction precisely.",
      "Buffer E immediately after an auto lands to Rend before the enemy can heal or shield.",
      "Buffer Q during a hop for instant Pierce at the end of the dash.",
      "Buffer R (Fate's Call) to save your Oathsworn ally at any time."
    ],
    advancedTips: [
      "Kalista's hop distance scales with boot tier, not with raw movement speed. Upgrade boots early for better kiting.",
      "Rend (E) stacks: Each auto adds a spear. The more spears, the more Rend damage. In extended fights, stack as many spears as possible before Rending.",
      "Rend for objectives: Stack spears in Dragon/Baron, then Rend to secure. Rend damage can outsmite most junglers if you have enough spears stacked.",
      "R (Fate's Call) pulls your Oathsworn ally to you, then they can dash forward to knock up enemies. Coordinate with your support for engage or peel.",
      "Do NOT use Attack Move Click with Kalista. It checks for targets only when Kalista is not dashing, causing lost DPS. Instead, manually right-click targets.",
      "Against slows: Kalista's hop distance is reduced by slows. Build items or take runes that reduce slow effectiveness or cleanse."
    ]
  },

  // ============================================================
  // EZREAL
  // ============================================================
  Ezreal: {
    animationCancels: [
      "Q (Mystic Shot) -> AA: Q has a short cast animation. Weave autos between Qs for extra DPS.",
      "E (Arcane Shift) -> Q: Blink with E, then immediately Q from the new position. The blink + Q combo is nearly instant.",
      "AA -> Q cancel: Auto-attack, then immediately Q to cancel the auto wind-down animation.",
      "W (Essence Flux) -> E: W marks a target/area. E blink to it to proc the mark and refund mana."
    ],
    spacingTricks: [
      "E (Arcane Shift) is a blink, not a dash. It goes through terrain, CC, and cannot be interrupted. Always save E for escape unless you are certain the fight is won.",
      "Q from max range (1150 units) for safe poke. Each Q hit reduces all ability cooldowns by 1.5 seconds.",
      "W -> Q combo: W marks the target, Q procs the mark for bonus damage. This is Ezreal's primary poke combo.",
      "Use E aggressively only when enemy CC is down. E is your only escape tool."
    ],
    abilityBuffering: [
      "Buffer Q during E blink for instant Mystic Shot at the new position.",
      "Buffer W during E for instant mark application at the destination.",
      "Buffer R during E for a safe repositioned Trueshot Barrage.",
      "Buffer Flash during E for a double-reposition (rare, but useful to dodge key abilities)."
    ],
    advancedTips: [
      "Q reduces all cooldowns by 1.5s on hit. Landing Qs consistently means more Es, more Ws, and more Rs available. Q accuracy is the single most important Ezreal skill.",
      "W -> E combo: W an enemy, then E into them to proc the mark. The E itself fires a homing bolt, and the W proc refunds mana. Use this for aggressive all-ins.",
      "R (Trueshot Barrage) is global. Use it to snipe low-health targets, clear waves across the map, or open fights with AoE damage.",
      "Ezreal scales with ability haste. More ability haste = more Qs = more cooldown reduction = exponential scaling.",
      "In lane, poke with Q through the minion wave. Ezreal Q is blocked by the first target hit, so position at an angle where Q can hit the champion.",
      "Ezreal spikes hard with Sheen/Trinity Force/Sunderer. Time your first item completion with an aggressive play."
    ]
  },

  // ============================================================
  // LUCIAN
  // ============================================================
  Lucian: {
    animationCancels: [
      "Every ability triggers Lightslinger (passive double-shot). The optimal pattern is: Ability -> AA (double shot) -> Ability -> AA (double shot).",
      "E (Relentless Pursuit) -> AA: Dash resets auto timer and triggers passive. E -> AA (double) -> Q -> AA (double) -> W -> AA (double) for maximum burst.",
      "Q (Piercing Light) -> AA: Q animation is locked but the passive double-shot fires immediately after.",
      "Do NOT cancel Lightslinger's second shot. Each Lightslinger shot reduces E cooldown by 1s (2s against champions). Canceling the second shot loses massive DPS and mobility."
    ],
    spacingTricks: [
      "E (Relentless Pursuit) is a short dash. Use it to reposition between auto-attacks for kiting or chasing.",
      "Q has a fixed cast direction based on the target. Position so that Q passes through minions and hits the champion behind them.",
      "W marks enemies. Attacking marked enemies gives Lucian movement speed. Use W for kiting and chase scenarios.",
      "E -> Q is a quick engage pattern. Dash forward, Q through the target, then passive autos."
    ],
    abilityBuffering: [
      "Buffer Q during E dash for instant Piercing Light on arrival.",
      "Buffer W during E for instant Ardent Blaze at the new position.",
      "Buffer R during E for a repositioned Culling channel.",
      "You can Flash during R (The Culling) to redirect it without canceling the channel."
    ],
    advancedTips: [
      "Full burst combo: E -> AA -> Q -> AA -> W -> AA. Each ability triggers passive for 6 total autos in rapid succession.",
      "Vigilance (passive): When Lucian is healed/shielded or a nearby enemy is immobilized, his next 2 autos deal bonus magic damage. Pair with engage supports (Nami, Nautilus) for massive trade damage.",
      "E cooldown reduction from passive shots means Lucian can dash very frequently in extended fights. Prioritize landing both passive shots on champions.",
      "R (The Culling) scales with attack speed and fires in a line. Use it to finish off fleeing enemies or to DPS from safety when you cannot auto-attack safely.",
      "In lane, level 2 all-in with E -> AA -> Q -> AA is one of the strongest bot lane combos. Pair with an aggressive support.",
      "Lucian is strongest in the early-mid game. Push your lead aggressively and close games before late-game ADCs outscale you."
    ]
  },

  // ============================================================
  // JHIN
  // ============================================================
  Jhin: {
    animationCancels: [
      "4th shot -> Q: Jhin's 4th auto deals bonus damage and crits. Immediately Q after the 4th shot for burst, as Q bounces deal increased damage to low HP targets.",
      "W (Deadly Flourish) -> AA: W root into auto for guaranteed damage follow-up.",
      "E (Captive Audience) -> W: Place trap, W through it. If W roots the target, they walk into the trap.",
      "Auto -> reload cancel: After the 4th shot, Jhin reloads. Use abilities during reload to avoid wasting time."
    ],
    spacingTricks: [
      "Jhin has a fixed 4-shot pattern. Use the 4th shot movement speed burst to reposition after firing.",
      "W has enormous range (2500+ units). Use it from fog of war to root enemies hit by allies.",
      "R (Curtain Call) has massive range and 4 shots. The 4th R shot always crits and deals execute damage. Save it for the last shot.",
      "Place E traps in chokepoints, bushes, and behind you when retreating. They slow and reveal enemies."
    ],
    abilityBuffering: [
      "Buffer Q during auto-attack animation for instant grenade toss after the auto.",
      "Buffer W during trap activation: When a trap slows an enemy, they are marked for W root. Buffer W before the trap detonates.",
      "Buffer abilities during reload animation to use the downtime productively.",
      "Buffer Flash during W or R for repositioning without canceling the cast."
    ],
    advancedTips: [
      "4th shot positioning: Your 4th shot deals massive damage and gives movement speed. Use the move speed to reposition forward for aggression or backward for safety.",
      "W root condition: W roots if the target was recently hit by an ally, a trap, or Jhin's auto. In lane, auto the enemy, then W for a long-range root.",
      "R mindgame: In R (Curtain Call), you have 4 shots. Do not fire all 4 quickly. Vary timing to throw off enemy dodging patterns.",
      "Q bounce damage increases on each bounce. Q a low HP minion first so it bounces to the next target with increased damage.",
      "Jhin's crits give movement speed. Build crit items for both damage and mobility scaling.",
      "Traps provide vision. Use them like mini-wards in important locations (dragon pit entrance, tri-brush, etc.)."
    ]
  },

  // ============================================================
  // KAI'SA
  // ============================================================
  KaiSa: {
    animationCancels: [
      "E (Supercharger) -> AA: E gives attack speed and brief invisibility on evolution. Auto immediately after E buff for enhanced DPS.",
      "Q (Icathian Rain) -> AA: Q launches missiles while you can still auto-attack. Weave autos during Q missile barrage.",
      "W (Void Seeker) -> AA: W is a long-range poke. Follow up with autos if in range to stack passive.",
      "R (Killer Instinct) -> Q -> AA: Ult to reposition, immediately Q for burst, then auto to stack passive."
    ],
    spacingTricks: [
      "R (Killer Instinct) dashes to a location near an enemy marked by your passive. Use it to reposition to a safe angle, not just to engage.",
      "E (Supercharger) evolved gives invisibility. Use it to dodge key skillshots and reposition in teamfights.",
      "Q does more damage to isolated targets (all missiles hit one target). Look for moments when the target is away from minions.",
      "W evolved refunds 50% of its cooldown on champion hit. Use W for long-range poke and scouting."
    ],
    abilityBuffering: [
      "Buffer Q during R dash for instant burst on arrival.",
      "Buffer E during R for immediate attack speed steroid at the new position.",
      "Buffer W during E for a long-range poke while gaining movement speed.",
      "Buffer Flash during R for an even more precise repositioning."
    ],
    advancedTips: [
      "Passive (Second Skin): 5 stacks of plasma on an enemy causes a burst of missing health magic damage. Stack with autos, Q, and W. Coordinate with allies who apply CC for guaranteed stacking.",
      "Ability evolution thresholds: Q evolves at 100 bonus AD. W evolves at 100 bonus AP. E evolves at 100% bonus attack speed. Build paths determine which abilities evolve first.",
      "Isolated Q: If only one target is in Q range, all missiles hit that target. This deals massive damage. Look for isolated champions.",
      "R positioning: Use R to dash behind the enemy team for flanks, or use it to dash backward for safety. The dash destination is flexible as long as it is near a marked champion.",
      "W provides vision of the enemy hit. Use it to scout bushes and objectives safely.",
      "In teamfights, use E invisibility to dodge the initial burst of enemy abilities, then emerge and DPS from a safe angle."
    ]
  },

  // ============================================================
  // GRAVES
  // ============================================================
  Graves: {
    animationCancels: [
      "AA -> E (Quickdraw): Auto-attack, then immediately E to cancel auto wind-down and reload a shell simultaneously.",
      "E -> AA: E reloads a shell and dashes. Auto immediately after E for a fast double-shot pattern.",
      "Q (End of the Line) -> AA: Q has a cast time that does not interrupt autos. Weave Q between autos.",
      "W (Smoke Screen) -> AA: W is instant cast and can be used between autos with no DPS loss."
    ],
    spacingTricks: [
      "E (Quickdraw) provides armor stacking (up to 8 stacks). In extended fights, E to maintain stacks for significant tankiness.",
      "Graves autos push back from recoil and hit the first unit. Position to hit champions directly, not through minions.",
      "W (Smoke Screen) removes vision from enemies inside it. Place it on enemy ADC in teamfights to blind them.",
      "Auto -> E backward for safe poke in lane. The auto fires, then you immediately dash out of range."
    ],
    abilityBuffering: [
      "Buffer E during auto-attack animation for instant reload and dash after the shot.",
      "Buffer Q during E dash for burst damage at the new position.",
      "Buffer R during E for repositioned Collateral Damage.",
      "Buffer Flash during R for extended range execute."
    ],
    advancedTips: [
      "Graves has 2 shells and must reload. Track your ammo carefully. Do not engage with 0 shells.",
      "Q (End of the Line) detonates after hitting terrain or after a delay. Aim Q into walls for instant detonation and double damage.",
      "R (Collateral Damage) knocks Graves backward. Use R -> E forward to negate the knockback for aggressive plays.",
      "E stacks fall off one at a time. Keep auto-attacking and dashing to maintain maximum armor stacks in fights.",
      "Graves clears jungle extremely fast. Use auto -> E -> auto pattern to maintain tempo and healthy clears.",
      "In teamfights, play like a frontline marksman. E stacks give enough armor to tank for your team while dealing massive damage."
    ]
  },

  // ============================================================
  // EKKO
  // ============================================================
  Ekko: {
    animationCancels: [
      "E (Phase Dive) -> Q: Dash with E, throw Q during the dash. Q fires from the new position for surprise damage.",
      "E -> Passive proc (3rd hit): E's second hit (blink) counts as an auto. If the target already has 2 passive stacks, E blink procs the 3rd hit for burst + movement speed.",
      "Q -> E -> AA: Throw Q, dash into the Q return path, auto to proc passive all in one fluid motion.",
      "Hextech item -> E for instant burst on arrival."
    ],
    spacingTricks: [
      "Q (Timewinder) slows on the outward pass and damages again on return. Position so both passes hit the enemy.",
      "W (Parallel Convergence) is a delayed AoE stun + shield. Cast it from fog of war for surprise engages.",
      "E blink goes through thin walls. Use it for escapes and unexpected engages through terrain.",
      "R (Chronobreak) sends Ekko back to his position from 4 seconds ago. Track your hologram to know where R will take you."
    ],
    abilityBuffering: [
      "Buffer Q during E dash for instant Timewinder at the destination.",
      "Buffer W from fog of war, then E -> Flash into W zone for instant stun.",
      "Buffer R reactively when burst is incoming. R gives invulnerability during the dash back.",
      "Buffer Zhonya's into R: Zhonya's during a dangerous situation, then R out when Zhonya's ends."
    ],
    advancedTips: [
      "W -> E -> Flash combo: Place W from fog, dash in with E, Flash into the W zone. The stun and shield proc, and you E-auto for passive proc and massive burst.",
      "R does massive AoE damage at the starting location and heals Ekko. Use it offensively in teamfights when your hologram is in the middle of the enemy team.",
      "Passive (Z-Drive Resonance): 3 hits on the same target proc a burst of damage + movement speed. E blink counts as a hit. Q -> E -> AA procs passive in one combo.",
      "Track your R hologram at all times. It shows where you were 4 seconds ago. Smart enemies will try to stand on it to damage you when you R.",
      "W cast has a long delay (1.5s). Use it predictively, not reactively. Cast W where the enemy will be, not where they are.",
      "Ekko is slippery. In teamfights, dive the backline with E, burst with Q -> passive, then R back to safety."
    ]
  },

  // ============================================================
  // FIZZ
  // ============================================================
  Fizz: {
    animationCancels: [
      "Q (Urchin Strike) -> W: Q dashes through the target. Press W before or during Q to empower the dash with W damage.",
      "Q -> AA: After Q dash, immediately auto for extra damage and W passive application.",
      "E1 -> E2: E (Playful/Trickster) has two parts. E1 hops onto the trident (untargetable). E2 jumps off to a target location. Using only E1 deals AoE damage at the landing spot.",
      "AA -> Q: Auto-attack, then immediately Q to cancel auto wind-down and dash through the target."
    ],
    spacingTricks: [
      "E (Playful/Trickster) makes Fizz untargetable. Use it to dodge key abilities (e.g., Karthus R, Zed R mark, ignite ticks).",
      "E1 without E2: Landing on the trident deals AoE damage in a larger area and slows. Sometimes not recasting E2 is better for damage and slow.",
      "Use Q to dash through the enemy and then walk away. The dash puts you behind them, giving you a brief repositioning advantage.",
      "W (Seastone Trident) has a passive bleed and active empowered auto. Use W -> AA -> Q for short trades."
    ],
    abilityBuffering: [
      "Buffer W during Q dash for instant empowered damage when Q hits.",
      "Buffer R before E for a surprise ult that is hard to dodge while Fizz is airborne.",
      "Buffer Flash during E for extended repositioning while untargetable.",
      "Buffer Ignite during Q dash for extra kill pressure."
    ],
    advancedTips: [
      "Full combo: R (fish) -> Q -> W -> AA -> E (dodge/finish). Land R first, then all-in with Q+W. Use E for the finishing blow or to escape.",
      "R fish size scales with distance thrown. A max-range R creates a larger shark that knocks up longer. Short-range R is a smaller shark.",
      "E is your only escape. If you use it offensively, you are committed. Only E forward if you are sure of the kill.",
      "In lane, level 3 all-in: Q -> W (empowered) -> AA -> E to escape before the enemy can retaliate. Extremely strong short trade.",
      "Fizz can dodge tower shots with E (untargetable). Time E with tower projectile mid-air for safe dives.",
      "R can be used as zoning even if it does not hit. The shark zone is large and enemies must respect it."
    ]
  },

  // ============================================================
  // SYNDRA
  // ============================================================
  Syndra: {
    animationCancels: [
      "Q -> E (Scatter the Weak): Cast Q, then immediately E. The Q sphere spawns and gets pushed by E almost simultaneously, creating a fast long-range stun.",
      "Q -> W: Throw Q, immediately W to pick up the sphere. This is used for repositioning spheres for multi-sphere ults.",
      "W -> Q -> E: W a sphere/minion, throw Q, E to stun with the Q sphere while the W sphere is still in the air for double zone coverage.",
      "AA weaving: Syndra can auto-attack between Q and E casts with no DPS loss. AA -> Q -> AA -> E."
    ],
    spacingTricks: [
      "Q has 800 range. Poke with Q from max range repeatedly in lane. It is low cost and low cooldown.",
      "E (Scatter the Weak) pushes all spheres in a cone. Position spheres to maximize the stun area.",
      "W (Force of Will) can pick up jungle camps, cannon minions, and spheres. Throw a minion at the enemy for a slow + guaranteed Q follow-up.",
      "Keep 3+ spheres on the field before ulting. R damage scales with the number of spheres available."
    ],
    abilityBuffering: [
      "Buffer E immediately after Q for the instant Q-E stun combo. This is Syndra's most important mechanic.",
      "Buffer W during Q for instant sphere pickup.",
      "Buffer R after E stun for guaranteed full-sphere ultimate on the stunned target.",
      "Buffer Flash during E for extended range stun."
    ],
    advancedTips: [
      "Q -> E stun: This is your most important combo. Q places a sphere, E pushes it. The sphere becomes a long-range stun projectile. Practice this until it is instant.",
      "Multi-sphere R: Before R, place as many spheres as possible (Q spam, W a sphere to reposition). Each sphere adds damage to R. 6-7 sphere R is devastating.",
      "E pushes ALL spheres on the field. Place multiple Qs, then E to create a wide stun zone in teamfights.",
      "W slow sets up Q and E. W -> Q on the slowed target -> E for the stun is a reliable CC chain.",
      "Syndra excels at zone control. In teamfights, place spheres in the area the enemy wants to walk through. E to push them for multi-target stuns.",
      "Passive (Transcendent) upgrades abilities at max rank. Prioritize Q max for enhanced sphere damage."
    ]
  },

  // ============================================================
  // ORIANNA
  // ============================================================
  Orianna: {
    animationCancels: [
      "Q -> W: Move ball with Q, then immediately W for AoE damage + slow at the ball's destination. The W fires the instant the ball arrives.",
      "Q -> R: Move ball with Q, then R for instant Shockwave. The R fires when the ball reaches the Q destination.",
      "E -> R: Shield an ally diving into the enemy team, then R on the ally's position for a surprise Shockwave.",
      "AA weaving: Orianna's passive makes autos deal increasing damage on the same target. Weave autos in lane between Q casts."
    ],
    spacingTricks: [
      "The ball is Orianna's primary threat zone. Enemies must respect wherever the ball is positioned.",
      "E (Command: Protect) places the ball on an ally and gives them a shield + armor/MR. Use it on engaging allies (Malphite, Jarvan) for surprise R combos.",
      "Q has no cast time on Orianna herself. She can move while the ball travels. Use this to kite while poking.",
      "W provides a movement speed zone for allies and a slow zone for enemies. Use it for engage or disengage depending on positioning."
    ],
    abilityBuffering: [
      "Buffer W during Q travel: Press W while the ball is moving from Q. W fires the instant the ball arrives.",
      "Buffer R during Q travel: Press R while ball is mid-Q for instant Shockwave on arrival.",
      "Buffer E on an engaging ally, then buffer R for a follow-up Shockwave at the ally's position.",
      "Buffer Flash to reposition for a better Q angle."
    ],
    advancedTips: [
      "Ball delivery: E an ally like Malphite, Jarvan, or Nocturne. When they dive in, R at the perfect moment to Shockwave the enemy team. This is one of the most powerful combos in competitive play.",
      "Q -> W -> AA is Orianna's basic trade in lane. Q to the enemy, W for slow + damage, auto with passive for extra damage.",
      "Track the ball position at all times. Orianna without ball awareness is significantly weaker. Keep the ball in a threatening position.",
      "R (Shockwave) pulls enemies to the ball's center. Use it on clumped enemies for devastating AoE. A good Shockwave can win teamfights single-handedly.",
      "Orianna's passive (Clockwork Windup): Autos deal bonus magic damage, increasing with consecutive hits on the same target. Use this for last-hitting and early trades.",
      "In late game, use Q to zone objectives and E to protect your carry. R should be saved for multi-person Shockwaves, not wasted on a single target."
    ]
  },

  // ============================================================
  // VIKTOR
  // ============================================================
  Viktor: {
    animationCancels: [
      "Q (Siphon Power) -> AA: Q empowers your next auto with bonus damage and a shield. Auto immediately after Q for burst.",
      "Q -> E: Q for shield, then immediately E (Death Ray) for burst combo. The Q auto can be woven in after.",
      "E while moving: Viktor can cast E (Death Ray) while moving. Use this to kite and poke simultaneously.",
      "Q -> Flash -> AA: Q, Flash forward, then empowered auto for surprise burst from extended range."
    ],
    spacingTricks: [
      "E (Death Ray) is a line skillshot that Viktor draws. The direction and placement are fully customizable. Use it to cut off escape paths.",
      "W (Gravity Well) is a slow zone that stuns after a delay. Place it where enemies will walk, not where they currently are.",
      "Upgraded E (Aftershock) fires a second explosion along the line. Zone enemies with the initial laser and Aftershock follow-up.",
      "Q movement speed burst helps reposition in fights. Use Q on cooldown partly for the speed boost."
    ],
    abilityBuffering: [
      "Buffer E during Q animation for instant Death Ray after Q damage.",
      "Buffer W during E for zone control follow-up.",
      "Buffer R during Q -> E for full burst with no gaps.",
      "Buffer Flash during E for redirected Death Ray angle."
    ],
    advancedTips: [
      "Hex Core upgrades: Prioritize E upgrade first for waveclear and poke (Aftershock). Q upgrade second for the shield and move speed. W upgrade last.",
      "E placement: Draw E through the wave AND the enemy champion for simultaneous CS and poke. Upgraded E Aftershock will hit both.",
      "R (Chaos Storm) follows enemies and deals ticking damage. Place it on clumped enemies and use its movement to zone.",
      "Q -> AA is Viktor's primary trade in lane. Q for shield, auto for empowered damage, walk away with Q movement speed. Very safe trade pattern.",
      "In teamfights, open with E for AoE poke, then R for sustained damage. Use W to zone divers away from you.",
      "Viktor scales extremely well with Hex Core upgrades and items. Farm efficiently to hit power spikes."
    ]
  },

  // ============================================================
  // GANGPLANK
  // ============================================================
  Gangplank: {
    animationCancels: [
      "Barrel Q: Place barrel (E), then Q (Parrrley) the barrel. The barrel explosion applies Parrrley damage and effects in an AoE, ignoring a portion of armor.",
      "One-Part combo: Place barrel near enemy, auto-attack it (melee range) to detonate. Basic but fast.",
      "Phantom Barrel (E -> Q -> E): Place one barrel, Q it, and place a second connected barrel while the Q bullet is traveling. The second barrel detonates before enemies can react.",
      "Triple Barrel: Place 2 barrels, Q the first, place a 3rd barrel as the chain detonates. This extends barrel range dramatically."
    ],
    spacingTricks: [
      "Barrels give vision in a small area. Place them in bushes for scouting.",
      "Q (Parrrley) is ranged poke from 625 range. Use it for safe farming and Grasp procs in lane.",
      "W (Remove Scurvy) cleanses all CC and heals. Save it for critical CC abilities rather than using it for sustain.",
      "R (Cannon Barrage) is global. Use it to assist other lanes, slow enemies, or zone objectives."
    ],
    abilityBuffering: [
      "Buffer E during Q animation: While Q bullet is traveling to a barrel, place a second connected barrel. The chain detonation is instant.",
      "Buffer Flash during Q for extended range barrel combos: Q barrel -> Flash -> E to extend barrel chain from a new position.",
      "Buffer E during barrel chain detonation for extended combos.",
      "Buffer W during any combo for instant cleanse if CC threatens."
    ],
    advancedTips: [
      "Phantom Barrel (E-Q-E) is the most important GP mechanic. The Q bullet has travel time. Place the second barrel within the time the bullet reaches the first barrel. This takes practice.",
      "Flash Triple Barrel: Place 2 barrels, Q the first, Flash immediately, place 3rd barrel from Flash location. This is the hardest GP combo.",
      "Barrel HP decays over time. Track barrel health ticks to detonate at exactly 1 HP. Enemies can auto the barrel to defuse it if it reaches 1 HP before you detonate.",
      "Barrel armor penetration ignores 40% armor. Combined with crit and lethality, barrel combos deal massive damage even to tanks.",
      "W timing: Do NOT W early. Wait until the critical CC hits (e.g., Malzahar R, Leona Q) then W to cleanse. Wasting W means you are vulnerable.",
      "R upgrade paths: Death's Daughter (center extra damage), Raise Morale (speed zone for allies), Fire at Will (extra barrage waves). Choose based on game state."
    ]
  },

  // ============================================================
  // JAYCE
  // ============================================================
  Jayce: {
    animationCancels: [
      "Ranged Q -> E (Shock Blast + Acceleration Gate): Fire Q, then immediately place E gate in front of the Q. The blast passes through the gate for increased speed, range, and damage.",
      "R (Transform) -> AA: Switching forms resets auto-attack timer. Weave form swaps between autos for extra damage.",
      "Hypercharge (Ranged W) persists through form swap. Activate W in cannon form, then switch to hammer form for rapid melee autos.",
      "Hammer Q -> E: Q (To The Skies) leaps to the target, then E (Thundering Blow) knocks them back. The combo is nearly instant."
    ],
    spacingTricks: [
      "Ranged Q through E gate has massive range (1600+ units). Use it from fog of war for long-range poke.",
      "Hammer E (Thundering Blow) knocks enemies back. Use it to disengage melee champions or knock enemies into your team.",
      "Acceleration Gate gives movement speed to allies passing through it. Place it for team rotations and engages.",
      "Use Hammer form Q to gap-close, then E to knock the target toward your tower."
    ],
    abilityBuffering: [
      "Buffer E during Q cast in ranged form for instant gate-blast combo.",
      "Buffer R during Hammer Q for instant form swap at the landing.",
      "Buffer Flash during Hammer Q for extended gap-close range.",
      "Buffer Ranged W before swapping to Hammer for empowered melee autos."
    ],
    advancedTips: [
      "Full poke combo: Ranged Q -> E (blast through gate) -> W (Hypercharge 3 fast autos) -> R to Hammer -> Q (leap) -> AA -> E (knock back).",
      "Hammer form passive: Hammer autos restore mana. Swap to Hammer to last-hit when low on mana.",
      "Gate-blast is Jayce's primary damage tool. A full-charged Q through gate deals massive damage to squishies. Land these consistently in siege scenarios.",
      "In lane, short trade: Ranged Q-E poke from distance. If the enemy is low, R -> Hammer Q -> W -> AA -> E for the kill.",
      "Jayce is strong early and mid game. Press your lead with aggressive roams and tower dives. He falls off in late-game teamfights.",
      "Hammer E deals percentage max HP damage. Use it against tanks for burst that scales with their health."
    ]
  },

  // ============================================================
  // GNAR
  // ============================================================
  Gnar: {
    animationCancels: [
      "Mini Gnar: AA -> Q (Boomerang Throw) -> AA for quick poke combo.",
      "Mega Gnar: W (Wallop) -> Q (Boulder Toss) -> AA for CC chain.",
      "Mega Gnar: R -> Flash: Cast R (GNAR!), then Flash to reposition. Enemies are pushed in the direction of the ult.",
      "Transform combo: Build rage to near-full, engage with Mini E (Hop) to close distance, transform mid-air into Mega Gnar for instant CC access."
    ],
    spacingTricks: [
      "Mini Gnar: Use Q boomerang to slow and poke from max range. Catch the boomerang to reduce Q cooldown.",
      "Mini Gnar: E (Hop) bounces off units. Hop on a minion toward the enemy for extra range, or hop on the enemy to bounce away.",
      "Mega Gnar: Use W -> R for guaranteed ult positioning (W stun prevents dodging).",
      "Track rage bar carefully. Transform at the right time in teamfights. Do not transform too early (before the fight) or too late (after the fight)."
    ],
    abilityBuffering: [
      "Buffer R during E in Mega form for instant GNAR! on landing.",
      "Buffer W during E in Mega form for instant Wallop stun on landing.",
      "Buffer Flash during R for extended GNAR! range and repositioning.",
      "Buffer Q during W stun for guaranteed Boulder Toss hit."
    ],
    advancedTips: [
      "Rage management: The best Gnar players fight only when Mega form is about to activate. Build rage in lane with autos and abilities, then engage at 90+ rage.",
      "R into terrain: GNAR! deals bonus damage and stuns longer when enemies are pushed into terrain. Always R toward a wall.",
      "Mini Gnar -> E (hop) -> transform mid-air -> Mega W -> R: The surprise transformation mid-hop catches enemies off guard with instant CC chain.",
      "In teamfights, flank with Mega Gnar for a multi-person R into a wall. This is one of the most impactful engage ultimates in the game.",
      "Mini Gnar is a kiting champion. Do not all-in in Mini form. Poke, kite, and wait for Mega form for all-ins.",
      "Boomerang catch reduces Q cooldown significantly. Always try to catch the returning boomerang for more poke pressure."
    ]
  },

  // ============================================================
  // RENEKTON
  // ============================================================
  Renekton: {
    animationCancels: [
      "W -> Q: W (Ruthless Predator) stun, then immediately Q (Cull the Meek) to cancel W's animation. The W damage hits, then Q fires during W wind-down.",
      "AA -> W -> Q: Auto, then W (resets auto timer), then Q to cancel W animation. Maximum single-target burst.",
      "E -> W -> Q -> E: Dash in, W stun, Q damage, dash out. This is Renekton's bread-and-butter trade combo.",
      "W -> Tiamat/Hydra: Tiamat active cancels W animation for even faster burst. W -> Tiamat -> Q is the fastest possible combo.",
      "R (Dominus) animation can be canceled with E or Q. Activate R mid-combo for no lost time."
    ],
    spacingTricks: [
      "E (Slice and Dice) is a double dash. E in for the trade, E out for the escape. Do not waste both dashes going in.",
      "Empowered W (50+ fury) deals extra damage and stuns longer. Manage fury for empowered W on key trades.",
      "Empowered Q heals significantly more. When low HP, empowered Q through the minion wave for massive sustain.",
      "Use E through minions to build fury, then W -> Q the champion with empowered abilities."
    ],
    abilityBuffering: [
      "Buffer W during E dash for instant stun on arrival.",
      "Buffer Q during W animation for the fastest possible W -> Q cancel.",
      "Buffer E during Q for instant dash out after Q damage.",
      "Buffer R during E for combo: E -> R (transform) -> W -> Q -> E (out)."
    ],
    advancedTips: [
      "Full combo: E (in) -> AA -> W -> Tiamat -> Q -> AA -> E (out). This is the maximum damage short trade.",
      "Fury management: Build fury on minions with Q and autos. Engage with 50+ fury for empowered W stun (1.5s stun + more damage).",
      "Empowered ability choice: 50 fury W for kill pressure (longer stun + damage). 50 fury Q for sustain (massive heal). Choose based on the situation.",
      "R (Dominus) gives bonus HP, fury generation, and AoE damage. Use it early in all-ins for the health and fury, not as a last resort.",
      "Renekton is strongest levels 3-9. Press your lead hard and punish weak laners. He falls off in late game relative to other fighters.",
      "Against tanks, short trade with E -> W -> Q -> E out. Against squishies, all-in with empowered W for the kill."
    ]
  },

  // ============================================================
  // SETT
  // ============================================================
  Sett: {
    animationCancels: [
      "AA -> E (Facebreaker): Auto, then E to pull enemies in and stun. The auto cancels into E for quick burst.",
      "E -> W (Haymaker): Pull enemies in with E (stun), then W for guaranteed true damage center hit.",
      "AA -> Q -> AA: Q resets auto-attack timer and empowers the next 2 autos. AA -> Q -> AA -> AA for maximum damage.",
      "R (The Show Stopper) -> E -> W: Ult a target into the enemy team, E to pull them in, W for AoE true damage."
    ],
    spacingTricks: [
      "W (Haymaker) has a sweet spot in the center that deals true damage. Position so the center hits the priority target.",
      "E pulls enemies on both sides toward Sett. If enemies are on both sides of you, E stuns them. Position in the middle of two enemies for the stun.",
      "R deals damage based on the target's max HP. Ult the tankiest enemy into the enemy backline for massive AoE damage.",
      "Q gives movement speed toward enemies. Use it to chase down fleeing targets."
    ],
    abilityBuffering: [
      "Buffer E during Q movement speed for instant pull when in range.",
      "Buffer W during E stun for guaranteed Haymaker hit.",
      "Buffer R -> Flash: Ult a target, then Flash mid-air to redirect where you slam them.",
      "Buffer Flash during R for extended range suppression engage."
    ],
    advancedTips: [
      "R -> Flash: Press R on a target, then Flash mid-ult to redirect. This lets you grab a frontliner and slam them into the backline from unexpected angles.",
      "W timing: Sett's W shields based on Grit (stored damage taken). Let enemies damage you first, then W for a massive shield and true damage nuke.",
      "E double-pull stun: Position between two enemies so E pulls both sides and stuns. This is critical for teamfight CC.",
      "Build HP items to increase R damage (which scales with the grabbed target's max health). Ult tanks into carries.",
      "In lane, short trade: AA -> Q -> AA -> AA (empowered Q autos) -> E if they fight back -> W when you have grit.",
      "Sett excels at front-to-back teamfights. Grab frontliners with R, E to pull enemies together, W for true damage zone."
    ]
  },

  // ============================================================
  // GRAGAS
  // ============================================================
  Gragas: {
    animationCancels: [
      "E (Body Slam) -> Q: Dash with E, throw Q during the dash for combo damage on arrival.",
      "E -> Flash: E dash can be redirected with Flash mid-dash for extended range stun.",
      "E -> R (Explosive Cask): E stun into R for guaranteed ult hit. R knocks enemies in the direction you choose.",
      "W (Drunken Rage) -> AA: W empowers next auto. Can be activated during any other ability for no lost time."
    ],
    spacingTricks: [
      "Q (Barrel Roll) can be charged by leaving it on the ground (up to 2 seconds for max damage). Use it for zone control.",
      "E through thin walls for surprise flanks and escapes.",
      "R (Explosive Cask) displacement direction is based on the barrel's center. Throw R behind the enemy to knock them toward your team.",
      "W gives damage reduction during the channel. Use W before taking burst damage for survivability."
    ],
    abilityBuffering: [
      "Buffer Flash during E for instant redirect of Body Slam.",
      "Buffer Q during E dash for instant barrel at the E landing spot.",
      "Buffer R during E for instant Explosive Cask after stun.",
      "Buffer W at any point during a combo as it has no interrupting cast time."
    ],
    advancedTips: [
      "E -> Flash -> R combo: E toward enemies, Flash to extend range and stun, then R to knock enemies into your team. This is one of the best engage combos in the game.",
      "Insec with R: R the enemy carry into your team. Position R so the barrel center is behind the target for the correct knockback direction.",
      "Q zone control: Leave Q on the ground at objectives. Enemies must respect the zone or take massive damage. Detonate with Q recast.",
      "Full AP Gragas burst: E -> Q -> R -> detonate Q. Lands all damage simultaneously for one-shot potential on squishies.",
      "W reduces incoming damage significantly. Use it proactively before engaging, not reactively after taking damage.",
      "Gragas can be played as tank, AP burst, or bruiser. Adapt builds based on team comp needs."
    ]
  },

  // ============================================================
  // ELISE
  // ============================================================
  Elise: {
    animationCancels: [
      "Human Q -> W -> E: Cast Q (Neurotoxin), W (Volatile Spiderling), and E (Cocoon) in rapid succession. All three are near-instant.",
      "R (Spider Form) resets auto-attack timer. Human auto -> R -> Spider auto for quick burst.",
      "Spider Q (Venomous Bite) is an auto-reset. Spider AA -> Q for burst execute damage.",
      "Human E (Cocoon) -> Flash: Flash during Cocoon cast to redirect the stun projectile."
    ],
    spacingTricks: [
      "Spider E (Rappel) makes Elise untargetable and lets her descend on enemies or jungle camps. Use it to dodge abilities.",
      "Rappel can target wards, jungle camps, and minions. Use it to escape by Rappeling to a camp over a wall.",
      "Human form is for poke and CC. Spider form is for burst and mobility. Swap forms based on the situation.",
      "Human W (Volatile Spiderling) follows the nearest enemy. Use it as a scouting tool in bushes."
    ],
    abilityBuffering: [
      "Buffer R (form swap) during Human combo to instantly switch to Spider form after landing all Human abilities.",
      "Buffer Spider Q during R swap for instant execute on arrival.",
      "Buffer Flash during Human E for redirected Cocoon.",
      "Buffer Smite during Spider Q for burst objective secures."
    ],
    advancedTips: [
      "Full combo: Human E (Cocoon stun) -> Human Q -> Human W -> R (Spider) -> Spider Q -> Spider W -> Auto-attacks. Maximize damage from both forms.",
      "Spider W (Skittering Frenzy) gives attack speed to Elise and her spiderlings. Use it during tower pushes and objective fights.",
      "Rappel (Spider E) can be used as a gap-closer by targeting enemies at long range, or as an escape by pressing E with no target (goes straight up).",
      "Human Q deals current HP% damage. Spider Q deals missing HP% damage. Use Human form first (poke) then Spider form (execute).",
      "Elise is strongest in the early game. Gank frequently and snowball lanes before she falls off in scaling.",
      "Spiderlings tank jungle camps and tower shots. Use them to dive effectively."
    ]
  },

  // ============================================================
  // KHA'ZIX
  // ============================================================
  KhaZix: {
    animationCancels: [
      "AA -> Q (Taste Their Fear): Q is an auto-reset. AA -> Q for burst on isolated targets.",
      "W (Void Spike) -> AA: W has a short cast time. Auto immediately after W for extra DPS.",
      "E (Leap) -> W: Cast W mid-leap for AoE slow/heal on landing.",
      "E -> Tiamat/Hydra: Use Tiamat mid-leap for AoE burst on arrival."
    ],
    spacingTricks: [
      "Isolation mechanic: Q deals massively increased damage to isolated targets (no allies nearby). Look for isolated champions in side lanes and jungle.",
      "R (Void Assault) gives invisibility. Use it to reposition in fights and proc passive (Unseen Threat) multiple times.",
      "E (Leap) resets on champion kills and assists (when evolved). Chain leaps through the enemy team.",
      "Use W slow to kite enemies or chase them down. Evolved W fires 3 spikes in a cone for wider coverage."
    ],
    abilityBuffering: [
      "Buffer W during E leap for instant spike volley on landing.",
      "Buffer Tiamat during E for AoE burst combo.",
      "Buffer Q during E for instant execution on landing.",
      "Buffer R during E for instant stealth after leap."
    ],
    advancedTips: [
      "Evolution priority: Q for damage (most common first evolution), E for resets (teamfighting), W for utility, R for survivability. Standard: Q -> E -> W or Q -> E -> R.",
      "Isolation is everything. Do not fight in minion waves or grouped enemies. Look for picks in the jungle and side lanes.",
      "Evolved E resets on kills/assists and gains range. In teamfights, wait for an ally to damage a target, E in for the kill, and chain leaps.",
      "R gives 2 charges of invisibility (3 with R evolution). Use the first for engaging, the second for repositioning or escaping.",
      "Passive (Unseen Threat): Autos deal bonus damage and slow when Kha'Zix is unseen. R resets this passive. Use R -> auto -> R -> auto for double passive procs.",
      "In jungle, kite camps to maintain isolation on the large monster for faster clear with Q."
    ]
  },

  // ============================================================
  // RENGAR
  // ============================================================
  Rengar: {
    animationCancels: [
      "Leap -> Q: Activate Q before leaping from a bush. The empowered auto fires during the leap for instant damage on landing.",
      "Leap -> E: Cast E (Bola Strike) mid-leap. The bola fires from Rengar's mid-air position for a hard-to-dodge skillshot.",
      "Leap -> W: Cast W (Battle Roar) mid-leap for instant AoE damage and heal on landing.",
      "Leap -> Q -> Tiamat -> E -> W: Full one-shot combo in a single leap. Press Q before jumping, then Tiamat -> E -> W mid-air."
    ],
    spacingTricks: [
      "Bush control: Rengar can leap from any bush. Control vision and position near bushes for constant leap threats.",
      "R (Thrill of the Hunt) grants camouflage and reveals the nearest enemy champion. Use it to set up assassinations from fog of war.",
      "Use R leap range for engages. The R leap is longer than normal bush leaps.",
      "W (Battle Roar) at max ferocity cleanses all CC. Save empowered W for critical CC abilities."
    ],
    abilityBuffering: [
      "Buffer Q before leaping for instant empowered auto on landing.",
      "Buffer E mid-leap for guaranteed bola from an unexpected angle.",
      "Buffer W mid-leap for instant AoE damage on arrival.",
      "Buffer Tiamat/Hydra mid-leap for AoE burst on landing."
    ],
    advancedTips: [
      "Triple Q combo: Build 3 ferocity stacks, use Empowered Q before leaping, land with normal Q, then rapidly build to 4 ferocity again for a second Empowered Q. This requires: Emp Q -> Leap + E + W + Tiamat -> Q -> Emp Q.",
      "Ferocity management: Always have 4 ferocity stacks before ganking or assassinating. This gives you an empowered ability immediately.",
      "Empowered ability choices: Emp Q for damage (assassination), Emp W for survivability (CC cleanse + heal), Emp E for guaranteed root (catching fleeing targets).",
      "In teamfights, use R to flank. Target isolated squishies. Do not leap into grouped enemies without a plan to escape.",
      "Bush hop chains: In lane, leap from one bush, fight, then retreat to another bush for another leap. Top lane bushes allow constant pressure.",
      "One-shot combo from R: R (camouflage) -> Emp Q -> Leap + E + W + Tiamat mid-air. The target dies before landing. Practice until this is muscle memory."
    ]
  },

  // ============================================================
  // SYLAS
  // ============================================================
  Sylas: {
    animationCancels: [
      "E1 -> E2: E1 (Abscond) dashes backward. E2 (Abduct) dashes forward with a stun. Chain them for quick repositioning.",
      "AA -> Q -> AA: Q resets between auto-attacks. Sylas passive (Petricite Burst) empowers autos after ability casts for AoE damage.",
      "E2 -> W: Dash in with E2 stun, then immediately W (Kingslayer) for burst + heal.",
      "Passive weaving: After every ability cast, Sylas's next auto deals AoE bonus damage. The optimal pattern is Ability -> AA -> Ability -> AA."
    ],
    spacingTricks: [
      "E1 (backward dash) can be used over walls for escapes. E2 (forward dash) can also go over walls for engages.",
      "W (Kingslayer) heals more when Sylas is low HP. Use it when at low health for maximum sustain.",
      "R (Hijack) steals the enemy's ultimate. Always assess which enemy ult is most valuable and steal it.",
      "Passive AoE autos help with waveclear. Weave abilities with autos to clear waves efficiently."
    ],
    abilityBuffering: [
      "Buffer W during E2 dash for instant Kingslayer on arrival.",
      "Buffer Q during E2 for instant AoE at the stun location.",
      "Buffer Flash during E2 for extended range stun engage.",
      "Buffer the stolen R during E2 for an aggressive combo with the stolen ult."
    ],
    advancedTips: [
      "Full combo: E1 (back dash) -> E2 (forward stun) -> AA (passive) -> W -> AA (passive) -> Q -> AA (passive). Weave passive between every ability.",
      "R priority: Steal the most impactful ult available. Malphite R, Amumu R, Orianna R, etc. on Sylas can be game-winning.",
      "W heal scaling: W heals for a base amount + increased healing below 40% HP. Bait enemies by fighting at low HP and W for a huge heal that turns the fight.",
      "Sylas is an AP bruiser. He wants extended trades where he can proc passive between abilities and heal with W. Do not play him like an assassin.",
      "Track enemy ult cooldowns. Steal ults at critical moments (e.g., steal Malphite R before a teamfight, not after he already used it).",
      "E2 is a dash that can be interrupted by CC. Do not E2 into enemies with easy CC unless their CC is on cooldown."
    ]
  },

  // ============================================================
  // VIEGO
  // ============================================================
  Viego: {
    animationCancels: [
      "Q (Blade of the Ruined King) -> AA: Q stab resets auto-attack timer. AA -> Q -> AA for burst.",
      "W (Spectral Maw) -> Flash: Charge W, then Flash to redirect the dash direction.",
      "E (Harrowed Path) -> W: Use E to gain camouflage and attack speed, then W for a surprise engage from fog.",
      "Possession -> abilities: When possessing an enemy champion, all their abilities are available with no wind-up. Weave abilities rapidly."
    ],
    spacingTricks: [
      "E (Harrowed Path) creates a zone of camouflage and gives attack speed and movement speed. Use it in terrain-heavy areas for maximum coverage.",
      "Possess slain enemies to become untargetable briefly. Use it to dodge lethal abilities or reposition.",
      "R (Heartbreaker) blinks to a target and executes. Use it as a finisher, not an engage tool.",
      "Q passive: Autos deal bonus current HP damage. Viego excels at extended trades with his sustain."
    ],
    abilityBuffering: [
      "Buffer Flash during W charge for redirected dash engage.",
      "Buffer R after possession: After possessing and using the enemy's kit, R back to your original form for the execute.",
      "Buffer E before engaging for the attack speed and camouflage advantage.",
      "Buffer Q during any other ability animation for consistent DPS."
    ],
    advancedTips: [
      "Possession resets R cooldown. Kill an enemy, possess them, use their abilities, then R (Heartbreaker) to execute another target. This chains kills in teamfights.",
      "E placement: Cast E through walls to create camouflage zones that enemies cannot see into. Use this for flanking and objective control.",
      "W is a slow-charging dash that stuns. The longer you charge, the further you dash and the longer the stun. However, enemies can see the charge. Use fog of war to charge W undetected.",
      "In teamfights, focus on getting the first kill to possess. The possession gives free abilities and resets R for chain killing.",
      "Viego heals for a percentage of the target's max HP on possession. Possessing a tank heals more than possessing a squishy.",
      "R (Heartbreaker) deals more damage to low HP targets. Always use R as a finisher to maximize execute damage."
    ]
  },

  // ============================================================
  // SIMPLE CHAMPIONS (Basic tips)
  // ============================================================
  Garen: {
    animationCancels: [
      "Q (Decisive Strike) is an auto-attack reset. AA -> Q for quick burst damage.",
      "E (Judgment) can be activated immediately after Q to silence + spin in one fluid motion."
    ],
    spacingTricks: [
      "Q gives movement speed. Use it to close distance or escape.",
      "W (Courage) gives a brief damage reduction shield. Time it for incoming burst."
    ],
    abilityBuffering: [
      "Buffer E during Q to spin immediately after silencing the target.",
      "Buffer R after Q silence to prevent enemy Flash during R cast."
    ],
    advancedTips: [
      "R (Demacian Justice) is an execute. The lower the target, the more damage. Use it as a finisher, not an opener.",
      "E deals more damage when hitting a single target. Try to fight in isolation rather than in minion waves."
    ]
  },

  Annie: {
    animationCancels: [
      "R (Summon Tibbers) -> Flash: R has a brief cast time. Flash mid-R to extend the range of the Tibbers stun.",
      "Q -> W: Q is targeted. Immediately W after Q for double burst."
    ],
    spacingTricks: [
      "Track your passive stun stacks. Have your stun ready before engaging.",
      "E shield gives movement speed and damage reduction. Activate before walking into range."
    ],
    abilityBuffering: [
      "Buffer Flash during R for extended range AoE stun engage.",
      "Buffer Q on an enemy while they are in range for instant targeted damage."
    ],
    advancedTips: [
      "R -> Flash is Annie's most important mechanic. The AoE stun from Tibbers + Flash is nearly undodgeable and can stun an entire team.",
      "Use Q to last hit minions: It refunds mana cost and cooldown when it kills. Build stun stacks safely with Q last hits."
    ]
  },

  Malphite: {
    animationCancels: [
      "R (Unstoppable Force) -> Flash is NOT needed. R is already unstoppable and fast. However, Flash -> R can extend the range significantly.",
      "E (Ground Slam) -> W: E during W auto-enhance for AoE slow and extra damage."
    ],
    spacingTricks: [
      "Q (Seismic Shard) steals movement speed. Use it to chase or kite.",
      "R has a long range. Use it from fog of war for surprise engages."
    ],
    abilityBuffering: [
      "Buffer Flash before R for extended range engage: Flash -> R covers massive distance.",
      "Buffer E during R for instant Ground Slam on arrival."
    ],
    advancedTips: [
      "R into multiple enemies is one of the strongest engage tools in the game. Wait for enemies to clump.",
      "Full AP Malphite: Q -> R -> E -> W can one-shot squishies. Use this build when snowballing."
    ]
  },

  // ============================================================
  // ADDITIONAL CHAMPIONS (reaching 60+ total)
  // ============================================================

  Tristana: {
    animationCancels: [
      "W (Rocket Jump) -> E: Place E (Explosive Charge) on a target mid-jump for instant bomb on landing.",
      "E -> AA -> AA -> AA -> AA: Each auto adds a stack to the bomb. Full stacking detonates for massive burst.",
      "R (Buster Shot) -> W: R knocks back the enemy while you buffer W in the other direction for a double-distance disengage, or R then W forward for an aggressive Insec-style play.",
      "AA -> Q: Q (Rapid Fire) is an attack speed steroid with no cast time. Use it between autos for instant AS buff."
    ],
    spacingTricks: [
      "W (Rocket Jump) resets on champion kills and fully stacked E detonations. Chain W resets through teamfights.",
      "R (Buster Shot) is self-peel. Save it for divers trying to reach you. The knockback creates distance.",
      "Use W jump to reposition over walls. Tristana can escape ganks with well-timed W over terrain.",
      "E on towers pushes waves. Use E passive (exploding minions) for fast wave clear."
    ],
    abilityBuffering: [
      "Buffer E during W jump for instant bomb placement on landing.",
      "Buffer R during W to knock back the target immediately on arrival.",
      "Buffer Q at any time as it has no cast time.",
      "Buffer Flash during W for extended jump range."
    ],
    advancedTips: [
      "W -> E -> R -> W reset combo: Jump onto an enemy, bomb them, auto to stack, R to knockback, and if the bomb detonates from R damage, W resets for a second jump.",
      "E stacking: Each auto and ability hit adds a charge. 4 charges detonate the bomb. Q attack speed steroid helps stack faster.",
      "Tristana outranges most ADCs at level 18. In late game, play at max range and use R for peel.",
      "W can be used offensively with R: W in, full combo, R the enemy into your team."
    ]
  },

  Jinx: {
    animationCancels: [
      "Q (Switcheroo!) swap between minigun and rocket launcher. Swapping has no cast time. Use rockets for poke, minigun for DPS.",
      "W (Zap!) -> AA: W has a long cast time. Cancel it into movement if you need to dodge.",
      "E (Flame Chompers!) -> W: Place traps, then W to slow the enemy so they walk into traps.",
      "R -> Flash is not needed. R is global and instant direction-lock."
    ],
    spacingTricks: [
      "Rocket launcher (Q) gives AoE splash and extra range. Use it for safe poke in teamfights.",
      "Minigun (Q) stacks attack speed up to 3 times. Use minigun for sustained DPS in close-range fights.",
      "E (Flame Chompers) zones areas. Place them behind enemies to cut off escape routes.",
      "Passive (Get Excited): On champion kill/assist, Jinx gains massive movement speed and attack speed. Chase down remaining enemies after the first kill."
    ],
    abilityBuffering: [
      "Buffer E at your feet when a diver is approaching for instant root.",
      "Buffer W after E root for guaranteed Zap hit on the rooted target.",
      "Buffer Q swap during auto-attack animation for seamless weapon switching.",
      "Buffer R to snipe low-HP targets globally."
    ],
    advancedTips: [
      "Passive resets are Jinx's win condition in teamfights. Focus on getting one kill or assist, then chain the passive speed and AS to ace.",
      "Rocket launcher AoE crits deal splash to nearby enemies. In late game, rocket crits shred grouped enemies.",
      "W is a slow-casting ability. Only use it when the enemy is CCed or at a safe distance. Do not W when enemies can reach you.",
      "R does more damage the further it travels (up to a cap). Use it cross-map for maximum damage on low-HP targets."
    ]
  },

  Caitlyn: {
    animationCancels: [
      "E (90 Caliber Net) -> Q: Cast E backward for escape, then Q during the E knockback. Q fires from the displaced position.",
      "W (Yordle Snap Trap) -> AA (Headshot): Place a trap under a CCed enemy. When they step on it (or are trapped), auto for a guaranteed Headshot.",
      "AA -> E -> Q -> AA (Headshot): Auto, E backward, Q during E, then auto the approaching enemy with the empowered Headshot from trap/net.",
      "Net Headshot: E marks the target for an empowered Headshot. Auto immediately after E hits for bonus damage."
    ],
    spacingTricks: [
      "Caitlyn has the longest base auto-attack range (650) of any ADC at level 1. Abuse this range advantage in lane.",
      "E (Net) is a self-peel tool. Use it when enemies dash onto you to create distance.",
      "W traps under towers: Place traps behind enemies diving you. They get rooted and you get a free Headshot.",
      "Q passes through enemies. Use it to hit backline targets through the frontline."
    ],
    abilityBuffering: [
      "Buffer Q during E knockback for instant Piltover Peacemaker from a safe distance.",
      "Buffer W under CCed enemies for guaranteed trap + Headshot proc.",
      "Buffer R on a low-HP target during a teamfight pause.",
      "Buffer Flash during E for extended range net-escape."
    ],
    advancedTips: [
      "Headshot passive: Every few autos, Caitlyn's next auto is empowered. Traps and E also empower the next auto. Stack Headshot procs for massive burst.",
      "Trap chains: Place traps in a line. If the enemy steps on one, immediately place another at their location while rooted for a chain of Headshots.",
      "E -> Q -> Headshot is Caitlyn's burst combo. It deals surprising damage even in the early game.",
      "R (Ace in the Hole) can be blocked by other champions stepping in the way. Wait for the target to be isolated before using R."
    ]
  },

  MissFortune: {
    animationCancels: [
      "AA -> Q (Double Up): Q resets auto-attack timer. Auto a minion, then Q to bounce to the champion behind for guaranteed crit on the bounce.",
      "E -> R: Place E (Make It Rain) slow zone, then R (Bullet Time) through the slowed area for maximum hits.",
      "W (Strut) -> AA: W resets auto-attack timer and gives attack speed. Use between autos.",
      "Q bounce kill: If Q's first target dies, the bounce damage is increased and can crit."
    ],
    spacingTricks: [
      "Passive (Love Tap): Autos deal bonus damage when switching targets. Alternate auto targets for maximum DPS.",
      "Q bounce angle: The second bounce targets behind the first target. Position to line up bounces through minions to champions.",
      "E slow zone controls teamfight positioning. Place it where enemies want to walk.",
      "W passive movespeed: MF gains movement speed when not recently damaged. Use it for roaming and repositioning."
    ],
    abilityBuffering: [
      "Buffer R immediately after E for overlapping slow + R damage zone.",
      "Buffer Q after auto for instant Double Up.",
      "Buffer W between autos for instant attack speed boost.",
      "Buffer Flash during R to redirect Bullet Time angle."
    ],
    advancedTips: [
      "R (Bullet Time) channels and deals massive AoE in a cone. Pair with allies who have AoE CC (Amumu, Leona, Nautilus) for wombo combos.",
      "Q bounce crit: The second bounce crits if the first target dies. Use this to one-shot enemy laners by Qing a low minion in front of them.",
      "Love Tap: Switch auto targets between the enemy ADC and support for maximum trade damage.",
      "R positioning is everything. Use E slow or ally CC to guarantee enemies stay in R cone."
    ]
  },

  Twitch: {
    animationCancels: [
      "Q (Ambush) -> AA: Exit stealth with an auto for surprise burst (applies Deadly Venom stack).",
      "R (Spray and Pray) -> AA: R empowers autos to become piercing bolts. Auto immediately after R activation for instant DPS.",
      "W (Venom Cask) -> E (Contaminate): W applies 2 stacks of venom. E deals damage per stack. W -> AA -> AA -> E for burst.",
      "E is instant cast with no animation. Use it between autos freely."
    ],
    spacingTricks: [
      "Q (stealth) allows flanking in teamfights. Go invisible, position behind the enemy team, then R for a multi-target piercing barrage.",
      "R gives 300 bonus range and piercing autos. In teamfights, position so your autos pierce through multiple enemies.",
      "W slow zone controls space. Use it to kite or zone enemies off objectives.",
      "E (Contaminate) deals damage per venom stack. Stack as many autos as possible before pressing E."
    ],
    abilityBuffering: [
      "Buffer R during Q stealth for instant Spray and Pray on stealth exit.",
      "Buffer W after exiting stealth for immediate venom application.",
      "Buffer E when stacks are high for burst finish.",
      "Buffer Flash during R for repositioned piercing barrage."
    ],
    advancedTips: [
      "Twitch teamfight combo: Q (stealth) -> position behind -> R -> AA multiple enemies -> W -> E for AoE nuke.",
      "Piercing bolts from R hit all enemies in a line. Line up your position to hit as many targets as possible.",
      "Early game roam: At level 2-3, Q stealth and roam mid for surprise ganks. Very effective when the enemy mid has no vision.",
      "E scales with venom stacks. In extended fights, stack 6 venom on the target before E for maximum burst."
    ]
  },

  Samira: {
    animationCancels: [
      "AA -> Q -> AA: Q in melee range is a slash that resets auto timer. Weave autos between Q casts.",
      "E (Wild Rush) -> Q: Dash through a target with E, Q mid-dash for burst on arrival.",
      "E -> AA -> Q -> AA: Dash in, auto, melee Q, auto for rapid style grade stacking.",
      "W (Blade Whirl) destroys projectiles and deals damage. Can be used during E dash."
    ],
    spacingTricks: [
      "Style Grade: Samira's passive builds a combo grade (E to S) by using different abilities and autos. At S rank, R becomes available.",
      "E (Wild Rush) can dash to allies, enemies, and enemy minions. Use minions as dash targets for repositioning.",
      "W blocks all projectiles for its duration. Use it against key enemy abilities (ADC autos, skillshots, ults).",
      "Passive: Samira can dash in and knock up enemies already CCed by allies. Look for ally CC to combo with."
    ],
    abilityBuffering: [
      "Buffer Q during E dash for instant hit on arrival.",
      "Buffer W during E for projectile destruction during the dash.",
      "Buffer R when at S grade for instant Inferno Trigger.",
      "Buffer AA between every ability to build grade faster."
    ],
    advancedTips: [
      "R (Inferno Trigger) is only available at S grade. Build grade by: AA -> Q -> E -> AA -> W -> AA -> Q -> R.",
      "Samira thrives in melee range. Unlike other ADCs, she wants to dive in. Wait for ally CC, then E in and combo to S grade for R.",
      "W can block critical ultimates: Jinx R, Ashe R, Ezreal R, etc. Time it correctly.",
      "E resets on champion kill. Chain E through the enemy team after getting a kill."
    ]
  },

  Zeri: {
    animationCancels: [
      "Q (Burst Fire) acts as Zeri's auto-attack. It fires a burst of rounds in a skillshot. Weave movement between Q casts.",
      "E (Spark Surge) -> Q: Dash through terrain with E, then Q through the terrain for enhanced piercing bolts.",
      "W (Ultrashock Laser) -> Q: W for the long-range poke, then Q for follow-up.",
      "Right-click (actual auto) is a slow-applying charged shot. Use it for the slow, not DPS."
    ],
    spacingTricks: [
      "E (Spark Surge) passes through terrain. Use it to dash over walls for surprise engages or escapes.",
      "Q through terrain (during E) fires piercing bolts that pass through all targets. Position E through walls for maximum piercing Q damage.",
      "W fires through terrain and extends when hitting a wall. Use it as long-range poke from behind walls.",
      "R (Lightning Crash) gives movement speed, AoE damage, and overcharge. Use it in teamfights for sustained damage."
    ],
    abilityBuffering: [
      "Buffer Q during E dash for instant burst fire at the new position.",
      "Buffer W during E for poke from a new angle.",
      "Buffer R before engaging for the overcharge stack.",
      "Buffer Flash during E for double-reposition."
    ],
    advancedTips: [
      "Zeri Q is a skillshot auto-attack. Attack speed increases Q fire rate. Build attack speed for higher Q DPS.",
      "E through walls + Q fires 3 piercing rounds. Use walls near fights to get enhanced Q damage.",
      "R gives overcharge stacks from hitting champions. More stacks = more movement speed and AoE damage. Stay in the fight to maintain stacks.",
      "Zeri kites extremely well with Q movement and E dashes. Constant movement makes her hard to pin down."
    ]
  },

  Aatrox: {
    animationCancels: [
      "Q (The Darkin Blade) -> E (Umbral Dash): Use E during any Q cast to reposition the Q sweet spot. This is Aatrox's core mechanic.",
      "Q1 -> E -> Q2 -> E -> Q3 -> E: Weave E between Q casts to reposition each sweet spot onto the enemy.",
      "W (Infernal Chains) -> Q: W pulls enemies to center. Time Q sweet spot on the W pull-back location.",
      "AA between Q casts for extra DPS: AA -> Q -> E -> AA -> Q -> E -> AA -> Q."
    ],
    spacingTricks: [
      "Q sweet spots (edges of each Q) deal bonus damage and knock up. Always aim to hit with the sweet spot, not the center.",
      "E repositions during Q. Dash forward to extend Q range, backward to hit enemies who try to walk past you, or sideways to adjust sweet spot position.",
      "W creates a zone that slows. If enemies don't leave in time, they are pulled back to center. Combo with Q sweet spots.",
      "R (World Ender) gives movement speed and increased healing. Pop R before engaging for the speed boost and sustain."
    ],
    abilityBuffering: [
      "Buffer E during any Q cast for instant reposition of the sweet spot.",
      "Buffer W between Q casts for chain pull setup.",
      "Buffer Flash during Q for extended range sweet spot hit.",
      "Buffer R before engaging for the movement speed into Q1."
    ],
    advancedTips: [
      "Q -> E -> Flash: Extend Q range with E dash, then Flash for even more reach. The sweet spot follows your Flash position.",
      "Q sweet spot is everything. Missing sweet spots reduces Aatrox's damage by over 50%. Practice hitting sweet spots consistently.",
      "R revive window: R resets on takedowns. Aggressive R usage is rewarded if you get kills to extend the duration.",
      "W -> Q3 combo: W pulls the enemy back into Q3 sweet spot for guaranteed knockup."
    ]
  },

  Darius: {
    animationCancels: [
      "AA -> W (Crippling Strike): W resets auto-attack timer. AA -> W for quick double hit.",
      "E (Apprehend) -> AA -> W: Pull enemies in, auto, then W for immediate burst.",
      "Q (Decimate) handle positioning: The outer edge (blade) heals and deals more damage. Step back slightly to hit with the blade, not the handle.",
      "R (Noxian Guillotine) resets on kill. Chain R through the enemy team."
    ],
    spacingTricks: [
      "Q blade vs handle: Hitting with the outer edge (blade) deals bonus physical damage and heals. Hitting with the inner part (handle) deals reduced damage and does not heal.",
      "E pulls enemies to you. Save it for when enemies try to disengage after a trade.",
      "Ghost is preferred over Flash on Darius. Ghost gives sustained movement speed for extended chases.",
      "Passive (Hemorrhage): 5 stacks on an enemy gives Noxian Might (massive AD boost to Darius). Reach 5 stacks and become a teamfight monster."
    ],
    abilityBuffering: [
      "Buffer W during E pull for instant Crippling Strike on the pulled target.",
      "Buffer Q after E pull for guaranteed blade hit on grouped enemies.",
      "Buffer R when target is at execute threshold for instant dunk.",
      "Buffer Flash during Q for repositioned blade hit."
    ],
    advancedTips: [
      "5-stack Darius is one of the most dangerous champions in the game. In teamfights, focus on reaching 5 stacks on one target to gain Noxian Might, then chain R resets.",
      "R does true damage. Execute threshold increases with passive stacks. At 5 stacks, R deals massive true damage.",
      "AA -> W -> Q combo: Auto, W reset, then Q blade for a fast short trade. Walk away before they retaliate.",
      "E -> AA -> W -> Q -> R: Full kill combo. Pull, auto, W slow, Q blade, R execute."
    ]
  },

  Jax: {
    animationCancels: [
      "AA -> W (Empower): W resets auto-attack timer. AA -> W for quick double hit.",
      "Q (Leap Strike) -> AA -> W: Jump to target, auto, W reset for triple hit burst.",
      "E (Counter Strike) -> Q: Activate E (dodge), Q onto the enemy, E stun at the destination.",
      "AA -> W -> Tiamat: Triple-hit burst with Tiamat AoE."
    ],
    spacingTricks: [
      "E (Counter Strike) dodges all auto-attacks for the duration and stuns in an AoE on recast. Use it against auto-attack reliant champions.",
      "Q can jump to allies, wards, and minions. Use it as an escape by jumping to a minion behind you.",
      "Q -> E combo: Q onto the enemy with E active. Stun on arrival.",
      "R passive: Every 3rd auto deals bonus magic damage. Track your auto count for burst trades."
    ],
    abilityBuffering: [
      "Buffer W during Q for instant empowered auto on landing.",
      "Buffer E before Q for stun on arrival.",
      "Buffer Tiamat during Q for AoE burst on landing.",
      "Buffer Flash during E for extended range AoE stun."
    ],
    advancedTips: [
      "Jax scales into one of the strongest duelists in the game. Play for the mid-late game split push.",
      "E is your most important ability. Time it to block enemy ADC autos in teamfights.",
      "R gives bonus armor and MR. Activate R before a burst combo for survivability.",
      "Ward hop with Q: Place a ward and Q to it for instant escape (similar to Lee Sin)."
    ]
  },

  Rakan: {
    animationCancels: [
      "W (Grand Entrance) -> Flash: Dash to a location, Flash mid-dash to redirect. Enemies cannot react to the instantaneous knockup.",
      "E (Battle Dance) -> W: Dash to an ally with E, then W from the new position for an unexpected engage angle.",
      "R (The Quickness) -> W -> Flash: Activate R for charm aura, W dash in, Flash to extend range. Multi-person charm into knockup.",
      "AA -> Q -> AA: Q is a projectile with a short cast time. Weave autos between Q casts."
    ],
    spacingTricks: [
      "E (Battle Dance) dashes to an allied champion and shields them. Use it to peel carries and reposition.",
      "R gives movement speed. Activate R then run through the enemy team for AoE charm before W knockup.",
      "W has a short cast delay before the knockup. Pair with Flash for undodgeable knockups.",
      "E -> E: You can recast E to dash to a second ally. Use it to dash in and out of fights."
    ],
    abilityBuffering: [
      "Buffer Flash during W for instant redirect of the knockup zone.",
      "Buffer W during R for instant engage when close to enemies.",
      "Buffer E after W for instant retreat to your ADC after engaging.",
      "Buffer R before W for the charm aura during the engage."
    ],
    advancedTips: [
      "R -> Flash -> W combo: R for charm, Flash into the enemy team, W for knockup. This is one of the best engage combos in the game for supports.",
      "E -> W -> Flash -> R: Dash to a frontline ally, W-Flash into the backline, R for AoE charm. Then E back to your ADC.",
      "Rakan is extremely mobile. Use E to bounce between allies for positioning and shields.",
      "Q heals Rakan and his ally if he autos a target after Q hits. Use Q in trades for sustain."
    ]
  },

  Pyke: {
    animationCancels: [
      "Q tap (no charge) -> AA: Tap Q for a short stab, then auto for quick burst.",
      "Q charge -> E: Charge Q to hook, then E through the target for double CC (pull + stun).",
      "E (Phantom Undertow) -> Flash: E leaves a phantom at the cast location that dashes forward. Flash mid-E to reposition the stun.",
      "R (Death From Below) can be cast instantly. Chain R through the enemy team on resets."
    ],
    spacingTricks: [
      "W (Ghostwater Dive) gives camouflage and movement speed. Use it to roam between lanes and set up picks.",
      "Q charged hook pulls the first enemy hit. Position in fog of war for surprise hooks.",
      "E stuns enemies who are hit by the returning phantom. Walk through enemies so the phantom returns through them.",
      "R has an X indicator for the execute zone. Wait until enemies enter the execute threshold before R."
    ],
    abilityBuffering: [
      "Buffer E after charged Q for instant dash-stun on the hooked target.",
      "Buffer Flash during E for repositioned phantom stun.",
      "Buffer R instantly when an enemy drops below execute threshold.",
      "Buffer W before Q for stealthy hook engages."
    ],
    advancedTips: [
      "R resets on kills and gives gold to both Pyke and the last assisting ally. Always R to execute for the bonus gold.",
      "E -> Flash is Pyke's most important advanced mechanic. The phantom stuns at the Flash destination, not the original E cast.",
      "Pyke cannot gain bonus HP. Build lethality and roam for kills.",
      "Q -> E -> R combo: Hook the target, E through them for stun, then R to execute. Full pick combo."
    ]
  },

  Nautilus: {
    animationCancels: [
      "AA (root passive) -> W: Auto to root, then W (Titan's Wrath) for shield and empowered autos.",
      "Q (Dredge Line) -> AA: Hook an enemy, auto for passive root on arrival.",
      "E (Riptide) -> AA: E is instant AoE. Use between autos for no DPS loss.",
      "R (Depth Charge) -> Q: Ult a target, then Q hook for guaranteed follow-up."
    ],
    spacingTricks: [
      "Passive: First auto on each enemy champion roots them. Track which champions you have not yet rooted.",
      "Q hooks terrain and pulls Nautilus to it. Use it for mobility and escapes over walls.",
      "E slows in a radius. Use it while chasing to maintain distance.",
      "R (Depth Charge) is a point-and-click knockup that travels to the target, knocking up enemies in its path."
    ],
    abilityBuffering: [
      "Buffer AA after Q hook for instant passive root on arrival.",
      "Buffer W before engaging for the shield and empowered autos.",
      "Buffer E during Q travel for instant slow on arrival.",
      "Buffer R before Q for guaranteed follow-up."
    ],
    advancedTips: [
      "Nautilus has the most CC in the game for a support. Q hook, passive root, E slow, R knockup.",
      "R travels through all enemies, knocking them up. Aim R through the frontline to disrupt multiple enemies.",
      "Q on terrain halves the cooldown. Use Q on walls for mobility in the jungle.",
      "In teamfights, R the enemy carry. The knockup chain disrupts their entire backline."
    ]
  },

  Bard: {
    animationCancels: [
      "Q (Cosmic Binding) -> AA (Meep empowered): Q stun into empowered auto for burst.",
      "W (Caretaker's Shrine) can be placed instantly during any movement.",
      "E (Magical Journey) has no cast delay. Create portals through terrain instantly.",
      "R (Tempered Fate) -> Flash: R has a cast delay. Flash mid-R to reposition the Zhonyas zone."
    ],
    spacingTricks: [
      "Q stuns if it hits a second target or terrain after the first target. Always aim Q so the target is between you and a wall or another enemy.",
      "Chime collection gives movement speed bursts. Roam through chime paths for efficient movement.",
      "E through walls creates portals for your entire team. Use it for creative engage paths and escape routes.",
      "R freezes everything in the zone (allies, enemies, towers, objectives). Use it precisely."
    ],
    abilityBuffering: [
      "Buffer Q after R ends for instant stun on unfrozen targets.",
      "Buffer Flash during R for repositioned zone.",
      "Buffer AA (Meep) after Q stun for guaranteed empowered auto.",
      "Buffer E before fleeing for instant portal creation."
    ],
    advancedTips: [
      "Q geometry: The most important Bard mechanic. Always position so Q passes through the enemy and hits terrain or a second target for the stun.",
      "R on objectives: Freeze Baron/Dragon to stall enemy takes or set up steals. R enemy team on Baron to stall while your team arrives.",
      "Meeps scale with chimes collected. Late-game Meep autos deal massive AoE damage and slow.",
      "E through multiple walls for extremely long portals. Your team can use these for flanks and surprise engages."
    ]
  },

  Xerath: {
    animationCancels: [
      "Q (Arcanopulse) charge -> release: Q charges for range. Release at the right moment for max range poke.",
      "W (Eye of Destruction) -> E (Shocking Orb): W slows, E stuns. The slow guarantees the E stun hit.",
      "E -> Q: Stun with E, then fully charge Q for guaranteed max-damage hit.",
      "R (Rite of the Arcane) fires 3-5 shots. Each shot is a separate skillshot."
    ],
    spacingTricks: [
      "Xerath is an artillery mage. Stay at maximum range (1400+ units on Q) and poke.",
      "W center zone deals bonus damage. Aim for the center hit when enemies are CCed.",
      "E stun duration scales with distance traveled. Max range E stuns for 2 seconds.",
      "R has massive range (3000-5000). Use it to snipe low-HP targets from safety."
    ],
    abilityBuffering: [
      "Buffer W during Q charge for AoE slow zone at the destination.",
      "Buffer E after W slow for guaranteed stun.",
      "Buffer R when safe behind your team for long-range artillery.",
      "Buffer Flash during Q charge for repositioned release."
    ],
    advancedTips: [
      "Passive (Mana Surge): Autos restore mana. Use it on cooldown for mana sustain in lane.",
      "Q charge reduces movement speed. Be aware of ganks while charging Q.",
      "R (Rite of the Arcane) can be used to check bushes and objectives from safety.",
      "E -> W -> Q combo: Stun, slow zone, charged Q for full burst. This kills most squishies."
    ]
  },

  Lux: {
    animationCancels: [
      "Q (Light Binding) -> E (Lucent Singularity) -> R (Final Spark): Full combo in rapid succession. Q roots, E slow zone, R laser through.",
      "E -> AA: E marks with passive (Illumination). Auto to proc the mark for bonus damage.",
      "R -> E detonate: Fire R, then immediately detonate E for overlapping damage.",
      "AA -> passive proc: Each ability marks enemies with Illumination. Auto to proc for bonus damage."
    ],
    spacingTricks: [
      "Lux operates at extreme range. Q has 1175 range, E has 1100, R has 3340. Stay far back.",
      "E zone provides vision and slow. Use it to scout bushes and control space.",
      "Q roots two targets. Position to catch both the frontline and backline if possible.",
      "W shield travels out and back, shielding twice. Aim it through as many allies as possible."
    ],
    abilityBuffering: [
      "Buffer E during Q for instant zone on the rooted targets.",
      "Buffer R during E for instant laser when targets are slowed in E zone.",
      "Buffer Flash during R for repositioned laser angle.",
      "Buffer W through allies before engaging."
    ],
    advancedTips: [
      "Full combo: Q -> E -> AA (passive proc) -> R -> E detonate -> AA (passive proc). Maximize passive procs between abilities.",
      "R has almost no cast time. Use it instantly after Q root for guaranteed hit.",
      "E can be detonated early or left on the ground for zone control. Do not always instant-detonate.",
      "Illumination passive: Every ability marks. Auto between abilities to proc each mark for significantly more damage."
    ]
  },

  Morgana: {
    animationCancels: [
      "Q (Dark Binding) -> W (Tormented Shadow): Q root into W pool for guaranteed tick damage.",
      "E (Black Shield) has no cast time. Cast it instantly on allies at any time.",
      "R (Soul Shackles) -> Zhonya's: R tethers enemies, then Zhonya's to survive while R stuns.",
      "Flash -> R: Flash into the enemy team, R for AoE tether, then Zhonya's."
    ],
    spacingTricks: [
      "Q root lasts up to 3 seconds at max rank. It is one of the longest non-ultimate CC abilities in the game.",
      "E (Black Shield) blocks CC and magic damage. Time it to block key enemy abilities (hooks, stuns).",
      "W pool deals more damage to low-HP targets. Use it for waveclear and damage on rooted enemies.",
      "R tether range: Stay close enough to enemies during R to not break the tether."
    ],
    abilityBuffering: [
      "Buffer W under Q-rooted targets for guaranteed damage.",
      "Buffer E on allies before enemy CC abilities hit.",
      "Buffer Zhonya's during R for the guaranteed stun.",
      "Buffer Flash before R for engage-R combo."
    ],
    advancedTips: [
      "Flash -> R -> Zhonya's is Morgana's most impactful teamfight combo. Flash in, R tethers multiple enemies, Zhonya's keeps you alive while R stuns.",
      "E blocks ALL incoming CC. Use it proactively on carries about to be engaged on.",
      "Q through minions is impossible (it hits the first target). Angle Q around the minion wave.",
      "W pool accelerates passive healing when enemies stand in it. Use it for sustain."
    ]
  },
};

/**
 * Helper function to get mechanics for a given champion name (case-insensitive).
 * Handles common name variations like "Lee Sin" -> "LeeSin", "Kai'Sa" -> "KaiSa", "Kha'Zix" -> "KhaZix".
 */
export function getChampionMechanics(championName: string): ChampionMechanics | undefined {
  // Direct match
  if (championMechanicsDB[championName]) {
    return championMechanicsDB[championName];
  }

  // Normalize: remove spaces, apostrophes, hyphens, and lowercase
  const normalize = (name: string) =>
    name.replace(/[\s''`\-]/g, "").toLowerCase();

  const normalizedInput = normalize(championName);

  for (const [key, value] of Object.entries(championMechanicsDB)) {
    if (normalize(key) === normalizedInput) {
      return value;
    }
  }

  return undefined;
}

/**
 * Returns an array of all champion names that have mechanics data.
 */
export function getAllMechanicsChampions(): string[] {
  return Object.keys(championMechanicsDB);
}
