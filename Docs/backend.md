# 📄 Documentación del Backend

## 🛠️ Tecnologías Utilizadas

- 🚀 **Spring Boot**: Framework para el desarrollo del backend en Java.
- 🗄️ **PostgreSQL**: Base de datos utilizada para almacenar la información.
- 📦 **JPA (Java Persistence API)**: Para la gestión de persistencia con la base de datos.
- 🎨 **Angular (Frontend)**: Aplicación cliente que consume la API del backend.

---

## 📂 Estructura del Proyecto

### **📌 Controller**

Contiene los controladores que manejan las solicitudes HTTP.

- 📄 `UserController.java`: Gestiona las peticiones relacionadas con los usuarios.

### **📤 DTO (Data Transfer Object)**

Define los objetos de transferencia de datos entre el cliente y el servidor.

- 🔑 `LoginRequest.java`: Maneja los datos de inicio de sesión.
- ✅ `LoginResponse.java`: Responde con los datos del usuario autenticado.

### **🗃️ Model**

Define las entidades de la base de datos.

- 👤 `User.java`: Representa la estructura de la tabla de usuarios.

### **💾 Repository**

Interfaz para interactuar con la base de datos mediante JPA.

- 📜 `UserRepository.java`: Contiene métodos para consultar, guardar y eliminar usuarios.

### **⚙️ Service**

Implementa la lógica de negocio.

- 🔄 `UserService.java`: Maneja la autenticación y gestión de usuarios.

### **🛠️ Resources**

Contiene archivos de configuración del proyecto.

- ⚙️ `application.properties`: Define la conexión con la base de datos y otros parámetros de configuración.

### **🧪 Test**

Contiene pruebas unitarias e integración.

- 📝 `ApiApplicationTests.java`: Pruebas para verificar el correcto funcionamiento de la API.

### **🚀 Archivo Principal**

- 🏁 `ApiApplication.java`: Inicializa la aplicación backend con Spring Boot.

---

## ⚙️ Configuración del Backend

1. **📥 Instalar dependencias:**
   ```bash
   mvn install
   ```
2. **⚙️ Configurar la base de datos en **************\`\`**************:**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/gimnasio
   spring.datasource.username=postgres
   spring.datasource.password=123
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **▶️ Ejecutar el backend:**
   ```bash
   mvn spring-boot:run
   ```

---

## 🌐 Rutas de la API

### **👤 Usuarios**

- 🔑 `POST /api/auth/login` → Iniciar sesión.
- 📝 `POST /api/auth/register` → Registrar un nuevo usuario.
- 📌 `GET /api/users/{id}` → Obtener usuario por ID.

---

## 🎨 Estructura del Frontend Relacionada

### **📂 Carpetas Principales**

- \*\*🔐 \*\*\`\`: Contiene archivos relacionados con la autenticación.
  - `auth.component.ts/.html/.css`
- \*\*📝 \*\*\`\`: Maneja el registro de usuarios.
- \*\*📊 \*\*\`\`: Contiene la vista del panel principal.
  - `dashboard.component.ts/.html`
- \*\*🛠️ \*\*\`\`: Contiene servicios para la autenticación.
  - `auth.service.ts`

### **📌 Archivos Clave**

- 🏠 `app.component.ts/.html/.css`: Componente raíz de la aplicación.
- 🌍 `app.config.server.ts`: Configuración del servidor backend.
- 🔀 `app.routes.ts y app.routes.server.ts`: Configuración de rutas en Angular.

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

- **Autor**: Ibeth Ortega 
- **GitHub**: [IbethOrtegaa](https://github.com/IbethOrtegaa)  
- **Email**: [idortegar@ufpso.edu.co](idortegar@ufpso.edu.co)
