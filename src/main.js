import './style.css';
import { initRouter, registerView } from './modules/router.js';
import { renderTimerView, tick } from './modules/timer.js';
import { renderTasksView } from './modules/tasks.js';
import { renderStatsView } from './modules/stats.js';
import { renderHistoryView } from './modules/history.js';
import { renderSettingsView } from './modules/settings.js';
import { getState, subscribe } from './modules/state.js';
import { applyTheme } from './modules/theme.js';
import { icon } from './modules/icons.js';

document.querySelectorAll('.nav-icon[data-icon]').forEach((el) => {
  el.innerHTML = icon(el.dataset.icon, 'icon');
});

registerView('timer', renderTimerView);
registerView('tasks', renderTasksView);
registerView('stats', renderStatsView);
registerView('history', renderHistoryView);
registerView('settings', renderSettingsView);

applyTheme(getState().settings.theme);
subscribe((state) => applyTheme(state.settings.theme));

initRouter();

setInterval(tick, 250);
