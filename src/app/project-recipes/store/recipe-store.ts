import { Injectable, computed, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { MOCK_RECIPES } from '../data/mock-recipes';

@Injectable({ providedIn: 'root' })

export class RecipeStore {
  private readonly _recipes = signal<Recipe[]>(MOCK_RECIPES);
  private readonly _favorites = signal<string[]>([]);

  readonly recipes = this._recipes.asReadonly();
  readonly favorites = this._favorites.asReadonly();

  readonly onlyFavoritesRecipes = computed(() => {
    const favIds = this._favorites();
    return this._recipes().filter((recipe) => favIds.includes(recipe.id))
  });

  isFavorite(id: string): boolean {
    return this._favorites().includes(id)
  }

  toggleFavorite(id: string): void {
    const currentFavs = this._favorites();
    const exist = currentFavs.includes(id);

    if (exist) {
      this._favorites.set(currentFavs.filter((favId) => favId !== id))
    } else {
      this._favorites.set([...currentFavs, id])
    }
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): void {
    const id = crypto.randomUUID();
    this._recipes.set([...this._recipes(), { ...recipe, id }])
  }

}
