import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExerciseShell } from '../../shared/exercise-shell';
import { passwordStrength, passwordsMatch } from './validators';

@Component({
  selector: 'app-ex14-reactive-forms',
  imports: [ExerciseShell, ReactiveFormsModule],
  template: `
    <app-exercise-shell n="14" topic="Form" folder="ex14-reactive-forms" completed
      title="Reactive Forms tipizzati: FormGroup, validatori custom, validazione incrociata">

      <div imparato>
        <h3>Esito: ✅ completato — 4/4 (2 correzioni in review)</h3>
        <ul>
          <li>un validatore di campo è solo <code>(control) =&gt; ValidationErrors | null</code>:
            <code>passwordStrength()</code> combina un controllo di lunghezza
            (<code>value.length &gt;= 8</code>) e un controllo di pattern (<code>/\d/.test(value)</code>)
            con un semplice <code>&amp;&amp;</code>.</li>
          <li>un validatore di <strong>gruppo</strong> riceve l'intero <code>FormGroup</code> e legge
            più campi con <code>group.get('campo')?.value</code>: va passato come secondo argomento
            del costruttore, dentro <code>&#123; validators: [...] &#125;</code>.</li>
          <li>la chiave dell'errore restituita (es. <code>passwordMismatch</code>) è un contratto tra
            il validatore e il template: <code>form.hasError('passwordMismatch')</code> deve usare
            <strong>esattamente</strong> la stessa stringa.</li>
        </ul>
        <h3>Corretto in review</h3>
        <ul>
          <li><code>passwordStrength()</code>: la prima versione controllava solo la lunghezza,
            mancava del tutto il controllo "almeno una cifra" richiesto dalla consegna.</li>
          <li><code>passwordsMatch</code>: la chiave dell'errore era <code>passwordsMismatch</code>
            (con una "s" di troppo, plurale) invece di <code>passwordMismatch</code> — il template
            cercava la chiave singolare e non l'avrebbe mai trovata, lasciando l'hint sempre
            nascosto anche con password diverse.</li>
        </ul>
      </div>

      <div consegna>
        <h3>Argomento</h3>
        <p>
          I <strong>Typed Reactive Forms</strong> danno a ogni <code>FormControl</code> un tipo
          preciso (niente più <code>any</code>): con <code>nonNullable: true</code> il valore non
          è mai <code>null</code>, anche dopo un <code>reset()</code>. Un <strong>validatore</strong>
          è solo una funzione <code>(control) =&gt; ValidationErrors | null</code>; puoi scriverne
          di tuoi oltre a quelli built-in (<code>Validators.required</code>, ecc.), e puoi anche
          applicarne uno all'intero <code>FormGroup</code> per validare più campi insieme
          (<strong>validazione incrociata</strong>).
        </p>

        <h3>Concetti</h3>
        <ul>
          <li><code>new FormControl('', &#123; nonNullable: true, validators: [...] &#125;)</code></li>
          <li>validatore custom: <code>(control) =&gt; control.value.length &gt; 3 ? null : &#123; tooShort: true &#125;</code></li>
          <li>validatore di gruppo: passato come secondo argomento del
            <code>FormGroup</code>, riceve l'intero gruppo e può leggere più campi con
            <code>group.get('campo')?.value</code></li>
          <li><code>control.invalid &amp;&amp; control.touched</code> — pattern classico per
            mostrare errori solo dopo che l'utente ha interagito col campo</li>
          <li><code>control.hasError('nomeErrore')</code> per controllare un errore specifico</li>
        </ul>

        <h3>Scenario</h3>
        <p>Form di registrazione: username, email, password, conferma password.</p>

        <h3>Cosa devi fare — <code>validators.ts</code></h3>
        <ol>
          <li><code>passwordStrength()</code>: valido se ≥ 8 caratteri e almeno una cifra</li>
          <li><code>passwordsMatch</code>: valido se <code>password</code> e
            <code>confirmPassword</code> coincidono</li>
        </ol>

        <h3>Cosa devi fare — questo file</h3>
        <ol>
          <li>collega <code>passwordsMatch</code> come validatore del <code>FormGroup</code>
            (secondo argomento del costruttore)</li>
          <li>sotto il campo "conferma password", mostra un messaggio d'errore quando il gruppo
            ha <code>passwordMismatch</code> ed entrambi i campi sono stati toccati</li>
        </ol>

        <h3>Criteri di valutazione</h3>
        <ul class="checklist">
          <li><span class="hint">☐</span> il bottone submit è disabilitato finché il form non è valido</li>
          <li><span class="hint">☐</span> errore password debole mostrato dopo aver toccato il campo</li>
          <li><span class="hint">☐</span> errore "le password non coincidono" mostrato correttamente</li>
          <li><span class="hint">☐</span> submit valido → messaggio di successo, form resettato</li>
        </ul>

        <h3>Come provare</h3>
        <p>
          <code>/ex14</code>: prova a inviare vuoto (bottone disabilitato), scrivi una password
          debole, scrivi due password diverse, poi compila tutto correttamente e invia.
        </p>

        <h3>Trappole</h3>
        <ul>
          <li>un validatore che ritorna <code>&#123;&#125;</code> invece di <code>null</code> conta come
            "non valido": l'oggetto vuoto non è falsy per Angular</li>
          <li>con <code>nonNullable: true</code> il tipo del value è <code>string</code>, non
            <code>string | null</code>: niente più <code>?? ''</code> ovunque</li>
        </ul>
      </div>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()" style="display: grid; gap: 12px; max-width: 360px;">
          <label>
            Username
            <input formControlName="username" class="input" />
            @if (form.controls.username.invalid && form.controls.username.touched) {
              <span class="hint">min. 3 caratteri</span>
            }
          </label>

          <label>
            Email
            <input formControlName="email" class="input" />
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <span class="hint">email non valida</span>
            }
          </label>

          <label>
            Password
            <input type="password" formControlName="password" class="input" />
            @if (form.controls.password.hasError('passwordStrength') && form.controls.password.touched) {
              <span class="hint">almeno 8 caratteri e una cifra</span>
            }
          </label>

          <label>
            Conferma password
            <input type="password" formControlName="confirmPassword" class="input" />
            <!--
              TODO(14.4): mostra un hint "le password non coincidono" quando
              form.hasError('passwordMismatch') ed entrambi i campi password
              e confirmPassword sono touched
            -->
            @if (
              form.hasError('passwordMismatch')   &&
              form.controls.password.touched  &&
              form.controls.confirmPassword.touched
            ) {
              <span class="hint"> Le password non coincidono </span>
            }
          </label>

          <button type="submit" class="btn" [disabled]="form.invalid">registrati</button>

          @if (submitted()) {
            <p class="hint">✅ registrazione inviata per {{ lastUsername() }}</p>
          }
        </form>
      </div>
    </app-exercise-shell>
  `,
})
export class Ex14ReactiveForms {
  protected readonly form = new FormGroup(
    {
      username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, passwordStrength()] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    // TODO(14.3): aggiungi { validators: [passwordsMatch] } qui come secondo argomento
    { validators: [passwordsMatch] },
  );

  protected readonly submitted = signal(false);
  protected readonly lastUsername = signal('');

  protected submit(): void {
    if (this.form.invalid) return;
    this.lastUsername.set(this.form.controls.username.value);
    this.submitted.set(true);
    this.form.reset();
  }
}
