import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./forgot-password.component.css'],
})
export default class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post(`${this.apiUrl}/email/forgot-password`, { email: this.email,
      withCredentials: true,
     }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.'
        });
        this.email = '';
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el correo. Verifica el email o intenta más tarde.'
        });
        console.error(err);
      }
    });
  }

}
