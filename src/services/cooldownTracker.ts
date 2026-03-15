import type { GameEvent, PlayerInfo } from '../types/game';

// ── Cooldown Tracker ──
// Tracks enemy summoner spell and ultimate cooldowns.
// Creates kill windows when key abilities are down.

// Summoner spell cooldowns (seconds)
const SUMMONER_COOLDOWNS: Record<string, number> = {
  // English names
  flash: 300,
  heal: 240,
  barrier: 180,
  exhaust: 210,
  ignite: 180,
  teleport: 360,
  cleanse: 210,
  ghost: 210,
  smite: 90,
  // Spanish names (Riot API returns localized names)
  destello: 300,
  curación: 240,
  barrera: 180,
  extenuación: 210,
  incendiar: 180,
  teleportación: 360,
  purificar: 210,
  fantasmal: 210,
  castigo: 90,
};

import { getUltCooldown } from '../data/cooldowns';

export interface EnemyCooldowns {
  championName: string;
  summonerName: string;
  flashDown: boolean;
  flashUpTime: number;       // game time when flash comes back
  ultDown: boolean;
  ultUpTime: number;         // game time when ult comes back
  lastDeathTime: number;     // when they last died
  summonerSpell1: string;
  summonerSpell2: string;
}

interface CooldownState {
  enemies: Map<string, EnemyCooldowns>;
  processedEvents: Set<number>;
}

const state: CooldownState = {
  enemies: new Map(),
  processedEvents: new Set(),
};

function isFlashSpell(spellName: string): boolean {
  const lower = spellName.toLowerCase();
  return lower.includes('flash') || lower.includes('destello');
}

export function getSpellCooldown(spellName: string): number {
  const lower = spellName.toLowerCase();
  for (const [key, cd] of Object.entries(SUMMONER_COOLDOWNS)) {
    if (lower.includes(key)) return cd;
  }
  return 300; // default to flash CD if unknown
}

// ── Initialize enemies ──

export function initCooldowns(enemies: PlayerInfo[]): void {
  for (const enemy of enemies) {
    if (!state.enemies.has(enemy.summonerName)) {
      const spell1 = enemy.summonerSpells.summonerSpellOne.displayName;
      const spell2 = enemy.summonerSpells.summonerSpellTwo.displayName;

      state.enemies.set(enemy.summonerName, {
        championName: enemy.championName,
        summonerName: enemy.summonerName,
        flashDown: false,
        flashUpTime: 0,
        ultDown: false,
        ultUpTime: 0,
        lastDeathTime: 0,
        summonerSpell1: spell1,
        summonerSpell2: spell2,
      });
    }
  }
}

// ── Process events to detect cooldown usage ──

export function updateCooldowns(events: GameEvent[], gameTime: number, enemies: PlayerInfo[]): void {
  initCooldowns(enemies);

  for (const event of events) {
    if (state.processedEvents.has(event.EventID)) continue;
    state.processedEvents.add(event.EventID);

    // When an enemy DIES, they likely used flash trying to escape
    // Mark flash as potentially down
    if (event.EventName === 'ChampionKill' && event.VictimName) {
      const cd = state.enemies.get(event.VictimName);
      if (cd) {
        cd.lastDeathTime = event.EventTime;

        // High probability they used flash before dying
        const hasFlash = isFlashSpell(cd.summonerSpell1) || isFlashSpell(cd.summonerSpell2);
        if (hasFlash && !cd.flashDown) {
          cd.flashDown = true;
          cd.flashUpTime = event.EventTime + 300; // Flash CD = 5 min
        }

        // If they're level 6+, their ult was probably used in the fight
        const enemyInfo = enemies.find((e) => e.summonerName === event.VictimName);
        if (enemyInfo && enemyInfo.level >= 6) {
          cd.ultDown = true;
          // Use REAL ult cooldown from champion database
          const ultCD = getUltCooldown(enemyInfo.championName, enemyInfo.level);
          cd.ultUpTime = event.EventTime + ultCD;
        }
      }
    }
  }

  // Update cooldown states based on time passing
  for (const [_name, cd] of state.enemies) {
    if (cd.flashDown && gameTime >= cd.flashUpTime) {
      cd.flashDown = false;
    }
    if (cd.ultDown && gameTime >= cd.ultUpTime) {
      cd.ultDown = false;
    }
  }
}

// ── Query cooldowns ──

export function getEnemyCooldowns(summonerName: string): EnemyCooldowns | null {
  return state.enemies.get(summonerName) ?? null;
}

export function getLaneEnemyCooldowns(
  enemies: PlayerInfo[],
  myPosition: string
): EnemyCooldowns | null {
  const laneEnemy = enemies.find((e) => e.position === myPosition);
  if (!laneEnemy) return null;
  return state.enemies.get(laneEnemy.summonerName) ?? null;
}

export function getEnemiesWithFlashDown(): EnemyCooldowns[] {
  const result: EnemyCooldowns[] = [];
  for (const [_name, cd] of state.enemies) {
    if (cd.flashDown) result.push(cd);
  }
  return result;
}

export function getEnemiesWithUltDown(): EnemyCooldowns[] {
  const result: EnemyCooldowns[] = [];
  for (const [_name, cd] of state.enemies) {
    if (cd.ultDown) result.push(cd);
  }
  return result;
}

export function getKillWindow(
  enemyName: string,
  gameTime: number
): { hasWindow: boolean; reason: string } {
  const cd = state.enemies.get(enemyName);
  if (!cd) return { hasWindow: false, reason: '' };

  const reasons: string[] = [];

  if (cd.flashDown) {
    const timeLeft = Math.ceil(cd.flashUpTime - gameTime);
    reasons.push(`Flash down (${timeLeft}s)`);
  }

  if (cd.ultDown) {
    const timeLeft = Math.ceil(cd.ultUpTime - gameTime);
    reasons.push(`Ult down (${timeLeft}s)`);
  }

  if (reasons.length > 0) {
    return {
      hasWindow: true,
      reason: `${cd.championName}: ${reasons.join(', ')}. Kill window!`,
    };
  }

  return { hasWindow: false, reason: '' };
}

export function resetCooldowns(): void {
  state.enemies.clear();
  state.processedEvents.clear();
}
