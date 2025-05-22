# ☁️ Configuración de autenticación con Google usando Firebase

---

## 🔧 Paso 1: Crear el proyecto en Firebase

- Se ingresó a [Firebase Console](https://console.firebase.google.com/).
- Se hizo la opción **"Agregar proyecto"**.
---

## 🔐 Paso 2: Habilitar la autenticación con Google

- Dentro del proyecto, fui al menú lateral izquierdo y entré en **Authentication > Método de inicio de sesión**.
- Seleccioné **Google** como proveedor.
- Habilité la opción y añadí el **correo electrónico de soporte**.
- Guardé los cambios.

---

![Configuración de la app en Facebook](/imagenes/google.png)


## 🌍 Paso 3: Obtener las credenciales de Firebase

- Fui a **Configuración del proyecto > General**.
- Bajé a la sección **Mis aplicaciones** y seleccioné **Web** (</>).
- Registré el nombre de la app y Firebase me generó las credenciales necesarias:
  - `apiKey`
  - `authadmin`
  - `projectId`
  - `appId`, etc.

Se descargó automáticamente el archivo `serviceAccountKey.json`.
# 🔐 ¿Qué es `serviceAccountKey.json`?

Es un archivo que contiene las **credenciales privadas** necesarias para autenticar el servidor con Firebase. Permite 
- Verificar tokens de usuario
- Leer/escribir en la base de datos Firebase
- Administrar usuarios desde el backend

---

## 📥 ¿Cómo se obtuvo?

1. Se ingresó a [Firebase Console](https://console.firebase.google.com/).
2. Fui a **Configuración del proyecto > Cuentas de servicio**.
3. Hice clic en **"Generar nueva clave privada"**.
4. Se descargó automáticamente el archivo `serviceAccountKey.json`.

---