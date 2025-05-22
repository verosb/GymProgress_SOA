import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../Alert/alert.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-github-callback',
  templateUrl: './github-callback.component.html',
  styleUrls: ['./github-callback.component.css']
})
export class GithubCallbackComponent implements OnInit {

  private backendUrl = environment.apiUrl;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    
    console.log("iniciando peticion github")

    this.route.queryParams.subscribe(params => {
      const token = params['code'];
      if (token) {
        console.log("holaaaaaaaa")
        this.exchangeCodeForToken(token);
      } else {
        this.error = 'No se recibió el código de autorización de GitHub';
        this.loading = false;
      }
    });
  }

  exchangeCodeForToken(token: string): void {
    console.log("token:" + token);
  
    this.loading = true;
  
    this.http.post(
      `${this.backendUrl}/users/loginGithub`,
      { token },
      {
        withCredentials: true,
      }
    ).pipe(
      tap({
        next: (res) => console.log('TAP next', res),
        error: (err) => console.log('TAP error', err),
        complete: () => console.log('TAP complete')
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Login exitoso github', response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Error al autenticar con GitHub';
        this.loading = false;
        console.error('Error de login GitHub:', err);
        this.router.navigate(['/auth/login']);
        this.alertService.showToast('Error en autenticación', 'error');
      },
      complete: () => {
        console.log('Suscripción completada');
      }
    });
  }
  

}
