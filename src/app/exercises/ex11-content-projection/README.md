# Esercizio 11 — Content projection avanzata: `ng-content`, `select`, `ngProjectAs`

## Argomento

`<ng-content />` è il modo in cui un componente lascia che sia il **consumer** a scrivere parte
del suo template. Con un solo `<ng-content />` tutto quello che il consumer mette tra i tag del
componente finisce lì. Con `select`, invece, puoi definire **più slot**: Angular guarda gli
elementi top-level passati dal consumer e li smista in base a un selettore CSS (tag, `[attributo]`,
`.classe`).

`ngProjectAs` risolve il caso in cui l'elemento da proiettare non porta già il selettore giusto:
lo forzi via direttiva, senza toccare il DOM reale.

## Concetti da conoscere

- `<ng-content />` senza `select` = slot di default, raccoglie tutto ciò che non è stato
  catturato da uno slot con `select`
- `<ng-content select="[card-title]" />` = slot dedicato a elementi con quell'attributo
- `select` può usare tag (`select="h2"`), attributi (`select="[card-title]"`) o classi
  (`select=".title"`)
- `ngProjectAs="[card-title]"` su un elemento del consumer che non ha nativamente quell'attributo
- l'ordine dei blocchi `<ng-content>` **nel template del componente** decide dove va il contenuto,
  non l'ordine con cui il consumer scrive il markup
- uno slot senza match resta vuoto, senza errori

## Scenario

`Card` (`card.ts`) è un contenitore generico con tre zone: **titolo**, **corpo** (slot di
default) e **azioni**. Il corpo è già cablato; titolo e azioni vanno completati.

## Cosa devi fare

### `card.ts`

1. Nell'header, aggiungi lo slot titolo:
   ```html
   <ng-content select="[card-title]" />
   ```
2. Nel footer, aggiungi lo slot azioni:
   ```html
   <ng-content select="[card-actions]" />
   ```
3. **(bonus)** il campo `titleRef = contentChild('cardTitle')` è già presente: usalo nell'`@if`
   per mostrare l'hint "(nessun titolo)" solo quando **non** è stato proiettato nulla con
   `#cardTitle`, invece che sempre.

### `ex11-content-projection.ts`

Nella seconda card il titolo è un `<h2>` semplice, senza l'attributo `card-title`. Aggiungigli:
```html
<h2 ngProjectAs="[card-title]" #cardTitle>Seconda card (via ngProjectAs)</h2>
```
così Angular lo instrada nello slot titolo anche se non porta l'attributo direttamente.

## Criteri di valutazione

- [ ] la prima card mostra correttamente titolo, corpo e (un) bottone azione nelle tre zone giuste
- [ ] la seconda card mostra il titolo tramite `ngProjectAs`, con due bottoni azione
- [ ] la terza card (nessun titolo, nessuna azione) non genera errori e mostra l'hint
- [ ] (bonus) l'hint "(nessun titolo)" compare solo quando manca davvero un titolo proiettato

## Come provare

`/ex11` → verifica visivamente le tre card: zone separate da bordo, titolo in alto, azioni in
basso a destra, corpo nel mezzo. La terza card deve mostrare l'hint del titolo mancante e un
footer vuoto.

## Trappole

- `select` guarda solo gli elementi **diretti** passati dal consumer: non scende dentro i loro
  figli per cercare un match.
- Un elemento proiettato finisce in **un solo** slot: il primo `<ng-content>` (nell'ordine del
  template del componente) il cui selettore combacia.
- `ngProjectAs` non aggiunge l'attributo al DOM finale: è solo un suggerimento per il matching
  della projection.
