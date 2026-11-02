// Plan owner: editable guided flow, draft persistence, validation and plan review.
import { getProducts } from '../lib/products.js';
import { getState, updateState } from '../lib/store.js';
import { createDraft, priorities, horizons, validateStep, validatePlan } from '../lib/plan-model.js';
import { costSummary, startingCost, escapeHTML as e, currency } from '../lib/format.js';
import { Button, InputField, pageHeading, demoNote, bindActions, toast } from '../components/ui.js';
import { planSummary } from '../components/plan-summary.js';
const titles = ['What are you deciding?', 'What matters most?', 'What is available?', 'When might you need this money?', 'Your credit choice', 'Your savings choice', 'Your investing step', 'A monthly commitment', 'Keep your reasons', 'Review your plan'];
const descriptions = ['Start with your goal.', 'Choose a priority for your plan.', 'Keep your essential expenses separate.', 'Your timeline affects which risks may fit.', 'Consider the deposit as well as the annual fee.', 'Compare access and costs before yield.', 'Keep near-term needs in mind.', 'Choose an amount you can maintain.', 'Make this a decision you can explain.', 'Check your choices before saving.'];
function radioGroup(name, legend, options, selected) {
  return `<fieldset class="choice-group"><legend class="sr-only">${e(legend)}</legend>${options.map(({ value, label, description = '' }) => `<label class="choice"><input type="radio" name="${name}" value="${e(value)}" ${selected === value ? 'checked' : ''}><span class="choice-copy"><strong>${e(label)}</strong>${description ? `<span>${e(description)}</span>` : ''}</span><span class="radio-mark" aria-hidden="true"></span></label>`).join('')}</fieldset>`;
}
function productChoices(category, key, draft) {
  const shortlist = draft.shortlist || [];
  return radioGroup(key, category, [...getProducts(category).map(product => ({ value: product.id, label: product.name, description: `${costSummary(product)}. ${startingCost(product)}.${shortlist.includes(product.id) ? ' In your comparison shortlist.' : ''}` })), { value: 'later', label: 'Decide later', description: 'Keep learning and take no action for now.' }], draft[key]);
}
export function mountPlan({ container, path, navigate, refreshNavigation }) {
  if (path === '/plan/review') return mountSavedPlan({ container, navigate });
  const previous = getState();
  let draft = createDraft(previous.draft || {});
  let step = previous.draftStep;
  const persistDraft = () => updateState({ draft, draftStep: step });
  const capture = () => {
    const form = container.querySelector('#plan-form');
    if (!form) return;
    for (const [key, value] of new FormData(form)) draft[key] = value;
    if (step === 8) draft.understand = Boolean(form.querySelector('[name="understand"]')?.checked);
    persistDraft();
  };
  function render() {
    const content = [
      () => InputField({ name: 'goal', label: 'My goal', value: draft.goal, required: true }) + '<p class="quiet">Your own words are welcome. Use example amounts while exploring.</p>',
      () => radioGroup('priority', titles[1], Object.entries(priorities).map(([value, label]) => ({ value, label })), draft.priority),
      () => InputField({ name: 'available', label: 'Available each month after essentials ($)', value: draft.available, type: 'number', required: true, hint: 'The amount left after rent, bills and essentials.' }) + InputField({ name: 'buffer', label: 'Amount you want to keep accessible ($)', value: draft.buffer, type: 'number', required: true, hint: 'A savings target, not an immediate transfer.' }),
      () => radioGroup('horizon', titles[3], Object.entries(horizons).map(([value, label]) => ({ value, label })), draft.horizon),
      () => productChoices('Credit cards', 'card', draft),
      () => productChoices('Bank accounts', 'bank', draft),
      () => productChoices('Investing', 'invest', draft) + '<p class="quiet">A practice portfolio uses fictional money. Market investments can lose value. Choosing to wait is valid.</p>',
      () => InputField({ name: 'monthly', label: 'Planned saving or investing each month ($)', value: draft.monthly, type: 'number', required: true, hint: `You have ${currency(draft.available)} available each month after essentials.` }),
      () => `<div class="field"><label for="reason">Why do these choices fit your priorities?</label><textarea id="reason" name="reason" rows="5" maxlength="1500" required>${e(draft.reason)}</textarea></div>${InputField({ name: 'next', label: 'One thing to verify before acting', value: draft.next, required: true, maxlength: 300 })}<label class="consent"><input type="checkbox" name="understand" ${draft.understand ? 'checked' : ''}><span>I understand these products are fictional. This plan does not apply for accounts or guarantee approval or returns.</span></label>`,
      () => planSummary(draft) + `<div class="review-edits">${Button({ label: 'Revise credit choice', action: 'jump', value: '4', variant: 'secondary' })}${Button({ label: 'Revise monthly amount', action: 'jump', value: '7', variant: 'secondary' })}</div>`
    ];
    container.innerHTML = pageHeading(titles[step], descriptions[step], 'Your decision plan') + `<div class="step-progress"><div class="step-progress-label"><span>Step ${step + 1} of 10</span><span>Draft saved in this browser</span></div><div class="progress-track" role="progressbar" aria-label="Plan progress" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${step + 1}"><span style="width:${(step + 1) * 10}%"></span></div></div>
      <form id="plan-form" novalidate><div id="plan-error" class="form-error" role="alert" tabindex="-1" hidden></div><div class="plan-step">${content[step]()}</div><div class="button-stack"><button class="button button-primary" type="submit">${step === 9 ? 'Save decision plan' : step === 0 ? 'Use this goal' : 'Continue'}</button>${step ? Button({ label: 'Back', action: 'back', variant: 'secondary' }) : ''}${Button({ label: 'Save draft and leave', action: 'leave', variant: 'text' })}</div></form>${demoNote()}`;
    const form = container.querySelector('#plan-form');
    form.addEventListener('input', capture); form.addEventListener('change', capture);
    form.addEventListener('submit', event => {
      event.preventDefault(); capture();
      const issue = step === 9 ? validatePlan(draft) : null;
      const error = issue?.error || validateStep(step, draft);
      if (error) {
        if (issue) { step = issue.step; persistDraft(); render(); }
        const message = container.querySelector('#plan-error'); message.textContent = error; message.hidden = false; message.focus(); return;
      }
      if (step < 9) { step++; persistDraft(); render(); container.querySelector('h1').scrollIntoView({ block: 'start' }); }
      else {
        const plan = { ...draft, goal: draft.goal.trim(), reason: draft.reason.trim(), next: draft.next.trim(), savedAt: new Date().toISOString() };
        updateState({ plan, draft: null, draftStep: 0 }); toast('Decision plan saved in this browser.'); navigate('/plan/review');
      }
    });
    document.title = `${titles[step]} · Wallet Wise`;
    const heading = container.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    refreshNavigation();
  }
  const cleanup = bindActions(container, {
    back: () => { capture(); step = Math.max(0, step - 1); persistDraft(); render(); window.scrollTo(0, 0); },
    jump: value => { capture(); step = Number(value); persistDraft(); render(); window.scrollTo(0, 0); },
    leave: () => { capture(); navigate('/saved'); toast('Draft saved. Continue whenever you are ready.'); }
  });
  persistDraft(); render(); return cleanup;
}
function mountSavedPlan({ container, navigate }) {
  const plan = getState().plan;
  if (!plan) { container.innerHTML = pageHeading('No saved plan yet', 'Start with a goal and keep your reasoning together.') + Button({ label: 'Build a decision plan', href: '#/plan' }); return; }
  container.innerHTML = pageHeading('A decision you can revisit', 'Your choices and reasons are saved in this browser.', 'Plan saved') + planSummary(plan) + `<div class="button-stack no-print">${Button({ label: 'Edit decision plan', action: 'edit' })}${Button({ label: 'Print / save as PDF', action: 'print', variant: 'secondary' })}${Button({ label: 'Open saved workspace', href: '#/saved', variant: 'secondary' })}</div>${demoNote()}`;
  return bindActions(container, {
    edit: () => { updateState({ draft: createDraft(plan), draftStep: 0 }); navigate('/plan'); },
    print: () => window.print()
  });
}
