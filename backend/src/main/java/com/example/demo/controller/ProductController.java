package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.model.Store;
import com.example.demo.model.StoreProduct;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StoreProductRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreProductRepository storeProductRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<?> getAllProducts(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if ("STORE".equals(user.getRole())) {
            // Store users only see their StoreProducts
            List<StoreProduct> storeProducts = storeProductRepository.findByStoreId(user.getStoreId());
            return ResponseEntity.ok(storeProducts);
        } else if ("ADMIN_STORE".equals(user.getRole())) {
            return ResponseEntity.ok(productRepository.findByAdminStoreId(user.getAdminStoreId()));
        } else {
            return ResponseEntity.ok(productRepository.findAll());
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createProduct(@RequestBody Product product, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Se l'utente è uno STORE, il prodotto viene creato sotto il suo Admin Store, ma visibile solo a lui
        if ("STORE".equals(user.getRole())) {
            product.setAdminStoreId(user.getAdminStoreId());
        } else if ("ADMIN_STORE".equals(user.getRole())) {
            product.setAdminStoreId(user.getAdminStoreId());
        }

        Product savedProduct = productRepository.save(product);

        if (savedProduct.getAdminStoreId() != null) {
            List<Store> stores = storeRepository.findByAdminStoreId(savedProduct.getAdminStoreId());
            for (Store store : stores) {
                StoreProduct sp = new StoreProduct();
                sp.setStore(store);
                sp.setProduct(savedProduct);

                if ("STORE".equals(user.getRole())) {
                    // Visibile di default SOLO per lo store che lo ha inserito, invisibile per gli altri
                    sp.setIsAvailable(store.getId().equals(user.getStoreId()));
                } else {
                    // Inserito dall'ADMIN_STORE, visibile a tutti
                    sp.setIsAvailable(true);
                }

                storeProductRepository.save(sp);
            }
        }

        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if ("STORE".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("STORE users cannot edit global product details.");
        }

        return productRepository.findById(id).map(product -> {
            if ("ADMIN_STORE".equals(user.getRole()) && !product.getAdminStoreId().equals(user.getAdminStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            product.setBarcode(productDetails.getBarcode());
            product.setName(productDetails.getName());
            product.setMilliliters(productDetails.getMilliliters());
            product.setCategory(productDetails.getCategory());
            product.setSubCategory(productDetails.getSubCategory());
            product.setPurchasePrice(productDetails.getPurchasePrice());
            product.setDefaultPrice(productDetails.getDefaultPrice());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            product.setFlavor(productDetails.getFlavor());
            product.setNicotineStrength(productDetails.getNicotineStrength());
            product.setColor(productDetails.getColor());
            product.setBatteryType(productDetails.getBatteryType());
            product.setWattage(productDetails.getWattage());
            product.setTankCapacity(productDetails.getTankCapacity());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || "STORE".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return productRepository.findById(id).map(product -> {
             if ("ADMIN_STORE".equals(user.getRole()) && !product.getAdminStoreId().equals(user.getAdminStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // Delete associated StoreProducts first
            storeProductRepository.deleteByProductInstoreCode(id);
            productRepository.delete(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint for STORE users to toggle availability and set custom price
    @PutMapping("/store-product/{productId}")
    public ResponseEntity<?> updateStoreProduct(@PathVariable Long productId, @RequestBody StoreProduct spDetails, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || !"STORE".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        StoreProduct sp = storeProductRepository.findByStoreIdAndProductInstoreCode(user.getStoreId(), productId);
        if (sp == null) {
            return ResponseEntity.notFound().build();
        }

        sp.setIsAvailable(spDetails.getIsAvailable());
        sp.setCustomPrice(spDetails.getCustomPrice());
        return ResponseEntity.ok(storeProductRepository.save(sp));
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
