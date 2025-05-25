import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
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
      {
        path: 'forgot-password',
        title: 'ForgotPassword',
        loadComponent: () => import('./auth/forgot-password/forgot-password.component'),
      },
      {
        path: 'reset-password',
        title: 'Reset-password',
        loadComponent: () => import('./auth/reset-password/reset-password.component'),
      }
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'routines',
        title: 'Routines',
        loadComponent: () => import('./pages/routines/routines.component'),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  }
  ,
  {
    path: 'github-callback',
    loadComponent: () =>
      import('./auth/github-callback/github-callback.component').then(m => m.GithubCallbackComponent)
  }
  ,
  {
    path: 'facebook-callback',
    loadComponent: () =>
      import('./auth/facebook-callback/facebook-callback.component').then(m => m.FacebookCallbackComponent)
  }
];
