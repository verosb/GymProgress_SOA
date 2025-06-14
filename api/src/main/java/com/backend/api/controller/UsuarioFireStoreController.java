package com.backend.api.controller;

import com.backend.api.service.UsuarioFirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/usuarioFireStore")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioFireStoreController {

    @Autowired
    private UsuarioFirestoreService usuarioFirestoreService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerUsuarios(
            @RequestParam(required = false) String ordenarPor,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) String filtroEmail,
            @RequestParam(required = false) String fechaEspecifica) {
        try {
            List<Map<String, Object>> usuarios = usuarioFirestoreService.obtenerUsuarios(
                    ordenarPor, direccion, filtroNombre, filtroEmail, fechaEspecifica);
            return ResponseEntity.ok(usuarios);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Map<String, Object>>> obtenerUsuariosPorFecha(@PathVariable String fecha) {
        try {
            List<Map<String, Object>> usuarios = usuarioFirestoreService.obtenerUsuariosPorFecha(fecha);
            return ResponseEntity.ok(usuarios);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/historial/{busqueda}")
    public ResponseEntity<List<Map<String, Object>>> obtenerHistorialUsuario(@PathVariable String busqueda) {
        try {
            List<Map<String, Object>> historial = usuarioFirestoreService.obtenerHistorialUsuario(busqueda);
            return ResponseEntity.ok(historial);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/acceso")
    public ResponseEntity<List<Map<String, Object>>> obtenerAccesoUsuarioFecha(
            @RequestParam String usuario,
            @RequestParam String fecha) {
        try {
            List<Map<String, Object>> acceso = usuarioFirestoreService.obtenerAccesoUsuarioFecha(usuario, fecha);
            return ResponseEntity.ok(acceso);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<String> registrarUsuario(
            @RequestParam String uid,
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String metodoAutenticacion) {
        String resultado = usuarioFirestoreService.registrarUsuario(uid, nombre, email, metodoAutenticacion);
        return ResponseEntity.ok(resultado);
    }
}