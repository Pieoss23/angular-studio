# Esercizio 18 — Router avanzato: resolver funzionali e route data

## Argomento

Un resolver recupera i dati **prima** che il router attivi la rotta: il componente si monta già
con i dati pronti, senza un "flash" di stato vuoto/loading al primo render. Combinato con
`withComponentInputBinding()` (già attivo in questo progetto in `app.config.ts`), il valore
risolto arriva direttamente come **input** del componente — stesso meccanismo che questo progetto
usa già per i path param, esteso ai dati di route.

## Concetti da conoscere

- `ResolveFn<T>` — funzione che riceve `(route, state)`, gira in injection context (puoi usare
  `inject()` al suo interno)
- registrazione nella rotta: `{ path: 'ex18/:id', resolve: { project: projectResolver }, ... }`
- con `withComponentInputBinding()`, la chiave `project` nei dati risolti diventa automaticamente
  l'input `project` del componente (deve avere lo **stesso nome**)
- un resolver può tornare un `Observable`: il router aspetta che emetta prima di attivare la
  rotta e montare il componente
- se il dato richiesto non esiste, il resolver può reindirizzare (stesso pattern di un guard)
  invece di far montare un componente senza dati validi

## Scenario

`project.service.ts` (già completo) simula una piccola API di progetti, con latenza finta.
La lista in questa pagina linka a `/ex18/:id`, che deve montare `ProjectDetail` con il progetto
già risolto dal router.

## Cosa devi fare

### `project.resolver.ts`

Implementa `projectResolver`:

```ts
export const projectResolver: ResolveFn<Project | undefined> = (route) => {
  const id = route.paramMap.get('id')!;
  const service = inject(ProjectService);
  const router = inject(Router);

  return service.getById(id).pipe(
    tap((project) => {
      if (!project) router.navigate(['/ex18']);
    }),
  );
};
```

### `app.routes.ts`

Aggiungi la rotta di dettaglio (guarda `ex10/secret` come esempio di rotta con configurazione
extra oltre a `loadComponent`):

```ts
{
  path: 'ex18/:id',
  resolve: { project: projectResolver },
  loadComponent: () =>
    import('./exercises/ex18-router-resolvers/project-detail').then((m) => m.ProjectDetail),
},
```

### `project-detail.ts`

Distingui visivamente un progetto `attivo` da uno `archiviato` (es. colore/testo diverso), invece
di stampare sempre lo stesso testo grezzo.

## Criteri di valutazione

- [ ] cliccando un progetto dalla lista, il dettaglio appare già popolato — nessuno stato vuoto
      iniziale dentro `ProjectDetail`
- [ ] navigando manualmente a un id inesistente (`/ex18/nope`), l'app reindirizza a `/ex18`
- [ ] `ProjectDetail` non legge `ActivatedRoute` manualmente: usa solo l'input `project`

## Come provare

`/ex18` → clicca un progetto → verifica URL e contenuto del dettaglio. Poi prova a digitare
manualmente `/ex18/nope` nella barra indirizzi: deve tornare alla lista.

## Trappole

- Il nome della chiave in `resolve: { project: ... }` deve combaciare **esattamente** col nome
  dell'input nel componente (`project`), altrimenti l'input resta `undefined`.
- Un resolver la cui Observable non emette mai blocca la navigazione all'infinito: nel caso "non
  trovato" assicurati comunque di completare l'Observable (es. con `of(undefined)` dopo il
  redirect), non lasciarla a metà.
