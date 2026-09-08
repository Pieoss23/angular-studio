import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { HeavyChart } from './heavy-chart';

@Component({
  selector: 'app-ex09-defer',
  imports: [ExerciseShell, HeavyChart],
  template: `
    <app-exercise-shell n="9" topic="Performance" folder="ex09-defer"
      title="Deferrable views: @defer">

      <div class="card">
        <p class="hint">Scrolla verso il basso: sotto lo spazio vuoto c'è il blocco differito.</p>
      </div>

      <div class="spacer">↓ scrolla ↓</div>

      <div class="card">
        <!--
          TODO(9.1 / 9.2): @defer (on viewport) { <app-heavy-chart /> }
          @placeholder { ... } @loading (minimum 500ms) { ... }
        -->
        <app-heavy-chart />
      </div>

      <div class="card">
        <button #showDetails class="btn">mostra dettagli</button>
        <!--
          TODO(9.3): @defer (on interaction(showDetails)) {
            <app-heavy-chart mode="details" />
          } @placeholder { <span class="hint">clicca il bottone</span> }
        -->
      </div>
    </app-exercise-shell>
  `,
  styles: `
    .spacer {
      height: 90vh; display: grid; place-items: start center;
      color: var(--muted); padding-top: 20px;
    }
  `,
})
export class Ex09Defer {}
