import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

export const adminGuard:
CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const user =
    authService.getUser();

  const token =
    authService.getToken();

  if (
    token &&
    user?.rol === 'admin'
  ) {

    return true;

  }

  router.navigate(['/login']);

  return false;

};