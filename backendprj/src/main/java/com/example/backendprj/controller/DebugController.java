package com.example.backendprj.controller;

import com.example.backendprj.model.Formateur;
import com.example.backendprj.model.Planification;
import com.example.backendprj.repository.FormateurRepository;
import com.example.backendprj.repository.PlanificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private PlanificationRepository planificationRepository;

    @GetMapping("/inspect")
    public String inspect() {
        StringBuilder sb = new StringBuilder();

        sb.append("=== FORMATEURS ===\n");
        List<Formateur> formateurs = formateurRepository.findAll();
        for (Formateur f : formateurs) {
            sb.append(String.format("ID: %d | Nom: %s | Email: '%s' | MotsCles: %s\n", 
                f.getId(), f.getNom(), f.getEmail(), f.getMotsCles()));
        }

        sb.append("\n=== PLANIFICATIONS ===\n");
        List<Planification> plans = planificationRepository.findAll();
        for (Planification p : plans) {
            String fInfo = p.getFormateur() != null 
                ? String.format("ID: %d (%s)", p.getFormateur().getId(), p.getFormateur().getNom()) 
                : "NULL";
            sb.append(String.format("Plan ID: %d | Formation: %s | Formateur: %s\n", 
                p.getId(), p.getFormation().getTitre(), fInfo));
        }

        return sb.toString();
    }
}
