import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  // Superficie pubblica in sola lettura: nessuno fuori da questo servizio può
  // fare _items.set(...) direttamente, solo leggere.
  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.qty, 0));
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.qty * i.price, 0));

  // TODO(20.1): se un item con quello 'id' esiste già, incrementa la sua qty
  // di 1 (in modo IMMUTABILE: nuovo array, nuovo oggetto item, non mutare
  // l'esistente). Se non esiste, aggiungilo con qty: 1.
  add(item: Omit<CartItem, 'qty'>): void {
    const currentItems = this._items()
    const exist = currentItems.some((i) => i.id == item.id)
    if (exist) {
      const updateItem = currentItems.map((i) => i.id === item.id ? {...i, qty: i.qty +1 }: i)
      this._items.set(updateItem);
    } else {
      this._items.set([...currentItems, { ...item, qty: 1 }]);
    }
  }

  // TODO(20.2): decrementa la qty dell'item con quell'id. Se scende a 0,
  // rimuovi del tutto l'item dall'array. Sempre in modo immutabile.
  remove(id: string): void {
    // placeholder: per ora rimuove sempre l'intero item
    const currentItems = this._items()

    const updateItem = currentItems
    .map(i => i.id === id ? {...i, qty: i.qty -1 } : i)
    .filter(i=> i.qty > 0 )
    this._items.set(updateItem);
  }

  clear(): void {
    this._items.set([]);
  }
}
