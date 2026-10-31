import { pageHeading, Button } from '../components/ui.js';
export function mountCompare({ container }) {
  container.innerHTML = pageHeading('Compare module', 'Shared foundation: this feature is ready for its owner to add.') + '<section class="card"><h2>Part B: Compare</h2><p>Apply the B-Compare-Module.zip files to this project to enable this feature.</p></section>' + Button({ label: 'Back to Explore', href: '#/', variant: 'secondary' });
}
