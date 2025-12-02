package com.mercadinho.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {

    @NotBlank
    @Schema(description = "Usuário para login", example = "admin")
    private String username;

    @NotBlank
    @Schema(description = "Senha do usuário", example = "admin123")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
