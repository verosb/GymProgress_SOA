import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; //Servicio de autenticación con firebase
import {
  Auth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signOut,
  UserCredential,
  getRedirectResult,
} from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from, switchMap, catchError, throwError, of } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebasService {
  private backendUrl = environment.apiUrl;
  private auth!: Auth;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    try {
      console.log(
        'Inicializando Firebase con configuración:',
        environment.firebase
      );
      const app = initializeApp(environment.firebase);
      this.auth = getAuth();
      console.log('Firebase inicializado correctamente, auth:', this.auth);

      if (isPlatformBrowser(this.platformId)) {
        this.setupRedirectListener();
      }
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
    }
  }

  private setupRedirectListener(): void {
    console.log('Configurando listener de redirección...');
    getRedirectResult(this.auth)
      .then((result) => {
        console.log('Resultado de redirección en setup:', result);
        if (result?.user) {
          console.log('Usuario autenticado en setup:', result.user.email);
          this.handleAuthResult(result).subscribe({
            next: (response) =>
              console.log('Autenticación exitosa, respuesta:', response),
            error: (err) =>
              console.error('Error en autenticación en setup:', err),
          });
        } else {
          console.log('No hay resultado de redirección en setup');
        }
      })
      .catch((error) => {
        console.error('Error en redirección en setup:', error);
      });
  }
//Envio del token 
  private handleAuthResult(result: UserCredential): Observable<any> {
    console.log('Manejando resultado de autenticación, obteniendo token...');
    return from(result.user.getIdToken()).pipe(
      switchMap((token) => {
        console.log('Token obtenido, enviando al backend');
        return this.http.post(
          `${this.backendUrl}/users/loginFirebase`,
          { token },
          {
            withCredentials: true,
          }
        );
      }),
      catchError((error) => {
        console.error('Error al procesar token o enviar al backend:', error);
        return throwError(() => error);
      })
    );
  }

  handleRedirectResult(): Observable<boolean> {
    console.log('Manejando resultado de redirección...');
    return new Observable((subscriber) => {
      if (!isPlatformBrowser(this.platformId)) {
        console.log('No estamos en un navegador, completando');
        subscriber.next(false);
        subscriber.complete();
        return;
      }

      console.log('Obteniendo resultado de redirección...');
      getRedirectResult(this.auth)
        .then((result) => {
          console.log('Resultado completo de redirección:', result);
          if (result?.user) {
            console.log('Usuario autenticado:', result.user.email);
            this.handleAuthResult(result).subscribe({
              next: (response) => {
                console.log('Login backend exitoso, respuesta:', response);
                subscriber.next(true);
                subscriber.complete();
              },
              error: (err) => {
                console.error('Error en backend:', err);
                subscriber.error(err);
              },
            });
          } else {
            console.log('No hay resultado de redirección o usuario');
            subscriber.next(false);
            subscriber.complete();
          }
        })
        .catch((error) => {
          console.error('Error en getRedirectResult:', error);
          console.error('Código:', error.code, 'Mensaje:', error.message);
          subscriber.error(error);
        });
    });
  }

  loginWithGoogle(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => 'Operación no soportada en este entorno');
    }

    console.log('Iniciando login con Google...');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Intentar con popup (ventana emergente) primero 
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((result: UserCredential) => {
        console.log('Login con popup exitoso, resultado:', result);
        return this.handleAuthResult(result);
      }),
      catchError((error) => {
        console.error('Error en popup:', error);
        // Si hay error con popup, cambiar a redirección
        if (
          error.code === 'auth/popup-closed-by-user' ||
          error.message?.includes('Cross-Origin') ||
          error.name === 'NotSupportedError'
        ) {
          console.log('Cambiando a método de redirección para Google');
          signInWithRedirect(this.auth, provider);
          return of(null); // Indicamos que se está haciendo redirección
        }
        return throwError(() => error);
      })
    );
  }

  // loginWithGithub(): Observable<any> {
  //   if (!isPlatformBrowser(this.platformId)) {
  //     return throwError(() => 'Operación no soportada en este entorno');
  //   }

  //   console.log('Iniciando login con GitHub...');
  //   const provider = new GithubAuthProvider();

  //   provider.setCustomParameters({
  //     login: 'true', // Fuerza a GitHub a mostrar la página de login
  //     allow_signup: 'true', // Permite registros nuevos también
  //   });
    
  //   return from(signInWithPopup(this.auth, provider)).pipe(
  //     switchMap((result: UserCredential) => {
  //       console.log('Login con popup exitoso, resultado:', result);
  //       return this.handleAuthResult(result);
  //     }),
  //     catchError((error) => {
  //       console.error('Error en popup:', error);
  //       // Si hay error con popup, cambiar a redirección
  //       if (
  //         error.code === 'auth/popup-closed-by-user' ||
  //         error.message?.includes('Cross-Origin') ||
  //         error.name === 'NotSupportedError'
  //       ) {
  //         console.log('Cambiando a método de redirección para GitHub');
  //         signInWithRedirect(this.auth, provider);
  //         return of(null); // Indicamos que se está haciendo redirección
  //       }
  //       return throwError(() => error);
  //     })
  //   );
  // }

  loginWithFacebook(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => 'Operación no soportada en este entorno');
    }

    console.log('Iniciando login con Facebook...');
    const provider = new FacebookAuthProvider();

    // Intentar con popup primero
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((result: UserCredential) => {
        console.log('Login con popup exitoso, resultado:', result);
        return this.handleAuthResult(result);
      }),
      catchError((error) => {
        console.error('Error en popup:', error);
        // Si hay error con popup, cambiar a redirección
        if (
          error.code === 'auth/popup-closed-by-user' ||
          error.message?.includes('Cross-Origin') ||
          error.name === 'NotSupportedError'
        ) {
          console.log('Cambiando a método de redirección para Facebook');
          signInWithRedirect(this.auth, provider);
          return of(null); // Indicamos que se está haciendo redirección
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    console.log('Cerrando sesión...');
    return from(signOut(this.auth));
  }
}
