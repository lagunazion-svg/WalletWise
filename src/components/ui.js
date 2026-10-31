import { escapeHTML as e } from '../lib/format.js';
export function Button({ label, href, action, value = '', variant = 'primary', disabled = false, extra = '' }) {
  const classes = `button button-${variant}`;
  if (href) return `<a class="${classes}" href="${e(href)}" ${extra}>${e(label)}</a>`;
  return `<button class="${classes}" type="button" ${action ? `data-action="${e(action)}" data-value="${e(value)}"` : ''} ${disabled ? 'disabled' : ''} ${extra}>${e(label)}</button>`;
}
export function InputField({ name, label, value = '', type = 'text', hint = '', required = false, min = 0, max = 1000000, maxlength = 180 }) {
  return `<div class="field"><label for="${e(name)}">${e(label)}</label><input id="${e(name)}" name="${e(name)}" type="${e(type)}" value="${e(value)}" ${required ? 'required' : ''} ${type === 'number' ? `min="${min}" max="${max}" step="0.01" inputmode="decimal"` : `maxlength="${maxlength}"`} ${hint ? `aria-describedby="${e(name)}-hint"` : ''}>${hint ? `<p class="field-hint" id="${e(name)}-hint">${e(hint)}</p>` : ''}</div>`;
}
export function pageHeading(title, description, eyebrow = 'Fictional demo data') {
  return `<div class="page-heading"><p class="eyebrow">${e(eyebrow)}</p><h1>${e(title)}</h1>${description ? `<p class="subtitle">${e(description)}</p>` : ''}</div>`;
}
export const demoNote = () => '<p class="demo-note">Fictional products and sample rates. No applications, credit checks or money movement.</p>';
export function toast(message) {
  const element = document.getElementById('toast');
  clearTimeout(toast.timer); element.textContent = message; element.hidden = false;
  toast.timer = setTimeout(() => { element.hidden = true; }, 4200);
}
export function confirmAction(title, message, label = 'Confirm') {
  const dialog = document.getElementById('confirm-dialog');
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-message').textContent = message;
  document.getElementById('dialog-confirm').textContent = label;
  return new Promise(resolve => {
    const finish = result => { dialog.close(); dialog.oncancel = null; resolve(result); };
    document.getElementById('dialog-confirm').onclick = () => finish(true);
    document.getElementById('dialog-cancel').onclick = () => finish(false);
    dialog.oncancel = event => { event.preventDefault(); finish(false); };
    dialog.showModal();
  });
}
export function bindActions(container, actions) {
  const onClick = event => {
    const button = event.target.closest('[data-action]');
    if (button && container.contains(button)) actions[button.dataset.action]?.(button.dataset.value, button);
  };
  container.addEventListener('click', onClick);
  return () => container.removeEventListener('click', onClick);
}
