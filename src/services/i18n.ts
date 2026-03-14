// ── Internationalization: Spanish/English support ──

export type Language = 'es' | 'en';

let currentLang: Language = 'es'; // Default: Spanish

export function setLanguage(lang: Language): void {
  currentLang = lang;
}

export function getLanguage(): Language {
  return currentLang;
}

export function getSpeechLang(): string {
  return currentLang === 'es' ? 'es-MX' : 'en-US';
}

// ── Translation maps ──

const translations: Record<string, Record<Language, string>> = {
  // Voice coach rewrites
  'recall_low': {
    en: 'Recall now, you\'re too low!',
    es: 'Recallea ya, estas muy bajo de vida!',
  },
  'overextended': {
    en: 'You\'re too far up, fall back!',
    es: 'Estas muy adelantado, retrocede!',
  },
  'gold_recall': {
    en: 'You have a lot of gold, recall and buy!',
    es: 'Tienes mucho oro, recallea y compra!',
  },
  'low_gold_recall': {
    en: 'You\'re low with gold to spend, recall!',
    es: 'Estas bajo y con oro, recallea!',
  },
  'no_resources': {
    en: 'No health, no mana, get out of there!',
    es: 'Sin vida, sin mana, sal de ahi!',
  },
  'enemy_dragon': {
    en: 'They got dragon. Set up for the next one.',
    es: 'Tomaron dragon. Prepara el siguiente.',
  },
  'enemy_baron': {
    en: 'They have Baron! Play safe, clear waves, don\'t fight.',
    es: 'Tienen Baron! Juega seguro, limpia oleadas, no pelees.',
  },
  'enemy_fed': {
    en: 'Careful, {0} is fed. Don\'t fight them alone.',
    es: 'Cuidado, {0} esta fed. No pelees solo contra el.',
  },
  'low_cs': {
    en: 'Focus on last hitting, your CS is low.',
    es: 'Concentra en el farmeo, tu CS esta bajo.',
  },
  'jungler_side': {
    en: 'Jungler is probably {0} side, be careful.',
    es: 'El jungler anda por {0}, ten cuidado.',
  },
  'tough_matchup': {
    en: 'Tough lane against {0}. Play safe.',
    es: 'Linea dificil contra {0}. Juega seguro.',
  },
  'ganked': {
    en: 'You got ganked by {0} and {1}. Ward more and watch the map.',
    es: 'Te gankearon {0} y {1}. Wardea mas y mira el mapa.',
  },
  'solo_killed': {
    en: 'Solo killed by {0}. Don\'t take that fight again.',
    es: 'Te mato {0} solo. No tomes esa pelea de nuevo.',
  },
  'collapsed': {
    en: 'You got collapsed on. Watch your positioning.',
    es: 'Te colapsaron encima. Cuida tu posicionamiento.',
  },
  'freeze': {
    en: 'Freeze the wave, don\'t push.',
    es: 'Congela la oleada, no pushees.',
  },
  'lose_trade': {
    en: 'You lose that trade early, don\'t take it.',
    es: 'Pierdes ese tradeo temprano, no lo tomes.',
  },
  'no_vision_pushed': {
    en: 'You have no vision and you\'re pushed up. Back off.',
    es: 'No tienes vision y estas pusheado. Retrocede.',
  },
  'look_recall': {
    en: 'Look for a recall window.',
    es: 'Busca un momento para recallear.',
  },
  'bad_push': {
    en: 'Bad push, the wave was against you.',
    es: 'Mal push, la oleada estaba en tu contra.',
  },
  'unnecessary_dive': {
    en: 'Unnecessary dive, that was too risky.',
    es: 'Dive innecesario, fue muy arriesgado.',
  },
  'too_much_damage': {
    en: 'You took too much damage in that trade.',
    es: 'Comiste mucho dano en ese tradeo.',
  },
  'bad_fight': {
    en: 'Bad fight, you had no cooldowns or were outnumbered.',
    es: 'Mala pelea, no tenias cooldowns o eran mas.',
  },

  // UI strings
  'ui_waiting': {
    en: 'Waiting for game to start...',
    es: 'Esperando que inicie la partida...',
  },
  'ui_polling': {
    en: 'Polling game client',
    es: 'Buscando cliente del juego',
  },
  'ui_loading': {
    en: 'Game Loading',
    es: 'Cargando Partida',
  },
  'ui_analyzing_matchup': {
    en: 'Analyzing matchup and preparing coaching...',
    es: 'Analizando matchup y preparando coaching...',
  },
  'ui_toggle_overlay': {
    en: 'to toggle overlay',
    es: 'para mostrar/ocultar overlay',
  },
  'ui_ai_coach': {
    en: 'AI Coach',
    es: 'Coach IA',
  },
  'ui_ready': {
    en: 'READY',
    es: 'LISTO',
  },
  'ui_thinking': {
    en: 'THINKING',
    es: 'PENSANDO',
  },
  'ui_analyzing': {
    en: 'ANALYZING',
    es: 'ANALIZANDO',
  },
  'ui_coaching': {
    en: 'COACHING',
    es: 'ACONSEJANDO',
  },
  'ui_standing_by': {
    en: 'AI coach standing by...',
    es: 'Coach IA en espera...',
  },
  'ui_processing': {
    en: 'Processing game state...',
    es: 'Procesando estado del juego...',
  },
  'ui_connected': {
    en: 'Connected',
    es: 'Conectado',
  },
  'ui_disconnected': {
    en: 'Disconnected',
    es: 'Desconectado',
  },
  'ui_early_game': {
    en: 'Early Game',
    es: 'Fase Temprana',
  },
  'ui_mid_game': {
    en: 'Mid Game',
    es: 'Fase Media',
  },
  'ui_late_game': {
    en: 'Late Game',
    es: 'Fase Tardia',
  },
  'ui_post_game': {
    en: 'Post Game',
    es: 'Post Partida',
  },
  'ui_enemy_threats': {
    en: 'Enemy Threats',
    es: 'Amenazas Enemigas',
  },
  'ui_farm_tracker': {
    en: 'Farm Tracker',
    es: 'Tracker de Farmeo',
  },
  'ui_cs_min': {
    en: 'CS/min',
    es: 'CS/min',
  },
  'ui_efficiency': {
    en: 'Efficiency',
    es: 'Eficiencia',
  },
  'ui_jungle_tracker': {
    en: 'Jungle Tracker',
    es: 'Tracker de Jungla',
  },
  'ui_gank_risk': {
    en: 'Gank Risk',
    es: 'Riesgo de Gank',
  },
  'ui_objectives': {
    en: 'Objectives',
    es: 'Objetivos',
  },
  'ui_matchup_analysis': {
    en: 'Matchup Analysis',
    es: 'Analisis de Matchup',
  },
  'ui_difficulty': {
    en: 'Difficulty',
    es: 'Dificultad',
  },
  'ui_power_spikes': {
    en: 'Power Spikes',
    es: 'Picos de Poder',
  },
  'ui_post_game_report': {
    en: 'Post-Game Report',
    es: 'Reporte Post-Partida',
  },
  'ui_performance_grades': {
    en: 'Performance Grades',
    es: 'Calificaciones',
  },
  'ui_key_stats': {
    en: 'Key Stats',
    es: 'Estadisticas Clave',
  },
  'ui_improvement_tips': {
    en: 'Improvement Tips',
    es: 'Tips de Mejora',
  },
  'ui_key_mistakes': {
    en: 'Key Mistakes',
    es: 'Errores Clave',
  },
  'ui_close_report': {
    en: 'Close Report',
    es: 'Cerrar Reporte',
  },
  'ui_game_duration': {
    en: 'Game Duration',
    es: 'Duracion de Partida',
  },
  'ui_mic_hold': {
    en: 'Hold to talk',
    es: 'Manten para hablar',
  },
  'ui_mic_listening': {
    en: 'Listening...',
    es: 'Escuchando...',
  },
  'ui_mic_processing': {
    en: 'Processing...',
    es: 'Procesando...',
  },
  'ui_voice_on': {
    en: 'Voice ON',
    es: 'Voz ON',
  },
  'ui_voice_off': {
    en: 'Voice OFF',
    es: 'Voz OFF',
  },

  // Local answers
  'answer_build_gold': {
    en: 'You have {0} gold. Recall and buy your core items.',
    es: 'Tienes {0} de oro. Recallea y compra tus items core.',
  },
  'answer_build_farm': {
    en: 'Keep farming for your next item component.',
    es: 'Sigue farmeando para tu siguiente componente.',
  },
  'answer_play_safe': {
    en: 'Play safe, focus on CS, and track the enemy jungler.',
    es: 'Juega seguro, concentrate en el CS y trackea al jungler enemigo.',
  },
  'answer_jungler_risk': {
    en: 'Enemy jungler is likely {0} side. Gank risk is {1}. Ward the river.',
    es: 'El jungler enemigo anda por {0}. Riesgo de gank {1}. Wardea el rio.',
  },
  'answer_ward': {
    en: 'Ward the river and pixel brush. Track the jungler.',
    es: 'Wardea el rio y el bush del pixel. Trackea al jungler.',
  },
  'answer_no_threats': {
    en: 'No one is particularly fed. Keep playing well.',
    es: 'Nadie esta particularmente fed. Sigue jugando bien.',
  },
  'answer_threats': {
    en: 'Watch out for {0}. They\'re the biggest threats.',
    es: 'Cuidado con {0}. Son las mayores amenazas.',
  },
  'answer_teamfight': {
    en: 'Focus on positioning. Stay with your team near objectives.',
    es: 'Concentrate en el posicionamiento. Quedate con tu equipo cerca de objetivos.',
  },
  'answer_default': {
    en: 'Focus on fundamentals: farm, ward, track jungler. Play to your win condition.',
    es: 'Concentrate en los fundamentales: farmea, wardea, trackea al jungler.',
  },
};

export function t(key: string, ...args: (string | number)[]): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[currentLang] ?? entry['en'] ?? key;
  for (let i = 0; i < args.length; i++) {
    text = text.replace(`{${i}}`, String(args[i]));
  }
  return text;
}

// Side labels for jungle
export function translateSide(side: string): string {
  if (currentLang !== 'es') return side;
  const map: Record<string, string> = {
    top: 'arriba',
    mid: 'medio',
    bot: 'abajo',
    topside: 'lado superior',
    botside: 'lado inferior',
  };
  return map[side] ?? side;
}

export const i18n = { t, setLanguage, getLanguage, getSpeechLang, translateSide };
