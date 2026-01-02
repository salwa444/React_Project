package com.example.backendprj.controller;

import com.example.backendprj.dto.PlanificationDTO;
import com.example.backendprj.model.Planification;
import com.example.backendprj.repository.EntrepriseRepository;
import com.example.backendprj.repository.FormateurRepository;
import com.example.backendprj.repository.FormationRepository;
import com.example.backendprj.repository.PlanificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planifications")
@CrossOrigin(origins = "http://localhost:5173")
public class PlanificationController {

    @Autowired
    private PlanificationRepository planificationRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @GetMapping
    public List<Planification> getAllPlanifications() {
        return planificationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPlanification(@RequestBody PlanificationDTO dto) {
        Planification planification = new Planification();
        return savePlanification(planification, dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Planification> getPlanificationById(@PathVariable Long id) {
        return planificationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlanification(@PathVariable Long id, @RequestBody PlanificationDTO dto) {
        return planificationRepository.findById(id).map(planification -> {
            return savePlanification(planification, dto);
        }).orElse(ResponseEntity.notFound().build());
    }

    private ResponseEntity<?> savePlanification(Planification planification, PlanificationDTO dto) {
        if (dto.getFormationId() != null) {
            formationRepository.findById(dto.getFormationId()).ifPresent(planification::setFormation);
        }
        if (dto.getFormateurId() != null) {
            formateurRepository.findById(dto.getFormateurId()).ifPresent(planification::setFormateur);
        }
        if (dto.getEntrepriseId() != null) {
            entrepriseRepository.findById(dto.getEntrepriseId()).ifPresent(planification::setEntreprise);
        }

        planification.setDateDebut(dto.getDateDebut());
        planification.setDateFin(dto.getDateFin());
        planification.setType(dto.getType());
        planification.setRemarques(dto.getRemarques());

        try {
            Planification saved = planificationRepository.save(planification);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlanification(@PathVariable Long id) {
        return planificationRepository.findById(id).map(planification -> {
            planificationRepository.delete(planification);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
