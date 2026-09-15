import { ResolveFn, Router } from '@angular/router';
import { Project, ProjectService } from './project.service';
import { inject } from '@angular/core';
import { EMPTY, switchMap, of  } from 'rxjs';

// TODO(18.1): implementa un resolver funzionale che:
//  - legge l'id dalla route: route.paramMap.get('id')
//  - inject(ProjectService).getById(id) per recuperare il progetto (è un Observable)
//  - se non esiste (undefined), fai inject(Router).navigate(['/ex18']) e torna
//    un Observable che non emette nulla di utile per questa rotta (es. EMPTY da 'rxjs')
// Il valore risolto arriva come input `project` al componente grazie a
// withComponentInputBinding(), già attivo in app.config.ts.
export const projectResolver: ResolveFn<Project | undefined> = (route) => {
  const id = route.paramMap.get('id');
  const service = inject(ProjectService);
  const router = inject(Router);

  if (id === null) {
    router.navigate(['/ex18']);
    return EMPTY;
  }

  return service.getById(id).pipe(
    switchMap((project) => {
      if(!project) {
        router.navigate(['/ex18']);
        return EMPTY;
      }
      return of(project);
    }),
  );
};
