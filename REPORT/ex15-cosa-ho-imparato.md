# Esercizio 15 — Cosa ho imparato

**Data valutazione:** 2026-09-14
**Esito:** ✅ completato
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] la ricerca non parte a ogni tasto, solo dopo una pausa
- [x] `loading` mostra "cerco…" durante l'attesa dei 400ms
- [x] digitando in fretta, solo l'ultima ricerca produce risultati (switchMap)
- [x] i risultati sono un signal leggibile con `results()`, non un Observable

## Codice finale

```ts
term$ = toObservable(this.term);

results$ = this.term$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  tap(() => this.loading.set(true)),
  switchMap((term) => this.search.search(term)),
  tap(() => this.loading.set(false)),
);

protected readonly results = toSignal(this.results$, { initialValue: [] as string[] });
```

## Concetti chiave (da ricordare)

- `toObservable(signal)` va chiamato in injection context — qui come inizializzatore di campo,
  eseguito durante la costruzione del componente. Emette il valore corrente del signal a ogni
  cambiamento, in modo sincrono al momento della sottoscrizione.
- `switchMap` annulla automaticamente la richiesta interna precedente se ne arriva una nuova prima
  che completi: è la differenza pratica con `mergeMap`, che le lascerebbe correre in parallelo
  rischiando che una risposta vecchia sovrascriva una più recente.
- Un `tap()` prima e uno dopo lo `switchMap` sono un pattern comune per gestire uno stato di
  loading legato a un flusso asincrono: quello "dopo" scatta solo quando l'observable **interno**
  (la ricerca) emette/completa, non quando parte la richiesta esterna.
- `toSignal(obs$, { initialValue: [] })` chiude il cerchio: da qui in poi il componente legge solo
  `results()`, un signal, senza più bisogno di RxJS nel template.

## Trappole verificate

Nessuna: build pulita, ordine dei campi della classe corretto (`search` inizializzato prima di
`results$`, che lo usa), nessuna sottoscrizione manuale dimenticata.

## Approfondimenti
- https://angular.dev/ecosystem/rxjs-interop
- https://rxjs.dev/api/operators/switchMap
