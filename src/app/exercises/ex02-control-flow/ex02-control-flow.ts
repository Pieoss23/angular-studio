import { Component, computed, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

type Status = 'todo' | 'doing' | 'done';
interface Task {
  id: number;
  label: string;
  status: Status;
}

@Component({
  selector: 'app-ex02-control-flow',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="2" topic="Template" folder="ex02-control-flow" completed
      title="Nuovo control flow: @if / @for / @switch">

      <div consegna>
        <h3>Concetti</h3>
        <ul>
          <li><code>&#64;if / &#64;else if / &#64;else</code></li>
          <li><code>&#64;for (item of list; track item.id)</code> — <code>track</code> è obbligatorio</li>
          <li>variabili implicite: <code>$index</code>, <code>$first</code>, <code>$last</code>, <code>$even</code>, <code>$odd</code>, <code>$count</code></li>
          <li><code>&#64;empty</code> per la lista vuota</li>
          <li><code>&#64;switch / &#64;case / &#64;default</code></li>
          <li>niente più <code>*ngIf</code> / <code>*ngFor</code> / <code>NgSwitch</code> negli import</li>
        </ul>
        <h3>Consegna</h3>
        <ul>
          <li>lista <code>tasks</code> con <code>&#64;for</code>, <code>track</code> su <code>t.id</code></li>
          <li>riga alternata: classe <code>odd</code> quando <code>$odd</code></li>
          <li><code>&#64;empty</code> → "Nessun task"</li>
          <li>badge di stato con <code>&#64;switch</code>: <code>done</code> ✅, <code>doing</code> 🔧, <code>todo</code> ⭕, default "?"</li>
          <li><code>&#64;if</code> sul contatore: <code>remaining() === 0</code> → "Tutto fatto 🎉", altrimenti "Rimasti: N" con <code>&#64;else</code></li>
        </ul>
        <h3>Criteri di valutazione — <span class="check">5 / 5</span></h3>
        <ul class="checklist">
          <li><span class="check">✅</span> <code>track</code> corretto (per id, non <code>$index</code>)</li>
          <li><span class="check">✅</span> <code>&#64;empty</code> funzionante filtrando fino a lista vuota</li>
          <li><span class="check">✅</span> <code>&#64;switch</code> con <code>&#64;default</code></li>
          <li><span class="check">✅</span> nessun import di direttive strutturali legacy</li>
          <li><span class="check">✅</span> uso di almeno una variabile implicita (<code>$odd</code>)</li>
        </ul>
        <p class="hint">
          Nit residui (non a punteggio): testo badge "Completati"/"Notask" → meglio "Fatto"/"?";
          spazio dopo <code>&#64;for</code> per leggibilità.
        </p>
      </div>

      <div imparato>
        <h3>Esito: ✅ completato — 5/5</h3>
        <ul>
          <li>Il nuovo control flow è <strong>built-in</strong>: nessun import, niente <code>CommonModule</code>. <code>*ngIf</code>/<code>*ngFor</code>/<code>ngSwitch</code> sono deprecati.</li>
          <li><code>track</code> in <code>&#64;for</code> è <strong>obbligatorio</strong> e deve essere un id stabile: guida il riuso dei nodi DOM. <code>track $index</code> è un anti-pattern per liste che si riordinano/filtrano.</li>
          <li>Variabili implicite disponibili senza dichiararle: <code>$index $first $last $even $odd $count</code>.</li>
          <li><code>&#64;empty</code> scatta quando la collezione dell'<code>&#64;for</code> è vuota — qui grazie al <code>computed</code> <code>visibleTasks()</code> che si svuota col filtro.</li>
          <li><code>&#64;switch</code> senza <code>&#64;default</code>: se il valore non matcha nessun <code>&#64;case</code> non renderizza nulla → metti sempre <code>&#64;default</code> anche quando "oggi" i casi sono esaustivi.</li>
          <li><code>&#64;case</code> confronta con <code>===</code>; l'espressione va tra parentesi: <code>&#64;case ('todo')</code>.</li>
        </ul>
        <h3>Errori corretti in review</h3>
        <ul>
          <li>Mancava <code>&#64;default</code> nello <code>&#64;switch</code> (criterio 3).</li>
          <li>Regressione: <code>[class.odd]="$first"</code> evidenziava solo la prima riga invece delle dispari → <code>"$odd"</code>.</li>
          <li>Rimossi i commenti <code>&lt;!-- TODO(2.x) --&gt;</code> lasciati nel template.</li>
        </ul>
      </div>

      <div class="card row">
        <label>Filtro:</label>
        <select [value]="filter()" (change)="filter.set($any($event.target).value)">
          <option value="all">tutti</option>
          <option value="todo">todo</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
      </div>

      <div class="card">
        <ul class="list">

          @for(task of visibleTasks(); track task.id ){
            <li [class.odd]="$odd">
              <span>
                {{task.label}}
              </span>


            @switch (task.status) {
              @case ('todo') {
                <span class="badge">Da fare</span>
              }
              @case ('doing') {
                <span class="badge">In corso</span>
              }
              @case ('done') {
                <span class="badge">Completati</span>
              }
            @default
            { <span class="badge">Notask</span> }

            }
          </li>
          }
          @empty {
          <li>Nessun task</li>
          }
        </ul>
      </div>

      <div class="card">
        @if (remaining() === 0) {
          <p>Tutto fatto 🎉</p>
        } @else {
          <p>Rimasti: {{ remaining() }}</p>
        }
      </div>
    </app-exercise-shell>
  `,
  styles: `
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 8px 10px; border-radius: 6px; }
    .list li.odd { background: var(--panel-2); }
    .badge {
      font-size: 0.8rem;
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--accent-2);
    }
  `,
})
export class Ex02ControlFlow {
  readonly filter = signal<'all' | Status>('all');

  private readonly tasks = signal<Task[]>([
    { id: 1, label: 'Studiare i signal', status: 'done' },
    { id: 2, label: 'Nuovo control flow', status: 'done' },
    { id: 3, label: 'Deferrable views', status: 'done' },
    { id: 4, label: 'Functional interceptor', status: 'done' },
    { id: 5, label: 'Scrivere il report', status: 'done' },
  ]);

  readonly visibleTasks = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.tasks() : this.tasks().filter((t) => t.status === f);
  });

  readonly remaining = computed(() => this.tasks().filter((t) => t.status !== 'done').length);
}
