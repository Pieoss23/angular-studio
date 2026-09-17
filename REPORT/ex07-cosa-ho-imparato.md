# Esercizio 7 — Cosa ho imparato

**Data valutazione:** 2026-09-09 (aggiornato 2026-09-17: bug runtime scoperto e corretto)
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

- `loader: async ({ params }) => { return fakeFetchUser(params.id) }` → l'`async` è ridondante,
  `fakeFetchUser` ritorna già una `Promise`.
- `;` mancanti.

## Bug scoperto dopo il primo "completato"

Quello che nella review originale era stato archiviato come semplice nit stilistico si è
rivelato un bug reale a runtime: `{{ $any(userResource.error()).message }}` lanciava
`TypeError: Cannot read properties of undefined (reading 'message')`, perché `error()` è
tipizzato `Error | undefined` e può risultare `undefined` anche dentro il ramo
`@else if (userResource.error())` che lo controlla. `$any()` aveva disattivato l'unico segnale
che avrebbe evitato il problema in anticipo: senza, TypeScript avrebbe rifiutato di compilare
l'accesso a `.message` su un valore possibilmente `undefined`.

In un'app **zoneless** un errore non gestito durante il render blocca l'intero ciclo di change
detection, non solo il binding che l'ha causato: da qui i sintomi riportati (bottoni "morti",
impossibile cambiare tab) — non erano bug separati, erano tutti conseguenza della stessa
eccezione non gestita durante il rendering iniziale.

**Fix**: `userResource.error()?.message` — optional chaining invece del cast forzato, così se
`error()` è `undefined` l'espressione ritorna `undefined` invece di lanciare.

**Lezione**: `$any()` non è mai gratis. Se serve per far compilare qualcosa, quasi sempre vuol
dire che il type-checker sta segnalando un caso limite reale che va gestito (con `?.`, un
controllo esplicito, o un narrowing corretto), non silenziato.

## Trappole tipiche

- `params: this.userId` (senza `() =>`) non è reattivo: passi il signal, non lo leggi.
- `value()` è `undefined` finché il primo load non finisce.
- Mettere una POST nel `loader`: `resource` è per la lettura derivata da stato reattivo.
- API in developer preview: può cambiare tra minor.

## Approfondimenti
- https://angular.dev/guide/signals/resource
- https://angular.dev/api/core/resource
