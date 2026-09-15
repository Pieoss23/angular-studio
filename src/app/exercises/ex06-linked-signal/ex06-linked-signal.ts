import { Component, computed, linkedSignal, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface Product {
  id: number;
  name: string;
  category: 'frutta' | 'verdura' | 'pane';
}

@Component({
  selector: 'app-ex06-linked-signal',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="6" topic="Reattività" folder="ex06-linked-signal" completed
      title="linkedSignal: stato derivato ma scrivibile">

      <div imparato>
        <h3>Esito: ✅ completato — 5/5 (bonus incluso)</h3>
        <ul>
          <li><code>linkedSignal</code> = <code>computed</code> + scrivibilità. Segue una sorgente, ma <code>.set()</code> / <code>.update()</code> lo sovrascrivono fino alla prossima variazione della sorgente.</li>
          <li>Forma estesa: <code>&#123; source, computation: (source, previous) =&gt; ... &#125;</code>. <code>previous</code> è <code>&#123; source, value &#125;</code> del calcolo precedente — o <code>undefined</code> al primo giro (da gestire).</li>
          <li>Hai usato <code>previous</code> per <strong>conservare</strong> la selezione se il prodotto è ancora in lista, altrimenti primo elemento: è esattamente il caso d'uso canonico.</li>
          <li>La <code>computation</code> deve essere <strong>pura</strong> come quella di un <code>computed</code>: qui lo è.</li>
          <li>Prima di <code>linkedSignal</code> questo si faceva con <code>computed</code> + <code>effect</code> che chiama <code>.set()</code> → anti-pattern (effetti che scrivono stato, ordine di esecuzione fragile).</li>
          <li><code>select()</code> fa <code>selectedId.set(id)</code>: la scelta manuale dell'utente vince sulla derivazione, finché non cambi categoria.</li>
        </ul>
        <h3>Nit (non a punteggio)</h3>
        <ul>
          <li><code>prevId ? ...</code> è un controllo <em>falsy</em>: con id ≥ 1 ok, ma <code>prevId != null</code> è più corretto.</li>
          <li><code>(prevId as number)</code> → <code>prevId!</code> o un early-return evitano il cast.</li>
          <li><code>source: () =&gt; this.visible()</code> → <code>source: this.visible</code> (è già un signal).</li>
          <li>rimuovere le righe <code>// TODO</code> commentate; <code>;</code> mancante su <code>selectedId.set(id)</code>.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>linkedSignal</code> colma il buco tra <code>signal</code> e <code>computed</code>:
          un <code>computed</code> è derivato ma <strong>read-only</strong>, un <code>signal</code>
          è scrivibile ma <strong>non derivato</strong>. <code>linkedSignal</code> è entrambe le
          cose — parte da un valore calcolato, si ri-deriva quando cambia la sorgente, ma nel
          frattempo puoi anche scriverlo a mano.
        </p>
        <p>
          Caso d'uso: un valore controllato dall'utente che ha senso <em>resettare</em> quando
          cambia il contesto (la riga selezionata quando cambi filtro, il tab attivo quando
          cambiano i tab). Prima si faceva con <code>computed</code> + <code>effect</code> che
          chiamava <code>.set()</code> — un anti-pattern.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>linkedSignal(() =&gt; expr)</code> — forma breve: segue <code>expr</code>, resta scrivibile</li>
          <li><code>linkedSignal(&#123; source, computation: (source, previous) =&gt; ... &#125;)</code> — <code>previous</code> = <code>&#123; source, value &#125;</code> del calcolo precedente</li>
          <li>si legge/scrive come un <code>signal</code>: <code>x()</code>, <code>x.set()</code>, <code>x.update()</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Catalogo con filtro per categoria. Quando cambi categoria la selezione corrente spesso
          non è più in lista: deve tornare al primo prodotto visibile, senza togliere all'utente
          la possibilità di sceglierne un altro. <code>category</code>, <code>products</code> e il
          <code>computed</code> <code>visible</code> sono già pronti.
        </p>

        <h3>Cosa devi fare — <code>ex06-linked-signal.ts</code></h3>
        <ol>
          <li><code>selectedId</code>: da <code>signal</code> a <code>linkedSignal(() =&gt; this.visible()[0]?.id ?? null)</code></li>
          <li><code>select(id)</code>: <code>this.selectedId.set(id)</code> (override manuale)</li>
          <li><code>selected</code>: <code>computed</code> col <code>Product</code> che ha <code>id === selectedId()</code>, o <code>null</code></li>
          <li><strong>bonus</strong>: forma estesa con <code>previous</code> per <em>conservare</em> la scelta se ancora presente nella nuova lista</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="check">✅</span> <code>selectedId</code> è un <code>linkedSignal</code> (non <code>computed</code> + <code>effect</code>)</li>
          <li><span class="check">✅</span> cambiando categoria la selezione si aggiorna da sola</li>
          <li><span class="check">✅</span> <code>select()</code> la può comunque sovrascrivere</li>
          <li><span class="check">✅</span> <code>selected</code> è un <code>computed</code> puro</li>
          <li><span class="check">✅</span> bonus: la forma <code>previous</code> conserva la scelta valida</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex06</code>: con "tutte" il primo prodotto è evidenziato → clicca "Carote" →
          cambia categoria in "frutta": la selezione torna a "Mele" (forma breve) oppure resta
          la tua scelta se è ancora valida (bonus).
        </p>
      </div>

      <div class="card row">
        <label>Categoria:</label>
        <select [value]="category()" (change)="category.set($any($event.target).value)">
          <option value="tutte">tutte</option>
          <option value="frutta">frutta</option>
          <option value="verdura">verdura</option>
          <option value="pane">pane</option>
        </select>
      </div>

      <div class="card">
        <ul class="list">
          @for (p of visible(); track p.id) {
            <li>
              <button class="btn" [class.primary]="p.id === selectedId()" (click)="select(p.id)">
                {{ p.name }}
              </button>
            </li>
          }
        </ul>
        <p class="hint">Selezionato: <strong>{{ selected()?.name ?? '—' }}</strong></p>
      </div>
    </app-exercise-shell>
  `,
  styles: `.list { list-style: none; padding: 0; display: flex; gap: 8px; flex-wrap: wrap; }`,
})
export class Ex06LinkedSignal {
  readonly category = signal<'tutte' | Product['category']>('tutte');

  private readonly products = signal<Product[]>([
    { id: 1, name: 'Mele', category: 'frutta' },
    { id: 2, name: 'Banane', category: 'frutta' },
    { id: 3, name: 'Zucchine', category: 'verdura' },
    { id: 4, name: 'Carote', category: 'verdura' },
    { id: 5, name: 'Baguette', category: 'pane' },
  ]);

  readonly visible = computed(() => {
    const c = this.category();
    return c === 'tutte' ? this.products() : this.products().filter((p) => p.category === c);
  });

  // TODO(6.1): selectedId = linkedSignal(() => this.visible()[0]?.id ?? null)
  // readonly selectedId = signal<number | null>(null);

  readonly selectedId = linkedSignal<Product[], number | null>({
    source: () => this.visible(),
    computation: (newVisible, previous) => {
      const prevId = previous?.value;
      const isStillVisible = prevId ? newVisible.some(p => p.id === prevId) : false;

      // Se era valido e c'è ancora lo tengo, altrimenti prendo il primo della nuova lista (o null)
      return isStillVisible ? (prevId as number) : (newVisible[0]?.id ?? null);
    }
  });
  // TODO(6.3): selected = computed -> prodotto con id === selectedId()
  readonly selected = computed<Product | null>(() => {
    const currentId = this.selectedId();
    return this.products().find((p) => p.id === currentId) ?? null;
  });

  select(id: number): void {
    // TODO(6.2): selectedId.set(id)
    this.selectedId.set(id)
  }
}
