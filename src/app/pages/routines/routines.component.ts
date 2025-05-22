import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoutineService, Routine } from '../../services/routine.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FilterPipe,
  ],
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css'],
})
export default class RoutinesComponent implements OnInit, OnDestroy {
  routines: Routine[] = [];
  routineForm: FormGroup;

  searchTerm: string = '';
  difficultyFilter: string = '';
  showAddForm: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isEditing: boolean = false;
  editingRoutineId: number | null = null;

  private subscriptions: Subscription[] = [];

  private routineService = inject(RoutineService);
  private fb = inject(FormBuilder);

  constructor() {
    this.routineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      difficultyLevel: ['intermedio', Validators.required],
      durationMinutes: [30, [Validators.required, Validators.min(5)]],
    });
  }

  ngOnInit(): void {
    this.loadRoutines();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadRoutines(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.routineService
      .getMyRoutines()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.routines = data ?? [];
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar rutinas';
          console.error('Error cargando rutinas:', error);
        },
      });

    this.subscriptions.push(sub);
  }

  toggleAddRoutineForm(): void {
    this.showAddForm = !this.showAddForm;
    this.isEditing = false;
    this.editingRoutineId = null;

    if (this.showAddForm) {
      this.routineForm.reset({
        difficultyLevel: 'intermedio',
        durationMinutes: 30,
      });
    }
  }

  editRoutine(routine: Routine, event: Event): void {
    event.stopPropagation();
    this.isEditing = true;
    this.editingRoutineId = routine.id!;
    this.showAddForm = true;

    this.routineForm.setValue({
      name: routine.name,
      description: routine.description,
      difficultyLevel: routine.difficultyLevel,
      durationMinutes: routine.durationMinutes,
    });
  }

  saveRoutine(): void {
    if (this.routineForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const routineData: Routine = this.routineForm.value;

      if (this.isEditing && this.editingRoutineId) {
        const sub = this.routineService
          .updateRoutine(this.editingRoutineId, routineData)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (updatedRoutine) => {
              const index = this.routines.findIndex(
                (r) => r.id === this.editingRoutineId
              );
              if (index !== -1) {
                this.routines[index] = updatedRoutine;
              }

              this.resetFormState();
            },
            error: (error) => {
              this.errorMessage = 'Error al actualizar la rutina';
              console.error('Error actualizando rutina:', error);
            },
          });

        this.subscriptions.push(sub);
      } else {
        this.createRoutine();
      }
    }
  }

  createRoutine(): void {
    if (this.routineForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const newRoutine: Routine = this.routineForm.value;

      const sub = this.routineService
        .createRoutine(newRoutine)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (routine) => {
            this.routines.push(routine);
            this.resetFormState();
          },
          error: (error) => {
            this.errorMessage = 'Error al crear la rutina';
            console.error('Error creando rutina:', error);
          },
        });

      this.subscriptions.push(sub);
    }
  }

  deleteRoutine(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta rutina?')) {
      this.isLoading = true;
      this.errorMessage = '';

      const sub = this.routineService
        .deleteRoutine(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.routines = this.routines.filter((r) => r.id !== id);
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar la rutina';
            console.error('Error eliminando rutina:', error);
          },
        });

      this.subscriptions.push(sub);
    }
  }

  filterByDifficulty(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.difficultyFilter = select.value;

    if (this.difficultyFilter) {
      this.isLoading = true;
      this.errorMessage = '';

      const sub = this.routineService
        .getRoutinesByDifficultyLevel(this.difficultyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => {
            this.routines = data;
          },
          error: (error) => {
            this.errorMessage = 'Error al filtrar por dificultad';
            console.error('Error filtrando por dificultad:', error);
          },
        });

      this.subscriptions.push(sub);
    } else {
      this.loadRoutines();
    }
  }

  private resetFormState(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.editingRoutineId = null;
    this.routineForm.reset({
      difficultyLevel: 'intermedio',
      durationMinutes: 30,
    });
  }
}
