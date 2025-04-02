package com.backend.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String email;
    private String token;
}
//atributos que se devuelven devuelven al usuario tras el login
