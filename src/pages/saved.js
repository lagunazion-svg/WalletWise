import { pageHeading, Button } from '../components/ui.js';
export function mountSaved({ container }) {
  container.innerHTML = pageHeading('Saved module', 'Shared foundation: this feature is ready for its owner to add.') + '<section class="card"><h2>Part D: Saved</h2><p>Apply the D-Saved-Module.zip files to this project to enable this feature.</p></section>' + Button({ label: 'Back to Explore', href: '#/', variant: 'secondary' });
}
