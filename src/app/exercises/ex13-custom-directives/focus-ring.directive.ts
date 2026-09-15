import { Directive, signal } from '@angular/core';

// Direttiva semplice, già completa: pensata per essere composta via
// hostDirectives dentro FancyButton (esercizio 13.2), non usata direttamente
// nel template dal consumer.
@Directive({
  selector: '[appFocusRing]',
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[style.outline]': 'outline()',
    '[style.outline-offset]': "'2px'",
  },
})
export class FocusRingDirective {
  // campo mutabile normale non ridisegna la UI in un'app zoneless: serve un signal.
  protected readonly outline = signal<string | null>(null);

  protected onFocus(): void {
    this.outline.set('2px solid var(--accent)');
  }

  protected onBlur(): void {
    this.outline.set(null);
  }
}
