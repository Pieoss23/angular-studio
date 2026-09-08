import { Component, computed, effect, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex01-signals',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="1" topic="Reattività" folder="ex01-signals" completed
      title="Signals: signal / computed / effect">

      <div consegna>
        <h3>Concetti</h3>
        <ul>
          <li><code>signal()</code> per lo stato locale reattivo; <code>.set()</code> / <code>.update()</code></li>
          <li><code>computed()</code> per valori derivati (memoizzati, sola lettura)</li>
          <li><code>effect()</code> per side-effect che reagiscono ai signal letti</li>
        </ul>
        <h3>Consegna — mini carrello</h3>
        <ul>
          <li><code>quantity</code> = signal numerico, parte da <code>1</code></li>
          <li><code>unitPrice</code> = signal numerico, parte da <code>9.9</code></li>
          <li><code>increment()</code> / <code>decrement()</code> con <code>.update()</code>; mai sotto <code>0</code></li>
          <li><code>total</code> = <code>computed</code> = <code>quantity * unitPrice</code></li>
          <li><code>discounted</code> = <code>computed</code>: se <code>total &gt; 50</code> applica il 10% di sconto (tieni il 90%), altrimenti <code>total</code></li>
          <li><code>effect()</code>: a ogni cambio di <code>discounted</code>, push del valore (arrotondato a 2 decimali) in <code>history</code>, in modo immutabile</li>
        </ul>
        <h3>Criteri di valutazione — <span class="check">5 / 5</span></h3>
        <ul class="checklist">
          <li><span class="check">✅</span> solo signal per lo stato (niente campi mutabili)</li>
          <li><span class="check">✅</span> <code>computed</code> per i derivati (niente ricalcolo manuale nel template)</li>
          <li><span class="check">✅</span> <code>decrement</code> non produce numeri negativi</li>
          <li><span class="check">✅</span> <code>effect</code> registrato nell'injection context (constructor / field), non in un metodo</li>
          <li><span class="check">✅</span> <code>history</code> aggiornato immutabilmente (<code>update(h =&gt; [...h, v])</code>)</li>
        </ul>
        <p class="hint">
          Nit residui (non incidono sul voto): <code>+ Number.EPSILON</code> nell'arrotondamento è
          inutile a queste grandezze; punti e virgola mancanti; scrivere un signal dentro un
          <code>effect</code> qui è ok ma in generale è preferibile evitarlo.
        </p>
      </div>

      <div imparato>
        <h3>Esito: ✅ completato — 5/5</h3>
        <ul>
          <li>Un signal è una <strong>funzione</strong>: <code>x()</code> legge, <code>x.set(v)</code> / <code>x.update(fn)</code> scrivono. Le <code>()</code> dimenticate in un <code>computed</code>/template sono l'errore n°1.</li>
          <li><code>computed()</code> = derivato <strong>memoizzato e read-only</strong>: si ricalcola solo quando cambia una dipendenza <em>letta durante l'esecuzione</em>.</li>
          <li>Le dipendenze si tracciano <strong>solo se le leggi</strong>: se un <code>effect</code> non chiama <code>this.discounted()</code>, non si riattiva.</li>
          <li><code>effect()</code> gira subito una volta e poi a ogni cambio delle dipendenze; va creato in un injection context.</li>
          <li>Update immutabile di array in un signal: <code>sig.update(a =&gt; [...a, x])</code>, mai <code>a.push(x)</code>.</li>
          <li>In modalità <strong>zoneless</strong> un campo normale (<code>this.foo = 1</code>) non aggiorna la UI: deve essere un signal.</li>
        </ul>
        <h3>Errori corretti in corso d'opera</h3>
        <ul>
          <li>Sconto: <code>total * 0.1</code> è il 10% <em>del</em> totale, non il totale <em>scontato</em> → <code>total * 0.9</code>.</li>
          <li><code>effect</code> che calcolava un valore e non chiamava mai <code>history.update(...)</code>: nessun effetto visibile.</li>
          <li>Arrotondamento con <code>* Number.EPSILON</code> (≈ 0) invece di <code>+ Number.EPSILON</code>.</li>
        </ul>
        <h3>Trappola</h3>
        <ul>
          <li>Scrivere un signal dentro un <code>effect</code> funziona ma è spesso un code smell; se scrivi lo stesso signal che l'effect legge → loop infinito. Report completo in <code>REPORT/ex01-cosa-ho-imparato.md</code>.</li>
        </ul>
      </div>

      <div class="card">
        <div class="row">
          <button class="btn" (click)="decrement()">−</button>
          <strong>{{ quantity() }}</strong>
          <button class="btn" (click)="increment()">+</button>
          <span class="hint">prezzo unitario € {{ unitPrice() }}</span>
        </div>
      </div>

      <div class="card">
        <div>Totale: <strong>€ {{ total() }}</strong></div>
        <div>Scontato: <strong>€ {{ discounted() }}</strong></div>
      </div>

      <div class="card">
        <strong>History (da effect)</strong>
        <ol>
          @for (v of history(); track $index) { <li>€ {{ v }}</li> }
          @empty { <li class="hint">nessun valore registrato</li> }
        </ol>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex01Signals {
  // TODO(1.1): quantity come signal, valore iniziale 1
  readonly quantity = signal(1);

  // TODO(1.2): unitPrice come signal, valore iniziale 9.9
  readonly unitPrice = signal(9.9);

  // TODO(1.4): total = computed di quantity * unitPrice
  readonly total = computed(() => this.quantity() * this.unitPrice());

  // TODO(1.5): discounted = computed; -10% se total > 50
  readonly discounted = computed(() => {
    const currTotal = this.total();
    return currTotal > 50 ? currTotal * 0.9 : currTotal;
  });

  readonly history = signal<number[]>([]);

  constructor() {
    // TODO(1.6): effect che, quando discounted cambia,
    // aggiunge il valore (arrotondato a 2 decimali) a history in modo immutabile
    effect(()=> {
      const currDiscounted = this.discounted();
      const roundedValue = Math.round((currDiscounted + Number.EPSILON )* 100) / 100;
      this.history.update(currentHistory => [...currentHistory, roundedValue]);


    })
  }

  increment(): void {
    // TODO(1.3): +1 con update
    this.quantity.update((qta) => qta + 1 )

  }

  decrement(): void {
    // TODO(1.3): -1 con update, mai sotto 0
    this.quantity.update((qta) => qta > 0 ? qta -1 : 0 )
  }
}
