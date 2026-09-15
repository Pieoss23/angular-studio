import { Component, signal } from '@angular/core';
import { ExerciseShell } from '../../shared/exercise-shell';

interface Toast {
  id: number;
  text: string;
}

let nextId = 1;

@Component({
  selector: 'app-ex16-native-animations',
  imports: [ExerciseShell],
  template: `
    <app-exercise-shell n="16" topic="Template" folder="ex16-native-animations" completed
      title="Animazioni native: animate.enter / animate.leave">

      <div imparato>
        <h3>Esito: ✅ completato — 3/3</h3>
        <ul>
          <li><code>animate.enter</code>/<code>animate.leave</code> applicano classi CSS quando un
            elemento compare/sta per sparire dal DOM, senza nessun modulo da importare — funziona
            anche in un'app zoneless.</li>
          <li>Angular aspetta la fine dell'<code>animation</code>/<code>transition</code> CSS
            collegata alla classe di <code>animate.leave</code> prima di rimuovere davvero il
            nodo: verificabile in DevTools, il <code>&lt;li&gt;</code> resta nel DOM con la classe
            <code>toast-out</code> per tutta la durata dei 250ms.</li>
          <li>senza <code>@keyframes</code>/<code>animation</code> collegata, la classe non ha
            nulla da far aspettare ad Angular e il nodo sparirebbe di scatto.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Angular non richiede più <code>@angular/animations</code> per i casi comuni: gli
          attributi <code>animate.enter</code> e <code>animate.leave</code> applicano classi CSS
          quando un elemento entra o esce dal DOM (tipicamente dentro <code>&#64;if</code>/<code>&#64;for</code>),
          e Angular aspetta che la transizione/animazione CSS finisca prima di rimuovere
          davvero l'elemento.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>animate.enter="classe"</code> — la classe viene applicata quando l'elemento
            compare; Angular la rimuove da solo a fine animazione</li>
          <li><code>animate.leave="classe"</code> — la classe viene applicata quando l'elemento
            dovrebbe sparire; Angular rimuove il nodo dal DOM solo dopo che
            l'animazione/transizione più lunga è finita</li>
          <li>la classe deve definire una <code>@keyframes</code> animation o una
            <code>transition</code> CSS: senza CSS che la usa, non succede nulla</li>
          <li>più classi: <code>animate.enter="fade-in slide-in"</code></li>
          <li>nessun modulo da importare: funziona out-of-the-box, anche zoneless</li>
        </ul>

        <h3>Scenario</h3>
        <p>Una lista di notifiche (toast): aggiungine una col bottone, rimuovile con la ✕.</p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li>sul <code>&lt;li&gt;</code> nel <code>&#64;for</code>, aggiungi
            <code>animate.enter="toast-in"</code> e <code>animate.leave="toast-out"</code></li>
          <li>negli <code>styles</code>, completa le due <code>@keyframes</code>
            (<code>toast-in</code>: da opacity 0 / traslato a destra, a normale;
            <code>toast-out</code>: il contrario) e collega le classi
            <code>.toast-in</code>/<code>.toast-out</code> con <code>animation: ... 250ms ease</code></li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> un nuovo toast entra con un'animazione visibile, non compare di scatto</li>
          <li><span class="hint">☐</span> un toast rimosso esce con un'animazione, non sparisce di scatto</li>
          <li><span class="hint">☐</span> il toast resta davvero nel DOM finché l'animazione di uscita non finisce</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex16</code>: clicca "aggiungi" più volte, poi clicca ✕ su un toast. Con
          DevTools → Elements puoi vedere la classe <code>toast-out</code> comparire e il
          <code>&lt;li&gt;</code> restare nel DOM per la durata dell'animazione.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>se la classe CSS non ha nessuna <code>animation</code>/<code>transition</code>,
            Angular non ha nulla da aspettare e rimuove il nodo subito</li>
          <li>usa <code>track id</code> nel <code>&#64;for</code>: senza un <code>track</code> stabile
            Angular può ricreare elementi invece di animarli in place</li>
        </ul>
      </div>

      <div class="card">
        <button class="btn" (click)="addToast()">aggiungi notifica</button>

        <ul style="list-style: none; padding: 0; display: grid; gap: 8px; margin-top: 12px;">
          <!-- TODO(16.1): aggiungi animate.enter="toast-in" animate.leave="toast-out" al li -->
          @for (t of toasts(); track t.id) {
            <li
              animate.enter= "toast-in"
              animate.leave= "toast-out"
              class="card"
              style="display: flex; justify-content: space-between; align-items: center;"
            >
              <span>{{ t.text }}</span>
              <button class="btn" (click)="remove(t.id)">✕</button>
            </li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
  styles: `
    /* TODO(16.2): definisci le due animazioni e collegale alle classi */

    @keyframes toast-in {
      from { opacity: 0; transform: translateX(24px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-out {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(24px); }
    }
    .toast-in { animation: toast-in 250ms ease; }
    .toast-out { animation: toast-out 250ms ease; }
  `,
})
export class Ex16NativeAnimations {
  protected readonly toasts = signal<Toast[]>([]);

  protected addToast(): void {
    this.toasts.update((list) => [...list, { id: nextId++, text: `notifica #${nextId - 1}` }]);
  }

  protected remove(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
