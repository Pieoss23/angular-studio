# Esercizio 10 — Functional guard + interceptor + input binding di rotta

## Concetti
- `CanActivateFn` funzionale: niente classe, usi `inject()` dentro la funzione
- redirect da guard: ritorna un `UrlTree` (`router.createUrlTree([...])`), non `false`
- `HttpInterceptorFn` funzionale: `(req, next) => next(req)`, registrato con
  `withInterceptors([...])` in `provideHttpClient`
- richieste immutabili: `req.clone({ setHeaders: { ... } })`
- `withComponentInputBinding()`: params, query params e `data` della rotta vengono
  iniettati negli `input()` del componente con lo stesso nome

## Consegna
1. `auth.guard.ts` — completa `authGuard`: passa se `AuthStore.isLoggedIn()`,
   altrimenti redirect a `/ex10`.
2. `auth.interceptor.ts` — completa `authInterceptor`: aggiungi `Authorization: Bearer <token>`
   quando c'è un token, logga `metodo + url`, inoltra sempre.
3. `ex10-guards-interceptors.ts` — l'`input('msg')` deve popolarsi da `/ex10?msg=ciao`
   (il binding è già abilitato in `app.config.ts`). Verifica che funzioni.

## Criteri di valutazione
- [ ] guard funzionale con `inject`, redirect via `UrlTree`
- [ ] interceptor clona la richiesta (non muta `req` direttamente)
- [ ] header presente solo dopo login (visibile in Network / console)
- [ ] query param → input senza `ActivatedRoute` manuale

## Come provare
`/ex10` — prova ad andare in `/ex10/secret` da anonimo (vieni rimandato indietro),
poi fai login e riprova. Nella pagina segreta clicca il bottone e guarda la console.
Apri `/ex10?msg=ciao`.
