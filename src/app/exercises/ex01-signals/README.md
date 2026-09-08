# Esercizio 1 — Signals: `signal` / `computed` / `effect`

## Concetti
- `signal()` per lo stato locale mutabile e reattivo
- `.set()` e `.update()`
- `computed()` per valori derivati (memoizzati, sola lettura)
- `effect()` per side-effect che reagiscono ai signal letti

## Consegna
Costruisci un mini "carrello".

1. `quantity` = signal numerico, parte da `1`.
2. `unitPrice` = signal numerico, parte da `9.9`.
3. `increment()` / `decrement()` modificano `quantity` con `.update()`.
   `quantity` non deve mai scendere sotto `0`.
4. `total` = `computed()` = `quantity * unitPrice`.
5. `discounted` = `computed()`: se `total > 50` applica il 10% di sconto, altrimenti `total`.
6. `effect()`: ogni volta che `discounted` cambia, fai push del valore (arrotondato a 2 decimali)
   dentro il signal `history` (array). Usa `update` in modo immutabile.

## Criteri di valutazione
- [x] Nessun `let`/proprietà mutabile usata al posto dei signal
- [x] `computed` usati per i derivati (niente ricalcolo manuale nel template)
- [x] `decrement` non produce numeri negativi
- [x] `effect` registrato nel campo di iniezione (constructor / field initializer), non dentro un metodo
- [x] `history` aggiornato immutabilmente

## Come provare
`npm start` → vai su `/ex01`. Incrementa la quantità e osserva total, scontato e history.
