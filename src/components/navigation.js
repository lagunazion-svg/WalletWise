import { getState } from '../lib/store.js';
export function renderNavigation(route) {
  const active = route.startsWith('/compare') ? 'Compare' : route.startsWith('/plan') ? 'Plan' : route.startsWith('/saved') ? 'Saved' : 'Explore';
  const count = getState().selected.length;
  document.getElementById('navigation').innerHTML = [['Explore', '/'], ['Compare', '/compare'], ['Plan', '/plan'], ['Saved', '/saved']].map(([label, href]) => `<a href="#${href}" ${label === active ? 'aria-current="page"' : ''}><span>${label}</span>${label === 'Compare' && count ? `<span class="nav-count" aria-label="${count} selected">${count}</span>` : ''}</a>`).join('');
}
