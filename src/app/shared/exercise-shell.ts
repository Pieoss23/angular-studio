import { booleanAttribute, Component, input, signal } from '@angular/core';

type Tab = 'esercizio' | 'consegna' | 'imparato';

@Component({
  selector: 'app-exercise-shell',
  template: `
    <header class="ex-head">
      <div class="row">
        <span class="tag">Esercizio {{ n() }}</span>
        <span class="tag">{{ topic() }}</span>
        @if (completed()) { <span class="tag done">✅ completato</span> }
      </div>
      <h1>{{ title() }}</h1>
    </header>

    <nav class="tabs">
      <button class="tab" [class.on]="tab() === 'esercizio'" (click)="tab.set('esercizio')">
        Esercizio
      </button>
      <button class="tab" [class.on]="tab() === 'consegna'" (click)="tab.set('consegna')">
        Consegna
      </button>
      @if (completed()) {
        <button class="tab" [class.on]="tab() === 'imparato'" (click)="tab.set('imparato')">
          Cosa ho imparato
        </button>
      }
    </nav>

    <section [hidden]="tab() !== 'esercizio'">
      <ng-content />
    </section>

    <section [hidden]="tab() !== 'consegna'" class="prose">
      <ng-content select="[consegna]" />
    </section>

    @if (completed()) {
      <section [hidden]="tab() !== 'imparato'" class="prose">
        <ng-content select="[imparato]" />
      </section>
    }
  `,
  styles: `
    .ex-head { margin-bottom: 10px; }
    h1 { margin: 10px 0 6px; font-size: 24px; }
    .tag.done { color: var(--ok); border-color: var(--ok); }

    .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
    .tab {
      background: none; border: none; color: var(--muted);
      padding: 9px 14px; cursor: pointer; font: inherit;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .tab:hover { color: var(--text); }
    .tab.on { color: var(--text); border-bottom-color: var(--accent); }

    .prose { max-width: 70ch; line-height: 1.65; }
    .prose h3 { margin: 18px 0 6px; }
    .prose ul { padding-left: 20px; }
    .prose li { margin: 4px 0; }
    .prose .checklist { list-style: none; padding-left: 0; }
    .prose .checklist li { display: flex; gap: 8px; align-items: baseline; }
    .prose code {
      background: var(--panel-2); border: 1px solid var(--border);
      border-radius: 4px; padding: 1px 5px; font-size: 13px;
    }
  `,
})
export class ExerciseShell {
  readonly n = input.required<string>();
  readonly title = input.required<string>();
  readonly topic = input.required<string>();
  readonly folder = input.required<string>();
  readonly completed = input(false, { transform: booleanAttribute });

  protected readonly tab = signal<Tab>('esercizio');
}
