# Angular Studio — guida

Progetto di studio per imparare le ultime novità di Angular (v21: standalone, zoneless, signals).

## Come funziona
1. `npm start` → apri http://localhost:4200
2. Per ogni esercizio (`/ex01` … `/ex30`) leggi la **consegna** nel `README.md` della sua cartella
   (`src/app/exercises/exNN-.../README.md`).
3. Completa i `TODO(N.x)` nel codice **a mano**.
4. Quando hai finito, scrivimi "ho finito l'esercizio N".
5. Io rivedo il codice sui *criteri di valutazione*, ti do un voto/feedback e scrivo
   `REPORT/exNN-cosa-ho-imparato.md`.

## Stato esercizi

| #  | Argomento | Stato |
|----|-----------|-------|
| 1  | signal / computed / effect | ✅ 5/5 — vedi REPORT/ex01 |
| 2  | @if / @for / @switch | ✅ 5/5 — vedi REPORT/ex02 |
| 3  | signal input() / output() | ✅ 5/5 (con aiuti) — vedi REPORT/ex03 |
| 4  | model() two-way | ✅ 4/4 — vedi REPORT/ex04 |
| 5  | viewChild / viewChildren signal | ✅ 4/4 — vedi REPORT/ex05 |
| 6  | linkedSignal | ✅ 5/5 (bonus) — vedi REPORT/ex06 |
| 7  | resource() | ✅ 5/5 — vedi REPORT/ex07 |
| 8  | httpResource() | ✅ 5/5 — vedi REPORT/ex08 |
| 9  | @defer | ✅ 5/5 (bonus) — vedi REPORT/ex09 |
| 10 | functional guard / interceptor / input binding | ✅ 5/5 (2 correzioni) — vedi REPORT/ex10 |
| 11 | content projection (ng-content, select, ngProjectAs) | ✅ 4/4 (bonus) — vedi REPORT/ex11 |
| 12 | dependency injection (inject, InjectionToken, provider) | ✅ 5/5 (bonus) — vedi REPORT/ex12 |
| 13 | direttive custom + Directive Composition API | ✅ 4/4 — vedi REPORT/ex13 |
| 14 | reactive forms tipizzati + validatori custom | ✅ 4/4 (2 correzioni) — vedi REPORT/ex14 |
| 15 | RxJS ↔ signals (toObservable/toSignal) | ✅ 4/4 — vedi REPORT/ex15 |
| 16 | animazioni native (animate.enter/leave) | ✅ 3/3 — vedi REPORT/ex16 |
| 17 | testing con TestBed | ✅ 4/4 (2 correzioni) — vedi REPORT/ex17 |
| 18 | router: resolver funzionali | ✅ 3/3 (1 correzione) — vedi REPORT/ex18 |
| 19 | afterRenderEffect + host binding | ✅ 3/3 — vedi REPORT/ex19 |
| 20 | state management con signal store | ✅ 4/4 — vedi REPORT/ex20 |
| 21 | pipe custom (pure vs impure) | ✅ 4/4 — vedi REPORT/ex21 |
| 22 | direttiva strutturale custom (TemplateRef/ViewContainerRef) | ✅ 4/4 (bonus) — vedi REPORT/ex22 |
| 23 | environment providers + provideAppInitializer | ✅ 3/3 — vedi REPORT/ex23 |
| 24 | signal avanzati (untracked/cleanup/equal) | ✅ 4/4 (1 correzione) — vedi REPORT/ex24 |
| 25 | error handling (ErrorHandler + catchError/retry) | ✅ 3/3 (2 correzioni) — vedi REPORT/ex25 |
| 26 | NgOptimizedImage | ✅ 3/3 — vedi REPORT/ex26 |
| 27 | espressioni ICU (plural/select) | ✅ 4/4 (fix infrastruttura) — vedi REPORT/ex27 |
| 28 | router: PreloadingStrategy custom | ✅ 3/3 — vedi REPORT/ex28 |
| 29 | router: TitleStrategy custom | ✅ 3/3 — vedi REPORT/ex29 |
| 30 | creazione dinamica di componenti (ViewContainerRef) | ✅ 4/4 (1 correzione) — vedi REPORT/ex30 |

**Tutti i 30 esercizi completati.** 🎉

## Progetto finale — Libreria ricette

Da `/progetto` in poi: non più esercizi guidati, ma un progetto vero a milestone (M0-M8), che
mette insieme la maggior parte delle tecniche viste sopra. Consegna completa in
`src/app/project-recipes/README.md`. Costruisci tu in autonomia, io rivedo milestone per
milestone come per gli esercizi — vedi quel README per il dettaglio del workflow.

Legenda: ⬜ da fare · 🟡 in corso · ✅ valutato

## Comandi
```
npm start            # dev server
npm run build        # build di produzione (verifica che tutto compili)
```

## Note sul progetto
- **Zoneless**: `provideZonelessChangeDetection()` in `app.config.ts`. Niente `zone.js`.
  Il change detection si basa sui signal → se usi campi mutabili normali la UI non si aggiorna.
- **Standalone**: nessun `NgModule`. Ogni componente dichiara i propri `imports`.
- `resource()` / `httpResource()` sono in *developer preview*: l'API può cambiare tra versioni.
