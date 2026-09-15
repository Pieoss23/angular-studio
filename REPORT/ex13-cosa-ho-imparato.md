# Esercizio 13 — Cosa ho imparato

**Data valutazione:** 2026-09-11
**Esito:** ✅ completato (1 correzione post-review, bug di progettazione mio non tuo)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] il box con `[appHighlight]` diretto cambia sfondo al hover
- [x] `FancyButton` cambia sfondo al hover (via hostDirectives)
- [x] `FancyButton` mostra l'outline al focus (tab da tastiera)
- [x] l'input `appHighlight` passato a `app-fancy-button` cambia il colore

## Codice finale

```ts
// highlight.directive.ts
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[style.background-color]': 'bg()',
    '[style.cursor]': "'pointer'",
  },
})
```

```ts
// fancy-button.ts
@Component({
  selector: 'app-fancy-button',
  hostDirectives: [
    { directive: HighlightDirective, inputs: ['appHighlight'] },
    FocusRingDirective,
  ],
  ...
})
```

## Concetti chiave (da ricordare)

- L'oggetto `host` nel decoratore è lo stile moderno per collegare eventi (`'(evento)': 'metodo()'`)
  e proprietà (`'[binding]': 'espressione()'`) dell'host element, al posto dei decoratori
  `@HostBinding`/`@HostListener` sui singoli membri.
- I binding in `host` valutano espressioni sull'istanza della classe: i membri usati devono
  essere `protected` o `public`. Solo lo stato che nessun binding tocca direttamente (qui
  `hovering`, letto internamente da `bg()`) può restare `private`.
- `hostDirectives` compone altre direttive sull'**host element del componente stesso** (il tag
  `<app-fancy-button>`), non su un elemento interno al suo template: chi usa il componente ottiene
  il comportamento gratis, senza applicare le direttive a mano.
- `inputs: ['appHighlight']` nella voce di `hostDirectives` "ripubblica" l'input della direttiva
  composta come input del componente ospitante — altrimenti resterebbe bloccato al suo valore di
  default, non configurabile dal consumer.

## Bug trovato dopo il primo "completato" (colpa mia, non tua)

L'esercizio, come l'avevo scaffoldato, chiedeva di esporre l'input della direttiva composta con
`inputs: ['appHighlight']` — **stesso nome** del selettore `[appHighlight]`. Il tuo codice
seguiva esattamente quell'indicazione, corretto. Il problema: in `ex13-custom-directives.ts`,
`HighlightDirective` è importata **anche direttamente** (per il box di sopra), quindi il suo
selettore è attivo su tutto il template. `<app-fancy-button appHighlight="#8fd9ff">` aveva quindi
la direttiva applicata due volte sullo stesso host — una per il matching diretto del selettore,
una per la composizione via `hostDirectives` — e Angular lanciava a runtime:

```
NG0309: Directive HighlightDirective matches multiple times on the same element.
```

Un errore che `ng build`/AOT **non** intercetta (è una regola verificata solo a runtime), quindi
non era emerso nella prima verifica. **Fix**: rinominare l'input esposto con la sintassi
`inputs: ['appHighlight: highlightColor']`, e usare `highlightColor="..."` nel template consumer
invece di `appHighlight="..."`. Così l'attributo che fa scattare il matching diretto del
selettore non è più presente su `<app-fancy-button>`: la direttiva ci arriva solo via
`hostDirectives`, una volta sola.

## Trappole verificate

- Il primo tentativo, corretto rispetto alle istruzioni originali, ha comunque prodotto
  `NG0309` per un problema di progettazione dell'esercizio (nome dell'input in collisione col
  selettore), non per un errore di implementazione.
- Build pulita, nessun errore di "member is private" sui binding, comportamento hover/focus
  verificato sia sul box diretto che sul `FancyButton` composto dopo il fix.

## Approfondimenti
- https://angular.dev/guide/directives
- https://angular.dev/guide/directives/directive-composition-api
