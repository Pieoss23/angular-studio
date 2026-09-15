import { Directive, effect, input, TemplateRef, ViewContainerRef } from '@angular/core';

interface RepeatContext {
  $implicit: number; // indice corrente (0-based) — accessibile come variabile implicita
  index: number; // stesso valore, accessibile per nome con "let i = index"
}

// *appRepeat="n" — istanzia il template n volte, passando a ciascuna copia
// un context con l'indice corrente. Uso: <li *appRepeat="5; let i = index">{{ i }}</li>
@Directive({
  selector: '[appRepeat]',
})
export class RepeatDirective {
  readonly appRepeat = input.required<number>();

  constructor(
    private readonly templateRef: TemplateRef<RepeatContext>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
    effect(() => {
      const count = this.appRepeat();
      this.viewContainerRef.clear();

      // TODO(22.2 - bonus): crea `count` embedded view, una per indice da 0
      // a count-1, passando il context giusto a ciascuna:
      // this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: i, index: i });
    });
  }
}
