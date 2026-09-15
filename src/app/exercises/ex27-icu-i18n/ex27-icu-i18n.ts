import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex27-icu-i18n',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="27" topic="Template" folder="ex27-icu-i18n"
      title="Espressioni ICU: plural e select nel template">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          I messaggi <strong>ICU</strong> (ICU Message Format) sono una sintassi che Angular
          compila direttamente nel template, per scegliere un testo diverso in base a un valore —
          senza scrivere un <code>&#64;switch</code> a mano. Funzionano anche <strong>senza</strong>
          nessuna configurazione di i18n/estrazione: sono pura logica compilata client-side, utile
          ogni volta che serve testo condizionale sul valore (plurali, generi, stati).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li>schema <code>plural</code>: <code>variabile, plural, =0 &#123;caso zero&#125; =1 &#123;caso uno&#125; other &#123;caso generico&#125;</code>,
            il tutto racchiuso in un'unica coppia di graffe esterne</li>
          <li><code>other</code> è <strong>obbligatorio</strong>: è il fallback per ogni valore
            che non matcha un caso esplicito (<code>=0</code>, <code>=1</code>, ...)</li>
          <li>per interpolare di nuovo il valore <strong>dentro</strong> un caso, servono le doppie
            graffe attorno al nome — non basta scriverlo nudo</li>
          <li>schema <code>select</code>: stessa struttura, ma i casi sono stringhe arbitrarie
            invece di numeri (<code>admin</code>, <code>editor</code>, <code>other</code>...)</li>
          <li>si scrive <strong>direttamente</strong> come contenuto testuale di un elemento, non
            dentro un'interpolazione normale a doppie graffe</li>
        </ul>

        <h3>Scenario</h3>
        <p>Un contatore di notifiche e un badge di ruolo utente, entrambi da esprimere con ICU.</p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li>nello <code>&lt;span&gt;</code> del contatore, scrivi un'espressione
            <code>plural</code> su <code>count()</code>: <code>=0</code> → "nessuna notifica",
            <code>=1</code> → "una notifica", <code>other</code> → "N notifiche"</li>
          <li>nello <code>&lt;span&gt;</code> del ruolo, scrivi un'espressione <code>select</code>
            su <code>role()</code>: <code>admin</code> → "Amministratore",
            <code>editor</code> → "Redattore", <code>other</code> → "Utente"</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> con 0 notifiche mostra "nessuna notifica" (non "0 notifiche")</li>
          <li><span class="hint">☐</span> con 1 notifica mostra "una notifica" (non "1 notifiche")</li>
          <li><span class="hint">☐</span> con N notifiche mostra "N notifiche" con il numero vero interpolato</li>
          <li><span class="hint">☐</span> cambiando il ruolo, il badge cambia testo coerentemente</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex27</code>: usa i bottoni +/- per cambiare il contatore e osserva il testo (0,
          1, 2+ casi diversi). Cambia il ruolo col dropdown.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>dimenticare <code>other</code> fa fallire la compilazione del template: è l'unico
            caso obbligatorio</li>
          <li>dentro un caso, <code>&#123;count&#125;</code> nudo non interpola nulla: serve
            <code>{{ '{{count}}' }}</code> con le doppie graffe</li>
          <li>l'espressione ICU va scritta come testo diretto dentro l'elemento, non assegnata a
            una variabile del componente o messa dentro un'interpolazione normale</li>
        </ul>
      </div>

      <div class="card">
        <div class="row">
          <button class="btn" (click)="decrement()">-</button>
          <span data-testid="count-icu">
            <!-- TODO(27.1): scrivi qui l'espressione ICU plural su count(), vedi README -->
            &#123; espressione ICU plural da scrivere qui &#125;
          </span>
          <button class="btn" (click)="count.update(c => c + 1)">+</button>
        </div>
      </div>

      <div class="card">
        <select class="input" (change)="role.set($any($event.target).value)">
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
        <p>
          ruolo:
          <span data-testid="role-icu">
            <!-- TODO(27.2): scrivi qui l'espressione ICU select su role(), vedi README -->
            &#123; espressione ICU select da scrivere qui &#125;
          </span>
        </p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex27IcuI18n {
  protected readonly count = signal(0);
  protected readonly role = signal('viewer');

  protected decrement(): void {
    this.count.update((c) => Math.max(0, c - 1));
  }
}
