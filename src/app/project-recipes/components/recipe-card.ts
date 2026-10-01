import { Component, inject, input } from "@angular/core";
import { Recipe } from "../models/recipe.model";
import { CookTimePipe } from "../pipes/cook-time.pipe";
import { HighlightMatchDirective } from "../directives/highlight-match.directive";
import { RecipeStore } from "../store/recipe-store";

@Component({
  selector: 'recipe-card',
  imports: [CookTimePipe, HighlightMatchDirective],
  styles: [`
    .recipe-details {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .fav-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #65676b;
      transition: transform 0.2s ease;
    }
    .fav-btn:active {
      transform: scale(1.2);
    }
    .fav-btn svg {
      width: 24px;
      height: 24px;
      transition: fill 0.2s ease, stroke 0.2s ease;
    }
    /* Classe applicata reattivamente quando lo store conferma il preferito */
    .fav-btn.is-favorite {
      color: #e0245e;
    }
    .fav-btn.is-favorite svg {
      fill: #e0245e;
    }
  `],
  template: `
    <div class="card">
      <!-- Immagine con binding ai dati della ricetta -->
      <img [src]="recipe().image" [alt]="recipe().title" style="max-width: 100%;" />

      <!-- Titolo -->
      <h2 [appHighlightMatch]="recipe().title" [term]="searchTerm()"></h2>

      <!-- Descrizione -->
      <p class="hint">{{ recipe().description }}</p>

      <!-- Tempo di cottura e porzioni -->
      <div class="recipe-details">
        <span>⏱️ {{ recipe().cookTimeMinutes | cookTime }}   </span>
        <span>🍽️ {{ recipe().servings }} porzioni</span>

        <!-- Pulsante Cuore - Corretto con lettura dallo Store -->
        <button
          class="fav-btn"
          [class.is-favorite]="recipeStore.isFavorite(recipe().id)"
          (click)="toggleFavorite()"
          [attr.aria-label]="recipeStore.isFavorite(recipe().id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <!-- Ciclo dei Tag -->
      <div class="tags-container">
        @for (tag of recipe().tags; track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>

    </div>
  `
})
export class RecipeCard {
  protected readonly recipeStore = inject(RecipeStore);
  recipe = input.required<Recipe>();
  searchTerm = input('')

  toggleFavorite(): void {
    this.recipeStore.toggleFavorite(this.recipe().id);
  }
}
