import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseShell } from '../../shared/exercise-shell';

@Component({
  selector: 'app-ex29-title-strategy',
  imports: [ExerciseShell, RouterLink],
  template: `
    <app-exercise-shell n="29" topic="Router / HTTP" folder="ex29-title-strategy"
      title="Router: TitleStrategy custom, titoli di pagina dinamici">

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Ogni rotta può avere un <code>title</code> (stringa o funzione) nella sua config, e il
          router lo applica al <code>&lt;title&gt;</code> del documento ad ogni navigazione,
          tramite una <code>TitleStrategy</code>. Quella di default si limita a copiare il
          <code>title</code> della rotta così com'è. Una <strong>strategia custom</strong> ti
          permette di trasformarlo — es. aggiungere un suffisso col nome del sito, come fanno
          praticamente tutte le app reali.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>&#123; path: 'ex29', title: 'Titolo di questa pagina' &#125;</code> nella config
            delle rotte</li>
          <li><code>class Strategia extends TitleStrategy &#123; override updateTitle(snapshot) &#123; ... &#125; &#125;</code></li>
          <li><code>this.buildTitle(snapshot)</code> — metodo ereditato, ricava il
            <code>title</code> della rotta attiva più profonda (gestisce anche i casi di rotte
            annidate)</li>
          <li><code>inject(Title).setTitle(...)</code> — il servizio che aggiorna davvero il
            <code>&lt;title&gt;</code> nel <code>&lt;head&gt;</code></li>
          <li>si attiva con <code>&#123; provide: TitleStrategy, useClass: Strategia &#125;</code> nei
            <code>providers</code> (già collegato)</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Questa rotta (<code>/ex29</code>) ha già <code>title: 'Esercizio 29 — Title Strategy'</code>
          nella sua config.
        </p>

        <h3>Cosa devi fare — <code>app-title.strategy.ts</code></h3>
        <ol>
          <li>implementa <code>updateTitle(snapshot)</code> come descritto nei TODO del file:
            prendi il titolo della rotta con <code>buildTitle</code>, appendici
            <code>" · Angular Studio"</code> se presente, altrimenti usa solo "Angular Studio"</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> il tab del browser su <code>/ex29</code> mostra "Esercizio 29 — Title Strategy · Angular Studio"</li>
          <li><span class="hint">☐</span> il tab su <code>/</code> (che ha <code>title: 'Angular Studio'</code>) mostra solo "Angular Studio", senza doppio suffisso</li>
          <li><span class="hint">☐</span> una rotta senza <code>title</code> nella config (es. <code>/ex01</code>) mostra comunque un titolo sensato, non vuoto</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          Guarda il titolo del tab del browser mentre navighi tra <code>/</code>,
          <code>/ex29</code> e <code>/ex01</code> con il link qui sotto.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>se dimentichi di gestire il caso "<code>routeTitle</code> assente", il titolo
            resterebbe quello della pagina precedente (il router non lo tocca se
            <code>updateTitle</code> non chiama <code>setTitle</code>)</li>
          <li>occhio a non appendere due volte il suffisso quando <code>routeTitle</code> è già
            uguale a <code>"Angular Studio"</code> (il caso della home)</li>
        </ul>
      </div>

      <div class="card">
        <p class="hint">naviga e osserva il tab del browser:</p>
        <p><a routerLink="/">torna alla home</a></p>
        <p><a routerLink="/ex01">vai a /ex01 (nessun title in config)</a></p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex29TitleStrategy {}
