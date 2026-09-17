import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defer, of, retry } from 'rxjs';
import { ExerciseShell } from '../../shared/exercise-shell';
import { ErrorLogService } from './error-log.service';

@Component({
  selector: 'app-ex25-error-handling',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="25" topic="Architettura" folder="ex25-error-handling" completed
      title="Error handling: ErrorHandler globale + catchError/retry">

      <div imparato>
        <h3>Esito: ✅ completato — 3/3 (2 correzioni in review)</h3>
        <ul>
          <li><code>&#123; provide: ErrorHandler, useClass: AppErrorHandler &#125;</code> intercetta
            qualunque errore sincrono non gestito (es. lanciato in un click handler): non serve
            nessun try/catch nel componente, arriva comunque a <code>handleError</code>.</li>
          <li><code>retry(&#123; count: 2, delay: 300 &#125;)</code> + <code>catchError(...)</code>
            gestiscono l'errore HTTP <strong>prima</strong> che diventi un errore non gestito:
            l'<code>ErrorHandler</code> globale non lo vede mai, sono due reti di sicurezza a
            livelli diversi.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li>i parametri di <code>retry</code> erano <code>count: 4, delay: 500</code> invece di
            <code>count: 2, delay: 300</code> — funzionava, ma con 5 tentativi totali invece dei
            3 attesi dal criterio di valutazione.</li>
          <li>rimossi due import inutilizzati (<code>count</code>, <code>delay</code> da
            <code>rxjs</code>).</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Due livelli di gestione errori, complementari: un <code>ErrorHandler</code> custom
          (provider a livello di app) è la <strong>rete di sicurezza globale</strong> — cattura
          qualunque errore non gestito che "sfugge" da un event handler o da un ciclo di CD, e lo
          fa passare da un unico punto (log centralizzato, reporting a un servizio esterno...).
          <code>catchError</code>/<code>retry</code> di RxJS, invece, gestiscono errori
          <strong>puntuali e attesi</strong> di un singolo flusso asincrono (una chiamata HTTP che
          può fallire), <em>prima</em> che diventino un errore non gestito.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>&#123; provide: ErrorHandler, useClass: AppErrorHandler &#125;</code> — sostituisce
            l'<code>ErrorHandler</code> di default (già collegato in <code>app.config.ts</code>)</li>
          <li><code>class AppErrorHandler implements ErrorHandler &#123; handleError(error) &#123; ... &#125; &#125;</code></li>
          <li><code>retry(&#123; count: 2, delay: 300 &#125;)</code> — ritenta l'observable fino a 2
            volte, aspettando 300ms tra un tentativo e l'altro</li>
          <li><code>catchError(err =&gt; of(fallback))</code> — intercetta l'errore
            <strong>dopo</strong> che i retry sono esauriti, e lo trasforma in un valore normale
            invece di propagarlo (l'observable non va mai in errore verso chi si iscrive)</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Bottone 1: lancia un errore sincrono in un click handler — nessun try/catch qui, deve
          essere l'<code>ErrorHandler</code> globale ad accorgersene. Bottone 2: chiama un URL
          inesistente con <code>HttpClient</code>, con retry e fallback.
        </p>

        <h3>Cosa devi fare — <code>app-error-handler.ts</code></h3>
        <ol>
          <li><code>handleError(error)</code>: <code>console.error(error)</code> +
            <code>this.log.log(...)</code> con un messaggio leggibile</li>
        </ol>

        <h3>Cosa devi fare — questo file</h3>
        <ol>
          <li>nel metodo <code>fetchFlaky()</code>, collega la pipe con
            <code>retry(&#123; count: 2, delay: 300 &#125;)</code> e
            <code>catchError(() =&gt; &#123; ...; return of(null); &#125;)</code> — vedi i TODO nel
            codice</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> cliccando "lancia errore", l'app non si blocca e l'errore compare nel log qui sotto</li>
          <li><span class="hint">☐</span> cliccando "chiamata che fallisce", vedi 3 tentativi (1 + 2 retry) prima del fallback</li>
          <li><span class="hint">☐</span> dopo il fallback, la UI mostra un messaggio "servizio non disponibile" invece di un errore in console non gestito</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex25</code>: clicca entrambi i bottoni, guarda il log degli errori e il contatore
          tentativi. Apri anche la console del browser: il primo bottone deve comparire lì
          (via <code>console.error</code> dentro l'<code>ErrorHandler</code>), il secondo no
          (l'errore HTTP è gestito, non arriva mai all'<code>ErrorHandler</code> globale).
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>un errore intercettato con <code>catchError</code> <strong>non</strong> arriva
            all'<code>ErrorHandler</code> globale: sono due meccanismi separati, il secondo si
            attiva solo per errori non gestiti altrove</li>
          <li><code>retry</code> senza <code>delay</code> riprova immediatamente, a raffica: con
            un servizio down è controproducente, meglio sempre un ritardo</li>
        </ul>
      </div>

      <div class="card">
        <div class="row">
          <button class="btn" (click)="throwSync()">lancia errore</button>
          <button class="btn" (click)="fetchFlaky()">chiamata che fallisce</button>
        </div>
        <p>tentativi HTTP: <strong>{{ attempts() }}</strong></p>
        @if (fetchResult() === null) {
          <p class="hint">servizio non disponibile (dopo i retry)</p>
        }
      </div>

      <div class="card">
        <p class="hint">log errori (da AppErrorHandler):</p>
        <ul>
          @for (e of errorLog.entries(); track $index) {
            <li>{{ e }}</li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex25ErrorHandling {
  private readonly http = inject(HttpClient);
  protected readonly errorLog = inject(ErrorLogService);

  protected readonly attempts = signal(0);
  protected readonly fetchResult = signal<unknown>(undefined);

  protected throwSync(): void {
    throw new Error('errore sincrono di test, lanciato dal bottone');
  }

  protected fetchFlaky(): void {
    this.attempts.set(0);

    defer(() => {
      this.attempts.update((a) => a + 1);
      return this.http.get('https://jsonplaceholder.typicode.com/questo-url-non-esiste-404');
    })
      .pipe(
        // TODO(25.2): retry({ count: 2, delay: 300 })
        retry({ count: 2, delay: 500 }),

        // TODO(25.3): catchError(() => { this.errorLog.log('fetchFlaky: fallback dopo i retry'); return of(null); })
        catchError(() => {
          this.errorLog.log('fetchFlaky: fallback dopo i retry');
          return of(null);
        }))
      .subscribe((result) => this.fetchResult.set(result));
  }
}
