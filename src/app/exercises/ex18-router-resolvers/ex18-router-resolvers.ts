import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExerciseShell } from '../../shared/exercise-shell';
import { ProjectService } from './project.service';

@Component({
  selector: 'app-ex18-router-resolvers',
  imports: [ExerciseShell, RouterLink],
  template: `
    <app-exercise-shell n="18" topic="Router / HTTP" folder="ex18-router-resolvers" completed
      title="Router avanzato: resolver funzionali e route data">

      <div imparato>
        <h3>Esito: ✅ completato — 3/3 (1 correzione in review)</h3>
        <ul>
          <li>un resolver può reindirizzare senza mai "risolvere" per la navigazione corrente:
            invece di completare con un valore vuoto/segnaposto, si ritorna <code>EMPTY</code>
            dopo aver chiamato <code>router.navigate(...)</code> — niente valore intermedio da
            gestire lato componente.</li>
          <li><code>switchMap</code> nella pipe del resolver trasforma il progetto risolto in
            <code>of(project)</code> quando esiste, o interrompe con <code>EMPTY</code> quando no —
            un pattern più robusto del semplice <code>tap()</code> con effetto collaterale.</li>
          <li>bonus: gestito anche il caso limite <code>id === null</code> (path param assente),
            non richiesto esplicitamente ma corretto da controllare.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li>primo tentativo: <code>tap()</code> + <code>router.navigate()</code> senza
            interrompere il flusso — il resolver risolveva comunque con <code>undefined</code>,
            affidandosi solo alla cancellazione della navigazione da parte del router. Riscritto
            con <code>switchMap</code> + <code>EMPTY</code> per non lasciare nulla al caso.</li>
          <li>rimosso un import inutilizzato (<code>EmailValidationError</code> da
            <code>&#64;angular/forms/signals</code>), finito nel file per sbaglio.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Un <strong>resolver</strong> recupera i dati <em>prima</em> che il router attivi la
          rotta: il componente si monta già con i dati pronti, niente "flash" di loading iniziale
          dentro il componente stesso. Combinato con
          <code>withComponentInputBinding()</code> (già attivo in questo progetto, vedi
          <code>app.config.ts</code>), il valore risolto arriva <strong>direttamente come input</strong> del
          componente, senza leggere <code>ActivatedRoute</code> a mano.
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>ResolveFn&lt;T&gt;</code> — funzione, riceve <code>(route, state)</code>,
            gira in injection context (puoi usare <code>inject()</code>)</li>
          <li>registrazione: <code>&#123; path: 'ex18/:id', resolve: &#123; project: projectResolver &#125; &#125;</code></li>
          <li>con <code>withComponentInputBinding()</code>, la chiave <code>project</code> nei
            dati risolti diventa automaticamente l'input <code>project</code> del componente
            (stesso nome)</li>
          <li>un resolver può ritornare un <code>Observable</code>: il router aspetta che emetta
            prima di attivare la rotta</li>
          <li>se il dato non esiste, il resolver può reindirizzare (come un guard) invece di far
            montare un componente senza dati</li>
        </ul>

        <h3>Scenario</h3>
        <p>
          Lista progetti qui sotto → click su uno → <code>/ex18/:id</code>, che carica
          <code>ProjectDetail</code> con il progetto già risolto.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>project.resolver.ts</code>: implementa <code>projectResolver</code> come
            descritto nei TODO del file</li>
          <li><code>app.routes.ts</code>: aggiungi la rotta <code>ex18/:id</code> con
            <code>loadComponent</code> su <code>ProjectDetail</code> e
            <code>resolve: &#123; project: projectResolver &#125;</code> (guarda com'è fatta la rotta
            <code>ex10/secret</code> per lo stile)</li>
          <li><code>project-detail.ts</code>: distingui visivamente "attivo" da "archiviato"</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> cliccando un progetto, il dettaglio appare già popolato (niente stato vuoto iniziale)</li>
          <li><span class="hint">☐</span> un id inesistente (prova <code>/ex18/nope</code>) reindirizza a <code>/ex18</code></li>
          <li><span class="hint">☐</span> il componente non legge <code>ActivatedRoute</code> a mano: usa solo l'input</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex18</code> → clicca un progetto → verifica l'URL e il contenuto. Poi prova
          manualmente <code>/ex18/nope</code> nella barra indirizzi.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>il nome della chiave in <code>resolve: &#123; project: ... &#125;</code> deve combaciare
            <strong>esattamente</strong> col nome dell'input nel componente</li>
          <li>un resolver che non completa mai (Observable che non emette) blocca la navigazione
            per sempre: nel caso "non trovato", ricorda di reindirizzare, non lasciare la
            Observable a metà</li>
        </ul>
      </div>

      <div class="card">
        @if (projects.isLoading()) {
          <p class="hint">carico progetti…</p>
        }
        <ul>
          @for (p of projects.value() ?? []; track p.id) {
            <li>
              <a [routerLink]="['/ex18', p.id]">{{ p.name }}</a>
              <span class="hint"> — {{ p.status }}</span>
            </li>
          }
        </ul>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex18RouterResolvers {
  private readonly service = inject(ProjectService);

  protected readonly projects = resource({
    loader: () => firstValueFrom(this.service.list()),
  });
}
