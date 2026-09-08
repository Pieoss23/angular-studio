# Esercizio 1 — Cosa ho imparato

**Data valutazione:** 2026-09-08
**Esito:** ✅ completato (2 bug logici corretti in review)
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] solo signal per lo stato (niente campi mutabili)
- [x] `computed` per i derivati, nessun ricalcolo manuale nel template
- [x] `decrement` non produce numeri negativi
- [x] `effect` nell'injection context (constructor), non in un metodo
- [x] `history` aggiornato immutabilmente (`update(h => [...h, v])`)

Nit residui non a punteggio: `+ Number.EPSILON` inutile qui; `;` mancanti; scrivere un
signal dentro un `effect` (accettabile in questo caso, evitabile in generale).

## Cosa hai fatto bene
- `quantity` / `unitPrice` come `signal`, nessun campo mutabile. ✅
- `total` come `computed` che **chiama** i signal: `this.quantity() * this.unitPrice()`. ✅
- `increment` / `decrement` con `.update()` e funzione pura; `decrement` non va sotto 0. ✅
- `effect` registrato nel `constructor` (injection context), non dentro un metodo. ✅
- `discounted` derivato da `total()` e non ricalcolato a mano nel template. ✅

## Errori / cose da correggere
1. **Formula dello sconto sbagliata** (`discounted`):
   ```ts
   return currTotal > 50 ? currTotal * 0.1 : currTotal;
   ```
   `currTotal * 0.1` è il *10% del totale*, non il totale *scontato del 10%*.
   Con `total = 60` restituisci `6` invece di `54`. Corretto:
   ```ts
   return currTotal > 50 ? currTotal * 0.9 : currTotal;
   ```

2. **L'`effect` non fa nulla di visibile.** Due problemi:
   - Arrotondamento: `Math.round((currDiscounted * Number.EPSILON) * 100) / 100`.
     `Number.EPSILON` ≈ `2.2e-16`, quindi moltiplichi per ~zero e `roundedValue` è sempre `0`.
     Volevi `Math.round(currDiscounted * 100) / 100`.
   - Non scrivi mai in `history`: calcoli `roundedValue` e lo butti via. Manca
     `this.history.update(h => [...h, roundedValue])`.
   Versione corretta:
   ```ts
   effect(() => {
     const rounded = Math.round(this.discounted() * 100) / 100;
     this.history.update(h => [...h, rounded]);
   });
   ```

## Concetti chiave (da ricordare)
- Un signal è una **funzione**: `x()` legge, `x.set(v)` / `x.update(fn)` scrivono. Dimenticare le
  `()` in un `computed`/template è l'errore n°1.
- `computed()` = derivato **memoizzato e read-only**: si ricalcola solo quando cambia una
  dipendenza *letta durante l'esecuzione*.
- `effect()` gira una prima volta subito e poi a ogni cambio delle dipendenze lette. Va creato
  in un injection context (campo o `constructor`).
- Le dipendenze si **tracciano solo se le leggi**: se in un `effect` non chiami `this.discounted()`,
  l'effect non si riattiva.
- Aggiornamento immutabile degli array nei signal: `sig.update(a => [...a, x])`, mai `a.push(x)`.

## Trappole tipiche di questo argomento
- Scrivere in un signal dentro un `effect` funziona ma è spesso un *code smell*: qui è accettabile
  come esercizio didattico, ma per uno "storico di valori derivati" la via idiomatica sarebbe
  accumularlo dove avviene l'azione, o valutare `linkedSignal` (esercizio 6). Se scrivi il signal
  che l'effect stesso legge → loop infinito.
- `computed` con side-effect dentro: vietato, deve essere una funzione pura.
- In modalità **zoneless** un campo normale (`this.foo = 1`) non fa aggiornare la UI: deve essere
  un signal.

## Approfondimenti consigliati
- https://angular.dev/guide/signals
- https://angular.dev/guide/signals#effects (quando NON usare un effect)
- `untracked()` per leggere un signal in un effect senza crearne una dipendenza.
