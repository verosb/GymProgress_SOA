import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export default class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  token: string = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    const encryptedPassword = CryptoJS.SHA256(this.password).toString();

    this.http
      .post(`${this.apiUrl}/email/reset-password`, {
        token: this.token,
        newPassword: encryptedPassword,
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El enlace puede haber expirado o ya fue usado.',
          });
          console.error(err);
        },
      });
  }
}
