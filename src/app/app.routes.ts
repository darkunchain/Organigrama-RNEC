import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: '**',
    redirectTo: 'home', // Ruta de fallback
  },
  {
    path: 'editar',
    loadComponent: () =>
      import('./components/organigrama/editar/editar.component').then((m) => m.EditarComponent),
  },
];
