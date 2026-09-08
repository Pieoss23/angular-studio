import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heavy-chart',
  template: `
    <div class="chart">
      <strong>📊 HeavyChart</strong> — modalità: {{ mode() }}
      <div class="bars">
        @for (h of bars; track $index) {
          <span [style.height.%]="h"></span>
        }
      </div>
    </div>
  `,
  styles: `
    .chart { border: 1px dashed var(--accent-2); border-radius: 10px; padding: 14px; }
    .bars { display: flex; gap: 6px; align-items: flex-end; height: 120px; margin-top: 10px; }
    .bars span { flex: 1; background: var(--accent-2); border-radius: 3px 3px 0 0; }
  `,
})
export class HeavyChart {
  readonly mode = input('overview');
  protected readonly bars = [30, 70, 45, 90, 55, 80, 25, 60];

  constructor() {
    console.log('[HeavyChart] costruito — il chunk lazy è stato caricato');
  }
}
