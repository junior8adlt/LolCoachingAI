/**
 * League of Legends Item Exclusivity Rules (Season 2025-2026)
 *
 * Items in the same exclusion group CANNOT be built together.
 * The game prevents purchasing a second item from the same item group.
 *
 * Source: https://wiki.leagueoflegends.com/en-us/Item_group
 */

export interface ItemExclusionGroup {
  groupName: string;
  items: string[];
  reason: string;
}

export const itemExclusionGroups: ItemExclusionGroup[] = [
  // ---------------------------------------------------------------------------
  // Boots - only one pair of boots allowed
  // ---------------------------------------------------------------------------
  {
    groupName: 'Boots',
    items: [
      'Boots',
      'Berserker\'s Greaves',
      'Boots of Swiftness',
      'Ionian Boots of Lucidity',
      'Mercury\'s Treads',
      'Plated Steelcaps',
      'Sorcerer\'s Shoes',
      'Slightly Magical Boots',
      // Season 2025-2026 boot upgrades / variants
      'Armored Advance',
      'Chainlaced Crushers',
      'Crimson Lucidity',
      'Gunmetal Greaves',
      'Spellslinger\'s Shoes',
      'Swiftmarch',
    ],
    reason: 'Boots group: only one pair of boots can be equipped at a time.',
  },

  // ---------------------------------------------------------------------------
  // Fatality - armor penetration / Last Whisper family
  // ---------------------------------------------------------------------------
  {
    groupName: 'Fatality',
    items: [
      'Last Whisper',
      'Black Cleaver',
      'Lord Dominik\'s Regards',
      'Mortal Reminder',
      'Serylda\'s Grudge',
      'Terminus',
    ],
    reason:
      'Fatality group: armor-penetration items that share the Fatality tag. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Hydra - Tiamat and its upgrades
  // ---------------------------------------------------------------------------
  {
    groupName: 'Hydra',
    items: [
      'Tiamat',
      'Profane Hydra',
      'Ravenous Hydra',
      'Titanic Hydra',
      'Stridebreaker',
    ],
    reason:
      'Hydra group: all build from Tiamat. Only one Hydra item can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Lifeline - shield-on-low-health items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Lifeline',
    items: [
      'Hexdrinker',
      'Maw of Malmortius',
      'Sterak\'s Gage',
      'Immortal Shieldbow',
      'Archangel\'s Staff',
      'Seraph\'s Embrace',
      'Protoplasm Harness',
    ],
    reason:
      'Lifeline group: items that grant a shield when the holder drops to low health. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Manaflow - Tear of the Goddess stacking items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Manaflow',
    items: [
      'Tear of the Goddess',
      'Manamune',
      'Archangel\'s Staff',
      'Winter\'s Approach',
      'Whispering Circlet',
    ],
    reason:
      'Manaflow group: Tear-line mana-stacking items. Only one Manaflow item can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Spellblade - Sheen proc items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Spellblade',
    items: [
      'Sheen',
      'Essence Reaver',
      'Iceborn Gauntlet',
      'Lich Bane',
      'Trinity Force',
      'Bloodsong',
      'Dusk and Dawn',
    ],
    reason:
      'Spellblade group: items with the Spellblade on-hit passive. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Immolate - Bami's Cinder aura items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Immolate',
    items: ['Bami\'s Cinder', 'Sunfire Aegis', 'Hollow Radiance'],
    reason:
      'Immolate group: items with the Immolate burning-aura passive. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Annul - spell shield items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Annul',
    items: ['Verdant Barrier', 'Banshee\'s Veil', 'Edge of Night'],
    reason:
      'Annul group: items granting a spell shield. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Blight - magic penetration items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Blight',
    items: [
      'Blighting Jewel',
      'Bloodletter\'s Curse',
      'Cryptbloom',
      'Terminus',
      'Void Staff',
    ],
    reason:
      'Blight group: magic-penetration items. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Eternity - Catalyst items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Eternity',
    items: ['Catalyst of Aeons', 'Rod of Ages'],
    reason:
      'Eternity group: Catalyst-line sustain items. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Glory - Dark Seal / Mejai's stacking items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Glory',
    items: ['Dark Seal', 'Mejai\'s Soulstealer'],
    reason:
      'Glory group: kill/assist stacking AP items. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Quicksilver - cleanse items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Quicksilver',
    items: ['Quicksilver Sash', 'Mercurial Scimitar'],
    reason:
      'Quicksilver group: items with the active cleanse effect. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Stasis - Zhonya's line
  // ---------------------------------------------------------------------------
  {
    groupName: 'Stasis',
    items: ['Seeker\'s Armguard', 'Shattered Armguard', 'Zhonya\'s Hourglass'],
    reason:
      'Stasis group: items providing the Stasis active. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Momentum - movement-speed ramping items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Momentum',
    items: ['Dead Man\'s Plate', 'Trailblazer'],
    reason:
      'Momentum group: items with the Momentum movement-speed passive. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Soul Anchor
  // ---------------------------------------------------------------------------
  {
    groupName: 'Soul Anchor',
    items: ['Lifeline', 'Spectral Cutlass'],
    reason:
      'Soul Anchor group: items sharing the Soul Anchor tag. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Starter - Doran's items and starting items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Starter',
    items: [
      'Doran\'s Blade',
      'Doran\'s Ring',
      'Doran\'s Shield',
      'Gustwalker Hatchling',
      'Mosstomper Seedling',
      'Scorchclaw Pup',
      'World Atlas',
      'Runic Compass',
    ],
    reason:
      'Starter group: starting items. Only one starter item can be purchased at the beginning of the game.',
  },

  // ---------------------------------------------------------------------------
  // Jungle / Support - upgraded companion items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Jungle / Support',
    items: [
      'Bounty of Worlds',
      'Bloodsong',
      'Celestial Opposition',
      'Dream Maker',
      'Gustwalker Hatchling',
      'Mosstomper Seedling',
      'Scorchclaw Pup',
      'Solstice Sleigh',
      'Zaz\'Zak\'s Realmspike',
    ],
    reason:
      'Jungle / Support group: jungle companion pets and support item upgrades. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Guardian - ARAM starting items
  // ---------------------------------------------------------------------------
  {
    groupName: 'Guardian',
    items: [
      'Guardian\'s Blade',
      'Guardian\'s Hammer',
      'Guardian\'s Horn',
      'Guardian\'s Orb',
    ],
    reason:
      'Guardian group: ARAM-specific starting items. Only one can be equipped.',
  },

  // ---------------------------------------------------------------------------
  // Elixir - consumable elixirs
  // ---------------------------------------------------------------------------
  {
    groupName: 'Elixir',
    items: ['Elixir of Iron', 'Elixir of Sorcery', 'Elixir of Wrath'],
    reason:
      'Elixir group: only one elixir can be active at a time. Purchasing a new one replaces the old.',
  },

  // ---------------------------------------------------------------------------
  // Dirk - Serrated Dirk component
  // ---------------------------------------------------------------------------
  {
    groupName: 'Dirk',
    items: ['Serrated Dirk'],
    reason:
      'Dirk group: only one Serrated Dirk can be held at a time (it is consumed on upgrade).',
  },

  // ---------------------------------------------------------------------------
  // Potion - healing potions
  // ---------------------------------------------------------------------------
  {
    groupName: 'Potion',
    items: ['Health Potion', 'Refillable Potion'],
    reason:
      'Potion group: cannot carry both Health Potions and Refillable Potion simultaneously.',
  },

  // ---------------------------------------------------------------------------
  // Trinket - ward / vision trinkets
  // ---------------------------------------------------------------------------
  {
    groupName: 'Trinket',
    items: ['Stealth Ward', 'Oracle Lens', 'Farsight Alteration'],
    reason:
      'Trinket group: only one trinket can be equipped at a time.',
  },
];

// =============================================================================
// Utility functions
// =============================================================================

/**
 * Checks whether two items belong to the same exclusion group and therefore
 * cannot be built together.
 *
 * Note: items that are in the same group because one is a *component* of the
 * other (e.g. Tiamat -> Ravenous Hydra) are still flagged here. The caller
 * should handle upgrade-path logic separately if needed.
 */
export function areItemsIncompatible(item1: string, item2: string): boolean {
  if (item1 === item2) return false; // duplicate check is a different concern

  const i1 = item1.toLowerCase();
  const i2 = item2.toLowerCase();

  return itemExclusionGroups.some((group) => {
    const lowerItems = group.items.map((i) => i.toLowerCase());
    return lowerItems.includes(i1) && lowerItems.includes(i2);
  });
}

/**
 * Returns the human-readable reason why two items cannot be built together,
 * or `null` if they are compatible.
 */
export function getExclusionReason(
  item1: string,
  item2: string,
): string | null {
  if (item1 === item2) return null;

  const i1 = item1.toLowerCase();
  const i2 = item2.toLowerCase();

  for (const group of itemExclusionGroups) {
    const lowerItems = group.items.map((i) => i.toLowerCase());
    if (lowerItems.includes(i1) && lowerItems.includes(i2)) {
      return group.reason;
    }
  }

  return null;
}

/**
 * Given an item name, returns all other items that are incompatible with it
 * (i.e. items in the same exclusion group(s)).
 */
export function getIncompatibleItems(itemName: string): string[] {
  const lower = itemName.toLowerCase();
  const result = new Set<string>();

  for (const group of itemExclusionGroups) {
    const lowerItems = group.items.map((i) => i.toLowerCase());
    if (lowerItems.includes(lower)) {
      for (const item of group.items) {
        if (item.toLowerCase() !== lower) {
          result.add(item);
        }
      }
    }
  }

  return Array.from(result);
}
