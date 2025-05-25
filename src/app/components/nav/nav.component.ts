import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthFirebasService } from '../../services/firebase-auth.service';
import { RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../Alert/alert.service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export default class NavComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private authFirebase: AuthFirebasService,
    private alertService: AlertService
  ) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async logout(): Promise<void> {
    try {
      await this.authFirebase.logout();

      await firstValueFrom(this.authService.logout());

      this.alertService.showToast('Sesión cerrada correctamente', 'success');

      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error durante el logout:', error);
      this.alertService.showToast('Error al cerrar sesión', 'error');

      this.router.navigate(['/']);
    } finally {
      this.isMenuOpen = false;
    }
  }
}
