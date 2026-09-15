# Esercizio 14 — Reactive Forms tipizzati: validatori custom e validazione incrociata

## Argomento

I Typed Reactive Forms danno a ogni `FormControl` un tipo preciso invece di `any`. Con
`nonNullable: true` il valore non è mai `null`, nemmeno dopo `reset()` — resta il tipo che hai
dichiarato (qui sempre `string`).

Un validatore è solo una funzione `(control) => ValidationErrors | null`. Oltre a quelli
built-in (`Validators.required`, `Validators.email`, `Validators.minLength`, …) puoi scriverne di
tuoi, e puoi applicarne uno anche all'intero `FormGroup` per validare più campi insieme (es.
"le due password devono coincidere").

## Concetti da conoscere

- `new FormControl('', { nonNullable: true, validators: [...] })`
- validatore custom di campo: riceve l'`AbstractControl`, legge `.value`, ritorna `null` (ok) o un
  oggetto di errori come `{ passwordStrength: true }`
- validatore di gruppo: passato come secondo argomento del `FormGroup`, riceve l'intero gruppo e
  legge più campi con `group.get('campo')?.value`
- `control.invalid && control.touched` — pattern classico per mostrare errori solo dopo che
  l'utente ha interagito col campo (non subito, a form vuoto)
- `control.hasError('nomeErrore')` per controllare un errore specifico invece di tutto `.errors`

## Scenario

Un form di registrazione con username, email, password e conferma password.

## Cosa devi fare

### `validators.ts`

1. `passwordStrength()`: valido (torna `null`) se la password ha almeno 8 caratteri **e**
   contiene almeno una cifra; altrimenti torna `{ passwordStrength: true }`.
2. `passwordsMatch`: valido se `password` e `confirmPassword` coincidono (o se uno dei due è
   ancora vuoto, per non mostrare errore a form appena aperto); altrimenti
   `{ passwordMismatch: true }`.

### `ex14-reactive-forms.ts`

1. Collega `passwordsMatch` come validatore del `FormGroup`, secondo argomento del costruttore:
   ```ts
   new FormGroup({ ... }, { validators: [passwordsMatch] })
   ```
2. Sotto il campo "conferma password", mostra un hint quando `form.hasError('passwordMismatch')`
   ed entrambi i campi password sono stati toccati.

## Criteri di valutazione

- [ ] il bottone submit resta disabilitato finché il form non è valido
- [ ] l'errore di password debole compare solo dopo aver toccato quel campo
- [ ] l'errore "le password non coincidono" compare/scompare correttamente mentre digiti
- [ ] un submit valido mostra il messaggio di successo e resetta il form

## Come provare

`/ex14`: prova a inviare a vuoto (disabilitato), scrivi una password debole (es. `abc`), scrivi
due password diverse, poi compila tutto correttamente e invia.

## Trappole

- Un validatore che ritorna `{}` invece di `null` conta comunque come "non valido": l'oggetto
  vuoto non è `falsy` per Angular.
- Con `nonNullable: true` il tipo di `.value` è `string`, non `string | null`: non serve più
  `?? ''` in giro.
- Il validatore di gruppo va ri-eseguito ogni volta che **uno qualsiasi** dei campi coinvolti
  cambia: Angular lo fa automaticamente, non serve wiring manuale.
