import { getState, setState } from './state.js';
import { uid } from './utils.js';

export function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const task = {
    id: uid(),
    title: trimmed,
    completed: false,
    pomodorosSpent: 0,
    createdAt: new Date().toISOString(),
  };
  const state = getState();
  setState({ tasks: [task, ...state.tasks] });
}

export function toggleTaskCompleted(id) {
  const state = getState();
  const tasks = state.tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  setState({ tasks });
}

export function deleteTask(id) {
  const state = getState();
  const tasks = state.tasks.filter((t) => t.id !== id);
  const activeTaskId = state.timer.activeTaskId === id ? null : state.timer.activeTaskId;
  setState({ tasks, timer: { ...state.timer, activeTaskId } });
}

export function setActiveTask(id) {
  const state = getState();
  setState({ timer: { ...state.timer, activeTaskId: id || null } });
}

function taskCardHTML(task, isActive) {
  return `
    <li class="task-card ${task.completed ? 'is-completed' : ''} ${isActive ? 'is-active' : ''}" data-id="${task.id}">
      <button class="task-check" data-action="toggle" aria-label="Marcar como completada">
        ${task.completed ? '✅' : '⬜'}
      </button>
      <div class="task-body">
        <p class="task-title">${escapeHTML(task.title)}</p>
        <p class="task-meta">🍅 ${task.pomodorosSpent} pomodoro${task.pomodorosSpent === 1 ? '' : 's'}</p>
      </div>
      <div class="task-actions">
        ${!task.completed ? `<button class="btn-icon" data-action="select" title="Usar en el timer">🎯</button>` : ''}
        <button class="btn-icon" data-action="delete" title="Eliminar">🗑️</button>
      </div>
    </li>
  `;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderTasksView(container) {
  const state = getState();
  const active = state.tasks.filter((t) => !t.completed);
  const completed = state.tasks.filter((t) => t.completed);

  container.innerHTML = `
    <h2 class="view-title">Tareas</h2>
    <form class="add-task-form" id="add-task-form">
      <input
        type="text"
        id="new-task-input"
        placeholder="¿Qué vas a hacer?"
        autocomplete="off"
        maxlength="80"
      />
      <button type="submit" class="btn-primary">Agregar</button>
    </form>

    <section>
      <h3 class="section-label">Activas (${active.length})</h3>
      ${
        active.length
          ? `<ul class="task-list">${active
              .map((t) => taskCardHTML(t, state.timer.activeTaskId === t.id))
              .join('')}</ul>`
          : `<p class="empty-hint">No hay tareas activas. ¡Agregá una!</p>`
      }
    </section>

    <section>
      <h3 class="section-label">Completadas (${completed.length})</h3>
      ${
        completed.length
          ? `<ul class="task-list">${completed.map((t) => taskCardHTML(t, false)).join('')}</ul>`
          : `<p class="empty-hint">Todavía no completaste ninguna.</p>`
      }
    </section>
  `;

  container.querySelector('#add-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = container.querySelector('#new-task-input');
    addTask(input.value);
    input.value = '';
    renderTasksView(container);
  });

  container.querySelectorAll('.task-card').forEach((card) => {
    const id = card.dataset.id;
    card.querySelector('[data-action="toggle"]').addEventListener('click', () => {
      toggleTaskCompleted(id);
      renderTasksView(container);
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      deleteTask(id);
      renderTasksView(container);
    });
    const selectBtn = card.querySelector('[data-action="select"]');
    if (selectBtn) {
      selectBtn.addEventListener('click', () => {
        setActiveTask(id);
        renderTasksView(container);
      });
    }
  });
}
