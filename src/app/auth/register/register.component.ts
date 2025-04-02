import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../Alert/alert.service';
import * as crypto from 'crypto-js';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``,
})
export default class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  formGroup = this.fb.nonNullable.group({
    correo: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(50)],
    ],
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$'),
      ],
    ],
    apellido: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$'),
      ],
    ],
    celular: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    pass: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
    ],
  });

  constructor(
    private alertService: AlertService,
    private registerService: AuthService,
    private router: Router
  ) {}

  clickRegister(): void {
    const campos = [
      { control: 'nombre', mensaje: 'Error en el campo nombre' },
      { control: 'apellido', mensaje: 'Error en el apellido' },
      { control: 'correo', mensaje: 'Error en el campo correo' },
      { control: 'celular', mensaje: 'Error en el campo celular' },
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

    const formData = {
      name: this.formGroup.value.nombre,
      lastName: this.formGroup.value.apellido,
      email: this.formGroup.value.correo,
      cellNumber: this.formGroup.value.celular,
      password: encryptedPass,
    };

    this.registerService.registerUser(formData).then((response) => {
      if (!response) {
        swal.fire({
          title: 'Error',
          text: 'No se pudo registrar',
          icon: 'error',
        });
      } else {
        swal.fire({
          title: 'Registrado',
          text: 'Direccionando al login...',
          icon: 'success',
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
