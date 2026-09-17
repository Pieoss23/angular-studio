import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { UnlessDirective } from './unless.directive';
import { RepeatDirective } from './repeat.directive';

@Component({
  selector: 'app-ex22-structural-directives',
  imports: [ExerciseShell, UnlessDirective, RepeatDirective],
  template: `
    <app-exercise-shell n="22" topic="Componenti" folder="ex22-structural-directives" completed
      title="Direttiva strutturale custom: TemplateRef + ViewContainerRef">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (bonus incluso)</h3>
        <ul>
          <li><code>UnlessDirective</code>: un flag <code>hasView</code> locale (fuori dal signal)
            evita di ricreare/rimuovere la vista quando lo stato "creata/non creata" non è
            davvero cambiato — l'effect si esegue ad ogni cambio di <code>appUnless()</code>, ma
            agisce sul DOM solo nei due casi di transizione reali.</li>
          <li><code>RepeatDirective</code> (bonus): <code>clear()</code> seguito da un ciclo di
            <code>createEmbeddedView(templateRef, &#123; $implicit: i, index: i &#125;)</code> —
            ricostruisce tutte le viste ad ogni cambio di <code>count()</code>, passando un
            context diverso a ciascuna.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>&#64;if</code>/<code>&#64;for</code> hanno sostituito <code>*ngIf</code>/<code>*ngFor</code>
          per il 99% dei casi, ma capire come funziona una <strong>direttiva strutturale</strong>
          (la sintassi <code>*direttiva</code>) resta utile: sotto il cofano, il contenuto marcato
          con <code>*appUnless</code> viene tolto dal template e trasformato in un
          <code>&lt;ng-template&gt;</code>. La direttiva riceve quel template
          (<code>TemplateRef</code>) e decide <strong>quando e quante volte</strong> istanziarlo
          in un punto del DOM (<code>ViewContainerRef</code>).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>*appUnless="expr"</code> è zucchero sintattico per
            <code>&lt;ng-template [appUnless]="expr"&gt;...&lt;/ng-template&gt;</code></li>
          <li><code>TemplateRef</code> — il "timbro" del contenuto da istanziare, iniettato nel
            constructor della direttiva</li>
          <li><code>ViewContainerRef</code> — il punto nel DOM dove inserire/rimuovere le viste;
            <code>createEmbeddedView(tpl)</code> la crea, <code>clear()</code> la rimuove</li>
          <li>un <strong>context object</strong> passato a <code>createEmbeddedView(tpl, ctx)</code>
            espone variabili al template: <code>$implicit</code> è quella senza nome
            (<code>let x</code>), le altre si leggono con <code>let i = index</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>UnlessDirective</code> (<code>*appUnless</code>) è il contrario di
          <code>*ngIf</code>. <code>RepeatDirective</code> (<code>*appRepeat</code>, bonus) ripete
          il template n volte con un indice.
        </p>

        <h3>Cosa devi fare — <code>unless.directive.ts</code></h3>
        <ol>
          <li>nel constructor, dentro un <code>effect()</code>: se <code>appUnless()</code> è
            falsy e la vista non c'è ancora, creala con <code>createEmbeddedView</code>; se è
            truthy e la vista c'è, rimuovila con <code>clear()</code></li>
        </ol>

        <h3>Cosa devi fare — <code>repeat.directive.ts</code> (bonus)</h3>
        <ol>
          <li>dentro l'effect già presente (dopo il <code>clear()</code>), un ciclo
            <code>for</code> da 0 a <code>count - 1</code> che chiama
            <code>createEmbeddedView(this.templateRef, &#123; $implicit: i, index: i &#125;)</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> con <code>loggedOut()</code> a <code>false</code>, il messaggio "sei loggato" è visibile</li>
          <li><span class="hint">☐</span> attivando "logout" il messaggio sparisce dal DOM (non solo nascosto via CSS)</li>
          <li><span class="hint">☐</span> riattivando "login" il messaggio ricompare</li>
          <li><span class="hint">☐</span> bonus: <code>*appRepeat="5; let i = index"</code> genera 5 righe numerate 0-4</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex22</code>: clicca login/logout e osserva il messaggio. In DevTools → Elements,
          verifica che quando è "nascosto" l'elemento non è proprio nel DOM (sostituito da un
          commento <code>&lt;!--container--&gt;</code>).
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>ricreare la vista ad ogni esecuzione dell'effect (senza controllare
            <code>hasView</code>) funziona ma è sprecato: la ricrei anche quando il valore booleano
            non è cambiato di stato "creata/non creata"</li>
          <li><code>createEmbeddedView</code> senza un context object va bene solo se il template
            non usa <code>let</code>: <code>*appRepeat</code> ne ha bisogno per esporre l'indice</li>
        </ul>
      </div>

      <div class="card">
        <div class="row">
          <button class="btn" (click)="loggedOut.set(false)">login</button>
          <button class="btn" (click)="loggedOut.set(true)">logout</button>
        </div>
        <p *appUnless="loggedOut()">✅ sei loggato</p>
        <p *appUnless="!loggedOut()" class="hint">— sei disconnesso —</p>
      </div>

      <div class="card">
        <p class="hint">bonus — *appRepeat:</p>
        <ul>
          <li *appRepeat="5; let i = index">riga numero {{ i }}</li>
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex22StructuralDirectives {
  protected readonly loggedOut = signal(false);
}
