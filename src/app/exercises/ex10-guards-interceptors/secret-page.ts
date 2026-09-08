import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthStore } from './auth-store';

@Component({
  selector: 'app-secret-page',
  imports: [RouterLink],
  template: `
    <div class="card">
      <h2>🔒 Pagina segreta</h2>
      <p>Sei qui solo se la guard ti ha fatto passare. Token: <code>{{ auth.token() }}</code></p>
      <button class="btn" (click)="ping()">GET /todos/1 (guarda console: header + log interceptor)</button>
      <p><a routerLink="/ex10">← torna</a></p>
    </div>
  `,
})
export class SecretPage {
  protected readonly auth = inject(AuthStore);
  private readonly http = inject(HttpClient);

  ping(): void {
    this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe();
  }
}
