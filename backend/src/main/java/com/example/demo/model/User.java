package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role; // MASTER, ADMIN_STORE, STORE

    private Long adminStoreId; // Reference to the group they belong to

    private Long storeId; // For STORE users, reference to the specific store
}
