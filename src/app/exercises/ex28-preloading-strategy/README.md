# Esercizio 28 — Router: `PreloadingStrategy` custom

## Argomento

Con `loadComponent`, ogni rotta è un chunk JS separato scaricato solo alla navigazione — ottimo
per il caricamento iniziale, ma introduce un piccolo ritardo alla prima visita di ogni pagina.
Una **preloading strategy** scarica alcuni chunk in background, dopo che l'app è già
interattiva, così quando l'utente ci naviga davvero il chunk è già in cache e la transizione è
istantanea.

Angular offre due strategie pronte: `NoPreloading` (default, nessun preload) e
`PreloadAllModules` (precarica tutto, sempre, appena l'app è pronta). Una strategia custom ti dà
il controllo su **quali** rotte precaricare.

## Concetti da conoscere

- `class Strategia implements PreloadingStrategy { preload(route, load) { ... } }`
- `preload()` viene chiamato dal router per **ogni** rotta lazy dopo il bootstrap iniziale; tu
  decidi se chiamare `load()` (scarica il chunk) o tornare `of(null)` (non fare nulla per questa
  rotta)
- `route.data` è disponibile dentro `preload()`: puoi marcare le rotte "da precaricare" con
  `data: { preload: true }` nella configurazione delle rotte
- si attiva con `provideRouter(routes, withPreloading(Strategia))` in `app.config.ts`
  (già collegato in questo progetto)

## Scenario

`/ex01` e `/ex02` sono marcate con `data: { preload: true }` in `app.routes.ts`. Tutte le altre
rotte non lo sono.

## Cosa devi fare

In `selective-preload.strategy.ts`:

```ts
preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
  if (route.data?.['preload']) {
    console.log(`[preload] ${route.path}`);
    return load();
  }
  return of(null);
}
```

## Criteri di valutazione

- [ ] in console, dopo il caricamento di `/`, compaiono i log `[preload]` solo per `ex01` e `ex02`
- [ ] in Network, i chunk di ex01/ex02 partono da soli poco dopo il load iniziale, senza cliccarci
- [ ] il chunk di un'altra rotta (es. ex05) parte solo quando ci navighi effettivamente

## Come provare

Vai su `/` con DevTools → Network aperto (filtro JS). Dopo un istante dovrebbero comparire due
richieste extra per i chunk di ex01/ex02, senza che tu abbia cliccato nulla. Poi naviga su
un'altra rotta non marcata: il suo chunk parte solo in quel momento, non prima.

## Trappole

- `preload()` deve sempre ritornare un `Observable`, anche quando "non fai nulla":
  `of(null)`, non `undefined` — il router si aspetta un observable da ogni chiamata.
- Il preload parte dopo che il **primo** ciclo di navigazione è completato, non subito al boot:
  su connessioni molto lente potresti notare un piccolo ritardo prima di vedere le richieste
  extra in Network.
