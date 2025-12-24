package com.example.backendprj.repository;

import com.example.backendprj.model.Planification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanificationRepository extends JpaRepository<Planification, Long> {
    List<Planification> findByFormationId(Long formationId);
}
