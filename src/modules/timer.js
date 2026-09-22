import { getState, setState } from './state.js';
import { formatTime, uid } from './utils.js';

const MODE_LABELS = {
  work: 'Foco',
  short: 'Descanso corto',
  long: 'Descanso largo',
};

function durationForMode(mode, settings) {
  if (mode === 'work') return settings.workMin * 60;
  if (mode === 'short') return settings.shortBreakMin * 60;
  return settings.longBreakMin * 60;
}

export function getRemainingSeconds(timer) {
  if (!timer.running || !timer.endTime) return timer.remaining;
  return Math.max(0, Math.round((timer.endTime - Date.now()) / 1000));
}

export function startTimer() {
  const state = getState();
  const remaining = getRemainingSeconds(state.timer);
  setState({
    timer: {
      ...state.timer,
      running: true,
      endTime: Date.now() + remaining * 1000,
    },
  });
}

export function pauseTimer() {
  const state = getState();
  const remaining = getRemainingSeconds(state.timer);
  setState({
    timer: { ...state.timer, running: false, endTime: null, remaining },
  });
}

export function resetTimer() {
  const state = getState();
  const remaining = durationForMode(state.timer.mode, state.settings);
  setState({
    timer: { ...state.timer, running: false, endTime: null, remaining },
  });
}

export function switchMode(mode) {
  const state = getState();
  const remaining = durationForMode(mode, state.settings);
  setState({
    timer: { ...state.timer, mode, running: false, endTime: null, remaining },
  });
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Web Audio not available; fail silently.
  }
}

export function completeSession() {
  const state = getState();
  const { timer, settings, tasks } = state;

  const session = {
    id: uid(),
    type: timer.mode,
    durationMin: durationForMode(timer.mode, settings) / 60,
    taskId: timer.activeTaskId,
    taskTitle: tasks.find((t) => t.id === timer.activeTaskId)?.title ?? null,
    completedAt: new Date().toISOString(),
  };

  let cycleCount = timer.cycleCount;
  let updatedTasks = tasks;

  if (timer.mode === 'work') {
    cycleCount += 1;
    if (timer.activeTaskId) {
      updatedTasks = tasks.map((t) =>
        t.id === timer.activeTaskId ? { ...t, pomodorosSpent: t.pomodorosSpent + 1 } : t
      );
    }
  }

  const nextMode =
    timer.mode === 'work'
      ? cycleCount % settings.sessionsBeforeLongBreak === 0
        ? 'long'
        : 'short'
      : 'work';

  if (settings.soundEnabled) playBeep();

  setState({
    tasks: updatedTasks,
    sessions: [session, ...state.sessions],
    timer: {
      ...timer,
      mode: nextMode,
      running: false,
      endTime: null,
      remaining: durationForMode(nextMode, settings),
      cycleCount,
    },
  });
}

export function tick() {
  const state = getState();
  if (!state.timer.running) return;
  if (getRemainingSeconds(state.timer) <= 0) {
    completeSession();
    const container = document.getElementById('view-timer');
    if (container?.classList.contains('active')) {
      renderTimerView(container);
    }
  } else {
    updateDisplay();
  }
}

function updateDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;
  const { timer } = getState();
  display.textContent = formatTime(getRemainingSeconds(timer));
}

export function renderTimerView(container) {
  const state = getState();
  const { timer, tasks, settings } = state;
  const remaining = getRemainingSeconds(timer);
  const activeTasks = tasks.filter((t) => !t.completed);
  const filledDots =
    timer.mode === 'long'
      ? settings.sessionsBeforeLongBreak
      : timer.cycleCount % settings.sessionsBeforeLongBreak;

  container.innerHTML = `
    <h2 class="view-title">Timer</h2>

    <div class="timer-card mode-${timer.mode}">
      <p class="timer-mode-label">${MODE_LABELS[timer.mode]}</p>
      <p id="timer-display" class="timer-display">${formatTime(remaining)}</p>
      <div class="session-dots">
        ${Array.from({ length: settings.sessionsBeforeLongBreak })
          .map((_, i) => `<span class="dot ${i < filledDots ? 'filled' : ''}"></span>`)
          .join('')}
      </div>

      <div class="timer-controls">
        <button id="btn-start-pause" class="btn-primary btn-large">
          ${timer.running ? '⏸ Pausar' : '▶️ Iniciar'}
        </button>
        <button id="btn-reset" class="btn-secondary">↺ Reiniciar</button>
      </div>

      <div class="mode-switch">
        <button class="mode-btn ${timer.mode === 'work' ? 'active' : ''}" data-mode="work">Foco</button>
        <button class="mode-btn ${timer.mode === 'short' ? 'active' : ''}" data-mode="short">Corto</button>
        <button class="mode-btn ${timer.mode === 'long' ? 'active' : ''}" data-mode="long">Largo</button>
      </div>
    </div>

    <div class="active-task-picker">
      <label for="active-task-select">Tarea activa</label>
      <select id="active-task-select">
        <option value="">Sin tarea asignada</option>
        ${activeTasks
          .map(
            (t) =>
              `<option value="${t.id}" ${t.id === timer.activeTaskId ? 'selected' : ''}>${t.title}</option>`
          )
          .join('')}
      </select>
    </div>
  `;

  container.querySelector('#btn-start-pause').addEventListener('click', () => {
    if (getState().timer.running) {
      pauseTimer();
    } else {
      startTimer();
    }
    renderTimerView(container);
  });

  container.querySelector('#btn-reset').addEventListener('click', () => {
    resetTimer();
    renderTimerView(container);
  });

  container.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchMode(btn.dataset.mode);
      renderTimerView(container);
    });
  });

  container.querySelector('#active-task-select').addEventListener('change', (e) => {
    const s = getState();
    setState({ timer: { ...s.timer, activeTaskId: e.target.value || null } });
  });
}
