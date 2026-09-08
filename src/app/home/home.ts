import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXERCISES } from '../exercises/catalog';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>Angular Studio — 10 esercizi</h1>
    <p class="hint">
      Angular 21 · standalone · zoneless · signals. Ogni esercizio ha una consegna
      (<code>README.md</code> nella cartella) e del codice con <code>TODO</code> da completare
      manualmente. Quando hai finito un esercizio, dimmelo: lo valuto e ti scrivo un report
      in <code>REPORT/</code> con "cosa ho imparato".
    </p>

    <div class="card">
      <strong>Comandi</strong>
      <pre>npm start      # dev server su http://localhost:4200
npm run build  # verifica che tutto compili</pre>
    </div>

    @for (ex of exercises; track ex.id) {
      <a class="card ex" [routerLink]="'/' + ex.id">
        <div class="row">
          <span class="tag">#{{ ex.n }}</span>
          <span class="tag">{{ ex.topic }}</span>
          @if (ex.done) { <span class="tag" style="color: var(--ok); border-color: var(--ok)">✅ completato</span> }
        </div>
        <h3>{{ ex.title }}</h3>
        <p class="hint">{{ ex.summary }}</p>
      </a>
    }
  `,
  styles: `
    h1 { font-size: 26px; }
    .ex { display: block; color: var(--text); }
    .ex:hover { border-color: var(--accent-2); }
    .ex h3 { margin: 8px 0 4px; }
  `,
})
export class Home {
  protected readonly exercises = EXERCISES;
}
