import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlightMatch]',
})
export class HighlightMatchDirective {
  readonly appHighlightMatch = input.required<string>();
  readonly term = input<string>('');

  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const text = this.appHighlightMatch();
      const term = this.term().trim();

      // Se il termine è vuoto, mostra il testo normale ed esci
      if (!term) {
        this.el.nativeElement.textContent = text;
        return;
      }

      // 1. Escapiamo il testo originale per sicurezza (XSS)
      const escapedText = this.escapeHtml(text);
      // 2. Escapiamo i caratteri speciali delle RegExp nel termine di ricerca
      const escapedTerm = this.escapeRegex(this.escapeHtml(term));

      // Creiamo la Regex: 'g' (globale = tutti i match), 'i' (case-insensitive)
      const regex = new RegExp(`(${escapedTerm})`, 'gi');

      // Se non c'è corrispondenza, inseriamo il testo normale
      if (!regex.test(escapedText)) {
        this.el.nativeElement.textContent = text;
        return;
      }

      // Ripristiniamo l'indice della regex dopo il test e sostituiamo
      regex.lastIndex = 0;
      // \$1 mantiene i caratteri originali (maiuscole/minuscole) catturati dalla regex
      this.el.nativeElement.innerHTML = escapedText.replace(regex, '<mark>\$1</mark>');
    });
  }

  /**
   * Converte i caratteri speciali HTML nelle rispettive entità.
   */
  private escapeHtml(source: string): string {
    return source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Escapa i caratteri speciali delle RegExp (es. ., *, +, ?, ecc.)
   * nel caso l'utente cerchi simboli particolari.
   */
  private escapeRegex(source: string): string {
    return source.replace(/[-\/\\^\$*+?.()|[\]{}]/g, '\\$&');
  }
}
