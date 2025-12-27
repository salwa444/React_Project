package com.example.backendprj.controller;

import com.example.backendprj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private FormateurRepository formateurRepository;
    
    @Autowired
    private EntrepriseRepository entrepriseRepository;
    
    @Autowired
    private ParticipantRepository participantRepository;

    @GetMapping
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("formations", formationRepository.count());
        stats.put("formateurs", formateurRepository.count());
        stats.put("entreprises", entrepriseRepository.count());
        stats.put("participants", participantRepository.count());
        return stats;
    }
}
