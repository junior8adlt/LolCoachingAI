import type { AllGameData } from '../types/game';
import type { CoachingTip, TipPriority, TipCategory, JunglePrediction, FarmingStats, ObjectiveInfo, ThreatAssessment } from '../types/coaching';
import type { LaneWaveInfo } from './waveEngine';
import { getLanguage } from './i18n';

// ── Claude Coach ──
// Claude is the REAL coach voice. Local engines feed context.
// EVENT-DRIVEN: urgent situations trigger Claude immediately.
// SHORT-TERM MEMORY: tracks last 5 tips to avoid contradictions.

const BACKEND_URL = 'http://localhost:8420';

export interface CoachContext {
  champion: string;
  level: number;
  hp: number;
  maxHp: number;
  gold: number;
  cs: number;
  csPerMin: number;
  kills: number;
  deaths: number;
  assists: number;
  items: string[];

  enemyChampion: string | null;
  enemyLevel: number;
  enemyKills: number;
  enemyDeaths: number;
  enemyIsDead: boolean;
  enemyItems: string[];

  waveState: string;
  junglePrediction: string;
  gankRisk: number;
  threats: string[];
  objectives: string[];
  visionQuality: string;
  fightAssessment: string;
  teamState: string;

  gameTime: number;
  gamePhase: string;

  // Event-driven trigger
  urgentEvent: string | null;  // "teamfight", "kill_window", "objective_contest", "gank_incoming"
}

// ── Short-term memory ──
const coachMemory: string[] = [];  // Last 5 tips Claude gave
const MAX_MEMORY = 5;

function addToMemory(tip: string): void {
  coachMemory.push(tip);
  if (coachMemory.length > MAX_MEMORY) coachMemory.shift();
}

function getMemoryContext(): string {
  if (coachMemory.length === 0) return 'No previous tips.';
  return coachMemory.map((t, i) => `${i + 1}. ${t}`).join('\n');
}

// ── Timing ──
let tipCounter = 0;
let lastClaudeCall = 0;
const NORMAL_INTERVAL = 12000;   // 12s for normal coaching
const URGENT_INTERVAL = 3000;    // 3s for urgent events (teamfight, kill window)

export async function getClaudeCoaching(
  context: CoachContext
): Promise<CoachingTip | null> {
  const now = Date.now();

  // Determine interval based on urgency
  const interval = context.urgentEvent ? URGENT_INTERVAL : NORMAL_INTERVAL;
  if (now - lastClaudeCall < interval) return null;
  lastClaudeCall = now;

  const lang = getLanguage();
  const langInstruction = lang === 'es'
    ? 'Responde SIEMPRE en espanol. Habla como un coach profesional de LoL. Maximo 1 oracion corta y directa. Usa lenguaje de gaming (farmear, tradear, pushear, wardear). NO uses asteriscos, NO markdown, NO emojis, NO digas bro. Texto plano solamente. NO repitas lo que ya dijiste.'
    : 'Reply in English. Professional LoL coach. Max 1 short sentence. NO asterisks, NO markdown, NO emojis, NO bro. Plain text only.';

  const urgentPrefix = context.urgentEvent
    ? `\n⚠️ URGENT EVENT: ${context.urgentEvent} - respond to THIS specifically.\n`
    : '';

  const prompt = `${urgentPrefix}
Game state:
- You: ${context.champion} lvl${context.level}, ${context.kills}/${context.deaths}/${context.assists}, ${context.cs}CS (${context.csPerMin}/min), ${Math.round(context.hp)}/${Math.round(context.maxHp)}HP, ${Math.round(context.gold)}g
- Items: ${context.items.join(', ') || 'starting items'}
- Enemy: ${context.enemyChampion ?? 'unknown'} lvl${context.enemyLevel}, ${context.enemyKills}/${context.enemyDeaths}${context.enemyIsDead ? ' (DEAD)' : ''}
- Enemy items: ${context.enemyItems.join(', ') || 'unknown'}
- Wave: ${context.waveState}
- Jungle: ${context.junglePrediction} (gank risk: ${Math.round(context.gankRisk * 100)}%)
- Threats: ${context.threats.join(', ') || 'none'}
- Objectives: ${context.objectives.join(', ') || 'none'}
- Vision: ${context.visionQuality}
- Fight: ${context.fightAssessment}
- Team: ${context.teamState}
- Time: ${Math.floor(context.gameTime / 60)}:${Math.floor(context.gameTime % 60).toString().padStart(2, '0')} (${context.gamePhase})

Your last ${coachMemory.length} tips (DO NOT REPEAT these):
${getMemoryContext()}

${langInstruction}

RULES:
- ALWAYS give a coaching tip. Never respond empty or with "---"
- Don't say generic things like "play safe" or "ward river"
- Be SPECIFIC: mention champion names, ability names, gold amounts, levels
- Give tips about: combos, trading patterns, wave management, item builds, power spikes, roam timings, objective setup
- If enemy is a specific champion, mention their key threat (hook, burst, engage, etc)
- If urgent event: respond to IT specifically`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${BACKEND_URL}/api/coaching/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: prompt,
        language: lang,
        game_state: {},
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;

    const data = await response.json();
    const answer = data.answer?.trim();

    // Skip empty or too-short responses
    if (!answer || answer.length < 5) return null;
    // If Claude still says "---" despite instructions, skip
    if (answer.trim() === '---') return null;

    // Add to memory
    addToMemory(answer);

    tipCounter++;
    return {
      id: `claude-${now}-${tipCounter}`,
      message: answer,
      priority: context.urgentEvent ? 'danger' : inferPriority(answer),
      category: inferCategory(answer),
      timestamp: now,
      dismissed: false,
    };
  } catch {
    return null;
  }
}

// ── Urgent event detection (called from gameLoop) ──

export function detectUrgentEvent(
  allPlayers: { team: string; isDead: boolean; summonerName: string }[],
  myTeam: string,
  objectives: ObjectiveInfo[],
  gankRisk: number,
  recentKillCount: number
): string | null {
  // Teamfight happening (3+ kills in last 15s)
  if (recentKillCount >= 3) return 'teamfight_active';

  // Objective being contested (alive + both teams have people)
  const majorObj = objectives.find((o) =>
    (o.type === 'dragon' || o.type === 'baron') && o.status === 'alive'
  );
  const enemiesDead = allPlayers.filter((p) => p.team !== myTeam && p.isDead).length;
  const alliesDead = allPlayers.filter((p) => p.team === myTeam && p.isDead).length;

  // Number advantage → objective window
  if (majorObj && enemiesDead >= 2 && alliesDead <= 1) return 'objective_window';

  // High gank risk
  if (gankRisk >= 0.7) return 'gank_incoming';

  // Multiple enemies dead → push window
  if (enemiesDead >= 3) return 'push_window';

  // Multiple allies dead → danger
  if (alliesDead >= 3 && enemiesDead <= 1) return 'team_losing_fight';

  return null;
}

function inferPriority(msg: string): TipPriority {
  const lower = msg.toLowerCase();
  if (lower.includes('now') || lower.includes('ahora') || lower.includes('kill') || lower.includes('mata') || lower.includes('cuidado') || lower.includes('danger') || lower.includes('peligro')) return 'danger';
  if (lower.includes('advantage') || lower.includes('ventaja') || lower.includes('fight') || lower.includes('pelea') || lower.includes('tradea')) return 'warning';
  return 'info';
}

function inferCategory(msg: string): TipCategory {
  const lower = msg.toLowerCase();
  if (lower.includes('dragon') || lower.includes('baron') || lower.includes('objetivo')) return 'objective';
  if (lower.includes('ward') || lower.includes('vision')) return 'vision';
  if (lower.includes('cs') || lower.includes('farm')) return 'farming';
  if (lower.includes('trade') || lower.includes('fight') || lower.includes('pelea') || lower.includes('tradea')) return 'trading';
  if (lower.includes('recall') || lower.includes('recallea') || lower.includes('back')) return 'recall';
  if (lower.includes('gank') || lower.includes('jungle') || lower.includes('jungla')) return 'jungle';
  return 'general';
}

// Build context from all engine outputs
export function buildCoachContext(
  gameData: AllGameData,
  farmingStats: FarmingStats | null,
  waveInfo: LaneWaveInfo | undefined | null,
  junglePrediction: JunglePrediction | null,
  threats: ThreatAssessment[],
  objectives: ObjectiveInfo[],
  visionQuality: string,
  fightAssessment: string,
  teamState: string,
  gamePhase: string,
  urgentEvent: string | null = null
): CoachContext {
  const me = gameData.activePlayer;
  const myInfo = gameData.allPlayers.find((p) => p.summonerName === me.summonerName);
  const myTeam = myInfo?.team;
  // Find lane opponent - try position match first, fallback to any enemy
  const enemies = gameData.allPlayers.filter((p) => p.team !== myTeam);
  let laneOpponent = enemies.find(
    (p) => p.position === myInfo?.position && myInfo?.position !== '' && myInfo?.position !== 'NONE'
  );
  // If no position match (bot games etc), pick the enemy with matching role
  if (!laneOpponent && enemies.length > 0) {
    laneOpponent = enemies.find((p) => !p.isBot && p.position !== 'JUNGLE') ?? enemies[0];
  }

  const highThreats = threats.filter((t) => t.threatLevel === 'high');

  const objStrings = objectives.map((o) => {
    if (o.status === 'alive') return `${o.type} UP`;
    if (o.status === 'dead' && o.timer > 0) return `${o.type} in ${Math.ceil(o.timer)}s`;
    return null;
  }).filter(Boolean) as string[];

  return {
    champion: myInfo?.championName ?? 'Unknown',
    level: me.level,
    hp: me.championStats.currentHealth,
    maxHp: me.championStats.maxHealth,
    gold: me.currentGold,
    cs: farmingStats?.currentCS ?? 0,
    csPerMin: farmingStats?.csPerMin ?? 0,
    kills: myInfo?.scores.kills ?? 0,
    deaths: myInfo?.scores.deaths ?? 0,
    assists: myInfo?.scores.assists ?? 0,
    items: myInfo?.items.filter((i) => i.price >= 800).map((i) => i.displayName) ?? [],

    enemyChampion: laneOpponent?.championName ?? null,
    enemyLevel: laneOpponent?.level ?? 0,
    enemyKills: laneOpponent?.scores.kills ?? 0,
    enemyDeaths: laneOpponent?.scores.deaths ?? 0,
    enemyIsDead: laneOpponent?.isDead ?? false,
    enemyItems: laneOpponent?.items.filter((i) => i.price >= 800).map((i) => i.displayName) ?? [],

    waveState: waveInfo?.state ?? 'unknown',
    junglePrediction: junglePrediction ? `${junglePrediction.predictedSide} side (${Math.round(junglePrediction.confidence * 100)}%)` : 'unknown',
    gankRisk: junglePrediction?.gankRisk ?? 0.3,
    threats: highThreats.map((t) => `${t.championName} (${t.threatLevel})`),
    objectives: objStrings,
    visionQuality,
    fightAssessment,
    teamState,
    gameTime: gameData.gameData.gameTime,
    gamePhase,
    urgentEvent,
  };
}

export function resetClaudeCoach(): void {
  coachMemory.length = 0;
  lastClaudeCall = 0;
  tipCounter = 0;
}
