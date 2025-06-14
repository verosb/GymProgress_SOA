package com.backend.api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class UsuarioFirestoreService {

    public String registrarUsuario(String uid, String nombre, String email, String metodoAutenticacion) {
        Firestore db = FirestoreClient.getFirestore();
        Map<String, Object> datosUsuario = new HashMap<>();
        datosUsuario.put("uid", uid);
        datosUsuario.put("nombre", nombre);
        datosUsuario.put("email", email);
        datosUsuario.put("metodoAutenticacion", metodoAutenticacion);
        datosUsuario.put("fechaRegistro", Timestamp.now());

        try {
            ApiFuture<DocumentReference> future = db.collection("usuarios_autenticados").add(datosUsuario);
            DocumentReference docRef = future.get();
            System.out.println("Firestore → Documento guardado con ID: " + docRef.getId() +
                    " | Path: " + docRef.getPath());
            return "Usuario registrado correctamente en Firestore";
        } catch (Exception e) {
            System.err.println("Error al guardar en Firestore: " + e.getMessage());
            e.printStackTrace();
            return "Fallo al guardar usuario en Firestore";
        }
    }

    public List<Map<String, Object>> obtenerUsuarios(String ordenarPor, String direccion,
            String filtroNombre, String filtroEmail,
            String fechaEspecifica) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference usuarios = db.collection("usuarios_autenticados");

        Query query = usuarios;
        System.out.println("usuarios traidos: " + usuarios);

        if (filtroNombre != null && !filtroNombre.isEmpty()) {
            query = query.whereGreaterThanOrEqualTo("nombre", filtroNombre)
                    .whereLessThan("nombre", filtroNombre + "\uf8ff");
        }

        if (filtroEmail != null && !filtroEmail.isEmpty()) {
            query = query.whereGreaterThanOrEqualTo("email", filtroEmail)
                    .whereLessThan("email", filtroEmail + "\uf8ff");
        }

        if (fechaEspecifica != null && !fechaEspecifica.isEmpty()) {
            LocalDate fecha = LocalDate.parse(fechaEspecifica);
            LocalDateTime inicioDelDia = fecha.atStartOfDay();
            LocalDateTime finDelDia = fecha.atTime(23, 59, 59);

            Timestamp inicioTimestamp = Timestamp
                    .of(Date.from(inicioDelDia.atZone(ZoneId.systemDefault()).toInstant()));
            Timestamp finTimestamp = Timestamp.of(Date.from(finDelDia.atZone(ZoneId.systemDefault()).toInstant()));

            query = query.whereGreaterThanOrEqualTo("fechaRegistro", inicioTimestamp)
                    .whereLessThanOrEqualTo("fechaRegistro", finTimestamp);
        }

        if (ordenarPor != null && !ordenarPor.isEmpty()) {
            Query.Direction dir = "desc".equalsIgnoreCase(direccion) ? Query.Direction.DESCENDING
                    : Query.Direction.ASCENDING;
            query = query.orderBy(ordenarPor, dir);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        return documents.stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    data.put("id", doc.getId());

                    // Convertir Timestamp a String ISO
                    Object fechaRegistro = data.get("fechaRegistro");
                    if (fechaRegistro instanceof Timestamp) {
                        Timestamp timestamp = (Timestamp) fechaRegistro;
                        data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                    }

                    return data;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> obtenerUsuariosPorFecha(String fecha)
            throws ExecutionException, InterruptedException {
        System.out.println("Fecha recibida por el servicio: " + fecha);
        LocalDate fechaLocal = LocalDate.parse(fecha);
        System.out.println("Fecha despues del parse: " + fecha);
        LocalDateTime inicioDelDia = fechaLocal.atStartOfDay();
        LocalDateTime finDelDia = fechaLocal.atTime(23, 59, 59);

        Timestamp inicioTimestamp = Timestamp.of(Date.from(inicioDelDia.atZone(ZoneId.systemDefault()).toInstant()));
        Timestamp finTimestamp = Timestamp.of(Date.from(finDelDia.atZone(ZoneId.systemDefault()).toInstant()));

        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("usuarios_autenticados")
                .whereGreaterThanOrEqualTo("fechaRegistro", inicioTimestamp)
                .whereLessThanOrEqualTo("fechaRegistro", finTimestamp)
                .orderBy("fechaRegistro", Query.Direction.DESCENDING);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        return documents.stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    data.put("id", doc.getId());

                    // Convertir Timestamp a String ISO
                    Object fechaRegistro = data.get("fechaRegistro");
                    if (fechaRegistro instanceof Timestamp) {
                        Timestamp timestamp = (Timestamp) fechaRegistro;
                        data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                    }

                    return data;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> obtenerHistorialUsuario(String busqueda)
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        List<Map<String, Object>> resultados = new ArrayList<>();

        Query queryEmail = db.collection("usuarios_autenticados")
                .whereEqualTo("email", busqueda);

        ApiFuture<QuerySnapshot> futureEmail = queryEmail.get();
        resultados.addAll(futureEmail.get().getDocuments().stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    data.put("id", doc.getId());

                    // Convertir Timestamp a String ISO
                    Object fechaRegistro = data.get("fechaRegistro");
                    if (fechaRegistro instanceof Timestamp) {
                        Timestamp timestamp = (Timestamp) fechaRegistro;
                        data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                    }

                    return data;
                })
                .collect(Collectors.toList()));

        if (resultados.isEmpty()) {
            Query queryNombre = db.collection("usuarios_autenticados")
                    .whereEqualTo("nombre", busqueda);

            ApiFuture<QuerySnapshot> futureNombre = queryNombre.get();
            resultados.addAll(futureNombre.get().getDocuments().stream()
                    .map(doc -> {
                        Map<String, Object> data = doc.getData();
                        data.put("id", doc.getId());

                        // Convertir Timestamp a String ISO
                        Object fechaRegistro = data.get("fechaRegistro");
                        if (fechaRegistro instanceof Timestamp) {
                            Timestamp timestamp = (Timestamp) fechaRegistro;
                            data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                        }

                        return data;
                    })
                    .collect(Collectors.toList()));
        }

        if (resultados.isEmpty()) {
            Query queryUid = db.collection("usuarios_autenticados")
                    .whereEqualTo("uid", busqueda)
                    .orderBy("fechaRegistro", Query.Direction.DESCENDING);

            ApiFuture<QuerySnapshot> futureUid = queryUid.get();
            resultados.addAll(futureUid.get().getDocuments().stream()
                    .map(doc -> {
                        Map<String, Object> data = doc.getData();
                        data.put("id", doc.getId());

                        // Convertir Timestamp a String ISO
                        Object fechaRegistro = data.get("fechaRegistro");
                        if (fechaRegistro instanceof Timestamp) {
                            Timestamp timestamp = (Timestamp) fechaRegistro;
                            data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                        }

                        return data;
                    })
                    .collect(Collectors.toList()));
        }

        return resultados;
    }

    public List<Map<String, Object>> obtenerAccesoUsuarioFecha(String busquedaUsuario, String fecha)
            throws ExecutionException, InterruptedException {
        LocalDate fechaLocal = LocalDate.parse(fecha);
        LocalDateTime inicioDelDia = fechaLocal.atStartOfDay();
        LocalDateTime finDelDia = fechaLocal.atTime(23, 59, 59);

        Timestamp inicioTimestamp = Timestamp.of(Date.from(inicioDelDia.atZone(ZoneId.systemDefault()).toInstant()));
        Timestamp finTimestamp = Timestamp.of(Date.from(finDelDia.atZone(ZoneId.systemDefault()).toInstant()));

        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, Object>> resultados = new ArrayList<>();

        Query[] queries = {
                db.collection("usuarios_autenticados")
                        .whereEqualTo("email", busquedaUsuario)
                        .whereGreaterThanOrEqualTo("fechaRegistro", inicioTimestamp)
                        .whereLessThanOrEqualTo("fechaRegistro", finTimestamp),
                db.collection("usuarios_autenticados")
                        .whereEqualTo("nombre", busquedaUsuario)
                        .whereGreaterThanOrEqualTo("fechaRegistro", inicioTimestamp)
                        .whereLessThanOrEqualTo("fechaRegistro", finTimestamp),
                db.collection("usuarios_autenticados")
                        .whereEqualTo("uid", busquedaUsuario)
                        .whereGreaterThanOrEqualTo("fechaRegistro", inicioTimestamp)
                        .whereLessThanOrEqualTo("fechaRegistro", finTimestamp)
        };

        for (Query query : queries) {
            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {
                resultados.addAll(documents.stream()
                        .map(doc -> {
                            Map<String, Object> data = doc.getData();
                            data.put("id", doc.getId());

                            Object fechaRegistro = data.get("fechaRegistro");
                            if (fechaRegistro instanceof Timestamp) {
                                Timestamp timestamp = (Timestamp) fechaRegistro;
                                data.put("fechaRegistro", timestamp.toDate().toInstant().toString());
                            }

                            return data;
                        })
                        .collect(Collectors.toList()));
                break;
            }
        }

        return resultados;
    }
}