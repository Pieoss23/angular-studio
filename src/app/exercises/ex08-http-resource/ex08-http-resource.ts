import { Component, computed, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { httpResource } from '@angular/common/http';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-ex08-http-resource',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="8" topic="Dati async" folder="ex08-http-resource" completed
      title="httpResource(): REST dichiarativo">

      <div imparato>
        <h3>Esito: ✅ completato — 5/5 (2 correzioni)</h3>
        <ul>
          <li><code>httpResource&lt;T&gt;(() =&gt; url)</code>: l'URL è calcolato da una funzione reattiva. Cambi <code>userId()</code> → l'URL cambia → GET rifatta, richiesta vecchia annullata. Il generico <code>&lt;Post[]&gt;</code> tipizza <code>value()</code>.</li>
          <li><strong>Cosa va nell'URL e cosa no</strong>: <code>userId</code> è un parametro <em>server</em> → sta nell'URL reattivo. Il filtro sui titoli è <em>client-side</em> → è un <code>computed</code> che legge <code>q()</code> e <code>value()</code>, <strong>senza</strong> toccare la rete. È il punto dell'esercizio.</li>
          <li><code>computed(() =&gt; ...)</code> <strong>non riceve argomenti</strong>: le dipendenze si ottengono chiamando gli altri signal nel corpo (<code>this.q()</code>, <code>this.postsResource.value()</code>).</li>
          <li><code>Array.prototype.filter</code> vuole una <strong>funzione predicato</strong>, non un valore.</li>
          <li>Stati nel template: <code>isLoading()</code> → <code>error()</code> → lista. <code>httpResource</code> <strong>non</strong> sostituisce <code>HttpClient</code>: le mutazioni restano <code>http.post(...).subscribe()</code>.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li><code>computed&lt;Post[]&gt;((q) =&gt; this.postsResource.value()?.filter(q))</code>: <code>(q)</code> non era il signal ma un parametro <code>any</code> inesistente; <code>.filter(q)</code> con <code>q</code> non-funzione → TypeError; tipo di ritorno <code>Post[] | undefined</code>. Riscritto leggendo <code>this.q()</code> e con <code>?? []</code>.</li>
          <li>Template <code>&#64;if/&#64;else</code> (loading/error/lista) era ancora da fare.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>httpResource()</code> è <code>resource()</code> specializzato per HTTP: gli dai un
          <strong>URL calcolato da una funzione reattiva</strong> e lui fa la GET, deserializza il
          JSON e ti espone lo stato come signal — niente <code>subscribe</code>, niente
          <code>async</code> pipe. Quando l'URL cambia la richiesta si rifà da sola e quella
          vecchia viene annullata. <code>value()</code> è tipizzato con il generico.
        </p>
        <p>
          <strong>Non</strong> sostituisce <code>HttpClient</code>: le mutazioni (POST/PUT su
          azione) restano imperative. <code>httpResource</code> serve per lo stato derivato da una
          GET.
        </p>
        <p class="hint">Developer preview. Richiede <code>provideHttpClient()</code> (già configurato).</p>

        <h3>Concetti</h3>
        <ul>
          <li><code>httpResource&lt;T&gt;(() =&gt; url)</code> — GET reattiva</li>
          <li><code>httpResource&lt;T&gt;(() =&gt; (&#123; url, params, method, body, headers &#125;))</code></li>
          <li><code>.text()</code> / <code>.blob()</code> / <code>.arrayBuffer()</code> per risposte non-JSON</li>
          <li>stato: <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, <code>hasValue()</code>, <code>headers()</code>, <code>statusCode()</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Articoli di un utente da <code>jsonplaceholder.typicode.com/posts?userId=&lt;id&gt;</code>.
          I bottoni <code>‹ ›</code> cambiano <code>userId</code> → refetch. Il campo filtro
          restringe i titoli → <strong>nessun</strong> refetch (client-side). Il punto: capire
          cosa va nell'URL (parametro server) e cosa resta un <code>computed</code> locale.
        </p>

        <h3>Cosa devi fare — <code>ex08-http-resource.ts</code></h3>
        <ol>
          <li><code>postsResource = httpResource&lt;Post[]&gt;(() =&gt; '.../posts?userId=' + this.userId())</code> (o con template literal)</li>
          <li><code>filtered</code> = <code>computed</code> su <code>postsResource.value() ?? []</code> filtrato per <code>q()</code> (case-insensitive), senza toccare la rete</li>
          <li><code>count</code> = <code>computed(() =&gt; this.postsResource.value()?.length ?? 0)</code></li>
          <li>template: <code>isLoading()</code> → "Carico…"; <code>error()</code> → "Errore di rete"; altrimenti <code>&#64;for</code> su <code>filtered()</code> con <code>&#64;empty</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="check">✅</span> URL costruito dentro la funzione reattiva (cambia con <code>userId</code>)</li>
          <li><span class="check">✅</span> tipizzazione esplicita <code>httpResource&lt;Post[]&gt;</code></li>
          <li><span class="check">✅</span> il filtro è un <code>computed</code>: cambiare <code>q</code> non rifà la GET</li>
          <li><span class="check">✅</span> stati loading ed error nel template</li>
          <li><span class="check">✅</span> nessun <code>HttpClient.get().subscribe()</code> per questa lettura</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex08</code> con la tab Network aperta: cambia <code>userId</code> → nuova
          richiesta; scrivi nel filtro → lista più corta, nessuna richiesta.
        </p>
      </div>

      <div class="card row">
        <button class="btn" (click)="userId.set(Math.max(1, userId() - 1))">‹</button>
        <strong>userId {{ userId() }}</strong>
        <button class="btn" (click)="userId.set(Math.min(10, userId() + 1))">›</button>
        <input placeholder="filtra per titolo" [value]="q()"
          (input)="q.set($any($event.target).value)" />
      </div>

      <div class="card">
        @if (postsResource.isLoading()) {
          <p>Carico…</p>
        } @else if (postsResource.error()) {
          <p class="fail">Errore di rete</p>
        } @else {
          <p class="hint">Post ricevuti: {{ count() }}</p>
          <ul>
            @for (post of filtered(); track post.id) {
              <li>{{ post.title }}</li>
            } @empty {
              <li class="hint">Nessun risultato</li>
            }
          </ul>
        }
      </div>
    </app-exercise-shell>
  `,
})
export class Ex08HttpResource {
  protected readonly Math = Math;
  readonly userId = signal(1);
  readonly q = signal('');

  readonly postsResource = httpResource<Post[]>(
    () => `https://jsonplaceholder.typicode.com/posts?userId=${this.userId()}`,
  );

  readonly count = computed(() => this.postsResource.value()?.length ?? 0);

  readonly filtered = computed<Post[]>(() => {
    const posts = this.postsResource.value() ?? [];
    const query = this.q().trim().toLowerCase();
    return posts.filter((post) => post.title.toLowerCase().includes(query));
  });
}
