# Esercizio 8 — Cosa ho imparato

**Data valutazione:** 2026-09-09
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] URL costruito dentro la funzione reattiva (cambia con `userId`)
- [x] tipizzazione esplicita `httpResource<Post[]>`
- [x] il filtro è un `computed` client-side: cambiare `q` non rifà la GET
- [x] stati loading ed error gestiti nel template
- [x] nessun `HttpClient.get(...).subscribe()` per questa lettura

## Codice finale

```ts
readonly postsResource = httpResource<Post[]>(
  () => `https://jsonplaceholder.typicode.com/posts?userId=${this.userId()}`,
);

readonly count = computed(() => this.postsResource.value()?.length ?? 0);

readonly filtered = computed<Post[]>(() => {
  const posts = this.postsResource.value() ?? [];
  const query = this.q().trim().toLowerCase();
  return posts.filter((post) => post.title.toLowerCase().includes(query));
});
```

## Concetti chiave (da ricordare)

- `httpResource<T>(() => url)`: la funzione è **reattiva**. Legge `this.userId()` → quando cambia,
  l'URL cambia → nuova GET, richiesta precedente **annullata**. Nessun `subscribe`, nessun
  `async` pipe.
- Il generico `<Post[]>` tipizza `value()` (senza, è `unknown`).
- Stato come signal: `value()`, `isLoading()`, `error()`, `hasValue()`, `headers()`, `statusCode()`.
- **`httpResource` non sostituisce `HttpClient`**: le mutazioni (POST/PUT/DELETE su azione
  dell'utente) restano `http.post(...).subscribe()`. `httpResource` = stato **derivato da una GET**.

## Il cuore dell'esercizio: cosa è reattivo-server e cosa è client

| dato | dove vive | perché |
|------|-----------|--------|
| `userId` | **nell'URL** del `httpResource` | è un parametro che il server usa per filtrare |
| filtro titolo (`q`) | **in un `computed`** che legge `value()` | è una vista locale sui dati già scaricati |

Mettere `q` nell'URL → una richiesta HTTP ad ogni tasto premuto. Sbagliato.

## Errori corretti in review

1. **`filtered` era rotto**:
   ```ts
   readonly filtered = computed<Post[]>((q) => this.postsResource.value()?.filter(q));
   ```
   - `computed(fn)` — **`fn` non riceve argomenti**. Quel `(q)` era un parametro `any`
     inesistente, non il signal `q`. Le dipendenze si prendono **chiamando i signal nel corpo**
     (`this.q()`, `this.postsResource.value()`).
   - `.filter(q)` — `Array.filter` vuole una **funzione predicato**, non un valore → `TypeError`
     a runtime.
   - tipo di ritorno `Post[] | undefined` ≠ `Post[]` dichiarato → usa `?? []`.

2. **Il template `@if / @else` (loading / error / lista) era ancora da fare** (c'era solo il
   commento `<!-- TODO -->`).

## Trappole tipiche

- Dimenticare `<T>` → `value()` è `unknown`.
- Filtro nell'URL → refetch continui.
- `jsonplaceholder` a volte è lento: il ramo `isLoading()` deve esserci.
- `provideHttpClient()` assente → errore di injection (qui è già configurato).

## Approfondimenti
- https://angular.dev/guide/http/http-resource
- https://angular.dev/api/common/http/httpResource
