import { Component, input } from '@angular/core';
import { Recipe } from '../models/recipe.model';

// TODO(M3.1): il resolver (recipe.resolver.ts) risolve la ricetta sotto la
// chiave "recipe" (vedi project-recipes.routes.ts: resolve: { recipe: ... }).
// Grazie a withComponentInputBinding() (già attivo in app.config.ts) quel
// valore arriva qui come input — basta chiamarlo esattamente "recipe".
@Component({
  selector: 'recipe-detail',
  template: `
    <!-- TODO(M3.2): mostra titolo, descrizione, immagine, categoria.
         TODO(M3.3): porzioni con linkedSignal (vedi la spiegazione data
         prima: parte da recipe().servings, resettabile dall'input, con
         +/- che chiamano un metodo di update). -->
  `,
})
export class RecipeDetail {
  recipe = input.required<Recipe>();
}
