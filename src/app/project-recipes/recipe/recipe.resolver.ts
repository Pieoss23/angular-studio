import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { RecipeStore } from '../store/recipe-store';

// Sincrono: RecipeStore tiene già tutto in memoria, non c'è nessuna chiamata
// remota da attendere, quindi non serve Observable/switchMap come in ex18.
export const recipeResolver: ResolveFn<Recipe | undefined> = (route) => {
  const id = route.paramMap.get('id');
  const store = inject(RecipeStore);
  const router = inject(Router);

  const recipe = id ? store.recipes().find((r) => r.id === id) : undefined;

  if (!recipe) {
    router.navigate(['/progetto/ricette']);
    return undefined;
  }

  return recipe;
};
