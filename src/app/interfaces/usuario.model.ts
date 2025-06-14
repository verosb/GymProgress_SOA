export interface Usuario {
  id: string;
  uid: string;
  nombre: string;
  email: string;
  metodoAutenticacion: string;
  fechaRegistro: string | Date | any; // Timestamp de Firebase
}

export interface FiltroUsuarios {
  ordenarPor?: string;
  direccion?: string;
  filtroNombre?: string;
  filtroEmail?: string;
  fechaEspecifica?: string | Date | any;
}

export interface ConsultaEspecifica {
  tipo: 'todos' | 'fecha' | 'usuario' | 'usuario-fecha';
  fecha?: string | Date | any;
  usuario?: string;
}
