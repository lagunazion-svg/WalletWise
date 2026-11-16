import { getState, updateState } from '../lib/store.js';
import { demoExpenses, demoBudget, totalBills, moneySnapshot, payAllExpenses } from '../lib/money-demo.js';
import { currency, escapeHTML as e } from '../lib/format.js';
import { Button, pageHeading, bindActions, confirmAction, toast } from '../components/ui.js';

const cash = cents => currency(cents / 100);
export function mountMoney({ container }) {
  let accountId = 'checking';
  let busy = false;
  let receipt = '';
  function render() {
    const { accounts, unpaid, paid } = moneySnapshot(getState().payments);
    const outstanding = unpaid.reduce((sum, bill) => sum + bill.amount, 0);
    const account = accounts.find(item => item.id === accountId);
    const insufficient = outstanding > account.balance;
    const remaining = demoBudget.income - totalBills - demoBudget.everyday - demoBudget.savings;
    container.innerHTML = pageHeading('Your accounts', 'November 2026') + `
      ${receipt ? `<p class="money-success" role="status">${e(receipt)}</p>` : ''}
      <section class="highlight money-overview"><p>Total across accounts</p><p class="large-metric">${cash(accounts.reduce((sum, item) => sum + item.balance, 0))}</p><p>${cash(outstanding)} in unpaid expenses · ${unpaid.length} remaining</p></section>
      <section class="money-section" aria-labelledby="accounts-title"><h2 id="accounts-title">Your bank accounts</h2><div class="card-stack">${accounts.map(item => `<article class="card money-account"><div><h3>${e(item.name)}</h3><p class="quiet">Demo Bank · •••• ${item.last4}</p></div><strong>${cash(item.balance)}</strong></article>`).join('')}</div></section>
      <section class="money-section card" aria-labelledby="budget-title"><div><p class="eyebrow">Suggested demo budget</p><h2 id="budget-title">A plan for this month</h2></div><p>Based on Alex's hardcoded monthly income and expenses. The plan reserves money for everyday spending and savings.</p><dl class="money-breakdown">${[['Monthly income', demoBudget.income], ['Listed expenses', totalBills], ['Everyday spending allowance', demoBudget.everyday], ['Savings goal', demoBudget.savings], ['Unallocated cushion', remaining]].map(([label, amount]) => `<div><dt>${label}</dt><dd>${cash(amount)}</dd></div>`).join('')}</dl><p class="quiet">Paid bills stay in the monthly budget. The savings goal is a planned allocation; paying bills does not transfer it.</p></section>
      <section class="money-section" aria-labelledby="expenses-title"><h2 id="expenses-title">This month's expenses</h2><div class="card-stack">${demoExpenses.map(bill => `<article class="card money-expense"><div><h3>${bill.name}</h3><p class="quiet">${bill.category} · Due ${bill.due}</p>${paid[bill.id] ? `<p class="money-paid">Paid in demo · ${e(accounts.find(item => item.id === paid[bill.id]).name)}</p>` : '<p class="quiet">Unpaid</p>'}</div><strong>${cash(bill.amount)}</strong></article>`).join('')}</div></section>
      <section class="money-section card" aria-labelledby="pay-title"><h2 id="pay-title">${unpaid.length ? 'Pay expenses together' : 'You’re all caught up'}</h2>${unpaid.length ? `<div class="field"><label for="funding-account">Pay from</label><select id="funding-account">${accounts.map(item => `<option value="${item.id}" ${item.id === accountId ? 'selected' : ''}>${e(item.name)} · ${cash(item.balance)}</option>`).join('')}</select></div><p>${unpaid.length} unpaid expenses · <strong>${cash(outstanding)}</strong> total</p><p>Balance after payment: ${cash(account.balance - outstanding)}</p>${insufficient ? '<p class="field-error" role="status">Insufficient funds in this account. Choose another account to pay all expenses.</p>' : ''}${Button({ label: `Pay all ${unpaid.length} expenses · ${cash(outstanding)}`, action: 'pay', disabled: insufficient || busy })}<p class="quiet">Review the total in the confirmation before simulating payment.</p>` : '<p>All six expenses have been paid in this demo.</p>'}</section>
      ${Button({ label: 'Reset money demo', action: 'reset-money', variant: 'text' })}`;
  }
  const onChange = event => {
    if (event.target.id === 'funding-account') { accountId = event.target.value; render(); container.querySelector('#funding-account')?.focus(); }
  };
  container.addEventListener('change', onChange);
  const cleanup = bindActions(container, {
    pay: async () => {
      if (busy) return;
      const result = payAllExpenses(getState().payments, accountId);
      if (result.error) { toast(result.error); return; }
      busy = true;
      const name = moneySnapshot(getState().payments).accounts.find(item => item.id === accountId).name;
      const confirmed = await confirmAction('Simulate all payments?', `Mark ${result.count} expenses paid and deduct ${cash(result.total)} from ${name} in this demo? No real money will move.`, 'Simulate payments');
      if (confirmed) {
        const latest = payAllExpenses(getState().payments, accountId);
        if (latest.error) toast(latest.error);
        else { updateState({ payments: latest.payments }); receipt = `Demo payment complete. ${latest.count} expenses paid: ${cash(latest.total)} from ${name}.`; }
      }
      busy = false; render(); container.querySelector(confirmed ? '[data-action="reset-money"]' : '[data-action="pay"]')?.focus();
    },
    'reset-money': async () => {
      if (!await confirmAction('Reset money demo?', 'Restore the original sample account balances and mark all demo expenses unpaid.', 'Reset money demo')) return;
      updateState({ payments: {} }); receipt = ''; accountId = 'checking'; render(); toast('Sample balances and expenses restored.'); container.querySelector('[data-action="pay"]')?.focus();
    }
  });
  render();
  return () => { cleanup(); container.removeEventListener('change', onChange); };
}
