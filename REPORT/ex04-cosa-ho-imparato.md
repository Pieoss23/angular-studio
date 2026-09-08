# Esercizio 4 — Cosa ho imparato

**Data valutazione:** 2026-09-08
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] `model()` usato (non input+output separati)
- [x] clamp tra min e max
- [x] `[(value)]` nel genitore
- [x] reset dal genitore aggiorna il figlio

## Cosa hai fatto bene
- `value = model<number>(0)` e `min` / `max` come `input()`.
- `inc()`: `Math.min(v + 1, this.max())` — clamp superiore corretto.
- `[(value)]="count"` nel genitore: two-way binding con il `model`.
- `[disabled]="value() <= min()"` / `[disabled]="value() >= max()"` — reattivi, senza calcoli extra.

## Concetti chiave (da ricordare)
- `model<T>(d)` = **input + output `xChange`** in una dichiarazione. È esattamente ciò che
  serve per `[(x)]`: *banana in a box* = `[x]="..."` + `(xChange)="x = $event"`.
- Two-way **vero e bidirezionale**: `count.set(0)` nel genitore → il figlio si aggiorna;
  `value.update(...)` nel figlio → il genitore si aggiorna. Stato unico condiviso.
- Dentro il componente il `model` è un `WritableSignal`: `value()` legge, `value.set()/update()`
  scrive **ed emette** `valueChange`.
- Clamp: `Math.min(x, tetto)`, `Math.max(x, pavimento)`. Non invertirli.

## Errori corretti in review
1. **`dec()` con `Math.min`** invece di `Math.max`: `Math.min(v - 1, min())` collassa sempre
   a `min` (con `v=2, min=0` → `Math.min(1, 0) = 0`). Corretto in `Math.max(v - 1, this.min())`.
2. **Mancava il bottone reset** (`count.set(0)`), necessario per dimostrare il two-way.
3. "Non si vedevano" i tasti disabilitati: il binding `[disabled]` era corretto (il bottone
   *era* disabilitato), ma nel CSS globale mancava lo stile `.btn:disabled` → aggiunto
   `opacity: .4; cursor: not-allowed`.
4. `[max]=10` → `[max]="10"` (valore quotato).

## Trappole tipiche
- Confondere `model()` con `input()`: `input()` è read-only, `model()` è scrivibile.
- Dimenticare che scrivere il `model` nel figlio **notifica** il genitore (a volte non lo vuoi:
  in quel caso usa un `input()` + un `output()` esplicito con nome diverso).
- `[(x)]` funziona **solo** se il target è un `model()` (o un `@Input x` + `@Output xChange`).
- Stile: se un controllo può essere `[disabled]`, ricordati di stilizzarlo, altrimenti
  sembra rotto anche se funziona.

## Approfondimenti
- https://angular.dev/guide/components/inputs#model-inputs
- https://angular.dev/guide/signals/model
