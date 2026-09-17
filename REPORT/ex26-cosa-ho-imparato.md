# Esercizio 26 — Cosa ho imparato

**Data valutazione:** 2026-09-17
**Esito:** ✅ completato
**Punteggio criteri:** 3 / 3

## Criteri (check finale)
- [x] nessun warning `NG0295x` bloccante in console (dimensioni/priority mancanti)
- [x] l'hero ha `priority`, le miniature no
- [x] in DevTools, l'hero ha `fetchpriority="high"`, le miniature `loading="lazy"`

## Codice finale

```html
<img ngSrc="..." width="800" height="500" priority alt="paesaggio hero" />
<img [ngSrc]="'...' + id + '...'" width="200" height="150" alt="miniatura" />
```

## Concetti chiave (da ricordare)

- `ngSrc` richiede `NgOptimizedImage` negli `imports`; `width`/`height` sono obbligatori (o
  `fill`) per riservare lo spazio prima del caricamento, evitando layout shift.
- `priority` va riservato all'immagine più importante above-the-fold (la LCP): disattiva il lazy
  loading di default e alza la `fetchpriority` del browser.
- Il warning `NG02956` (preconnect mancante) è un suggerimento di performance legato al dominio
  esterno usato per le immagini di test, non un errore bloccante né parte dei criteri.

## Trappole verificate

Nessuna: build pulita, nessun warning sulle dimensioni mancanti.

## Approfondimenti
- https://angular.dev/guide/image-optimization
