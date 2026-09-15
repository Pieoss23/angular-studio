import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseShell } from '../../shared/exercise-shell';
import { AuthStore } from './auth-store';

@Component({
  selector: 'app-ex10-guards-interceptors',
  imports: [ExerciseShell, RouterLink],
  template: `
    <app-exercise-shell n="10" topic="Router / HTTP" folder="ex10-guards-interceptors" completed
      title="Functional guard + interceptor + input binding di rotta">

      <div imparato>
        <h3>Esito: ✅ completato — 5/5 (2 correzioni in review)</h3>
        <ul>
          <li>Guard funzionale: <code>CanActivateFn</code> è solo una funzione con <code>inject()</code>,
            ritorna <code>true</code> o un <code>UrlTree</code> per il redirect — niente classe
            che implementa <code>CanActivate</code>.</li>
          <li><code>HttpRequest</code> è <strong>immutabile</strong>: <code>req.clone(&#123; setHeaders &#125;)</code>
            ritorna una richiesta nuova, non modifica quella originale. Il valore va assegnato a una
            variabile e inoltrato esplicitamente con <code>next(...)</code>.</li>
          <li><code>withComponentInputBinding()</code>: i query param finiscono automaticamente
            negli <code>input()</code> con lo stesso nome, senza leggere <code>ActivatedRoute</code>.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li><code>const token = inject(AuthStore)</code>: era l'istanza dello store, non il
            token — sempre "truthy" anche da anonimo. Corretto in <code>inject(AuthStore).token()</code>.</li>
          <li><code>req.clone(&#123;...&#125;)</code> col risultato scartato, poi <code>next(req)</code> sulla
            richiesta originale: l'header non arrivava mai. Corretto salvando il risultato in una
            variabile (<code>authReq</code>) e passandola a <code>next(...)</code>. Primo tentativo
            di fix aveva ridichiarato <code>authReq</code> con <code>const</code> dentro l'<code>if</code>
            — variable shadowing, stesso bug spostato di un livello: risolto togliendo quel <code>const</code>.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          Angular ha spostato guard, interceptor e lettura dei parametri di rotta da
          <strong>classi + DI</strong> a <strong>funzioni + <code>inject()</code></strong>: meno
          boilerplate, meglio tree-shakable.
        </p>
        <ul>
          <li><strong>Guard funzionale</strong> (<code>CanActivateFn</code>): una funzione che
            ritorna <code>boolean | UrlTree | Observable | Promise</code>. Per un redirect
            ritorna un <code>UrlTree</code>, non <code>false</code>.</li>
          <li><strong>Interceptor funzionale</strong> (<code>HttpInterceptorFn</code>):
            <code>(req, next) =&gt; next(req)</code>, registrato con <code>withInterceptors([...])</code>.
            <code>HttpRequest</code> è immutabile: <code>req.clone(&#123; setHeaders &#125;)</code>.</li>
          <li><strong><code>withComponentInputBinding()</code></strong>: path param, query param e
            <code>data</code> della rotta finiscono automaticamente negli <code>input()</code> con
            lo stesso nome. Niente <code>ActivatedRoute</code>.</li>
        </ul>

        <h3>Concetti</h3>
        <ul>
          <li><code>export const authGuard: CanActivateFn = () =&gt; &#123; ... &#125;</code> con <code>inject(AuthStore)</code> / <code>inject(Router)</code></li>
          <li>redirect: <code>return router.createUrlTree(['/ex10'])</code></li>
          <li><code>export const authInterceptor: HttpInterceptorFn = (req, next) =&gt; &#123; ... &#125;</code></li>
          <li><code>req.clone(&#123; setHeaders: &#123; Authorization: 'Bearer ' + token &#125; &#125;)</code></li>
          <li>componente: <code>readonly msg = input('')</code> ← <code>?msg=...</code></li>
        </ul>

        <h3>Scenario</h3>
        <p>
          <code>AuthStore</code> (pronto): <code>token</code>, <code>isLoggedIn</code>,
          <code>login()</code>/<code>logout()</code>. La rotta <code>/ex10/secret</code> è protetta.
          Ogni richiesta HTTP da loggato deve avere l'header <code>Authorization</code>.
          <code>app.config.ts</code> ha già <code>withComponentInputBinding()</code> e
          <code>withInterceptors([authInterceptor])</code>; la rotta ha già
          <code>canActivate: [authGuard]</code>.
        </p>

        <h3>Cosa devi fare</h3>
        <ol>
          <li><code>auth.guard.ts</code>: <code>auth.isLoggedIn() ? true : router.createUrlTree(['/ex10'])</code></li>
          <li><code>auth.interceptor.ts</code>: se c'è token → <code>req.clone</code> con <code>Authorization</code>; sempre <code>console.log(req.method, req.url)</code>; sempre <code>next(req)</code></li>
          <li><code>ex10-guards-interceptors.ts</code>: verifica che <code>/ex10?msg=ciao</code> mostri "ciao"</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> guard funzionale, <code>inject()</code>, redirect con <code>UrlTree</code></li>
          <li><span class="hint">☐</span> interceptor clona la richiesta (non muta <code>req</code>)</li>
          <li><span class="hint">☐</span> header presente solo dopo login</li>
          <li><span class="hint">☐</span> query param → <code>input()</code> senza <code>ActivatedRoute</code></li>
          <li><span class="hint">☐</span> niente classi <code>&#64;Injectable</code> che implementano <code>CanActivate</code> / <code>HttpInterceptor</code></li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex10</code>: da anonimo "vai alla pagina segreta" → rimandato indietro; fai
          "login" e riprova → entri; nella pagina segreta il bottone GET logga in console e la
          richiesta in Network ha <code>Authorization: Bearer studio-token-123</code>. Apri
          <code>/ex10?msg=ciao</code> → compare "ciao".
        </p>
      </div>

      <div class="card">
        <p>Stato: <strong>{{ auth.isLoggedIn() ? 'loggato' : 'anonimo' }}</strong></p>
        <div class="row">
          <button class="btn primary" (click)="auth.login()">login</button>
          <button class="btn" (click)="auth.logout()">logout</button>
        </div>
      </div>

      <div class="card">
        <p>
          <a routerLink="/ex10/secret">vai alla pagina segreta →</a>
          (senza login la guard deve rimandarti qui)
        </p>
      </div>

      <div class="card">
        <strong>Route input binding</strong>
        <!-- TODO(10.3): input 'msg' popolato dal query param ?msg=... via withComponentInputBinding() -->
        <p class="hint">Apri <code>/ex10?msg=ciao</code>: qui sotto deve comparire "ciao".</p>
        <p>msg = <strong>{{ msg() }}</strong></p>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex10GuardsInterceptors {
  protected readonly auth = inject(AuthStore);

  // TODO(10.3): dichiara l'input 'msg' (string). Con withComponentInputBinding()
  // il router lo popola automaticamente dai query param.
  readonly msg = input('');
}
