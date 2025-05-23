package com.backend.api.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.backend.api.util.JwtUtil;

import java.util.Collections;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        System.out.println("Interceptando ruta: " + request.getRequestURI());

        // Excluir endpoints públicos
        if (path.equals("/api/users/login") ||
                path.equals("/api/users/loginFirebase") ||
                path.equals("/api/users/loginGithub") ||
                path.equals("/api/users/loginFacebook") ||
                path.equals("/api/users") ||
                path.equals("/api/users/logout") ||
                path.equals("/api/users/isLogin") ||
                path.equals("/api/routines") ||
                path.equals("/api/routines/update/{id}") ||
                path.equals("/api/routines/me") ||
                path.equals("/api/routines/delete/{id}") ||
                path.equals("/api/routines/difficulty/{level}") ||
                path.equals("/api/email/forgot-password") ||
                path.equals("/api/email/reset-password") ||
                request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<String> token = Optional.empty();
        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                    .filter(cookie -> "authToken".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst();
        }

        if (token.isPresent() && jwtUtil.validateToken(token.get())) {
            String email = jwtUtil.getEmailFromToken(token.get());

            List<SimpleGrantedAuthority> authorities = Collections
                    .singletonList(new SimpleGrantedAuthority("ROLE_USER"));

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, null,
                    authorities);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);
            return;
        }

    }
}