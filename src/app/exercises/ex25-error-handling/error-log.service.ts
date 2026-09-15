import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  private readonly _entries = signal<string[]>([]);
  readonly entries = this._entries.asReadonly();

  log(message: string): void {
    const stamp = new Date().toLocaleTimeString();
    this._entries.update((list) => [`${stamp} — ${message}`, ...list]);
  }
}
