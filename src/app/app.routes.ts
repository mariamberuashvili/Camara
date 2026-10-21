import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin/admin-login').then(m => m.AdminLogin)
  },
  {
    path: 'admin-upload',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-upload').then(m => m.AdminUpload)
  },
  {
    path: 'photo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/photo/photo').then(m => m.Photo)
  },
  {
    path: 'result',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/result/result').then(m => m.Result)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];