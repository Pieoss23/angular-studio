# Esercizio 5 — Cosa ho imparato

**Data valutazione:** 2026-09-09
**Esito:** ✅ completato (1 correzione in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] `viewChild.required` (niente `!` / undefined check manuale)
- [x] nessun `AfterViewInit`
- [x] `computed` sulla query, non lettura in un lifecycle
- [x] `effect` reagisce all'aggiunta di righe

---

## 1. Cosa hai scritto

```ts
readonly box   = viewChild.required<ElementRef<HTMLInputElement>>('box');
readonly items = viewChildren<ElementRef<HTMLLIElement>>('item');
readonly count = computed(() => this.items().length);

constructor() {
  effect(() => console.log('li visibili:', this.count()));
}

focusInput() { this.box().nativeElement.focus(); }
```

Template: `<input #box>`, `<li #item>` dentro un `@for`.

Tutto corretto tranne un dettaglio nell'`effect` (sotto).

---

## 2. Le query come signal — il modello mentale

### Prima (decorator API)
```ts
@ViewChild('box') box!: ElementRef;          // undefined finché non parte ngAfterViewInit
@ViewChildren('item') items!: QueryList<ElementRef>;

ngAfterViewInit() {
  this.box.nativeElement.focus();             // solo qui è "sicuro"
  this.items.changes.subscribe(() => ...);    // Observable separato
}
```
Problemi: campo con `!` (bugia al type system), timing legato a un lifecycle, `QueryList`
con la sua API (`.changes`, `.toArray()`, `.first`), da fare `unsubscribe`.

### Ora (signal query)
```ts
box   = viewChild.required<ElementRef>('box');   // Signal<ElementRef>
items = viewChildren<ElementRef>('item');        // Signal<readonly ElementRef[]>
```
- `viewChild(...)` **restituisce un signal**, non il valore. Lo leggi con `this.box()`.
- Si aggiorna **da solo** quando il DOM cambia (es. `@for` che aggiunge/rimuove `<li>`).
- Nessun lifecycle da aspettare: usi `computed`/`effect` e il timing lo gestisce Angular
  (le query vengono risolte prima che l'effect "post-render" giri).

### `required` vs opzionale
| | tipo | quando |
|---|---|---|
| `viewChild.required('x')` | `Signal<T>` | l'elemento c'è **sempre** nel template |
| `viewChild('x')` | `Signal<T \| undefined>` | l'elemento è dentro un `@if` / `@defer` |

Con `.required`, se leggi la query e l'elemento non esiste → **errore esplicito** (meglio di
un `undefined` che esplode 3 righe dopo).

### `viewChildren` → array, non `QueryList`
- tipo `Signal<readonly T[]>`: un normale array readonly.
- niente `.changes`: per "reagire" fai un `computed` che lo legge.
  ```ts
  count = computed(() => this.items().length);
  ```
  `count()` si ricalcola ogni volta che l'array cambia → nessuna sottoscrizione, nessun leak.

---

## 3. Cosa hai *visto* funzionare a runtime

- **`focus`**: `this.box().nativeElement.focus()` — `nativeElement` è ancora il ponte verso
  il DOM imperativo. `#box` nel template è la "reference" che la query aggancia per nome.
- **`addRow()`** fa `rows.update(r => [...r, ...])` → il `@for` renderizza un nuovo `<li #item>`
  → `items()` (signal query) si aggiorna → `count()` (computed) cambia → il template si
  aggiorna **e** l'`effect` logga il nuovo numero. Tutta la catena è reattiva, zero codice di
  "collegamento".
- In **zoneless** questo funziona proprio perché ogni anello è un signal.

---

## 4. L'errore corretto in review

```ts
// tuo:
effect(() => { console.log('li visibili', this.count) });   // ⚠️
// corretto:
effect(() => { console.log('li visibili:', this.count()) }); // ✅
```

Mancavano le `()`. Due conseguenze:
1. loggavi la **funzione signal** (`() => ...`), non il numero.
2. soprattutto: l'`effect` **non leggeva nessun signal**, quindi non aveva dipendenze da
   tracciare → **non si ri-eseguiva mai** all'aggiunta di righe (girava solo la prima volta).

È esattamente la trappola dell'esercizio 1: *un signal è una funzione, le dipendenze si
tracciano solo se lo chiami*.

---

## 5. Da ricordare / trappole

- `viewChild` legge solo la **view del componente**. Per il contenuto proiettato in
  `<ng-content>` servono `contentChild` / `contentChildren`.
- Query dentro `@if`/`@defer` → usa la forma **non** `required` (`Signal<T | undefined>`).
- Non serve (e non si deve) leggere una query dentro il `constructor` "subito": lì è ancora
  `undefined`. Leggila in un `effect`/`computed` o in un event handler.
- Opzioni utili: `viewChild('x', { read: SomeToken })` per leggere una direttiva/TemplateRef
  invece dell'`ElementRef`.
- `afterNextRender` / `afterRenderEffect` sono l'alternativa quando ti serve
  esplicitamente il "dopo che il DOM è dipinto" (misure di layout, librerie di terze parti).

## Approfondimenti
- https://angular.dev/guide/components/queries
- https://angular.dev/guide/signals/queries
- https://angular.dev/api/core/viewChild
