import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Feature {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export default class HomeComponent implements OnInit {
  userName: string = '';
  lastSession: string = '';

  features: Feature[] = [
    {
      title: 'Rutinas',
      description: 'Crea y personaliza rutinas de entrenamiento según tus objetivos',
      icon: '💪',
      route: '/dashboard/routines'
    },
    {
      title: 'Ejercicios',
      description: 'Explora nuestra biblioteca de ejercicios con instrucciones detalladas',
      icon: '🏋️',
      route: '/exercises'
    },
    {
      title: 'Progreso',
      description: 'Registra y visualiza tu progreso con estadísticas personalizadas',
      icon: '📊',
      route: '/progress'
    },
    {
      title: 'Nutrición',
      description: 'Planes de alimentación y seguimiento nutricional',
      icon: '🥗',
      route: '/nutrition'
    }
  ];

  quickStats: QuickStat[] = [
    {
      label: 'Rutinas creadas',
      value: 5,
      icon: '📋'
    },
    {
      label: 'Entrenamientos',
      value: 12,
      icon: '🔥'
    },
    {
      label: 'Días activos',
      value: 8,
      icon: '📅'
    }
  ];

  motivationalQuotes: string[] = [
    "El único entrenamiento malo es el que no hiciste.",
    "Tu cuerpo puede soportar casi todo. Es tu mente la que debes convencer.",
    "No cuentes los días, haz que los días cuenten.",
    "La fuerza no viene de la capacidad física sino de una voluntad indomable."
  ];

  currentQuote: string = '';

  private router = inject(Router);

  ngOnInit(): void {

    this.loadUserData();

    this.currentQuote = this.getRandomQuote();
  }

  loadUserData(): void {
    this.userName = 'Miguel';
    this.lastSession = 'hace 2 días';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getRandomQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
    return this.motivationalQuotes[randomIndex];
  }
}
