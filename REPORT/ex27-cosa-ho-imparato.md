# Esercizio 27 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato (1 problema di infrastruttura risolto, non del codice)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] con 0 notifiche mostra "nessuna notifica"
- [x] con 1 notifica mostra "una notifica"
- [x] con N notifiche mostra "N notifiche" con il numero interpolato
- [x] cambiando il ruolo, il badge cambia testo coerentemente

## Codice finale

```
{count(), plural, =0 {nessuna notifica} =1 {una notifica} other {{{count()}} notifiche}}
{role(), select, admin {Amministratore} editor {Redattore} other {Utente}}
```

## Concetti chiave (da ricordare)

- Le espressioni ICU (`plural`/`select`) si scrivono come testo diretto di un elemento, non
  dentro un'interpolazione `{{ }}` normale.
- `other` è l'unico caso obbligatorio: senza, il template non compila.
- Per interpolare di nuovo un valore dentro un caso servono le doppie graffe (`{{count()}}`), non
  basta scriverlo nudo.

## Problema di infrastruttura scoperto (non un bug nel codice)

Angular compila qualunque espressione ICU usando la funzione globale `$localize`, normalmente
fornita da `@angular/localize` — pacchetto che questo progetto non aveva mai installato (serve
solo per l'i18n, mai toccato prima). Il codice compilava senza errori (il compilatore genera
comunque il riferimento a `$localize`), ma a runtime, appena il componente veniva istanziato,
lanciava `ReferenceError: $localize is not defined` — bloccando l'intera vista (in un'app
zoneless, un errore non gestito durante il render blocca l'intero ciclo di change detection, non
solo il componente coinvolto).

**Fix**: installato `@angular/localize` (versione allineata a `@angular/core`) e registrato come
polyfill in `angular.json`:
```json
"polyfills": ["@angular/localize/init"]
```
Non come `import` diretto in `main.ts` — Angular lo sconsiglia esplicitamente con un warning in
build.

## Trappole verificate

- Un errore di questo tipo non è visibile né in `ng build` né nell'editor: emerge solo
  all'istanziazione reale del componente nel browser. Utile ricordarsene per qualunque feature
  Angular legata all'i18n, anche quando non si sta "facendo i18n" esplicitamente.

## Approfondimenti
- https://angular.dev/guide/i18n
- https://angular.dev/guide/templates/binding#icu-expressions
