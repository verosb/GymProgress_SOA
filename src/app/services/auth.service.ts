import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(userData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}`, userData, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  loginUser(userDataLogin: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, userDataLogin, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  isLogin(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/isLogin`, {
      withCredentials: true,
      observe: 'response',
    }).pipe(
      map(response => {
        console.log('Usuario autenticado');
        return true;
      }),
      catchError(error => {
        if (error.status === 401) {
          console.log('Usuario no autenticado');
        } else {
          console.error('Error inesperado en isLogin.service:', error);
        }
        return of(false);
      })
    );
  }


  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en AuthService:', error);
    return throwError(() => new Error('Ocurrió un error en la autenticación'));
  }
}
