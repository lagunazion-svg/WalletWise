import { mountExplore } from './pages/explore.js';
import { mountCompare } from './pages/compare.js';
import { mountPlan } from './pages/plan.js';
import { mountSaved } from './pages/saved.js';
import { renderNavigation } from './components/navigation.js';
import { Button, pageHeading } from './components/ui.js';
import { canPersist } from './lib/store.js';
const main = document.getElementById('main');
let cleanup = () => {};
export function navigate(path) {
  if (location.hash === `#${path}`) render();
  else location.hash = path;
}
export function refreshNavigation() { renderNavigation(location.hash.slice(1).split('?')[0] || '/'); }
function render() {
  cleanup(); cleanup = () => {};
  const hash = location.hash.slice(1) || '/';
  const [path, query = ''] = hash.split('?');
  const context = { container: main, path, params: new URLSearchParams(query), navigate, refreshNavigation };
  const mount = path === '/' || path === '/explore' || path.startsWith('/product/') ? mountExplore : path === '/compare' || path === '/compare/scenario' ? mountCompare : path === '/plan' || path === '/plan/review' ? mountPlan : path === '/saved' ? mountSaved : null;
  if (mount) cleanup = mount(context) || (() => {});
  else main.innerHTML = pageHeading('That page is unavailable', 'Return to Explore to find your next step.') + Button({ label: 'Back to Explore', href: '#/' });
  refreshNavigation();
  if (!canPersist()) main.insertAdjacentHTML('afterbegin', '<p class="notice" role="status">Browser storage is unavailable. Your choices work for this session but may not survive a refresh.</p>');
  document.title = `${main.querySelector('h1')?.textContent.replace(/\n/g, ' ') || 'Explore'} · Wallet Wise`;
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); });
window.addEventListener('hashchange', render);
render();
