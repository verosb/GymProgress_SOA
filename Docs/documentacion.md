# 🏋 GymProgress - Plataforma para Gestión de Rendimiento Fitness

## 📌 Descripción  
GymProgress es una plataforma digital diseñada para que los usuarios de gimnasios *registren y gestionen* su progreso físico de manera organizada. Con una interfaz intuitiva y herramientas avanzadas, permite a los usuarios llevar un *control preciso de su evolución*, facilitando ajustes en sus rutinas para optimizar resultados.  

## 🚨 Problemática  
En muchos gimnasios, los usuarios encuentran difícil llevar un registro adecuado de sus entrenamientos, lo que puede generar:  

1️⃣ *Dificultad para medir el progreso* de manera efectiva. En muchos gimnasios, los usuarios llevan un control manual de sus rutinas en libretas o aplicaciones no especializadas.

2️⃣ *Desmotivación y Falta de Seguimiento:* muchos usuarios abandonan sus entrenamientos por falta de motivación, al no ver un progreso claro. Sin un sistema de seguimiento, es difícil visualizar logros y establecer metas realistas.
Además, existen aplicaciones, pero muchas están orientadas a ejercicios generales y no permiten personalización avanzada.

GymProgress *soluciona* esta problemática al proporcionar una plataforma digital que facilita la organización de entrenamientos, el análisis de progreso y la optimización de rutinas.  

## 🎯 Objetivo y Alcance  
### ✅ Objetivo  
El objetivo principal de GymProgress es ofrecer una *solución tecnológica eficiente* que permita a los usuarios:  

- *Registrar rutinas de ejercicios*, incluyendo el tipo de ejercicio, duración, intensidad y repeticiones.  
- *Monitorear su progreso* a lo largo del tiempo, especialmente en términos de peso y rendimiento en los entrenamientos.  

### 📌 Alcance  
La plataforma está diseñada para:  
- Permitir la *creación de perfiles de usuario* donde se almacenen datos personales y de entrenamiento.  
- Proporcionar una *visualización interactiva* de rutinas y pesos levantados, con posibilidad de registrar avances y cambios.  


## 🚀 Impacto Esperado  
Se espera que GymProgress genere un impacto positivo en los usuarios al:  

✅ *Incrementar la motivación*, permitiendo un seguimiento detallado de su evolución.  
✅ *Mejorar los resultados físicos*, gracias a la posibilidad de realizar ajustes informados en las rutinas.  
✅ *Facilitar el acceso a la información*, optimizando la interacción entre usuarios y sus registros. 
✅ *Escalabilidad*, ya que en el futuro se podrán integrar dispositivos de medición de actividad física o planes de entrenamiento personalizados.  

## 🛠 Tecnologías Utilizadas  
Para el desarrollo de la aplicación web se utiliza lo siguiente:  

| 🖥 Tecnología    | 📌 Descripción |
|-----------------|-----------------------------------------------|
| *Spring Boot* | Framework para el backend.
| *Angular*     | Framework para el frontend, proporciona una interfaz interactiva. |
| *PostgreSQL*  | Base de datos relacional para almacenar información de usuarios y rutinas. |
| *Jira*        | Herramienta de gestión de proyectos, seguimiento de tareas y planificación ágil. |
| *GitHub*      | Plataforma para control de versiones y colaboración en el código. |
| *Thunder Client* | Extensión de Visual Studio Code que se usa para realizar pruebas de APIs REST de forma sencilla y rápida. Es una alternativa ligera a herramientas como Postman, diseñada específicamente para desarrolladores que trabajan dentro de VS Code.
# 🚀 Integración de Spring Boot con Angular

## 📌 1. Creación del Backend con Spring Boot
Algunos de los pasos principales para configurar Spring Boot son los siguientes: 

### 🛠 1.1 Generar el Proyecto Spring Boot
Utilizando  [Spring Initializr](https://start.spring.io/) y seleccionando propiedades de instalación:
- *Lenguaje:* Java
- *Spring Boot:* Versión a utilizar 
- *Dependencias:* SpringBoot data JPA, SpringBoot Starter Web
PostgreSql, Lombok
- *Empaquetado:* JAR

📥 Luego, descargar y descomprimir la inicialización de Spring Boot generado en un archivo zip.

---

### ⚙ 1.2 Configurar el Application.properties con las propiedades de la base de datos a utilizar, el usuario y clave de Postgresql.

### 🏗 1.3 Crear Entidad y Repositorio
📌 **Definir la entidad User.java**

📌 **Crear el repositorio UserRepository.java**

---

### 🌐 1.4 Crear Controlador REST
El UserController gestiona las solicitudes HTTP relacionadas con los usuarios. 

🔹 *Anotaciones clave:*
- @RestController: Indica que la clase es un controlador REST.
- @RequestMapping("/api/users"): Define la ruta base.
- @CrossOrigin(origins = "*"): Permite solicitudes desde cualquier origen.

🔹 *Métodos principales:*
- getAllUsers(): Retorna la lista de usuarios.
- getUserById(Long id): Obtiene un usuario por su ID.
- createUser(User user): Registra un nuevo usuario con validaciones.
- loginUser(LoginRequest loginRequest): Autentica usuarios y genera un token de sesión.

`

### ▶ 1.5 Pasos para ejecutar Spring Boot
bash
mvn spring-boot:run  dentro de la carpeta api

📍 El backend se ejecutará en http://localhost:8080.

---

## 🎨 2. Creación del Frontend con Angular

### 🛠 2.1 Instalar Angular CLI 
bash
npm install -g @angular/cli


### 📂 2.2 Crear el Proyecto Angular
bash
ng new proyecto
cd proyecto


### 🎨 2.3 Generar Componentes y Servicios
bash
ng generate component login
ng generate component register
ng generate service auth

### ▶ 1.5 Pasos para ejecutar Angular
bash
ng server o ng s dentro de la carpeta frontend

📍 El frontend se ejecutará en http://localhost:4200.



## 🔗 Integración de Componentes  
Para garantizar un *flujo eficiente de datos y funcionalidad*, los componentes de GymProgress se integran de la siguiente manera:  



## 🏗 Gestión del Proyecto  
El desarrollo de GymProgress sigue metodologías ágiles para garantizar un proceso eficiente y controlado:  

🔹 *Jira* se utiliza para gestionar las tareas, dividiéndolas en épicas y sprints.  
🔹 *GitHub* aloja el código del proyecto, permitiendo el control de versiones y la colaboración entre los desarrolladores.  


## 📌 Conclusión  
GymProgress es una *solución innovadora y escalable* que optimiza la gestión del rendimiento físico en gimnasios. Su integración con tecnologías como Spring Boot y Angular garantiza una experiencia amigable para el usuario.

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

- **Autor**: Mayerly Araque 
- **GitHub**: [MayerlyAraque](https://github.com/MayerlyAraque)  
- **Email**: [maraqued@ufpso.edu.co](maraqued@ufpso.edu.co)