# Esercizio 10 — Guard, interceptor e route input binding *funzionali*

## Argomento

Angular ha spostato tre pezzi di infrastruttura da **classi + DI** a **funzioni + `inject()`**.
Meno boilerplate, meno file, tree-shaking migliore.

1. **Route guard funzionale (`CanActivateFn`)** — invece di una classe che implementa
   `CanActivate`, una funzione che restituisce `boolean | UrlTree | Observable<...> | Promise<...>`.
   Dentro usi `inject()` per prendere i servizi. Per un redirect **non** restituisci `false`:
   restituisci un `UrlTree` (`router.createUrlTree([...])` o `router.parseUrl(...)`), così l'utente
   viene mandato altrove invece di restare bloccato.

2. **HTTP interceptor funzionale (`HttpInterceptorFn`)** — `(req, next) => next(req)`. Registrato
   con `withInterceptors([...])` dentro `provideHttpClient()`. Le richieste sono **immutabili**:
   per aggiungere un header cloni con `req.clone({ setHeaders: {...} })`.

3. **`withComponentInputBinding()`** — attivato in `provideRouter(...)`, fa sì che i **path param**,
   i **query param** e i **`data`** della rotta vengano iniettati automaticamente negli
   `input()` del componente con lo stesso nome. Niente più `ActivatedRoute` + `subscribe` per
   leggere un parametro.

## Concetti da conoscere

- `export const authGuard: CanActivateFn = (route, state) => { ... }`
- `inject(AuthStore)`, `inject(Router)` **dentro** la funzione guard
- redirect: `return router.createUrlTree(['/ex10'])`
- `export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }`
- `req.clone({ setHeaders: { Authorization: \`Bearer ${token}\` } })`
- `provideHttpClient(withInterceptors([authInterceptor]))`
- `provideRouter(routes, withComponentInputBinding())`
- nel componente: `readonly msg = input('')` → popolato da `?msg=...`

## Scenario

- `AuthStore` (già pronto): `token` signal, `isLoggedIn` computed, `login()` / `logout()`.
- La rotta `/ex10/secret` è protetta: da anonimo devi essere rimandato a `/ex10`.
- Ogni richiesta HTTP fatta da loggato deve avere l'header `Authorization`.
- La pagina `/ex10` mostra il valore di un input `msg` preso dai query param.

`app.config.ts` ha già `withComponentInputBinding()` e `withInterceptors([authInterceptor])`.
La rotta `secret` ha già `canActivate: [authGuard]`.

## Cosa devi fare

1. **`auth.guard.ts`** — completa `authGuard`:
   ```ts
   export const authGuard: CanActivateFn = () => {
     const auth = inject(AuthStore);
     const router = inject(Router);
     return auth.isLoggedIn() ? true : router.createUrlTree(['/ex10']);
   };
   ```

2. **`auth.interceptor.ts`** — completa `authInterceptor`:
   - leggi `inject(AuthStore).token()`;
   - se c'è un token, inoltra `req.clone({ setHeaders: { Authorization: \`Bearer ${token}\` } })`;
   - altrimenti inoltra `req` così com'è;
   - in entrambi i casi `console.log(req.method, req.url)`.

3. **`ex10-guards-interceptors.ts`** — l'`input('msg')` c'è già; verifica che aprendo
   `/ex10?msg=ciao` compaia "ciao" (nessun `ActivatedRoute`).

## Criteri di valutazione

- [ ] guard funzionale, servizi via `inject()`, redirect con `UrlTree` (non `false`)
- [ ] interceptor **clona** la richiesta (non muta `req` direttamente)
- [ ] header presente **solo** dopo login (verificabile in Network / console)
- [ ] il query param arriva nell'`input()` senza `ActivatedRoute` manuale
- [ ] niente classi `@Injectable` che implementano `CanActivate` / `HttpInterceptor`

## Come provare

`/ex10`:
1. Da anonimo, clicca "vai alla pagina segreta" → vieni rimandato a `/ex10`.
2. Clicca "login", riprova → ora entri in `/ex10/secret`.
3. Nella pagina segreta clicca il bottone GET → in console vedi `GET https://...` e, nella tab
   Network, la richiesta ha l'header `Authorization: Bearer studio-token-123`.
4. Apri `/ex10?msg=ciao` → in fondo compare "ciao".

## Trappole

- Restituire `false` dalla guard: l'utente resta sulla pagina corrente senza feedback. Usa un
  `UrlTree`.
- Mutare `req.headers` direttamente: `HttpRequest` è immutabile, non ha effetto (o rompe).
- `inject()` fuori da un contesto di iniezione: nelle funzioni guard/interceptor sei dentro un
  contesto valido, ma non in callback async annidate — prendi i servizi all'inizio.
- `withComponentInputBinding()` non attivo → `input('msg')` resta sempre `''`.
- Se path param e query param hanno lo stesso nome, vince il path param.
