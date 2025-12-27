package com.example.backendprj.controller;

import com.example.backendprj.model.Formation;
import com.example.backendprj.repository.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/formations")
@CrossOrigin(origins = "http://localhost:5173")
public class FormationController {

    @Autowired
    private FormationRepository formationRepository;

    @GetMapping
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @PostMapping
    public Formation createFormation(@RequestBody Formation formation) {
        return formationRepository.save(formation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return formationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation details) {
        return formationRepository.findById(id).map(formation -> {
            formation.setTitre(details.getTitre());
            formation.setCategorie(details.getCategorie());
            formation.setNombreHeures(details.getNombreHeures());
            formation.setCout(details.getCout());
            formation.setObjectifs(details.getObjectifs());
            formation.setProgramme(details.getProgramme());
            formation.setVille(details.getVille());
            formation.setPublie(details.isPublie());
            return ResponseEntity.ok(formationRepository.save(formation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFormation(@PathVariable Long id) {
        return formationRepository.findById(id).map(formation -> {
            formationRepository.delete(formation);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
