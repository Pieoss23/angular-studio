import { Component, computed, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-ex08-http-resource',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="8" topic="Dati async" folder="ex08-http-resource"
      title="httpResource(): REST dichiarativo">

      <div class="card row">
        <button class="btn" (click)="userId.set(Math.max(1, userId() - 1))">‹</button>
        <strong>userId {{ userId() }}</strong>
        <button class="btn" (click)="userId.set(Math.min(10, userId() + 1))">›</button>
        <input placeholder="filtra per titolo" [value]="q()"
          (input)="q.set($any($event.target).value)" />
      </div>

      <div class="card">
        <!-- TODO(8.4): loading / error / lista di filtered() -->
        <p class="hint">Completa il template usando postsResource e filtered().</p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex08HttpResource {
  protected readonly Math = Math;
  readonly userId = signal(1);
  readonly q = signal('');

  // TODO(8.2): postsResource = httpResource<Post[]>(() => `.../posts?userId=${this.userId()}`)

  // TODO(8.3): count = computed(() => postsResource.value()?.length ?? 0)

  // TODO(8.5): filtered = computed -> value() filtrato per q() (case-insensitive)
  readonly filtered = computed<Post[]>(() => []);
}
