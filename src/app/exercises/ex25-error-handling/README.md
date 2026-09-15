# Esercizio 25 — Error handling: `ErrorHandler` globale + `catchError`/`retry`

## Argomento

Due livelli di gestione errori, complementari:

- un `ErrorHandler` custom (provider a livello di app) è la rete di sicurezza globale — cattura
  qualunque errore non gestito che "sfugge" da un event handler o da un ciclo di change
  detection, e lo fa passare da un unico punto (log centralizzato, reporting a un servizio
  esterno...)
- `catchError`/`retry` di RxJS gestiscono errori puntuali e **attesi** di un singolo flusso
  asincrono (una chiamata HTTP che può fallire), **prima** che diventino un errore non gestito

## Concetti da conoscere

- `{ provide: ErrorHandler, useClass: AppErrorHandler }` — sostituisce l'`ErrorHandler` di
  default (già collegato in `app.config.ts`)
- `class AppErrorHandler implements ErrorHandler { handleError(error) { ... } }`
- `retry({ count: 2, delay: 300 })` — ritenta l'observable fino a 2 volte, aspettando 300ms tra
  un tentativo e l'altro
- `catchError(err => of(fallback))` — intercetta l'errore **dopo** che i retry sono esauriti, e
  lo trasforma in un valore normale: l'observable non va mai in errore verso chi si iscrive

## Scenario

Bottone 1: lancia un errore sincrono in un click handler, senza try/catch — deve essere
l'`ErrorHandler` globale ad accorgersene. Bottone 2: chiama un URL inesistente con `HttpClient`,
con retry e fallback.

## Cosa devi fare

### `app-error-handler.ts`

```ts
handleError(error: unknown): void {
  console.error(error);
  this.log.log(error instanceof Error ? error.message : String(error));
}
```

### `ex25-error-handling.ts`

Nella pipe di `fetchFlaky()`:

```ts
.pipe(
  retry({ count: 2, delay: 300 }),
  catchError(() => {
    this.errorLog.log('fetchFlaky: fallback dopo i retry');
    return of(null);
  }),
)
```

## Criteri di valutazione

- [ ] cliccando "lancia errore", l'app non si blocca e l'errore compare nel log
- [ ] cliccando "chiamata che fallisce", vedi 3 tentativi (1 + 2 retry) prima del fallback
- [ ] dopo il fallback, la UI mostra "servizio non disponibile" invece di un errore non gestito
      in console

## Come provare

`/ex25`: clicca entrambi i bottoni, guarda il log errori e il contatore tentativi. Apri anche la
console: il primo bottone deve comparire lì (via `console.error` dentro l'`ErrorHandler`), il
secondo no — l'errore HTTP è gestito con `catchError`, non arriva mai all'`ErrorHandler` globale.

## Trappole

- Un errore intercettato con `catchError` **non** arriva all'`ErrorHandler` globale: sono due
  meccanismi separati, il secondo si attiva solo per errori non gestiti altrove nella pipeline.
- `retry` senza `delay` riprova immediatamente, a raffica: con un servizio davvero down è
  controproducente (aggiunge carico), meglio sempre un ritardo tra i tentativi.
