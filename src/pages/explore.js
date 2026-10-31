// Explore owner: home, category browsing, product details and plain-language learning.
import { categories, getProduct, getProducts } from '../lib/products.js';
import { getState, toggleSaved, toggleSelected, updateState } from '../lib/store.js';
import { escapeHTML as e, costSummary, startingCost, dollars } from '../lib/format.js';
import { Button, pageHeading, demoNote, bindActions, toast, confirmAction } from '../components/ui.js';
export function mountExplore(context) {
  const { container, path, params, navigate, refreshNavigation } = context;
  if (path === '/') {
    container.innerHTML = pageHeading('Money choices,\nmade clearer.', 'Understand your options before your next money decision.') + `
      <section class="card home-plan"><h2>A choice you can explain</h2><p>Compare costs, explore trade-offs and keep your reasons.</p>${Button({ label: 'Build a decision plan', href: '#/plan', variant: 'secondary' })}</section>
      <div class="button-stack home-categories">${categories.map((cat, index) => Button({ label: `Explore ${cat.toLowerCase()}`, href: `#/explore?category=${encodeURIComponent(cat)}`, variant: index === 0 ? 'primary' : 'secondary' })).join('')}</div>
      <p class="quiet">No sign-up. No credit check. Sample data only.</p>`;
    return;
  }
  if (path.startsWith('/product/')) return mountDetails(context);
  const category = categories.includes(params.get('category')) ? params.get('category') : categories[0];
  container.innerHTML = pageHeading(category, 'Compare costs and starting requirements.') + `
    <div class="category-tabs" aria-label="Product category">${categories.map(cat => `<a href="#/explore?category=${encodeURIComponent(cat)}" ${cat === category ? 'aria-current="page"' : ''}>${e(cat)}</a>`).join('')}</div>
    <div class="browse-controls"><label class="filter-toggle"><input type="checkbox" id="no-fee">No ongoing fee</label>
      <label class="sort-label" for="sort-order">Sort<select id="sort-order"><option value="original">Original order</option><option value="fee">Lowest ongoing fee</option>${category === 'Credit cards' ? '<option value="apr">Lowest APR</option>' : ''}</select></label>
    </div>
    <label class="search-label" for="option-search">Find an option<input type="search" id="option-search" placeholder="Search options" autocomplete="off"></label>
    <p id="results-count" class="quiet" role="status"></p><div id="product-list" class="card-stack"></div>
    <div class="browse-actions button-stack"><div id="compare-button"></div>${Button({ label: 'Clear comparison', action: 'clear', variant: 'text' })}</div>${demoNote()}`;
  const list = container.querySelector('#product-list');
  const renderProducts = () => {
    let items = getProducts(category);
    const text = container.querySelector('#option-search').value.trim().toLowerCase();
    if (container.querySelector('#no-fee').checked) items = items.filter(product => product.fee === 0);
    if (text) items = items.filter(product => `${product.name} ${product.tag}`.toLowerCase().includes(text));
    const sort = container.querySelector('#sort-order').value;
    if (sort === 'fee') items.sort((a, b) => a.fee - b.fee);
    if (sort === 'apr') items.sort((a, b) => a.apr - b.apr);
    const { selected, saved } = getState();
    container.querySelector('#results-count').textContent = `${items.length} ${items.length === 1 ? 'option' : 'options'}${text ? ' found' : ''}`;
    list.innerHTML = items.length ? items.map(product => `
      <article class="card product-card" data-product="${product.id}">
        <h2><a href="#/product/${product.id}">${e(product.name)}</a>${saved.includes(product.id) ? '<span class="saved-label">Saved</span>' : ''}</h2>
        <p>${e(costSummary(product))}<br>${e(startingCost(product))}</p>
        <p class="product-tag">${e(product.tag)}</p>
        ${Button({ label: selected.includes(product.id) ? 'Selected for comparison' : 'Add to compare', action: 'select', value: product.id, variant: selected.includes(product.id) ? 'primary' : 'secondary', extra: `aria-pressed="${selected.includes(product.id)}" aria-label="${selected.includes(product.id) ? 'Remove' : 'Add'} ${e(product.name)} ${selected.includes(product.id) ? 'from' : 'to'} comparison"` })}
        <a class="text-link" href="#/product/${product.id}">View details<span class="sr-only"> for ${e(product.name)}</span></a>
      </article>`).join('') : `<div class="empty-state"><h2>No matching options</h2><p>Try a different search or turn off the fee filter.</p>${Button({ label: 'Clear filters', action: 'filters', variant: 'secondary' })}</div>`;
    container.querySelector('#compare-button').innerHTML = Button({ label: `Compare selected (${selected.length})`, href: '#/compare' });
    refreshNavigation();
  };
  const filter = container.querySelector('#no-fee');
  const sort = container.querySelector('#sort-order');
  const search = container.querySelector('#option-search');
  filter.addEventListener('change', renderProducts); sort.addEventListener('change', renderProducts); search.addEventListener('input', renderProducts);
  const cleanup = bindActions(container, {
    select: id => { const result = toggleSelected(id); if (result.error) toast(result.error); renderProducts(); },
    clear: () => { updateState({ selected: [] }); renderProducts(); toast('Comparison cleared.'); },
    filters: () => { filter.checked = false; search.value = ''; sort.value = 'original'; renderProducts(); }
  });
  renderProducts();
  return cleanup;
}
function mountDetails({ container, path, navigate, refreshNavigation }) {
  const product = getProduct(path.split('/')[2]);
  if (!product) { container.innerHTML = pageHeading('Option unavailable', 'Choose another option from Explore.') + Button({ label: 'Explore options', href: '#/explore' }); return; }
  const render = () => {
    const { saved, selected } = getState();
    const summary = product.cat === 'Credit cards' ? `${dollars(product.fee)} annual fee` : product.cat === 'Bank accounts' ? `${product.apy}% variable APY` : product.risk;
    const secondary = product.cat === 'Credit cards' ? `${product.apr}% APR · ${startingCost(product)}` : `${costSummary(product)} · ${startingCost(product)}`;
    container.innerHTML = pageHeading(product.name, `${product.cat === 'Credit cards' ? 'Credit card' : product.cat === 'Bank accounts' ? 'Bank account' : 'Investing option'} · fictional option`) + `
      <section class="highlight"><p class="large-metric">${e(summary)}</p><p class="metric-description">${e(secondary)}</p></section>
      <section class="detail-section"><h2>What you need</h2><p>${e(product.req)}</p></section>
      <section class="detail-section"><h2>What to watch</h2><p>${e(product.con)}</p></section>
      <div class="button-stack">${Button({ label: saved.includes(product.id) ? 'Saved · remove from workspace' : 'Save option', action: 'save' })}${Button({ label: `Back to ${product.cat.toLowerCase()}`, href: `#/explore?category=${encodeURIComponent(product.cat)}`, variant: 'secondary' })}</div>
      <details class="learning"><summary>In plain language</summary><p>${e(product.learn)}</p><h3>Why consider it?</h3><p>${e(product.pro)}</p></details>
      <div class="button-stack">${Button({ label: selected.includes(product.id) ? 'Remove from comparison' : 'Add to comparison', action: 'compare', variant: 'secondary' })}${Button({ label: 'Open comparison', href: '#/compare', variant: 'text' })}</div>${demoNote()}`;
    refreshNavigation();
  };
  const cleanup = bindActions(container, {
    save: async () => {
      const removing = getState().saved.includes(product.id);
      if (removing && !await confirmAction('Remove saved option?', `${product.name} will leave your workspace. You can save it again later.`, 'Remove option')) return;
      toggleSaved(product.id); render(); toast(removing ? 'Option removed.' : 'Option saved in this browser.');
    },
    compare: () => { const result = toggleSelected(product.id); if (result.error) toast(result.error); else toast(result.added ? 'Added to comparison.' : 'Removed from comparison.'); render(); }
  });
  render(); return cleanup;
}
