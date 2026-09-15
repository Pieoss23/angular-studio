# Esercizio 18 — Cosa ho imparato

**Data valutazione:** 2026-09-15
**Esito:** ✅ completato (1 correzione in review)
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] cliccando un progetto, il dettaglio appare già popolato (niente stato vuoto iniziale)
- [x] un id inesistente reindirizza a `/ex18`
- [x] il componente non legge `ActivatedRoute` a mano: usa solo l'input

## Codice finale

```ts
export const projectResolver: ResolveFn<Project | undefined> = (route) => {
  const id = route.paramMap.get('id');
  const service = inject(ProjectService);
  const router = inject(Router);

  if (id === null) {
    router.navigate(['/ex18']);
    return EMPTY;
  }

  return service.getById(id).pipe(
    switchMap((project) => {
      if (!project) {
        router.navigate(['/ex18']);
        return EMPTY;
      }
      return of(project);
    }),
  );
};
```

```html
<!-- project-detail.ts -->
@if (project().status === 'attivo') {
  <span style="color: green; font-weight: bold;">attivo</span>
} @else if (project().status === 'archiviato') {
  <span style="color: gray;">archiviato</span>
} @else {
  <span style="color: orange;">{{ project().status }}</span>
}
```

## Concetti chiave (da ricordare)

- Un resolver può reindirizzare senza mai "risolvere" per la navigazione corrente: si chiama
  `router.navigate(...)` come side-effect e si ritorna `EMPTY` invece di completare con un
  valore segnaposto — niente stato intermedio (tipo `undefined`) da dover gestire lato
  componente.
- `switchMap` nella pipe del resolver trasforma il valore risolto in `of(project)` quando esiste,
  o interrompe il flusso con `EMPTY` quando non esiste — più robusto di un `tap()` con solo
  effetto collaterale, che lascerebbe comunque completare l'observable con un valore vuoto.
- `withComponentInputBinding()` collega automaticamente la chiave `project` nei dati risolti
  all'input `project` del componente, senza bisogno di leggere `ActivatedRoute` manualmente.

## Errori corretti in review

1. **Redirect senza interrompere il flusso**: il primo tentativo usava `tap()` per chiamare
   `router.navigate(['/ex18'])` come side-effect, ma lasciava che l'observable completasse
   comunque con `undefined` — il resolver "risolveva" per la navigazione originale, affidandosi
   solo al fatto che il router cancella una navigazione in corso quando ne parte una nuova.
   Funzionante nella pratica, ma fragile concettualmente. Riscritto con `switchMap` che ritorna
   `EMPTY` nel caso di progetto non trovato, così il resolver non risolve affatto per quella
   navigazione.

2. **Import inutilizzato**: `EmailValidationError` da `@angular/forms/signals` era finito nel
   file per un autocomplete dell'IDE partito per sbaglio — non usato da nessuna parte, rimosso.

## Trappole verificate

Nessuna residua: build pulita, bonus sul caso `id === null` gestito, stato "altro" (aggiunto ai
dati mock) gestito correttamente dal fallback `@else`.

## Approfondimenti
- https://angular.dev/api/router/ResolveFn
- https://rxjs.dev/api/index/const/EMPTY
