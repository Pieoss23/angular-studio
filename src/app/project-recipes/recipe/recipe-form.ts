import { Component, inject } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { RecipeStore } from "../store/recipe-store";

@Component({
  selector: 'recipe-form',
  imports: [ReactiveFormsModule],
  template: `
  <h2>Inserisci Ricetta: </h2>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display: grid; gap: 12px; max-width: 360px;">
          <label>
            Title
            <input formControlName="title" class="input" />
            @if (form.controls.title.invalid && form.controls.title.touched) {
              <span class="hint">min. 3 caratteri</span>
            }
          </label>

          <label>
            Description
            <input formControlName="description" class="input" />
            @if (form.controls.description.invalid && form.controls.description.touched) {
              <span class="hint">Descrizione non valida</span>
            }
          </label>

          <label for="servings">
            Servings
            <input formControlName="servings" class="number" />

          </label>

          @for (group of form.controls.ingredients.controls; track $index; let i = $index) {
            <div [formGroup]= "group">
              <div>
                Nome dell'ingredienti
                <input formControlName="name" />
              </div>
              <div>
                Quantità
                <input formControlName="quantity" type="number" />
              </div>
              <div>
                Unità
              <input formControlName="unit" />
              </div>
              <button type="button" (click)="removeIngredient(i)">Rimuovi</button>
            </div>
          }
          <button type="button" (click)="addIngredient()">+ ingrediente </button>

          <button type="submit" class="btn" [disabled]="form.invalid">Salva</button>

        </form>

  `,
})

export class RecipeForm {

  protected readonly recipeStore = inject(RecipeStore);

  protected readonly atLeastOneIngredient: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const ingredients = group.get('ingredients');

    return ingredients instanceof FormArray && ingredients.length > 0
      ? null
      : { atLeastOneIngredient: true };
  };

  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl('', { nonNullable: true }),
    servings: new FormControl(2, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    ingredients: new FormArray([this.createIngredientGroup()]),
  }, { validators: [this.atLeastOneIngredient] })

  private createIngredientGroup() {
    return new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      quantity: new FormControl(0, { nonNullable: true, validators: [Validators.min(0.1)] }),
      unit: new FormControl('', { nonNullable: true, validators: [Validators.required] })

    },
    )
  }

  protected addIngredient(): void {
    this.form.controls.ingredients.push(this.createIngredientGroup());
  }

  protected removeIngredient(index: number): void {
    this.form.controls.ingredients.removeAt(index)
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.recipeStore.addRecipe({
      title: this.form.getRawValue().title,
      description: this.form.getRawValue().description,
      ingredients: this.form.getRawValue().ingredients,
      servings: this.form.getRawValue().servings,
      image: `https://picsum.photos/id/${this._randomPicsumId()}/600/400`,
      cookTimeMinutes: 0,
      tags: [],
      category: 'primo',
      steps: []
    });
    this.form.reset();
  }


  private _randomPicsumId():number {
    return Math.floor(Math.random()*1000)
  }

};
