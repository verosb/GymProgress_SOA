# 📌 Documentación: Registro de Usuarios Autenticados en Firestore

## 🎯 Objetivo

Implementar en el backend (Spring Boot) y frontend (Angular) una funcionalidad que registre automáticamente la información de los usuarios autenticados en el sistema (por login personalizado, Google, Facebook o GitHub), almacenándola en una colección en Firebase Firestore. Se debe registrar:

- Datos personales.
- Tipo de autenticación.
- Contraseña encriptada (solo para login personalizado).
- Fecha y hora exacta del servidor (`serverTimestamp()`).

---

## ⚙️ Tecnologías utilizadas

- **Backend:** Spring Boot, Firebase Admin SDK
- **Frontend:** Angular, Firebase JS SDK (v9 modular)
- **Base de datos:** Firebase Firestore
- **Autenticación:** Firebase Authentication

---

## 🛠️ Proceso de Desarrollo

### 1. Configuración de Firebase

- Se creó un proyecto en Firebase.
- Se activó Firebase Authentication con métodos: Email/Password, Google, Facebook y GitHub.
- Se habilitó Firestore en modo de prueba y se definió una colección llamada `usuarios`.

### 2. Integración en Angular (Frontend)

#### 🔐 Autenticación

- Se integró Firebase con Angular usando `firebase/app`, `firebase/auth`, y `firebase/firestore`.
- Se desarrolló un servicio `auth.service.ts` que contiene métodos para autenticarse y obtener datos del usuario autenticado.

\`\`\`ts
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
\`\`\`

#### ✅ Validaciones

- En el formulario de login se aplicaron validaciones reactivas: email requerido, formato válido, y contraseña.
- Solo se permite enviar si el formulario es válido.

#### 📤 Envío de datos a Firestore

- Una vez autenticado el usuario, se envían los datos a Firestore desde Angular:

\`\`\`ts
await addDoc(collection(db, 'usuarios'), {
  uid: user.uid,
  nombre: user.displayName || 'Sin nombre',
  email: user.email,
  autenticadoCon: 'Google',
  fechaRegistro: serverTimestamp()
});
\`\`\`

- Se permite duplicidad de registros por usuario, ya que el timestamp los diferencia.

---

### 3. Integración en Spring Boot (Backend)

#### 🔧 Firebase Admin SDK

- Se incluyó Firebase Admin en `pom.xml`:

\`\`\`xml
<dependency>
  <groupId>com.google.firebase</groupId>
  <artifactId>firebase-admin</artifactId>
  <version>9.1.1</version>
</dependency>
\`\`\`

- Se cargó el archivo `serviceAccountKey.json` de Firebase para inicializar la app en el backend.

#### 🔐 Cifrado de contraseñas

- Se implementó BCrypt para encriptar las contraseñas de los usuarios con login personalizado:

\`\`\`java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String passwordEncriptado = encoder.encode(usuario.getPassword());
\`\`\`

#### 📥 Envío a Firestore

- Se creó un método en el servicio que guarda datos en la colección `usuarios`:

\`\`\`java
Map<String, Object> docData = new HashMap<>();
docData.put("uid", uid);
docData.put("email", email);
docData.put("nombre", nombre);
docData.put("autenticadoCon", tipoAutenticacion);
docData.put("password", passwordEncriptado);
docData.put("fechaRegistro", FieldValue.serverTimestamp());

firestore.collection("usuarios").add(docData);
\`\`\`

---

## 🔐 Reglas de seguridad Firestore

\`\`\`js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false;
    }
  }
}
\`\`\`

- Solo usuarios autenticados pueden escribir en `usuarios`.

---

## ✅ Consideraciones y Buenas Prácticas

- **Validación de frontend:** No se permite acceso a usuarios no registrados.  
- **No sobrescribir:** Cada autenticación registra un documento nuevo.  
- **Seguridad:** Password encriptado solo para autenticación por correo/contraseña.  
- **Timestamp confiable:** Se usa `serverTimestamp()` en Firestore, evitando manipulaciones desde el cliente.

---

## 📎 Conclusión

Esta implementación garantiza que cada usuario que acceda al sistema quede registrado con datos confiables y auditables, usando buenas prácticas de validación y seguridad. El uso de `serverTimestamp()` asegura que los datos reflejen el momento exacto en que se autenticó, sin posibilidad de alteración desde el cliente.
