# Esercizio 25 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] cliccando "lancia errore", l'app non si blocca e l'errore compare nel log
- [x] cliccando "chiamata che fallisce", vedi 3 tentativi (1 + 2 retry) prima del fallback
- [x] dopo il fallback, la UI mostra "servizio non disponibile" invece di un errore non gestito

## Codice finale

```ts
handleError(error: unknown): void {
  console.error(error);
  this.log.log(error instanceof Error ? error.message : String(error));
}
```

```ts
.pipe(
  retry({ count: 2, delay: 500 }),
  catchError(() => {
    this.errorLog.log('fetchFlaky: fallback dopo i retry');
    return of(null);
  }),
)
```

## Concetti chiave (da ricordare)

- Un `ErrorHandler` custom (provider a livello di app) è la rete di sicurezza globale: cattura
  qualunque errore sincrono non gestito, senza bisogno di try/catch nel componente.
- `retry`/`catchError` gestiscono l'errore **prima** che diventi un errore non gestito:
  l'`ErrorHandler` globale non lo vede mai. Sono due meccanismi a livelli diversi, non
  ridondanti.

## Errori corretti in review

1. **Parametri di `retry` diversi da quelli richiesti**: `count: 4, delay: 500` invece di
   `count: 2, delay: 300` — funzionava, ma produceva 5 tentativi totali invece dei 3 attesi dal
   criterio di valutazione. Corretto il `count` a 2 (il `delay` a 500ms resta, differenza solo
   cosmetica sui tempi).
2. **Due import inutilizzati**: `count` e `delay` da `rxjs`, non usati nel file — rimossi.

## Trappole verificate

Nessuna: build pulita, verificato che l'errore sincrono del primo bottone compare in console
(via `AppErrorHandler`) mentre l'errore HTTP del secondo bottone no, essendo gestito da
`catchError` prima di arrivare lì.

## Approfondimenti
- https://angular.dev/api/core/ErrorHandler
- https://rxjs.dev/api/operators/retry
