import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Project {
  id: string;
  name: string;
  status: 'attivo' | 'archiviato' | 'altro';
}

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Redesign dashboard', status: 'attivo' },
  { id: 'p2', name: 'Migrazione API v2', status: 'attivo' },
  { id: 'p3', name: 'Vecchio sito marketing', status: 'archiviato' },
  { id: 'p4', name: 'Sito quello li', status: 'archiviato' },
  { id: 'p5', name: 'Vecchio sito arancio', status: 'altro' },

];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  list(): Observable<Project[]> {
    return of(PROJECTS).pipe(delay(150));
  }

  // Simula una fetch by-id con latenza: torna undefined se non esiste.
  getById(id: string): Observable<Project | undefined> {
    return of(PROJECTS.find((p) => p.id === id)).pipe(delay(300));
  }
}
