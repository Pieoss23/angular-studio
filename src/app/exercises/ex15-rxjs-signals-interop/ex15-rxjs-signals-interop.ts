import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ExerciseShell } from '../../shared/exercise-shell';
import { SearchService } from './search.service';

@Component({
  selector: 'app-ex15-rxjs-signals-interop',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="15" topic="Dati async" folder="ex15-rxjs-signals-interop" completed
      title="RxJS ↔ Signals: toObservable, toSignal">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4</h3>
        <ul>
          <li><code>toObservable(this.term)</code> come inizializzatore di campo: gira in
            injection context, emette il valore corrente a ogni cambio del signal.</li>
          <li>catena <code>debounceTime(300) → distinctUntilChanged() → switchMap(...)</code>:
            aspetta la pausa nella digitazione, evita richieste duplicate, e annulla la ricerca
            precedente se ne parte una nuova prima che finisca.</li>
          <li>due <code>tap()</code> attorno allo <code>switchMap</code> per accendere/spegnere
            <code>loading</code>: quello "dopo" scatta solo quando la ricerca interna completa,
            quindi <code>loading</code> torna <code>false</code> esattamente quando arrivano i
            risultati, non prima.</li>
          <li><code>toSignal(results$, &#123; initialValue: [] as string[] &#125;)</code> converte
            il flusso RxJS finale in un signal leggibile con <code>results()</code>, senza
            <code>async</code> pipe né <code>subscribe()</code> manuale.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Signal e Observable risolvono problemi simili in modo diverso: i signal sono sincroni
          e "pull" (leggi il valore quando vuoi), gli Observable sono asincroni e "push", con un
          arsenale di operatori (<code>debounceTime</code>, <code>switchMap</code>...) che i
          signal non hanno. <code>@angular/core/rxjs-interop</code> fa da ponte nei due sensi.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>toObservable(signal)</code> — trasforma un signal in un Observable che emette
            a ogni cambio (deve girare in injection context, es. field initializer)</li>
          <li><code>toSignal(observable, &#123; initialValue: ... &#125;)</code> — il contrario:
            legge l'ultimo valore emesso come signal; <code>initialValue</code> evita
            <code>undefined</code> prima della prima emissione</li>
          <li>perché passare per RxJS invece di restare sui signal: qui servono
            <code>debounceTime</code> (aspetta che l'utente smetta di scrivere) e
            <code>switchMap</code> (annulla la ricerca precedente se ne parte una nuova)</li>
          <li><code>distinctUntilChanged()</code> evita ricerche duplicate se il valore non è
            davvero cambiato</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Una search-box: scrivendo aggiorna un signal <code>term</code>. La ricerca vera
          (<code>SearchService.search</code>, già pronta, finge una chiamata HTTP con 400ms di
          ritardo) deve partire solo dopo una pausa nella digitazione.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>term$ = toObservable(this.term)</code></li>
          <li>pipe: <code>debounceTime(300)</code> → <code>distinctUntilChanged()</code> →
            <code>switchMap(term =&gt; this.search.search(term))</code></li>
          <li><code>results = toSignal(results$, &#123; initialValue: [] as string[] &#125;)</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> la ricerca non parte a ogni tasto, solo dopo una pausa</li>
          <li><span class="hint">☐</span> <code>loading</code> mostra "cerco…" durante l'attesa dei 400ms</li>
          <li><span class="hint">☐</span> digitando in fretta, solo l'ultima ricerca produce risultati (switchMap)</li>
          <li><span class="hint">☐</span> i risultati sono un signal leggibile con <code>results()</code>, non un Observable</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex15</code>: scrivi "sig" lentamente → dopo una pausa appaiono "signal". Scrivi
          in fretta lettera per lettera senza pause: deve comparire un solo "cerco…" alla fine,
          non uno per lettera.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>toObservable</code> chiamato fuori da un injection context lancia un errore:
            va bene come inizializzatore di campo (come qui), non dentro un metodo qualsiasi</li>
          <li>senza <code>switchMap</code> (usando <code>mergeMap</code>) una ricerca vecchia e
            lenta potrebbe sovrascrivere il risultato di una più recente</li>
          <li><code>toSignal</code> senza <code>initialValue</code> tipizza il risultato come
            <code>T | undefined</code></li>
        </ul>
      </div>

      <div class="card" style="max-width: 360px;">
        <input
          class="input"
          placeholder="cerca (es. sig, def, rout...)"
          (input)="term.set($any($event.target).value)"
        />

        @if (loading()) {
          <p class="hint">cerco…</p>
        }

        @if (!loading() && term() && results().length === 0) {
          <p class="hint">nessun risultato</p>
        }

        <ul>
          @for (r of results(); track r) {
            <li>{{ r }}</li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex15RxjsSignalsInterop {
  private readonly search = inject(SearchService);

  protected readonly term = signal('');
  protected readonly loading = signal(false);

  // TODO(15.1): term$ = toObservable(this.term);
  term$ = toObservable(this.term);

  // TODO(15.2): results$ = this.term$.pipe(
  //   debounceTime(300),
  //   distinctUntilChanged(),
  //   tap(() => this.loading.set(true)),
  //   switchMap((term) => this.search.search(term)),
  //   tap(() => this.loading.set(false)),
  // );
  results$ = this.term$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((term) => this.search.search(term)),
    tap(() => this.loading.set(false))
  );
  // TODO(15.3): results = toSignal(this.results$, { initialValue: [] as string[] });
  protected readonly results = toSignal(this.results$, {initialValue: [] as string[] });
  // protected readonly results = signal<string[]>([]);
}
