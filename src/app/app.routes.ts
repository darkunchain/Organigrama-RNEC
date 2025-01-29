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
    path: 'editar',
    loadComponent: () =>
      import('./components/organigrama/editar/editar.component').then((m) => m.EditarComponent),
  },
  {
    path: 'organigrama',
    loadComponent: () =>
      import('./components/organigrama/grafico/grafico.component').then((m) => m.GraficoComponent),
  },
  {
    path: 'grafico',
    loadComponent: () =>
      import('./components/organigrama/grafico/grafico.component').then((m) => m.GraficoComponent),
  },


  {
    path: '**',
    redirectTo: 'home', // Ruta de fallback
  },
];
