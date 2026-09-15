import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';

const SUFFIX = 'Angular Studio';

// Sostituisce la DefaultTitleStrategy di Angular: invece di usare il
// `title` della rotta così com'è, ci appende un suffisso fisso con
// l'aggiornamento reale del <title> del documento (via il servizio Title).
@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);

  // TODO(29.1): implementa updateTitle(snapshot). Deve:
  //  - const routeTitle = this.buildTitle(snapshot);  (metodo ereditato,
  //    prende il `title` della rotta attiva più profonda)
  //  - se routeTitle esiste ed è diverso da SUFFIX: this.titleService.setTitle(`${routeTitle} · ${SUFFIX}`)
  //  - altrimenti: this.titleService.setTitle(SUFFIX)
  override updateTitle(snapshot: RouterStateSnapshot): void {}
}
