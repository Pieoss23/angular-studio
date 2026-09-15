# Esercizio 7 — Cosa ho imparato

**Data valutazione:** 2026-09-09
**Esito:** ✅ completato
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] `params` è una funzione che legge il signal (reattiva)
- [x] i tre stati gestiti nel template (loading / error / value)
- [x] `reload()` collegato
- [x] nessuna `Promise` gestita a mano con `.then()`
- [x] nessun `effect` che fa il fetch manualmente

## Cosa hai scritto

```ts
readonly userResource = resource({
  params: () => ({ id: this.userId() }),
  loader: async ({ params }) => fakeFetchUser(params.id),
});

reload() { this.userResource.reload(); }
```

```html
@if (userResource.isLoading())      { <p>Carico…</p> }
@else if (userResource.error())     { <p>{{ (userResource.error() as Error).message }}</p> }
@else if (userResource.hasValue())  { <h3>{{ userResource.value().name }}</h3> … }
```

## Concetti chiave (da ricordare)

- `resource({ params, loader })`:
  - `params` è una **funzione** che legge i signal da cui dipende. Quando cambiano, il loader
    **riparte** e la richiesta precedente viene **abortita** (`abortSignal` disponibile nel
    loader) → niente race condition.
  - se `params` ritorna `undefined`, il loader **non parte**.
  - `loader` ritorna una `Promise<T>`.
- Stato esposto **come signal**: `isLoading()`, `error()`, `value()`, `hasValue()`, `status()`
  (`'idle' | 'loading' | 'resolved' | 'error' | 'local' | 'reloading'`).
- `reload()` riesegue il loader con gli stessi params (bottone "aggiorna").
- È il sostituto dichiarativo di `switchMap` + `BehaviorSubject` + gestione manuale di
  loading/errore. **Solo per la lettura**: le mutazioni restano imperative.

## Scoperta chiave: `hasValue()` è un type guard

`hasValue()` è dichiarato come `hasValue(): this is ResourceRef<Exclude<T, undefined>>`.
Dentro `@else if (userResource.hasValue())` il **template restringe il tipo**, quindi
`userResource.value().name` compila **senza** `?.` né `!`. Fuori da quel ramo, `value()` è
`T | undefined`.

Passare `params` come **oggetto** (`() => ({ id: … })`) va bene ed è il pattern giusto quando i
parametri sono più di uno; con un solo parametro basta `() => this.userId()`.

## Ordine dei rami

`isLoading` → `error` → `hasValue`. `isLoading()` è `true` anche durante i **reload**, non solo
al primo caricamento: se lo metti per ultimo non lo vedi mai.

## Nit (non a punteggio)

- `{{ $any(userResource.error()).message }}` → `(userResource.error() as Error).message`:
  `$any` spegne del tutto il type-checking di quel punto.
- `loader: async ({ params }) => { return fakeFetchUser(params.id) }` → l'`async` è ridondante,
  `fakeFetchUser` ritorna già una `Promise`.
- `;` mancanti.

## Trappole tipiche

- `params: this.userId` (senza `() =>`) non è reattivo: passi il signal, non lo leggi.
- `value()` è `undefined` finché il primo load non finisce.
- Mettere una POST nel `loader`: `resource` è per la lettura derivata da stato reattivo.
- API in developer preview: può cambiare tra minor.

## Approfondimenti
- https://angular.dev/guide/signals/resource
- https://angular.dev/api/core/resource
