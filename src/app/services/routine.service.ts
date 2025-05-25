import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Routine {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  difficultyLevel: string;
  durationMinutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private apiUrl = `${environment.apiUrl}/routines`;

  constructor(private http: HttpClient) {}

  getMyRoutines(): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }

  getRoutinesByDifficultyLevel(level: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${this.apiUrl}/difficulty/${level}`, {
      withCredentials: true,
    });
  }

  createRoutine(routine: Routine): Observable<Routine> {
    console.log('Rutina recibida en el servicio: ', routine);
    return this.http.post<Routine>(this.apiUrl, routine, {
      withCredentials: true,
    });
  }

  updateRoutine(id: number, routine: Routine): Observable<Routine> {
    return this.http.put<Routine>(`${this.apiUrl}/update/${id}`, routine, {
      withCredentials: true,
    });
  }

  deleteRoutine(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      withCredentials: true,
    });
  }

}
