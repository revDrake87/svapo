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

    private Long adminStoreId; // To group products under an admin_store

    private String barcode; // Codice a barre
    private String name;
    private Integer milliliters; // Millilitri (es. 10, 20, 60)
    
    private String category; // "LIQUIDO" o "HARDWARE"
    private String subCategory; // Liquidi: "TPD", "MINI_SHOT", "SHOT", "AROMA", "NICOTINE_SHOT". Hardware: "BATTERY_BOX", "ATOMIZER_RTA", "ATOMIZER_NON_RTA", "STARTER_KIT", "POD_MOD", "POD_ACCESSORY", "ACCESSORY"
    
    private Double purchasePrice; // Prezzo di acquisto
    private Double defaultPrice; // Prezzo al pubblico base

    private String description;
    private String imageUrl;
    
    // Campi specifici per liquidi
    private String flavor; // Gusto principale
    private String ingredients; // Lista di ingredienti (es. "Menta, Limone, Tabacco")
    private String nicotineStrength; // Gradazione di nicotina (es. "4mg", "20mg", "Zero")

    // Campi specifici per hardware
    private String color; // Colore
    private String batteryType; // Tipo batteria (es. "Integrata 1000mAh", "18650")
    private Integer wattage; // Wattaggio massimo (es. 80)
    private Double tankCapacity; // Capacità serbatoio in ml (es. 2.0, 5.0)
}
