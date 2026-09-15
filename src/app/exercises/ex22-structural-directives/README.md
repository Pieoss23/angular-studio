# Esercizio 22 — Direttiva strutturale custom: `TemplateRef` + `ViewContainerRef`

## Argomento

`@if`/`@for` hanno sostituito `*ngIf`/`*ngFor` per la stragrande maggioranza dei casi, ma capire
come funziona una direttiva strutturale (la sintassi `*direttiva`) resta utile: sotto il cofano,
il contenuto marcato con `*appUnless` viene tolto dal punto in cui è scritto e trasformato in un
`<ng-template>`. La direttiva riceve quel template (`TemplateRef`) e decide **quando** e
**quante volte** istanziarlo in un punto del DOM (`ViewContainerRef`).

## Concetti da conoscere

- `*appUnless="expr"` è zucchero sintattico per
  `<ng-template [appUnless]="expr">...</ng-template>`
- `TemplateRef` — il "timbro" del contenuto da istanziare, iniettato nel constructor della
  direttiva
- `ViewContainerRef` — il punto nel DOM dove inserire/rimuovere le viste:
  `createEmbeddedView(tpl)` la crea, `clear()` rimuove tutto ciò che è stato inserito
- un **context object** passato come secondo argomento di `createEmbeddedView(tpl, ctx)` espone
  variabili al template: la chiave `$implicit` è quella accessibile senza nome (`let x`), le
  altre si leggono con `let i = index`

## Scenario

`UnlessDirective` (`*appUnless`) è il contrario di `*ngIf`: mostra il contenuto quando
l'espressione è falsy. `RepeatDirective` (`*appRepeat`, bonus) ripete il template n volte,
passando l'indice corrente a ciascuna copia.

## Cosa devi fare

### `unless.directive.ts`

Nel constructor, dentro un `effect()`:

```ts
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
```

### `repeat.directive.ts` (bonus)

Dentro l'effect già presente, dopo `clear()`, un ciclo che crea `count` viste:

```ts
for (let i = 0; i < count; i++) {
  this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: i, index: i });
}
```

## Criteri di valutazione

- [ ] con `loggedOut()` a `false`, il messaggio "sei loggato" è visibile
- [ ] cliccando "logout" il messaggio sparisce **dal DOM** (non solo nascosto via CSS)
- [ ] ricliccando "login" il messaggio ricompare
- [ ] bonus: `*appRepeat="5; let i = index"` genera 5 righe numerate da 0 a 4

## Come provare

`/ex22`: clicca login/logout e osserva il messaggio. In DevTools → Elements verifica che quando è
"nascosto" l'elemento non è nel DOM — al suo posto c'è solo un commento (il marcatore
dell'`<ng-template>`, lo stesso meccanismo di `*ngIf`/`@if`).

## Trappole

- Ricreare la vista ad ogni esecuzione dell'effect (senza controllare `hasView`) "funziona" ma è
  sprecato: la ricreeresti anche quando il valore booleano non cambia lo stato
  "creata/non creata" (es. da `true` a `true`).
- `createEmbeddedView` senza un context object va bene solo se il template non usa `let`:
  `*appRepeat` ne ha bisogno per esporre l'indice a ogni copia.
