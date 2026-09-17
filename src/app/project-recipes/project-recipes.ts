import { Component, signal } from '@angular/core';

interface Milestone {
  id: string;
  title: string;
  summary: string;
  techniques: string[];
  done: boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm0',
    title: 'M0 — Setup e modello dati',
    summary: 'Struttura cartelle, interfaccia Recipe, dati mock, rotta lista vuota che compila.',
    techniques: ['routing base', 'signal per lo stato lista'],
    done: false,
  },
  {
    id: 'm1',
    title: 'M1 — Lista e ricerca',
    summary: 'Griglia ricette, ricerca testuale con debounce, pipe custom, direttiva highlight sui match.',
    techniques: ['signals', '@for/@if', 'RxJS interop', 'pipe custom', 'direttiva custom'],
    done: false,
  },
  {
    id: 'm2',
    title: 'M2 — Store centralizzato',
    summary: 'RecipeStore iniettabile con signal privati e computed selector (preferiti, filtrate); porzioni con linkedSignal.',
    techniques: ['signal store', 'linkedSignal', 'signal avanzati'],
    done: false,
  },
  {
    id: 'm3',
    title: 'M3 — Dettaglio ricetta',
    summary: 'Rotta /progetto/ricette/:id con resolver, componente Card con content projection, ICU per porzioni/ingredienti.',
    techniques: ['router resolver', 'content projection', 'ICU', 'title strategy'],
    done: false,
  },
  {
    id: 'm4',
    title: 'M4 — Form di creazione/modifica',
    summary: 'Form tipizzato con validatori custom e FormArray per ingredienti dinamici.',
    techniques: ['reactive forms', 'validatori custom'],
    done: false,
  },
  {
    id: 'm5',
    title: 'M5 — Dati remoti',
    summary: 'Sezione "Scopri" con httpResource su API pubblica, retry/catchError, dietro @defer.',
    techniques: ['httpResource', 'error handling', '@defer'],
    done: false,
  },
  {
    id: 'm6',
    title: 'M6 — Area personale protetta',
    summary: '"Le mie ricette" dietro guard, interceptor, provider d\'ambiente per preferenze utente.',
    techniques: ['guard', 'interceptor', 'environment providers', 'DI'],
    done: false,
  },
  {
    id: 'm7',
    title: 'M7 — Rifiniture UX',
    summary: 'Animazioni enter/leave, NgOptimizedImage, toast di conferma creati dinamicamente.',
    techniques: ['animate.enter/leave', 'NgOptimizedImage', 'dynamic components'],
    done: false,
  },
  {
    id: 'm8',
    title: 'M8 — Qualità',
    summary: 'Test unitari sul RecipeStore, preloading strategy selettiva sulla sezione personale.',
    techniques: ['testing', 'preloading strategy'],
    done: false,
  },
];

@Component({
  selector: 'app-project-recipes',
  template: `
    <header class="ex-head">
      <div class="row">
        <span class="tag">Progetto finale</span>
        <span class="tag">🍳 Libreria ricette</span>
      </div>
      <h1>Progetto: Libreria ricette</h1>
      <p class="hint">
        Consegna completa in <code>src/app/project-recipes/README.md</code>. Qui sotto la
        roadmap a milestone — lavori tu in autonomia, dimmi quando finisci una milestone e la
        rivedo com'è successo per i 30 esercizi.
      </p>
    </header>

    <div class="card">
      <h3>Come lavoriamo</h3>
      <ol>
        <li>Leggi la milestone corrente nel README (obiettivo, tecniche coinvolte, suggerimenti).</li>
        <li>Costruisci in autonomia. Chiedimi aiuto puntuale su un passaggio critico quando vuoi,
          non serve aspettare di essere bloccato.</li>
        <li>Quando pensi di aver finito una milestone, scrivimi "ho finito M&lt;n&gt;" — la
          controllo, ti do feedback, e se è a posto la segno completata qui.</li>
      </ol>
    </div>

    @for (m of milestones(); track m.id) {
      <div class="card" [style.border-color]="m.done ? 'var(--ok)' : 'var(--border)'">
        <div class="row">
          <strong>{{ m.title }}</strong>
          @if (m.done) { <span class="tag" style="color: var(--ok); border-color: var(--ok)">✅ completata</span> }
        </div>
        <p class="hint">{{ m.summary }}</p>
        <div class="row">
          @for (t of m.techniques; track t) {
            <span class="tag">{{ t }}</span>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .ex-head { margin-bottom: 10px; }
    h1 { margin: 10px 0 6px; font-size: 26px; }
  `,
})
export class ProjectRecipes {
  protected readonly milestones = signal(MILESTONES);
}
