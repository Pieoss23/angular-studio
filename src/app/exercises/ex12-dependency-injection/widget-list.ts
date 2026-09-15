import { Component, inject } from '@angular/core';
import { Widget, WIDGETS } from './tokens';

@Component({
  selector: 'app-widget-list',
  template: `
    @if (widgets.length) {
      <ul>
        @for (w of widgets; track w.id) {
          <li>{{ w.label }}</li>
        }
      </ul>
    } @else {
      <p class="hint">nessun widget registrato</p>
    }
  `,
})
export class WidgetList {
  // TODO(12.4 - bonus): inietta WIDGETS. Il token non ha una factory di default,
  // quindi se nessuno lo fornisce lancia un errore: usa { optional: true } e
  // fai fallback a [] con ??.
  protected readonly widgets = inject(WIDGETS, { optional: true }) ?? [];
  // protected readonly widgets: Widget[] = [];
}
