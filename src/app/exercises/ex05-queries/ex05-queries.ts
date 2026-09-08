import { Component, computed, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex05-queries',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="5" topic="Componenti" folder="ex05-queries"
      title="Query come signal: viewChild / viewChildren">

      <div class="card row">
        <input #box placeholder="scrivimi dentro" />
        <button class="btn" (click)="focusInput()">focus</button>
      </div>

      <div class="card">
        <button class="btn" (click)="addRow()">aggiungi riga</button>
        <p class="hint">li visibili (da computed sulla query): <strong>{{ count() }}</strong></p>
        <ul>
          @for (r of rows(); track $index) {
            <li #item>{{ r }}</li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex05Queries {
  readonly rows = signal<string[]>(['riga 1', 'riga 2']);

  // TODO(5.1): box = viewChild.required<ElementRef<HTMLInputElement>>('box')

  // TODO(5.3): items = viewChildren<ElementRef<HTMLLIElement>>('item')

  // TODO(5.4): count = computed(() => items().length)
  readonly count = computed(() => 0);

  constructor() {
    // TODO(5.5): effect -> console.log('li visibili:', count())
  }

  focusInput(): void {
    // TODO(5.2): this.box().nativeElement.focus()
  }

  addRow(): void {
    this.rows.update((r) => [...r, `riga ${r.length + 1}`]);
  }
}
