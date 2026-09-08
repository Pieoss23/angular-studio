import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(null);
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(): void {
    this._token.set('studio-token-123');
  }

  logout(): void {
    this._token.set(null);
  }
}
