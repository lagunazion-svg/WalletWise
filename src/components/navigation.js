import { getState } from '../lib/store.js';
export function renderNavigation(route) {
  const isMainPage = route === '/' || route === '/money' || route === '/explore';
  document.getElementById('home-button').hidden = isMainPage;
  document.getElementById('back-button').hidden = isMainPage;
  const active = route === '/' || route === '/money' ? 'Money' : route.startsWith('/compare') ? 'Compare' : route.startsWith('/plan') ? 'Plan' : route.startsWith('/saved') ? 'Saved' : 'Explore';
  const count = getState().selected.length;
  document.getElementById('navigation').innerHTML = [['Money', '/money'], ['Explore', '/explore'], ['Compare', '/compare'], ['Plan', '/plan'], ['Saved', '/saved']].map(([label, href]) => `<a href="#${href}" ${label === active ? 'aria-current="page"' : ''}><span>${label}</span>${label === 'Compare' && count ? `<span class="nav-count" aria-label="${count} selected">${count}</span>` : ''}</a>`).join('');
}
