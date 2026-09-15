import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './exercises/ex10-guards-interceptors/auth.interceptor';
import { provideAnalytics } from './exercises/ex23-environment-providers/analytics.config';
import { AppErrorHandler } from './exercises/ex25-error-handling/app-error-handler';
import { SelectivePreloadStrategy } from './exercises/ex28-preloading-strategy/selective-preload.strategy';
import { AppTitleStrategy } from './exercises/ex29-title-strategy/app-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(SelectivePreloadStrategy)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnalytics({ appId: 'angular-studio' }),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
