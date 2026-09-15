import { Component, resource, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface User {
  id: number;
  name: string;
  email: string;
}

const DB: Record<number, User> = {
  1: { id: 1, name: 'Ada Lovelace', email: 'ada@studio.dev' },
  2: { id: 2, name: 'Alan Turing', email: 'alan@studio.dev' },
  3: { id: 3, name: 'Grace Hopper', email: 'grace@studio.dev' },
  5: { id: 5, name: 'Edsger Dijkstra', email: 'edsger@studio.dev' },
};

export function fakeFetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 4) {
        reject(new Error(`Utente ${id} non disponibile`));
        return;
      }
      resolve(DB[id]);
    }, 600);
  });
}

@Component({
  selector: 'app-ex07-resource',
  imports: [ExerciseShell],
  template: `
      <app-exercise-shell n="7" topic="Dati async" folder="ex07-resource" completed
        title="resource(): async con loading / error / reload">

        <div imparato>
          <h3>Esito: ✅ completato — 5/5</h3>
          <ul>
            <li><code>resource(&#123; params, loader &#125;)</code>: <code>params</code> è una funzione che <strong>legge i signal</strong> → quando cambiano, il loader riparte da solo e la richiesta vecchia viene abortita. Zero <code>switchMap</code>, zero <code>subscribe</code>.</li>
            <li>Hai passato <code>params</code> come oggetto (<code>() =&gt; (&#123; id: this.userId() &#125;)</code>): va bene, è il pattern giusto quando i parametri sono più di uno. Con un solo parametro basta <code>() =&gt; this.userId()</code>.</li>
            <li>Stato esposto come signal: <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>, <code>value()</code>, <code>status()</code>.</li>
            <li><strong>Scoperta chiave</strong>: <code>hasValue()</code> è un <em>type guard</em> (<code>this is ResourceRef&lt;T&gt;</code>). Dentro <code>&#64;else if (userResource.hasValue())</code> il template <strong>restringe il tipo</strong>, quindi <code>userResource.value().name</code> compila senza <code>?.</code> né <code>!</code>. Fuori da quel ramo, <code>value()</code> è <code>T | undefined</code>.</li>
            <li><code>reload()</code> rifà la fetch con gli stessi <code>params</code> (utile per un bottone "aggiorna").</li>
            <li>L'ordine dei rami conta: <code>isLoading</code> → <code>error</code> → <code>hasValue</code>. <code>isLoading()</code> è <code>true</code> anche durante i reload.</li>
          </ul>
          <h3>Nit (non a punteggio)</h3>
          <ul>
            <li><code>&#123;&#123; $any(userResource.error()).message &#125;&#125;</code> → meglio <code>(userResource.error() as Error).message</code>: <code>$any</code> spegne il type-checking.</li>
            <li><code>loader: async (&#123;params&#125;) =&gt; &#123; return fakeFetchUser(...) &#125;</code> → l'<code>async</code> è ridondante, <code>fakeFetchUser</code> ritorna già una Promise.</li>
            <li><code>;</code> mancanti.</li>
          </ul>
        </div>

        <div consegna>
          <h3>Argomento</h3>
          <p>
            <code>resource()</code> porta il caricamento asincrono nel mondo dei signal. Gli dai una
            funzione <code>params</code> (che legge i signal da cui dipende) e un <code>loader</code>
            asincrono; lui espone lo stato come signal: <code>value()</code>, <code>isLoading()</code>,
            <code>error()</code>, <code>status()</code>.
          </p>
          <p>
            Quando <code>params</code> cambia il loader riparte <strong>e la richiesta precedente
            viene abortita</strong> (niente race condition). Se <code>params</code> ritorna
            <code>undefined</code>, il loader non parte. È il sostituto dichiarativo di
            <code>switchMap</code> + gestione manuale di loading/errore. Serve per la
            <strong>lettura</strong> di dati, non per le mutazioni.
          </p>
          <p class="hint">API in developer preview — firma <code>resource(&#123; params, loader &#125;)</code>.</p>

          <h3>Concetti</h3>
          <ul>
            <li><code>resource(&#123; params: () =&gt; X, loader: async (&#123; params, abortSignal &#125;) =&gt; T &#125;)</code></li>
            <li><code>value()</code> → <code>T | undefined</code> · <code>hasValue()</code> → boolean</li>
            <li><code>isLoading()</code> · <code>error()</code> · <code>status()</code> (<code>'idle' | 'loading' | 'resolved' | 'error'</code>)</li>
            <li><code>reload()</code> → riesegue il loader con gli stessi params</li>
          </ul>

          <h3>Scenario</h3>
          <p>
            Navigatore di utenti: prev/next cambiano l'id (1–5), la scheda mostra nome ed email.
            <code>fakeFetchUser(id)</code> è già fornita: risolve dopo ~600 ms e
            <strong>lancia se <code>id === 4</code></strong>.
          </p>

          <h3>Cosa devi fare — <code>ex07-resource.ts</code></h3>
          <ol>
            <li><code>userResource = resource(&#123; params: () =&gt; this.userId(), loader: (&#123; params &#125;) =&gt; fakeFetchUser(params) &#125;)</code></li>
            <li>template, in ordine: <code>&#64;if (isLoading())</code> → "Carico…"; <code>&#64;else if (error())</code> → messaggio; <code>&#64;else if (hasValue())</code> → nome + email</li>
            <li><code>reload()</code> → <code>this.userResource.reload()</code></li>
            <li>vai su <code>id = 4</code> e verifica il ramo errore</li>
          </ol>

          <h3>Criteri di valutazione</h3>
          <ul class="checklist">
            <li><span class="check">✅</span> <code>params</code> è una funzione che legge il signal</li>
            <li><span class="check">✅</span> i tre stati gestiti nel template</li>
            <li><span class="check">✅</span> <code>reload()</code> collegato</li>
            <li><span class="check">✅</span> nessuna <code>Promise</code> gestita a mano con <code>.then()</code></li>
            <li><span class="check">✅</span> nessun <code>effect</code> che fa il fetch manualmente</li>
          </ul>

          <h3>Trappole</h3>
          <ul>
            <li><code>value()</code> è <code>undefined</code> finché il primo load non finisce</li>
            <li><code>params: this.userId</code> (senza <code>() =&gt;</code>) non è reattivo</li>
            <li><code>resource</code> è per la lettura: niente POST dentro</li>
          </ul>
        </div>

        <div class="card row">
          <button class="btn" (click)="prev()">‹ prev</button>
          <strong>id {{ userId() }}</strong>
          <button class="btn" (click)="next()">next ›</button>
          <button class="btn" (click)="reload()">ricarica</button>
        </div>

        <div class="card">
        @if (userResource.isLoading()) {
          <p>Carico…</p>
        } @else if (userResource.error()) {
          <p>{{ $any(userResource.error()).message }}</p>
        } @else if (userResource.hasValue()) {
          <h3>{{ userResource.value().name }}</h3>
          <p>{{ userResource.value().email }}</p>
        }
        </div>
      </app-exercise-shell>
    `,
})
export class Ex07Resource {
  readonly userId = signal(1);

  // TODO(7.2): userResource = resource({ params: () => this.userId(), loader: ({ params }) => fakeFetchUser(params) })
  readonly userResource = resource({
    params: () => ({
      id: this.userId(),
    }),
    loader: async ({ params }) => {
      return fakeFetchUser(params.id)
    },
  })
  prev(): void {
    this.userId.update((v) => Math.max(1, v - 1));
  }

  next(): void {
    this.userId.update((v) => Math.min(5, v + 1));
  }

  reload(): void {
    this.userResource.reload()
  }
}
