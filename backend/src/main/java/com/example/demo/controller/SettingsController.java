package com.example.demo.controller;

import com.example.demo.model.StoreSettings;
import com.example.demo.repository.StoreSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private StoreSettingsRepository storeSettingsRepository;

    @GetMapping("/{storeId}")
    public StoreSettings getSettings(@PathVariable String storeId) {
        return storeSettingsRepository.findById(storeId).orElse(new StoreSettings(storeId, "VapeStore", null, null, null, null, null, null));
    }

    @PutMapping("/{storeId}")
    public ResponseEntity<StoreSettings> updateSettings(@PathVariable String storeId, @RequestBody StoreSettings newSettings) {
        return storeSettingsRepository.findById(storeId).map(settings -> {
            settings.setStoreName(newSettings.getStoreName());
            settings.setLogoUrl(newSettings.getLogoUrl());
            settings.setAddress(newSettings.getAddress());
            settings.setInstagram(newSettings.getInstagram());
            settings.setFacebook(newSettings.getFacebook());
            settings.setTiktok(newSettings.getTiktok());
            settings.setWhatsapp(newSettings.getWhatsapp());
            return ResponseEntity.ok(storeSettingsRepository.save(settings));
        }).orElseGet(() -> {
            newSettings.setId(storeId);
            return ResponseEntity.ok(storeSettingsRepository.save(newSettings));
        });
    }
}
