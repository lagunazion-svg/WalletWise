// Compare owner: selected options, comparison criteria and balance scenarios.
import { getProduct } from '../lib/products.js';
import { getState, toggleSelected, updateState } from '../lib/store.js';
import { costSummary, startingCost, currency, monthlyInterest, escapeHTML as e } from '../lib/format.js';
import { Button, pageHeading, demoNote, bindActions, toast } from '../components/ui.js';
export function mountCompare(context) {
  const { container, path, navigate, refreshNavigation } = context;
  let amount = 500;
  function render() {
    const products = getState().selected.map(getProduct);
    if (products.length < 2) {
      container.innerHTML = pageHeading('Choose at least two options', 'Compare the same criteria before deciding what fits.') + `<div class="empty-state"><h2>${products.length ? 'One option selected' : 'Your comparison is empty'}</h2><p>${products.length ? `${e(products[0].name)} is ready. Add another option in the same category.` : 'Explore a category, then add two or three options to compare.'}</p>${Button({ label: 'Choose options', href: `#/explore?category=${encodeURIComponent(products[0]?.cat || 'Credit cards')}` })}</div>${demoNote()}`;
      return;
    }
    const isScenario = path === '/compare/scenario';
    const cards = products[0].cat === 'Credit cards';
    container.innerHTML = pageHeading(isScenario ? 'What if I carry a balance?' : 'See the trade-offs', isScenario ? 'Try an amount and compare the approximate cost for one month.' : 'Same criteria, different compromises.') + `
      ${isScenario ? '<div class="field"><label for="balance">Balance carried for one month ($)</label><input id="balance" type="number" min="0" max="100000" step="0.01" inputmode="decimal" value="500" aria-describedby="scenario-formula balance-error"><p id="balance-error" class="field-error" role="alert"></p></div>' : ''}
      <div class="card-stack comparison-cards">${products.map(product => `<article class="card compare-card"><h2>${e(product.name)}</h2><p>${e(costSummary(product))}<br>${e(startingCost(product))}</p>${isScenario ? `<p class="interest-metric" id="interest-${product.id}"></p>` : `<dl class="comparison-facts"><div><dt>Why consider it</dt><dd>${e(product.pro)}</dd></div><div><dt>What to watch</dt><dd>${e(product.con)}</dd></div><div><dt>Requirements</dt><dd>${e(product.req)}</dd></div></dl><div class="card-links"><a href="#/product/${product.id}">Details</a><button type="button" class="text-button" data-action="remove" data-value="${product.id}" aria-label="Remove ${e(product.name)} from comparison">Remove</button></div>`}</article>`).join('')}</div>
      ${isScenario ? '<p class="quiet" id="scenario-formula">Balance × APR ÷ 12. Assumes a constant balance, no new purchases or daily compounding. Annual fees are separate. Actual statement interest differs.</p>' : '<p class="comparison-explainer">A lower ongoing cost may come with different requirements. Consider the starting amount and access to your money as well as the headline rate.</p>'}
      <div class="button-stack">${cards && !isScenario ? Button({ label: 'Try a balance scenario', href: '#/compare/scenario' }) : ''}${Button({ label: 'Use in a decision plan', action: 'plan', variant: isScenario || !cards ? 'primary' : 'secondary' })}${Button({ label: isScenario ? 'Back to comparison' : 'Change options', href: isScenario ? '#/compare' : `#/explore?category=${encodeURIComponent(products[0].cat)}`, variant: 'secondary' })}${!isScenario ? Button({ label: 'Clear comparison', action: 'clear', variant: 'text' }) : ''}</div>${demoNote()}`;
    if (isScenario) {
      if (!cards) { navigate('/compare'); return; }
      const balance = container.querySelector('#balance');
      const update = () => {
        const invalid = balance.value.trim() === '' || !balance.validity.valid || !Number.isFinite(balance.valueAsNumber);
        const error = container.querySelector('#balance-error');
        error.textContent = invalid ? 'Enter a balance between $0 and $100,000.' : '';
        balance.setAttribute('aria-invalid', String(invalid));
        for (const product of products) container.querySelector(`#interest-${product.id}`).innerHTML = invalid ? '<span class="muted">Enter a valid balance</span>' : `<strong>${currency(monthlyInterest(balance.valueAsNumber, product.apr))}</strong><span>estimated interest for one month</span>`;
      };
      balance.value = String(amount);
      balance.addEventListener('input', () => { amount = balance.valueAsNumber; update(); }); update();
    }
    refreshNavigation();
  }
  const cleanup = bindActions(container, {
    remove: id => { toggleSelected(id); render(); refreshNavigation(); },
    clear: () => { updateState({ selected: [] }); render(); refreshNavigation(); toast('Comparison cleared.'); },
    plan: () => {
      const state = getState();
      const draft = state.draft || {};
      // Offer the shortlist, but leave the final choice to the user.
      updateState({ draft: { ...draft, shortlist: [...state.selected] } }); navigate('/plan');
    }
  });
  render(); return cleanup;
}
