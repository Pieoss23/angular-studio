# Esercizio 11 — Cosa ho imparato

**Data valutazione:** 2026-09-11
**Esito:** ✅ completato (bonus incluso)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] tre zone (titolo/corpo/azioni) rese correttamente nella prima card
- [x] il corpo (slot default) contiene tutto ciò che non ha un attributo dedicato
- [x] `ngProjectAs` usato nella seconda card per il titolo
- [x] nessun contenuto proiettato "sparisce" o finisce nello slot sbagliato
- [x] bonus: hint "(nessun titolo)" mostrato solo quando manca davvero un titolo proiettato

## Codice finale

```html
<!-- card.ts -->
<ng-content select="[card-title]" />
...
<ng-content select="[card-actions]" />
```

```html
<!-- ex11-content-projection.ts, seconda card -->
<h2 ngProjectAs="[card-title]" #cardTitle>Seconda card (via ngProjectAs)</h2>
```

## Concetti chiave (da ricordare)

- `select` guarda solo gli elementi **top-level** passati dal consumer, in base a un selettore
  CSS (tag, `[attributo]`, `.classe`). Il resto finisce nello slot di default.
- `ngProjectAs` non aggiunge nulla al DOM reale: dice solo al compilatore "tratta questo elemento
  come se avesse quel selettore" ai fini del matching della projection.
- Il bonus (`contentChild('cardTitle')`) richiede che la **stessa** template reference
  (`#cardTitle`) sia presente su ogni elemento che deve contare come "titolo proiettato" — sia
  sullo `<span card-title>` semplice sia sull'`<h2>` con `ngProjectAs`. Dimenticarla su uno dei
  due fa restare l'hint visibile anche quando un titolo è tecnicamente presente.

## Trappole verificate

Nessuna: la terza card (senza titolo né azioni) mostra correttamente l'hint e un footer vuoto,
senza errori in console.

## Approfondimenti
- https://angular.dev/guide/components/content-projection
