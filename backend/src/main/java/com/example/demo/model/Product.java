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
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    
    // Nuovi campi per le specifiche
    private String category; // es. "LIQUIDO", "HARDWARE"
    private String subCategory; // es. "TPD", "MINI_SHOT_10_10", "SHOT_20_40", "AROMA", "NICOTINE_SHOT"
    private String flavor; // Gusto
    private String nicotineStrength; // Gradazione di nicotina (es. "4mg", "20mg", "Zero")
}
