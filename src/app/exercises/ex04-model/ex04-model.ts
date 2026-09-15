import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { Stepper } from './stepper';

@Component({
  selector: 'app-ex04-model',
  imports: [ExerciseShell, Stepper],
  template: `
    <app-exercise-shell n="4" topic="Componenti" folder="ex04-model" completed
      title="model(): two-way binding con i signal">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>model()</code> dichiara in una riga un <strong>input + output
          <code>xChange</code></strong>, ed è ciò che abilita la sintassi two-way
          <code>[(x)]</code> (l'unione di <code>[x]</code> e <code>(xChange)</code>). Dentro il
          componente si comporta come un <code>WritableSignal</code>: <code>x()</code> legge,
          <code>x.set()</code> / <code>x.update()</code> scrivono <em>ed emettono</em>. Sostituisce
          il vecchio pattern <code>&#64;Input() value</code> + <code>&#64;Output() valueChange</code>.
          Serve quando il componente possiede un valore che anche il genitore deve poter leggere
          e scrivere (form control custom, slider, stepper).
        </p>
        <h3>Concetti</h3>
        <ul>
          <li><code>model&lt;T&gt;(default)</code> crea un input <strong>e</strong> un output <code>xChange</code> → abilita <code>[(x)]</code></li>
          <li><code>model.required&lt;T&gt;()</code></li>
          <li>dentro il componente: leggi con <code>x()</code>, scrivi con <code>x.set()</code> / <code>x.update()</code></li>
          <li>sostituisce il pattern <code>&#64;Input() value</code> + <code>&#64;Output() valueChange</code></li>
        </ul>
        <h3>Consegna</h3>
        <ul>
          <li><code>&lt;app-stepper&gt;</code>: <code>value = model&lt;number&gt;(0)</code>, <code>min</code>/<code>max</code> input (0 / 10)</li>
          <li><code>inc()</code> / <code>dec()</code> con <code>.update()</code>, clamp in <code>[min, max]</code>; bottoni disabilitati ai limiti</li>
          <li>genitore: <code>&lt;app-stepper [(value)]="count" [max]="5" /&gt;</code></li>
          <li>bottone "reset" → <code>count.set(0)</code>, deve riflettersi nello stepper</li>
        </ul>
        <h3>Criteri di valutazione — <span class="check">4 / 4</span></h3>
        <ul class="checklist">
          <li><span class="check">✅</span> <code>model()</code> usato (non input+output separati)</li>
          <li><span class="check">✅</span> clamp tra min e max</li>
          <li><span class="check">✅</span> <code>[(value)]</code> nel genitore</li>
          <li><span class="check">✅</span> reset dal genitore aggiorna il figlio</li>
        </ul>
      </div>

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (2 correzioni in review)</h3>
        <ul>
          <li><code>model()</code> = input <strong>+</strong> output <code>valueChange</code> in una riga. È ciò che rende possibile <code>[(value)]</code> (banana in a box = <code>[value]</code> + <code>(valueChange)</code>).</li>
          <li>Two-way <strong>vero</strong>: se il genitore fa <code>count.set(0)</code>, il figlio si aggiorna; se il figlio fa <code>value.update(...)</code>, il genitore si aggiorna. Un unico stato condiviso.</li>
          <li>Dentro il componente <code>model</code> si comporta come un <code>WritableSignal</code>: <code>value()</code> legge, <code>value.set()/update()</code> scrive (ed emette <code>valueChange</code>).</li>
          <li>Clamp: <code>Math.min(x, max())</code> per il tetto, <code>Math.max(x, min())</code> per il pavimento. Scambiarli è l'errore classico.</li>
          <li><code>[disabled]="value() &gt;= max()"</code> è già reattivo: nessun bisogno di ricalcolare a mano.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li><code>dec()</code> usava <code>Math.min(v - 1, min())</code> → saltava sempre a <code>min</code>. Corretto in <code>Math.max</code>.</li>
          <li>Mancava il bottone reset (punto 4.6).</li>
          <li>"Non si vedevano" i tasti disabilitati: il binding <code>[disabled]</code> funzionava, ma mancava lo stile <code>.btn:disabled</code> nel CSS globale — aggiunto.</li>
          <li><code>[max]=10</code> → quotato <code>[max]="10"</code>.</li>
        </ul>
      </div>

      <div class="card row">
        <app-stepper [(value)]="count" [max]="10" />
        <span class="hint">count nel genitore: <strong>{{ count() }}</strong></span>
        <button class="btn" (click)="count.set(0)">Reset</button>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex04Model {
  readonly count = signal(2);
}
