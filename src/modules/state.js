import { loadState, saveState } from './storage.js';

let state = loadState();
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(updater) {
  const partial = typeof updater === 'function' ? updater(state) : updater;
  state = { ...state, ...partial };
  saveState(state);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
