# Esercizio 17 — Testare un componente con signal: `TestBed`

## Argomento

Diverso dagli altri esercizi: qui non tocchi il template, scrivi dei **test**. `TestBed` crea
un'istanza vera del componente in un ambiente di test (JSDOM), così puoi verificare sia la logica
(chiamando i metodi e leggendo i signal direttamente) sia il risultato nel DOM.

## Concetti da conoscere

- `TestBed.createComponent(Counter)` → un `ComponentFixture<Counter>`
- `fixture.componentInstance` — l'istanza reale della classe: puoi chiamare `increment()`,
  leggere `count()`, ecc.
- `fixture.detectChanges()` — forza un ciclo di change detection. Se cambi lo stato e poi leggi
  il DOM **senza** chiamarla, vedrai ancora il render precedente.
- `fixture.nativeElement` — l'elemento host reale nel DOM di test: `querySelector`,
  `textContent`, tutto normale.
- `describe(...)` / `it(...)` / `expect(...)` sono globali forniti da Vitest (il test runner di
  questo progetto, via `@angular/build:unit-test`): non serve importarli.

## Scenario

`Counter` (`counter.ts`, già completo — provalo dal vivo nella tab "Esercizio") ha:
- `count` — un signal, parte da 0
- `increment()` — `count + 1`
- `decrement()` — `count - 1`, ma non va mai sotto 0 (clamp con `Math.max`)
- `reset()` — riporta `count` a 0

Il file da completare è `counter.spec.ts`.

## Cosa devi fare

In `counter.spec.ts` ci sono già quattro `it.todo(...)` segnaposto (passano senza controllare
nulla). Sostituiscili con quattro `it(...)` veri:

1. **stato iniziale**: crea il fixture, chiama `detectChanges()`, verifica `count()` sia `0`
2. **increment**: chiama `increment()` due volte, verifica `count()` sia `2`
3. **clamp**: da `count()` a 0, chiama `decrement()`, verifica che resti `0`
4. **DOM**: chiama `increment()`, poi `fixture.detectChanges()`, poi verifica che
   `fixture.nativeElement.querySelector('[data-testid="count"]').textContent` contenga `'1'`

## Criteri di valutazione

- [ ] i 4 test sono scritti e passano con `npm test`
- [ ] almeno un test verifica lo stato via signal, non solo il DOM
- [ ] almeno un test verifica il DOM dopo `detectChanges()`
- [ ] il test sul clamp fallisce se togli temporaneamente `Math.max(0, ...)` da `counter.ts`
      (provalo per essere sicuro che il test stia davvero verificando qualcosa)

## Come provare

```
npm test
```

Esegue Vitest. Tutti i test in `counter.spec.ts` devono passare.

## Trappole

- Dimenticare `fixture.detectChanges()` dopo un cambiamento di stato: il DOM letto resta quello
  del render precedente (di solito ancora `'0'`).
- `count` è un signal: si legge chiamandolo come funzione, `counter.count()`, non
  `counter.count`.
- Un `describe` senza nessun `it` al suo interno "passa" senza controllare nulla: assicurati che
  ogni test abbia almeno un `expect(...)`.
