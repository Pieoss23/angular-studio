import { Component, inject } from '@angular/core';
import { GreetingService } from './greeting.service';

@Component({
  selector: 'app-greeting-badge',
  template: `<p class="hint">{{ greeting.greet() }}</p>`,
})
export class GreetingBadge {
  protected readonly greeting = inject(GreetingService);
}
