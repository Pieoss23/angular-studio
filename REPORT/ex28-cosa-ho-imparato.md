# Esercizio 28 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] in console compaiono i log `[preload]` solo per ex01 ed ex02
- [x] i chunk di ex01/ex02 partono da soli poco dopo il load iniziale
- [x] il chunk di un'altra rotta parte solo quando ci navighi

## Codice finale

```ts
preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
  if (route.data?.['preload']) {
    console.log(`[preload] ${route.path}`);
    return load();
  }
  return of(null);
}
```

## Concetti chiave (da ricordare)

- `preload()` viene chiamato dal router per ogni rotta lazy dopo il bootstrap iniziale; tornare
  `of(null)` significa "non fare nulla per questa rotta", `load()` scarica davvero il chunk.
- `route.data` è la leva per decidere selettivamente cosa precaricare, invece di tutto
  (`PreloadAllModules`) o niente (`NoPreloading`, il default).
- Attivata con `withPreloading(Strategia)` in `provideRouter(...)`, senza altro collegamento
  manuale.

## Trappole verificate

Nessuna: build pulita, `preload()` ritorna sempre un Observable anche nel ramo "non fare nulla".

## Approfondimenti
- https://angular.dev/api/router/PreloadingStrategy
