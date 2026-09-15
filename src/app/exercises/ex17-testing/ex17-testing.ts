import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { Counter } from './counter';

@Component({
  selector: 'app-ex17-testing',
  imports: [ExerciseShell, Counter],
  template: `
    <app-exercise-shell n="17" topic="Testing" folder="ex17-testing" completed
      title="Testare un componente con signal: TestBed">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (2 correzioni in review)</h3>
        <ul>
          <li>il codice di un test deve stare <strong>dentro</strong> la callback di
            <code>it(...)</code>: scritto fuori (direttamente nel <code>describe</code>) gira una
            volta sola al caricamento del file e non viene tracciato come test — Vitest lo
            ignorerebbe silenziosamente, mostrando ancora "todo" invece di verde/rosso.</li>
          <li>un test sul DOM deve davvero <strong>cambiare qualcosa</strong> prima di leggerlo:
            controllare lo stato iniziale non prova che il binding si aggiorni dopo
            <code>detectChanges()</code>.</li>
          <li>verificato "a mano" rompendo temporaneamente <code>Math.max(0, c - 1)</code> in
            <code>counter.ts</code>: il test sul clamp si accorge subito della regressione
            (<code>expected -3 to be 0</code>), prova che non è un test che passa a vuoto.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li>primo tentativo: tutto il codice dei test era fuori da <code>it(...)</code>,
            "4 todo" invece di test reali — spostato dentro le callback.</li>
          <li>il test sul DOM controllava lo stato <strong>iniziale</strong> (<code>'0'</code>)
            invece che dopo un <code>increment()</code> — aggiunta la chiamata mancante e
            corretta l'asserzione su <code>'1'</code>.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Questo esercizio è diverso dagli altri: non tocchi il template, scrivi dei
          <strong>test</strong>. <code>TestBed</code> crea un'istanza "vera" del componente in un
          ambiente di test, con il suo DOM reale (in JSDOM), così puoi verificare sia la logica
          (chiamando i metodi e leggendo i signal) sia il risultato nel template (leggendo il DOM).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>TestBed.createComponent(Counter)</code> → un <code>ComponentFixture</code></li>
          <li><code>fixture.componentInstance</code> — l'istanza della classe, per chiamare
            metodi e leggere signal direttamente</li>
          <li><code>fixture.detectChanges()</code> — forza un ciclo di change detection: senza
            chiamarla dopo un cambiamento, il DOM letto da <code>fixture.nativeElement</code> non
            si è ancora aggiornato</li>
          <li><code>fixture.nativeElement</code> — l'elemento host reale, puoi usare
            <code>querySelector</code> come su un DOM normale</li>
          <li><code>describe(...)</code> / <code>it(...)</code> / <code>expect(...)</code> —
            globali di Vitest (il test runner di questo progetto), nessun import necessario</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>Counter</code> (sotto, provalo) ha <code>count</code> (signal),
          <code>increment()</code>, <code>decrement()</code> (non va sotto zero) e
          <code>reset()</code>. Il file da completare è <code>counter.spec.ts</code>, non questo.
        </p>

        <h3>Cosa devi fare — <code>counter.spec.ts</code></h3>
        <ol>
          <li>test: <code>count()</code> parte da <code>0</code></li>
          <li>test: due <code>increment()</code> portano <code>count()</code> a <code>2</code></li>
          <li>test: <code>decrement()</code> da 0 resta a <code>0</code> (clamp)</li>
          <li>test: dopo <code>increment()</code> + <code>fixture.detectChanges()</code>, il DOM
            (<code>[data-testid="count"]</code>) mostra <code>'1'</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> i 4 test sono scritti e passano (<code>npm test</code>)</li>
          <li><span class="hint">☐</span> almeno un test verifica lo stato (il signal), non solo il DOM</li>
          <li><span class="hint">☐</span> almeno un test verifica il DOM dopo <code>detectChanges()</code></li>
          <li><span class="hint">☐</span> il test sul clamp di <code>decrement()</code> fallirebbe se rimuovessi il <code>Math.max</code> da <code>counter.ts</code> (provalo!)</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>npm test</code> nel terminale (esegue Vitest). Tutti i test in
          <code>counter.spec.ts</code> devono passare in verde.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>dimenticare <code>fixture.detectChanges()</code> dopo aver cambiato lo stato: il
            DOM letto resterebbe quello del render precedente</li>
          <li>leggere <code>count()</code> come funzione, non come proprietà: è un signal</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">Counter live (per provarlo con le mani prima di testarlo):</p>
        <app-counter />
      </div>
    </app-exercise-shell>
  `,
})
export class Ex17Testing {}
