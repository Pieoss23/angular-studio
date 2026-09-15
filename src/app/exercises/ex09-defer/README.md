# Esercizio 9 — Deferrable views: `@defer`

## Argomento

`@defer` è il modo di Angular per fare **code-splitting a livello di template**.

Normalmente tutto il codice dei componenti che usi in un template finisce nel bundle iniziale.
Se una parte di pagina è pesante (un grafico, un editor, una mappa) e non serve subito, la stai
facendo pagare a tutti al primo caricamento.

Con `@defer` avvolgi quel pezzo di template e Angular:

- mette il codice dei componenti usati **solo lì dentro** in un **chunk JS separato**;
- lo carica quando scatta un **trigger** (l'elemento entra nel viewport, l'utente interagisce,
  il browser è idle…);
- nel frattempo mostra un `@placeholder`, e durante il download un `@loading`.

È dichiarativo: nessun `import()` manuale, nessun `loadComponent`. Il compilatore fa il lavoro,
a patto che il componente "pesante" sia **usato esclusivamente** dentro il blocco `@defer`.

## Concetti da conoscere

- blocchi: `@defer`, `@placeholder`, `@loading`, `@error`
- modificatori di tempo: `@placeholder (minimum 500ms)`, `@loading (minimum 500ms; after 100ms)`
- trigger: `on idle` (default), `on viewport`, `on interaction`, `on hover`, `on timer(2s)`,
  `on immediate`, `when <espressione booleana>`
- trigger con riferimento: `on viewport(ref)`, `on interaction(ref)` dove `ref` è una
  template reference variable (`#ref`)
- `prefetch on <trigger>` — scarica il chunk in anticipo senza renderizzare
- più trigger insieme: `@defer (on viewport; on timer(5s))`

## Scenario

`HeavyChart` è un componente "finto-pesante": logga in console nel `constructor`, così vedi
**esattamente quando** il suo codice viene caricato. La pagina ha molto spazio vuoto per poter
scrollare.

## Cosa devi fare

Nel file `ex09-defer.ts`:

1. Avvolgi il primo `<app-heavy-chart />` in:
   ```
   @defer (on viewport) {
     <app-heavy-chart />
   } @placeholder {
     <div style="height: 160px">Scorri per caricare il grafico</div>
   } @loading (minimum 500ms) {
     <p>Carico il modulo…</p>
   }
   ```
   Il `@placeholder` deve avere un'altezza, altrimenti entra subito nel viewport.

2. Per il secondo blocco, usa il trigger su interazione col bottone:
   ```
   <button #showDetails class="btn">mostra dettagli</button>
   @defer (on interaction(showDetails)) {
     <app-heavy-chart mode="details" />
   } @placeholder {
     <span class="hint">clicca il bottone</span>
   }
   ```

3. **(bonus)** aggiungi `prefetch on idle` al primo blocco:
   `@defer (on viewport; prefetch on idle)`.

## Criteri di valutazione

- [ ] `HeavyChart` è usato **solo** dentro blocchi `@defer` (resta nel template, non serve un
      `imports` extra altrove)
- [ ] `@placeholder` e `@loading` presenti sul primo blocco
- [ ] usati i trigger `on viewport` **e** `on interaction(ref)`
- [ ] verificato in Network che parte un chunk JS separato
- [ ] il `console.log` di `HeavyChart` compare **solo** al caricamento, non all'avvio

## Come provare

`/ex09` → DevTools → Network (filtro JS).
1. All'apertura: nessun chunk del grafico, console pulita.
2. Scrolla fino al primo blocco: parte un file `.js`, appare "Carico il modulo…" per ~0,5 s,
   poi il grafico, e in console `[HeavyChart] costruito…`.
3. Clicca "mostra dettagli": stesso meccanismo, on demand.

## Trappole

- Se `HeavyChart` è usato anche fuori dal `@defer` (anche solo una volta), **non** viene
  separato: resta nel bundle iniziale.
- `@placeholder` senza dimensioni + `on viewport` = si carica immediatamente.
- `@defer` **non** va usato per contenuto above-the-fold o critico per il primo render.
- Il primo render mostra sempre il `@placeholder`: mettici qualcosa di sensato, non vuoto.
