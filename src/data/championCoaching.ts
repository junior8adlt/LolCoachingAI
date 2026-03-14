// ── Champion-Specific Coaching Database ──
// Unified coaching data for ALL 180 champions across all roles.
// Data split by role in ./champions/ directory.

import { adcChampions } from './champions/adc';
import { midChampions } from './champions/mid';
import { topChampions } from './champions/top';
import { jungleChampions } from './champions/jungle';
import { supportChampions } from './champions/support';

export type { ChampionCoaching } from './champions/adc';
import type { ChampionCoaching } from './champions/adc';

// Merge all role databases into one unified lookup
const championCoachingDB: Record<string, ChampionCoaching> = {
  ...adcChampions,
  ...midChampions,
  ...topChampions,
  ...jungleChampions,
  ...supportChampions,
};

// ── Lookup Functions ──

export function getChampionCoaching(championName: string): ChampionCoaching | null {
  return championCoachingDB[championName] ?? null;
}

export function getChampionTradingTip(championName: string, gameTime: number): string | null {
  const coaching = championCoachingDB[championName];
  if (!coaching) return null;

  if (gameTime < 900) {
    return coaching.tradingPatterns[Math.floor(Math.random() * coaching.tradingPatterns.length)];
  }
  if (gameTime < 1800) {
    return coaching.midGame;
  }
  return coaching.lateGame;
}

export function getChampionCombo(championName: string): string | null {
  const coaching = championCoachingDB[championName];
  if (!coaching || coaching.combos.length === 0) return null;
  return coaching.combos[0];
}

export function getChampionPowerSpikeTip(championName: string, level: number): string | null {
  const coaching = championCoachingDB[championName];
  if (!coaching) return null;

  for (const reminder of coaching.powerSpikeReminders) {
    const levelMatch = reminder.match(/Level (\d+)/i);
    if (levelMatch && parseInt(levelMatch[1], 10) === level) {
      return reminder;
    }
  }
  return null;
}

export function getChampionMistakeWarning(championName: string): string | null {
  const coaching = championCoachingDB[championName];
  if (!coaching || coaching.commonMistakes.length === 0) return null;
  return coaching.commonMistakes[Math.floor(Math.random() * coaching.commonMistakes.length)];
}

export function getAllCoachedChampions(): string[] {
  return Object.keys(championCoachingDB);
}

export function getChampionCount(): number {
  return Object.keys(championCoachingDB).length;
}
