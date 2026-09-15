# Esercizio 20 — State management: uno store con signal

## Argomento

Non serve una libreria esterna per avere uno "store" condiviso: un
`@Injectable({ providedIn: 'root' })` con signal privati e scrivibili, più `computed` derivati
esposti in sola lettura, è già un pattern completo di state management. Ogni componente che lo
inietta vede lo **stesso** stato (è un singleton applicativo), reattivo, senza passare dati su e
giù per l'albero dei componenti con input/output.

## Concetti da conoscere

- signal **privato** nel servizio (`_items`), esposto all'esterno con `.asReadonly()`: da fuori
  si può leggere ma non chiamare `.set()`/`.update()` direttamente
- `computed()` per valori derivati (`total`, `count`): si ricalcolano da soli quando `_items`
  cambia, non serve tenerli sincronizzati a mano
- **immutabilità**: ogni aggiornamento sostituisce l'array/oggetto con uno nuovo
  (`[...arr, x]`, `arr.map(...)`, `arr.filter(...)`), non lo muta in place — i signal rilevano il
  cambiamento confrontando il riferimento, non il contenuto
- metodi pubblici del servizio (`add`, `remove`, `clear`) come unica "API" per modificare lo
  stato: chi consuma lo store non tocca mai i signal interni

## Scenario

`CartStore` tiene gli articoli di un carrello. La pagina ha un catalogo finto; `CartView` (già
pronto) mostra carrello, totale e quantità totale leggendo lo store.

## Cosa devi fare

In `cart-store.ts`:

1. **`add(item)`**: se un articolo con quell'`id` è già nel carrello, incrementa la sua `qty` di
   1 invece di aggiungere una riga duplicata — sempre creando un nuovo array e un nuovo oggetto
   item, mai mutando quello esistente. Se non c'è, aggiungilo con `qty: 1` (il placeholder attuale
   fa già questa seconda parte, ma sempre, anche quando l'articolo esiste già: va corretto).
2. **`remove(id)`**: decrementa la `qty` dell'articolo di 1; se scende a 0, rimuovilo del tutto
   dall'array (il placeholder attuale rimuove sempre l'intera riga, anche con qty > 1: va
   corretto per decrementare prima).

## Criteri di valutazione

- [ ] aggiungere due volte lo stesso prodotto mostra `qty: 2` sulla stessa riga, non due righe
- [ ] il bottone "-" su un articolo con `qty: 1` lo rimuove dalla lista
- [ ] il bottone "-" su un articolo con `qty: 2` lo porta a `qty: 1`, senza rimuoverlo
- [ ] `total` e `count` restano sempre coerenti con `items`, senza ricalcoli manuali sparsi nel
      componente

## Come provare

`/ex20`: aggiungi lo stesso prodotto più volte e verifica che la quantità salga invece di
duplicare righe. Poi rimuovilo fino a 0 e verifica che la riga sparisca dal carrello.

## Trappole

- `this._items().push(x)` "funziona" nel senso che l'array esiste ancora, ma non fa scattare
  nessun aggiornamento nella UI: i signal confrontano il riferimento dell'array, non il suo
  contenuto — serve sempre un array nuovo.
- Con `providedIn: 'root'` lo store è un singleton applicativo: iniettarlo in più componenti
  (come qui, in `CartView` e in questa pagina) fa sì che condividano davvero lo stesso stato —
  è il comportamento voluto, non un bug.
