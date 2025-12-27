package com.example.backendprj.controller;

import com.example.backendprj.model.Entreprise;
import com.example.backendprj.repository.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entreprises")
@CrossOrigin(origins = "http://localhost:5173")
public class EntrepriseController {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @GetMapping
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    @PostMapping
    public Entreprise createEntreprise(@RequestBody Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable Long id) {
        return entrepriseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entreprise> updateEntreprise(@PathVariable Long id, @RequestBody Entreprise details) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            entreprise.setNom(details.getNom());
            entreprise.setAdresse(details.getAdresse());
            entreprise.setTelephone(details.getTelephone());
            entreprise.setUrl(details.getUrl());
            entreprise.setEmail(details.getEmail());
            return ResponseEntity.ok(entrepriseRepository.save(entreprise));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntreprise(@PathVariable Long id) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            entrepriseRepository.delete(entreprise);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
