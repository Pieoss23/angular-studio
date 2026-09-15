import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const CATALOG = ['signal', 'computed', 'effect', 'resource', 'defer', 'directive', 'injector', 'router'];

@Injectable({ providedIn: 'root' })
export class SearchService {
  // Simula una chiamata HTTP: 400ms di latenza finta.
  search(term: string): Observable<string[]> {
    const results = term.trim()
      ? CATALOG.filter((w) => w.toLowerCase().includes(term.trim().toLowerCase()))
      : [];
    return of(results).pipe(delay(400));
  }
}
