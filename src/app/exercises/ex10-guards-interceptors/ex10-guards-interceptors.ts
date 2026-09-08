import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseShell } from '../../shared/exercise-shell';
import { AuthStore } from './auth-store';

@Component({
  selector: 'app-ex10-guards-interceptors',
  imports: [ExerciseShell, RouterLink],
  template: `
    <app-exercise-shell n="10" topic="Router / HTTP" folder="ex10-guards-interceptors"
      title="Functional guard + interceptor + input binding di rotta">

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
