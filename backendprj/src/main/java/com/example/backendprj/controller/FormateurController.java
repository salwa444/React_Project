package com.example.backendprj.controller;

import com.example.backendprj.model.Formateur;
import com.example.backendprj.repository.FormateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/formateurs")
@CrossOrigin(origins = "http://localhost:5173")
public class FormateurController {

    @Autowired
    private FormateurRepository formateurRepository;

    @GetMapping
    public List<Formateur> getAllFormateurs() {
        return formateurRepository.findAll();
    }

    @PostMapping
    public Formateur createFormateur(@RequestBody Formateur formateur) {
        return formateurRepository.save(formateur);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerFormateur(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (formateurRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Cet email est déjà enregistré comme formateur.");
        }

        Formateur f = new Formateur();
        f.setNom(payload.get("nomComplet"));
        f.setEmail(email);
        f.setMotsCles(payload.get("competences"));
        f.setRemarques(payload.get("remarques"));
        f.setStatut("EN_ATTENTE"); // Default status
        
        return ResponseEntity.ok(formateurRepository.save(f));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formateur> getFormateurById(@PathVariable Long id) {
        return formateurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formateur> updateFormateur(@PathVariable Long id, @RequestBody Formateur details) {
        return formateurRepository.findById(id).map(formateur -> {
            formateur.setNom(details.getNom());
            formateur.setEmail(details.getEmail());
            formateur.setTelephone(details.getTelephone());
            formateur.setMotsCles(details.getMotsCles());
            formateur.setRemarques(details.getRemarques());
            formateur.setStatut(details.getStatut());
            return ResponseEntity.ok(formateurRepository.save(formateur));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFormateur(@PathVariable Long id) {
        return formateurRepository.findById(id).map(formateur -> {
            formateurRepository.delete(formateur);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
