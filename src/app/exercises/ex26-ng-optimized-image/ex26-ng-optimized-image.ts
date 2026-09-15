import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex26-ng-optimized-image',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="26" topic="Performance" folder="ex26-ng-optimized-image"
      title="NgOptimizedImage: immagini performanti senza sforzo">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>NgOptimizedImage</code> (direttiva <code>ngSrc</code>) sostituisce il classico
          <code>&lt;img src="..."&gt;</code> aggiungendo, gratis: <code>loading="lazy"</code> per
          default (tranne dove serve il contrario), <code>fetchpriority</code> automatico,
          dimensioni intrinseche obbligatorie (niente <strong>layout shift</strong> mentre
          l'immagine carica), e warning in console in dev-mode se qualcosa è configurato male.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>ngSrc</code> invece di <code>src</code> — richiede la direttiva
            <code>NgOptimizedImage</code> negli <code>imports</code></li>
          <li><code>width</code> e <code>height</code> sono <strong>obbligatori</strong> (o in
            alternativa <code>fill</code>): servono al browser per riservare lo spazio prima che
            l'immagine sia scaricata, evitando che il layout "salti"</li>
          <li><code>priority</code> — per l'immagine più importante above-the-fold (tipicamente la
            <strong>LCP</strong>, Largest Contentful Paint): disattiva il lazy loading e alza la
            fetch priority del browser</li>
          <li>senza <code>priority</code>, <code>NgOptimizedImage</code> applica
            <code>loading="lazy"</code> di default — corretto per immagini sotto la piega</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Una card "hero" (l'immagine più importante, in alto) e una galleria di miniature più in
          basso, fuori dallo schermo iniziale.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li>aggiungi <code>NgOptimizedImage</code> agli <code>imports</code> del componente</li>
          <li>sostituisci <code>src</code> con <code>ngSrc</code> su tutte le <code>&lt;img&gt;</code></li>
          <li>sull'immagine hero, aggiungi <code>width</code>, <code>height</code> e
            l'attributo <code>priority</code></li>
          <li>su ogni miniatura della galleria, aggiungi solo <code>width</code> e
            <code>height</code> (niente <code>priority</code>: sono sotto la piega)</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> nessun warning <code>NG02952</code>/<code>NG02956</code> in console (dimensioni mancanti / priority mancante sulla LCP)</li>
          <li><span class="hint">☐</span> l'hero ha <code>priority</code>, le miniature no</li>
          <li><span class="hint">☐</span> in DevTools → Elements, l'hero ha <code>fetchpriority="high"</code>, le miniature <code>loading="lazy"</code></li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex26</code>: apri la console — con <code>src</code> invece di <code>ngSrc</code>
          non vedresti nessun warning (perché non staresti nemmeno usando la direttiva); una volta
          convertito, se dimentichi <code>width</code>/<code>height</code> o <code>priority</code>
          sull'hero, <code>NgOptimizedImage</code> te lo segnala esplicitamente in dev-mode.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>ngSrc</code> senza <code>NgOptimizedImage</code> negli <code>imports</code>
            non fa nulla di silenzioso: è un attributo sconosciuto, Angular lo ignora (o dà
            errore in modalità strict dei template)</li>
          <li><code>priority</code> su <strong>troppe</strong> immagini vanifica il suo scopo:
            va riservato davvero solo alla LCP, una o due immagini per pagina</li>
          <li><code>width</code>/<code>height</code> vanno nelle dimensioni reali del file (o
            proporzionali), non in quelle visualizzate via CSS: se servono dimensioni diverse a
            schermo, usa CSS <code>width</code>/<code>height</code> separatamente, mantenendo
            l'aspect ratio corretto negli attributi HTML</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">hero (above-the-fold, priority)</p>
        <!-- TODO: ngSrc + width + height + priority -->
        <img src="https://picsum.photos/id/1015/800/500" alt="paesaggio hero" style="max-width: 100%; border-radius: 8px;" />
      </div>

      <div class="card">
        <p class="hint">galleria (below-the-fold, lazy di default)</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          @for (id of thumbIds; track id) {
            <!-- TODO: ngSrc + width + height (niente priority) -->
            <img [src]="'https://picsum.photos/id/' + id + '/200/150'" alt="miniatura" style="border-radius: 6px;" />
          }
        </div>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex26NgOptimizedImage {
  protected readonly thumbIds = [1016, 1018, 1019, 1020, 1021];
}
