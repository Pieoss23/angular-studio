# Esercizio 29 — Router: `TitleStrategy` custom, titoli di pagina dinamici

## Argomento

Ogni rotta può avere un `title` (stringa o funzione) nella sua config, e il router lo applica al
`<title>` del documento ad ogni navigazione, tramite una `TitleStrategy`. Quella di default si
limita a copiare il `title` della rotta così com'è. Una strategia custom ti permette di
trasformarlo — tipicamente aggiungendo un suffisso col nome del sito, come fanno praticamente
tutte le app reali ("Esercizio 29 · Angular Studio" invece di solo "Esercizio 29").

## Concetti da conoscere

- `{ path: 'ex29', title: 'Titolo di questa pagina' }` nella configurazione delle rotte
- `class Strategia extends TitleStrategy { override updateTitle(snapshot) { ... } }`
- `this.buildTitle(snapshot)` — metodo ereditato dalla classe base, ricava il `title` della
  rotta attiva più profonda (gestisce anche i casi di rotte annidate)
- `inject(Title).setTitle(...)` — il servizio Angular che aggiorna davvero il `<title>` nel
  `<head>` del documento
- si attiva con `{ provide: TitleStrategy, useClass: Strategia }` nei `providers` di
  `app.config.ts` (già collegato in questo progetto)

## Scenario

La rotta `/ex29` ha già `title: 'Esercizio 29 — Title Strategy'` nella sua configurazione.

## Cosa devi fare

In `app-title.strategy.ts`:

```ts
override updateTitle(snapshot: RouterStateSnapshot): void {
  const routeTitle = this.buildTitle(snapshot);
  if (routeTitle && routeTitle !== SUFFIX) {
    this.titleService.setTitle(`${routeTitle} · ${SUFFIX}`);
  } else {
    this.titleService.setTitle(SUFFIX);
  }
}
```

## Criteri di valutazione

- [ ] il tab del browser su `/ex29` mostra "Esercizio 29 — Title Strategy · Angular Studio"
- [ ] il tab su `/` (che ha `title: 'Angular Studio'`) mostra solo "Angular Studio", senza
      doppio suffisso
- [ ] una rotta senza `title` nella config (es. `/ex01`) mostra comunque un titolo sensato, non
      vuoto

## Come provare

Guarda il titolo del tab del browser mentre navighi tra `/`, `/ex29` e `/ex01` con i link nella
pagina.

## Trappole

- Se dimentichi di gestire il caso "`routeTitle` assente", il titolo resterebbe quello della
  pagina precedente — il router non lo tocca se `updateTitle` non chiama `setTitle`.
- Occhio a non appendere due volte il suffisso quando `routeTitle` è già uguale a
  `"Angular Studio"` (il caso della home): altrimenti otterresti
  "Angular Studio · Angular Studio".
