import { getState } from './state.js';
import { isSameDay, isSameWeek } from './utils.js';

function statCardHTML(icon, label, value) {
  return `
    <div class="stat-card">
      <span class="stat-icon">${icon}</span>
      <p class="stat-value">${value}</p>
      <p class="stat-label">${label}</p>
    </div>
  `;
}

export function renderStatsView(container) {
  const { sessions, tasks } = getState();
  const workSessions = sessions.filter((s) => s.type === 'work');

  const todayPomodoros = workSessions.filter((s) => isSameDay(s.completedAt)).length;
  const weekPomodoros = workSessions.filter((s) => isSameWeek(s.completedAt)).length;
  const totalPomodoros = workSessions.length;
  const totalFocusMin = workSessions.reduce((sum, s) => sum + s.durationMin, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;

  const hours = Math.floor(totalFocusMin / 60);
  const minutes = Math.round(totalFocusMin % 60);
  const focusLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  container.innerHTML = `
    <h2 class="view-title">Estadísticas</h2>
    <div class="stats-grid">
      ${statCardHTML('🍅', 'Pomodoros hoy', todayPomodoros)}
      ${statCardHTML('📅', 'Pomodoros esta semana', weekPomodoros)}
      ${statCardHTML('🏆', 'Pomodoros totales', totalPomodoros)}
      ${statCardHTML('⏳', 'Tiempo de foco total', focusLabel)}
      ${statCardHTML('✅', 'Tareas completadas', completedTasks)}
    </div>
    ${
      totalPomodoros === 0
        ? `<p class="empty-hint">Todavía no completaste ningún pomodoro. ¡Arrancá el timer!</p>`
        : ''
    }
  `;
}
