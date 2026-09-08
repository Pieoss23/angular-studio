export interface ExerciseMeta {
  id: string;
  n: number;
  path: string;
  title: string;
  topic: string;
  summary: string;
  done?: boolean;
}

export const EXERCISES: ExerciseMeta[] = [
  {
    id: 'ex01',
    n: 1,
    path: 'ex01-signals',
    title: 'Signals: signal / computed / effect',
    topic: 'Reattività',
    summary: 'Stato locale reattivo, valori derivati e side-effect senza RxJS.',
    done: true,
  },
  {
    id: 'ex02',
    n: 2,
    path: 'ex02-control-flow',
    title: 'Nuovo control flow: @if / @for / @switch',
    topic: 'Template',
    summary: 'Sintassi built-in, @empty, blocco @else, track e $index.',
    done: true,
  },
  {
    id: 'ex03',
    n: 3,
    path: 'ex03-signal-io',
    title: 'Signal inputs & outputs',
    topic: 'Componenti',
    summary: 'input(), input.required(), alias, transform, output().',
    done: true,
  },
  {
    id: 'ex04',
    n: 4,
    path: 'ex04-model',
    title: 'model(): two-way binding con i signal',
    topic: 'Componenti',
    summary: 'Creare un componente con binding [(value)] usando model().',
    done: true,
  },
  {
    id: 'ex05',
    n: 5,
    path: 'ex05-queries',
    title: 'Query come signal: viewChild / viewChildren',
    topic: 'Componenti',
    summary: 'viewChild.required, contentChild, reagire alle query con effect.',
  },
  {
    id: 'ex06',
    n: 6,
    path: 'ex06-linked-signal',
    title: 'linkedSignal: stato derivato ma scrivibile',
    topic: 'Reattività',
    summary: 'Selezione che si resetta quando cambia la lista sorgente.',
  },
  {
    id: 'ex07',
    n: 7,
    path: 'ex07-resource',
    title: 'resource(): async con loading / error / reload',
    topic: 'Dati async',
    summary: 'Caricamento asincrono legato a un parametro reattivo.',
  },
  {
    id: 'ex08',
    n: 8,
    path: 'ex08-http-resource',
    title: 'httpResource(): REST dichiarativo',
    topic: 'Dati async',
    summary: 'Fetch HTTP reattivo con parametri e stato di errore.',
  },
  {
    id: 'ex09',
    n: 9,
    path: 'ex09-defer',
    title: 'Deferrable views: @defer',
    topic: 'Performance',
    summary: 'Lazy loading di parte di template con @placeholder/@loading/@error.',
  },
  {
    id: 'ex10',
    n: 10,
    path: 'ex10-guards-interceptors',
    title: 'Functional guard + interceptor + input binding di rotta',
    topic: 'Router / HTTP',
    summary: 'CanActivateFn, HttpInterceptorFn, withComponentInputBinding().',
  },
];
