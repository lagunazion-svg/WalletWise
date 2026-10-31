export function escapeHTML(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
export const currency = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value));
export const dollars = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value));
export function monthlyInterest(balance, apr) {
  if (!Number.isFinite(balance) || !Number.isFinite(apr) || balance < 0 || apr < 0) throw new RangeError('Balance and APR must be non-negative numbers.');
  return Math.round((balance * apr / 100 / 12 + Number.EPSILON) * 100) / 100;
}
export function costSummary(product) {
  if (product.cat === 'Credit cards') return `${dollars(product.fee)} annual fee · ${product.apr}% APR`;
  if (product.cat === 'Bank accounts') return `${product.apy}% variable APY · ${dollars(product.fee)}/month`;
  return product.fee ? `${product.fee}% annual advisory fee · ${product.risk}` : `${dollars(0)} account fee · ${product.risk}`;
}
export function startingCost(product) {
  if (product.cat === 'Credit cards') return product.deposit ? `${dollars(product.deposit)} security deposit` : 'No security deposit';
  return product.min ? `${dollars(product.min)} starting amount` : 'No minimum starting amount';
}
