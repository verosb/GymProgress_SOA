import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    const isAuth = await firstValueFrom(authService.isLogin());
    console.log('¿Está autenticado?', isAuth);

    if (!isAuth) {
      await router.navigate(['/auth/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en authGuard:', error);
    await router.navigate(['/auth/login']);
    return false;
  }
};
