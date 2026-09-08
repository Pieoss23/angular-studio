import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="row">
      <button class="btn" [disabled]="value() <= min()" (click)="dec()">−</button>
      <strong>{{ value() }}</strong>
      <button class="btn" [disabled]="value() >= max()" (click)="inc()">+</button>
    </div>
  `,
})
export class Stepper {
  // TODO(4.1): value = model<number>(0)
  readonly value = model<number>(0);

  // TODO(4.2): min / max input opzionali (0 e 10)
  readonly min = input<number>(0);
  readonly max = input<number>(10);

  inc(): void {
    // TODO(4.3): +1 con clamp a max()
    this.value.update((currValue) =>
      Math.min(currValue + 1, this.max()));

  }


  dec(): void {
    // TODO(4.3): -1 con clamp a min()
    this.value.update((currValue) =>
      Math.max(currValue - 1, this.min()));
  }
}
