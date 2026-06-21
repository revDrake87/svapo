package com.example.demo.repository;

import com.example.demo.model.StoreSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreSettingsRepository extends JpaRepository<StoreSettings, String> {
}
