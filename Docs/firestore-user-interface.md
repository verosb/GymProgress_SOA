# 📄 Documentación: Interfaz de Consulta de Usuarios en Firestore

## 🎯 Objetivo

Crear una interfaz visual en Angular que permita consultar, ordenar y filtrar los usuarios registrados en la colección `usuarios` de Firestore. Esta vista facilitará búsquedas específicas y análisis históricos de acceso.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** Angular, Firebase JS SDK
- **Base de datos:** Firebase Firestore

---

## 📋 Funcionalidades requeridas

### 1. 📁 Ver todos los usuarios logueados en todas las fechas

- Se muestra una tabla que carga todos los documentos de la colección `usuarios`.
- La carga se hace con paginación y ordenada por `fechaRegistro` descendente.
- Se utiliza `orderBy('fechaRegistro', 'desc')` en Firestore.

### 2. 📆 Ver usuarios logueados en una fecha específica

- Se añade un componente `mat-datepicker` para seleccionar una fecha.
- Al elegir una fecha, se realiza una consulta con filtros por rango de tiempo en `fechaRegistro`:

```ts
const inicio = new Date(selectedDate);
inicio.setHours(0, 0, 0, 0);
const fin = new Date(selectedDate);
fin.setHours(23, 59, 59, 999);

const q = query(collection(db, 'usuarios'), where('fechaRegistro', '>=', inicio), where('fechaRegistro', '<=', fin));
```

### 3. 🔎 Ver historial de un usuario por nombre o email

- Se añade un campo de búsqueda donde el administrador escribe el nombre o email del usuario.
- La consulta se filtra con `where('email', '==', inputEmail)` o `where('nombre', '==', inputNombre)`.

> Nota: Firestore no permite filtros múltiples con OR directamente. Se hacen consultas separadas si es necesario.

### 4. 📅 Ver accesos de un usuario en una fecha específica

- Se combinan los filtros anteriores: email/nombre y rango de fechas.

---

## 📊 Interfaz de Usuario (Angular)

### Estructura sugerida:

- **Tabla**: `mat-table` con columnas: Nombre, Email, Tipo de Autenticación, Fecha y Hora
- **Filtros**:
  - Campo de texto para buscar por nombre o email.
  - Selector de fecha.
  - Orden por columna con íconos en el encabezado de tabla.

### Ejemplo de código de carga de datos:

```ts
const q = query(
  collection(db, 'usuarios'),
  orderBy('fechaRegistro', 'desc')
);
onSnapshot(q, (querySnapshot) => {
  const usuarios = [];
  querySnapshot.forEach((doc) => {
    usuarios.push(doc.data());
  });
  this.usuarios = usuarios;
});
```

---

## ✅ Buenas prácticas

- Validar entradas del usuario antes de ejecutar consultas.
- Limitar resultados con `limit()` si el dataset es muy grande.
- Usar loading spinner mientras se consulta Firestore.
- Deshabilitar búsqueda si no hay input válido.

---

## 📎 Conclusión

Esta interfaz visual permite al administrador monitorear y auditar el comportamiento de acceso de los usuarios autenticados. El uso de filtros por fecha y campos clave permite obtener datos precisos sin complejidad técnica para el usuario.
