import { Component } from '@angular/core';

// Wrapper con content projection (stile ex11/card.ts). Tre slot:
// header, corpo (default) e azioni. Il consumer marca gli elementi con
// gli attributi [recipe-header] / [recipe-actions]; tutto il resto finisce
// nello slot di default.
@Component({
  selector: 'recipe-card-shell',
  template: `
    <article class="card">
      <header>
        <!-- TODO(M3.P1): ng-content select="[recipe-header]" -->
        <ng-content select="[recipe-header]"></ng-content>

      </header>

      <div class="body">
        <!-- TODO(M3.P2): ng-content di default (nessun select), raccoglie
            descrizione/metadati/tag/ingredienti/passi -->
            <ng-content></ng-content>
        </div>

      <footer>
        <!-- TODO(M3.P3): ng-content select="[recipe-actions]" -->
        <ng-content select = "[recipe-actions]"></ng-content>
      </footer>
    </article>
  `,
})
export class RecipeCardShell { }
