package com.example.backendprj.controller;

import com.example.backendprj.model.Role;
import com.example.backendprj.model.User;
import com.example.backendprj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (plaintext for now as requested for the demo)
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Connexion réussie");
                response.put("email", user.getEmail());
                
                // Extract role (take the first one or default to visitor)
                String roleName = "visitor";
                if (!user.getRoles().isEmpty()) {
                    Role role = user.getRoles().iterator().next();
                    roleName = role.getName().toLowerCase();
                }
                response.put("role", roleName);
                
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Email ou mot de passe incorrect.");
    }
}
