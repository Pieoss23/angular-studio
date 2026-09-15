# Esercizio 26 — `NgOptimizedImage`: immagini performanti senza sforzo

## Argomento

`NgOptimizedImage` (direttiva `ngSrc`) sostituisce il classico `<img src="...">` aggiungendo,
gratis: `loading="lazy"` per default (tranne dove serve il contrario), `fetchpriority`
automatico, dimensioni intrinseche **obbligatorie** (niente layout shift mentre l'immagine
carica), e warning espliciti in console in dev-mode se qualcosa è configurato male.

## Concetti da conoscere

- `ngSrc` invece di `src` — richiede `NgOptimizedImage` negli `imports` del componente
- `width` e `height` sono obbligatori (o in alternativa `fill`, per un contenitore con
  dimensioni proprie): servono al browser per riservare lo spazio prima che l'immagine sia
  scaricata, evitando che il layout "salti" quando arriva
- `priority` — riservato all'immagine più importante above-the-fold, tipicamente quella che
  determina la **LCP** (Largest Contentful Paint): disattiva il lazy loading e alza la
  `fetchpriority` del browser per quella richiesta
- senza `priority`, `NgOptimizedImage` applica `loading="lazy"` di default — corretto per
  immagini sotto la piega, che il browser non deve scaricare subito

## Scenario

Una card "hero" (l'immagine più importante, in cima alla pagina) e una galleria di miniature più
in basso, fuori dallo schermo iniziale.

## Cosa devi fare

1. Aggiungi `NgOptimizedImage` (da `@angular/common`) agli `imports` del componente.
2. Sostituisci `src`/`[src]` con `ngSrc`/`[ngSrc]` su tutte le `<img>`.
3. Sull'immagine hero: aggiungi `width="800"`, `height="500"` e l'attributo `priority`.
4. Su ogni miniatura della galleria: aggiungi `width="200"` e `height="150"` (niente
   `priority` — sono sotto la piega).

## Criteri di valutazione

- [ ] nessun warning `NG0295x` in console (dimensioni mancanti / priority mancante sulla LCP)
- [ ] l'hero ha `priority`, le miniature no
- [ ] in DevTools → Elements, l'hero ha `fetchpriority="high"`, le miniature `loading="lazy"`

## Come provare

`/ex26`: apri la console del browser prima di iniziare — con `src` non vedrai nessun warning
(perché `NgOptimizedImage` non sta ancora intercettando nulla). Una volta convertito a `ngSrc`,
se dimentichi `width`/`height` o `priority` sull'hero, la direttiva te lo segnala esplicitamente
in dev-mode con un messaggio d'errore chiaro.

## Trappole

- `ngSrc` senza `NgOptimizedImage` negli `imports` non fa nulla di silenzioso: è un attributo
  sconosciuto per Angular.
- `priority` su troppe immagini vanifica il suo scopo: va riservato davvero solo alla LCP, una o
  due immagini per pagina al massimo.
- `width`/`height` vanno nelle dimensioni reali del file (o nel suo aspect ratio), non in quelle
  visualizzate a schermo: se servono dimensioni diverse via CSS, usa `width`/`height` CSS
  separatamente, mantenendo l'aspect ratio corretto negli attributi HTML.
