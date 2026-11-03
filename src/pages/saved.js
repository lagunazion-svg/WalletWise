// Saved owner: saved option management, saved-plan access, draft resume and demo reset.
import { getState, toggleSaved, updateState, clearAll } from '../lib/store.js';
import { getProduct } from '../lib/products.js';
import { costSummary, currency, escapeHTML as e } from '../lib/format.js';
import { Button, pageHeading, bindActions, confirmAction, toast, demoNote } from '../components/ui.js';
export function mountSaved({ container, navigate, refreshNavigation }) {
  function render() {
    const { saved, plan, draft } = getState();
    container.innerHTML = pageHeading('Your workspace', 'Saved options and decisions, ready when you are.') + `
      ${draft ? `<section class="card draft-card"><p class="eyebrow">In progress</p><h2>${e(draft.goal || 'Your decision plan')}</h2><p>Your draft is saved. Pick up where you left off.</p>${Button({ label: 'Continue draft', href: '#/plan', variant: 'secondary' })}${Button({ label: 'Discard draft', action: 'discard', variant: 'text' })}</section>` : ''}
      ${plan ? `<section class="card"><p class="eyebrow">Decision plan</p><h2>${e(plan.goal)}</h2><p>${currency(plan.monthly)}/month commitment<br>${e(plan.reason)}</p>${Button({ label: 'Review plan', href: '#/plan/review', variant: 'secondary' })}</section>` : ''}
      <section class="saved-options"><h2 class="section-title">Saved options <span>${saved.length}</span></h2><div class="card-stack">${saved.length ? saved.map(id => {
        const product = getProduct(id);
        return `<article class="card"><p class="eyebrow">${e(product.cat)}</p><h2>${e(product.name)}</h2><p>${e(costSummary(product))}</p>${Button({ label: 'Review saved option', href: `#/product/${product.id}`, variant: 'secondary' })}${Button({ label: 'Remove', action: 'remove', value: id, variant: 'text', extra: `aria-label="Remove ${e(product.name)} from saved options"` })}</article>`;
      }).join('') : '<div class="empty-state"><h3>No saved options yet</h3><p>Open an option in Explore, then choose Save option.</p></div>'}</div></section>
      <div class="button-stack">${Button({ label: 'Explore more options', href: '#/explore' })}${!plan && !draft ? Button({ label: 'Build a decision plan', href: '#/plan', variant: 'secondary' }) : ''}</div>
      <section class="workspace-settings"><p class="quiet">Saved only on this device and browser. Clearing browser data removes your choices.</p>${Button({ label: 'Reset demo data', action: 'reset', variant: 'text' })}</section>${demoNote()}`;
    refreshNavigation();
  }
  const cleanup = bindActions(container, {
    remove: async id => {
      if (!await confirmAction('Remove saved option?', `${getProduct(id).name} will leave your workspace. You can save it again later.`, 'Remove option')) return;
      toggleSaved(id); render(); toast('Option removed.');
    },
    discard: async () => {
      if (!await confirmAction('Discard this draft?', 'Your saved decision plan and options will remain. Only the unfinished draft will be removed.', 'Discard draft')) return;
      updateState({ draft: null, draftStep: 0 }); render(); toast('Draft discarded.');
    },
    reset: async () => {
      if (!await confirmAction('Reset this demo?', 'This clears the saved options, comparison, draft and plan from this browser.', 'Reset demo')) return;
      clearAll(); render(); toast('Demo reset.');
    }
  });
  render(); return cleanup;
}
