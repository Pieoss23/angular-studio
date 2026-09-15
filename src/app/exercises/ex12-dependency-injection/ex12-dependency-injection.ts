import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { GreetingBadge } from './greeting-badge';
import { BrandedSection } from './branded-section';
import { WidgetList } from './widget-list';
import { WIDGETS } from './tokens';

@Component({
  selector: 'app-ex12-dependency-injection',
  imports: [ExerciseShell, GreetingBadge, BrandedSection, WidgetList],
  // TODO(12.5 - bonus): registra due Widget con provider multi qui, a livello
  // di componente, così solo questa pagina li vede:
  providers: [
    { provide: WIDGETS, useValue: { id: 'chart', label: 'Grafico vendite' }, multi: true },
    { provide: WIDGETS, useValue: { id: 'todo', label: 'Lista TODO' }, multi: true },
  ],
  template: `
    <app-exercise-shell n="12" topic="Architettura" folder="ex12-dependency-injection" completed
      title="Dependency Injection: inject(), InjectionToken, provider gerarchici">

      <div imparato>
        <h3>Esito: ✅ completato — 5/5 (bonus incluso)</h3>
        <ul>
          <li><code>@Component(&#123; providers: [...] &#125;)</code> sovrascrive un provider
            <strong>solo</strong> per quel componente e i suoi discendenti: il badge fuori da
            <code>BrandedSection</code> continua a vedere il config di default, quello dentro
            vede la versione sovrascritta.</li>
          <li><code>inject(TOKEN, &#123; optional: true &#125;) ?? []</code> — pattern per token
            senza default: evita il <code>NullInjectorError</code> quando nessun provider lo
            fornisce, tornando un fallback sensato invece di far esplodere il componente.</li>
          <li><code>multi: true</code> ripetuto su più provider dello stesso token li accumula in
            un array invece di farli sovrascrivere a vicenda — qui usato per registrare due
            <code>Widget</code> visibili solo su questa pagina.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          La DI di Angular è un albero di <strong>injector</strong> che rispecchia l'albero dei
          componenti. Quando un componente/servizio chiede una dipendenza, Angular la cerca
          risalendo dall'injector più vicino verso la radice, e si ferma al primo provider che
          trova. Questo esercizio copre tre pezzi: <code>inject()</code>, gli
          <code>InjectionToken</code> per dipendenze che non sono classi, e i provider a livello
          di componente per <strong>sovrascrivere</strong> localmente una dipendenza.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>inject(Token)</code> — funzione, sostituisce l'iniezione via constructor;
            va chiamata in "injection context" (constructor, initializer di campo, factory)</li>
          <li><code>new InjectionToken&lt;T&gt;('nome', &#123; factory: () =&gt; ... &#125;)</code> — token
            per valori/interfacce, con default lazy</li>
          <li><code>@Component(&#123; providers: [...] &#125;)</code> — vale per quel componente e per
            <strong>tutti i suoi discendenti</strong>, sovrascrivendo un provider più in alto</li>
          <li><code>&#123; provide: TOKEN, useValue, multi: true &#125;</code> — più provider per lo stesso
            token si accumulano in un array invece di sovrascriversi</li>
          <li><code>inject(TOKEN, &#123; optional: true &#125;)</code> — evita l'errore se nessuno fornisce
            un token senza default</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>STUDIO_CONFIG</code> ha un default globale (root). <code>GreetingBadge</code> lo
          legge e mostra un saluto. <code>BrandedSection</code> deve fornire una versione locale
          diversa di <code>STUDIO_CONFIG</code>, visibile solo al suo interno.
          <code>WIDGETS</code> è un token multi: nessuno lo fornisce di default, questa pagina
          deve popolarlo.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>branded-section.ts</code>: scommenta/scrivi i <code>providers</code> del
            componente per sovrascrivere <code>STUDIO_CONFIG</code> con un nome/email diversi</li>
          <li><code>widget-list.ts</code>: implementa <code>widgets</code> con
            <code>inject(WIDGETS, &#123; optional: true &#125;) ?? []</code></li>
          <li>in questo file: aggiungi i <code>providers</code> del componente con due voci
            <code>multi: true</code> per <code>WIDGETS</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> il badge fuori da <code>BrandedSection</code> mostra il config di default</li>
          <li><span class="hint">☐</span> il badge dentro <code>BrandedSection</code> mostra il config sovrascritto</li>
          <li><span class="hint">☐</span> <code>WidgetList</code> mostra i due widget registrati qui</li>
          <li><span class="hint">☐</span> nessun <code>NullInjectorError</code> in console</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex11</code>… ehm <code>/ex12</code>: due badge di saluto (default vs sovrascritto,
          testo diverso) e una lista di 2 widget sotto.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>i <code>providers</code> vanno nel decoratore <code>@Component</code>, non si possono
            passare da template</li>
          <li>un provider a livello di componente vale anche per i figli, ma non "risale": il
            padre di <code>BrandedSection</code> continua a vedere il default</li>
          <li><code>multi: true</code> va ripetuto identico su <strong>ogni</strong> provider dello
            stesso token, altrimenti l'ultimo sovrascrive gli altri</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">badge fuori da BrandedSection (config di default):</p>
        <app-greeting-badge />
      </div>

      <app-branded-section />

      <div class="card">
        <p class="hint">widget registrati (provider multi su questa pagina):</p>
        <app-widget-list />
      </div>
    </app-exercise-shell>
  `,
})
export class Ex12DependencyInjection {}
