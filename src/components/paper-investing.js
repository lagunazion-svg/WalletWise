import { toast } from './ui.js';
import { getState, buyInvestment, updateState } from '../lib/store.js';
import { investmentPrice } from '../lib/investment-prices.js';
import { currency } from '../lib/format.js';

export function paperBalance() {
  const state = getState();
  const value = Object.entries(state.holdings).reduce((sum, [id, units]) => sum + units * investmentPrice(id), 0);
  return `<section class="highlight"><h2>Paper investing</h2><p>Available to invest: <strong>${currency(state.paperCash / 100)}</strong></p><p>Investments: ${currency(value)}</p><button type="button" class="paper-reset" data-reset-paper>Reset paper investments</button></section>`;
}

export function paperPurchase(product) {
  const price = investmentPrice(product.id);
  if (!price) return '';
  const units = getState().holdings[product.id] || 0;
  return `<form class="paper-purchase" data-buy-product="${product.id}">
    <p>Your investment: <strong>${currency(units * price)}</strong> · ${Number(units.toFixed(6))} units</p>
    <p class="quiet">Sample price: ${currency(price)} per unit. Fractional units allowed.</p>
    <div class="field"><label for="buy-mode-${product.id}">Buy in</label><select id="buy-mode-${product.id}" name="mode"><option value="dollars">Dollars</option><option value="units">Units</option></select></div>
    <div class="field"><label for="buy-amount-${product.id}">Amount</label><input id="buy-amount-${product.id}" name="amount" type="number" min="0.000001" step="any" required inputmode="decimal"></div>
    <p class="field-error" role="alert" data-buy-error></p>
    <button class="button button-primary" type="submit">Buy with paper money</button>
  </form>`;
}

export function bindPaperPurchases(container, refresh) {
  const onClick = event => {
    if (!event.target.closest('[data-reset-paper]')) return;
    updateState({ paperCash: 500000, holdings: {} });
    refresh();
    toast('Paper investments reset. You have $5,000 to invest.');
    container.querySelector('[data-reset-paper]').focus();
  };
  const onSubmit = event => {
    const form = event.target.closest('[data-buy-product]');
    if (!form) return;
    event.preventDefault();
    const result = buyInvestment(form.dataset.buyProduct, form.elements.mode.value, Number(form.elements.amount.value));
    if (result.error) {
      form.querySelector('[data-buy-error]').textContent = result.error;
      return;
    }
    const id = form.dataset.buyProduct;
    refresh();
    toast('Paper purchase complete: ' + currency(result.cost / 100) + '.');
    container.querySelector(`#buy-amount-${id}`).focus();
  };
  container.addEventListener('submit', onSubmit);
  container.addEventListener('click', onClick);
  return () => {
    container.removeEventListener('submit', onSubmit);
    container.removeEventListener('click', onClick);
  };
}
