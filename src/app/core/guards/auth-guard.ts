import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { appState } from '../../state';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const nia = appState.nia();
  const nie = appState.nie();

  const isLogged = !!(nia && nie);

  if (isLogged) {
    return true;
  }

  return router.createUrlTree(['/login']);
};