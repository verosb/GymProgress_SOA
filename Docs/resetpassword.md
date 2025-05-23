# 📄 Documentación: Proceso de Restablecimiento de Contraseña

## 🧭 Flujo General

1. El usuario solicita recuperar su contraseña ingresando su correo.
2. El backend valida el correo, genera un token y lo asocia al usuario.
3. Se envía un correo con un enlace que contiene el token.
4. El usuario accede al enlace, define su nueva contraseña.
5. La contraseña se cifra con **CryptoJS** (SHA-256) en el frontend.
6. El backend valida el token y actualiza la contraseña del usuario.

---

## 🌐 Frontend – Angular

### Componentes involucrados:

- **forgot-password.component.ts**:  
  Envía el correo del usuario al backend para generar y enviar el token.

- **reset-password.component.ts**:  
  Obtiene el token desde la URL, valida que las contraseñas coincidan y envía la nueva contraseña cifrada.

### Seguridad

- Se usa **CryptoJS (SHA-256)** para cifrar la contraseña antes de enviarla.
- La contraseña cifrada es irreversible (hash).
- Se muestra retroalimentación con **SweetAlert2**.

---

## 🛠 Backend – Spring Boot

### Endpoints:

- `POST /email/forgot-password`:  
  Valida el correo, genera token, y envía email con enlace de recuperación.

- `POST /email/reset-password`:  
  Verifica el token, actualiza la contraseña del usuario y elimina el token.

### Notas:

- El token tiene una duración de 1 hora.
- La contraseña se recibe ya cifrada desde el frontend.
- Se almacena directamente, pero se recomienda cifrado adicional con `BCrypt` en el backend.

---

## 🗃 Modelo: PasswordResetToken

- Contiene:
  - Token único
  - Usuario asociado
  - Fecha de expiración

---

## ✉️ Configuración de correo (Gmail SMTP)

- Se usa en `application.properties`.
- Define host, puerto, usuario y clave de aplicación.
- Usa TLS y autenticación habilitada.

---
