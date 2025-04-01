import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../Alert/alert.service';
import * as crypto from 'crypto-js';
import AuthComponent from '../auth.component';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export default class LoginComponent {
  private readonly fb = inject(FormBuilder);

  formGroup = this.fb.nonNullable.group({
    correo: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(50)],
    ],
    pass: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
    ],
  });

  constructor(
    private alertService: AlertService,
    private loginService: AuthService,
    private router: Router
  ) {}

  clickLogin(): void {
    const campos = [
      { control: 'correo', mensaje: 'Error en el campo correo' },
      { control: 'pass', mensaje: 'Error en el campo contraseña' },
    ];

    for (const campo of campos) {
      if (
        (this.formGroup.controls as { [key: string]: AbstractControl })[
          campo.control
        ].errors
      ) {
        this.alertService.showToast(campo.mensaje, 'error');
        return; 
      }
    }

    const password = this.formGroup.value.pass || '';
    const encryptedPass = crypto.SHA256(password).toString();

    const formDataLogin = {
      email: this.formGroup.value.correo,
      password: encryptedPass,
    };

    console.log("Datos enviados del front: ", formDataLogin);

    this.loginService.loginUser(formDataLogin).then((response) => {
      if (!response) {
        swal.fire({
          title: 'Error',
          text: 'Error al loguearse, verifique credenciales',
          icon: 'error',
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
