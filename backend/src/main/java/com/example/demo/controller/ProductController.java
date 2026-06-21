package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // In production, restrict this to your frontend URL
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String storeId) {
        if (storeId != null && !storeId.isEmpty()) {
            return productRepository.findByStoreId(storeId);
        }
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setStoreId(productDetails.getStoreId());
            product.setBarcode(productDetails.getBarcode());
            product.setName(productDetails.getName());
            product.setMilliliters(productDetails.getMilliliters());
            product.setCategory(productDetails.getCategory());
            product.setSubCategory(productDetails.getSubCategory());
            product.setPurchasePrice(productDetails.getPurchasePrice());
            product.setRetailPrice(productDetails.getRetailPrice());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            product.setFlavor(productDetails.getFlavor());
            product.setNicotineStrength(productDetails.getNicotineStrength());
            product.setColor(productDetails.getColor());
            product.setBatteryType(productDetails.getBatteryType());
            product.setWattage(productDetails.getWattage());
            product.setTankCapacity(productDetails.getTankCapacity());
            product.setIsAvailable(productDetails.getIsAvailable() != null ? productDetails.getIsAvailable() : true);
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            byte[] bytes = file.getBytes();
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            Path path = Paths.get(UPLOAD_DIR + newFilename);
            Files.createDirectories(path.getParent());
            Files.write(path, bytes);

            String fileUrl = "http://localhost:8080/uploads/" + newFilename;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }
}
