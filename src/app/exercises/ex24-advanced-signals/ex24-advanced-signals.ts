import { Component, effect, signal, untracked } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface Filters {
  status: string;
  tag: string;
}

@Component({
  selector: 'app-ex24-advanced-signals',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="24" topic="Reattività" folder="ex24-advanced-signals"
      title="Signal avanzati: untracked(), effect cleanup, equal custom">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Tre strumenti per casi meno banali con i signal: <code>untracked()</code> per leggere un
          signal dentro un <code>effect()</code> <strong>senza</strong> farlo entrare tra le
          dipendenze (l'effect non si ri-esegue se cambia solo quello); la funzione di
          <strong>cleanup</strong> di un effect, per annullare lavoro asincrono in sospeso prima
          della run successiva (o alla distruzione); e un comparatore <code>equal</code> custom su
          un signal, per decidere <em>tu</em> quando due valori contano come "uguali" (e quindi
          non triggerare nulla) invece di affidarti al default (<code>===</code>).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>untracked(() =&gt; this.altroSignal())</code> — legge il valore corrente senza
            registrare una dipendenza reattiva</li>
          <li><code>effect((onCleanup) =&gt; &#123; onCleanup(() =&gt; ...) &#125;)</code> — la
            funzione passata a <code>onCleanup</code> gira <strong>prima</strong> della prossima
            esecuzione dell'effect, e alla distruzione del componente</li>
          <li><code>signal(valore, &#123; equal: (a, b) =&gt; boolean &#125;)</code> — sostituisce il
            confronto di default (<code>Object.is</code>) con uno tuo: se ritorna
            <code>true</code>, il <code>.set()</code> non fa scattare nulla a valle</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Digitando una query, un <code>effect()</code> simula una "elaborazione" con 500ms di
          ritardo (un <code>setTimeout</code>) e la logga. Un toggle "verbose" deve poter cambiare
          senza far ripartire l'elaborazione. I filtri (<code>status</code>/<code>tag</code>) sono
          un oggetto con <code>equal</code> custom: impostarli con gli stessi valori (anche in un
          oggetto nuovo) non deve loggare nulla di nuovo.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><strong>cleanup</strong>: nell'effect della query, usa la firma
            <code>effect((onCleanup) =&gt; &#123; ... &#125;)</code>. Programma il
            <code>setTimeout</code> che logga "elaboro: &lt;query&gt;" dopo 500ms, e registra
            <code>onCleanup(() =&gt; clearTimeout(id))</code> per annullarlo se la query cambia
            di nuovo prima che scatti</li>
          <li><strong>untracked</strong>: dentro lo stesso effect, leggi
            <code>this.verbose()</code> con <code>untracked(() =&gt; this.verbose())</code>
            invece di <code>this.verbose()</code> diretto, così il toggle verbose da solo non
            ri-esegue l'effect</li>
          <li><strong>equal custom</strong>: sul signal <code>filters</code>, aggiungi
            <code>&#123; equal: (a, b) =&gt; a.status === b.status &amp;&amp; a.tag === b.tag &#125;</code>
            come secondo argomento di <code>signal(...)</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> digitando in fretta, appare un solo "elaboro: ..." per l'ultima query (le precedenti sono annullate)</li>
          <li><span class="hint">☐</span> toggling "verbose" da solo non aggiunge righe al log dell'elaborazione</li>
          <li><span class="hint">☐</span> impostare <code>filters</code> con valori identici (bottone "stessi filtri") non incrementa il contatore di update</li>
          <li><span class="hint">☐</span> impostare <code>filters</code> con un valore diverso incrementa il contatore</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex24</code>: scrivi velocemente nel campo query, guarda comparire un solo log
          "elaboro" dopo l'ultima lettera. Clicca "verbose" più volte: nessuna nuova riga. Clicca
          "stessi filtri" più volte: il contatore resta fermo; clicca "filtri diversi": sale.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>senza <code>onCleanup</code>, ogni tasto premuto avvierebbe un timer che poi logga
            comunque, anche se superato da un tasto successivo — log multipli invece di uno solo</li>
          <li><code>untracked</code> va usato <strong>dentro</strong> l'effect, attorno alla
            singola lettura che non deve essere tracciata — non toglie la reattività
            dell'intero effect, solo di quella lettura</li>
          <li>l'<code>equal</code> custom si applica solo confrontando il valore
            <strong>nuovo</strong> con quello <strong>precedente</strong> del signal, non con
            valori arbitrari</li>
        </ul>
      </div>

      <div class="card">
        <input class="input" placeholder="scrivi una query..." (input)="query.set($any($event.target).value)" />
        <label><input type="checkbox" (change)="verbose.set($any($event.target).checked)" /> verbose</label>
        <ul>
          @for (line of log(); track $index) {
            <li>{{ line }}</li>
          }
        </ul>
      </div>

      <div class="card">
        <p>filtri correnti: {{ filters().status }} / {{ filters().tag }}</p>
        <p>aggiornamenti registrati: <strong>{{ updateCount() }}</strong></p>
        <div class="row">
          <button class="btn" (click)="setSameFilters()">stessi filtri (oggetto nuovo)</button>
          <button class="btn" (click)="setDifferentFilters()">filtri diversi</button>
        </div>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex24AdvancedSignals {
  protected readonly query = signal('');
  protected readonly verbose = signal(false);
  protected readonly log = signal<string[]>([]);

  // TODO(24.3): aggiungi { equal: (a, b) => a.status === b.status && a.tag === b.tag }
  protected readonly filters = signal<Filters>({ status: 'active', tag: 'a' });
  protected readonly updateCount = signal(0);

  constructor() {
    effect(() => {
      // TODO(24.1 - cleanup) / TODO(24.2 - untracked): riscrivi questo effect
      // usando la firma effect((onCleanup) => { ... }) e untracked() per
      // leggere this.verbose() senza tracciarlo. Vedi consegna.
      const q = this.query();
      const verbose = this.verbose();
      if (verbose) this.log.update((l) => [...l, `(verbose) query cambiata: "${q}"`]);
      this.log.update((l) => [...l, `elaboro: "${q}"`]);
    });

    effect(() => {
      this.filters();
      this.updateCount.update((c) => c + 1);
    });
  }

  protected setSameFilters(): void {
    this.filters.set({ status: 'active', tag: 'a' });
  }

  protected setDifferentFilters(): void {
    this.filters.update((f) => ({ ...f, tag: f.tag === 'a' ? 'b' : 'a' }));
  }
}
