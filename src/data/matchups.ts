import type { MatchupInfo } from '../types/coaching';

interface MatchupEntry {
  difficulty: 1 | 2 | 3 | 4 | 5;
  tips: string[];
  powerSpikes: string[];
  laneSummary: string;
}

const matchupDatabase: Record<string, MatchupEntry> = {
  // ===== ADC Matchups =====
  'Kai\'Sa_vs_Draven': {
    difficulty: 4,
    tips: [
      'Draven will look to all-in early with his spinning axes. Avoid extended trades before level 6.',
      'Stay behind minions to avoid his Stand Aside (E).',
      'You outscale hard. Farm safely and wait for your Evolved Q power spike.',
      'After 2 items you win most fights. Play patient.',
    ],
    powerSpikes: ['Kai\'Sa spikes at Kraken Slayer + Nashor\'s Tooth with Q evolve', 'Draven spikes at BF Sword and level 2'],
    laneSummary: 'Draven dominates early lane. Kai\'Sa must survive laning to outscale.',
  },
  'Jinx_vs_Lucian': {
    difficulty: 4,
    tips: [
      'Lucian has a strong early game with his passive procs. Avoid short trades.',
      'Farm with rockets (Q) from max range to stay safe.',
      'Your power spike comes at 2-3 items. Focus on CS and scaling.',
      'If Lucian wastes his dash (E), he is vulnerable to ganks.',
    ],
    powerSpikes: ['Jinx spikes at Kraken + Rapid Firecannon', 'Lucian spikes at level 2 and BotRK'],
    laneSummary: 'Lucian bullies early but Jinx outscales massively. Survive lane phase.',
  },
  'Ezreal_vs_Caitlyn': {
    difficulty: 3,
    tips: [
      'Caitlyn outranges you. Use Q to farm from distance when pressured.',
      'Your E (Arcane Shift) can dodge her traps and net. Save it for disengage.',
      'Look for Q poke through minions to chunk her before all-ins.',
      'You spike at Trinity Force / Manamune completion.',
    ],
    powerSpikes: ['Ezreal spikes at Manamune + Trinity Force', 'Caitlyn spikes at Infinity Edge'],
    laneSummary: 'Skill matchup. Caitlyn has range advantage but Ezreal has mobility and poke.',
  },
  'Jhin_vs_Miss Fortune': {
    difficulty: 3,
    tips: [
      'Avoid standing behind low-health minions - her Q bounces deal double damage.',
      'Your 4th shot is a strong trading tool. Time it to hit when she walks up to CS.',
      'Both champions have strong ultimates. Positioning in teamfights is key.',
      'Her Strut (W passive) is broken by any damage - your long range W can stop her.',
    ],
    powerSpikes: ['Jhin spikes at Galeforce + Rapid Firecannon', 'MF spikes at level 6 and Eclipse'],
    laneSummary: 'Even lane. Both have strong laning but different playstyles.',
  },
  'Kai\'Sa_vs_Ezreal': {
    difficulty: 2,
    tips: [
      'You win extended trades. Ezreal prefers short Q pokes.',
      'Look to all-in after landing your W (Void Seeker) for the passive proc.',
      'Dodge his skillshots by sidestepping and use your mobility advantage.',
      'Post-6 your ult dive potential is much stronger than his.',
    ],
    powerSpikes: ['Kai\'Sa spikes at Q evolve', 'Ezreal spikes at Manamune completion'],
    laneSummary: 'Kai\'Sa favored in all-ins. Ezreal can poke but loses extended fights.',
  },

  // ===== Mid Matchups =====
  'Zed_vs_Ahri': {
    difficulty: 3,
    tips: [
      'Ahri\'s Charm (E) is her main threat. Bait it out before using your ultimate.',
      'Your W-E-Q combo can poke through her positioning.',
      'Post-6 you have kill pressure if she wastes her ultimate dashes.',
      'Buy Hexdrinker if she gets an early lead.',
    ],
    powerSpikes: ['Zed spikes at level 6 and Duskblade', 'Ahri spikes at Lost Chapter and level 6'],
    laneSummary: 'Skill matchup. Zed has kill pressure but Ahri has safety with her ult.',
  },
  'Yasuo_vs_Annie': {
    difficulty: 4,
    tips: [
      'Annie can burst you through your shield. Respect her stun (passive).',
      'Your windwall does NOT block her abilities - they are not projectiles (Q is targeted).',
      'Look to all-in when her stun passive is down (watch the counter).',
      'Build Wit\'s End early for MR and sustain.',
    ],
    powerSpikes: ['Yasuo spikes at Berserker\'s + Kraken', 'Annie spikes at level 6 with Tibbers'],
    laneSummary: 'Annie counters Yasuo with point-and-click CC. Play very carefully around her stun.',
  },
  'Syndra_vs_Fizz': {
    difficulty: 4,
    tips: [
      'Fizz will look to all-in at level 3 and 6. Maintain distance and poke.',
      'Save your E (Scatter the Weak) to stun him when he engages with Q.',
      'Punish his weak early levels (1-2) with auto-attacks and Q poke.',
      'Rush Zhonya\'s Hourglass to survive his ultimate combo.',
    ],
    powerSpikes: ['Syndra spikes at Lost Chapter', 'Fizz spikes at level 3 and 6'],
    laneSummary: 'Syndra must bully early or Fizz will dominate post-6.',
  },
  'LeBlanc_vs_Veigar': {
    difficulty: 2,
    tips: [
      'You can dash out of his cage (E) with your W before it forms.',
      'All-in him early and often. He is weak before stacking.',
      'Don\'t let the game go late - Veigar outscales infinitely.',
      'Roam frequently to snowball other lanes while Veigar farms.',
    ],
    powerSpikes: ['LeBlanc spikes at level 3 and 6', 'Veigar spikes at Deathcap and 20+ minutes stacking'],
    laneSummary: 'LeBlanc dominates this lane. Abuse your mobility and burst advantage.',
  },
  'Akali_vs_Galio': {
    difficulty: 4,
    tips: [
      'Galio has strong anti-AP tools. Your damage is significantly reduced.',
      'He can taunt you out of your shroud. Stay unpredictable.',
      'Look for roams rather than trying to kill him in lane.',
      'Consider building Riftmaker for sustained damage to cut through his MR.',
    ],
    powerSpikes: ['Akali spikes at level 6 and Hextech Rocketbelt', 'Galio spikes at Hollow Radiance'],
    laneSummary: 'Galio counters Akali with MR, CC, and anti-burst tools. Roam to find leads.',
  },
  'Katarina_vs_Kassadin': {
    difficulty: 2,
    tips: [
      'Kassadin is weak pre-6. Abuse your early damage with Q dagger resets.',
      'You must snowball the game before level 16 when he becomes unstoppable.',
      'Roam to side lanes to get kills since Kassadin struggles to follow.',
      'After his level 6 he can trade back. Be more cautious.',
    ],
    powerSpikes: ['Katarina spikes at Nashor\'s Tooth', 'Kassadin spikes at level 6, 11, and 16'],
    laneSummary: 'Katarina has early advantage. Must snowball before Kassadin scales.',
  },

  // ===== Top Matchups =====
  'Darius_vs_Garen': {
    difficulty: 2,
    tips: [
      'You win extended trades with your passive bleed. Stack it to 5 for the Noxian Might bonus.',
      'Pull him with E when he tries to Q spin for healing.',
      'Be careful of his W damage reduction and tenacity.',
      'Zone him from CS with your threat of E pull.',
    ],
    powerSpikes: ['Darius spikes at level 1-3 and Trinity Force', 'Garen spikes at Berserker\'s + Stridebreaker'],
    laneSummary: 'Darius wins this matchup at all stages. Apply constant pressure.',
  },
  'Fiora_vs_Malphite': {
    difficulty: 2,
    tips: [
      'Malphite stacks armor but you deal max HP true damage with vitals.',
      'Parry (W) his ultimate for a massive stun on him.',
      'You can splitpush better than he can match. Apply side lane pressure.',
      'Build Divine Sunderer for max HP shred.',
    ],
    powerSpikes: ['Fiora spikes at Ravenous Hydra + Divine Sunderer', 'Malphite spikes at level 6 and Plated Steelcaps'],
    laneSummary: 'Fiora counters Malphite. He cannot trade with you or match your splitpush.',
  },
  'Camille_vs_Jax': {
    difficulty: 4,
    tips: [
      'Jax\'s Counter Strike (E) blocks your auto-attack based trades.',
      'Use your W to trade from range when his E is up.',
      'Short trades with E-Q-auto then E away are your best option.',
      'He outscales you at 2+ items. Try to get a lead early.',
    ],
    powerSpikes: ['Camille spikes at level 1-2 and Trinity Force', 'Jax spikes at BotRK and level 6'],
    laneSummary: 'Jax is a difficult matchup. He blocks your autos and outscales. Take short trades.',
  },
  'Riven_vs_Renekton': {
    difficulty: 4,
    tips: [
      'Renekton wins early with empowered W stun combo. Don\'t trade into his fury.',
      'Short trades only: Q in, auto, E out.',
      'After level 6 you can start matching him if even in gold.',
      'You outscale him significantly. Play for mid-late game.',
    ],
    powerSpikes: ['Riven spikes at level 6 and Eclipse', 'Renekton spikes at BotRK and level 3-6'],
    laneSummary: 'Renekton bullies Riven early but she outscales. Survive the first 10 minutes.',
  },
  'Garen_vs_Mordekaiser': {
    difficulty: 3,
    tips: [
      'Dodge his E (Death\'s Grasp) pull or you lose the trade.',
      'Run away from his passive if he lands his abilities.',
      'You can cleanse his ultimate with your W tenacity timing (or buy QSS).',
      'Short Q-auto-E trades then back off work well.',
    ],
    powerSpikes: ['Garen spikes at Berserker\'s + Stridebreaker', 'Mordekaiser spikes at Riftmaker and level 6'],
    laneSummary: 'Skill matchup. Dodge Mordekaiser E and you win trades; get hit and you lose.',
  },
  'Aatrox_vs_Irelia': {
    difficulty: 4,
    tips: [
      'Irelia with full passive stacks wins every all-in. Don\'t fight her at 5 stacks.',
      'Your Q sweetspots are hard to land when she dashes. Time them carefully.',
      'Build Executioner\'s early to cut her healing.',
      'Zone her from minions so she can\'t stack her passive.',
    ],
    powerSpikes: ['Aatrox spikes at Eclipse and level 6', 'Irelia spikes at BotRK and 5 passive stacks'],
    laneSummary: 'Irelia is strong against Aatrox if she can stack passive. Deny her resets.',
  },
  'Sett_vs_Ornn': {
    difficulty: 2,
    tips: [
      'You beat Ornn in extended trades with your passive and W.',
      'Dodge his E (bellows) or you eat his full combo into W.',
      'Freeze the lane near your tower to deny him safe CS.',
      'He outscales with his item upgrades. Push your lead.',
    ],
    powerSpikes: ['Sett spikes at BotRK', 'Ornn spikes at level 13+ with item upgrades'],
    laneSummary: 'Sett wins lane hard. Use your early advantage before Ornn outscales with upgrades.',
  },

  // ===== Support Matchups =====
  'Thresh_vs_Lulu': {
    difficulty: 3,
    tips: [
      'Lulu can polymorph you during your engage, canceling your E flay.',
      'Look for hooks when she wastes her W on poking or shielding.',
      'Level 2 all-in is strong if you land Q (hook).',
      'Roam mid if the lane is too passive.',
    ],
    powerSpikes: ['Thresh spikes at level 2 and Locket', 'Lulu spikes at level 6 and Moonstone'],
    laneSummary: 'Even lane. Thresh has engage but Lulu has strong disengage and peel.',
  },
  'Leona_vs_Morgana': {
    difficulty: 5,
    tips: [
      'Morgana\'s Black Shield (E) blocks all your CC. You cannot engage on a shielded target.',
      'Wait for her to use E on herself or waste it before engaging.',
      'Consider roaming mid since this lane is very hard to play.',
      'A well-timed all-in when E is on cooldown (24s early) is your only window.',
    ],
    powerSpikes: ['Leona spikes at level 2-3 and level 6', 'Morgana spikes at level 1 (E) and Zhonya\'s'],
    laneSummary: 'Morgana hard counters Leona. Black Shield nullifies all engage.',
  },
  'Nautilus_vs_Soraka': {
    difficulty: 2,
    tips: [
      'Soraka is very squishy. One hook combo chunks her massively.',
      'Ignite reduces her healing. Coordinate with your ADC to focus her.',
      'She can silence your engage area with E. Walk around it.',
      'Level 2 all-in is almost always a kill or flash.',
    ],
    powerSpikes: ['Nautilus spikes at level 2-3', 'Soraka spikes at Moonstone and level 6 global heal'],
    laneSummary: 'Nautilus heavily favored. Soraka is too squishy to survive hook combos.',
  },

  // ===== Jungle Matchups =====
  'Lee Sin_vs_Evelynn': {
    difficulty: 2,
    tips: [
      'Invade her early. She is extremely weak before level 6.',
      'Track her camps and take them. She has no duel potential pre-6.',
      'Place control wards near objectives to reveal her camouflage.',
      'After 6 she becomes dangerous. End the game early if possible.',
    ],
    powerSpikes: ['Lee Sin spikes at level 3 and level 6', 'Evelynn spikes at level 6 and Hextech Rocketbelt'],
    laneSummary: 'Lee Sin dominates early. Invade and shut Evelynn down before she scales.',
  },
};

function normalizeKey(champ1: string, champ2: string): string {
  return `${champ1}_vs_${champ2}`;
}

export function getMatchupData(
  yourChampion: string,
  enemyChampion: string
): MatchupInfo | null {
  const directKey = normalizeKey(yourChampion, enemyChampion);
  const directEntry = matchupDatabase[directKey];

  if (directEntry) {
    return {
      yourChampion,
      enemyChampion,
      difficulty: directEntry.difficulty,
      tips: directEntry.tips,
      powerSpikes: directEntry.powerSpikes,
      laneSummary: directEntry.laneSummary,
    };
  }

  const reverseKey = normalizeKey(enemyChampion, yourChampion);
  const reverseEntry = matchupDatabase[reverseKey];

  if (reverseEntry) {
    const invertedDifficulty = (6 - reverseEntry.difficulty) as 1 | 2 | 3 | 4 | 5;
    return {
      yourChampion,
      enemyChampion,
      difficulty: invertedDifficulty,
      tips: reverseEntry.tips.map((tip) =>
        tip
          .replace(new RegExp(enemyChampion, 'g'), '__SELF__')
          .replace(new RegExp(yourChampion, 'g'), enemyChampion)
          .replace(/__SELF__/g, yourChampion)
      ),
      powerSpikes: reverseEntry.powerSpikes,
      laneSummary: `${yourChampion} vs ${enemyChampion} - reversed perspective from known matchup data.`,
    };
  }

  return null;
}

export function hasMatchupData(champ1: string, champ2: string): boolean {
  return (
    normalizeKey(champ1, champ2) in matchupDatabase ||
    normalizeKey(champ2, champ1) in matchupDatabase
  );
}
