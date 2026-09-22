import { getState } from './state.js';
import { formatDateLabel, formatClock } from './utils.js';
import { icon } from './icons.js';

const TYPE_META = {
  work: { icon: icon('flame', 'icon'), label: 'Foco', color: 'var(--color-work)' },
  short: { icon: icon('coffee', 'icon'), label: 'Descanso corto', color: 'var(--color-short)' },
  long: { icon: icon('trees', 'icon'), label: 'Descanso largo', color: 'var(--color-long)' },
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
                    <span class="history-icon" style="--stat-color: ${meta.color}">${meta.icon}</span>
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
