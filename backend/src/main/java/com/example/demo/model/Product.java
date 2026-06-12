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
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long instoreCode; // Codice instore, chiave primaria autogenerata progressiva

    private String barcode; // Codice a barre
    private String name;
    private Integer milliliters; // Millilitri (es. 10, 20, 60)
    
    private String category; // es. "LIQUIDO", "HARDWARE"
    private String subCategory; // tipologia: es. "SHOT", "MINI_SHOT_10_10", "MINI_SHOT_10_20", "TPD"
    
    private Double purchasePrice; // Prezzo di acquisto
    private Double retailPrice; // Prezzo al pubblico

    private String description;
    private String imageUrl;
    
    // Campi specifici per liquidi
    private String flavor; // Gusto
    private String nicotineStrength; // Gradazione di nicotina (es. "4mg", "20mg", "Zero")
}
