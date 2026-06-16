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

    @GetMapping
    public StoreSettings getSettings() {
        return storeSettingsRepository.findById(1L).orElse(new StoreSettings(1L, "VapeStore"));
    }

    @PutMapping
    public ResponseEntity<StoreSettings> updateSettings(@RequestBody StoreSettings newSettings) {
        return storeSettingsRepository.findById(1L).map(settings -> {
            settings.setStoreName(newSettings.getStoreName());
            return ResponseEntity.ok(storeSettingsRepository.save(settings));
        }).orElseGet(() -> {
            newSettings.setId(1L);
            return ResponseEntity.ok(storeSettingsRepository.save(newSettings));
        });
    }
}
