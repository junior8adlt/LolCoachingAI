import type { GameEvent, PlayerInfo } from '../types/game';
import type { CoachingTip } from '../types/coaching';
import { getChampionMeta, type ChampionArchetype } from '../data/championMeta';

// ── Teamfight Phase Types ──

export type TeamfightPhase =
  | 'no_fight'
  | 'fight_brewing'
  | 'fight_active'
  | 'fight_winning'
  | 'fight_losing'
  | 'fight_cleanup'
  | 'disengage';

export interface TeamfightState {
  phase: TeamfightPhase;
  allyKillsInFight: number;
  enemyKillsInFight: number;
  alliesAlive: number;
  enemiesAlive: number;
  shouldEngage: boolean;
  shouldDisengage: boolean;
  focusTarget: string | null;
  avoidTarget: string | null;
  positioning: string;
}

// ── Internal State ──

interface KillRecord {
  killerName: string;
  victimName: string;
  assisters: string[];
  eventTime: number;
  killerTeam: 'ORDER' | 'CHAOS' | null;
}

const FIGHT_WINDOW_SECONDS = 15;
const CLEANUP_KILL_DIFF = 3;

let recentKills: KillRecord[] = [];
let lastProcessedEventId = -1;
let tipIdCounter = 0;

const TANK_ARCHETYPES: ChampionArchetype[] = ['tank', 'juggernaut'];
const CARRY_ARCHETYPES: ChampionArchetype[] = ['marksman', 'mage', 'assassin', 'artillery'];
const HIGH_DEFENSE_ITEM_KEYWORDS = [
  'armor', 'magic resist', 'health', 'thornmail', 'randuin',
  'frozen heart', 'spirit visage', 'force of nature', 'gargoyle',
  'warmog', 'sunfire', 'hollow radiance', 'jak\'sho',
  'dead man', 'iceborn', 'locket',
];

// ── Helper Functions ──

function findPlayerTeam(
  playerName: string,
  allPlayers: PlayerInfo[]
): 'ORDER' | 'CHAOS' | null {
  const player = allPlayers.find((p) => p.summonerName === playerName);
  return player ? player.team : null;
}

function getKDA(player: PlayerInfo): number {
  const deaths = Math.max(player.scores.deaths, 1);
  return (player.scores.kills + player.scores.assists) / deaths;
}

function isTankChampion(championName: string): boolean {
  const meta = getChampionMeta(championName);
  if (!meta) return false;
  return meta.archetypes.some((a) => TANK_ARCHETYPES.includes(a));
}

function isCarryChampion(championName: string): boolean {
  const meta = getChampionMeta(championName);
  if (!meta) return false;
  return meta.archetypes.some((a) => CARRY_ARCHETYPES.includes(a));
}

function hasHighDefenseItems(player: PlayerInfo): boolean {
  let defenseItemCount = 0;
  for (const item of player.items) {
    const descLower = item.rawDescription.toLowerCase();
    const nameLower = item.displayName.toLowerCase();
    const combined = descLower + ' ' + nameLower;
    if (HIGH_DEFENSE_ITEM_KEYWORDS.some((kw) => combined.includes(kw))) {
      defenseItemCount++;
    }
  }
  return defenseItemCount >= 2;
}

function getPrimaryArchetypeCategory(
  championName: string
): 'marksman' | 'assassin' | 'tank_bruiser' | 'mage' | 'support' | 'unknown' {
  const meta = getChampionMeta(championName);
  if (!meta) return 'unknown';

  const archetypes = meta.archetypes;
  const roles = meta.roles;

  if (archetypes.includes('marksman')) return 'marksman';
  if (archetypes.includes('assassin')) return 'assassin';
  if (
    archetypes.includes('tank') ||
    archetypes.includes('juggernaut') ||
    archetypes.includes('bruiser') ||
    archetypes.includes('diver')
  ) {
    return 'tank_bruiser';
  }
  if (archetypes.includes('mage') || archetypes.includes('artillery')) return 'mage';
  if (archetypes.includes('enchanter') || archetypes.includes('engage_support')) return 'support';
  if (roles.includes('support')) return 'support';
  if (roles.includes('adc')) return 'marksman';

  return 'unknown';
}

function getPositioningAdvice(championName: string): string {
  const category = getPrimaryArchetypeCategory(championName);

  switch (category) {
    case 'marksman':
      return 'Stay behind frontline. Auto the closest target.';
    case 'assassin':
      return 'Wait for enemy to use CC, then dive the carry.';
    case 'tank_bruiser':
      return 'Frontline. Engage and peel for your carry.';
    case 'mage':
      return 'Stay at max range. Hit AoE on grouped enemies.';
    case 'support':
      return 'Peel for your ADC. Save CC for divers.';
    default:
      return 'Position safely and follow up on your team.';
  }
}

function pruneOldKills(currentTime: number): void {
  recentKills = recentKills.filter(
    (k) => currentTime - k.eventTime <= FIGHT_WINDOW_SECONDS
  );
}

function countParticipants(kills: KillRecord[]): number {
  const names = new Set<string>();
  for (const kill of kills) {
    names.add(kill.killerName);
    names.add(kill.victimName);
    for (const assister of kill.assisters) {
      names.add(assister);
    }
  }
  return names.size;
}

// ── Focus / Avoid Target Selection ──

function selectFocusTarget(
  enemies: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS'
): string | null {
  const livingEnemies = enemies.filter(
    (p) => p.team !== myTeam && !p.isDead
  );
  if (livingEnemies.length === 0) return null;

  // Priority 1: Living enemy carries (ADC/APC) sorted by KDA descending
  const carries = livingEnemies.filter((p) => isCarryChampion(p.championName));
  if (carries.length > 0) {
    carries.sort((a, b) => getKDA(b) - getKDA(a));
    return carries[0].championName;
  }

  // Priority 2: Highest KDA non-tank enemy
  const nonTanks = livingEnemies.filter((p) => !isTankChampion(p.championName));
  if (nonTanks.length > 0) {
    nonTanks.sort((a, b) => getKDA(b) - getKDA(a));
    return nonTanks[0].championName;
  }

  // Priority 3: Lowest-HP tank (squishiest remaining)
  livingEnemies.sort((a, b) => getKDA(b) - getKDA(a));
  return livingEnemies[0].championName;
}

function selectAvoidTarget(
  enemies: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS'
): string | null {
  const livingEnemies = enemies.filter(
    (p) => p.team !== myTeam && !p.isDead
  );
  if (livingEnemies.length === 0) return null;

  // Avoid fed tanks with high defense items
  const fedTanks = livingEnemies.filter((p) => {
    if (!isTankChampion(p.championName)) return false;
    // "Fed" = high kills or the team is winning despite their deaths
    const isFed = p.scores.kills >= 3 || getKDA(p) >= 2.0;
    const hasDefense = hasHighDefenseItems(p);
    return isFed && hasDefense;
  });

  if (fedTanks.length > 0) {
    // Avoid the tankiest / most fed one
    fedTanks.sort((a, b) => getKDA(b) - getKDA(a));
    return fedTanks[0].championName;
  }

  // Avoid any champion with very high defensive itemization
  const defensiveEnemies = livingEnemies.filter((p) => hasHighDefenseItems(p));
  if (defensiveEnemies.length > 0) {
    defensiveEnemies.sort((a, b) => getKDA(b) - getKDA(a));
    return defensiveEnemies[0].championName;
  }

  return null;
}

// ── Main Export: Update Teamfight State ──

export function updateTeamfightState(
  events: GameEvent[],
  gameTime: number,
  allPlayers: PlayerInfo[],
  myTeam: 'ORDER' | 'CHAOS'
): TeamfightState {
  // Process new ChampionKill events
  for (const event of events) {
    if (event.EventID <= lastProcessedEventId) continue;
    lastProcessedEventId = event.EventID;

    if (event.EventName !== 'ChampionKill') continue;
    if (!event.KillerName || !event.VictimName) continue;

    const killerTeam = findPlayerTeam(event.KillerName, allPlayers);
    recentKills.push({
      killerName: event.KillerName,
      victimName: event.VictimName,
      assisters: event.Assisters ?? [],
      eventTime: event.EventTime,
      killerTeam,
    });
  }

  // Remove kills outside the rolling window
  pruneOldKills(gameTime);

  // Count alive players per team
  const alliesAlive = allPlayers.filter(
    (p) => p.team === myTeam && !p.isDead
  ).length;
  const enemiesAlive = allPlayers.filter(
    (p) => p.team !== myTeam && !p.isDead
  ).length;

  // Count kills in the current fight window per side
  let allyKillsInFight = 0;
  let enemyKillsInFight = 0;

  for (const kill of recentKills) {
    if (kill.killerTeam === myTeam) {
      allyKillsInFight++;
    } else if (kill.killerTeam !== null) {
      enemyKillsInFight++;
    }
  }

  const totalKillsInWindow = allyKillsInFight + enemyKillsInFight;
  const participants = countParticipants(recentKills);

  // Determine teamfight phase
  let phase: TeamfightPhase = 'no_fight';

  if (totalKillsInWindow === 0) {
    phase = 'no_fight';
  } else if (totalKillsInWindow === 1 && participants < 4) {
    // Single kill, not many people involved: skirmish / brewing
    phase = 'fight_brewing';
  } else if (totalKillsInWindow >= 2) {
    // Active teamfight
    const killDiff = allyKillsInFight - enemyKillsInFight;

    // Check for disengage conditions first
    const alliesDead = allPlayers.filter(
      (p) => p.team === myTeam && p.isDead
    ).length;
    const enemiesDead = allPlayers.filter(
      (p) => p.team !== myTeam && p.isDead
    ).length;

    const shouldDisengageByDeaths =
      alliesDead >= 2 && enemiesDead <= 1;
    const shouldDisengageByNumbers =
      alliesAlive <= 3 && enemiesAlive >= alliesAlive + 2;

    if (shouldDisengageByDeaths || shouldDisengageByNumbers) {
      phase = 'disengage';
    } else if (killDiff >= CLEANUP_KILL_DIFF) {
      // Won decisively, cleanup
      phase = 'fight_cleanup';
    } else if (killDiff <= -CLEANUP_KILL_DIFF) {
      // Lost decisively, disengage
      phase = 'disengage';
    } else if (killDiff > 0) {
      phase = 'fight_winning';
    } else if (killDiff < 0) {
      phase = 'fight_losing';
    } else {
      phase = 'fight_active';
    }
  } else {
    // 1 kill with many participants: fight is brewing
    phase = 'fight_brewing';
  }

  // Determine engagement decisions
  const shouldDisengage =
    phase === 'disengage' ||
    phase === 'fight_losing' ||
    (alliesAlive <= 2 && enemiesAlive >= 4);

  const shouldEngage =
    !shouldDisengage &&
    (phase === 'fight_winning' ||
      phase === 'fight_cleanup' ||
      (alliesAlive > enemiesAlive && phase !== 'no_fight'));

  // Select focus/avoid targets
  const focusTarget = selectFocusTarget(allPlayers, myTeam);
  const avoidTarget = selectAvoidTarget(allPlayers, myTeam);

  // Get positioning advice for the active player
  // We pick the first alive ally as a fallback; caller should use myChampion for tips
  const myPlayers = allPlayers.filter((p) => p.team === myTeam && !p.isDead);
  const representativeChampion = myPlayers.length > 0 ? myPlayers[0].championName : '';
  const positioning = getPositioningAdvice(representativeChampion);

  return {
    phase,
    allyKillsInFight,
    enemyKillsInFight,
    alliesAlive,
    enemiesAlive,
    shouldEngage,
    shouldDisengage,
    focusTarget,
    avoidTarget,
    positioning,
  };
}

// ── Generate Coaching Tip from Teamfight State ──

export function generateTeamfightTip(
  state: TeamfightState,
  myChampion: string
): CoachingTip | null {
  const positioning = getPositioningAdvice(myChampion);

  if (state.phase === 'no_fight') {
    return null;
  }

  let message = '';
  let priority: CoachingTip['priority'] = 'info';

  switch (state.phase) {
    case 'fight_brewing': {
      message = `Fight starting! ${positioning}`;
      if (state.focusTarget) {
        message += ` Look to focus ${state.focusTarget}.`;
      }
      priority = 'warning';
      break;
    }

    case 'fight_active': {
      message = `Teamfight! Score: ${state.allyKillsInFight}-${state.enemyKillsInFight}. ${positioning}`;
      if (state.focusTarget) {
        message += ` Focus ${state.focusTarget}.`;
      }
      if (state.avoidTarget) {
        message += ` Ignore ${state.avoidTarget}.`;
      }
      priority = 'warning';
      break;
    }

    case 'fight_winning': {
      message = `Winning fight ${state.allyKillsInFight}-${state.enemyKillsInFight}! Press the advantage.`;
      if (state.focusTarget) {
        message += ` Focus ${state.focusTarget} to close it out.`;
      }
      priority = 'info';
      break;
    }

    case 'fight_losing': {
      message = `Losing fight ${state.allyKillsInFight}-${state.enemyKillsInFight}. `;
      if (state.shouldDisengage) {
        message += 'Disengage now! Back off and regroup.';
      } else {
        message += `${positioning} Play safe and look for a pick.`;
      }
      if (state.avoidTarget) {
        message += ` Do NOT focus ${state.avoidTarget}.`;
      }
      priority = 'danger';
      break;
    }

    case 'fight_cleanup': {
      message = `Won the fight ${state.allyKillsInFight}-${state.enemyKillsInFight}! Clean up remaining enemies.`;
      if (state.focusTarget) {
        message += ` Chase down ${state.focusTarget}.`;
      }
      message += ' Push for objective after cleanup.';
      priority = 'info';
      break;
    }

    case 'disengage': {
      const aliveRatio = `${state.alliesAlive}v${state.enemiesAlive}`;
      message = `DISENGAGE! Score: ${state.allyKillsInFight}-${state.enemyKillsInFight}, alive: ${aliveRatio}. Fall back immediately. Do not chase.`;
      priority = 'danger';
      break;
    }
  }

  if (!message) return null;

  tipIdCounter++;
  return {
    id: `teamfight-${tipIdCounter}`,
    message,
    priority,
    category: 'teamfight',
    timestamp: Date.now(),
    dismissed: false,
  };
}

// ── Reset Engine State ──

export function resetTeamfightEngine(): void {
  recentKills = [];
  lastProcessedEventId = -1;
  tipIdCounter = 0;
}
