package com.example.demo.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String role;
    private Long adminStoreId;
    private Long storeId;
}