package com.svapo.catalog.controller;

import com.svapo.catalog.model.Product;
import com.svapo.catalog.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Cartella locale dove salvare i file (assicurati che sia configurata correttamente anche su Railway)
    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String storeId) {
        if (storeId != null && !storeId.isEmpty()) {
            return productService.getProductsByStoreId(storeId);
        }
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // SOLUZIONE A MONTE PER STORE ID: 
        // Se lo storeId è assente, nullo o valorizzato male, forziamo il codice corretto della postazione
        if (product.getStoreId() == null || 
            product.getStoreId().trim().isEmpty() || 
            "null".equalsIgnoreCase(product.getStoreId()) || 
            "1".equals(product.getStoreId())) {
            
            product.setStoreId("PROFESSIONAL_VAPE");
        }
        
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productService.getProductById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setBarcode(productDetails.getBarcode());
            // Manteniamo la blindatura anche in fase di aggiornamento
            if (productDetails.getStoreId() == null || 
                productDetails.getStoreId().trim().isEmpty() || 
                "null".equalsIgnoreCase(productDetails.getStoreId()) || 
                "1".equals(productDetails.getStoreId())) {
                product.setStoreId("PROFESSIONAL_VAPE");
            } else {
                product.setStoreId(productDetails.getStoreId());
            }
            product.setCategory(productDetails.getCategory());
            product.setSubCategory(productDetails.getSubCategory());
            product.setPurchasePrice(productDetails.getPurchasePrice());
            product.setRetailPrice(productDetails.getRetailPrice());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            product.setAvailable(productDetails.isAvailable());
            
            // Specifiche Liquidi
            product.setMilliliters(productDetails.getMilliliters());
            product.setFlavor(productDetails.getFlavor());
            product.setIngredients(productDetails.getIngredients());
            product.setNicotineStrength(productDetails.getNicotineStrength());
            
            // Specifiche Hardware
            product.setColor(productDetails.getColor());
            product.setBatteryType(productDetails.getBatteryType());
            product.setWattage(productDetails.getWattage());
            product.setTankCapacity(productDetails.getTankCapacity());

            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(updatedProduct);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.getProductById(id).isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Crea la cartella se non esiste
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Genera un nome unico per il file salvato
            String fileExtension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            // SOLUZIONE A MONTE PER IMMAGINI:
            // Restituiamo solo il percorso relativo. Ci penserà il frontend ad appenderlo all'host corretto.
            return ResponseEntity.ok("/uploads/" + fileName);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }
}