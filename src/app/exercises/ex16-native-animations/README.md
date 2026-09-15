# Esercizio 16 — Animazioni native: `animate.enter` / `animate.leave`

## Argomento

Angular non richiede più il pacchetto `@angular/animations` per i casi comuni di enter/leave.
Gli attributi `animate.enter` e `animate.leave` applicano classi CSS quando un elemento compare o
sta per sparire dal DOM (tipicamente dentro un `@if`/`@for`), e Angular aspetta che la
transizione o l'animazione CSS finisca **davvero** prima di rimuovere l'elemento — niente più
"scompare di scatto mentre l'animazione è a metà".

## Concetti da conoscere

- `animate.enter="classe"` — la classe viene applicata quando l'elemento entra nel DOM; Angular
  la rimuove da solo quando l'animazione finisce
- `animate.leave="classe"` — la classe viene applicata quando l'elemento dovrebbe sparire;
  Angular rimuove il nodo dal DOM solo **dopo** che l'animazione/transizione più lunga è finita
- la classe deve avere una vera `@keyframes` animation o una `transition` CSS: senza CSS che la
  usa, l'elemento entra/esce senza nessun effetto
- si possono applicare più classi insieme: `animate.enter="fade-in slide-in"`
- non serve importare nessun modulo, funziona anche in un'app zoneless come questa

## Scenario

Una lista di notifiche "toast": il bottone "aggiungi" ne crea una nuova, la ✕ la rimuove.

## Cosa devi fare

### Template

Sul `<li>` dentro il `@for`, aggiungi:

```html
<li class="card" animate.enter="toast-in" animate.leave="toast-out" ...>
```

### Styles

Nel blocco `styles` del componente, scommenta/scrivi le due animazioni:

```css
@keyframes toast-in {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(24px); }
}
.toast-in { animation: toast-in 250ms ease; }
.toast-out { animation: toast-out 250ms ease; }
```

## Criteri di valutazione

- [x] un nuovo toast entra con un'animazione visibile, non compare di scatto
- [x] un toast rimosso esce con un'animazione, non sparisce di scatto
- [x] il `<li>` resta davvero nel DOM (verificabile in DevTools) finché l'animazione di uscita
      non è finita

## Come provare

`/ex16`: clicca "aggiungi notifica" un paio di volte, poi clicca ✕ su un toast. Con DevTools →
Elements puoi osservare la classe `toast-out` comparire sul `<li>` e il nodo restare nel DOM per
tutta la durata dell'animazione (250ms) prima di sparire.

## Trappole

- Se la classe collegata a `animate.enter`/`animate.leave` non ha nessuna `animation` o
  `transition` associata, Angular non ha nulla da aspettare: rimuove il nodo immediatamente.
- Usa `track t.id` nel `@for` (già presente): senza un `track` stabile, Angular può ricreare gli
  elementi invece di animarli in place, e le animazioni di enter/leave non partono come previsto.
