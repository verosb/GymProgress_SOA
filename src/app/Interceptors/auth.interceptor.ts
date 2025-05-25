import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Redirigir al login si hay un error de autenticación
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
