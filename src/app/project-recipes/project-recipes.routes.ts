import { Routes } from '@angular/router';

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
  }

];
