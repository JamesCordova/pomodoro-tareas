import './style.css';
import { initRouter, registerView } from './modules/router.js';
import { renderTimerView, tick } from './modules/timer.js';
import { renderTasksView } from './modules/tasks.js';
import { renderStatsView } from './modules/stats.js';
import { renderHistoryView } from './modules/history.js';
import { renderSettingsView } from './modules/settings.js';

registerView('timer', renderTimerView);
registerView('tasks', renderTasksView);
registerView('stats', renderStatsView);
registerView('history', renderHistoryView);
registerView('settings', renderSettingsView);

initRouter();

setInterval(tick, 250);
