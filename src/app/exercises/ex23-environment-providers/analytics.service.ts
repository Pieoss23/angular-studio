import { Injectable, inject, signal } from '@angular/core';
import { ANALYTICS_CONFIG } from './analytics.config';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly config = inject(ANALYTICS_CONFIG);

  private readonly _events = signal<string[]>([]);
  readonly events = this._events.asReadonly();

  track(event: string): void {
    this._events.update((list) => [...list, `[${this.config.appId}] ${event}`]);
  }
}
