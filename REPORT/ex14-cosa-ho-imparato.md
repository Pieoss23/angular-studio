# Esercizio 14 — Cosa ho imparato

**Data valutazione:** 2026-09-14
**Esito:** ✅ completato (2 correzioni in review)
**Punteggio criteri:** 4 / 4

## Criteri (check finale)
- [x] il bottone submit è disabilitato finché il form non è valido
- [x] errore password debole mostrato dopo aver toccato il campo
- [x] errore "le password non coincidono" mostrato correttamente
- [x] submit valido → messaggio di successo, form resettato

## Codice finale

```ts
// validators.ts
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);

    return hasMinLength && hasNumber ? null : { passwordStrength: true };
  };
}

export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value;
  const cnfPwd = group.get('confirmPassword')?.value;
  if (!pwd || !cnfPwd) return null;
  return pwd === cnfPwd ? null : { passwordMismatch: true };
};
```

```ts
// ex14-reactive-forms.ts
protected readonly form = new FormGroup(
  { username: ..., email: ..., password: ..., confirmPassword: ... },
  { validators: [passwordsMatch] },
);
```

## Concetti chiave (da ricordare)

- Un validatore di campo è solo una funzione `(control) => ValidationErrors | null`; combinare più
  condizioni (lunghezza + pattern) è semplice logica booleana, nessuna API speciale richiesta.
- Un validatore di **gruppo** riceve l'intero `FormGroup`/`AbstractControl` e legge più campi con
  `group.get('campo')?.value`; va passato come secondo argomento del costruttore del `FormGroup`,
  dentro `{ validators: [...] }`.
- La chiave dell'oggetto errori (`{ passwordMismatch: true }`) è un contratto tra validatore e
  template: `hasError('passwordMismatch')` deve usare la stringa **identica**, altrimenti l'errore
  esiste ma non viene mai "visto" da chi lo controlla.
- `nonNullable: true` tiene il tipo del value sempre `string`, mai `string | null` — niente `?? ''`
  sparsi nel codice.

## Errori corretti in review

1. **`passwordStrength()` incompleta**: la prima versione validava solo `value.length >= 8`,
   ignorando del tutto il requisito "almeno una cifra". Una password come `"abcdefgh"` (8 lettere,
   zero cifre) sarebbe risultata valida. Corretto aggiungendo `/\d/.test(value)` e combinandolo con
   `&&`.

2. **Typo nella chiave dell'errore incrociato**: `passwordsMatch` tornava
   `{ passwordsMismatch: true }` (con una "s" di troppo — plurale "passwords"), mentre la consegna e
   il template si aspettavano `passwordMismatch` (singolare). Con la chiave sbagliata,
   `form.hasError('passwordMismatch')` non trovava mai l'errore: l'hint sarebbe rimasto nascosto
   anche con due password diverse, pur essendo il form tecnicamente invalido (il validatore
   comunque bloccava il submit tramite `form.invalid`, ma l'utente non avrebbe capito perché).

## Trappole verificate

- Un validatore che ritorna un oggetto con la chiave sbagliata (rispetto a quella attesa nel
  template) è un bug silenzioso: TypeScript non lo segnala, perché `ValidationErrors` è
  tipizzato come `{ [key: string]: any }` — qualunque stringa è una chiave valida.
- Testare i validatori con valori limite (es. password di esattamente 8 caratteri senza cifre) è
  l'unico modo pratico di scoprire requisiti dimenticati come questo.

## Approfondimenti
- https://angular.dev/guide/forms/reactive-forms
- https://angular.dev/api/forms/ValidatorFn
