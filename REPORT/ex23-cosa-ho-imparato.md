# Esercizio 23 — Cosa ho imparato

**Data valutazione:** 2026-09-16
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] in console, il log di inizializzazione appare prima di qualunque altro log dell'app
- [x] `AnalyticsService` riceve davvero il config passato in `app.config.ts`
- [x] tracciare un evento lo aggiunge alla lista con il prefisso `[angular-studio]`

## Codice finale

```ts
export function provideAnalytics(config: AnalyticsConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ANALYTICS_CONFIG, useValue: config },
    provideAppInitializer(() => {
      console.log(`[analytics] inizializzato per ${config.appId}`);
    }),
  ]);
}
```

## Concetti chiave (da ricordare)

- `makeEnvironmentProviders([...])` impacchetta più provider (un token con `useValue` e un
  `provideAppInitializer`) in un unico valore utilizzabile in `providers`, seguendo lo stesso
  pattern di `provideRouter`/`provideHttpClient`.
- `provideAppInitializer(fn)` esegue `fn` prima che Angular completi il bootstrap: utile per
  configurazione che deve essere pronta prima del primo render.
- Un `InjectionToken` valorizzato con `useValue` dentro la funzione di configurazione è lo stesso
  pattern DI visto per i provider a livello di componente, applicato qui a livello di app.

## Trappole verificate

Nessuna: build pulita, il log di inizializzazione compare correttamente prima di ogni altro log
dell'app al ricaricamento della pagina.

## Approfondimenti
- https://angular.dev/api/core/provideAppInitializer
- https://angular.dev/api/core/makeEnvironmentProviders
