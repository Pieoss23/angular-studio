import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastItem } from './toast-item';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private host: ViewContainerRef | null = null;

  registerHost(vcr: ViewContainerRef): void {
    this.host = vcr;
  }

  // TODO(30.1): crea dinamicamente un ToastItem nel ViewContainerRef
  // registrato, con i due input impostati, e rimuovilo da solo dopo 3
  // secondi O quando l'utente clicca "chiudi" (il suo output `dismissed`).
  //
  // Passi:
  //  1. if (!this.host) return;
  //  2. const ref = this.host.createComponent(ToastItem);
  //  3. ref.setInput('message', message); ref.setInput('kind', kind);
  //  4. const remove = () => ref.destroy();
  //  5. const timer = setTimeout(remove, 3000);
  //  6. ref.instance.dismissed.subscribe(() => { clearTimeout(timer); remove(); });
  show(message: string, kind: 'info' | 'error' = 'info'): void {}
}
