export type ClearType = '3-camp' | '5-camp' | 'full-clear';
export type PreferredSide = 'bot' | 'top' | 'flexible';

export interface ClearPath {
  type: ClearType;
  route: string[];
  ganksAt: number[];
  preferredSide: PreferredSide;
}

const junglePathDatabase: Record<string, ClearPath> = {
  'Lee Sin': {
    type: '3-camp',
    route: ['Red Buff', 'Raptors', 'Gromp/Gank'],
    ganksAt: [180, 210, 300],
    preferredSide: 'flexible',
  },
  Elise: {
    type: '3-camp',
    route: ['Red Buff', 'Blue Buff', 'Gromp'],
    ganksAt: [180, 210, 270],
    preferredSide: 'top',
  },
  'Jarvan IV': {
    type: '3-camp',
    route: ['Red Buff', 'Raptors', 'Gromp/Gank'],
    ganksAt: [180, 210, 300],
    preferredSide: 'flexible',
  },
  'Xin Zhao': {
    type: '3-camp',
    route: ['Red Buff', 'Blue Buff', 'Gromp'],
    ganksAt: [180, 210, 270],
    preferredSide: 'top',
  },
  "Rek'Sai": {
    type: '3-camp',
    route: ['Red Buff', 'Krugs', 'Raptors'],
    ganksAt: [200, 240, 300],
    preferredSide: 'bot',
  },
  "Kha'Zix": {
    type: '5-camp',
    route: ['Red Buff', 'Krugs', 'Raptors', 'Wolves', 'Blue Buff'],
    ganksAt: [210, 270, 360],
    preferredSide: 'flexible',
  },
  Evelynn: {
    type: 'full-clear',
    route: ['Blue Buff', 'Gromp', 'Wolves', 'Raptors', 'Red Buff', 'Krugs'],
    ganksAt: [360, 420],
    preferredSide: 'bot',
  },
  Diana: {
    type: 'full-clear',
    route: ['Blue Buff', 'Gromp', 'Wolves', 'Raptors', 'Red Buff', 'Krugs'],
    ganksAt: [300, 360],
    preferredSide: 'bot',
  },
  Hecarim: {
    type: '5-camp',
    route: ['Blue Buff', 'Gromp', 'Wolves', 'Raptors', 'Red Buff'],
    ganksAt: [240, 270, 330],
    preferredSide: 'top',
  },
  Vi: {
    type: '5-camp',
    route: ['Red Buff', 'Krugs', 'Raptors', 'Wolves', 'Blue Buff'],
    ganksAt: [210, 270, 360],
    preferredSide: 'flexible',
  },
  Viego: {
    type: 'full-clear',
    route: ['Red Buff', 'Krugs', 'Raptors', 'Wolves', 'Blue Buff', 'Gromp'],
    ganksAt: [300, 360, 420],
    preferredSide: 'bot',
  },
  'Master Yi': {
    type: 'full-clear',
    route: ['Red Buff', 'Krugs', 'Raptors', 'Wolves', 'Blue Buff', 'Gromp'],
    ganksAt: [360, 420],
    preferredSide: 'bot',
  },
  Kayn: {
    type: 'full-clear',
    route: ['Red Buff', 'Raptors', 'Krugs', 'Wolves', 'Blue Buff', 'Gromp'],
    ganksAt: [270, 330, 390],
    preferredSide: 'flexible',
  },
  Graves: {
    type: 'full-clear',
    route: ['Red Buff', 'Krugs', 'Raptors', 'Wolves', 'Blue Buff', 'Gromp'],
    ganksAt: [300, 360],
    preferredSide: 'flexible',
  },
  'Nunu & Willump': {
    type: '3-camp',
    route: ['Red Buff', 'Raptors', 'Gank Mid/Bot'],
    ganksAt: [150, 180, 240],
    preferredSide: 'bot',
  },
};

export function getJunglePath(championName: string): ClearPath | null {
  return junglePathDatabase[championName] ?? null;
}

export function getExpectedGankTime(
  championName: string,
  gankIndex: number
): number | null {
  const path = junglePathDatabase[championName];
  if (!path) return null;
  if (gankIndex < 0 || gankIndex >= path.ganksAt.length) return null;
  return path.ganksAt[gankIndex];
}

export function getFirstGankTime(championName: string): number {
  const path = junglePathDatabase[championName];
  if (!path || path.ganksAt.length === 0) return 210;
  return path.ganksAt[0];
}

export function getClearType(championName: string): ClearType | null {
  const path = junglePathDatabase[championName];
  if (!path) return null;
  return path.type;
}

export function getPreferredSide(championName: string): PreferredSide {
  const path = junglePathDatabase[championName];
  if (!path) return 'flexible';
  return path.preferredSide;
}

export function isEarlyGanker(championName: string): boolean {
  const path = junglePathDatabase[championName];
  if (!path) return false;
  return path.type === '3-camp' && path.ganksAt[0] <= 200;
}

export function getAllTrackedJunglers(): string[] {
  return Object.keys(junglePathDatabase);
}
