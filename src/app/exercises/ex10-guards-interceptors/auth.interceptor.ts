import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

// TODO(10.2): implementa un HttpInterceptorFn funzionale
//  - usa inject(AuthStore) per leggere token()
//  - se c'è un token, clona la richiesta aggiungendo header Authorization: `Bearer <token>`
//  - logga in console il metodo + url di ogni richiesta
//  - inoltra sempre con next(req)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  let authReq = req;
  if(token) {
    authReq = req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
  }
  console.log(authReq.method, authReq.url)
  return next(authReq);
};
