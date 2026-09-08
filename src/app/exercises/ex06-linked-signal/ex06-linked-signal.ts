import { Component, computed, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface Product {
  id: number;
  name: string;
  category: 'frutta' | 'verdura' | 'pane';
}

@Component({
  selector: 'app-ex06-linked-signal',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="6" topic="Reattività" folder="ex06-linked-signal"
      title="linkedSignal: stato derivato ma scrivibile">

      <div class="card row">
        <label>Categoria:</label>
        <select [value]="category()" (change)="category.set($any($event.target).value)">
          <option value="tutte">tutte</option>
          <option value="frutta">frutta</option>
          <option value="verdura">verdura</option>
          <option value="pane">pane</option>
        </select>
      </div>

      <div class="card">
        <ul class="list">
          @for (p of visible(); track p.id) {
            <li>
              <button class="btn" [class.primary]="p.id === selectedId()" (click)="select(p.id)">
                {{ p.name }}
              </button>
            </li>
          }
        </ul>
        <p class="hint">Selezionato: <strong>{{ selected()?.name ?? '—' }}</strong></p>
      </div>
    </app-exercise-shell>
  `,
  styles: `.list { list-style: none; padding: 0; display: flex; gap: 8px; flex-wrap: wrap; }`,
})
export class Ex06LinkedSignal {
  readonly category = signal<'tutte' | Product['category']>('tutte');

  private readonly products = signal<Product[]>([
    { id: 1, name: 'Mele', category: 'frutta' },
    { id: 2, name: 'Banane', category: 'frutta' },
    { id: 3, name: 'Zucchine', category: 'verdura' },
    { id: 4, name: 'Carote', category: 'verdura' },
    { id: 5, name: 'Baguette', category: 'pane' },
  ]);

  readonly visible = computed(() => {
    const c = this.category();
    return c === 'tutte' ? this.products() : this.products().filter((p) => p.category === c);
  });

  // TODO(6.1): selectedId = linkedSignal(() => this.visible()[0]?.id ?? null)
  readonly selectedId = signal<number | null>(null);

  // TODO(6.3): selected = computed -> prodotto con id === selectedId()
  readonly selected = computed<Product | null>(() => null);

  select(id: number): void {
    // TODO(6.2): selectedId.set(id)
  }
}
