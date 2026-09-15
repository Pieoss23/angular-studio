# Esercizio 16 — Cosa ho imparato

**Data valutazione:** 2026-09-14
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] un nuovo toast entra con un'animazione visibile, non compare di scatto
- [x] un toast rimosso esce con un'animazione, non sparisce di scatto
- [x] il `<li>` resta davvero nel DOM finché l'animazione di uscita non è finita

## Codice finale

```html
<li animate.enter="toast-in" animate.leave="toast-out" class="card" ...>
```

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

## Concetti chiave (da ricordare)

- `animate.enter`/`animate.leave` applicano classi CSS quando un elemento compare/sta per sparire
  dal DOM (tipicamente dentro `@if`/`@for`) — niente `@angular/animations` da importare, funziona
  anche zoneless.
- Angular aspetta che l'`animation`/`transition` collegata alla classe finisca **davvero** prima
  di rimuovere il nodo: per `animate.leave` questo significa che l'elemento resta nel DOM per
  tutta la durata dell'animazione, verificabile in DevTools.
- Senza CSS (`@keyframes`/`animation` o `transition`) collegato alla classe, Angular non ha nulla
  da aspettare e il nodo compare/sparisce di scatto.

## Trappole verificate

Nessuna: build pulita, `track t.id` presente nel `@for` (necessario per animare in place invece
di ricreare gli elementi).

## Approfondimenti
- https://angular.dev/guide/animations
