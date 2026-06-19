package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminStoreId; // To group stores under an admin_store

    private String slug; // URL slug, e.g., 'store1a'

    private String storeName;
    private String logoUrl;
    private String address;
    private String instagram;
    private String facebook;
    private String tiktok;
    private String whatsapp;
}
