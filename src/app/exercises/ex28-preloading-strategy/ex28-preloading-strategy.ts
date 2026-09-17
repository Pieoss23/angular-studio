import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex28-preloading-strategy',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="28" topic="Router / HTTP" folder="ex28-preloading-strategy" completed
      title="Router: PreloadingStrategy custom">

      <div imparato>
        <h3>Esito: ✅ completato — 3/3</h3>
        <ul>
          <li><code>preload(route, load)</code>: controlla <code>route.data?.['preload']</code> e
            chiama <code>load()</code> solo per le rotte marcate esplicitamente, tornando
            <code>of(null)</code> per tutte le altre — nessuna rotta viene scaricata in anticipo
            "per sbaglio".</li>
          <li>attivata con <code>withPreloading(SelectivePreloadStrategy)</code> in
            <code>provideRouter(...)</code>: il preload parte da solo dopo il primo ciclo di
            navigazione, senza altro codice di collegamento.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Con <code>loadComponent</code>, ogni rotta è un chunk JS separato scaricato solo alla
          navigazione — ottimo per il caricamento iniziale, ma introduce un piccolo ritardo alla
          prima visita di ogni pagina. Una <strong>preloading strategy</strong> scarica alcuni
          chunk <em>in background</em>, dopo che l'app è già interattiva, così quando l'utente
          poi ci naviga davvero il chunk è già in cache e la transizione è istantanea.
        </p>
        <p>
          Angular offre due strategie pronte: <code>NoPreloading</code> (default: nessun preload)
          e <code>PreloadAllModules</code> (precarica tutto, sempre). Una
          <strong>strategia custom</strong> ti dà il controllo su <em>quali</em> rotte precaricare
          e quando.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>class Strategia implements PreloadingStrategy &#123; preload(route, load) &#123; ... &#125; &#125;</code></li>
          <li><code>preload</code> viene chiamato dal router per <strong>ogni</strong> rotta
            lazy dopo il bootstrap iniziale; tu decidi se chiamare <code>load()</code> (scarica
            il chunk) o tornare <code>of(null)</code> (non fare nulla, per ora)</li>
          <li><code>route.data</code> è disponibile dentro <code>preload()</code>: puoi marcare le
            rotte "da precaricare" con <code>data: &#123; preload: true &#125;</code> nella config
            delle rotte</li>
          <li>si attiva con <code>provideRouter(routes, withPreloading(Strategia))</code> in
            <code>app.config.ts</code> (già collegato)</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>/ex01</code> e <code>/ex02</code> sono marcate con
          <code>data: &#123; preload: true &#125;</code> in <code>app.routes.ts</code>. Tutte le
          altre rotte non lo sono.
        </p>

        <h3>Cosa devi fare — <code>selective-preload.strategy.ts</code></h3>
        <ol>
          <li>se <code>route.data?.['preload']</code> è <code>true</code>: logga
            <code>[preload] &lt;path&gt;</code> e ritorna <code>load()</code></li>
          <li>altrimenti: ritorna <code>of(null)</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> in console, dopo il caricamento di <code>/</code>, compaiono i log <code>[preload]</code> solo per ex01 ed ex02</li>
          <li><span class="hint">☐</span> in Network, i chunk di ex01/ex02 partono da soli poco dopo il load iniziale, senza cliccarci</li>
          <li><span class="hint">☐</span> il chunk di un'altra rotta (es. ex05) parte <strong>solo</strong> quando ci navighi</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          Vai su <code>/</code> con DevTools → Network aperto (filtro JS, "Disable cache" spento
          per vedere bene i tempi). Dopo un istante dovrebbero comparire due richieste extra per i
          chunk di ex01/ex02, senza che tu abbia cliccato nulla. Poi naviga su un'altra rotta non
          marcata: il suo chunk parte solo in quel momento.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>preload()</code> deve sempre ritornare un <code>Observable</code>, anche
            quando "non fai nulla": <code>of(null)</code>, non <code>undefined</code></li>
          <li>il preload parte dopo il <strong>primo</strong> ciclo di navigazione completato, non
            subito al boot: su connessioni lentissime potresti notare un piccolo ritardo prima di
            vedere le richieste extra</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">
          Questa pagina non ha una demo interattiva: apri Network/Console e naviga come descritto
          sopra.
        </p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex28PreloadingStrategy {}
