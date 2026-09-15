import { Component, inject } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { CartStore } from './cart-store';
import { CartView } from './cart-view';

const CATALOG = [
  { id: 'a', name: 'Mug Angular', price: 12 },
  { id: 'b', name: 'Adesivo signal()', price: 3 },
  { id: 'c', name: 'Felpa zoneless', price: 35 },
];

@Component({
  selector: 'app-ex20-signal-store',
  imports: [ExerciseShell, CartView],
  template: `
    <app-exercise-shell n="20" topic="Architettura" folder="ex20-signal-store" completed
      title="State management: uno store con signal">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4</h3>
        <ul>
          <li><code>add()</code>: <code>.some()</code> per controllare se l'articolo esiste già,
            poi <code>.map()</code> per incrementarne la <code>qty</code> immutabilmente (nuovo
            array, nuovo oggetto item) o <code>[...items, nuovo]</code> se non c'è.</li>
          <li><code>remove()</code>: <code>.map()</code> decrementa la <code>qty</code>
            dell'articolo giusto, poi <code>.filter(i =&gt; i.qty &gt; 0)</code> elimina le righe
            arrivate a zero — due passaggi immutabili in sequenza invece di una singola mutazione
            in place.</li>
          <li><code>total</code>/<code>count</code> restano <code>computed</code>: si aggiornano
            da soli ad ogni <code>add</code>/<code>remove</code>, nessun ricalcolo manuale.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Non serve una libreria esterna per avere uno "store" condiviso: un
          <code>&#64;Injectable(&#123; providedIn: 'root' &#125;)</code> con signal privati e scrivibili,
          più <code>computed</code> derivati esposti in sola lettura, è già un pattern completo di
          state management. Ogni componente che lo inietta vede lo <strong>stesso</strong> stato
          (singleton), reattivo, senza passare dati su e giù per l'albero dei componenti.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li>signal <strong>privato</strong> nel servizio (<code>_items</code>), esposto
            all'esterno con <code>.asReadonly()</code>: solo lo store può modificarlo</li>
          <li><code>computed()</code> per valori derivati (<code>total</code>,
            <code>count</code>): si ricalcolano da soli, non serve tenerli sincronizzati a mano</li>
          <li><strong>immutabilità</strong>: ogni update sostituisce l'array/oggetto con uno
            nuovo (<code>[...arr, x]</code>, <code>arr.map(...)</code>), non lo muta in place —
            i signal si accorgono del cambiamento solo così</li>
          <li>metodi pubblici del servizio come unica "API" per modificare lo stato (niente
            <code>set()</code> chiamato da fuori)</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>CartStore</code> tiene gli articoli del carrello. Questa pagina ha un catalogo
          finto; <code>CartView</code> (già pronto) mostra carrello, totale e quantità.
        </p>

        <h3>Cosa devi fare — <code>cart-store.ts</code></h3>
        <ol>
          <li><code>add()</code>: se l'articolo è già nel carrello, incrementa la sua
            <code>qty</code> invece di creare una riga duplicata (sempre in modo immutabile)</li>
          <li><code>remove()</code>: decrementa la <code>qty</code> di 1; se arriva a 0, rimuovi
            del tutto l'articolo dall'array</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> aggiungere due volte lo stesso prodotto mostra qty 2, non due righe</li>
          <li><span class="hint">☐</span> il bottone "-" a qty 1 rimuove la riga, non la porta a qty 0 visibile</li>
          <li><span class="hint">☐</span> <code>total</code> e <code>count</code> si aggiornano da soli, nessun ricalcolo manuale in giro</li>
          <li><span class="hint">☐</span> nessuna mutazione diretta dell'array (niente <code>.push</code>/<code>.splice</code> su <code>_items()</code>)</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex20</code>: aggiungi lo stesso prodotto più volte, controlla che la quantità
          salga invece di duplicare righe. Rimuovi fino a 0 e verifica che sparisca.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>this._items().push(x)</code> "funziona" (l'array esiste) ma non fa scattare
            nessun aggiornamento: i signal confrontano il riferimento, serve un nuovo array</li>
          <li>con <code>providedIn: 'root'</code> lo store è un singleton applicativo: se lo
            inietti in più componenti, condividono davvero lo stesso stato (è voluto, qui)</li>
        </ul>
      </div>

      <div class="card">
        <h3>catalogo</h3>
        <ul>
          @for (p of catalog; track p.id) {
            <li>
              {{ p.name }} — {{ p.price }}€
              <button class="btn" (click)="store.add(p)">aggiungi</button>
            </li>
          }
        </ul>
      </div>

      <app-cart-view />
    </app-exercise-shell>
  `,
})
export class Ex20SignalStore {
  protected readonly catalog = CATALOG;
  protected readonly store = inject(CartStore);
}
