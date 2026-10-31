import { getProduct } from '../lib/products.js';
import { priorities, horizons, planWarnings } from '../lib/plan-model.js';
import { escapeHTML as e, dollars, currency } from '../lib/format.js';
export function planSummary(plan) {
  const optionName = id => id === 'later' ? 'Decide later / take no action' : getProduct(id)?.name || 'Not selected';
  const rows = [['Priority', priorities[plan.priority] || 'Not selected'], ['Available each month', currency(plan.available)], ['Accessible buffer target', currency(plan.buffer)], ['Time horizon', horizons[plan.horizon] || 'Not selected'], ['Credit', optionName(plan.card)], ['Savings', optionName(plan.bank)], ['Investing step', optionName(plan.invest)], ['Monthly commitment', `${currency(plan.monthly)}/month`]];
  return `<section class="card plan-summary"><h2>${e(plan.goal)}</h2><dl>${rows.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>
    <section class="reasoning"><h2>Your reasoning</h2><p>${e(plan.reason)}</p><h2>Your next step</h2><p>${e(plan.next)}</p></section>
    ${planWarnings(plan).map(warning => `<p class="notice">${e(warning)}</p>`).join('')}`;
}
