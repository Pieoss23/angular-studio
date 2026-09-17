# Esercizio 24 — Cosa ho imparato

**Data valutazione:** 2026-09-16
**Esito:** ✅ completato (1 correzione in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] digitando in fretta, appare un solo "elaboro: ..." per l'ultima query
- [x] toggling "verbose" da solo non aggiunge righe al log dell'elaborazione
- [x] impostare `filters` con valori identici non incrementa il contatore di update
- [x] impostare `filters` con un valore diverso incrementa il contatore

## Codice finale

```ts
protected readonly filters = signal<Filters>(
  { status: 'active', tag: 'a' },
  { equal: (a, b) => a.status === b.status && a.tag === b.tag },
);

constructor() {
  effect((onCleanup) => {
    const q = this.query();
    const verbose = untracked(() => this.verbose());
    const id = setTimeout(() => {
      if (verbose) this.log.update((l) => [...l, `(verbose) query cambiata: "${q}"`]);
      this.log.update((l) => [...l, `elaboro: "${q}"`]);
    }, 500);
    onCleanup(() => clearTimeout(id));
  });

  effect(() => {
    this.filters();
    this.updateCount.update((c) => c + 1);
  });
}
```

## Concetti chiave (da ricordare)

- `effect((onCleanup) => ...)`: la funzione passata a `onCleanup` gira prima della prossima
  esecuzione dell'effect (o alla distruzione), utile per annullare lavoro asincrono in sospeso —
  qui un `setTimeout` di debounce senza bisogno di RxJS.
- `untracked(() => this.altroSignal())` legge un valore senza registrarlo come dipendenza:
  l'effect continua a reagire solo ai signal letti "normalmente" al suo interno.
- L'opzione `equal` di un signal va sulla dichiarazione del signal **effettivamente usato**:
  crearne una copia con l'opzione giusta ma un nome diverso non ha alcun effetto se il resto del
  codice continua a leggere/scrivere l'originale.

## Errori corretti in review

1. **`equal` su un signal scollegato**: il primo tentativo aggiungeva il comparatore custom a un
   nuovo signal chiamato `filter` (singolare), invece che su `filters` (plurale) — quello
   realmente letto nel template, nei due bottoni e nel secondo `effect()`. Il signal `filters`
   restava quindi con il confronto di default (`Object.is`), e ogni `.set()` con un oggetto nuovo
   — anche a parità di contenuto — faceva comunque scattare l'effect a valle. Risolto spostando
   l'opzione sulla dichiarazione giusta e rimuovendo il campo duplicato.

2. **Import inutilizzato**: `single` da `rxjs`, non usato da nessuna parte — rimosso.

## Trappole verificate

- Un signal "corretto" ma non collegato al resto del componente è un bug silenzioso: TypeScript
  non lo segnala (è codice valido), va scoperto solo verificando il comportamento reale
  dell'interfaccia.
- Verificato che il debounce funziona davvero: digitando in fretta appare un solo log, non uno
  per lettera.

## Approfondimenti
- https://angular.dev/guide/signals#reading-without-tracking-dependencies
- https://angular.dev/api/core/effect
