package com.example.backendprj.controller;

import com.example.backendprj.model.Planification;
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

    @GetMapping
    public List<Planification> getAllPlanifications() {
        return planificationRepository.findAll();
    }

    @PostMapping
    public Planification createPlanification(@RequestBody Planification planification) {
        return planificationRepository.save(planification);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Planification> getPlanificationById(@PathVariable Long id) {
        return planificationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Planification> updatePlanification(@PathVariable Long id, @RequestBody Planification details) {
        return planificationRepository.findById(id).map(planification -> {
            planification.setFormation(details.getFormation());
            planification.setFormateur(details.getFormateur());
            planification.setEntreprise(details.getEntreprise());
            planification.setDateDebut(details.getDateDebut());
            planification.setDateFin(details.getDateFin());
            planification.setType(details.getType());
            planification.setRemarques(details.getRemarques());
            return ResponseEntity.ok(planificationRepository.save(planification));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlanification(@PathVariable Long id) {
        return planificationRepository.findById(id).map(planification -> {
            planificationRepository.delete(planification);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
