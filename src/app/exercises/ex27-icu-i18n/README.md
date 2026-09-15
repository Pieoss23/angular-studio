# Esercizio 27 — Espressioni ICU: `plural` e `select` nel template

## Argomento

I messaggi **ICU** (ICU Message Format) sono una sintassi che Angular compila direttamente nel
template, per scegliere un testo diverso in base a un valore — senza scrivere un `@switch` a
mano. Funzionano anche **senza** nessuna configurazione di i18n/estrazione: sono pura logica
compilata client-side, utile ogni volta che serve testo condizionale su un valore (plurali,
generi, stati, categorie...).

## Concetti da conoscere

- schema `plural`, scritto come contenuto diretto di un elemento (non dentro `{{ }}`):

  ```
  {count, plural, =0 {nessuna notifica} =1 {una notifica} other {{{count}} notifiche}}
  ```

- `other` è **obbligatorio**: è il fallback per ogni valore che non matcha un caso esplicito
  (`=0`, `=1`, ...). Senza `other`, il template non compila.
- per interpolare di nuovo il valore **dentro** un caso, servono le doppie graffe attorno al
  nome (`{{count}}`), non basta scriverlo nudo (`{count}` dentro un caso è testo letterale)
- schema `select`, stessa struttura ma con casi testuali invece che numerici:

  ```
  {role, select, admin {Amministratore} editor {Redattore} other {Utente}}
  ```

- va scritta come testo diretto dentro l'elemento, non assegnata a una variabile del componente
  né messa dentro un'interpolazione `{{ }}` normale

## Scenario

Un contatore di notifiche e un badge di ruolo utente, entrambi da esprimere con ICU.

## Cosa devi fare

Nel primo `<span data-testid="count-icu">`, sostituisci il placeholder con:

```
{count(), plural, =0 {nessuna notifica} =1 {una notifica} other {{{count()}} notifiche}}
```

Nel secondo `<span data-testid="role-icu">`, sostituisci il placeholder con:

```
{role(), select, admin {Amministratore} editor {Redattore} other {Utente}}
```

## Criteri di valutazione

- [ ] con 0 notifiche mostra "nessuna notifica" (non "0 notifiche")
- [ ] con 1 notifica mostra "una notifica" (non "1 notifiche")
- [ ] con N notifiche (N ≥ 2) mostra "N notifiche" con il numero vero interpolato
- [ ] cambiando il ruolo nel dropdown, il badge cambia testo coerentemente (admin/editor/altro)

## Come provare

`/ex27`: usa i bottoni +/- per cambiare il contatore e osserva il testo passare tra i tre casi.
Cambia il ruolo col dropdown e verifica che il badge segua.

## Trappole

- Dimenticare `other` fa fallire la **compilazione** del template (non un errore a runtime): è
  l'unico caso obbligatorio nello schema ICU.
- Dentro un caso, `{count}` nudo non interpola nulla — serve `{{count}}` con le doppie graffe.
- L'espressione va scritta come testo diretto dentro l'elemento HTML, non dentro
  un'interpolazione `{{ }}` né passata come valore di un `[binding]`.
