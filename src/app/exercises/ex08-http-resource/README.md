# Esercizio 8 — `httpResource()`: chiamate REST dichiarative

> Developer preview. Richiede `provideHttpClient()` (già configurato in `app.config.ts`).

## Argomento

`httpResource()` è `resource()` specializzato per HTTP: invece di scrivere tu il `loader` con
`fetch`/`HttpClient`, gli dai un **URL (o una request) calcolato da una funzione reattiva** e lui
fa la GET, deserializza il JSON, e ti espone lo stato come signal.

È il modo "signal-first" di leggere dati da un backend:

- niente `subscribe`, niente `async` pipe, niente `takeUntilDestroyed`;
- quando l'URL cambia (perché è cambiato un signal che legge), la richiesta si rifà da sola e
  quella vecchia viene annullata;
- `value()` è **tipizzato** con il generico che passi.

Attenzione: `httpResource` **non sostituisce `HttpClient`**. Le mutazioni (POST/PUT/DELETE su
azione dell'utente) restano `httpClient.post(...).subscribe()`. `httpResource` serve per lo
**stato derivato da una GET**.

## Concetti da conoscere

- `httpResource<T>(() => url)` — GET, riparte quando cambiano le dipendenze della funzione
- `httpResource<T>(() => ({ url, params, method, body, headers }))` — forma con request object
- `httpResource.text<T>(...)` / `.blob(...)` / `.arrayBuffer(...)` — per risposte non-JSON
- stato: `value()`, `isLoading()`, `error()`, `hasValue()`, `headers()`, `statusCode()`
- `reload()` come in `resource()`

## Scenario

Lista di articoli di un utente da un'API pubblica di test:
`https://jsonplaceholder.typicode.com/posts?userId=<id>`

- bottoni `‹` / `›` cambiano `userId` (1–10) → deve rifare la richiesta;
- un campo di testo filtra i titoli → **non** deve rifare la richiesta (filtro client-side).

Questo è il punto dell'esercizio: capire **cosa** va nell'URL reattivo (il parametro server) e
**cosa** resta un `computed` locale (il filtro).

## Cosa devi fare

Nel file `ex08-http-resource.ts`:

1. **`postsResource`**:
   ```ts
   readonly postsResource = httpResource<Post[]>(
     () => `https://jsonplaceholder.typicode.com/posts?userId=${this.userId()}`
   );
   ```

2. **`filtered`** — `computed` che prende `postsResource.value() ?? []` e filtra per `q()`
   (case-insensitive sul titolo). Non deve toccare la rete.

3. **`count`** — `computed(() => this.postsResource.value()?.length ?? 0)`.

4. **Template**:
   - `@if (postsResource.isLoading())` → "Carico…"
   - `@else if (postsResource.error())` → "Errore di rete"
   - `@else` → `@for (p of filtered(); track p.id)` con il titolo; `@empty` → "Nessun risultato"

## Criteri di valutazione

- [ ] l'URL è costruito **dentro** la funzione reattiva (cambia con `userId`)
- [ ] tipizzazione esplicita `httpResource<Post[]>`
- [ ] il filtro è un `computed` client-side: cambiare `q` **non** rifà la GET
- [ ] stati loading ed error gestiti nel template
- [ ] nessun `HttpClient.get(...).subscribe()` per questa lettura

## Come provare

`/ex08`: apri la tab Network del browser.
1. Cambia `userId` con `›` → parte una nuova richiesta `posts?userId=2`.
2. Scrivi nel filtro → la lista si accorcia, **nessuna** nuova richiesta in Network.

## Trappole

- Mettere il filtro nell'URL → refetch ad ogni tasto premuto (e sprechi di rete).
- Dimenticare `<Post[]>` → `value()` è `unknown`.
- `jsonplaceholder` a volte è lento: il ramo loading deve esserci davvero.
- Serve `provideHttpClient()` nei provider, altrimenti errore di injection.
