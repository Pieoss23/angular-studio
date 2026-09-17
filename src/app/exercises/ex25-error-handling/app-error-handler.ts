import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorLogService } from './error-log.service';

// Sostituisce l'ErrorHandler di default di Angular (quello che si limita a
// fare console.error). Cattura QUALSIASI errore non gestito che sfugge da
// un event handler o da un ciclo di change detection — non gli errori RxJS
// gestiti con catchError, quelli non "sfuggono" mai fin qui.
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly log = inject(ErrorLogService);

  // TODO(25.1): implementa handleError(error). Deve:
  //  - loggare l'errore anche in console (console.error(error)) — non perdere
  //    il comportamento di default, aggiungiti sopra
  //  - chiamare this.log.log(...) con un messaggio leggibile, es.
  //    error instanceof Error ? error.message : String(error)
  handleError(error: unknown): void {
    console.error(error)
    this.log.log(error instanceof Error ? error.message : String(error))
  }
}
