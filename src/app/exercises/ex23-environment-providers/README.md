# Esercizio 23 — Environment providers: `provideXxx()` e `provideAppInitializer`

## Argomento

`provideRouter()`, `provideHttpClient()`, e la tua `provideAnalytics()`: sono tutte funzioni che
ritornano un pacchetto di provider da mettere nell'array `providers` di `app.config.ts`. È il modo
standard con cui Angular (e le librerie di terze parti) impacchettano configurazione a livello di
**applicazione** (non di singolo componente), con un'API dichiarativa e autodescrittiva invece di
una lista piatta di oggetti provider da ricordare a memoria.

`provideAppInitializer(fn)` registra `fn` per essere eseguita **prima** che Angular finisca il
bootstrap dell'app — utile per caricare configurazione remota, inizializzare un SDK di terze
parti, ecc. Se `fn` ritorna una Promise, Angular aspetta che si risolva prima di procedere con il
primo render.

## Concetti da conoscere

- `makeEnvironmentProviders([...])` — impacchetta un array di provider in un singolo valore
  `EnvironmentProviders`, che si passa direttamente dentro `providers: [...]` in `app.config.ts`
- `provideAppInitializer(() => { ... })` — gira prima del primo render, in injection context
  (`inject()` funziona al suo interno)
- un `InjectionToken` per la configurazione, valorizzato con `useValue` dentro la funzione
  `provideXxx` (stesso pattern DI dell'esercizio 12, applicato a livello di app invece che di
  componente)

## Scenario

`provideAnalytics({ appId: 'angular-studio' })` è già collegata in `app.config.ts`.
`AnalyticsService` (già pronto) legge il config per taggare gli eventi tracciati.

## Cosa devi fare

In `analytics.config.ts`, implementa `provideAnalytics(config)`:

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

## Criteri di valutazione

- [ ] in console, il log di inizializzazione appare prima di qualunque altro log dell'app
- [ ] `AnalyticsService` riceve davvero il config passato in `app.config.ts` (non un default)
- [ ] tracciare un evento nella pagina lo aggiunge alla lista con il prefisso `[angular-studio]`

## Come provare

Apri la console **prima** di navigare, o ricarica la pagina su `/ex23`: il log
`[analytics] inizializzato per angular-studio` deve comparire subito, prima che qualunque
componente si monti. Poi clicca "traccia evento" e verifica che compaia in lista.

## Trappole

- `provideAppInitializer(...)` va messo **dentro** l'array passato a
  `makeEnvironmentProviders`, come uno degli elementi — non chiamato a parte e ignorato.
- Se dimentichi il provider di `ANALYTICS_CONFIG`, `AnalyticsService` lancia un
  `NullInjectorError` al primo utilizzo, perché il token non ha un default (`factory`).
- Modificare `app.config.ts` richiede un riavvio del dev server in alcuni casi (i provider a
  livello di app si valutano una sola volta, al bootstrap).
