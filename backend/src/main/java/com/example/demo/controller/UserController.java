package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getUsers(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || !"MASTER".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User newUser, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || !"MASTER".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return ResponseEntity.ok(userRepository.save(newUser));
    }
}
