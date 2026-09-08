# Esercizio 3 — Signal inputs & outputs

## Concetti
- `input<T>(default)` → input opzionale, ritorna un `Signal<T>`
- `input.required<T>()` → input obbligatorio (errore di compilazione se manca)
- `input(value, { alias, transform })`
- `output<T>()` → sostituisce `@Output() EventEmitter`
- gli input sono **read-only**: si reagisce con `computed` / `effect`, non si assegnano

## Consegna — file `rating.ts` (componente figlio `<app-rating>`)
1. `max` = input opzionale, default `5`.
2. `value` = input **required** (numero di stelle piene).
3. `label` = input con **alias** `caption` e `transform` che fa `.trim()`.
4. `stars` = `computed` che ritorna un array lungo `max()` di boolean (`i < value()`).
5. `rate` = `output<number>()`. Al click sulla stella `i`, emetti `i + 1`.

## Consegna — file `ex03-signal-io.ts` (genitore)
6. Passa `value` da un signal `current`, e aggiorna `current` quando arriva `(rate)`.
7. Passa `caption="  Valuta il corso  "` e verifica che venga mostrato trimmato.

## Criteri di valutazione
- [ ] `input.required` usato per `value`
- [ ] alias + transform corretti
- [ ] nessuna assegnazione a un input
- [ ] `output()` (non `EventEmitter`)
- [ ] il genitore aggiorna lo stato dall'evento

## Come provare
`/ex03` — clicca le stelle: il valore nel genitore cambia e la caption appare senza spazi.
