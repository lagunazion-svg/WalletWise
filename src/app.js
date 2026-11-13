import { mountExplore } from './pages/explore.js';
import { mountCompare } from './pages/compare.js';
import { mountPlan } from './pages/plan.js';
import { mountSaved } from './pages/saved.js';
import { renderNavigation } from './components/navigation.js';
import { Button, pageHeading } from './components/ui.js';
import { canPersist } from './lib/store.js';
const main = document.getElementById('main');
let cleanup = () => {};
const routeHistory = [];
let routeHistoryIndex = -1;
function currentRoute() { return location.hash.slice(1) || '/'; }
function recordNavigation(route) {
  if (routeHistory[routeHistoryIndex] === route) return;
  routeHistory.splice(routeHistoryIndex + 1);
  routeHistory.push(route);
  routeHistoryIndex = routeHistory.length - 1;
}
function trackRoute() {
  const route = currentRoute();
  if (routeHistory[routeHistoryIndex] === route) return;
  if (routeHistory[routeHistoryIndex - 1] === route) routeHistoryIndex--;
  else if (routeHistory[routeHistoryIndex + 1] === route) routeHistoryIndex++;
  else recordNavigation(route);
}
export function navigate(path) {
  recordNavigation(path);
  if (location.hash === `#${path}`) render();
  else location.hash = path;
}
export function refreshNavigation() { renderNavigation(currentRoute()); }
function render() {
  trackRoute();
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
document.getElementById('back-button').addEventListener('click', () => {
  if (routeHistoryIndex > 0) window.history.back();
  else navigate('/');
});
document.addEventListener('click', event => {
  if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (link) recordNavigation(link.hash.slice(1) || '/');
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); });
window.addEventListener('hashchange', render);
render();
