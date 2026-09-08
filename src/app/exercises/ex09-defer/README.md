# Esercizio 9 — Deferrable views: `@defer`

## Concetti
- `@defer` carica in lazy il codice dei componenti usati **solo** al suo interno
- blocchi: `@placeholder`, `@loading`, `@error` (con `minimum` / `after`)
- trigger: `on idle` (default), `on viewport`, `on interaction`, `on hover`, `on timer(...)`,
  `on immediate`, `when <espressione>`
- `prefetch on ...` per pre-caricare senza renderizzare
- i componenti nel blocco `@defer` **non** vanno in un chunk separato se sono anche usati altrove

## Consegna — file `ex09-defer.ts` + `heavy-chart.ts`
`HeavyChart` è un componente “pesante” finto (log in console al costruttore).

1. `@defer (on viewport)` attorno a `<app-heavy-chart>`, con un `@placeholder` che dice
   "Scorri per caricare il grafico" (dagli un'altezza per poterci scrollare).
2. Aggiungi `@loading (minimum 500ms)` → "Carico il modulo…".
3. Un secondo `@defer (on interaction)` legato a un bottone `#showDetails`
   (`@defer (on interaction(showDetails))`) che rivela `<app-heavy-chart mode="details" />`.
4. BONUS: `@defer (on viewport; prefetch on idle)`.

## Criteri di valutazione
- [ ] `HeavyChart` importato **solo** dove serve (resta nel template, non nel campo `imports` inutile altrove)
- [ ] `@placeholder` + `@loading` presenti
- [ ] trigger `on viewport` e `on interaction` usati
- [ ] verificato in Network tab che parte un chunk separato

## Come provare
`/ex09` — apri DevTools → Network, scrolla fino al grafico: parte un chunk JS lazy.
Il log del costruttore di `HeavyChart` compare solo al caricamento.
