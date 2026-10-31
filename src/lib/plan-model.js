import { getProduct } from './products.js';
export const priorities = { fees: 'Keep ongoing fees low', access: 'Keep money accessible', learn: 'Understand the risks first' };
export const horizons = { soon: 'Within one year', long: 'More than five years', unsure: 'I am unsure' };
export function createDraft(value = {}) {
  return { goal: 'Choose my first financial accounts', priority: '', available: '150', buffer: '500', horizon: '', card: '', bank: '', invest: '', monthly: '50', reason: '', next: 'Verify current fees and requirements with the provider', understand: false, ...value };
}
const present = value => typeof value === 'string' && value.trim().length > 0;
const money = value => present(String(value ?? '')) && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1000000;
const validChoice = (id, category) => id === 'later' || getProduct(id)?.cat === category;
export function validateStep(step, draft) {
  if (step === 0 && (!present(draft.goal) || draft.goal.trim().length > 180)) return 'Enter a goal between 1 and 180 characters.';
  if (step === 1 && !Object.hasOwn(priorities, draft.priority)) return 'Choose what matters most to you.';
  if (step === 2 && (!money(draft.available) || !money(draft.buffer))) return 'Enter amounts between $0 and $1,000,000.';
  if (step === 3 && !Object.hasOwn(horizons, draft.horizon)) return 'Choose when you might need this money.';
  if (step === 4 && !validChoice(draft.card, 'Credit cards')) return 'Choose a credit option or decide later.';
  if (step === 5 && !validChoice(draft.bank, 'Bank accounts')) return 'Choose a bank option or decide later.';
  if (step === 6 && !validChoice(draft.invest, 'Investing')) return 'Choose an investing step or decide later.';
  if (step === 7 && (!money(draft.monthly) || !money(draft.available))) return 'Enter a valid monthly commitment.';
  if (step === 7 && Number(draft.monthly) > Number(draft.available)) return 'Your monthly commitment cannot exceed the amount available after essentials.';
  if (step === 8 && (!present(draft.reason) || draft.reason.trim().length > 1500)) return 'Explain your reasoning in 1 to 1,500 characters.';
  if (step === 8 && (!present(draft.next) || draft.next.trim().length > 300)) return 'Add one next step in 1 to 300 characters.';
  if (step === 8 && !draft.understand) return 'Confirm that you understand the example products and prototype limits.';
  return null;
}
export function validatePlan(draft) {
  for (let step = 0; step < 9; step++) { const error = validateStep(step, draft); if (error) return { step, error }; }
  return null;
}
export function planWarnings(draft) {
  const warnings = [];
  const investment = getProduct(draft.invest);
  if (investment && investment.risk === 'Market risk' && draft.horizon !== 'long') warnings.push('Your timeline is short or uncertain. Market investments can lose value. Consider a learning-only step for money you may need soon.');
  const credit = getProduct(draft.card);
  if (credit?.deposit) warnings.push(`The ${credit.name} example requires a $${credit.deposit} deposit. Consider that upfront amount separately from your accessible savings target.`);
  return warnings;
}
