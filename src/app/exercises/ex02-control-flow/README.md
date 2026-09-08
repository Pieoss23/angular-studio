# Esercizio 2 — Nuovo control flow: `@if` / `@for` / `@switch`

## Concetti
- `@if / @else if / @else`
- `@for (item of list; track item.id)` — `track` è **obbligatorio**
- variabili implicite: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`
- `@empty { }` per la lista vuota
- `@switch / @case / @default`
- niente più `*ngIf` / `*ngFor` / `NgSwitch` negli import

## Consegna
Nel template (`ex02-control-flow.ts`) sono presenti dei `<!-- TODO -->`.

1. Mostra la lista `tasks` con `@for`, `track` su `t.id`.
2. Riga alternata: aggiungi la classe `odd` quando `$odd`.
3. `@empty`: se non ci sono task visibili, mostra "Nessun task".
4. Badge di stato con `@switch` su `t.status`: `done` → ✅, `doing` → 🔧, `todo` → ⭕, default → "?".
5. `@if` sul contatore: se `remaining() === 0` mostra "Tutto fatto 🎉", altrimenti
   "Rimasti: N" con `@else`.

Il filtro (`filter` signal) e `visibleTasks` / `remaining` computed sono già pronti.

## Criteri di valutazione
- [x] `track` corretto (per id, non `$index`)
- [x] `@empty` funzionante filtrando fino a lista vuota
- [x] `@switch` con `@default`
- [x] nessun import di direttive strutturali legacy
- [x] uso di almeno una variabile implicita (`$odd`)

Esito: ✅ 5/5 — dettagli in `REPORT/ex02-cosa-ho-imparato.md`

## Come provare
`/ex02` — cambia il filtro e verifica badge, righe alternate, stato vuoto e messaggio finale.
