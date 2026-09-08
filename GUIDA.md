# Angular Studio — guida

Progetto di studio per imparare le ultime novità di Angular (v21: standalone, zoneless, signals).

## Come funziona
1. `npm start` → apri http://localhost:4200
2. Per ogni esercizio (`/ex01` … `/ex10`) leggi la **consegna** nel `README.md` della sua cartella
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
| 5  | viewChild / viewChildren signal | ⬜ da fare |
| 6  | linkedSignal | ⬜ da fare |
| 7  | resource() | ⬜ da fare |
| 8  | httpResource() | ⬜ da fare |
| 9  | @defer | ⬜ da fare |
| 10 | functional guard / interceptor / input binding | ⬜ da fare |

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
