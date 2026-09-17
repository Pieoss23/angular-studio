# Progetto finale — Libreria ricette

## Obiettivo

Un progetto vero, non un esercizio isolato: metti insieme la maggior parte delle tecniche viste
negli esercizi 1-30 in un'unica app coerente. A differenza degli esercizi, qui **non ci sono
TODO da riempire** — c'è una roadmap a milestone. Decidi tu come strutturare i componenti, i
file, i nomi. Io ti aiuto sui passaggi critici quando li chiedi, e rivedo ogni milestone quando
la dichiari finita, con lo stesso spirito con cui abbiamo fatto gli esercizi.

## Come lavoriamo

1. Vai in ordine di milestone (sono pensate per costruire l'una sull'altra), ma se vuoi
   deviare/riordinare va benissimo — è il tuo progetto.
2. Costruisci in autonomia. Chiedimi aiuto su un passaggio specifico quando vuoi ("come strutturo
   il resolver per la rotta di dettaglio?", "perché questo linkedSignal non si aggiorna?") — non
   serve essere bloccati per chiedere.
3. Quando una milestone ti sembra completa, scrivimi "ho finito M&lt;n&gt;". La controllo (build,
   logica, pattern usati) e ti do feedback come per gli esercizi.
4. Non c'è un punteggio numerico qui: l'obiettivo è un'app che funziona e usa bene le tecniche,
   non spuntare caselle.

## Dominio

Una libreria di ricette di cucina. Entità principale: `Recipe` (già definita in
`models/recipe.model.ts`), con ingredienti scalabili per porzioni, categoria, tempo di cottura,
tag. Dati seed già pronti in `data/mock-recipes.ts` (puoi estenderli o sostituirli).

---

## M0 — Setup e modello dati

**Obiettivo**: struttura di base che compila, con una lista vuota funzionante.

- Registra le rotte del progetto sotto `/progetto` in `app.routes.ts` (questa pagina già esiste
  su `/progetto`; aggiungi almeno `/progetto/ricette` come lista).
- Crea un componente `RecipeList` che per ora mostra solo `MOCK_RECIPES.length` ricette come
  segnaposto.
- Un signal per lo stato "ricette correnti" (anche solo `signal(MOCK_RECIPES)` per iniziare).

**Fatto quando**: `/progetto/ricette` renderizza senza errori e mostra qualcosa di derivato dai
dati mock.

## M1 — Lista e ricerca

**Obiettivo**: una griglia di card ricetta, con ricerca testuale reattiva.

- `RecipeCard`: componente con `input.required<Recipe>()`, mostra immagine/titolo/tempo cottura.
- Campo di ricerca: signal `query`, filtro sul titolo/tag. Usa il pattern di **ex15** (
  `toObservable` + `debounceTime` + `toSignal`, oppure un `effect` con cleanup come in **ex24**)
  per non rifiltrare a ogni tasto in modo "greggio" — qui i dati sono locali quindi il debounce è
  più per abitudine che per necessità, ma allenati comunque a scriverlo bene.
- Pipe custom (stile **ex21**): es. `cookTime` che trasforma `35` minuti in `"35 min"` o
  `95` in `"1h 35min"`.
- Direttiva custom (stile **ex13**): evidenzia nel titolo la porzione di testo che matcha la
  ricerca corrente.
- Empty state con `@if`/`@else` quando la ricerca non trova nulla.

**Fatto quando**: digitando nella ricerca la griglia si filtra, il testo che matcha è
evidenziato, e i tempi di cottura sono formattati dalla pipe.

## M2 — Store centralizzato

**Obiettivo**: spostare lo stato "ricette" da un signal locale a un servizio condiviso.

- `RecipeStore` (`providedIn: 'root'`), stile **ex20**: signal privati (`_recipes`, `_favorites`
  come `Set<string>` o array di id), esposti readonly, più `computed` per "ricette filtrate" e
  "solo preferite".
- Bottone "preferito" su ogni card che chiama un metodo dello store (`toggleFavorite(id)`),
  immutabile.
- **Porzioni con `linkedSignal`** (stile **ex06**): nel dettaglio (arriverà a M3, ma progetta
  già la logica) un signal "porzioni scelte" che parte dal `servings` della ricetta ma resta
  modificabile dall'utente, e un `computed` che scala le quantità degli ingredienti
  proporzionalmente.

**Fatto quando**: i preferiti persistono navigando tra le pagine (perché vivono nello store, non
in un componente), e la logica di scaling porzioni è isolata e testabile (tornerà utile a M8).

## M3 — Dettaglio ricetta

**Obiettivo**: pagina `/progetto/ricette/:id` con i dati già pronti all'attivazione della rotta.

- **Resolver funzionale** (stile **ex18**): recupera la ricetta per id, redirect a
  `/progetto/ricette` se non esiste. Usa `switchMap`/`EMPTY`, non `tap` con side-effect (lo
  abbiamo corretto proprio per questo motivo nell'esercizio 18).
- Componente `RecipeCardDetail` o simile con **content projection** (stile **ex11**): slot per
  header/azioni/corpo, riusabile anche altrove se ti torna comodo.
- **Espressioni ICU** (stile **ex27**) per "N ingredienti" e "per N persone" — niente `if`/`else`
  scritti a mano per il plurale.
- La `TitleStrategy` globale (già attiva da **ex29**) userà il `title` che imposti sulla rotta o
  sui dati risolti: verifica che il tab del browser mostri il nome della ricetta.

**Fatto quando**: navigando a una ricetta il tab del browser cambia titolo, gli ingredienti sono
scalati secondo le porzioni scelte (da M2), e un id inesistente reindirizza alla lista.

## M4 — Form di creazione/modifica

**Obiettivo**: aggiungere/modificare una ricetta da UI, non solo dati mock.

- Form tipizzato (stile **ex14**) con `FormGroup`/`FormControl` e `nonNullable: true`.
- Validatori custom: titolo (min length), porzioni (> 0), almeno un ingrediente.
- **Novità rispetto a ex14**: gli ingredienti sono una lista dinamica → `FormArray`. Non l'hai
  visto in un esercizio dedicato, ma è la stessa logica di `FormGroup`/`FormControl` applicata a
  un array — chiedimi aiuto se ti blocchi sulla sintassi.
- Il salvataggio scrive nello `RecipeStore` (nuovo metodo `addRecipe`/`updateRecipe`,
  immutabile).

**Fatto quando**: puoi creare una nuova ricetta da form, appare in lista, e i validatori
bloccano un submit con dati incompleti.

## M5 — Dati remoti

**Obiettivo**: una sezione che pesca ricette da un'API pubblica vera, non solo dati mock locali.

- Sezione "Scopri" che usa `httpResource()` (stile **ex08**) contro un'API pubblica gratuita
  senza chiave — [TheMealDB](https://www.themealdb.com/api.php) è una buona opzione
  (`https://www.themealdb.com/api/json/v1/1/search.php?s=<query>`).
- `retry`/`catchError` (stile **ex25**) per gestire l'API che non risponde; fallback a un
  messaggio "servizio non disponibile", non a un errore non gestito.
- Questa sezione non è above-the-fold: avvolgila in **`@defer`** (stile **ex09**) con
  `@placeholder`/`@loading`.

**Fatto quando**: la sezione "Scopri" cerca su TheMealDB, gestisce loading/errore, e il suo
codice non è nel bundle iniziale (verificabile in Network, come nell'esercizio 9).

## M6 — Area personale protetta

**Obiettivo**: una sezione "Le mie ricette" riservata, con un minimo di infrastruttura da app
vera.

- **Guard** (stile **ex10**) su `/progetto/mie-ricette`: se non "loggato" (uno store fittizio
  tipo `AuthStore` di ex10 va benissimo, anche riusato/adattato), redirect.
- **Interceptor** che aggiunge un header fittizio alle chiamate verso l'area personale.
- **Environment provider** (stile **ex23**): `provideRecipeConfig({ defaultUnit: 'g', ... })`
  per preferenze utente (unità di misura, porzioni di default) iniettabili ovunque.

**Fatto quando**: senza login `/progetto/mie-ricette` reindirizza; da loggato ci accedi e vedi
solo le tue ricette (quelle create a M4, per esempio).

## M7 — Rifiniture UX

**Obiettivo**: far sembrare l'app rifinita, non solo funzionante.

- `animate.enter`/`animate.leave` (stile **ex16**) sulle card quando appaiono/spariscono per via
  della ricerca o dei filtri.
- `NgOptimizedImage` (stile **ex26**) sulle immagini ricetta, con `priority` sulla prima card
  visibile.
- Toast "ricetta salvata" / "aggiunta ai preferiti" creati **dinamicamente** (stile **ex30**,
  `ViewContainerRef.createComponent()`), non con un `@if` nel template.

**Fatto quando**: aggiungere/rimuovere un preferito o salvare una ricetta mostra un toast che
sparisce da solo, le card animano invece di comparire di scatto, le immagini non causano layout
shift.

## M8 — Qualità

**Obiettivo**: chiudere il cerchio con un minimo di rete di sicurezza.

- Test unitari (stile **ex17**, `TestBed`) su `RecipeStore`: la logica di scaling porzioni
  (quella isolata a M2), il toggle preferiti, il filtro ricerca.
- **`PreloadingStrategy`** selettiva (stile **ex28**) che precarica il chunk di
  `/progetto/mie-ricette` in background, marcando la rotta con `data: { preload: true }`.

**Fatto quando**: `npm test` copre almeno la logica di scaling porzioni e il toggle preferiti, e
il chunk dell'area personale si vede partire in Network poco dopo il caricamento di `/progetto`.

---

## Suggerimenti generali

- Non c'è bisogno di implementare tutto prima di mostrarmi qualcosa: fammi vedere anche
  milestone parziali se vuoi un parere in corso d'opera.
- Riusa componenti/pattern tra milestone quando ha senso (es. `RecipeCard` di M1 dentro
  `RecipeList` e dentro i preferiti di M6) — non c'è bonus per duplicare codice.
- Se una milestone ti sembra troppo grande, spezzala in passi più piccoli e dimmi "ho finito
  M4 parte 1" — va benissimo, l'importante è il ritmo che funziona per te.
- Quando non sai da dove iniziare su una milestone, chiedimi "come struttureresti questa parte?"
  prima di scrivere codice — è un aiuto legittimo, diverso da chiedermi di scriverla al posto
  tuo.
