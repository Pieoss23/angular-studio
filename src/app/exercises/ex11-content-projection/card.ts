import { Component, contentChild } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <article class="card-box">
      <header class="card-head">
        <!--
          TODO(11.1): proietta qui SOLO il contenuto marcato con l'attributo
          [card-title]
          -->
          <ng-content select="[card-title]" />
        @if (!titleRef()) {
          <span class="hint">(nessun titolo)</span>
        }
      </header>

      <div class="card-body">
        <!-- slot di default: tutto ciò che non ha un select dedicato finisce qui -->
        <ng-content />
      </div>

      <footer class="card-foot">
        <!--
          TODO(11.2): proietta qui SOLO il contenuto marcato con l'attributo
          [card-actions]
          -->
          <ng-content select="[card-actions]" />
      </footer>
    </article>
  `,
  styles: `
    .card-box {
      border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
      display: flex; flex-direction: column; background: var(--panel);
    }
    .card-head {
      padding: 10px 14px; border-bottom: 1px solid var(--border);
      font-weight: 600; min-height: 20px;
    }
    .card-body { padding: 14px; flex: 1; }
    .card-foot {
      padding: 10px 14px; border-top: 1px solid var(--border);
      display: flex; gap: 8px; justify-content: flex-end; min-height: 20px;
    }
  `,
})
export class Card {
  // TODO(11.3 - bonus): usa contentChild('cardTitle') per rilevare se il
  // consumer ha proiettato un titolo (serve una template reference #cardTitle
  // sull'elemento proiettato lato consumer) e nascondere l'hint solo quando
  // il titolo è davvero presente.
  protected readonly titleRef = contentChild<unknown>('cardTitle');
}
