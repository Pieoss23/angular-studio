import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { HeavyChart } from './heavy-chart';

@Component({
  selector: 'app-ex09-defer',
  imports: [ExerciseShell, HeavyChart],
  template: `
    <app-exercise-shell n="9" topic="Performance" folder="ex09-defer" completed
      title="Deferrable views: @defer">

      <div imparato>
        <h3>Esito: ✅ completato — 5/5 (+ bonus)</h3>
        <ul>
          <li><code>&#64;defer</code> isola nel bundle solo il codice dei componenti usati
            <strong>esclusivamente</strong> al suo interno: verificato in build, <code>HeavyChart</code>
            finisce in un chunk separato (~3.6KB) distinto da quello della rotta <code>/ex09</code>.</li>
          <li><code>on interaction(ref)</code> lega il trigger a una template reference variable
            (<code>#showDetails</code>) che può stare anche fuori dal blocco <code>&#64;defer</code>.</li>
          <li><code>prefetch on idle</code> (bonus): scarica il chunk in anticipo quando il browser è
            libero, ma lo renderizza solo quando scatta il trigger principale (<code>on viewport</code>).</li>
          <li><code>&#64;placeholder</code> con altezza esplicita evita che <code>on viewport</code>
            faccia scattare il caricamento subito (placeholder a zero altezza = sempre "in vista").</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>&#64;defer</code> è code-splitting a livello di <strong>template</strong>. Avvolgi
          una parte pesante di UI e Angular mette il codice dei componenti usati
          <strong>solo lì dentro</strong> in un chunk JS separato, che carica quando scatta un
          <strong>trigger</strong>. Nel frattempo mostra <code>&#64;placeholder</code>, durante il
          download <code>&#64;loading</code>. Nessun <code>import()</code> manuale: lo fa il
          compilatore, a patto che il componente pesante sia usato <em>esclusivamente</em> nel
          blocco <code>&#64;defer</code>.
        </p>
        <p>Serve per contenuto non critico / below-the-fold, non per l'above-the-fold.</p>

        <h3>Concetti</h3>
        <ul>
          <li>blocchi: <code>&#64;defer</code>, <code>&#64;placeholder</code>, <code>&#64;loading</code>, <code>&#64;error</code></li>
          <li>tempi: <code>&#64;placeholder (minimum 500ms)</code>, <code>&#64;loading (minimum 500ms; after 100ms)</code></li>
          <li>trigger: <code>on idle</code> (default), <code>on viewport</code>, <code>on interaction</code>, <code>on hover</code>, <code>on timer(2s)</code>, <code>on immediate</code>, <code>when expr</code></li>
          <li>con riferimento: <code>on viewport(ref)</code>, <code>on interaction(ref)</code> — <code>ref</code> = <code>#ref</code> nel template</li>
          <li><code>prefetch on &lt;trigger&gt;</code> — scarica in anticipo senza renderizzare</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>HeavyChart</code> è un componente finto-pesante: logga nel <code>constructor</code>,
          così vedi quando il codice viene caricato. La pagina ha spazio vuoto per scrollare.
        </p>

        <h3>Cosa devi fare — <code>ex09-defer.ts</code></h3>
        <ol>
          <li>primo <code>&lt;app-heavy-chart /&gt;</code>: <code>&#64;defer (on viewport)</code> con <code>&#64;placeholder</code> (dagli un'altezza!) e <code>&#64;loading (minimum 500ms)</code></li>
          <li>secondo blocco: <code>&#64;defer (on interaction(showDetails))</code> legato al bottone <code>#showDetails</code>, con <code>&lt;app-heavy-chart mode="details" /&gt;</code></li>
          <li><strong>bonus</strong>: <code>&#64;defer (on viewport; prefetch on idle)</code> sul primo</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> <code>HeavyChart</code> usato solo dentro <code>&#64;defer</code></li>
          <li><span class="hint">☐</span> <code>&#64;placeholder</code> e <code>&#64;loading</code> sul primo blocco</li>
          <li><span class="hint">☐</span> usati <code>on viewport</code> e <code>on interaction(ref)</code></li>
          <li><span class="hint">☐</span> verificato in Network un chunk JS separato</li>
          <li><span class="hint">☐</span> il <code>console.log</code> compare solo al caricamento</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex09</code> → DevTools → Network (filtro JS). All'apertura: console pulita.
          Scrolla fino al blocco → parte un <code>.js</code>, "Carico il modulo…", poi il grafico
          e il log. Clicca "mostra dettagli" → stesso meccanismo on demand.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>Se <code>HeavyChart</code> è usato anche fuori dal <code>&#64;defer</code> (una volta sola basta) non viene separato</li>
          <li><code>&#64;placeholder</code> senza dimensioni + <code>on viewport</code> = carica subito</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">Scrolla verso il basso: sotto lo spazio vuoto c'è il blocco differito.</p>
      </div>

      <div class="spacer">↓ scrolla ↓</div>

      <div class="card">
        <!--
          TODO(9.1 / 9.2): @defer (on viewport) { <app-heavy-chart /> }
          @placeholder { ... } @loading (minimum 500ms) { ... }
        -->

        @defer (on viewport; prefetch on idle){
          <app-heavy-chart />
        }
        @placeholder  {<div style="height: 160px">Scorri per caricare il grafico</div>}
        @loading (minimum 500ms) {
        <p>Carico il modulo…</p>
        }
      </div>

      <div class="card">
        <button #showDetails class="btn">mostra dettagli</button>
        <!--
          TODO(9.3): @defer (on interaction(showDetails)) {
            <app-heavy-chart mode="details" />
          } @placeholder { <span class="hint">clicca il bottone</span> }
        -->
        @defer (on interaction(showDetails)) {
            <app-heavy-chart mode="details" />
          } @placeholder { <span class="hint">clicca il bottone</span> }

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
export class Ex09Defer { }
