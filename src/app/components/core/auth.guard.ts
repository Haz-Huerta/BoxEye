import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  // Evitar error SSR
  if (typeof window === 'undefined') {

    return false;

  }

  const token = localStorage.getItem('token');

  if (token) {

    return true;

  }

  router.navigate(['/login']);

  return false;

};