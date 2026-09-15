import { Component } from '@angular/core';
import { STUDIO_CONFIG } from './tokens';
import { GreetingBadge } from './greeting-badge';

@Component({
  selector: 'app-branded-section',
  imports: [GreetingBadge],
  // TODO(12.3): sovrascrivi STUDIO_CONFIG SOLO per questo componente e i suoi figli
  providers: [
    { provide: STUDIO_CONFIG, useValue: { appName: 'Studio Rebrand', supportEmail: 'rebrand@studio.dev' } },
  ],
  template: `
    <div class="card" style="border-color: var(--accent)">
      <p class="hint">sezione con provider locale ↓</p>
      <app-greeting-badge />
    </div>
  `,
})
export class BrandedSection {}
