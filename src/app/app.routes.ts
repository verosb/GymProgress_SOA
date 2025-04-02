import { Routes } from '@angular/router';
//Define las rutas de navegación dentro de la aplicación
export const routes: Routes = [
  {
    path: "auth",
    loadComponent: () => import('./auth/auth.component'),
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./auth/login/login.component'),
      },
      {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./auth/register/register.component'),
      },
    ],
  },
  {
    path: "dashboard",
    loadComponent: () => import('./dashboard/dashboard.component'),
  },
  {
    //Envio de una vez al login apenas cargue el programa 
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];



