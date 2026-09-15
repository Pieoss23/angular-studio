# Esercizio 13 — Direttive custom + Directive Composition API

## Argomento

Una direttiva attributo aggiunge comportamento a un elemento esistente senza introdurre un nuovo
tag nel DOM. Nello stile moderno di Angular gli host binding ed event listener non passano più
dai decoratori `@HostBinding`/`@HostListener`, ma da un unico oggetto `host` nel decoratore
`@Directive` (o `@Component`).

La **Directive Composition API** (`hostDirectives`) va oltre: permette a un componente di
comporre altre direttive sul proprio host element, così i suoi consumer ottengono quel
comportamento "gratis", senza applicarlo esplicitamente nel loro template.

## Concetti da conoscere

- `host: { '(mouseenter)': 'metodo()', '[style.background-color]': 'espressione()' }`
- i binding dentro `host` valutano espressioni sulla classe della direttiva: i membri
  referenziati devono essere `protected` o `public`, mai `private`
- in un'app **zoneless** (come questa) un campo mutabile normale non fa ridisegnare la UI: le
  proprietà che cambiano nel tempo vanno tenute come `signal`
- `hostDirectives: [Direttiva, { directive: Altra, inputs: ['nomeInput'] }]` nel decoratore di un
  componente
- senza `inputs: [...]` l'input della direttiva composta resta interno: il consumer del
  componente non può impostarlo dal proprio template
- se una direttiva composta è **anche** importata direttamente altrove nello stesso template
  (perché la usi anche "a mano" su un altro elemento), esporre il suo input con lo stesso nome
  del selettore (`inputs: ['appHighlight']` per `[appHighlight]`) crea un rischio concreto di
  doppio matching sullo stesso host — meglio rinominarlo (`inputs: ['appHighlight: highlightColor']`)

## Scenario

- `HighlightDirective` (`[appHighlight]`) evidenzia lo sfondo al passaggio del mouse; il colore è
  configurabile via input.
- `FocusRingDirective` (già completa) aggiunge un outline quando l'host riceve il focus.
- `FancyButton` deve comporre entrambe sul proprio host element, così `<app-fancy-button>` le
  ottiene senza che il consumer scriva `[appHighlight]` o `[appFocusRing]`.

## Cosa devi fare

### `highlight.directive.ts`

Aggiungi l'oggetto `host` al decoratore:

```ts
host: {
  '(mouseenter)': 'onEnter()',
  '(mouseleave)': 'onLeave()',
  '[style.background-color]': 'bg()',
  '[style.cursor]': "'pointer'",
},
```

### `fancy-button.ts`

Aggiungi `hostDirectives`:

```ts
hostDirectives: [
  { directive: HighlightDirective, inputs: ['appHighlight: highlightColor'] },
  FocusRingDirective,
],
```

`'appHighlight: highlightColor'` rinomina l'input esposto da `FancyButton` in `highlightColor`.
Non lasciarlo come `appHighlight`: questo file (`ex13-custom-directives.ts`) importa
`HighlightDirective` anche direttamente per il box qui sopra, quindi il selettore `[appHighlight]`
è attivo su **tutto** il template — se `<app-fancy-button>` porta un attributo `appHighlight`,
la direttiva ci matcherebbe due volte sullo stesso host (una per il selettore diretto, una per la
composizione) e Angular lancia `NG0309: Directive matches multiple times on the same element`.

## Criteri di valutazione

- [ ] il box con `[appHighlight]` diretto cambia sfondo al passaggio del mouse
- [ ] `FancyButton` cambia sfondo al hover, pur senza che il template lo usi esplicitamente
- [ ] `FancyButton` mostra un outline quando riceve il focus (prova con Tab da tastiera)
- [ ] l'attributo `highlightColor="#8fd9ff"` su `<app-fancy-button>` cambia davvero il colore

## Come provare

`/ex13`: passa il mouse sul box in alto e sul bottone in basso (sfondo verde/azzurro). Poi premi
Tab per spostare il focus da tastiera fino al bottone: deve comparire l'outline.

## Trappole

- Un binding in `host` che referenzia un membro `private` fallisce in fase di compilazione del
  template: usa `protected`.
- `hostDirectives` applica le direttive all'host del componente (il tag `<app-fancy-button>`),
  **non** a un elemento dentro il suo template interno.
- Se dimentichi `inputs: [...]`, l'input `appHighlight` composto resta fisso al suo default: il
  consumer che scrive `appHighlight="..."` sul componente non ottiene nessun effetto.
- Se una direttiva composta è anche importata direttamente nello stesso template ed esponi il suo
  input col nome originale del selettore, ottieni `NG0309: Directive matches multiple times on
  the same element` — la direttiva viene applicata due volte allo stesso host. Rinomina l'input
  con la sintassi `'nomeOriginale: alias'`.
