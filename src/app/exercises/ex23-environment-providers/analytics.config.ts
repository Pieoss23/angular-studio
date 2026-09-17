import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

export interface AnalyticsConfig {
  appId: string;
}

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('ANALYTICS_CONFIG');

// TODO(23.1): funzione di configurazione "provideXxx", come provideRouter()
// o provideHttpClient(). Deve tornare EnvironmentProviders che combinano:
//  1. { provide: ANALYTICS_CONFIG, useValue: config }
//  2. provideAppInitializer(() => { console.log(`[analytics] inizializzato per ${config.appId}`); })
//     — questa callback gira PRIMA che l'app finisca il bootstrap, quindi
//     appare in console prima di qualunque log dei componenti.
// Suggerimento: makeEnvironmentProviders([...]) prende un array di provider.



export function provideAnalytics(config: AnalyticsConfig): EnvironmentProviders {


  return makeEnvironmentProviders([
    {provide: ANALYTICS_CONFIG, useValue: config},
    provideAppInitializer(() => {
      console.log(`[analytics] inizializzato per ${config.appId}`)
    })
  ]);
}
