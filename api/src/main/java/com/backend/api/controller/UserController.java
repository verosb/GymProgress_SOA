package com.backend.api.controller;

import com.backend.api.model.User;
import com.backend.api.repository.UserRepository;
import com.backend.api.util.JwtUtil;
import com.backend.api.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.backend.api.dto.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

//Controlador para la autenticación de usuarios 
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    private UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
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
        if (user.getEmail() == null || user.getName() == null || user.getPassword() == null
                || user.getLastName() == null || user.getCellNumber() == null) {
            throw new RuntimeException("Error: Algunos campos están llegando como null");
        }
        return userService.createUser(user);
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        Optional<User> userOptional = userService.getUserByEmail(loginRequest.getEmail());

        System.out.println("Intento de login: " + loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            System.out.println("Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        User user = userOptional.get();

        String hashedPassword = loginRequest.getPassword();

        System.out.println("Password recibida: " + hashedPassword);
        System.out.println("Password en DB: " + user.getPassword());

        if (!user.getPassword().equals(hashedPassword)) {
            System.out.println("Contraseña incorrecta");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        ResponseCookie cookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(user.getEmail(), token));

    }

    @GetMapping("/isLogin")
    public ResponseEntity<Map<String, String>> isLogin(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
            }
        } else {
            System.out.println("No hay cookies");
        }

        String token = jwtUtil.getTokenFromCookies(request);

        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token inválido o ausente"));
        }

        String email;
        try {
            email = jwtUtil.getEmailFromToken(token);
        } catch (Exception e) {
            System.out.println("No se pudo obtener el email desde el token: " + e.getMessage());
            email = null;
        }

        if (email == null || email.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Usuario autenticado, sin email"));
        }

        return ResponseEntity.ok(Map.of("message", "Usuario autenticado", "email", email));
    }

    @PostMapping("/loginFirebase")
    public ResponseEntity<?> login(@RequestBody SocialLoginRequest loginRequest, HttpServletResponse response) {
        try { //llegada del token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(loginRequest.getToken());
            String email = decodedToken.getEmail();
            String uid = decodedToken.getUid();
            System.out.println("Email traido del token: " + email);

            String finalEmail = (email == null || email.isEmpty()) ? uid + "@facebook-user.com" : email;

            User user = userRepository.findByEmail(finalEmail)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(finalEmail);
                        newUser.setProvider(decodedToken.getIssuer());

                        String fullName = (String) decodedToken.getClaims().get("name");
                        if (fullName != null && !fullName.isEmpty()) {
                            String[] nameParts = fullName.split(" ");
                            if (nameParts.length > 0) {
                                newUser.setName(nameParts[0]);

                                if (nameParts.length > 1) {
                                    StringBuilder lastName = new StringBuilder();
                                    for (int i = 1; i < nameParts.length; i++) {
                                        lastName.append(nameParts[i]);
                                        if (i < nameParts.length - 1) {
                                            lastName.append(" ");
                                        }
                                    }
                                    newUser.setLastName(lastName.toString());
                                } else {
                                    newUser.setLastName("");
                                }
                            }
                        } else {
                            newUser.setName("Usuario");
                            newUser.setLastName("Firebase");
                        }

                        newUser.setPassword(UUID.randomUUID().toString());

                        newUser.setCellNumber("N/A");

                        return userRepository.save(newUser);
                    });

            String jwtToken = jwtUtil.generateToken(email);

            Cookie cookie = new Cookie("authToken", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(jwtUtil.getExpiration().intValue());

            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of("message", "Usuario autenticado"));


        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body("Token inválido");
        }
    }

    private final Map<String, ResponseEntity<?>> cacheRespuestas = new ConcurrentHashMap<>();
    private final Map<String, Cookie> cacheCookies = new ConcurrentHashMap<>();

    @PostMapping("/loginGithub")
    public ResponseEntity<?> loginGithub(@RequestBody SocialLoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        String code = loginRequest.getToken();
        if (cacheRespuestas.containsKey(code)) {
            System.out.println("Token ya procesado, devolviendo respuesta cacheada");
            Cookie cookie = cacheCookies.get(code);
            if (cookie != null) {
                response.addCookie(cookie);  // agregar la cookie para que el cliente la reciba
            }
            return cacheRespuestas.get(code);
        }


        try {
            RestTemplate restTemplate = new RestTemplate();
            String clientId = "CLIENTID";
            String clientSecret = "CLIENT_SECRET";

            String url = "https://github.com/login/oauth/access_token";

            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> params = new HashMap<>();
            params.put("client_id", clientId);
            params.put("client_secret", clientSecret);
            params.put("code", code);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(params, headers);

            ResponseEntity<Map> gitHubResponse = restTemplate.postForEntity(url, entity, Map.class);

            if (gitHubResponse.getStatusCode() != HttpStatus.OK || gitHubResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error autenticando con GitHub");
            }

            String accessToken = (String) gitHubResponse.getBody().get("access_token");
            if (accessToken == null || accessToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se recibió token de GitHub z<<ds");
            }
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            userHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));
            HttpEntity<Void> userEntity = new HttpEntity<>(userHeaders);

            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    "https://api.github.com/user",
                    HttpMethod.GET,
                    userEntity,
                    Map.class
            );

            if (userResponse.getStatusCode() != HttpStatus.OK || userResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se pudo obtener info del usuario de GitHub");
            }

            Map<String, Object> userData = userResponse.getBody();

            String[] email = new String[]{(String) userData.get("email")};
            if (email[0] == null || email[0].isEmpty()) {
                email[0] = userData.get("login") + "@github-user.com";
            }

            String[] name = new String[]{(String) userData.get("name")};
            if (name[0] == null) {
                name[0] = "GitHubUser";
            }

            User user = userRepository.findByEmail(email[0])
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email[0]);
                        newUser.setName(name[0]);
                        newUser.setProvider("github");
                        newUser.setPassword(UUID.randomUUID().toString());
                        newUser.setCellNumber("N/A");
                        newUser.setLastName("Github");
                        return userRepository.save(newUser);
                    });

            String jwtToken = jwtUtil.generateToken(email[0]);
            Cookie cookie = new Cookie("authToken", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Cambia a true en producción con HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(jwtUtil.getExpiration().intValue());

            response.addCookie(cookie);
            ResponseEntity<?> respuestaOk = ResponseEntity.ok(Map.of("message", "Usuario autenticado"));
            cacheCookies.put(code, cookie);
            cacheRespuestas.put(code, respuestaOk);
            return respuestaOk;

        } catch (Exception e) {
            e.printStackTrace();
            ResponseEntity<?> errorResp = ResponseEntity.status(500).body("Error en autenticación con GitHub final");
            cacheRespuestas.put(code, errorResp);
            return errorResp;
        }
    }


    @PostMapping("/loginFacebook")
    public ResponseEntity<?> loginFacebook(@RequestBody SocialLoginRequest loginRequest, HttpServletResponse response) {
        String code = loginRequest.getToken();
        System.out.println("Código recibido de Facebook: " + code);

        if (cacheRespuestas.containsKey(code)) {
            System.out.println("Token ya procesado, devolviendo respuesta cacheada");
            Cookie cookie = cacheCookies.get(code);
            if (cookie != null) {
                response.addCookie(cookie);
            }
            return cacheRespuestas.get(code);
        }

        try {
            String clientId = "clientId";
            String clientSecret = "clientSecret";
            String redirectUri = "http://localhost:4200/facebook-callback";
            RestTemplate restTemplate = new RestTemplate();
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://graph.facebook.com/v18.0/oauth/access_token")
                    .queryParam("client_id", clientId)
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("client_secret", clientSecret)
                    .queryParam("code", code);

            String url = builder.toUriString();
            System.out.println("Final URL: " + url);

            ResponseEntity<Map> tokenResponse = restTemplate.getForEntity(url, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error al obtener token de acceso de Facebook");
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            String userInfoUrl = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
            ResponseEntity<Map> userResponse = restTemplate.getForEntity(userInfoUrl, Map.class);

            if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se pudo obtener información del usuario de Facebook");
            }

            Map<String, Object> userData = userResponse.getBody();
            String email = (String) userData.get("email");
            String name = (String) userData.get("name");

            if (email == null || email.isEmpty()) {
                email = "fbuser_" + userData.get("id") + "@facebook-user.com";
            }

            if (name == null) name = "Facebook User";

            String finalEmail = email;
            String finalName = name;
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(finalEmail);
                        newUser.setName(finalName);
                        newUser.setLastName("Facebook");
                        newUser.setProvider("facebook");
                        newUser.setPassword(UUID.randomUUID().toString());
                        newUser.setCellNumber("N/A");
                        return userRepository.save(newUser);
                    });

            // Paso 4: Generar JWT y enviarlo en cookie
            String jwtToken = jwtUtil.generateToken(user.getEmail());

            Cookie cookie = new Cookie("authToken", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Cambia a true en producción
            cookie.setPath("/");
            cookie.setMaxAge(jwtUtil.getExpiration().intValue());

            response.addCookie(cookie);
            ResponseEntity<?> respuestaOk = ResponseEntity.ok(Map.of("message", "Usuario autenticado"));
            cacheCookies.put(code, cookie);
            cacheRespuestas.put(code, respuestaOk);
            return respuestaOk;


        } catch (Exception e) {
            e.printStackTrace();
            ResponseEntity<?> errorResp = ResponseEntity.status(500).body("Error en autenticación con fACEBOOK");
            cacheRespuestas.put(code, errorResp);
            return errorResp;
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok().body(Map.of("message", "Logout exitoso"));

    }

}
