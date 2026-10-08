import { Component, input, linkedSignal, computed } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { CookTimePipe } from '../pipes/cook-time.pipe';

// TODO(M3.1): il resolver (recipe.resolver.ts) risolve la ricetta sotto la
// chiave "recipe" (vedi project-recipes.routes.ts: resolve: { recipe: ... }).
// Grazie a withComponentInputBinding() (già attivo in app.config.ts) quel
// valore arriva qui come input — basta chiamarlo esattamente "recipe".
@Component({
  selector: 'recipe-detail',
  imports: [CookTimePipe],
  template: `
    <!-- TODO(M3.2): mostra titolo, descrizione, immagine, categoria.
    TODO(M3.3): porzioni con linkedSignal (vedi la spiegazione data
    prima: parte da recipe().servings, resettabile dall'input, con
    +/- che chiamano un metodo di update). -->
  <div class="card">
    <img [src]="recipe().image" [alt]="recipe().title" style="max-width: 100%" />
      <h1>{{recipe().title}}</h1>
      <p>{{recipe().description}}</p>
      <div>{{recipe().cookTimeMinutes | cookTime}}</div>
      <button (click)="adjustServings(1)">+</button>
      <button (click)="adjustServings(-1)">-</button>
      <div>
      {servingCount(), plural, =0{nessuna porzione} =1{1 porzione} other{{{servingCount()}} porzioni}}
      </div>
      <div>{{recipe().category}}</div>
      <div class="tags-container">
        @for (tag of recipe().tags; track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>
      <p>Ingredienti: </p>
      <p>{ingredientCount(), plural, =0{nessun ingrediente} =1{{{ingredientCount()}} ingrediente} other{{{ingredientCount()}} ingredienti}}</p>
      <ol class="container">
        @for (ing of scaledIngredients(); track ing.name) {

          <li>{{ing.quantity}} {{ing.unit}} - {{ing.name}}</li>
        }
        </ol>
        <p>Passi per la ricetta</p>
              <ol class="container">
        @for (step of recipe().steps; track $index) {
          <li>{{step}}</li>
        }
        </ol>
    </div>
    `,
})
export class RecipeDetail {
  recipe = input.required<Recipe>();
  protected selectedServing = linkedSignal(() => this.recipe().servings)

  protected adjustServings(delta: number) {
    this.selectedServing.update((v) => Math.max(1, v + delta))
  }

  protected ingredientCount = computed(() => this.recipe().ingredients.length);
  protected servingCount = computed(() => this.selectedServing())

  protected scaledIngredients = computed(() => {
    const currentRecipe = this.recipe();
    const currentServings = this.selectedServing();

    // Calcoliamo il fattore di scala (es. 4 porzioni selezionate / 2 porzioni base = 2)
    const scaleFactor = currentServings / currentRecipe.servings;

    // Restituiamo una nuova lista di ingredienti con le quantità aggiornate
    return currentRecipe.ingredients.map(ing => ({
      ...ing,
      quantity: ing.quantity * scaleFactor
    }));
  });

}
