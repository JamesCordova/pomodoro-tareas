const STORAGE_KEY = 'pomodoro-app-state-v1';

export function defaultState() {
  return {
    tasks: [],
    sessions: [],
    settings: {
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 15,
      sessionsBeforeLongBreak: 4,
      soundEnabled: true,
    },
    timer: {
      mode: 'work',
      running: false,
      endTime: null,
      remaining: 25 * 60,
      cycleCount: 0,
      activeTaskId: null,
    },
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
