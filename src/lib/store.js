import { getProduct } from './products.js';
import { normalizePayments } from './money-demo.js';
import { investmentPrice } from './investment-prices.js';
export const STORAGE_KEY = 'wallet-wise-frontend-v1';
const emptyState = () => ({ selected: [], saved: [], plan: null, draft: null, draftStep: 0, payments: {}, paperCash: 500000, holdings: {} });
let state = emptyState();
let storageAvailable = true;
export function normalizeState(value) {
  const result = emptyState();
  if (!value || typeof value !== 'object') return result;
  result.payments = normalizePayments(value.payments);
  if (Number.isInteger(value.paperCash) && value.paperCash >= 0 && value.paperCash <= 500000) result.paperCash = value.paperCash;
  for (const id of ['i1', 'i2', 'i3', 'i4', 'i5']) {
    const units = value.holdings?.[id];
    if (Number.isFinite(units) && units > 0) result.holdings[id] = units;
  }
  for (const key of ['selected', 'saved']) result[key] = [...new Set((Array.isArray(value[key]) ? value[key] : []).filter(id => typeof id === 'string' && getProduct(id)))];
  result.selected = result.selected.filter(id => getProduct(id).cat === getProduct(result.selected[0])?.cat).slice(0, 3);
  for (const key of ['plan', 'draft']) if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key])) result[key] = { ...value[key] };
  result.draftStep = Number.isInteger(value.draftStep) ? Math.min(9, Math.max(0, value.draftStep)) : 0;
  return result;
}
try {
  state = normalizeState(JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? 'null'));
  if (state.selected.length) {
    state.selected = [];
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
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
  if (state.selected.length && getProduct(state.selected[0]).cat !== product.cat) return { error: 'Compare options in the same category.', clearRequired: true };
  if (state.selected.length >= 3) return { error: 'Compare up to three options. Remove one to add another.' };
  updateState({ selected: [...state.selected, id] });
  return { added: true };
}
export function clearAll() { state = emptyState(); updateState(state); }

export function buyInvestment(id, mode, amount) {
  const price = investmentPrice(id);
  if (!price || !['dollars', 'units'].includes(mode)) return { error: 'Choose an investment and purchase type.' };
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Enter an amount greater than zero.' };
  const cost = Math.round((mode === 'dollars' ? amount : amount * price) * 100);
  if (cost < 1) return { error: 'The minimum paper purchase is $0.01.' };
  if (cost > state.paperCash) return { error: 'Not enough paper money for this purchase.' };
  const units = mode === 'units' ? amount : cost / 100 / price;
  updateState({ paperCash: state.paperCash - cost, holdings: { ...state.holdings, [id]: (state.holdings[id] || 0) + units } });
  return { units, cost };
}
