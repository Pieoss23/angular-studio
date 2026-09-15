# Esercizio 19 — DOM diretto dopo il render: `afterRenderEffect`

## Argomento

Alcune cose si possono fare solo quando il DOM esiste davvero: disegnare su un `<canvas>`,
misurare le dimensioni di un elemento, integrare una libreria non-Angular che si aspetta un nodo
DOM reale. `afterRenderEffect()` registra una callback che gira **dopo** ogni ciclo di render, ed
è anche un *effect*: se leggi un signal al suo interno, si ri-esegue automaticamente ogni volta
che quel signal cambia — niente `ngOnChanges` o `ngAfterViewChecked` scritti a mano.

## Concetti da conoscere

- `afterRenderEffect(() => { ... })` — va chiamato in injection context (constructor o
  inizializzatore di campo), di solito nel componente che possiede il DOM da toccare
- leggere un signal dentro la callback la rende reattiva: si ri-esegue a ogni cambiamento, come
  `effect()`, ma **dopo** che Angular ha aggiornato il DOM
- `viewChild.required('ref')` — riferimento reale all'elemento DOM (qui il `<canvas>`), disponibile
  solo dopo il primo render
- `host: { '[attr.aria-label]': "'...'" }` — binding sull'host element del componente stesso,
  definito nel decoratore invece che nel template (utile per attributi che non dipendono da un
  elemento interno)

## Scenario

`BarChart` riceve un array di numeri via input e li disegna come barre su un `<canvas>`. Il
metodo `draw()` che fa il lavoro grafico è già pronto: manca solo collegarlo al momento giusto.

## Cosa devi fare

In `bar-chart.ts`, aggiungi come inizializzatore di campo:

```ts
constructor() {
  afterRenderEffect(() => {
    this.draw(this.canvasRef().nativeElement, this.values());
  });
}
```

(va bene anche come campo di classe con una arrow function assegnata direttamente, l'importante è
che giri in injection context).

## Criteri di valutazione

- [ ] al primo render il grafico mostra già le barre iniziali (non resta vuoto)
- [ ] cliccando "randomizza", le barre si ridisegnano da sole, senza altro codice di collegamento
- [ ] nessun errore in console del tipo "cannot read properties of null" legato al canvas

## Come provare

`/ex19`: al caricamento della pagina il grafico mostra già dei valori. Clicca "randomizza" più
volte e osserva le barre cambiare.

## Trappole

- Se provi a disegnare sul canvas **fuori** da `afterRenderEffect` (es. direttamente nel
  constructor, fuori dalla callback), `viewChild` potrebbe non essere ancora popolato: il DOM non
  esiste finché Angular non ha completato il primo render.
- Se non leggi `this.values()` (chiamandola) dentro la callback, l'effect non "vede" i
  cambiamenti e non si ri-esegue quando l'input cambia — anche se il dato è tecnicamente
  disponibile.
