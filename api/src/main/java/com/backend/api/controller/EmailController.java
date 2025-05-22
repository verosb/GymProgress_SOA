package com.backend.api.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.api.model.PasswordResetToken;
import com.backend.api.model.User;
import com.backend.api.service.EmailService;
import com.backend.api.service.UserService;
import com.backend.api.repository.PasswordResetTokenRepository;
import com.backend.api.repository.UserRepository;

import com.backend.api.service.EmailService; //controlador para reestablecer contraseña 

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestParam String to) {
        emailService.enviarCorreo(to, "Prueba de Email", "¡Este es un correo de prueba desde Spring Boot!");
        return ResponseEntity.ok("Correo enviado a " + to);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        User user = userOptional.get();
        String token = userService.createPasswordResetToken(user);

        String resetLink = "http://localhost:4200/auth/reset-password?token=" + token;

        emailService.enviarCorreo(
                email,
                "Restablecer contraseña",
                "Hola " + user.getName() + ",\n\n" +
                        "Haz clic en el siguiente enlace para restablecer tu contraseña:\n" +
                        resetLink + "\n\nEste enlace es válido por 1 hora.");

        return ResponseEntity.ok(Map.of("message", "Correo de recuperación enviado"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
        }

        PasswordResetToken resetToken = optionalToken.get();

        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El token ha expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(newPassword); // Ya viene encriptada desde el front

        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken); // Se elimina el token

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
    }

}
