import { Component, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { debounce, distinctUntilChanged, switchMap, tap } from "rxjs";

@Component({
  selector: 'recipe-card',
  template: 'recipe-card'
})
export class RecipeCard {
  private readonly query = signal('')
  protected readonly loading = signal(false)

  query$ = toObservable(this.query)

  result$ = this.query$.pipe(
    debounce(300),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((this.query) =>)
  )
}
