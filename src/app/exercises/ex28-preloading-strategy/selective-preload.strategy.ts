import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

// Strategia di preload "selettiva": a differenza di PreloadAllModules
// (precarica TUTTO) o NoPreloading (default, non precarica nulla), questa
// precarica solo le rotte marcate esplicitamente con data: { preload: true }.
@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  // TODO(28.1): implementa preload(route, load).
  //  - se route.data?.['preload'] è true: logga in console
  //    `[preload] ${route.path}` e ritorna load() (che scarica il chunk)
  //  - altrimenti: ritorna of(null) (non precarica nulla per questa rotta)
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return of(null);
  }
}
