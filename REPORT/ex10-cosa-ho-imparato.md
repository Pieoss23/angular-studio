# Esercizio 10 — Cosa ho imparato

**Data valutazione:** 2026-09-10
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 5 / 5

## Criteri (check finale)
- [x] guard funzionale, `inject()`, redirect con `UrlTree`
- [x] interceptor clona la richiesta (non muta `req`)
- [x] header presente solo dopo login
- [x] query param → `input()` senza `ActivatedRoute`
- [x] niente classi `@Injectable` che implementano `CanActivate` / `HttpInterceptor`

## Codice finale

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/ex10']);
};
```

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  let authReq = req;
  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  console.log(authReq.method, authReq.url);
  return next(authReq);
};
```

## Concetti chiave (da ricordare)

- Guard e interceptor funzionali sono **solo funzioni**: niente classi, niente `@Injectable`,
  `inject()` funziona lo stesso perché girano in injection context durante la navigazione/richiesta.
- Un guard nega l'accesso con `false`, ma per un vero redirect serve un `UrlTree`
  (`router.createUrlTree([...])`), non `router.navigate(...)` chiamato a lato e poi `return false`.
- `HttpRequest` è **immutabile**: `req.clone({...})` non cambia `req`, ritorna un oggetto nuovo.
  Se il risultato non viene salvato e inoltrato esplicitamente, la modifica si perde e la
  richiesta originale (senza header) è quella che parte davvero.
- `withComponentInputBinding()` collega automaticamente path param, query param e route data agli
  `input()` del componente con lo stesso nome — nessuna sottoscrizione manuale ad `ActivatedRoute`.

## Errori corretti in review

1. **Token letto male**: `const token = inject(AuthStore)` prendeva l'istanza dello store intero,
   non il valore del token. `if (token)` era quindi sempre vero (un oggetto è sempre truthy),
   anche da anonimo. Corretto leggendo `inject(AuthStore).token()`.

2. **`clone()` col risultato scartato**: `req.clone({...})` veniva chiamato ma il valore di
   ritorno non era assegnato a nulla; il codice poi faceva `next(req)` sulla richiesta
   **originale**, senza header. Anche dopo aver corretto il primo bug, l'`Authorization` non
   arrivava mai al server.

   Il primo tentativo di fix ha introdotto una **variable shadowing**: `let authReq = req;` fuori
   dall'`if`, ma dentro l'`if` la riga era `const authReq = req.clone(...)` — quel `const`
   dichiarava una *nuova* variabile locale al blocco, che copriva quella esterna senza
   riassegnarla. Stesso bug, spostato di un livello. Risolto togliendo il `const` interno, così
   l'assegnazione tocca la variabile esterna.

## Trappole tipiche (verificate)

- Un guard che ritorna solo `false` a un redirect funziona ma perde l'URL di destinazione nella
  cronologia in modo meno pulito di un `UrlTree`.
- `let` + shadowing con `const` nello stesso nome dentro un blocco interno è un errore facile da
  non notare: TypeScript non lo segnala come errore (sono scope diversi, entrambi validi), il bug
  è puramente logico/runtime.
- `console.log` messo **prima** del `clone()`/dentro il ramo sbagliato logga la richiesta non
  ancora modificata: va fatto sull'oggetto che poi si inoltra davvero.

## Approfondimenti
- https://angular.dev/guide/http/interceptors
- https://angular.dev/api/router/CanActivateFn
- https://angular.dev/guide/router/route-data#accessing-the-resolved-data
