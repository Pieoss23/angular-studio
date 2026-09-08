# Esercizio 7 — `resource()`: async con loading / error / reload

> API in evoluzione (developer preview). In Angular 21 la firma è
> `resource({ params, loader })`.

## Concetti
- `resource({ params: () => X, loader: async ({ params, abortSignal }) => ... })`
- stato esposto come signal: `.value()`, `.status()`, `.isLoading()`, `.error()`, `.hasValue()`
- `.reload()` per rieseguire il loader
- quando `params` cambia, il loader riparte e la richiesta precedente viene abortita
- se `params` ritorna `undefined` il loader **non** parte

## Consegna — file `ex07-resource.ts`
`fakeFetchUser(id)` (già fornita) risolve dopo ~600ms, e lancia se `id` è `4`.

1. `userId` = signal, parte da `1`.
2. `userResource` = `resource({ params: () => this.userId(), loader: ... })`
   che chiama `fakeFetchUser`.
3. Template:
   - `@if (userResource.isLoading())` → "Carico…"
   - `@else if (userResource.error())` → messaggio di errore
   - `@else if (userResource.hasValue())` → nome + email
4. Bottoni: "prev"/"next" cambiano `userId` (1..5), "ricarica" chiama `.reload()`.
5. Passa a `id = 4` e verifica che compaia il ramo errore.

## Criteri di valutazione
- [ ] `params` reattivo (funzione che legge il signal)
- [ ] gestiti tutti e 3 gli stati nel template
- [ ] `reload()` collegato
- [ ] nessuna `Promise` gestita a mano con `.then` nel componente

## Come provare
`/ex07` — naviga tra gli utenti; su #4 appare l'errore; "ricarica" rifà la fetch.
