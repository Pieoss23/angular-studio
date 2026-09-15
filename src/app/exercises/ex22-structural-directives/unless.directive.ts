import { Directive, effect, input, TemplateRef, ViewContainerRef } from '@angular/core';

// *appUnless="condition" — il contrario di *ngIf: mostra il template
// quando `condition` è falsy, lo rimuove quando è truthy.
@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  readonly appUnless = input.required<boolean>();

  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
    // TODO(22.1): in un effect(), leggi this.appUnless() e:
    //  - se FALSY e la vista non è ancora inserita (!this.hasView):
    //    this.viewContainerRef.createEmbeddedView(this.templateRef); this.hasView = true;
    //  - se TRUTHY e la vista è inserita (this.hasView):
    //    this.viewContainerRef.clear(); this.hasView = false;
  }
}
