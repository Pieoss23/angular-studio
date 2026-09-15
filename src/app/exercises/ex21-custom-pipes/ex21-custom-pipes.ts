import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { TruncatePipe } from './truncate.pipe';
import { ElapsedPipe } from './elapsed.pipe';
import { ElapsedPurePipe } from './elapsed-pure.pipe';

@Component({
  selector: 'app-ex21-custom-pipes',
  imports: [ExerciseShell, TruncatePipe, ElapsedPipe, ElapsedPurePipe],
  template: `
    <app-exercise-shell n="21" topic="Template" folder="ex21-custom-pipes"
      title="Pipe custom: pure vs impure">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Una pipe è una funzione di trasformazione usabile nel template con <code>|</code>. Di
          default è <strong>pura</strong>: Angular la ricalcola solo se cambia il
          <em>riferimento</em> (o il valore primitivo) del suo input, non ad ogni ciclo di change
          detection — è un'ottimizzazione automatica. Con <code>pure: false</code> diventa
          <strong>impura</strong>: rigira ad ogni ciclo di CD, utile quando il risultato dipende da
          qualcosa che la pipe non riceve come input esplicito (qui: il tempo che passa).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>&#64;Pipe(&#123; name: 'nome' &#125;)</code> + <code>implements PipeTransform</code>,
            metodo <code>transform(value, ...args)</code></li>
          <li>pipe pura (default): ricalcolata solo se l'input cambia riferimento/valore</li>
          <li>pipe impura (<code>pure: false</code>): ricalcolata ad ogni change detection, anche
            con lo stesso identico input</li>
          <li>le pipe standalone (default in Angular moderno) si importano come i componenti, in
            <code>imports: [...]</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>ElapsedPipe</code> (impura, già pronta) e <code>ElapsedPurePipe</code> (pura, già
          pronta) fanno la stessa cosa — mostrano da quanto tempo è passato un timestamp — ma solo
          la prima si aggiorna nel tempo, perché un signal <code>tick</code> qui sotto forza un
          nuovo ciclo di CD ogni secondo (senza cambiare il timestamp stesso).
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>truncate.pipe.ts</code>: implementa <code>transform(value, limit = 20)</code>
            — tronca <code>value</code> a <code>limit</code> caratteri e aggiunge <code>'…'</code>
            se più lungo, altrimenti lo ritorna intatto</li>
          <li>osserva (non serve scrivere altro codice): sotto, i due orologi "impuro"/"puro"
            partono dallo stesso timestamp fisso, ma solo quello impuro avanza</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> <code>'ciao' | truncate:10</code> torna <code>'ciao'</code> intatto (è più corto di 10)</li>
          <li><span class="hint">☐</span> una stringa lunga viene tagliata a <code>limit</code> caratteri + <code>'…'</code></li>
          <li><span class="hint">☐</span> <code>limit</code> di default è 20 se non passato</li>
          <li><span class="hint">☐</span> capito perché il contatore "puro" resta fermo e quello "impuro" no</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex21</code>: guarda i due timer in basso per una decina di secondi. Prova anche
          <code>truncate</code> sul testo lungo qui sotto, con e senza secondo argomento.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>una pipe impura gira ad <strong>ogni</strong> ciclo di CD, anche per input non
            correlati: costa più di una pura, va usata con parsimonia</li>
          <li>in un'app zoneless (come questa) la CD parte solo su eventi/signal: senza il signal
            <code>tick</code> che si aggiorna ogni secondo, nemmeno la pipe impura si
            aggiornerebbe da sola</li>
        </ul>
      </div>

      <div class="card">
        <p>testo lungo: {{ longText | truncate }}</p>
        <p>stesso testo, limit 12: {{ longText | truncate: 12 }}</p>
        <p>testo corto: {{ 'ciao' | truncate: 10 }}</p>
      </div>

      <div class="card">
        <!-- il tick forza un ciclo di CD ogni secondo, senza toccare fixedTimestamp -->
        <p class="hint">(tick interno: {{ tick() }})</p>
        <p>impuro: {{ fixedTimestamp | elapsed }}</p>
        <p>puro: {{ fixedTimestamp | elapsedPure }}</p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex21CustomPipes {
  protected readonly longText =
    'Angular 21 introduce signal, resource(), httpResource() e tante altre novità per scrivere app reattive senza RxJS ovunque.';

  protected readonly fixedTimestamp = Date.now() - 3000;
  protected readonly tick = signal(0);

  constructor() {
    const id = setInterval(() => this.tick.update((t) => t + 1), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
