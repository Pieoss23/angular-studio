# Esercizio 8 — `httpResource()`: REST dichiarativo

> Developer preview. Richiede `provideHttpClient()` (già configurato in `app.config.ts`).

## Concetti
- `httpResource<T>(() => url)` — GET dichiarativa, riparte quando le dipendenze cambiano
- `httpResource<T>(() => ({ url, params, method, body, headers }))`
- `httpResource.text()` / `.blob()` / `.arrayBuffer()` per risposte non-JSON
- stato: `.value()`, `.isLoading()`, `.error()`, `.hasValue()`, `.headers()`, `.statusCode()`
- **non** sostituisce `HttpClient` per le mutazioni (POST/PUT lato azione): serve per lo stato derivato da GET

## Consegna — file `ex08-http-resource.ts`
API: `https://jsonplaceholder.typicode.com/posts?userId=<id>`

1. `userId` = signal, 1..10, default `1`.
2. `postsResource = httpResource<Post[]>(() => \`https://jsonplaceholder.typicode.com/posts?userId=\${this.userId()}\`)`.
3. `count` = `computed(() => postsResource.value()?.length ?? 0)`.
4. Template: loading, errore, e la lista dei titoli (`@for` con `track p.id`).
5. `q` = signal stringa (filtro titolo). `filtered` = computed che filtra `value()` per `q()`
   **senza** rifare la richiesta HTTP.

## Criteri di valutazione
- [ ] URL costruito dentro la funzione reattiva (cambia con `userId`)
- [ ] tipizzazione generica `<Post[]>`
- [ ] filtro client-side via `computed`, niente refetch
- [ ] stati loading/error gestiti

## Come provare
`/ex08` — cambia utente (refetch), digita nel filtro (nessun refetch).
