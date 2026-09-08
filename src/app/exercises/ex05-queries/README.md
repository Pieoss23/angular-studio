# Esercizio 5 — Query come signal: `viewChild` / `viewChildren`

## Concetti
- `viewChild('ref')` / `viewChild.required('ref')` → `Signal<T | undefined>` / `Signal<T>`
- `viewChildren('ref')` → `Signal<readonly T[]>`
- `contentChild` / `contentChildren` per il contenuto proiettato
- le query sono signal: si usano in `computed` / `effect`, si aggiornano da sole
- niente più `@ViewChild(...) x!: ...` + `AfterViewInit`

## Consegna — file `ex05-queries.ts`
1. `box` = `viewChild.required<ElementRef<HTMLInputElement>>('box')` sull'`<input #box>`.
2. `focusInput()` (bottone) chiama `this.box().nativeElement.focus()`.
3. `items` = `viewChildren<ElementRef<HTMLLIElement>>('item')` sui `<li #item>`.
4. `count` = `computed()` = `items().length`.
5. `effect()`: quando `count()` cambia, scrivi `console.log('li visibili:', count())`.
6. Un bottone "aggiungi riga" fa push su `rows` (signal array) → `count` deve aggiornarsi da solo.

## Criteri di valutazione
- [ ] `viewChild.required` (niente `!` / undefined check manuale)
- [ ] nessun `AfterViewInit`
- [ ] `computed` sulla query, non lettura in un lifecycle
- [ ] `effect` reagisce all'aggiunta di righe

## Come provare
`/ex05` — "focus" mette il cursore nell'input; "aggiungi riga" aumenta il contatore e logga in console.
