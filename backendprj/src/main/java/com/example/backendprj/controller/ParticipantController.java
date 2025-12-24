package com.example.backendprj.controller;

import com.example.backendprj.model.Formation;
import com.example.backendprj.model.Participant;
import com.example.backendprj.model.Planification;
import com.example.backendprj.repository.FormationRepository;
import com.example.backendprj.repository.ParticipantRepository;
import com.example.backendprj.repository.PlanificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/participants")
public class ParticipantController {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private PlanificationRepository planificationRepository;

    @Autowired
    private FormationRepository formationRepository;

    @PostMapping
    public ResponseEntity<?> registerParticipant(@RequestBody Map<String, Object> payload) {
        try {
            Long formationId = Long.valueOf(payload.get("formationId").toString());
            
            // Trouver une planification pour cette formation ou en créer une par défaut
            List<Planification> existingPlanifications = planificationRepository.findByFormationId(formationId);
            Planification planification;
            
            if (existingPlanifications.isEmpty()) {
                // Créer une planification fictive pour permettre l'inscription
                Formation formation = formationRepository.findById(formationId)
                        .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
                
                planification = new Planification();
                planification.setFormation(formation);
                planification.setDateDebut(LocalDate.now().plusDays(7));
                planification.setDateFin(LocalDate.now().plusDays(12));
                planification.setType("INDIVIDUEL");
                planification = planificationRepository.save(planification);
            } else {
                planification = existingPlanifications.get(0);
            }

            Participant participant = new Participant();
            participant.setNom(payload.get("nom").toString());
            participant.setPrenom(payload.get("prenom").toString());
            participant.setEmail(payload.get("email").toString());
            participant.setTelephone(payload.get("telephone").toString());
            participant.setVille(payload.get("ville").toString());
            
            if (payload.get("dateNaissance") != null) {
                participant.setDateNaissance(LocalDate.parse(payload.get("dateNaissance").toString()));
            }
            
            participant.setPlanification(planification);
            
            Participant saved = participantRepository.save(participant);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}
