# Esercizio 2 — Cosa ho imparato

**Data valutazione:** 2026-09-08
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] `track` corretto (per id, non `$index`)
- [x] `@empty` funzionante filtrando fino a lista vuota
- [x] `@switch` con `@default`
- [x] nessun import di direttive strutturali legacy
- [x] uso di almeno una variabile implicita (`$odd`)

## Cosa hai fatto bene
- `@for (task of visibleTasks(); track task.id)` — `track` su id stabile, non su `$index`.
- `@if / @else` sul contatore, pulito.
- Nessun `CommonModule` / direttiva strutturale negli `imports`: il nuovo control flow è built-in.
- `@case ('todo')` con espressione tra parentesi.

## Errori corretti in review
1. **Mancava `@default`** nello `@switch` (criterio 3). Anche se `status` oggi è un'unione
   esaustiva di 3 valori, senza `@default` un valore fuori lista non renderizza nulla.
2. **Regressione sulle righe alternate**: `[class.odd]="$first"` evidenziava solo la prima
   riga. Corretto in `[class.odd]="$odd"` (consegna punto 2.2).
3. Rimossi i commenti `<!-- TODO(2.x) -->` rimasti nel template.

## Concetti chiave (da ricordare)
- `@if` / `@for` / `@switch` / `@empty` sono **sintassi del compilatore**: niente import,
  niente `NgIf`/`NgForOf`/`NgSwitch`. `*ngIf` & co. sono deprecati.
- In `@for` il **`track` è obbligatorio**. Deve identificare l'elemento in modo stabile
  (tipicamente `item.id`) → Angular riusa i nodi DOM invece di ricrearli.
  `track $index` va bene solo per liste immutabili che non si riordinano.
- Variabili implicite già pronte in `@for`: `$index`, `$first`, `$last`, `$even`, `$odd`,
  `$count`. Si possono aliasare: `@for (x of xs; track x.id; let i = $index)`.
- `@empty { }` si riferisce alla collezione dell'`@for` immediatamente precedente.
- `@switch` usa confronto `===`; senza `@default` e senza match → nessun output.

## Trappole tipiche
- Dimenticare `track` → errore di compilazione (in passato solo warning di performance).
- Usare `$index` come `track` su liste filtrate/ordinate → bug di stato sui componenti figli
  (checkbox che "saltano", input che perdono focus).
- Mettere logica pesante nell'espressione di `@if`/`@for`: viene rivalutata a ogni CD →
  meglio un `computed`.
- Un `{` letterale nel testo del template va escapato (`{{ '{' }}`) o evitato: il parser
  lo interpreta come messaggio ICU.

## Approfondimenti
- https://angular.dev/guide/templates/control-flow
- https://angular.dev/guide/templates/control-flow#track
