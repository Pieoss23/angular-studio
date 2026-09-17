import { Routes } from '@angular/router';
import { authGuard } from './exercises/ex10-guards-interceptors/auth.guard';
import { projectResolver } from './exercises/ex18-router-resolvers/project.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
    title: 'Angular Studio',
  },
  {
    path: 'ex01',
    // marcata per il preload selettivo dell'esercizio 28
    data: { preload: true },
    loadComponent: () =>
      import('./exercises/ex01-signals/ex01-signals').then((m) => m.Ex01Signals),
  },
  {
    path: 'ex02',
    data: { preload: true },
    loadComponent: () =>
      import('./exercises/ex02-control-flow/ex02-control-flow').then((m) => m.Ex02ControlFlow),
  },
  {
    path: 'ex03',
    loadComponent: () =>
      import('./exercises/ex03-signal-io/ex03-signal-io').then((m) => m.Ex03SignalIo),
  },
  {
    path: 'ex04',
    loadComponent: () => import('./exercises/ex04-model/ex04-model').then((m) => m.Ex04Model),
  },
  {
    path: 'ex05',
    loadComponent: () =>
      import('./exercises/ex05-queries/ex05-queries').then((m) => m.Ex05Queries),
  },
  {
    path: 'ex06',
    loadComponent: () =>
      import('./exercises/ex06-linked-signal/ex06-linked-signal').then((m) => m.Ex06LinkedSignal),
  },
  {
    path: 'ex07',
    loadComponent: () =>
      import('./exercises/ex07-resource/ex07-resource').then((m) => m.Ex07Resource),
  },
  {
    path: 'ex08',
    loadComponent: () =>
      import('./exercises/ex08-http-resource/ex08-http-resource').then((m) => m.Ex08HttpResource),
  },
  {
    path: 'ex09',
    loadComponent: () => import('./exercises/ex09-defer/ex09-defer').then((m) => m.Ex09Defer),
  },
  {
    path: 'ex10',
    loadComponent: () =>
      import('./exercises/ex10-guards-interceptors/ex10-guards-interceptors').then(
        (m) => m.Ex10GuardsInterceptors,
      ),
  },
  {
    path: 'ex10/secret',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./exercises/ex10-guards-interceptors/secret-page').then((m) => m.SecretPage),
  },
  {
    path: 'ex11',
    loadComponent: () =>
      import('./exercises/ex11-content-projection/ex11-content-projection').then(
        (m) => m.Ex11ContentProjection,
      ),
  },
  {
    path: 'ex12',
    loadComponent: () =>
      import('./exercises/ex12-dependency-injection/ex12-dependency-injection').then(
        (m) => m.Ex12DependencyInjection,
      ),
  },
  {
    path: 'ex13',
    loadComponent: () =>
      import('./exercises/ex13-custom-directives/ex13-custom-directives').then(
        (m) => m.Ex13CustomDirectives,
      ),
  },
  {
    path: 'ex14',
    loadComponent: () =>
      import('./exercises/ex14-reactive-forms/ex14-reactive-forms').then(
        (m) => m.Ex14ReactiveForms,
      ),
  },
  {
    path: 'ex15',
    loadComponent: () =>
      import('./exercises/ex15-rxjs-signals-interop/ex15-rxjs-signals-interop').then(
        (m) => m.Ex15RxjsSignalsInterop,
      ),
  },
  {
    path: 'ex16',
    loadComponent: () =>
      import('./exercises/ex16-native-animations/ex16-native-animations').then(
        (m) => m.Ex16NativeAnimations,
      ),
  },
  {
    path: 'ex17',
    loadComponent: () => import('./exercises/ex17-testing/ex17-testing').then((m) => m.Ex17Testing),
  },
  {
    path: 'ex18',
    loadComponent: () =>
      import('./exercises/ex18-router-resolvers/ex18-router-resolvers').then(
        (m) => m.Ex18RouterResolvers,
      ),
  },
  {
    path: 'ex18/:id',
    resolve: { project: projectResolver },
    loadComponent: () =>
      import('./exercises/ex18-router-resolvers/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'ex19',
    loadComponent: () =>
      import('./exercises/ex19-afterrender-host-bindings/ex19-afterrender-host-bindings').then(
        (m) => m.Ex19AfterrenderHostBindings,
      ),
  },
  {
    path: 'ex20',
    loadComponent: () =>
      import('./exercises/ex20-signal-store/ex20-signal-store').then((m) => m.Ex20SignalStore),
  },
  {
    path: 'ex21',
    loadComponent: () =>
      import('./exercises/ex21-custom-pipes/ex21-custom-pipes').then((m) => m.Ex21CustomPipes),
  },
  {
    path: 'ex22',
    loadComponent: () =>
      import('./exercises/ex22-structural-directives/ex22-structural-directives').then(
        (m) => m.Ex22StructuralDirectives,
      ),
  },
  {
    path: 'ex23',
    loadComponent: () =>
      import('./exercises/ex23-environment-providers/ex23-environment-providers').then(
        (m) => m.Ex23EnvironmentProviders,
      ),
  },
  {
    path: 'ex24',
    loadComponent: () =>
      import('./exercises/ex24-advanced-signals/ex24-advanced-signals').then(
        (m) => m.Ex24AdvancedSignals,
      ),
  },
  {
    path: 'ex25',
    loadComponent: () =>
      import('./exercises/ex25-error-handling/ex25-error-handling').then(
        (m) => m.Ex25ErrorHandling,
      ),
  },
  {
    path: 'ex26',
    loadComponent: () =>
      import('./exercises/ex26-ng-optimized-image/ex26-ng-optimized-image').then(
        (m) => m.Ex26NgOptimizedImage,
      ),
  },
  {
    path: 'ex27',
    loadComponent: () =>
      import('./exercises/ex27-icu-i18n/ex27-icu-i18n').then((m) => m.Ex27IcuI18n),
  },
  {
    path: 'ex28',
    loadComponent: () =>
      import('./exercises/ex28-preloading-strategy/ex28-preloading-strategy').then(
        (m) => m.Ex28PreloadingStrategy,
      ),
  },
  {
    path: 'ex29',
    title: 'Esercizio 29 — Title Strategy',
    loadComponent: () =>
      import('./exercises/ex29-title-strategy/ex29-title-strategy').then(
        (m) => m.Ex29TitleStrategy,
      ),
  },
  {
    path: 'ex30',
    loadComponent: () =>
      import('./exercises/ex30-dynamic-components/ex30-dynamic-components').then(
        (m) => m.Ex30DynamicComponents,
      ),
  },
  {
    path: 'progetto-ricette',
    loadChildren: () =>
      import('./project-recipes/project-recipes.routes').then((m) => m.PROJECT_RECIPES_ROUTES),
  },

  { path: '**', redirectTo: '' },
];
