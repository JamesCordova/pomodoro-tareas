import { getState } from './state.js';
import { formatDateLabel, formatClock } from './utils.js';

const TYPE_META = {
  work: { icon: '🍅', label: 'Foco' },
  short: { icon: '☕', label: 'Descanso corto' },
  long: { icon: '🌿', label: 'Descanso largo' },
};

export function renderHistoryView(container) {
  const { sessions } = getState();

  if (!sessions.length) {
    container.innerHTML = `
      <h2 class="view-title">Historial</h2>
      <p class="empty-hint">Todavía no hay sesiones registradas.</p>
    `;
    return;
  }

  const groups = new Map();
  for (const session of sessions) {
    const label = formatDateLabel(session.completedAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(session);
  }

  const groupsHTML = Array.from(groups.entries())
    .map(
      ([dateLabel, items]) => `
        <section class="history-group">
          <h3 class="section-label">${dateLabel}</h3>
          <ul class="history-list">
            ${items
              .map((s) => {
                const meta = TYPE_META[s.type];
                return `
                  <li class="history-item">
                    <span class="history-icon">${meta.icon}</span>
                    <div class="history-body">
                      <p class="history-title">${meta.label}${s.taskTitle ? ` · ${escapeHTML(s.taskTitle)}` : ''}</p>
                      <p class="history-meta">${s.durationMin} min</p>
                    </div>
                    <span class="history-time">${formatClock(s.completedAt)}</span>
                  </li>
                `;
              })
              .join('')}
          </ul>
        </section>
      `
    )
    .join('');

  container.innerHTML = `
    <h2 class="view-title">Historial</h2>
    ${groupsHTML}
  `;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
