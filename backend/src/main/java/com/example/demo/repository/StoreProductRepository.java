package com.example.demo.repository;

import com.example.demo.model.StoreProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {
    List<StoreProduct> findByStoreId(Long storeId);
    StoreProduct findByStoreIdAndProductInstoreCode(Long storeId, Long productId);
    void deleteByProductInstoreCode(Long productId);
}
