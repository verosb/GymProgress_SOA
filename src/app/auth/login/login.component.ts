import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AuthFirebasService } from '../../services/firebase-auth.service';
import { GithubAuthService } from '../../services/github.service';
import { FacebookAuthService } from '../../services/facebook.service';
import { AlertService } from '../../Alert/alert.service';
import * as crypto from 'crypto-js';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;
  private isBrowser: boolean;

  private readonly fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private loginService = inject(AuthService);
  private authService = inject(AuthFirebasService);
  private githubAuthService = inject(GithubAuthService );
  private facebookAuthService = inject(FacebookAuthService );
  private router = inject(Router);

  private platformId = inject(PLATFORM_ID);

  formGroup = this.fb.nonNullable.group({
    correo: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(50)],
    ],
    pass: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],
  });

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('LoginComponent inicializado, isBrowser:', this.isBrowser);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      console.log('Verificando resultado de redirección en ngOnInit...');
      this.loading = true;
      this.checkRedirectResult();
    }
  }

  private checkRedirectResult(): void {
    console.log('Ejecutando checkRedirectResult...');
    this.authService.handleRedirectResult().subscribe({
      next: (success: boolean) => {
        console.log('Resultado de redirección:', success);
        if (success) {
          console.log('Redirección exitosa, navegando al dashboard');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('No hubo redirección exitosa');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error en redirección detallado:', error);
        this.alertService.showToast('Error en autenticación', 'error');
        this.loading = false;
      }
    });
  }

  clickLogin(): void {
    if (this.formGroup.invalid) {
      this.alertService.showToast('Por favor complete el formulario correctamente', 'error');
      return;
    }

    const password = this.formGroup.value.pass || '';
    const encryptedPass = crypto.SHA256(password).toString();

    const formDataLogin = {
      email: this.formGroup.value.correo,
      password: encryptedPass,
    };

    this.loading = true;
    this.loginService.loginUser(formDataLogin).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: any) => {
        if (response) {
          this.router.navigate(['/dashboard']);
        } else {
          swal.fire({
            title: 'Error',
            text: 'Error al loguearse, verifique credenciales',
            icon: 'error',
          });
        }
      },
      error: (err: any) => {
        swal.fire({
          title: 'Error',
          text: 'Error al loguearse, verifique credenciales',
          icon: 'error',
        });
        console.error('Login error:', err);
      }
    });
  }

  //Métodos para cada aplicación
  signInWithGoogle(): void {
    console.log('Iniciando login con Google desde componente');
    this.handleSocialLogin(() => this.authService.loginWithGoogle());
  }

  signInWithGithub(): void {
    console.log('Iniciando login con GitHub desde componente');
    this.githubAuthService.loginWithGithub();
  }

  signInWithFacebook(): void {
    console.log('Iniciando login con Facebook desde componente');
    this.facebookAuthService.loginWithFacebook();
  }

  private handleSocialLogin(loginMethod: () => Observable<any>): void {
    if (!this.isBrowser) {
      this.alertService.showToast('Operación no soportada en este entorno', 'error');
      return;
    }

    this.loading = true;
    this.error = null;

    loginMethod().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (result) => {
        console.log('Resultado de login social:', result);
        if (result === null) {
          // Está haciendo redirección, mostramos mensaje
          console.log('Redirigiendo para autenticación, espere...');
          this.alertService.showToast('Redirigiendo para autenticación...', 'info');
        } else {
          // Login exitoso con popup, navegamos al dashboard
          console.log('Login social exitoso, navegando al dashboard');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: any) => {
        console.error('Social login error completo:', error);
        this.alertService.showToast('Error en autenticación social', 'error');
      }
    });
  }
}
