# Esercizio 30 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato (1 correzione in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] cliccando i bottoni, appaiono toast impilati con il messaggio giusto
- [x] un toast sparisce da solo dopo il timeout
- [x] cliccando "chiudi", il toast sparisce subito senza errori dopo
- [x] il toast "error" ha un aspetto visivamente diverso da "info"

## Codice finale

```ts
show(message: string, kind: 'info' | 'error' = 'info'): void {
  if (!this.host) return;
  const ref = this.host.createComponent(ToastItem);
  ref.setInput('message', message);
  ref.setInput('kind', kind);

  const remove = () => ref.destroy();
  const timer = setTimeout(remove, 1500);

  ref.instance.dismissed.subscribe(() => {
    clearTimeout(timer);
    remove();
  });
}
```

## Concetti chiave (da ricordare)

- `viewContainerRef.createComponent(Componente)` crea e monta un'istanza a runtime;
  `ref.setInput(...)` è l'unico modo corretto di impostarne gli input (mai
  `ref.instance.x = ...` diretto, bypassa la reattività dei signal input).
- Un `viewChild` non è disponibile nel constructor: `ToastHost` registra il proprio
  `ViewContainerRef` dentro `afterNextRender`, dopo il primo render.
- `ref.instance.dismissed.subscribe(...)` ascolta un `output()` direttamente dall'istanza, senza
  passare dal template.

## Errori corretti in review

**`const remove = () => ref.destroy;`** — mancava la chiamata al metodo: senza le parentesi,
l'arrow function si limitava a leggere il riferimento a `ref.destroy` e a ritornarlo, senza
eseguirlo. Sia il timeout automatico che il click su "chiudi" richiamavano questa stessa funzione
rotta, quindi nessuno dei due distruggeva mai il componente. TypeScript non lo segnalava: è
sintassi valida (`() => ref.destroy` ha tipo `() => () => void`), solo un bug logico. Corretto in
`() => ref.destroy()`.

## Trappole verificate

- Confermato che il bug era puramente logico e non di tipi: nessun errore di compilazione
  l'avrebbe intercettato.

## Approfondimenti
- https://angular.dev/guide/components/programmatic-rendering
