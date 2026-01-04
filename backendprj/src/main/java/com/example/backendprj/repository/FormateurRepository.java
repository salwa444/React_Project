package com.example.backendprj.repository;

import com.example.backendprj.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    Optional<Formateur> findByEmail(String email);
    Optional<Formateur> findByEmailIgnoreCase(String email);
}
