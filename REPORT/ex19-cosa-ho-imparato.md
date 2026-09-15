# Esercizio 19 — Cosa ho imparato

**Data valutazione:** 2026-09-15
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] al primo render il grafico mostra già le barre iniziali
- [x] cliccando "randomizza", le barre si ridisegnano da sole
- [x] nessun errore in console tipo "canvas is null" al primo render

## Codice finale

```ts
constructor() {
  afterRenderEffect(() => {
    this.draw(this.canvasRef().nativeElement, this.values());
  });
}
```

## Concetti chiave (da ricordare)

- `afterRenderEffect()` gira dopo ogni ciclo di render, quando il DOM (e quindi
  `viewChild.required('canvas')`) esiste davvero — l'unico punto sicuro per disegnare su un
  `<canvas>`.
- Leggere `this.values()` dentro la callback la rende reattiva: l'effect si ri-esegue da solo ad
  ogni cambio dell'input, senza bisogno di `ngOnChanges` o sottoscrizioni manuali.
- Un host binding statico (`[attr.aria-label]` nel decoratore) non dipende da nessuno stato:
  resta fisso, a differenza dei binding dinamici legati a signal.

## Trappole verificate

Nessuna: build pulita, nessun errore di accesso al canvas prima che esista.

## Approfondimenti
- https://angular.dev/api/core/afterRenderEffect
