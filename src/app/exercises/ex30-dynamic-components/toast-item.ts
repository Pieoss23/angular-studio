import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toast-item',
  template: `
    <div class="card" [style.border-color]="kind() === 'error' ? '#e5484d' : 'var(--accent-2)'">
      <span>{{ kind() === 'error' ? '⚠️' : 'ℹ️' }} {{ message() }}</span>
      <button class="btn" (click)="dismissed.emit()">chiudi</button>
    </div>
  `,
  styles: `
    .card { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  `,
})
export class ToastItem {
  readonly message = input.required<string>();
  readonly kind = input<'info' | 'error'>('info');
  readonly dismissed = output<void>();
}
