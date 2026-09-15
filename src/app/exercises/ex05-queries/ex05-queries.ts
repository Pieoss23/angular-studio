import { Component, computed, signal, viewChild, viewChildren, ElementRef, effect } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex05-queries',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="5" topic="Componenti" folder="ex05-queries" completed
      title="Query come signal: viewChild / viewChildren">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Le <strong>query</strong> danno al componente un riferimento a elementi o componenti del
          suo template (<code>viewChild</code> / <code>viewChildren</code>) o del contenuto
          proiettato (<code>contentChild</code> / <code>contentChildren</code>). Nella forma
          moderna <strong>sono signal</strong>: <code>viewChild('x')</code> ritorna un
          <code>Signal</code>, si aggiorna da solo quando il DOM cambia, e lo si consuma con
          <code>computed</code> / <code>effect</code>. Spariscono <code>&#64;ViewChild</code> col
          <code>!</code>, <code>QueryList</code> con <code>.changes</code>, e l'attesa di
          <code>ngAfterViewInit</code>.
        </p>
        <h3>Concetti</h3>
        <ul>
          <li><code>viewChild('ref')</code> / <code>viewChild.required('ref')</code> → <code>Signal&lt;T | undefined&gt;</code> / <code>Signal&lt;T&gt;</code></li>
          <li><code>viewChildren('ref')</code> → <code>Signal&lt;readonly T[]&gt;</code></li>
          <li><code>contentChild</code> / <code>contentChildren</code> per il contenuto proiettato</li>
          <li>le query sono signal: si usano in <code>computed</code> / <code>effect</code>, si aggiornano da sole</li>
          <li>niente più <code>&#64;ViewChild(...) x!: ...</code> + <code>AfterViewInit</code></li>
        </ul>
        <h3>Consegna</h3>
        <ul>
          <li><code>box</code> = <code>viewChild.required&lt;ElementRef&lt;HTMLInputElement&gt;&gt;('box')</code></li>
          <li><code>focusInput()</code> chiama <code>this.box().nativeElement.focus()</code></li>
          <li><code>items</code> = <code>viewChildren&lt;ElementRef&lt;HTMLLIElement&gt;&gt;('item')</code></li>
          <li><code>count</code> = <code>computed(() =&gt; items().length)</code></li>
          <li><code>effect()</code>: al cambio di <code>count()</code> → <code>console.log('li visibili:', count())</code></li>
        </ul>
        <h3>Criteri di valutazione — <span class="check">4 / 4</span></h3>
        <ul class="checklist">
          <li><span class="check">✅</span> <code>viewChild.required</code> (niente <code>!</code> / undefined check manuale)</li>
          <li><span class="check">✅</span> nessun <code>AfterViewInit</code></li>
          <li><span class="check">✅</span> <code>computed</code> sulla query, non lettura in un lifecycle</li>
          <li><span class="check">✅</span> <code>effect</code> reagisce all'aggiunta di righe</li>
        </ul>
      </div>

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (1 correzione in review)</h3>
        <ul>
          <li>Le query <strong>sono signal</strong>: <code>viewChild()</code> restituisce un getter, non il valore. Le leggi come qualsiasi signal e si aggiornano da sole quando il DOM cambia.</li>
          <li><code>viewChild.required('box')</code> → tipo <code>Signal&lt;ElementRef&gt;</code> (mai <code>undefined</code>): niente <code>!</code>, niente controllo manuale. Se al momento della lettura l'elemento non esiste → errore esplicito.</li>
          <li><code>viewChild('box')</code> senza <code>.required</code> → <code>Signal&lt;T | undefined&gt;</code>: usalo quando l'elemento è dentro un <code>&#64;if</code>.</li>
          <li><code>viewChildren</code> → <code>Signal&lt;readonly T[]&gt;</code>. Nessun <code>QueryList</code>, nessun <code>.changes</code> Observable: derivi con <code>computed</code> (<code>count = () =&gt; items().length</code>) e l'aggiornamento è automatico ad ogni <code>addRow()</code>.</li>
          <li><strong>Niente <code>AfterViewInit</code>/<code>ngAfterViewInit</code></strong>: prima le query erano popolate solo dopo quel lifecycle. Ora reagisci con <code>effect</code>/<code>computed</code> e il timing lo gestisce Angular.</li>
          <li><code>ElementRef.nativeElement</code> resta il modo per l'accesso DOM imperativo (<code>.focus()</code>). Il selettore <code>#box</code> nel template è il "reference" che la query aggancia.</li>
          <li>Le query di default guardano solo la <em>view</em> del componente; per il contenuto proiettato (<code>&lt;ng-content&gt;</code>) servono <code>contentChild</code>/<code>contentChildren</code>.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li><code>console.log('li visibili', this.count)</code> → mancavano le <code>()</code>: loggava la <em>funzione</em> signal e, non leggendo <code>count()</code>, l'<code>effect</code> non aveva dipendenze → <strong>non si ri-eseguiva</strong> all'aggiunta di righe. Corretto in <code>this.count()</code>. (Stessa trappola dell'es. 1.)</li>
          <li>Aggiunti i <code>;</code> mancanti su <code>box</code> e <code>items</code>.</li>
        </ul>
      </div>

      <div class="card row">
        <input #box placeholder="scrivimi dentro" />
        <button class="btn" (click)="focusInput()">focus</button>
      </div>

      <div class="card">
        <button class="btn" (click)="addRow()">aggiungi riga</button>
        <p class="hint">li visibili (da computed sulla query): <strong>{{ count() }}</strong></p>
        <ul>
          @for (r of rows(); track $index) {
            <li #item>{{ r }}</li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex05Queries {
  readonly rows = signal<string[]>(['riga 1', 'riga 2']);

  readonly box = viewChild.required<ElementRef<HTMLInputElement>>('box');

  readonly items = viewChildren<ElementRef<HTMLLIElement>>('item');

  readonly count = computed(() => this.items().length);

  constructor() {
    effect(() => {
      console.log('li visibili:', this.count());
    });
  }

  focusInput(): void {
    // TODO(5.2): this.box().nativeElement.focus()
    this.box().nativeElement.focus();
  }

  addRow(): void {
    this.rows.update((r) => [...r, `riga ${r.length + 1}`]);
  }
}
