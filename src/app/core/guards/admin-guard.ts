import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Verificar si existe token de admin en sessionStorage
  const adminToken = sessionStorage.getItem('adminToken');
  
  if (adminToken) {
    return true;
  }

  // Si no hay token, redirigir a login de admin
  return router.createUrlTree(['/admin-login']);
};
