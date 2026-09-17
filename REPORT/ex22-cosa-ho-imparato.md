# Esercizio 22 — Cosa ho imparato

**Data valutazione:** 2026-09-16
**Esito:** ✅ completato (bonus incluso)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] con `loggedOut()` a `false`, il messaggio "sei loggato" è visibile
- [x] attivando "logout" il messaggio sparisce dal DOM (non solo nascosto via CSS)
- [x] riattivando "login" il messaggio ricompare
- [x] bonus: `*appRepeat="5; let i = index"` genera 5 righe numerate 0-4

## Codice finale

```ts
// unless.directive.ts
constructor(
  private readonly templateRef: TemplateRef<unknown>,
  private readonly viewContainerRef: ViewContainerRef,
) {
  effect(() => {
    const hide = this.appUnless();
    if (!hide && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (hide && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  });
}
```

```ts
// repeat.directive.ts
effect(() => {
  const count = this.appRepeat();
  this.viewContainerRef.clear();
  for (let i = 0; i < count; i++) {
    this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: i, index: i });
  }
});
```

## Concetti chiave (da ricordare)

- `*direttiva` è zucchero sintattico per `<ng-template [direttiva]="...">`: la direttiva riceve
  il `TemplateRef` di quel contenuto e decide quando/quante volte istanziarlo nel
  `ViewContainerRef`.
- Un flag locale (`hasView`, fuori dal signal) evita lavoro ridondante: l'effect gira ad ogni
  cambio del signal, ma tocca il DOM solo quando lo stato "vista presente/assente" cambia
  davvero.
- Un context object passato a `createEmbeddedView(tpl, ctx)` espone variabili al template:
  `$implicit` è quella senza nome (`let x`), le altre si leggono con `let i = index`.

## Trappole verificate

Nessuna: build pulita, il messaggio sparisce davvero dal DOM (non solo nascosto via `hidden`/CSS)
quando `*appUnless` nasconde il contenuto.

## Approfondimenti
- https://angular.dev/guide/directives/structural-directives
