# Esercizio 24 — Signal avanzati: `untracked()`, cleanup dell'effect, `equal` custom

## Argomento

Tre strumenti per casi meno banali con i signal:

- `untracked()` per leggere un signal dentro un `effect()` **senza** farlo entrare tra le
  dipendenze — l'effect non si ri-esegue se cambia solo quel signal.
- la funzione di **cleanup** di un effect, per annullare lavoro asincrono in sospeso prima della
  run successiva (o alla distruzione del componente) — l'equivalente, per gli effect, di
  `ngOnDestroy` per un singolo pezzo di side-effect.
- un comparatore `equal` custom su un signal, per decidere tu quando due valori contano come
  "uguali" (e quindi non propagare nessun aggiornamento) invece di affidarti al default
  (`Object.is`, che per gli oggetti confronta il riferimento).

## Concetti da conoscere

- `untracked(() => this.altroSignal())` — legge il valore corrente senza registrare una
  dipendenza reattiva su quel signal
- `effect((onCleanup) => { onCleanup(() => ...) })` — la funzione passata a `onCleanup` gira
  prima della prossima esecuzione dell'effect, e alla distruzione del contesto in cui vive
  l'effect
- `signal(valore, { equal: (a, b) => boolean })` — sostituisce il confronto di default con uno
  tuo: se ritorna `true`, il `.set()`/`.update()` non fa scattare nulla a valle (computed, effect)

## Scenario

Digitando in un campo di ricerca, un `effect()` simula una "elaborazione" con 500ms di ritardo
(un `setTimeout`) e la logga. Un toggle "verbose" deve poter cambiare senza far ripartire
l'elaborazione. Un secondo signal `filters` (un oggetto `{ status, tag }`) usa un `equal` custom:
impostarlo con gli stessi valori (anche dentro un oggetto nuovo) non deve incrementare il
contatore di aggiornamenti.

## Cosa devi fare

Nel constructor di `Ex24AdvancedSignals`, riscrivi il primo effect così:

```ts
effect((onCleanup) => {
  const q = this.query();
  const verbose = untracked(() => this.verbose());

  const id = setTimeout(() => {
    if (verbose) this.log.update((l) => [...l, `(verbose) query cambiata: "${q}"`]);
    this.log.update((l) => [...l, `elaboro: "${q}"`]);
  }, 500);

  onCleanup(() => clearTimeout(id));
});
```

E aggiungi l'`equal` custom al signal `filters`:

```ts
protected readonly filters = signal<Filters>(
  { status: 'active', tag: 'a' },
  { equal: (a, b) => a.status === b.status && a.tag === b.tag },
);
```

## Criteri di valutazione

- [ ] digitando in fretta nel campo query, appare un solo "elaboro: ..." per l'ultima query (le
      elaborazioni intermedie sono annullate dal cleanup)
- [ ] attivare/disattivare "verbose" da solo non aggiunge righe al log (non essendo tracciato,
      non ri-esegue l'effect — lo vedrai comunque nel log della *prossima* query, letto con
      `untracked`)
- [ ] cliccare "stessi filtri" più volte non incrementa il contatore di aggiornamenti
- [ ] cliccare "filtri diversi" incrementa il contatore

## Come provare

`/ex24`: scrivi velocemente nel campo query — deve comparire un solo log "elaboro" dopo l'ultima
lettera, non uno per lettera. Clicca "verbose" alcune volte: nessuna nuova riga nel log. Clicca
"stessi filtri" ripetutamente: il contatore resta fermo; clicca "filtri diversi": sale.

## Trappole

- Senza `onCleanup`, ogni tasto premuto avvierebbe un timer indipendente che poi logga comunque
  dopo 500ms — risultato: log multipli invece di uno solo per l'ultima query.
- `untracked` va usato **dentro** l'effect, attorno alla singola lettura che non deve essere
  tracciata — non disattiva la reattività dell'intero effect, solo di quella lettura specifica.
- L'`equal` custom si applica solo confrontando il valore **nuovo** passato a `.set()`/`.update()`
  con quello **precedente** memorizzato nel signal, non con valori arbitrari esterni.
