package com.example.demo.repository;

import com.example.demo.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findBySlug(String slug);
    List<Store> findByAdminStoreId(Long adminStoreId);
}
