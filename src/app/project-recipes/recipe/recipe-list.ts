import { Component, computed, inject, signal } from '@angular/core';
import { RecipeCard } from '../components/recipe-card';
import { RecipeStore } from '../store/recipe-store';


@Component({
  imports: [RecipeCard],
  selector: 'recipe-list',
  template: `<input (input)="updateSearch($event)" placeholder="Ricerca ricetta o per tag.." />
    @for (recipe of filteredRecipes(); track recipe.id) {
  <recipe-card [recipe]="recipe" [searchTerm]="query()"> </recipe-card>
} @empty {
  <p>Non ci sono ricette</p>
}`,
})
export class RecipeList {
  protected readonly recipeStore = inject(RecipeStore);

  protected readonly query = signal('');
  protected filteredRecipes = computed(() => {
    const q = this.query().toLowerCase();
    return this.recipeStore.recipes().filter(i => i.title.toLowerCase().includes(q)
    || i.tags.some(tag => tag.toLowerCase().includes(q)))
  })
  protected updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }
}
