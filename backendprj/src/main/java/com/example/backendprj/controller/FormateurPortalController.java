package com.example.backendprj.controller;

import com.example.backendprj.model.Evaluation;
import com.example.backendprj.model.Formateur;
import com.example.backendprj.model.Planification;
import com.example.backendprj.model.User;
import com.example.backendprj.repository.EvaluationRepository;
import com.example.backendprj.repository.FormateurRepository;
import com.example.backendprj.repository.ParticipantRepository;
import com.example.backendprj.repository.PlanificationRepository;
import com.example.backendprj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/formateur")
@CrossOrigin(origins = "http://localhost:5173")
public class FormateurPortalController {

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private PlanificationRepository planificationRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Formateur> getMyProfile(@RequestParam String email) {
        String cleanEmail = email != null ? email.trim() : "";
        System.out.println("Fetching profile for email: " + cleanEmail);
        
        // Use IgnoreCase to avoid duplicate issues
        Optional<Formateur> formateurOpt = formateurRepository.findByEmailIgnoreCase(cleanEmail);
        
        if (formateurOpt.isPresent()) {
            System.out.println("Formateur found: " + formateurOpt.get());
            if (formateurOpt.get().getMotsCles() == null || formateurOpt.get().getMotsCles().isEmpty()) {
                 System.out.println("WARNING: Formateur found but motsCles is EMPTY/NULL");
            }
            return ResponseEntity.ok(formateurOpt.get());
        }

        System.out.println("Formateur not found (ignore case), checking Users table...");
        // Auto-create formateur if user exists
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("User found, auto-creating formateur for: " + user.getNom());
            Formateur newFormateur = new Formateur();
            newFormateur.setEmail(user.getEmail());
            newFormateur.setNom(user.getNom() + " " + user.getPrenom());
            newFormateur.setTelephone(user.getTelephone());
            newFormateur.setStatut("ACTIF"); // Auto-activate for seamless experience
            newFormateur.setRemarques("Profil généré automatiquement");
            
            return ResponseEntity.ok(formateurRepository.save(newFormateur));
        }

        System.out.println("User not found either.");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<Formateur> updateProfile(@RequestBody Formateur details) {
        return formateurRepository.findByEmailIgnoreCase(details.getEmail().trim()).map(formateur -> {
            formateur.setNom(details.getNom());
            formateur.setTelephone(details.getTelephone());
            formateur.setMotsCles(details.getMotsCles());
            formateur.setRemarques(details.getRemarques());
            return ResponseEntity.ok(formateurRepository.save(formateur));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions")
    public List<Map<String, Object>> getSessions(@RequestParam String email) {
        System.out.println("getSessions called for email: " + email);
        return formateurRepository.findByEmailIgnoreCase(email.trim()).map(formateur -> {
            System.out.println("Formateur found for sessions: " + formateur.getId() + " - " + formateur.getNom());
            List<Planification> plans = planificationRepository.findByFormateur(formateur);
            System.out.println("Number of plans found: " + plans.size());
            return plans.stream().map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", p.getId());
                map.put("formationTitre", p.getFormation().getTitre());
                map.put("dateDebut", p.getDateDebut());
                map.put("dateFin", p.getDateFin());
                map.put("entrepriseNom", p.getEntreprise() != null ? p.getEntreprise().getNom() : "Particuliers");
                map.put("participantCount", participantRepository.countByPlanificationId(p.getId()));
                map.put("lieu", p.getFormation().getVille());
                return map;
            }).collect(Collectors.toList());
        }).orElse(Collections.emptyList());
    }

    @GetMapping("/evaluations")
    public List<Map<String, Object>> getEvaluations(@RequestParam String email) {
        return formateurRepository.findByEmailIgnoreCase(email.trim()).map(formateur -> {
            List<Planification> plans = planificationRepository.findByFormateur(formateur);
            List<Map<String, Object>> result = new ArrayList<>();
            for (Planification p : plans) {
                List<Evaluation> evals = evaluationRepository.findByPlanificationId(p.getId());
                for (Evaluation e : evals) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("planificationId", p.getId());
                    map.put("formationTitre", p.getFormation().getTitre());
                    map.put("entrepriseNom", p.getEntreprise() != null ? p.getEntreprise().getNom() : "Particuliers");
                    map.put("dateSession", p.getDateDebut());
                    map.put("pedagogie", e.getNotePedagogie());
                    map.put("rythme", e.getNoteRythme());
                    map.put("supportCours", e.getNoteSupport());
                    map.put("maitriseSujet", e.getNoteMaitrise());
                    result.add(map);
                }
            }
            return result;
        }).orElse(Collections.emptyList());
    }
}
