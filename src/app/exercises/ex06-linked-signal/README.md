# Esercizio 6 — `linkedSignal`: stato derivato ma scrivibile

## Concetti
- `linkedSignal(() => ...)` = un signal **scrivibile** che si **ri-deriva** quando cambiano
  le sue dipendenze
- forma estesa: `linkedSignal({ source, computation: (source, previous) => ... })`
- caso d'uso classico: la selezione corrente in una lista che cambia

## Consegna — file `ex06-linked-signal.ts`
`products` è un signal con l'elenco filtrabile per categoria (`category` signal, già pronto).

1. `selectedId` = `linkedSignal(() => this.visible()[0]?.id ?? null)`
   → quando cambia il filtro, la selezione torna al primo elemento visibile.
2. `select(id)` scrive `selectedId.set(id)` (selezione manuale dell'utente).
3. `selected` = `computed()` = il prodotto con `id === selectedId()` (o `null`).
4. BONUS: usa la forma con `computation: (list, prev) =>` per **mantenere** la selezione
   precedente se è ancora presente nella nuova lista, altrimenti il primo elemento.

## Criteri di valutazione
- [ ] `linkedSignal` (non `computed` + `effect` che fa `.set`)
- [ ] la selezione si resetta al cambio filtro (forma base) …
- [ ] … oppure si conserva se ancora valida (bonus con `previous`)
- [ ] `select()` sovrascrive la selezione derivata

## Come provare
`/ex06` — seleziona un prodotto, poi cambia categoria: osserva come cambia la selezione.
