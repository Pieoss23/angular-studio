# Esercizio 29 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] il tab su `/ex29` mostra "Esercizio 29 — Title Strategy · Angular Studio"
- [x] il tab su `/` mostra solo "Angular Studio", senza doppio suffisso
- [x] una rotta senza `title` in config mostra comunque un titolo sensato

## Codice finale

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

## Concetti chiave (da ricordare)

- `this.buildTitle(snapshot)` (metodo ereditato da `TitleStrategy`) ricava il `title` della
  rotta attiva più profonda, gestendo anche i casi di rotte annidate.
- `inject(Title).setTitle(...)` è l'unico punto che aggiorna davvero il `<title>` nel `<head>`:
  senza quella chiamata il tab resterebbe fermo al titolo precedente.
- Il controllo `routeTitle !== SUFFIX` evita la doppia ripetizione sulla home, che ha già
  `title: 'Angular Studio'` in config.

## Trappole verificate

Nessuna: build pulita, verificato il titolo su tre rotte diverse (con title custom, con title
uguale al suffisso, senza title).

## Approfondimenti
- https://angular.dev/api/router/TitleStrategy
