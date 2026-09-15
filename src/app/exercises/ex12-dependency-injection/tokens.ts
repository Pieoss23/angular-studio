import { InjectionToken } from '@angular/core';

export interface StudioConfig {
  appName: string;
  supportEmail: string;
}

// Token con valore di default via factory: chi non lo sovrascrive ottiene questo.
export const STUDIO_CONFIG = new InjectionToken<StudioConfig>('STUDIO_CONFIG', {
  factory: () => ({ appName: 'Angular Studio', supportEmail: 'help@studio.dev' }),
});

export interface Widget {
  id: string;
  label: string;
}

// Nessun default: pensato per essere popolato con provider multi: true.
export const WIDGETS = new InjectionToken<Widget[]>('WIDGETS');
