import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/user-fire-store.service';
import {
  Usuario,
  FiltroUsuarios,
  ConsultaEspecifica,
} from '../../interfaces/usuario.model';

@Component({
  selector: 'app-usuario-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-fire-store.component.html',
  styleUrls: ['./user-fire-store.component.css'],
})
export default class UsuarioAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;
  error = '';

  filtros: FiltroUsuarios = {
    ordenarPor: 'fechaRegistro',
    direccion: 'desc',
  };

  consulta: ConsultaEspecifica = {
    tipo: 'todos',
  };

  // Variables de búsqueda separadas y específicas
  fechaBusqueda = '';
  usuarioBusqueda = '';
  usuarioBusquedaFecha = ''; // Variable específica para usuario+fecha
  fechaUsuarioBusqueda = '';

  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.error = '';

    console.log('Cargando usuarios con tipo:', this.consulta.tipo);
    console.log('Parámetros:', {
      fechaBusqueda: this.fechaBusqueda,
      usuarioBusqueda: this.usuarioBusqueda,
      usuarioBusquedaFecha: this.usuarioBusquedaFecha,
      fechaUsuarioBusqueda: this.fechaUsuarioBusqueda
    });

    switch (this.consulta.tipo) {
      case 'todos':
        this.cargarTodosLosUsuarios();
        break;
      case 'fecha':
        this.cargarUsuariosPorFecha();
        break;
      case 'usuario':
        this.cargarHistorialUsuario();
        break;
      case 'usuario-fecha':
        this.cargarAccesoUsuarioFecha();
        break;
    }
  }

  cargarTodosLosUsuarios() {
    this.usuarioService.obtenerUsuarios(this.filtros).subscribe({
      next: (usuarios) => {
        console.log('Usuarios recibidos:', usuarios);
        this.usuarios = usuarios || [];
        this.aplicarFiltrosLocales();
        this.cargando = false;
        this.calcularPaginacion();
      },
      error: (error) => {
        console.error('Error al cargar todos los usuarios:', error);
        this.error = 'Error al cargar usuarios: ' + error.message;
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.cargando = false;
      },
    });
  }

  cargarUsuariosPorFecha() {
    // Validación mejorada
    if (!this.fechaBusqueda || this.fechaBusqueda.trim() === '') {
      this.error = 'Debe seleccionar una fecha válida';
      this.cargando = false;
      return;
    }

    console.log('Cargando usuarios por fecha:', this.fechaBusqueda);

    this.usuarioService.obtenerUsuariosPorFecha(this.fechaBusqueda).subscribe({
      next: (usuarios) => {
        console.log('Usuarios por fecha recibidos:', usuarios);
        this.usuarios = usuarios || [];
        this.aplicarFiltrosLocales();
        this.cargando = false;
        this.calcularPaginacion();

        if (this.usuarios.length === 0) {
          this.error = `No se encontraron usuarios para la fecha ${this.fechaBusqueda}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios por fecha:', error);
        this.error = 'Error al cargar usuarios por fecha: ' + (error.error?.message || error.message);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.cargando = false;
      },
    });
  }

  cargarHistorialUsuario() {
    // Validación mejorada
    if (!this.usuarioBusqueda || this.usuarioBusqueda.trim() === '') {
      this.error = 'Debe ingresar un usuario para buscar (email, nombre o UID)';
      this.cargando = false;
      return;
    }

    const busquedaLimpia = this.usuarioBusqueda.trim();
    console.log('Cargando historial del usuario:', busquedaLimpia);

    this.usuarioService.obtenerHistorialUsuario(busquedaLimpia).subscribe({
      next: (usuarios) => {
        console.log('Historial de usuario recibido:', usuarios);
        this.usuarios = usuarios || [];
        this.aplicarFiltrosLocales();
        this.cargando = false;
        this.calcularPaginacion();

        if (this.usuarios.length === 0) {
          this.error = `No se encontró historial para el usuario: ${busquedaLimpia}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar historial del usuario:', error);
        this.error = 'Error al cargar historial del usuario: ' + (error.error?.message || error.message);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.cargando = false;
      },
    });
  }

  cargarAccesoUsuarioFecha() {
    // Validación mejorada con variables correctas
    if (!this.usuarioBusquedaFecha || this.usuarioBusquedaFecha.trim() === '') {
      this.error = 'Debe ingresar un usuario para buscar';
      this.cargando = false;
      return;
    }

    if (!this.fechaUsuarioBusqueda || this.fechaUsuarioBusqueda.trim() === '') {
      this.error = 'Debe seleccionar una fecha';
      this.cargando = false;
      return;
    }

    const usuarioLimpio = this.usuarioBusquedaFecha.trim();
    console.log('Cargando acceso usuario-fecha:', {
      usuario: usuarioLimpio,
      fecha: this.fechaUsuarioBusqueda
    });

    this.usuarioService.obtenerAccesoUsuarioFecha(usuarioLimpio, this.fechaUsuarioBusqueda).subscribe({
      next: (usuarios) => {
        console.log('Acceso usuario-fecha recibido:', usuarios);
        this.usuarios = usuarios || [];
        this.aplicarFiltrosLocales();
        this.cargando = false;
        this.calcularPaginacion();

        if (this.usuarios.length === 0) {
          this.error = `No se encontraron accesos para el usuario "${usuarioLimpio}" en la fecha ${this.fechaUsuarioBusqueda}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar acceso usuario-fecha:', error);
        this.error = 'Error al cargar acceso específico: ' + (error.error?.message || error.message);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.cargando = false;
      },
    });
  }

  aplicarFiltrosLocales() {
    if (!this.usuarios) {
      this.usuarios = [];
    }
    this.usuariosFiltrados = [...this.usuarios];

    if (this.filtros.filtroNombre) {
      this.usuariosFiltrados = this.usuariosFiltrados.filter((usuario) =>
        usuario?.nombre
          ?.toLowerCase()
          .includes(this.filtros.filtroNombre!.toLowerCase())
      );
    }

    if (this.filtros.filtroEmail) {
      this.usuariosFiltrados = this.usuariosFiltrados.filter((usuario) =>
        usuario?.email
          ?.toLowerCase()
          .includes(this.filtros.filtroEmail!.toLowerCase())
      );
    }

    this.aplicarOrdenamiento();
  }

  aplicarOrdenamiento() {
    if (!this.filtros.ordenarPor || !this.usuariosFiltrados) return;

    this.usuariosFiltrados.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (this.filtros.ordenarPor) {
        case 'nombre':
          valorA = a?.nombre?.toLowerCase() || '';
          valorB = b?.nombre?.toLowerCase() || '';
          break;
        case 'email':
          valorA = a?.email?.toLowerCase() || '';
          valorB = b?.email?.toLowerCase() || '';
          break;
        case 'fechaRegistro':
          valorA = a?.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
          valorB = b?.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (valorA < valorB) {
        return this.filtros.direccion === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.filtros.direccion === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.calcularPaginacion();
  }

  cambiarTipoConsulta(tipo: ConsultaEspecifica['tipo']) {
    this.consulta.tipo = tipo;
    this.limpiarBusquedas();
    if (tipo === 'todos') {
      this.cargarUsuarios();
    }
  }

  limpiarBusquedas() {
    this.fechaBusqueda = '';
    this.usuarioBusqueda = '';
    this.usuarioBusquedaFecha = '';
    this.fechaUsuarioBusqueda = '';
    this.error = '';
    this.usuarios = [];
    this.usuariosFiltrados = [];
  }

  cambiarOrdenamiento(campo: string) {
    if (this.filtros.ordenarPor === campo) {
      this.filtros.direccion =
        this.filtros.direccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.filtros.ordenarPor = campo;
      this.filtros.direccion = 'asc';
    }
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.paginaActual = 1;
    this.aplicarFiltrosLocales();
  }

  limpiarFiltros() {
    this.filtros.filtroNombre = '';
    this.filtros.filtroEmail = '';
    this.aplicarFiltros();
  }

  calcularPaginacion() {
    const totalUsuarios = this.usuariosFiltrados?.length || 0;
    this.totalPaginas = Math.ceil(totalUsuarios / this.elementosPorPagina);
  }

  get usuariosPaginados(): Usuario[] {
    if (!this.usuariosFiltrados || !Array.isArray(this.usuariosFiltrados)) {
      return [];
    }
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginasArray(): number[] {
    if (this.totalPaginas <= 0) {
      return [];
    }
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  formatearFecha(timestamp: any): string {
    return this.usuarioService.formatearFecha(timestamp);
  }

  exportarCSV() {
    if (!this.usuariosFiltrados || this.usuariosFiltrados.length === 0) {
      return;
    }
    const headers = [
      'ID',
      'UID',
      'Nombre',
      'Email',
      'Método Autenticación',
      'Fecha Registro',
    ];
    const rows = this.usuariosFiltrados.map((usuario) => [
      usuario?.id || '',
      usuario?.uid || '',
      usuario?.nombre || '',
      usuario?.email || '',
      usuario?.metodoAutenticacion || '',
      this.formatearFecha(usuario?.fechaRegistro),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  trackByUsuario(index: number, usuario: Usuario): string {
    return usuario?.id || index.toString();
  }

  get Math() {
    return Math;
  }
}
