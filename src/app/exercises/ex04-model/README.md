# Esercizio 4 — `model()`: two-way binding con i signal

## Concetti
- `model<T>(default)` crea un input **e** un output `xChange` → abilita `[(x)]`
- `model.required<T>()`
- dentro il componente si legge con `x()` e si scrive con `x.set()` / `x.update()`
- sostituisce il pattern `@Input() value` + `@Output() valueChange`

## Consegna — file `stepper.ts` (`<app-stepper>`)
1. `value` = `model<number>(0)`.
2. `min` = input opzionale default `0`; `max` = input opzionale default `10`.
3. `inc()` / `dec()` aggiornano `value` con `.update()`, restando in `[min, max]`.
4. Il template mostra `value()` e disabilita i bottoni ai limiti.

## Consegna — file `ex04-model.ts` (genitore)
5. Usa `<app-stepper [(value)]="count" [max]="5" />` con `count` signal.
6. Mostra `count()` accanto e un bottone "reset" che fa `count.set(0)`
   (deve riflettersi nello stepper → prova che il binding è davvero bidirezionale).

## Criteri di valutazione
- [ ] `model()` usato (non input+output separati)
- [ ] clamp tra min e max
- [ ] `[(value)]` nel genitore
- [ ] reset dal genitore aggiorna il figlio

## Come provare
`/ex04` — muovi lo stepper: `count` cambia. Premi reset: lo stepper torna a 0.
