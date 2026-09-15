import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from './project.service';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  template: `
    <div class="card">
      <a routerLink="/ex18" class="hint">← torna alla lista</a>
      <h2>{{ project().name }}</h2>
      <p>id: <code>{{ project().id }}</code></p>

      <!-- TODO(18.2): mostra un tag "attivo" o "archiviato" diverso in base a project().status -->
      <p>stato:
        @if (project().status === 'attivo') {
          <span style="color: green; font-weight: bold;">attivo</span>
        } @else if (project().status === 'archiviato') {
          <span style="color: gray;">archiviato</span>
        } @else {
          <span style="color: orange;">{{ project().status }}</span>
        }
      </p>
    </div>

  `,
})
export class ProjectDetail {
  // Popolato automaticamente dal dato risolto dal resolver (chiave 'project'
  // nella route), grazie a withComponentInputBinding() in app.config.ts.
  readonly project = input.required<Project>();
}
