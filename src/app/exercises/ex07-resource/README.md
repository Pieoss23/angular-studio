# Esercizio 7 — `resource()`: dati asincroni come signal

> API in developer preview. In Angular 21 la firma è `resource({ params, loader })`
> (in v19 si chiamava `request`).

## Argomento

`resource()` porta il caricamento asincrono dentro il mondo dei signal.

Il problema classico: hai un parametro reattivo (un id, un termine di ricerca) e ogni volta che
cambia devi rifare una chiamata async, gestire lo stato di *loading*, l'errore, ed evitare le
*race condition* (una risposta lenta che arriva dopo una più recente). Con RxJS lo facevi con
`switchMap` + `BehaviorSubject` + `async` pipe.

`resource()` fa tutto questo in forma dichiarativa:

- gli dai una funzione **`params`** che legge i signal da cui dipende;
- gli dai un **`loader`** asincrono (una `Promise`) che riceve quei params;
- lui ti espone lo **stato come signal**: `value()`, `isLoading()`, `error()`, `status()`.

Quando `params` cambia, il loader riparte **e la richiesta precedente viene abortita** (ti passa
un `abortSignal`). Se `params` ritorna `undefined`, il loader non parte affatto.

**Quando usarlo:** lettura di dati derivata da uno stato reattivo. **Quando no:** mutazioni
(POST/PUT su azione dell'utente) — quelle restano imperative.

## Concetti da conoscere

- `resource({ params: () => X, loader: async ({ params, abortSignal }) => T })`
- `res.value()` — `T | undefined` (il dato, o `undefined` finché non è pronto)
- `res.hasValue()` — `true` se c'è un valore
- `res.isLoading()` — `true` durante il caricamento (anche sui reload)
- `res.error()` — l'errore lanciato dal loader, o `undefined`
- `res.status()` — `'idle' | 'loading' | 'resolved' | 'error' | ...`
- `res.reload()` — riesegue il loader con gli stessi params

## Scenario

Un piccolo "navigatore di utenti": bottoni prev/next cambiano l'id (1–5), e la scheda mostra
nome ed email dell'utente. La funzione `fakeFetchUser(id)` è già fornita: risolve dopo ~600 ms e
**lancia un errore se `id === 4`**, così puoi vedere il ramo di errore.

## Cosa devi fare

Nel file `ex07-resource.ts`:

1. **`userResource`** — crea la risorsa:
   ```ts
   readonly userResource = resource({
     params: () => this.userId(),
     loader: ({ params }) => fakeFetchUser(params),
   });
   ```

2. **Template** — gestisci i tre stati, in quest'ordine:
   ```
   @if (userResource.isLoading())      → "Carico…"
   @else if (userResource.error())     → messaggio d'errore ( (userResource.error() as Error).message )
   @else if (userResource.hasValue())  → nome + email di userResource.value()
   ```

3. **`reload()`** — collega il bottone "ricarica" a `this.userResource.reload()`.

4. Naviga fino a `id = 4` e verifica che compaia il ramo errore; torna indietro e verifica che
   si recuperi da solo.

## Criteri di valutazione

- [ ] `params` è una funzione che **legge** il signal (reattiva)
- [ ] tutti e tre gli stati gestiti nel template
- [ ] `reload()` collegato
- [ ] nessuna `Promise` gestita a mano con `.then()` nel componente
- [ ] nessun `effect` che fa il fetch "manualmente"

## Come provare

`/ex07`: parte l'utente 1. Premi next fino a 4 → "Utente 4 non disponibile". Premi prev → torna
a caricare. "ricarica" rifà la fetch (vedi il flash di "Carico…").

## Trappole

- `value()` è `undefined` finché il primo load non finisce: non assumere che ci sia sempre.
- Se scrivi `params: this.userId` (senza `() =>`) non è reattivo.
- `resource` è per la **lettura**: non metterci dentro una POST.
- L'API può cambiare tra versioni minori: è ancora in preview.
