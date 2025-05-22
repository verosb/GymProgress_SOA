package com.backend.api.controller;

import com.backend.api.model.Routine;
import com.backend.api.service.RoutineService;
import com.backend.api.model.User;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.backend.api.util.JwtUtil;
import com.backend.api.repository.UserRepository;
 
//Controlador para la gestión de rutinas
@RestController
@RequestMapping("/api/routines")
public class RoutineController {

    @Autowired
    private RoutineService routineService;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    public RoutineController(
            RoutineService routineService,
            UserRepository userRepository,
            JwtUtil jwtUtil) {
        this.routineService = routineService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    //Listado de rutinas 
    @GetMapping("/me")
    public ResponseEntity<List<Routine>> getRoutinesByUser(HttpServletRequest request) {
        System.out.println("Ingreso en traer rutinas del usuario");
        String token = jwtUtil.getTokenFromCookies(request);
        System.out.println("Token traido del usuario: " + token);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.getEmailFromToken(token);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = optionalUser.get();
        List<Routine> routines = routineService.getRoutinesByUserId(user.getId());

        return ResponseEntity.ok(routines);
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Routine>> getRoutinesByUserAndDifficulty(
            @PathVariable String level,
            HttpServletRequest request) {

        String token = jwtUtil.getTokenFromCookies(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.getEmailFromToken(token);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = optionalUser.get();
        List<Routine> routines = routineService.getRoutinesByUserIdAndDifficulty(user.getId(), level);

        return ResponseEntity.ok(routines);
    }
 //Crear la rutina 
    @PostMapping
    public ResponseEntity<Routine> createRoutine(
            @RequestBody Routine routine,
            HttpServletRequest request) {
        System.out.println("Entrando en Routines");

        String token = jwtUtil.getTokenFromCookies(request);
        System.out.println("Token traido de las cookies: " + token);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.getEmailFromToken(token);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("Rutina llegada al back: " + routine);

        User user = optionalUser.get();
        Routine createdRoutine = routineService.createRoutine(routine, user.getId());

        return createdRoutine != null ? new ResponseEntity<>(createdRoutine, HttpStatus.CREATED)
                : ResponseEntity.badRequest().build();
    }
//Actualizar rutina 
    @PutMapping("/update/{id}")
    public ResponseEntity<Routine> updateRoutine(
            @PathVariable Long id,
            @RequestBody Routine routineDetails) {
        Routine updatedRoutine = routineService.updateRoutine(id, routineDetails);
        return updatedRoutine != null ? ResponseEntity.ok(updatedRoutine) : ResponseEntity.notFound().build();
    }
//Eliminar rutina 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoutine(@PathVariable Long id) {
        System.out.println("Eliminando rutina...");
        boolean deleted = routineService.deleteRoutine(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    
}
