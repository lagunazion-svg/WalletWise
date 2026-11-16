import { getProduct } from '../lib/products.js';
import { currency, escapeHTML as e } from '../lib/format.js';

// Monthly sample values, November 2024 through November 2026. Not market data.
const history = {
  i1: [100, 102, 101, 104, 103, 106, 108, 105, 109, 111, 110, 114, 116, 113, 117, 119, 118, 122, 120, 124, 127, 125, 129, 131, 130],
  i2: [100, 103, 99, 105, 102, 108, 106, 110, 104, 109, 112, 108, 115, 111, 117, 114, 120, 116, 122, 118, 125, 121, 127, 124, 126],
  i3: [100, 100.5, 100.2, 100.8, 101, 100.7, 101.2, 101.5, 101.1, 101.8, 102, 101.7, 102.2, 102.5, 102.1, 102.8, 103, 102.6, 103.2, 103.5, 103.1, 103.8, 104, 103.6, 104.2],
  i4: [100, 110, 104, 118, 112, 108, 120, 115, 130, 122, 116, 128, 140, 132, 145, 138, 125, 134, 120, 128, 115, 122, 110, 118, 112],
  i5: [100, 125, 110, 145, 120, 160, 135, 115, 150, 180, 155, 190, 165, 140, 175, 210, 170, 195, 150, 185, 220, 180, 205, 170, 195]
};
const ranges = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, ALL: 24 };

export function investmentChart(product, range = '3M') {
  if (!history[product.id]) return '';
  const months = ranges[range];
  const values = history[product.id].slice(-months - 1);
  const first = values[0];
  const last = values[values.length - 1];
  const change = (last - first) / first * 100;
  const low = Math.min(...values);
  const high = Math.max(...values);
  const padding = Math.max((high - low) * 0.2, 1);
  const bottom = low - padding;
  const top = high + padding;
  const points = values.map((value, index) => `${index / (values.length - 1) * 300},${140 - (value - bottom) / (top - bottom) * 120}`).join(' ');
  const start = new Date(Date.UTC(2026, 10 - months, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `<section class="investment-chart" data-chart-product="${product.id}" aria-label="${e(product.name)} sample value chart">
    <p class="chart-label">Sample value per unit</p>
    <div class="chart-summary" aria-live="polite"><strong>${currency(last)}</strong><span>${change >= 0 ? '+' : ''}${change.toFixed(2)}% (${range})</span></div>
    <svg viewBox="0 0 300 160" role="img" aria-label="Fictional monthly values from ${start} to Nov 2026, starting at ${currency(first)} and ending at ${currency(last)}. Range ${currency(low)} to ${currency(high)}.">
      ${[20, 80, 140].map(y => `<line x1="0" y1="${y}" x2="300" y2="${y}" class="chart-grid" />`).join('')}
      <polygon points="0,150 ${points} 300,150" class="chart-area" />
      <polyline points="${points}" class="chart-line" />
    </svg>
    <div class="chart-dates"><span>${start}</span><span>Nov 2026</span></div>
    <div class="chart-ranges" role="group" aria-label="Chart time range">${Object.keys(ranges).map(label => `<button type="button" data-chart-range="${label}" aria-pressed="${label === range}">${label}</button>`).join('')}</div>
    
  </section>`;
}

export function bindInvestmentCharts(container) {
  const onClick = event => {
    const button = event.target.closest('[data-chart-range]');
    if (!button || !container.contains(button)) return;
    const chart = button.closest('[data-chart-product]');
    const range = button.dataset.chartRange;
    const id = chart.dataset.chartProduct;
    chart.outerHTML = investmentChart(getProduct(id), range);
    container.querySelector(`[data-chart-product="${id}"] [data-chart-range="${range}"]`).focus();
  };
  container.addEventListener('click', onClick);
  return () => container.removeEventListener('click', onClick);
}
