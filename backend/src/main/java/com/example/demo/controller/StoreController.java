package com.example.demo.controller;

import com.example.demo.model.Store;
import com.example.demo.model.User;
import com.example.demo.repository.StoreRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

            store.setStoreName(storeDetails.getStoreName());
            store.setSlug(storeDetails.getSlug());
            store.setLogoUrl(storeDetails.getLogoUrl());
            store.setAddress(storeDetails.getAddress());
            store.setInstagram(storeDetails.getInstagram());
            store.setFacebook(storeDetails.getFacebook());
            store.setTiktok(storeDetails.getTiktok());
            store.setWhatsapp(storeDetails.getWhatsapp());
            return ResponseEntity.ok(storeRepository.save(store));
        }).orElse(ResponseEntity.notFound().build());
    }
}
