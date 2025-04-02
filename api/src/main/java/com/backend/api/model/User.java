package com.backend.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String cellNumber;

    @Column(nullable = false)
    private String password;

    public User() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return name; }
    public void setNombre(String name) { this.name = name; }

    public String getApellido() { return lastName; }
    public void setApellido(String lastName) { this.lastName = lastName; }

    public String getCelular() { return cellNumber; }
    public void setCelular(String cellNumber) { this.cellNumber = cellNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", nombre='" + name + '\'' +
                ", apellido='" + lastName + '\'' +
                ", celular='" + cellNumber + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

}
