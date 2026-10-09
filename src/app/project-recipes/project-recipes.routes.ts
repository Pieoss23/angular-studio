import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { recipeResolver } from './recipe/recipe.resolver';
import { RecipeStore } from './store/recipe-store';

// Rotte del progetto, isolate da app.routes.ts (che resta dedicato agli
// esercizi). Aggiungi qui le nuove rotte via via che avanzi nelle milestone
// (lista, dettaglio, form, area personale...).
export const PROJECT_RECIPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./project-recipes').then((m) => m.ProjectRecipes),
    title: 'Progetto — Libreria ricette',
  },
  {
    path: 'ricette',
    loadComponent: () => import('./recipe/recipe-list').then((m) => m.RecipeList)
  },
  {
    path: 'ricette/nuova',
    loadComponent: () => import('./recipe/recipe-form').then((m) => m.RecipeForm),
    title: 'Nuova ricetta',
  },
  {
    path: 'ricette/:id',
    resolve: { recipe: recipeResolver },
    title: (route: ActivatedRouteSnapshot) => {
      const id = route.paramMap.get('id');
      const recipe = id ? inject(RecipeStore).recipes().find((r) => r.id === id) : undefined;
      return recipe?.title ?? 'Ricetta';
    },
    loadComponent: () => import('./recipe/recipe-detail').then((m) => m.RecipeDetail),
  },

];
