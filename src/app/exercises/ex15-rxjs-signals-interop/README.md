# Esercizio 15 — RxJS ↔ Signals: `toObservable`, `toSignal`

## Argomento

Signal e Observable risolvono problemi simili in modo diverso: i signal sono sincroni e "pull"
(leggi il valore quando vuoi), gli Observable sono asincroni e "push", con un intero arsenale di
operatori (`debounceTime`, `switchMap`, `retry`...) che i signal non hanno. Il pacchetto
`@angular/core/rxjs-interop` fa da ponte nei due sensi, così puoi tenere lo stato "semplice" nei
signal e usare RxJS solo dove serve davvero la sua potenza.

## Concetti da conoscere

- `toObservable(signal)` — trasforma un signal in un Observable che emette a ogni cambiamento.
  Va chiamato in *injection context* (tipicamente un inizializzatore di campo della classe).
- `toSignal(observable, { initialValue: ... })` — il percorso inverso: legge l'ultimo valore
  emesso come signal. `initialValue` evita che il tipo diventi `T | undefined` prima della prima
  emissione.
- Perché passare da RxJS invece di restare sui signal: qui servono `debounceTime` (aspetta che
  l'utente smetta di scrivere) e `switchMap` (annulla la richiesta precedente se ne parte una
  nuova prima che finisca).
- `distinctUntilChanged()` evita di rifare la stessa ricerca se il valore non è cambiato davvero.

## Scenario

Una search-box: digitando aggiorni un signal `term`. `SearchService.search()` (già pronto) finge
una chiamata HTTP con 400ms di ritardo. La ricerca deve partire solo dopo una pausa nella
digitazione, e solo l'ultima richiesta in corso deve "vincere".

## Cosa devi fare

Nel campo `results` di `ex15-rxjs-signals-interop.ts`, sostituisci il placeholder con la catena
guidata dai `TODO(15.1)`–`(15.3)` già presenti nel file:

1. `term$ = toObservable(this.term)`
2. pipe: `debounceTime(300)` → `distinctUntilChanged()` → `switchMap(term => this.search.search(term))`,
   con due `tap()` per accendere/spegnere `loading`
3. `results = toSignal(results$, { initialValue: [] as string[] })`

## Criteri di valutazione

- [ ] la ricerca non parte a ogni tasto premuto, solo dopo una pausa nella digitazione
- [ ] `loading` mostra "cerco…" durante l'attesa dei 400ms
- [ ] digitando molto in fretta, solo l'ultima ricerca produce risultati (niente race condition)
- [ ] `results` è leggibile come signal (`results()`), non serve un `async` pipe

## Come provare

`/ex15`: scrivi "sig" lentamente → dopo una pausa appaiono "signal". Poi prova a scrivere in
fretta senza pause: deve comparire un solo "cerco…" alla fine, non uno per lettera, e il
risultato finale deve corrispondere all'ultimo testo scritto.

## Trappole

- `toObservable` chiamato fuori da un injection context lancia un errore: va bene come
  inizializzatore di campo (come già impostato), non dentro un metodo generico chiamato dopo il
  costruttore.
- Con `mergeMap` invece di `switchMap`, una ricerca vecchia e lenta potrebbe risolvere **dopo**
  una più recente e sovrascriverne il risultato.
- `toSignal` senza `initialValue` tipizza il risultato come `T | undefined`, obbligandoti a
  controlli extra nel template.
