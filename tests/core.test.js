import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyInterest, escapeHTML, costSummary } from '../src/lib/format.js';
import { getProduct } from '../src/lib/products.js';
import { createDraft, validateStep, validatePlan, planWarnings } from '../src/lib/plan-model.js';
import { normalizeState, updateState, getState, toggleSelected, toggleSaved, clearAll } from '../src/lib/store.js';
const validPlan = () => createDraft({ goal: 'Keep savings accessible', priority: 'access', available: '150', buffer: '500', horizon: 'soon', card: 'c1', bank: 'b1', invest: 'i3', monthly: '50', reason: 'Keep fees low and learn with fictional money.', next: 'Verify the current terms.', understand: true });
test('the $500 scenario gives correctly rounded monthly interest', () => {
  assert.equal(monthlyInterest(500, 24.9), 10.38); assert.equal(monthlyInterest(500, 27.9), 11.63); assert.equal(monthlyInterest(0, 27.9), 0);
  assert.throws(() => monthlyInterest(-1, 25), RangeError); assert.throws(() => monthlyInterest(NaN, 25), RangeError);
});
test('comparison allows removal but rejects mixed categories', () => {
  clearAll(); toggleSelected('c1'); toggleSelected('c2'); assert.deepEqual(getState().selected, ['c1', 'c2']);
  assert.match(toggleSelected('b1').error, /same category/); toggleSelected('c1'); assert.deepEqual(getState().selected, ['c2']);
});
test('normalization recovers malformed and stale saved data', () => {
  const result = normalizeState({ selected: ['c1', 'c1', 'b1', 'gone'], saved: ['c2', 'gone'], draftStep: 99 });
  assert.deepEqual(result.selected, ['c1']); assert.deepEqual(result.saved, ['c2']); assert.equal(result.draftStep, 9); assert.deepEqual(normalizeState(null).saved, []);
});
test('saving toggles and clearing removes the whole workspace', () => {
  clearAll(); toggleSaved('c1'); assert.deepEqual(getState().saved, ['c1']); toggleSaved('c1'); assert.deepEqual(getState().saved, []);
  updateState({ plan: validPlan(), draft: validPlan() }); clearAll(); assert.equal(getState().plan, null); assert.equal(getState().draft, null);
});
test('monthly commitments cannot exceed available money or use invalid amounts', () => {
  const draft = validPlan(); draft.monthly = '151'; assert.match(validateStep(7, draft), /cannot exceed/); draft.monthly = ''; assert.match(validateStep(7, draft), /valid monthly/);
  draft.monthly = '-1'; assert.ok(validateStep(7, draft)); draft.monthly = '0'; assert.equal(validateStep(7, draft), null);
});
test('a completed plan preserves alternate choices and requires consent', () => {
  const draft = validPlan(); draft.card = 'later'; draft.invest = 'later'; draft.monthly = '25'; assert.equal(validatePlan(draft), null);
  draft.understand = false; assert.equal(validatePlan(draft).step, 8); draft.understand = true; draft.bank = 'c1'; assert.equal(validatePlan(draft).step, 5);
});
test('near-term market investing gets a warning while practice-only does not', () => {
  const draft = validPlan(); draft.card = 'later'; assert.equal(planWarnings(draft).length, 0); draft.invest = 'i1'; assert.match(planWarnings(draft)[0], /timeline/); draft.horizon = 'long'; assert.equal(planWarnings(draft).length, 0);
});
test('user-entered markup is escaped before rendering', () => {
  assert.equal(escapeHTML('<img onerror="bad">'), '&lt;img onerror=&quot;bad&quot;&gt;'); assert.match(costSummary(getProduct('b2')), /\$5\/month/);
});
test('drafts and plans are independent copies', () => {
  clearAll(); updateState({ draft: validPlan(), draftStep: 7 }); const copy = getState(); copy.draft.monthly = '999'; assert.equal(getState().draft.monthly, '50'); assert.equal(getState().draftStep, 7);
});
