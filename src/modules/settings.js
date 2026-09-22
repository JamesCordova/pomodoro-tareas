import { getState, setState } from './state.js';
import { defaultState } from './storage.js';

export function renderSettingsView(container) {
  const { settings } = getState();

  container.innerHTML = `
    <h2 class="view-title">Ajustes</h2>
    <form id="settings-form" class="settings-form">
      <label>
        Duración de foco (min)
        <input type="number" name="workMin" min="1" max="90" value="${settings.workMin}" />
      </label>
      <label>
        Descanso corto (min)
        <input type="number" name="shortBreakMin" min="1" max="60" value="${settings.shortBreakMin}" />
      </label>
      <label>
        Descanso largo (min)
        <input type="number" name="longBreakMin" min="1" max="60" value="${settings.longBreakMin}" />
      </label>
      <label>
        Sesiones antes del descanso largo
        <input type="number" name="sessionsBeforeLongBreak" min="2" max="12" value="${settings.sessionsBeforeLongBreak}" />
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="soundEnabled" ${settings.soundEnabled ? 'checked' : ''} />
        Sonido al terminar una sesión
      </label>
      <label>
        Tema
        <select name="theme">
          <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>Sistema</option>
          <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Claro</option>
          <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Oscuro</option>
        </select>
      </label>
      <button type="submit" class="btn-primary">Guardar cambios</button>
    </form>

    <button id="btn-reset-data" class="btn-danger">Borrar todos los datos</button>
    <p id="settings-feedback" class="empty-hint" aria-live="polite"></p>
  `;

  container.querySelector('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const state = getState();
    setState({
      settings: {
        workMin: Number(form.get('workMin')) || 25,
        shortBreakMin: Number(form.get('shortBreakMin')) || 5,
        longBreakMin: Number(form.get('longBreakMin')) || 15,
        sessionsBeforeLongBreak: Number(form.get('sessionsBeforeLongBreak')) || 4,
        soundEnabled: form.get('soundEnabled') === 'on',
        theme: form.get('theme') || 'system',
      },
      timer: {
        ...state.timer,
        running: false,
        endTime: null,
        remaining:
          state.timer.mode === 'work'
            ? Number(form.get('workMin')) * 60
            : state.timer.mode === 'short'
            ? Number(form.get('shortBreakMin')) * 60
            : Number(form.get('longBreakMin')) * 60,
      },
    });
    const feedback = container.querySelector('#settings-feedback');
    feedback.textContent = 'Cambios guardados ✅';
    setTimeout(() => (feedback.textContent = ''), 2000);
  });

  container.querySelector('#btn-reset-data').addEventListener('click', () => {
    if (confirm('¿Seguro que querés borrar tareas, sesiones y estadísticas? Esta acción no se puede deshacer.')) {
      setState(defaultState());
      renderSettingsView(container);
    }
  });
}
