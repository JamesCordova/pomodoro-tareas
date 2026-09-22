let currentView = 'timer';
const renderers = {};

export function registerView(name, renderFn) {
  renderers[name] = renderFn;
}

export function getCurrentView() {
  return currentView;
}

export function navigateTo(name) {
  currentView = name;

  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active', section.dataset.view === name);
  });

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    const isActive = btn.dataset.target === name;
    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  const container = document.getElementById(`view-${name}`);
  if (container && renderers[name]) {
    renderers[name](container);
  }
}

export function initRouter() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
  });
  navigateTo(currentView);
}
