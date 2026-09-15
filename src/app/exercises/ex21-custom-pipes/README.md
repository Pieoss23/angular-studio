# Esercizio 21 — Pipe custom: pure vs impure

## Argomento

Una pipe è una funzione di trasformazione usabile nel template con `|`. Di default è **pura**:
Angular la ricalcola solo se cambia il riferimento (o il valore primitivo) del suo input, non ad
ogni ciclo di change detection — è un'ottimizzazione automatica che evita ricalcoli inutili. Con
`pure: false` diventa **impura**: rigira ad ogni ciclo di CD, utile quando il risultato dipende
da qualcosa che la pipe non riceve come input esplicito (qui: il tempo che passa dal momento in
cui è stato scattato un timestamp).

## Concetti da conoscere

- `@Pipe({ name: 'nome' })` + `implements PipeTransform`, con un metodo
  `transform(value, ...args)`
- pipe pura (default): ricalcolata solo se l'input cambia riferimento/valore
- pipe impura (`pure: false`): ricalcolata ad ogni change detection, anche con lo stesso
  identico input
- le pipe standalone (default in Angular moderno) si importano come i componenti, dentro
  `imports: [...]`

## Scenario

`ElapsedPipe` (impura, già pronta) ed `ElapsedPurePipe` (pura, già pronta) fanno la stessa cosa —
mostrano da quanto tempo è passato un timestamp fisso — ma solo la prima si aggiorna nel tempo,
perché un signal `tick` nella pagina forza un nuovo ciclo di CD ogni secondo (senza mai cambiare
il timestamp stesso).

## Cosa devi fare

In `truncate.pipe.ts`, implementa:

```ts
transform(value: string, limit = 20): string {
  return value.length > limit ? value.slice(0, limit) + '…' : value;
}
```

Poi osserva (non serve scrivere altro codice) i due contatori "impuro"/"puro" in fondo alla
pagina: partono dallo stesso timestamp fisso, ma solo quello impuro avanza nel tempo.

## Criteri di valutazione

- [ ] `'ciao' | truncate:10` torna `'ciao'` intatto (è più corto di 10 caratteri)
- [ ] una stringa lunga viene tagliata a `limit` caratteri seguiti da `'…'`
- [ ] `limit` di default è `20` se non passato esplicitamente
- [ ] hai capito perché il contatore "puro" resta fermo e quello "impuro" no

## Come provare

`/ex21`: osserva i due timer in fondo alla pagina per una decina di secondi — uno avanza, l'altro
resta congelato al valore del primo render. Prova anche `truncate` sul testo lungo in alto, con e
senza secondo argomento.

## Trappole

- Una pipe impura gira ad **ogni** ciclo di change detection, anche per cambiamenti non
  correlati al suo input: costa di più di una pura, va usata con parsimonia (solo quando serve
  davvero, come qui per un orologio).
- In un'app zoneless (come questa) la change detection parte solo su eventi o cambi di signal:
  senza il signal `tick` che si aggiorna ogni secondo nella pagina, nemmeno la pipe impura si
  aggiornerebbe da sola — non basta dichiararla `pure: false`, serve anche qualcosa che
  effettivamente triggeri nuovi cicli di CD.
