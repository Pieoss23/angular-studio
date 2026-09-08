import { HttpInterceptorFn } from '@angular/common/http';

// TODO(10.2): implementa un HttpInterceptorFn funzionale
//  - usa inject(AuthStore) per leggere token()
//  - se c'è un token, clona la richiesta aggiungendo header Authorization: `Bearer <token>`
//  - logga in console il metodo + url di ogni richiesta
//  - inoltra sempre con next(req)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
