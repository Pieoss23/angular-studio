import { Component, signal } from '@angular/core';
import { MOCK_RECIPES } from '../data/mock-recipes';

@Component({
  selector: 'recipe-list',
  template: '<span>ricette disponibili: {{ recipes().length }}</span>',
})
export class RecipeList {
  protected readonly recipes = signal(MOCK_RECIPES);
}
