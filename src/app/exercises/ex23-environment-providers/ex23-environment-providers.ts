import { Component, inject } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-ex23-environment-providers',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="23" topic="Architettura" folder="ex23-environment-providers" completed
      title="Environment providers: provideXxx() e provideAppInitializer">

      <div imparato>
        <h3>Esito: ✅ completato — 3/3</h3>
        <ul>
          <li><code>makeEnvironmentProviders([...])</code> impacchetta un token
            (<code>&#123; provide: ANALYTICS_CONFIG, useValue: config &#125;</code>) e un
            <code>provideAppInitializer(...)</code> in un unico valore da mettere in
            <code>providers</code>, esattamente come fanno <code>provideRouter</code>/
            <code>provideHttpClient</code>.</li>
          <li><code>provideAppInitializer</code> gira prima del bootstrap: il log
            <code>[analytics] inizializzato...</code> compare in console prima di qualunque log
            dei componenti, verificabile ricaricando la pagina.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>provideRouter()</code>, <code>provideHttpClient()</code>, la tua
          <code>provideAnalytics()</code>: sono tutte <strong>funzioni</strong> che ritornano un
          pacchetto di provider da mettere nell'array <code>providers</code> di
          <code>app.config.ts</code>. È il modo standard di impacchettare configurazione
          "a livello di applicazione" (non di componente), con un'API dichiarativa invece di una
          lista piatta di oggetti provider da ricordare a memoria.
        </p>
        <p>
          <code>provideAppInitializer(fn)</code> registra <code>fn</code> per essere eseguita
          <strong>prima</strong> che Angular finisca il bootstrap dell'app: utile per caricare
          configurazione remota, inizializzare un SDK, ecc. Se <code>fn</code> ritorna una
          Promise, Angular aspetta che si risolva prima di procedere.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>makeEnvironmentProviders([...])</code> — impacchetta un array di provider in
            un singolo <code>EnvironmentProviders</code>, da spargere con lo spread
            (<code>...provideAnalytics(...)</code> non serve, si passa diretto in
            <code>providers</code>)</li>
          <li><code>provideAppInitializer(() =&gt; &#123; ... &#125;)</code> — gira prima del primo
            render, in injection context (<code>inject()</code> funziona dentro)</li>
          <li>un <code>InjectionToken</code> per la configurazione, valorizzato con
            <code>useValue</code> dentro la funzione <code>provideXxx</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>provideAnalytics(&#123; appId: 'angular-studio' &#125;)</code> è già collegata in
          <code>app.config.ts</code>. <code>AnalyticsService</code> (già pronto) usa il config per
          taggare gli eventi tracciati.
        </p>

        <h3>Cosa devi fare — <code>analytics.config.ts</code></h3>
        <ol>
          <li>implementa <code>provideAnalytics(config)</code>: deve tornare
            <code>makeEnvironmentProviders([...])</code> con due provider —
            <code>&#123; provide: ANALYTICS_CONFIG, useValue: config &#125;</code> e
            <code>provideAppInitializer(() =&gt; console.log(...))</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> in console, il log di inizializzazione appare prima di qualunque altro log dell'app</li>
          <li><span class="hint">☐</span> <code>AnalyticsService</code> riceve davvero il config passato in <code>app.config.ts</code></li>
          <li><span class="hint">☐</span> tracciare un evento qui sotto lo aggiunge alla lista con il prefisso <code>[angular-studio]</code></li>
        </ul>

        <h3>Come provare</h3>
        <p>
          Apri la console <strong>prima</strong> di navigare (o ricarica la pagina su
          <code>/ex23</code>): il log <code>[analytics] inizializzato per angular-studio</code>
          deve comparire subito, prima che qualunque componente si monti. Poi clicca "traccia
          evento" qui sotto.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>provideAppInitializer</code> va messo <strong>dentro</strong>
            l'array passato a <code>makeEnvironmentProviders</code>, non chiamato a parte</li>
          <li>se dimentichi il provider di <code>ANALYTICS_CONFIG</code>, <code>AnalyticsService</code>
            lancia un <code>NullInjectorError</code> al primo utilizzo (il token non ha default)</li>
        </ul>
      </div>

      <div class="card">
        <button class="btn" (click)="track()">traccia evento</button>
        <ul>
          @for (e of analytics.events(); track $index) {
            <li>{{ e }}</li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex23EnvironmentProviders {
  protected readonly analytics = inject(AnalyticsService);

  protected track(): void {
    this.analytics.track('click su "traccia evento"');
  }
}
