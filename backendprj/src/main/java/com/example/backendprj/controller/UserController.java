package com.example.backendprj.controller;

import com.example.backendprj.model.Role;
import com.example.backendprj.model.User;
import com.example.backendprj.repository.RoleRepository;
import com.example.backendprj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> payload) {
        if (userRepository.findByEmail((String) payload.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé.");
        }

        User user = new User();
        user.setEmail((String) payload.get("email"));
        user.setPassword((String) payload.get("password")); // Should be encoded in real app
        user.setNom((String) payload.get("nom"));
        user.setPrenom((String) payload.get("prenom"));
        user.setTelephone((String) payload.get("telephone"));

        String roleName = (String) payload.getOrDefault("role", "VISITOR");
        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role(null, roleName.toUpperCase())));

        user.setRoles(new HashSet<>(Collections.singletonList(role)));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return userRepository.findById(id).map(user -> {
            user.setEmail((String) payload.get("email"));
            user.setNom((String) payload.get("nom"));
            user.setPrenom((String) payload.get("prenom"));
            user.setTelephone((String) payload.get("telephone"));
            
            // Only update password if provided and not empty
            String newPassword = (String) payload.get("password");
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setPassword(newPassword);
            }

            String roleName = (String) payload.getOrDefault("role", "VISITOR");
            Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role(null, roleName.toUpperCase())));
            user.setRoles(new HashSet<>(Collections.singletonList(role)));

            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
