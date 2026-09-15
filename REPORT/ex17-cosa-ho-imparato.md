# Esercizio 17 — Cosa ho imparato

**Data valutazione:** 2026-09-14
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] i 4 test sono scritti e passano (`npm test`)
- [x] almeno un test verifica lo stato (il signal), non solo il DOM
- [x] almeno un test verifica il DOM dopo `detectChanges()`
- [x] il test sul clamp di `decrement()` fallirebbe se rimuovessi il `Math.max` (verificato)

## Codice finale

```ts
it('parte da 0', () => {
  const fixture = TestBed.createComponent(Counter);
  fixture.detectChanges();
  const counter = fixture.componentInstance;
  expect(counter.count()).toBe(0);
});

it('increment() aumenta count di 1 ogni volta', () => {
  const fixture = TestBed.createComponent(Counter);
  fixture.detectChanges();
  const counter = fixture.componentInstance;
  counter.increment();
  counter.increment();
  expect(counter.count()).toBe(2);
});

it('decrement() non va sotto zero', () => {
  const fixture = TestBed.createComponent(Counter);
  fixture.detectChanges();
  const counter = fixture.componentInstance;
  counter.decrement();
  counter.decrement();
  counter.decrement();
  expect(counter.count()).toBe(0);
});

it('il DOM mostra il valore aggiornato dopo detectChanges()', () => {
  const fixture = TestBed.createComponent(Counter);
  fixture.detectChanges();
  const counter = fixture.componentInstance;
  counter.increment();
  fixture.detectChanges();
  const span = fixture.nativeElement.querySelector('[data-testid="count"]');
  expect(span?.textContent).toContain('1');
});
```

## Concetti chiave (da ricordare)

- Il codice di un test deve stare **dentro** la callback di `it(...)`/`test(...)`. Scritto fuori
  (direttamente nel corpo del `describe`) viene eseguito una sola volta al caricamento del file,
  non tracciato da Vitest come test — resta "todo" anche se il codice "sembra" corretto.
- Un test sul DOM deve provocare un cambiamento reale (qui `increment()` + un secondo
  `detectChanges()`) prima di leggere il contenuto: verificare solo lo stato iniziale non prova
  che il binding reagisca a un aggiornamento.
- `fixture.detectChanges()` va richiamato ogni volta che lo stato cambia e si vuole che il test
  legga il DOM aggiornato: senza, il DOM resta congelato all'ultimo render osservato.

## Errori corretti in review

1. **Test scritti fuori da `it(...)`**: il primo tentativo aveva tutto il codice (creazione del
   fixture, chiamate ai metodi, `expect`) come istruzioni libere nel `describe`, con gli
   `it.todo(...)` lasciati invariati sotto. `npm test` mostrava "4 todo", zero verifiche reali —
   nessun errore, ma anche nessuna copertura. Corretto spostando ogni blocco dentro la callback
   dell'`it(...)` corrispondente.

2. **Test sul DOM che non testava un aggiornamento**: la prima versione del quarto test
   controllava che il DOM mostrasse `'0'` **al primo render**, senza mai chiamare `increment()`
   — un test che sarebbe passato anche con un binding completamente rotto dopo un cambiamento di
   stato. Corretto aggiungendo `counter.increment()` + un secondo `detectChanges()` prima
   dell'asserzione, cambiata da `'0'` a `'1'`.

## Verifica di garanzia (non solo lettura del codice)

Ho rotto temporaneamente `Math.max(0, c - 1)` in `counter.ts` (tolto il clamp) e rilanciato
`npm test`: il test "decrement() non va sotto zero" fallisce correttamente
(`expected -3 to be 0`), confermando che non è un test che passa a vuoto. Ripristinato il codice
originale subito dopo.

## Trappole verificate

- Un `describe` con solo `it.todo(...)` "passa" senza controllare nulla — bisogna guardare il
  conteggio (`4 todo` vs `4 passed`), non solo l'assenza di errori rossi.
- Un test che legge il DOM senza prima cambiare lo stato verifica solo il render iniziale, non la
  reattività del binding.

## Approfondimenti
- https://angular.dev/guide/testing/components-basics
- https://vitest.dev/api/#test-todo
