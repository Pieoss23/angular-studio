import { Injectable, inject } from '@angular/core';
import { STUDIO_CONFIG } from './tokens';

@Injectable({ providedIn: 'root' })
export class GreetingService {
  // inject() al posto del constructor: funziona anche fuori da un constructor
  // (in un initializer di campo, come qui) e non richiede parametri nel costruttore.
  private readonly config = inject(STUDIO_CONFIG);

  greet(): string {
    return `Benvenuto in ${this.config.appName}! Per problemi: ${this.config.supportEmail}`;
  }
}
