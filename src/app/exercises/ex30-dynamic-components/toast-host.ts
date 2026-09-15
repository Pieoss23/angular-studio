import { Component, ViewContainerRef, afterNextRender, inject, viewChild } from '@angular/core';
import { ToastService } from './toast.service';

// Un punto d'ancoraggio nel DOM, senza sapere NULLA in anticipo di quanti
// toast verranno creati o quando: registra il proprio ViewContainerRef nel
// ToastService, che lo userà per istanziare i ToastItem su richiesta.
@Component({
  selector: 'app-toast-host',
  template: `<ng-container #anchor />`,
})
export class ToastHost {
  private readonly anchor = viewChild.required('anchor', { read: ViewContainerRef });
  private readonly toastService = inject(ToastService);

  constructor() {
    // viewChild è popolato solo dopo il primo render: afterNextRender è il
    // punto giusto per leggerlo, non il constructor.
    afterNextRender(() => this.toastService.registerHost(this.anchor()));
  }
}
