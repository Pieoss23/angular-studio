import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { Rating } from './rating';

@Component({
  selector: 'app-ex03-signal-io',
  imports: [ExerciseShell, Rating],
  template: `
    <app-exercise-shell n="3" topic="Componenti" folder="ex03-signal-io" completed
      title="Signal inputs & outputs">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>input()</code> e <code>output()</code> sono la versione signal-based della
          comunicazione tra componenti, in sostituzione dei decoratori <code>&#64;Input()</code> /
          <code>&#64;Output()</code>. Un <code>input()</code> è un <strong>signal read-only</strong>
          che il compilatore collega al binding del genitore: lo leggi con <code>x()</code> e ci
          reagisci con <code>computed</code> / <code>effect</code>. Un <code>output()</code> è un
          emettitore di eventi (<code>.emit(v)</code>), senza <code>EventEmitter</code>. Supporta
          <code>required</code>, <code>alias</code> e <code>transform</code> in modo tipizzato.
        </p>
        <h3>Concetti</h3>
        <ul>
          <li><code>input&lt;T&gt;(default)</code> → input opzionale, ritorna un <code>Signal&lt;T&gt;</code></li>
          <li><code>input.required&lt;T&gt;()</code> → input obbligatorio (errore di compilazione se manca)</li>
          <li><code>input(value, &#123; alias, transform &#125;)</code></li>
          <li><code>output&lt;T&gt;()</code> → sostituisce <code>&#64;Output() EventEmitter</code></li>
          <li>gli input sono <strong>read-only</strong>: si reagisce con <code>computed</code> / <code>effect</code>, non si assegnano</li>
        </ul>
        <h3>Consegna — <code>&lt;app-rating&gt;</code></h3>
        <ul>
          <li><code>max</code> input opzionale, default 5</li>
          <li><code>value</code> input <strong>required</strong> (stelle piene)</li>
          <li><code>label</code> con alias <code>caption</code> e <code>transform</code> che fa <code>.trim()</code></li>
          <li><code>stars</code> = <code>computed</code> di <code>boolean[]</code> lungo <code>max()</code>, <code>i &lt; value()</code></li>
          <li><code>rate</code> = <code>output&lt;number&gt;()</code>; al click sulla stella <code>i</code> emetti <code>i + 1</code></li>
          <li>nel genitore: passa <code>value</code> da un signal e aggiornalo su <code>(rate)</code>; caption con spazi da trimmare</li>
        </ul>
        <h3>Criteri di valutazione — <span class="check">5 / 5</span></h3>
        <ul class="checklist">
          <li><span class="check">✅</span> <code>input.required</code> usato per <code>value</code></li>
          <li><span class="check">✅</span> alias + transform corretti</li>
          <li><span class="check">✅</span> nessuna assegnazione a un input</li>
          <li><span class="check">✅</span> <code>output()</code> (non <code>EventEmitter</code>)</li>
          <li><span class="check">✅</span> il genitore aggiorna lo stato dall'evento</li>
        </ul>
        <p class="hint">Completato con aiuti — API nuove (<code>input()</code>, <code>output()</code>, <code>Array.from</code> con map).</p>
      </div>

      <div imparato>
        <h3>Esito: ✅ completato (con aiuti) — 5/5</h3>
        <ul>
          <li><code>input()</code> ritorna un <strong>getter signal</strong>: lo leggi con <code>value()</code>, non puoi scrivergli. È il compilatore che lo popola dal binding del genitore.</li>
          <li><code>input.required&lt;T&gt;()</code>: nessun default, e il template del genitore <strong>non compila</strong> se ometti il binding. Niente <code>!</code> o <code>?</code> nel tipo.</li>
          <li><code>transform</code> viene applicato ad ogni set: qui <code>(v: string) =&gt; v.trim()</code>. Utile anche <code>booleanAttribute</code> / <code>numberAttribute</code> da <code>&#64;angular/core</code>.</li>
          <li><code>alias</code>: il genitore usa <code>caption="..."</code>, dentro il componente resta <code>label()</code>.</li>
          <li><code>output&lt;T&gt;()</code> sostituisce <code>&#64;Output() x = new EventEmitter&lt;T&gt;()</code>. Si emette con <code>.emit(v)</code>; non è un Observable pubblico.</li>
          <li>Derivare un array da un numero: <code>Array.from(&#123; length: n &#125;, (_, i) =&gt; ...)</code> dentro un <code>computed</code>, così <code>stars</code> si ricalcola quando cambiano <code>max()</code> o <code>value()</code>.</li>
          <li>Flusso dati unidirezionale: il figlio <strong>notifica</strong> con <code>(rate)</code>, il genitore <strong>decide</strong> con <code>current.set($event)</code>. Il figlio non muta lo stato del genitore.</li>
        </ul>
        <h3>Ripulito in review</h3>
        <ul>
          <li>Import errato <code>import &#123; readonly &#125; from '&#64;angular/forms/signals'</code> (auto-import dell'IDE) — <code>readonly</code> qui è la keyword TS, non un import.</li>
          <li><code>[value]="this.current()"</code> → <code>[value]="current()"</code> (il <code>this.</code> nei template è superfluo).</li>
          <li>CSS <code>border: .5 solid black</code> non valido (manca l'unità) e nero su tema scuro.</li>
        </ul>
      </div>

      <div class="card">
          <app-rating
            [value]="current()"
            caption="  Valuta il corso  "
            (rate)="current.set($event)" />

        <p class="hint">Valore corrente nel genitore: <strong>{{ current() }}</strong></p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex03SignalIo {
  readonly current = signal(3);
}
