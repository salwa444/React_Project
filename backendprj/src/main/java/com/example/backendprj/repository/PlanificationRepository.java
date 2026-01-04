package com.example.backendprj.repository;

import com.example.backendprj.model.Formateur;
import com.example.backendprj.model.Planification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlanificationRepository extends JpaRepository<Planification, Long> {
    List<Planification> findByFormationId(Long formationId);
    
    // Changed from findByFormateurId to findByFormateur to rely on entity mapping
    List<Planification> findByFormateur(Formateur formateur);
    
    // Also updating this to use entity if needed, or proper nested property syntax
    List<Planification> findByFormateur_IdAndDateDebutGreaterThanEqual(Long formateurId, LocalDate date);
}
