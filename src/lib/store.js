import { getProduct } from './products.js';
export const STORAGE_KEY = 'wallet-wise-frontend-v1';
const emptyState = () => ({ selected: [], saved: [], plan: null, draft: null, draftStep: 0 });
let state = emptyState();
let storageAvailable = true;
export function normalizeState(value) {
  const result = emptyState();
  if (!value || typeof value !== 'object') return result;
  for (const key of ['selected', 'saved']) result[key] = [...new Set((Array.isArray(value[key]) ? value[key] : []).filter(id => typeof id === 'string' && getProduct(id)))];
  result.selected = result.selected.filter(id => getProduct(id).cat === getProduct(result.selected[0])?.cat).slice(0, 3);
  for (const key of ['plan', 'draft']) if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key])) result[key] = { ...value[key] };
  result.draftStep = Number.isInteger(value.draftStep) ? Math.min(9, Math.max(0, value.draftStep)) : 0;
  return result;
}
try { state = normalizeState(JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? 'null')); }
catch { storageAvailable = false; }
export function getState() { return structuredClone(state); }
export function canPersist() { return storageAvailable; }
export function updateState(patch) {
  state = normalizeState({ ...state, ...patch });
  try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; }
  return getState();
}
export function toggleSaved(id) {
  if (!getProduct(id)) return;
  return updateState({ saved: state.saved.includes(id) ? state.saved.filter(item => item !== id) : [...state.saved, id] });
}
export function toggleSelected(id) {
  const product = getProduct(id);
  if (!product) return { error: 'That option is unavailable.' };
  if (state.selected.includes(id)) { updateState({ selected: state.selected.filter(item => item !== id) }); return { removed: true }; }
  if (state.selected.length && getProduct(state.selected[0]).cat !== product.cat) return { error: 'Compare options in the same category. Clear your comparison to switch categories.' };
  if (state.selected.length >= 3) return { error: 'Compare up to three options. Remove one to add another.' };
  updateState({ selected: [...state.selected, id] });
  return { added: true };
}
export function clearAll() { state = emptyState(); updateState(state); }
