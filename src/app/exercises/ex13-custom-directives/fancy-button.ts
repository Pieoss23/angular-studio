import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { FocusRingDirective } from './focus-ring.directive';

@Component({
  selector: 'app-fancy-button',
  // TODO(13.2): Directive Composition API — applica le due direttive
  // automaticamente a QUALSIASI consumer di <app-fancy-button>, senza che
  // debbano scrivere [appHighlight] o [appFocusRing] nel loro template:
    hostDirectives: [

  { directive: HighlightDirective, inputs: ['appHighlight: highlightColor'] },
  FocusRingDirective,
    ],
  template: `<button class="btn" tabindex="0"><ng-content /></button>`,
  styles: `:host { display: inline-block; border-radius: 6px; }`,
})
export class FancyButton {}
