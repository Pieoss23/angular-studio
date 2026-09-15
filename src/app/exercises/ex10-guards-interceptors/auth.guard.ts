import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

// TODO(10.1): implementa una CanActivateFn funzionale
//  - usa inject(AuthStore) e inject(Router)
//  - se isLoggedIn() -> true
//  - altrimenti -> router.createUrlTree(['/ex10'])  (redirect, non solo false)
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/ex10']);
};
