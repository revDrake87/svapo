package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettings {

    @Id
    private Long id = 1L; // C'è solo una riga di impostazioni

    private String storeName;
    private String logoUrl;
    private String address;
    private String instagram;
    private String facebook;
    private String tiktok;
    private String whatsapp;
}
