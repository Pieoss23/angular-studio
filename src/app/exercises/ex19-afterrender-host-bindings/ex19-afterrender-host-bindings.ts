import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { BarChart } from './bar-chart';

@Component({
  selector: 'app-ex19-afterrender-host-bindings',
  imports: [ExerciseShell, BarChart],
  template: `
    <app-exercise-shell n="19" topic="Performance" folder="ex19-afterrender-host-bindings"
      title="DOM diretto dopo il render: afterRenderEffect">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Alcune cose si possono fare solo quando il DOM esiste davvero: disegnare su un
          <code>&lt;canvas&gt;</code>, misurare un elemento, integrare una libreria non-Angular.
          <code>afterRenderEffect()</code> registra una callback che gira <strong>dopo</strong>
          ogni ciclo di render, ed è anche un <em>effect</em>: se leggi un signal al suo interno,
          si ri-esegue automaticamente quando quel signal cambia — niente
          <code>ngOnChanges</code>/<code>ngAfterViewChecked</code> manuali.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>afterRenderEffect(() =&gt; &#123; ... &#125;)</code> — va chiamato in injection
            context (constructor o initializer di campo), tipicamente dentro il componente che
            possiede il DOM da toccare</li>
          <li>leggere un signal dentro la callback la rende <strong>reattiva</strong>: si
            ri-esegue a ogni cambiamento, come <code>effect()</code>, ma dopo che il DOM è stato
            aggiornato</li>
          <li><code>viewChild.required('ref')</code> — per prendere il riferimento reale
            all'elemento (qui il <code>&lt;canvas&gt;</code>)</li>
          <li><code>host: &#123; '[attr.aria-label]': "'...'" &#125;</code> — binding sull'host
            element del componente stesso, definito nel decoratore invece che nel template</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>BarChart</code> riceve un array di numeri e li disegna come barre su un
          <code>&lt;canvas&gt;</code>. Il metodo <code>draw()</code> è già pronto: manca solo
          collegarlo al momento giusto.
        </p>

        <h3>Cosa devi fare — <code>bar-chart.ts</code></h3>
        <ol>
          <li>aggiungi <code>afterRenderEffect(() =&gt; this.draw(this.canvasRef().nativeElement, this.values()))</code>
            come inizializzatore di campo (o nel constructor)</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> al primo render il grafico mostra già le barre iniziali</li>
          <li><span class="hint">☐</span> cliccando "randomizza", le barre si ridisegnano da sole</li>
          <li><span class="hint">☐</span> nessun errore in console tipo "canvas is null" al primo render</li>
        </ul>

        <h3>Come provare</h3>
        <p><code>/ex19</code>: al caricamento vedi già delle barre; clicca "randomizza" più volte.</p>

        <h3>Trappole</h3>
        <ul>
          <li>se provi a disegnare sul canvas <strong>fuori</strong> da <code>afterRenderEffect</code>
            (es. nel constructor puro), <code>viewChild</code> potrebbe non essere ancora
            popolato: il DOM non esiste finché Angular non ha fatto il primo render</li>
          <li>dimenticare di leggere <code>this.values()</code> (chiamarla come funzione) dentro
            la callback: se non la leggi lì, l'effect non "vede" i cambiamenti e non si ri-esegue</li>
        </ul>
      </div>

      <div class="card">
        <app-bar-chart [values]="values()" />
        <button class="btn" (click)="randomize()">randomizza</button>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex19AfterrenderHostBindings {
  protected readonly values = signal([4, 8, 15, 16, 23]);

  protected randomize(): void {
    this.values.update((vs) => vs.map(() => Math.floor(Math.random() * 30) + 1));
  }
}
