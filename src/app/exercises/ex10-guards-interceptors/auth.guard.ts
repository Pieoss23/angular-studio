import { CanActivateFn } from '@angular/router';

// TODO(10.1): implementa una CanActivateFn funzionale
//  - usa inject(AuthStore) e inject(Router)
//  - se isLoggedIn() -> true
//  - altrimenti -> router.createUrlTree(['/ex10'])  (redirect, non solo false)
export const authGuard: CanActivateFn = () => {
  return true;
};
