import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    <div class="rating">
      @if (label()) { <span class="hint">{{ label() }}</span> }
      <div class="row">
        @for (filled of stars(); track $index) {
          <button class="star" [class.on]="filled" (click)="pick($index)">★</button>
        }
      </div>
    </div>
  `,
  styles: `
    .star { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--border); padding: 0 2px; }
    .star.on { color: var(--warn); }
  `,
})
export class Rating {
  // TODO(3.1): max, input opzionale default 5
  readonly max = input(5);

  // TODO(3.2): value, input required<number>()
  readonly value = input.required<number>();

  // TODO(3.3): label, alias "caption", transform trim
  readonly label = input('', {
    alias: 'caption',
    transform: (value: string) => value.trim()
  });

  // TODO(3.5): rate = output<number>()
    readonly rate = output<number>();

  // TODO(3.4): stars = computed<boolean[]>: lunghezza max(), true se i < value()
  readonly stars = computed<boolean[]>(() => Array.from({
    length: this.max()},
  (_, i) => i < this.value(),
  ));

  pick(i: number): void {
    // TODO(3.5): emetti i + 1 su rate
    this.rate.emit(i + 1);
  }

}
