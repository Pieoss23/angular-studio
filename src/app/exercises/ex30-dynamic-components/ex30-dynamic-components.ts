import { Component, inject } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';
import { ToastHost } from './toast-host';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-ex30-dynamic-components',
  imports: [ExerciseShell, ToastHost],
  template: `
    <app-exercise-shell n="30" topic="Componenti" folder="ex30-dynamic-components"
      title="Creazione dinamica di componenti: ViewContainerRef.createComponent()">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          <code>&#64;if</code>/<code>&#64;for</code> bastano quando sai già, dal template, cosa può
          comparire. Un servizio di notifiche ("toast"), invece, deve poter creare un componente
          <strong>su richiesta imperativa</strong> — da un service, non da un template — senza
          sapere in anticipo quanti ce ne saranno o quando. È il caso d'uso classico di
          <code>ViewContainerRef.createComponent()</code>: crei un'istanza di componente a runtime,
          la configuri via <code>setInput()</code>, e la distruggi quando hai finito.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>viewContainerRef.createComponent(Componente)</code> — crea e monta
            un'istanza, ritorna un <code>ComponentRef</code></li>
          <li><code>ref.setInput('nome', valore)</code> — l'unico modo corretto di impostare gli
            input di un componente creato così (assegnare <code>ref.instance.nome = valore</code>
            direttamente bypassa la reattività dei signal input)</li>
          <li><code>ref.instance</code> — l'istanza vera e propria della classe, da cui puoi anche
            sottoscrivere i suoi <code>output()</code> direttamente con <code>.subscribe(...)</code></li>
          <li><code>ref.destroy()</code> — rimuove il componente dal DOM e ne libera le risorse</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>ToastHost</code> (già pronto) è solo un punto di ancoraggio nel DOM: registra il
          proprio <code>ViewContainerRef</code> in <code>ToastService</code> al primo render.
          <code>ToastItem</code> (già pronto) è il componente da istanziare dinamicamente.
        </p>

        <h3>Cosa devi fare — <code>toast.service.ts</code></h3>
        <ol>
          <li>implementa <code>show(message, kind)</code> seguendo i passi nel commento TODO del
            file: crea il componente, imposta gli input, rimuovilo dopo 3s o al click su "chiudi"</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> cliccando i bottoni, appaiono toast impilati, ognuno col messaggio giusto</li>
          <li><span class="hint">☐</span> un toast sparisce da solo dopo 3 secondi</li>
          <li><span class="hint">☐</span> cliccando "chiudi" su un toast, sparisce subito (e non lascia un timer fantasma che tenta di distruggerlo di nuovo)</li>
          <li><span class="hint">☐</span> il toast "error" ha un bordo/icona diversi da quello "info"</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex30</code>: clicca più volte i due bottoni, prova a chiudere un toast a mano
          prima dei 3 secondi, lasciane scadere un altro da solo.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li><code>ref.instance.message = '...'</code> diretto non passa dal meccanismo
            dei signal input: usa sempre <code>ref.setInput(...)</code></li>
          <li>se non cancelli il <code>setTimeout</code> quando l'utente chiude manualmente, dopo
            3s scatterebbe comunque un <code>ref.destroy()</code> su un componente già distrutto</li>
          <li><code>ToastHost</code> va messo <strong>una sola volta</strong> nell'app (qui, in
            questa pagina): è il contenitore condiviso da cui spuntano tutti i toast</li>
        </ul>
      </div>

      <div class="card">
        <div class="row">
          <button class="btn" (click)="toasts.show('operazione completata')">toast info</button>
          <button class="btn" (click)="toasts.show('qualcosa è andato storto', 'error')">toast error</button>
        </div>
      </div>

      <app-toast-host />
    </app-exercise-shell>
  `,
})
export class Ex30DynamicComponents {
  protected readonly toasts = inject(ToastService);
}
