# Esercizio 12 — Dependency Injection: `inject()`, `InjectionToken`, provider gerarchici

## Argomento

La DI di Angular è un albero di injector che rispecchia l'albero dei componenti. Quando qualcosa
chiede una dipendenza, Angular risale dall'injector più vicino verso la radice e usa il primo
provider che trova. Questo esercizio copre tre pezzi centrali:

- `inject()` per ottenere una dipendenza in injection context, senza passare dal constructor
- `InjectionToken` per iniettare valori/interfacce (non classi)
- provider a livello di `@Component` per sovrascrivere localmente una dipendenza per un
  sottoalbero, incluso il pattern `multi: true` per accumulare più valori sullo stesso token

## Concetti da conoscere

- `inject(Token)` — va chiamata in *injection context*: constructor, initializer di campo di
  classe, o dentro una `factory` di un provider/token
- `new InjectionToken<T>('nome', { factory: () => ... })` — token con default lazy, calcolato la
  prima volta che qualcuno lo inietta senza un provider più specifico
- `@Component({ providers: [...] })` — il provider vale per quel componente e per **tutti i suoi
  discendenti**, sovrascrivendo (per quel sottoalbero) un provider fornito più in alto
- `{ provide: TOKEN, useValue: ..., multi: true }` — più provider per lo stesso token con
  `multi: true` non si sovrascrivono: si accumulano in un array
- `inject(TOKEN, { optional: true })` — ritorna `null` invece di lanciare se il token non ha né
  default né provider

## Scenario

- `STUDIO_CONFIG` (in `tokens.ts`) ha un default globale via factory.
- `GreetingService` lo inietta e costruisce un messaggio; `GreetingBadge` lo mostra.
- `BrandedSection` deve fornire una versione **locale** di `STUDIO_CONFIG`, visibile solo al suo
  interno (e ai suoi figli).
- `WIDGETS` è un token multi senza default: va popolato da chi lo usa, altrimenti resta vuoto.

## Cosa devi fare

### `branded-section.ts`

Aggiungi i `providers` al decoratore per sovrascrivere `STUDIO_CONFIG` con un nome/email diversi:

```ts
providers: [
  { provide: STUDIO_CONFIG, useValue: { appName: 'Studio Rebrand', supportEmail: 'rebrand@studio.dev' } },
],
```

### `widget-list.ts`

Sostituisci il placeholder `widgets: Widget[] = []` con:

```ts
protected readonly widgets = inject(WIDGETS, { optional: true }) ?? [];
```

### `ex12-dependency-injection.ts`

Aggiungi i `providers` del componente con due provider `multi: true` per `WIDGETS`:

```ts
providers: [
  { provide: WIDGETS, useValue: { id: 'chart', label: 'Grafico vendite' }, multi: true },
  { provide: WIDGETS, useValue: { id: 'todo', label: 'Lista TODO' }, multi: true },
],
```

## Criteri di valutazione

- [ ] il badge fuori da `BrandedSection` mostra il messaggio col config di **default**
- [ ] il badge dentro `BrandedSection` mostra il messaggio col config **sovrascritto**
- [ ] `WidgetList` mostra i due widget registrati in `ex12-dependency-injection.ts`
- [ ] nessun `NullInjectorError` in console

## Come provare

`/ex12`: due badge di saluto con testo diverso (uno dentro il riquadro con bordo evidenziato), e
una lista di 2 widget sotto.

## Trappole

- I `providers` vanno nel decoratore `@Component` della classe che "possiede" quel sottoalbero:
  non si possono passare da template o da un componente genitore diverso.
- Un provider a livello di componente vale per i discendenti, ma **non risale**: il padre di
  `BrandedSection` continua a vedere il config di default.
- `multi: true` va ripetuto identico su **ogni** provider dello stesso token: se lo dimentichi su
  uno, quello sovrascrive gli altri invece di accumularsi.
- `inject()` fuori da un injection context (es. dentro un `setTimeout`) lancia un errore a runtime.
