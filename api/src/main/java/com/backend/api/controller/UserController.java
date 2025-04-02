package com.backend.api.controller;

import com.backend.api.model.User;
import com.backend.api.service.UserService;
import com.backend.api.dto.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Permitir peticiones desde el frontend
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getNombre() == null || user.getPassword() == null
                || user.getApellido() == null || user.getCelular() == null) {
            throw new RuntimeException("Error: Algunos campos están llegando como null");
        }
        return userService.createUser(user);
    }

    @CrossOrigin(origins = "*")//acepta solicitudes desde cualquier dominio
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        Optional<User> userOptional = userService.getUserByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        User user = userOptional.get();

        String hashedPassword = loginRequest.getPassword();

        if (!user.getPassword().equals(hashedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(new LoginResponse(user.getEmail(), token));
    }

}
