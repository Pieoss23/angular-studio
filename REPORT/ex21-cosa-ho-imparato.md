# Esercizio 21 — Cosa ho imparato

**Data valutazione:** 2026-09-16
**Esito:** ✅ completato
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] `'ciao' | truncate:10` torna `'ciao'` intatto (è più corto di 10)
- [x] una stringa lunga viene tagliata a `limit` caratteri + suffisso di troncamento
- [x] `limit` di default è 20 se non passato
- [x] capito perché il contatore "puro" resta fermo e quello "impuro" no

## Codice finale

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
```

## Concetti chiave (da ricordare)

- Una pipe pura (default) viene ricalcolata solo se cambia il riferimento/valore del suo input;
  una impura (`pure: false`) rigira ad ogni ciclo di change detection, indipendentemente
  dall'input.
- Confrontare fianco a fianco `elapsed` (impura) ed `elapsedPure` (pura) sullo stesso timestamp
  fisso rende visibile la differenza: solo la prima avanza nel tempo, perché il signal `tick`
  della pagina forza nuovi cicli di CD ogni secondo.
- Il parametro di default (`limit = 20`) nella firma di `transform` si applica automaticamente
  quando la pipe è usata senza secondo argomento nel template.

## Trappole verificate

Nessuna: build pulita, `truncate` gestisce correttamente sia il caso "stringa già corta" sia
quello "da tagliare", con e senza limite esplicito.

## Approfondimenti
- https://angular.dev/guide/templates/pipes
