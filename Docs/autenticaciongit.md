# ⚙️ Configuración de autenticación con GitHub
---

# 🔐 Paso 1: Crear una aplicación en GitHub Developers

- Se ingresó a [GitHub Developer Settings](https://github.com/settings/developers).
- Se ingresaron los campos obligatorios: nombre de la app, URL de la página principal y URL de redirección (callback URL).
- Se guardó la aplicación y se copió el **Client ID** y **Client Secret** que GitHub generó.
---

# 🌐 Paso 2: Configurar el backend para GitHub
- En el backend se añadieron las credenciales `Client ID` y `Client Secret`.

![Configuración de la app en Facebook](./imagenes/git%202.jpg)
![Configuración de la app en Facebook](/imagenes/git%201.jpg)


---

# 🔐 Paso 3: Agregar las credenciales en backend y frontend

---

## ⚙️ En el backend (UserController)

- Insertamos el **App ID** y **App Secret** obtenidos de Facebook en el controlador encargado de la autenticación.
- Estas credenciales se usan para validar el token de acceso que envía el frontend.
- Así, el backend puede verificar que el token es válido y autenticar al usuario correctamente.
- Se implementó el endpoint que recibe el código de autorización que GitHub envía tras la autenticación.
- Ese endpoint hace una petición a GitHub para intercambiar el código por un token de acceso.
- Se validó el token y luego se autenticó al usuario en el sistema.

---

## 🌐 En el frontend (facebook.ts)

- Configuramos el servicio para usar el SDK de Facebook y obtener el token de acceso (`accessToken`).
- Luego, enviamos ese token al backend para que realice la validación con las credenciales.
- Esto permite que la autenticación sea segura y centralizada en el servidor.

---

