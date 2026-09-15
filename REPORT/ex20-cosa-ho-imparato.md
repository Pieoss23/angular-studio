# Esercizio 20 — Cosa ho imparato

**Data valutazione:** 2026-09-15
**Esito:** ✅ completato
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] aggiungere due volte lo stesso prodotto mostra qty 2, non due righe
- [x] il bottone "-" a qty 1 rimuove la riga
- [x] `total` e `count` si aggiornano da soli, nessun ricalcolo manuale in giro
- [x] nessuna mutazione diretta dell'array

## Codice finale

```ts
add(item: Omit<CartItem, 'qty'>): void {
  const currentItems = this._items();
  const exist = currentItems.some((i) => i.id === item.id);
  if (exist) {
    const updated = currentItems.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    this._items.set(updated);
  } else {
    this._items.set([...currentItems, { ...item, qty: 1 }]);
  }
}

remove(id: string): void {
  const currentItems = this._items();
  const updated = currentItems
    .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
    .filter((i) => i.qty > 0);
  this._items.set(updated);
}
```

## Concetti chiave (da ricordare)

- `add()`: `.some()` per controllare se l'articolo esiste già, poi `.map()` per incrementarne la
  `qty` in modo immutabile (nuovo array, nuovo oggetto item) o `[...items, nuovo]` se non c'è
  ancora.
- `remove()`: `.map()` decrementa la `qty` dell'articolo giusto, poi `.filter(qty > 0)` elimina
  le righe arrivate a zero — due passaggi immutabili in sequenza, invece di una mutazione diretta
  in place.
- `total`/`count` restano `computed`: si aggiornano da soli ad ogni `add`/`remove`, senza nessun
  ricalcolo manuale nel componente che consuma lo store.

## Trappole verificate

Nessuna: build pulita, nessuna mutazione diretta dell'array (`.push`/`.splice`) sui dati interni
dello store.

## Approfondimenti
- https://angular.dev/guide/signals
