# Esercizio 6 — `linkedSignal`: stato derivato *ma scrivibile*

## Argomento

`linkedSignal` colma un buco tra `signal` e `computed`.

- Un `computed` è **derivato** (si ricalcola quando cambiano le sue dipendenze) ma è **read-only**:
  non puoi sovrascriverlo.
- Un `signal` è **scrivibile** ma **non derivato**: se lo inizializzi da un altro valore, quel
  legame si perde dopo il primo render.

`linkedSignal` è **entrambe le cose**: parte da un valore calcolato *e* si ricalcola quando le
dipendenze cambiano, ma nel frattempo puoi anche assegnarlo a mano con `.set()` / `.update()`.
Alla successiva variazione della sorgente, la tua scrittura manuale viene sostituita dal nuovo
valore derivato (a meno che tu non usi la forma con `previous`, vedi sotto).

**Caso d'uso tipico:** un valore che l'utente controlla ma che ha senso *resettare* quando cambia
il contesto — la riga selezionata in una tabella quando cambi il filtro, il tab attivo quando
cambia l'insieme dei tab, la variante scelta di un prodotto quando cambi prodotto.

Prima di `linkedSignal` questo si faceva con `computed` + `effect` che chiamava `.set()`: funziona
ma è un anti-pattern (effetti che scrivono stato, ordine di esecuzione fragile).

## Concetti da conoscere

- `linkedSignal(() => expr)` — forma breve: il valore segue `expr`; resta scrivibile.
- `linkedSignal({ source, computation: (source, previous) => ... })` — forma estesa: `previous`
  contiene `{ source, value }` del calcolo precedente, utile per **conservare** la scelta se
  è ancora valida.
- si legge e si scrive **come un `signal`**: `x()`, `x.set(v)`, `x.update(fn)`.
- è un `WritableSignal`, quindi puoi passarlo a `[(ngModel)]` / `model` ecc.

## Scenario

Un catalogo prodotti con un filtro per categoria. Sotto il filtro c'è la lista dei prodotti
visibili e, in basso, il prodotto selezionato. Quando l'utente cambia categoria, la selezione
corrente spesso non ha più senso (il prodotto non è più in lista): vogliamo che torni
automaticamente al primo prodotto visibile, **senza** perdere la possibilità per l'utente di
sceglierne un altro cliccando.

`category`, `products` e il `computed` `visible` sono già pronti.

## Cosa devi fare

Nel file `ex06-linked-signal.ts`:

1. **`selectedId`** — trasformalo da `signal` a `linkedSignal`:
   ```ts
   readonly selectedId = linkedSignal(() => this.visible()[0]?.id ?? null);
   ```
   Così, ad ogni cambio di `visible()`, la selezione torna al primo elemento.

2. **`select(id)`** — deve permettere all'utente di sovrascrivere la selezione derivata:
   ```ts
   select(id: number) { this.selectedId.set(id); }
   ```

3. **`selected`** — `computed` che ritorna il `Product` con `id === selectedId()`, oppure `null`.

4. **(bonus)** Passa alla forma estesa per **mantenere** la selezione dell'utente se il prodotto
   è ancora presente nella nuova lista, altrimenti ripiega sul primo:
   ```ts
   readonly selectedId = linkedSignal<Product[], number | null>({
     source: this.visible,
     computation: (list, previous) => {
       const keep = previous && list.some((p) => p.id === previous.value);
       return keep ? previous!.value : (list[0]?.id ?? null);
     },
   });
   ```

## Criteri di valutazione

- [ ] `selectedId` è un `linkedSignal` (non `computed` + `effect` che fa `.set()`)
- [ ] cambiando categoria la selezione si aggiorna da sola…
- [ ] …e `select()` la può comunque sovrascrivere
- [ ] `selected` è un `computed` puro (nessun side-effect)
- [ ] bonus: con la forma `previous` la scelta valida viene conservata

## Come provare

`npm start` → `/ex06`.
1. Con "tutte" selezionato, il primo prodotto (Mele) è evidenziato.
2. Clicca "Carote": ora è selezionato Carote.
3. Cambia categoria in "frutta": la selezione torna a "Mele" (forma breve) **oppure** — se hai
   fatto il bonus e selezioni un prodotto poi cambi in "tutte" — resta quello che avevi scelto.

## Trappole

- `linkedSignal` **non** è per lo stato completamente libero: se non c'è una sorgente da cui
  derivare, usa `signal`.
- La computazione deve essere **pura** come quella di un `computed`: niente `console.log`, niente
  chiamate HTTP.
- Nella forma estesa, `previous` è `undefined` al primo calcolo: gestiscilo.
