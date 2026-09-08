import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface User {
  id: number;
  name: string;
  email: string;
}

const DB: Record<number, User> = {
  1: { id: 1, name: 'Ada Lovelace', email: 'ada@studio.dev' },
  2: { id: 2, name: 'Alan Turing', email: 'alan@studio.dev' },
  3: { id: 3, name: 'Grace Hopper', email: 'grace@studio.dev' },
  5: { id: 5, name: 'Edsger Dijkstra', email: 'edsger@studio.dev' },
};

export function fakeFetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 4) {
        reject(new Error(`Utente ${id} non disponibile`));
        return;
      }
      resolve(DB[id]);
    }, 600);
  });
}

@Component({
  selector: 'app-ex07-resource',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="7" topic="Dati async" folder="ex07-resource"
      title="resource(): async con loading / error / reload">

      <div class="card row">
        <button class="btn" (click)="prev()">‹ prev</button>
        <strong>id {{ userId() }}</strong>
        <button class="btn" (click)="next()">next ›</button>
        <button class="btn" (click)="reload()">ricarica</button>
      </div>

      <div class="card">
        <!-- TODO(7.3): isLoading / error / hasValue -->
        <p class="hint">Completa il template usando userResource.</p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex07Resource {
  readonly userId = signal(1);

  // TODO(7.2): userResource = resource({ params: () => this.userId(), loader: ({ params }) => fakeFetchUser(params) })

  prev(): void {
    this.userId.update((v) => Math.max(1, v - 1));
  }

  next(): void {
    this.userId.update((v) => Math.min(5, v + 1));
  }

  reload(): void {
    // TODO(7.4): userResource.reload()
  }
}
