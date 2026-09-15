import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { HighlightDirective } from './highlight.directive';
import { FancyButton } from './fancy-button';

@Component({
  selector: 'app-ex13-custom-directives',
  imports: [ExerciseShell, HighlightDirective, FancyButton],
  template: `
    <app-exercise-shell n="13" topic="Componenti" folder="ex13-custom-directives" completed
      title="Direttive custom + Directive Composition API">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4</h3>
        <ul>
          <li>l'oggetto <code>host</code> nel decoratore sostituisce
            <code>&#64;HostBinding</code>/<code>&#64;HostListener</code>: eventi tra parentesi
            (<code>'(mouseenter)': 'onEnter()'</code>), proprietà tra quadre
            (<code>'[style.background-color]': 'bg()'</code>) — entrambi valutano espressioni
            sull'istanza della direttiva.</li>
          <li>i membri referenziati in <code>host</code> devono essere <code>protected</code> o
            <code>public</code>: <code>onEnter()</code>, <code>onLeave()</code> e <code>bg()</code>
            sono tutti <code>protected</code>, mentre lo stato interno (<code>hovering</code>) resta
            <code>private</code>, letto solo dentro <code>bg()</code>.</li>
          <li><code>hostDirectives: [Direttiva, &#123; directive: Altra, inputs: [...] &#125;]</code>
            applica le direttive all'host di <code>FancyButton</code> (il tag
            <code>&lt;app-fancy-button&gt;</code>): il consumer ottiene hover + focus ring senza
            scrivere <code>[appHighlight]</code>/<code>[appFocusRing]</code> nel proprio template,
            e con <code>inputs: ['appHighlight']</code> può comunque personalizzare il colore.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Una <strong>direttiva attributo</strong> aggiunge comportamento a un elemento esistente
          senza introdurre un nuovo tag. Nello stile moderno di Angular gli host binding/listener
          non usano più i decoratori <code>&#64;HostBinding</code>/<code>&#64;HostListener</code>,
          ma l'oggetto <code>host</code> nel decoratore <code>&#64;Directive</code>/<code>&#64;Component</code>.
        </p>
        <p>
          La <strong>Directive Composition API</strong> (<code>hostDirectives</code>) permette a un
          componente di "includere" altre direttive sul proprio host element, così i suoi consumer
          ottengono quel comportamento gratis, senza doverlo applicare esplicitamente.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>host: &#123; '(mouseenter)': 'metodo()', '[style.x]': 'espressione()' &#125;</code></li>
          <li>i binding nell'oggetto <code>host</code> devono referenziare membri
            <strong>protected</strong> o <code>public</code> della classe (non <code>private</code>)</li>
          <li>in un'app <strong>zoneless</strong> un campo mutabile normale non aggiorna la UI:
            serve un <code>signal</code></li>
          <li><code>hostDirectives: [Direttiva, &#123; directive: Altra, inputs: [...] &#125;]</code>
            nel decoratore di un componente</li>
          <li>con <code>inputs: ['appHighlight: highlightColor']</code> l'input della direttiva
            composta diventa un input pubblico del componente ospitante, <strong>rinominato</strong>
            per evitare collisioni col selettore <code>[appHighlight]</code> quando la stessa
            direttiva è importata anche altrove nello stesso template</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>HighlightDirective</code> (<code>[appHighlight]</code>) evidenzia lo sfondo al
          passaggio del mouse. <code>FocusRingDirective</code> (già completa) aggiunge un outline al
          focus. <code>FancyButton</code> deve comporre entrambe sul proprio host, così chi usa
          <code>&lt;app-fancy-button&gt;</code> le ottiene senza scriverle.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>highlight.directive.ts</code>: aggiungi l'oggetto <code>host</code> con
            <code>(mouseenter)</code>, <code>(mouseleave)</code> e
            <code>[style.background-color]</code></li>
          <li><code>fancy-button.ts</code>: aggiungi <code>hostDirectives</code> con
            <code>HighlightDirective</code> (esponendo l'input come
            <code>appHighlight: highlightColor</code>) e <code>FocusRingDirective</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> il box con <code>appHighlight</code> cambia sfondo al hover</li>
          <li><span class="hint">☐</span> <code>FancyButton</code> cambia sfondo al hover (via hostDirectives)</li>
          <li><span class="hint">☐</span> <code>FancyButton</code> mostra l'outline al focus (tab da tastiera)</li>
          <li><span class="hint">☐</span> l'input <code>highlightColor</code> passato a <code>app-fancy-button</code> cambia il colore</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex13</code>: passa il mouse sul box e sul bottone (sfondo giallo/verde), poi usa
          Tab per portare il focus sul bottone (deve comparire l'outline).
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>gli host binding non trovano i membri <code>private</code>: usa <code>protected</code></li>
          <li><code>hostDirectives</code> applica le direttive all'host del componente
            (<code>&lt;app-fancy-button&gt;</code>), non a un elemento interno del suo template</li>
          <li>senza <code>inputs: [...]</code> l'input della direttiva composta resta "privato":
            il consumer del componente non può impostarlo</li>
          <li>se rinomini l'input con <code>'nomeOriginale: alias'</code> ma poi nel template usi
            ancora il nome originale (<code>appHighlight</code> invece di
            <code>highlightColor</code>), <strong>e</strong> quella direttiva è anche importata
            direttamente nel template esterno, ottieni <code>NG0309</code>: la direttiva matcha
            due volte sullo stesso host (una volta per il selettore diretto, una per
            <code>hostDirectives</code>)</li>
        </ul>
      </div>

      <div class="card" appHighlight="#c8f7c5" style="padding: 20px; text-align: center;">
        box con [appHighlight] diretto — passaci sopra
      </div>

      <div class="card" style="text-align: center;">
        <app-fancy-button highlightColor="#8fd9ff">bottone composto (hover + focus)</app-fancy-button>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex13CustomDirectives {}
