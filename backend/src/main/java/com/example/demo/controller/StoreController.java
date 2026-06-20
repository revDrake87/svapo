package com.example.demo.controller;

import com.example.demo.model.Store;
import com.example.demo.model.User;
import com.example.demo.repository.StoreProductRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "*")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreProductRepository storeProductRepository;

    @GetMapping
    public ResponseEntity<List<Store>> getStores(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if ("MASTER".equals(user.getRole())) {
            return ResponseEntity.ok(storeRepository.findAll());
        } else if ("ADMIN_STORE".equals(user.getRole())) {
            return ResponseEntity.ok(storeRepository.findByAdminStoreId(user.getAdminStoreId()));
        } else if ("STORE".equals(user.getRole())) {
            Optional<Store> store = storeRepository.findById(user.getStoreId());
            return store.map(s -> ResponseEntity.ok(List.of(s))).orElseGet(() -> ResponseEntity.notFound().build());
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping
    public ResponseEntity<?> createStore(@RequestBody Store newStore, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || (!"MASTER".equals(user.getRole()) && !"ADMIN_STORE".equals(user.getRole()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if ("ADMIN_STORE".equals(user.getRole())) {
            newStore.setAdminStoreId(user.getAdminStoreId());
        }

        return ResponseEntity.ok(storeRepository.save(newStore));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || !"MASTER".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return storeRepository.findById(id).map(store -> {
            // Remove associated store products first to avoid foreign key violations
            storeProductRepository.deleteAll(storeProductRepository.findByStoreId(id));

            storeRepository.delete(store);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable Long id, @RequestBody Store storeDetails, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return storeRepository.findById(id).map(store -> {
            // Check permissions
            if ("STORE".equals(user.getRole()) && !store.getId().equals(user.getStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).<Store>build();
            }
            if ("ADMIN_STORE".equals(user.getRole()) && !store.getAdminStoreId().equals(user.getAdminStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).<Store>build();
            }

            if (storeDetails.getStoreName() != null) store.setStoreName(storeDetails.getStoreName());
            if (storeDetails.getSlug() != null) store.setSlug(storeDetails.getSlug());
            if (storeDetails.getLogoUrl() != null) store.setLogoUrl(storeDetails.getLogoUrl());
            if (storeDetails.getAddress() != null) store.setAddress(storeDetails.getAddress());
            if (storeDetails.getInstagram() != null) store.setInstagram(storeDetails.getInstagram());
            if (storeDetails.getFacebook() != null) store.setFacebook(storeDetails.getFacebook());
            if (storeDetails.getTiktok() != null) store.setTiktok(storeDetails.getTiktok());
            if (storeDetails.getWhatsapp() != null) store.setWhatsapp(storeDetails.getWhatsapp());

            if ("MASTER".equals(user.getRole()) && storeDetails.getAdminStoreId() != null) {
                store.setAdminStoreId(storeDetails.getAdminStoreId());
            }

            return ResponseEntity.ok(storeRepository.save(store));
        }).orElse(ResponseEntity.notFound().build());
    }
}
