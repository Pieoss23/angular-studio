# Esercizio 12 — Cosa ho imparato

**Data valutazione:** 2026-09-11
**Esito:** ✅ completato (bonus incluso)
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] il badge fuori da `BrandedSection` mostra il config di default
- [x] il badge dentro `BrandedSection` mostra il config sovrascritto
- [x] `WidgetList` mostra i due widget registrati in `ex12-dependency-injection.ts`
- [x] nessun `NullInjectorError` in console
- [x] bonus: `inject(WIDGETS, { optional: true })` gestito correttamente

## Codice finale

```ts
// branded-section.ts
providers: [
  { provide: STUDIO_CONFIG, useValue: { appName: 'Studio Rebrand', supportEmail: 'rebrand@studio.dev' } },
],
```

```ts
// widget-list.ts
protected readonly widgets = inject(WIDGETS, { optional: true }) ?? [];
```

```ts
// ex12-dependency-injection.ts
providers: [
  { provide: WIDGETS, useValue: { id: 'chart', label: 'Grafico vendite' }, multi: true },
  { provide: WIDGETS, useValue: { id: 'todo', label: 'Lista TODO' }, multi: true },
],
```

## Concetti chiave (da ricordare)

- I `providers` a livello di `@Component` sovrascrivono un token **solo** per quel componente e
  i suoi discendenti: risalendo l'albero verso il padre si torna a vedere il provider più in
  alto (o il default). Non è un cambiamento globale.
- `inject(TOKEN, { optional: true })` è il modo corretto di gestire un token **senza** factory di
  default: senza `optional: true`, se nessuno lo fornisce Angular lancia un
  `NullInjectorError` invece di tornare `null`.
- `multi: true` va ripetuto identico su ogni provider dello stesso token: è quello che permette a
  più feature/pagine diverse di "aggiungere" ciascuna il proprio pezzo (qui due `Widget`) invece
  di sovrascriversi a vicenda.

## Trappole verificate

Nessuna: build pulita, nessun `NullInjectorError`, i due badge mostrano testi diversi e la lista
widget mostra esattamente i due registrati in questa pagina.

## Approfondimenti
- https://angular.dev/guide/di/dependency-injection
- https://angular.dev/guide/di/hierarchical-dependency-injection
