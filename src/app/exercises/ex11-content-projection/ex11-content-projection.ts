import { Component } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { Card } from './card';

@Component({
  selector: 'app-ex11-content-projection',
  imports: [ExerciseShell, Card],
  template: `
    <app-exercise-shell n="11" topic="Componenti" folder="ex11-content-projection" completed
      title="Content projection avanzata: ng-content, select, ngProjectAs">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (bonus incluso)</h3>
        <ul>
          <li><code>&lt;ng-content select="[attr]" /&gt;</code> smista solo gli elementi
            <strong>diretti</strong> del consumer che portano quell'attributo; il resto finisce
            nello slot di default (<code>&lt;ng-content /&gt;</code> senza select).</li>
          <li><code>ngProjectAs="[card-title]"</code> forza il matching su un elemento (qui un
            <code>&lt;h2&gt;</code>) che non porta nativamente l'attributo richiesto, senza
            toccare il DOM reale.</li>
          <li>bonus: <code>contentChild('cardTitle')</code> rileva la presenza di un titolo
            proiettato via template reference (<code>#cardTitle</code>) — serve lo stesso
            <code>#cardTitle</code> sia sullo <code>&lt;span card-title&gt;</code> che
            sull'<code>&lt;h2&gt;</code> con <code>ngProjectAs</code>, altrimenti l'hint resta
            visibile anche con un titolo presente.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>&lt;ng-content /&gt;</code> proietta il markup scritto dal consumer dentro il
          template del componente. Con <code>select</code> puoi creare <strong>più slot</strong>:
          Angular smista il contenuto proiettato in base a un selettore CSS (tag, <code>[attr]</code>,
          <code>.classe</code>) applicato agli elementi <em>top-level</em> passati dal consumer.
        </p>
        <p>
          <code>ngProjectAs</code> serve quando l'elemento che vuoi proiettare in uno slot non porta
          già l'attributo/tag richiesto dal <code>select</code> (es. vuoi che un semplice
          <code>&lt;h2&gt;</code> finisca nello slot <code>[card-title]</code>): lo aggiungi come
          direttiva sull'elemento, non cambia il DOM finale, dice solo ad Angular "trattami come se
          avessi questo selettore".
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>&lt;ng-content /&gt;</code> senza select = slot di default (raccoglie il resto)</li>
          <li><code>&lt;ng-content select="[card-title]" /&gt;</code> = slot dedicato</li>
          <li><code>ngProjectAs="[card-title]"</code> su un elemento che non ha quell'attributo</li>
          <li>l'ordine degli <code>&lt;ng-content&gt;</code> nel template del componente decide
            dove finisce il contenuto, <strong>non</strong> l'ordine nel markup del consumer</li>
          <li>uno slot senza contenuto proiettato resta semplicemente vuoto</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>Card</code> (in <code>card.ts</code>) è un contenitore riusabile con tre zone:
          titolo, corpo (default), azioni. Va completato in <code>card.ts</code>.
        </p>

        <h3>Cosa devi fare — <code>card.ts</code></h3>
        <ol>
          <li>slot titolo: <code>&lt;ng-content select="[card-title]" /&gt;</code> dentro
            <code>.card-head</code></li>
          <li>slot azioni: <code>&lt;ng-content select="[card-actions]" /&gt;</code> dentro
            <code>.card-foot</code></li>
          <li><strong>bonus</strong>: la <code>contentChild('cardTitle')</code> già presente rileva
            se è stato proiettato un titolo con <code>#cardTitle</code>; usala per mostrare l'hint
            solo quando manca davvero</li>
        </ol>

        <h3>Cosa devi fare — questo file</h3>
        <p>
          Nella seconda card qui sotto, il titolo è un <code>&lt;h2&gt;</code> semplice: aggiungigli
          <code>ngProjectAs="[card-title]"</code> (e <code>#cardTitle</code> per il bonus) così viene
          instradato nello slot titolo anche senza l'attributo <code>card-title</code>.
        </p>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> tre zone (titolo/corpo/azioni) rese correttamente nella prima card</li>
          <li><span class="hint">☐</span> il corpo (slot default) contiene tutto ciò che non ha un attributo dedicato</li>
          <li><span class="hint">☐</span> <code>ngProjectAs</code> usato nella seconda card per il titolo</li>
          <li><span class="hint">☐</span> nessun contenuto proiettato "sparisce" o finisce nello slot sbagliato</li>
        </ul>

        <h3>Trappole</h3>
        <ul>
          <li><code>select</code> guarda solo gli elementi <strong>diretti</strong> passati dal
            consumer, non li cerca in profondità</li>
          <li>un elemento può finire in un solo slot: il primo <code>&lt;ng-content&gt;</code> il
            cui selettore combacia, nell'ordine in cui appaiono nel template</li>
        </ul>
      </div>

      <div class="card">
        <app-card>
          <span card-title #cardTitle>Prima card</span>
          <p>Questo testo finisce nello slot di default (il body).</p>
          <button card-actions class="btn">azione</button>
        </app-card>
      </div>

      <div class="card" >
        <app-card>
          <!-- TODO: aggiungi ngProjectAs="[card-title]" (e #cardTitle) a questo h2 -->
          <h2 ngProjectAs="[card-title]" #cardTitle>Seconda card (via ngProjectAs)</h2>
          <p>Anche questa va nel body, come sopra.</p>
          <button card-actions class="btn">salva</button>
          <button card-actions class="btn">annulla</button>
        </app-card>
      </div>

      <div class="card">
        <app-card>
          <p>Terza card: nessun titolo proiettato, nessuna azione.</p>
        </app-card>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex11ContentProjection {}
