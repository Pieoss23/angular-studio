import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  // TODO(13.1): usa l'oggetto `host` (stile moderno, niente @HostBinding/@HostListener)
  // per collegare eventi e proprietà dell'host element:
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[style.background-color]': 'bg()',
    '[style.cursor]': "'pointer'",
    '[style.color]': 'textColor()'
  },
})
export class HighlightDirective {
  readonly appHighlight = input<string>('#fffb8f'); // colore passato dal consumer, opzionale
  protected readonly textColor = () => (this.hovering() ? '#000' : null)
  private readonly hovering = signal(false);
  protected readonly bg = () => (this.hovering() ? this.appHighlight() : null);

  protected onEnter(): void {
    this.hovering.set(true);
  }

  protected onLeave(): void {
    this.hovering.set(false);
  }
}
