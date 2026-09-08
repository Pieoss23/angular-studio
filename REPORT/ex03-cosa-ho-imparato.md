# Esercizio 3 — Cosa ho imparato

**Data valutazione:** 2026-09-08
**Esito:** ✅ completato (con aiuti — API nuove) + cleanup in review
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] `input.required` usato per `value`
- [x] alias + transform corretti
- [x] nessuna assegnazione a un input
- [x] `output()` (non `EventEmitter`)
- [x] il genitore aggiorna lo stato dall'evento

## Cosa hai fatto bene
- `input.required<number>()` per `value`, senza `!` o tipo `| undefined`.
- `input('', { alias: 'caption', transform: (v: string) => v.trim() })` — alias + transform
  scritti correttamente.
- `stars` come `computed`: `Array.from({ length: this.max() }, (_, i) => i < this.value())`.
  Si ricalcola quando cambiano `max()` o `value()`.
- `rate = output<number>()` e `this.rate.emit(i + 1)`.
- Nel genitore: `[value]="current()"` + `(rate)="current.set($event)"` → flusso dati corretto.

## Concetti chiave (da ricordare)
- `input()` **non è una proprietà**: è un getter-signal. Lo leggi con `x()`, **non** puoi
  assegnarlo. È il compilatore che lo aggiorna dal binding del genitore.
- `input.required<T>()`: niente valore di default; se il genitore non fa il binding →
  **errore di compilazione** (con `strictTemplates`). Ottimo per le API obbligatorie.
- `transform` gira a ogni set del valore. Helper pronti: `booleanAttribute`, `numberAttribute`
  da `@angular/core` (utili per attributi HTML che arrivano come stringa).
- `alias`: nome pubblico diverso da quello interno (`caption` fuori, `label()` dentro).
- `output<T>()` sostituisce `@Output() x = new EventEmitter<T>()`. Si emette con `.emit(v)`.
  Non esponi un Observable: solo l'evento.
- Pattern parent/child: **il figlio notifica** (`(rate)`), **il genitore decide**
  (`current.set(...)`). Il figlio non muta lo stato del padre.

## API che non conoscevi (dall'esercizio)
- `Array.from({ length: n }, (_, i) => ...)` per generare un array da una lunghezza.
- La forma con opzioni di `input(default, { alias, transform })`.
- `output()` come funzione (non più decoratore + classe).

## Cleanup fatto in review
- Rimosso `import { readonly } from '@angular/forms/signals'` (auto-import errato dell'IDE:
  `readonly` qui è la keyword TypeScript del campo, non un simbolo importato).
- `[value]="this.current()"` → `[value]="current()"` (`this.` nei template è superfluo).
- CSS `.star.on { border: .5 solid black }` → rimosso: valore non valido (manca l'unità) e
  colore fisso non adatto al tema scuro.

## Trappole tipiche
- Provare ad assegnare un input (`this.value = 3`) → errore: sono read-only.
- Dimenticare `<T>` in `input.required()` → tipo `unknown`.
- `transform` con funzione non pura o che dipende da altro stato → comportamento imprevedibile.
- Usare ancora `@Input()/@Output()` misti a signal input: si può, ma meglio uniformare.

## Approfondimenti
- https://angular.dev/guide/components/inputs
- https://angular.dev/guide/components/outputs
- https://angular.dev/guide/signals#input-signals
