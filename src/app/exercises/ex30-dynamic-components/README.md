# Esercizio 30 — Creazione dinamica di componenti: `ViewContainerRef.createComponent()`

## Argomento

`@if`/`@for` bastano quando sai già, dal template, cosa può comparire. Un servizio di notifiche
("toast"), invece, deve poter creare un componente su richiesta **imperativa** — chiamato da un
service, non dichiarato in un template — senza sapere in anticipo quanti ce ne saranno o quando.
È il caso d'uso classico di `ViewContainerRef.createComponent()`: crei un'istanza di componente a
runtime, la configuri via `setInput()`, e la distruggi quando hai finito.

## Concetti da conoscere

- `viewContainerRef.createComponent(Componente)` — crea e monta un'istanza del componente nel
  punto del DOM rappresentato da quel `ViewContainerRef`, ritorna un `ComponentRef`
- `ref.setInput('nome', valore)` — l'unico modo corretto di impostare gli input di un componente
  creato così: assegnare `ref.instance.nome = valore` direttamente bypassa la reattività dei
  signal input (il componente non si accorgerebbe del cambiamento)
- `ref.instance` — l'istanza vera della classe: puoi leggerne membri pubblici e sottoscrivere i
  suoi `output()` direttamente con `.subscribe(...)`, senza bisogno del template `(evento)="..."`
- `ref.destroy()` — rimuove il componente dal DOM e libera le sue risorse (chiama i suoi
  `ngOnDestroy`/cleanup)

## Scenario

`ToastHost` (già pronto) è solo un punto di ancoraggio nel DOM: registra il proprio
`ViewContainerRef` in `ToastService` al primo render (con `afterNextRender`, perché un
`viewChild` è disponibile solo dopo che la vista esiste). `ToastItem` (già pronto) è il
componente da istanziare dinamicamente, con un messaggio, un tipo (`info`/`error`) e un evento
`dismissed`.

## Cosa devi fare

In `toast.service.ts`, implementa `show(message, kind)`:

```ts
show(message: string, kind: 'info' | 'error' = 'info'): void {
  if (!this.host) return;

  const ref = this.host.createComponent(ToastItem);
  ref.setInput('message', message);
  ref.setInput('kind', kind);

  const remove = () => ref.destroy();
  const timer = setTimeout(remove, 3000);

  ref.instance.dismissed.subscribe(() => {
    clearTimeout(timer);
    remove();
  });
}
```

## Criteri di valutazione

- [ ] cliccando i bottoni, appaiono toast impilati, ognuno col messaggio giusto
- [ ] un toast sparisce da solo dopo 3 secondi
- [ ] cliccando "chiudi" su un toast, sparisce subito, senza errori in console dopo i 3 secondi
- [ ] il toast "error" ha un aspetto visivamente diverso da quello "info"

## Come provare

`/ex30`: clicca più volte i due bottoni per impilare toast diversi. Prova a chiuderne uno a mano
prima dei 3 secondi, e lasciane scadere un altro da solo.

## Trappole

- `ref.instance.message = '...'` diretto non passa dal meccanismo dei signal input: usa sempre
  `ref.setInput(...)`.
- Se non cancelli il `setTimeout` quando l'utente chiude manualmente il toast, dopo 3 secondi
  scatterebbe comunque un `ref.destroy()` su un componente già distrutto (innocuo qui, ma è
  comunque lavoro sprecato e una potenziale fonte di bug in scenari più complessi).
- `ToastHost` va messo una sola volta nell'app: è il contenitore condiviso da cui "spuntano" tutti
  i toast, non uno per ogni bottone.
