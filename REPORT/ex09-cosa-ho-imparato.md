# Esercizio 9 — Cosa ho imparato

**Data valutazione:** 2026-09-10
**Esito:** ✅ completato (bonus incluso)
**Punteggio criteri:** 5 / 5 (+ bonus)

## Criteri (check finale)
- [x] `HeavyChart` usato solo dentro blocchi `@defer`
- [x] `@placeholder` e `@loading (minimum 500ms)` presenti sul primo blocco
- [x] usati `on viewport` **e** `on interaction(showDetails)`
- [x] verificato in build un chunk JS separato per `HeavyChart`
- [x] il `console.log` di `HeavyChart` compare solo al caricamento del chunk
- [x] **bonus**: `prefetch on idle` aggiunto al primo blocco

## Codice finale

```html
@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder {
  <div style="height: 160px">Scorri per caricare il grafico</div>
} @loading (minimum 500ms) {
  <p>Carico il modulo…</p>
}

<button #showDetails class="btn">mostra dettagli</button>
@defer (on interaction(showDetails)) {
  <app-heavy-chart mode="details" />
} @placeholder {
  <span class="hint">clicca il bottone</span>
}
```

## Verifica tecnica (non solo lettura del codice)

Ho fatto girare `ng build` e cercato `HeavyChart` nei chunk generati: compare in un file separato
di ~3.6KB (`chunk-IRSNJ7NN.js`), distinto dal chunk della rotta `/ex09` (~21KB). Conferma che il
compilatore ha davvero isolato `HeavyChart` in un chunk lazy, non solo che la sintassi è corretta.

## Concetti chiave (da ricordare)

- `@defer` sposta il codice dei componenti usati **solo** al suo interno in un chunk separato:
  basta che non compaiano da nessun'altra parte nel template (anche fuori da `imports`, che può
  comunque elencare il componente senza forzarlo nel bundle iniziale).
- `on interaction(ref)` lega il trigger a una template reference variable esterna al blocco
  (`#showDetails`), non serve che il bottone sia dentro il `@defer`.
- `prefetch on idle` scarica il chunk in anticipo (quando il browser è libero) ma non lo
  renderizza finché il trigger principale (`on viewport`) non scatta: utile quando vuoi che il
  contenuto appaia istantaneo nel momento in cui l'utente ci arriva.

## Trappole verificate

Nessuna presente nel codice finale: `HeavyChart` non compare fuori dai due blocchi `@defer`, e i
`@placeholder` hanno dimensioni/contenuto sensati (niente caricamento immediato per un placeholder
a zero altezza).
