# Esercizio 6 — Cosa ho imparato

**Data valutazione:** 2026-09-09
**Esito:** ✅ completato — **bonus incluso**
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] `selectedId` è un `linkedSignal` (non `computed` + `effect` che fa `.set()`)
- [x] cambiando categoria la selezione si aggiorna da sola
- [x] `select()` la può comunque sovrascrivere
- [x] `selected` è un `computed` puro
- [x] bonus: la forma `previous` conserva la scelta valida

## Cosa hai scritto

```ts
readonly selectedId = linkedSignal<Product[], number | null>({
  source: () => this.visible(),
  computation: (newVisible, previous) => {
    const prevId = previous?.value;
    const isStillVisible = prevId ? newVisible.some(p => p.id === prevId) : false;
    return isStillVisible ? (prevId as number) : (newVisible[0]?.id ?? null);
  }
});

readonly selected = computed<Product | null>(() =>
  this.products().find(p => p.id === this.selectedId()) ?? null);

select(id: number) { this.selectedId.set(id); }
```

Sei andato direttamente alla forma estesa (bonus). Corretto e idiomatico.

## Concetti chiave (da ricordare)

- `linkedSignal` = **`computed` + scrivibilità**. Deriva un valore da una sorgente reattiva, ma
  resta un `WritableSignal`: `.set()` / `.update()` lo sovrascrivono **fino alla prossima
  variazione della sorgente**, poi torna a derivare.
- Due forme:
  - breve: `linkedSignal(() => expr)` — il valore segue `expr`.
  - estesa: `linkedSignal({ source, computation: (source, previous) => ... })` — `previous` è
    `{ source, value }` del calcolo precedente (o `undefined` al primo giro).
- Caso d'uso canonico (quello dell'esercizio): un valore controllato dall'utente che ha senso
  **resettare quando cambia il contesto** — selezione in lista al cambio filtro, tab attivo al
  cambio dei tab, variante al cambio prodotto.
- La `computation` deve essere **pura** come quella di un `computed`.

## Perché non `computed` + `effect`

Prima di `linkedSignal` si faceva:
```ts
selectedId = signal<number | null>(null);
constructor() {
  effect(() => { this.selectedId.set(this.visible()[0]?.id ?? null); }); // ⚠️ anti-pattern
}
```
Problemi: effetto che **scrive** stato (sconsigliato), ordine di esecuzione fragile rispetto ad
altri effect/computed, e `selectedId` non è più "collegato" alla sorgente in modo dichiarativo.

## Nit (non a punteggio)

- `prevId ? ...` è un controllo *falsy*: con id ≥ 1 va bene, ma `prevId != null` è semanticamente
  più corretto (un id `0` sarebbe un falso negativo).
- `(prevId as number)` → `prevId!` o un early-return evitano il cast.
- `source: () => this.visible()` → `source: this.visible` (è già un signal, non serve il wrapper).
- righe `// TODO` commentate da rimuovere; `;` mancante su `this.selectedId.set(id)`.

## Trappole tipiche

- Usare `linkedSignal` per stato **completamente libero** (senza sorgente da cui derivare): usa
  `signal`.
- Dimenticare che `previous` è `undefined` al primo calcolo.
- Aspettarsi che la scrittura manuale "resista" a un cambio di sorgente nella forma breve: non
  resiste, serve la forma con `previous`.

## Approfondimenti
- https://angular.dev/guide/signals/linked-signal
