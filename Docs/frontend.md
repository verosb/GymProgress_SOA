# 🏋️‍♂️ GymProgress

**GymProgress** es una aplicación moderna desarrollada con **Angular** para la gestión y seguimiento del progreso en gimnasios. La aplicación utiliza **ThunderClient** para realizar pruebas de la API REST, garantizando una integración eficaz entre el frontend y el backend.

---

## 📜 Tabla de Contenidos
- [🚀 Instalación](#-instalación)
- [🌟 Características](#-características)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📖 Uso](#-uso)
- [📬 Endpoints de la API (ThunderClient)](#-endpoints-de-la-api-thunderclient)
- [🤝 Contribuir](#-contribuir)
- [⚖️ Licencia](#️-licencia)

---

## 🚀 Instalación

Sigue los siguientes pasos para ejecutar el proyecto localmente:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/verosb/GymProgress_SOA.git
   ```

2. **Navega al directorio del proyecto**:
   ```bash
   cd Gimnasio
   ```

3. **Instala las dependencias**:
   ```bash
   npm install
   ```

4. **Inicia el servidor de desarrollo**:
   ```bash
   ng serve
   ```
   Accede a la aplicación en: [http://localhost:4200](http://localhost:4200).

---

## 🌟 Características

✔️ Gestión de usuarios.  
✔️ Seguimiento personalizado de rutinas y progreso.  
✔️ Diseño responsivo y amigable.  
✔️ Integración con una API REST.  
✔️ Dashboard interactivo con métricas clave.

---

## 📂 Estructura del Proyecto

La estructura del proyecto está diseñada para mantener un flujo de trabajo organizado y eficiente:

```plaintext
src/
│
├── auth/
│   ├── auth.component.ts
│   ├── auth.component.html
│   ├── auth.component.css
│
├── register/
│   ├── register.component.ts
│   ├── register.component.html
│
├── dashboard/
│   ├── dashboard.component.ts
│   ├── dashboard.component.html
│
├── services/
│   ├── auth.service.ts
│
├── app.component.ts
├── app.component.html
├── app.component.css
├── app.config.server.ts
├── app.routes.ts
├── app.routes.server.ts
```

### Descripción de Carpetas

- **`auth/`**: Contiene los archivos relacionados con la autenticación, incluyendo el componente principal de autenticación.
- **`register/`**: Maneja el registro de nuevos usuarios.
- **`dashboard/`**: Contiene los archivos del panel principal que muestra estadísticas y progreso del usuario.
- **`services/`**: Incluye servicios como `auth.service.ts`, que gestiona la autenticación y la comunicación con el backend.

### Archivos Principales

- **`app.component.ts`**: Componente raíz de la aplicación.
- **`app.config.server.ts`**: Configuración del servidor backend.
- **`app.routes.ts` y `app.routes.server.ts`**: Configuran las rutas de navegación de la aplicación Angular.

---

## 🛠️ Tecnologías Utilizadas

- **Angular**: Framework principal para el desarrollo frontend.
- **TypeScript**: Lenguaje utilizado para un código más robusto.
- **ThunderClient**: Herramienta para probar la API REST.
- **Spring Boot**: Backend desarrollado en Java para manejar la lógica y la API REST.
- **CSS y Bootstrap**: Estilización de la interfaz de usuario.

---

## 📖 Uso

### Ejecución de la Aplicación

1. Ejecuta el comando para iniciar el servidor de desarrollo:  
   ```bash
   ng serve
   ```

2. Abre tu navegador y navega a [http://localhost:4200](http://localhost:4200).


---

## 📬 Endpoints de la API (ThunderClient)

A continuación, se describen algunos de los endpoints clave de la API REST:

### 🔹 Usuarios
- **GET** `/api/users` - Obtiene la lista de usuarios.
- **POST** `/api/users` - Crea un nuevo usuario.

### 🔹 Rutinas
- **GET** `/api/routines` - Obtiene la lista de rutinas.
- **POST** `/api/routines` - Crea una nueva rutina.

### 🔹 Progreso
- **GET** `/api/progress` - Obtiene el progreso del usuario.
- **POST** `/api/progress` - Registra el progreso del usuario.

---

## 🤝 Contribuir

Si quieres contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tus cambios:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Añadida nueva funcionalidad"
   ```
4. Sube tus cambios:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request** en GitHub.

---

## ⚖️ Licencia

Este proyecto está bajo la licencia [MIT](LICENSE). Puedes usarlo libremente para fines personales.

---

## 📞 Contacto

- **Autor**: Verónica 
- **GitHub**: [verosb](https://github.com/verosb)  
- **Email**: [vbsanchezb@ufpso.edu.co](vbsanchezb@ufpso.edu.co)