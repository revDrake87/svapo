package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.model.Store;
import com.example.demo.model.StoreProduct;
import com.example.demo.repository.StoreProductRepository;
import com.example.demo.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public/stores")
public class PublicController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreProductRepository storeProductRepository;

    @GetMapping("/{slug}")
    public ResponseEntity<Store> getStoreBySlug(@PathVariable String slug) {
        Optional<Store> store = storeRepository.findBySlug(slug);
        return store.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{slug}/products")
    public ResponseEntity<List<Product>> getStoreProducts(@PathVariable String slug) {
        Optional<Store> storeOpt = storeRepository.findBySlug(slug);
        if (storeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Store store = storeOpt.get();
        List<StoreProduct> storeProducts = storeProductRepository.findByStoreId(store.getId());

        List<Product> products = new ArrayList<>();
        for (StoreProduct sp : storeProducts) {
            if (sp.getIsAvailable() != null && sp.getIsAvailable()) {
                Product p = sp.getProduct();

                // Override default price with custom price if available
                if (sp.getCustomPrice() != null) {
                    Product pCopy = new Product();
                    // Copy fields
                    pCopy.setInstoreCode(p.getInstoreCode());
                    pCopy.setAdminStoreId(p.getAdminStoreId());
                    pCopy.setBarcode(p.getBarcode());
                    pCopy.setName(p.getName());
                    pCopy.setMilliliters(p.getMilliliters());
                    pCopy.setCategory(p.getCategory());
                    pCopy.setSubCategory(p.getSubCategory());
                    pCopy.setPurchasePrice(p.getPurchasePrice());
                    pCopy.setDefaultPrice(sp.getCustomPrice()); // The crucial override
                    pCopy.setDescription(p.getDescription());
                    pCopy.setImageUrl(p.getImageUrl());
                    pCopy.setFlavor(p.getFlavor());
                    pCopy.setIngredients(p.getIngredients());
                    pCopy.setNicotineStrength(p.getNicotineStrength());
                    pCopy.setColor(p.getColor());
                    pCopy.setBatteryType(p.getBatteryType());
                    pCopy.setWattage(p.getWattage());
                    pCopy.setTankCapacity(p.getTankCapacity());

                    products.add(pCopy);
                } else {
                    products.add(p);
                }
            }
        }

        return ResponseEntity.ok(products);
    }
}
