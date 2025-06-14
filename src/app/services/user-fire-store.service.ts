import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, FiltroUsuarios } from '../interfaces/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarioFireStore';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(filtros?: FiltroUsuarios): Observable<Usuario[]> {
    let params = new HttpParams();

    if (filtros?.ordenarPor) {
      params = params.set('ordenarPor', filtros.ordenarPor);
    }
    if (filtros?.direccion) {
      params = params.set('direccion', filtros.direccion);
    }
    if (filtros?.filtroNombre) {
      params = params.set('filtroNombre', filtros.filtroNombre);
    }
    if (filtros?.filtroEmail) {
      params = params.set('filtroEmail', filtros.filtroEmail);
    }
    if (filtros?.fechaEspecifica) {
      params = params.set('fechaEspecifica', filtros.fechaEspecifica);
    }

    return this.http.get<Usuario[]>(this.apiUrl, { params });
  }

  obtenerUsuariosPorFecha(fecha: string): Observable<Usuario[]> {
    console.log("Fecha recibida para filtrar: ", fecha);
    return this.http.get<Usuario[]>(`${this.apiUrl}/fecha/${fecha}`);
  }

  obtenerHistorialUsuario(busqueda: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/historial/${busqueda}`);
  }

  obtenerAccesoUsuarioFecha(
    usuario: string,
    fecha: string
  ): Observable<Usuario[]> {
    const params = new HttpParams().set('usuario', usuario).set('fecha', fecha);

    return this.http.get<Usuario[]>(`${this.apiUrl}/acceso`, { params });
  }

  formatearFecha(fechaInput: any): string {
    console.log(
      'Fecha recibida para formatear:',
      fechaInput,
      typeof fechaInput
    );

    if (!fechaInput) {
      return 'Fecha no disponible';
    }

    let fecha: Date;

    try {
      if (fechaInput instanceof Date) {
        fecha = fechaInput;
      } else if (typeof fechaInput === 'string') {
        let fechaLimpia = fechaInput;

        if (fechaInput.includes('.') && fechaInput.endsWith('Z')) {
          const partes = fechaInput.split('.');
          if (partes[1] && partes[1].length > 3) {
            fechaLimpia = partes[0] + '.' + partes[1].substring(0, 3) + 'Z';
          }
        }

        fecha = new Date(fechaLimpia);
      } else if (fechaInput._seconds || fechaInput.seconds) {
        const segundos = fechaInput._seconds || fechaInput.seconds;
        const nanosegundos =
          fechaInput._nanoseconds || fechaInput.nanoseconds || 0;
        fecha = new Date(segundos * 1000 + nanosegundos / 1000000);
      } else if (typeof fechaInput === 'number') {
        fecha = new Date(fechaInput);
      } else {
        fecha = new Date(fechaInput);
      }

      if (isNaN(fecha.getTime())) {
        console.error('Fecha inválida después de conversión:', fechaInput);
        return 'Fecha inválida';
      }

      return fecha.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota',
      });
    } catch (error) {
      console.error(
        'Error al formatear fecha:',
        error,
        'Fecha original:',
        fechaInput
      );
      return 'Error en fecha';
    }
  }
}
