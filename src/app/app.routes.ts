import { Routes } from '@angular/router';
import { authGuard } from './exercises/ex10-guards-interceptors/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
    title: 'Angular Studio',
  },
  {
    path: 'ex01',
    loadComponent: () =>
      import('./exercises/ex01-signals/ex01-signals').then((m) => m.Ex01Signals),
  },
  {
    path: 'ex02',
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
  { path: '**', redirectTo: '' },
];
