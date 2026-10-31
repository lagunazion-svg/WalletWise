import { pageHeading, Button } from '../components/ui.js';
export function mountPlan({ container }) {
  container.innerHTML = pageHeading('Plan module', 'Shared foundation: this feature is ready for its owner to add.') + '<section class="card"><h2>Part C: Plan</h2><p>Apply the C-Plan-Module.zip files to this project to enable this feature.</p></section>' + Button({ label: 'Back to Explore', href: '#/', variant: 'secondary' });
}
