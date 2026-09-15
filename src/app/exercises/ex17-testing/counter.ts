import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div class="row">
      <button class="btn" (click)="decrement()">-</button>
      <span data-testid="count">{{ count() }}</span>
      <button class="btn" (click)="increment()">+</button>
      <button class="btn" (click)="reset()">reset</button>
    </div>
  `,
})
export class Counter {
  readonly count = signal(0);

  increment(): void {
    this.count.update((c) => c + 1);
  }

  decrement(): void {
    // non va sotto zero
    this.count.update((c) => Math.max(0, c - 1));
  }

  reset(): void {
    this.count.set(0);
  }
}
