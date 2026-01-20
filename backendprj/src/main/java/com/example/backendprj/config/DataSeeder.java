package com.example.backendprj.config;

import com.example.backendprj.model.Formation;
import com.example.backendprj.repository.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private FormationRepository formationRepository;

    public void run(String... args) throws Exception {
        // Increase threshold to ensure seeding happens even if some data exists
        if (formationRepository.count() < 20) {
            System.out.println("Seeding database with initial formations...");

            List<Formation> formations = Arrays.asList(
                new Formation(null, "React.js pour Débutants", "Développement", 35, new BigDecimal("120.00"), "Maîtrisez les bases de React et Redux.", "Programme complet React", "Paris", true, null, null),
                new Formation(null, "Spring Boot Masterclass", "Développement", 40, new BigDecimal("150.00"), "Devenez expert en backend avec Spring Boot et Java.", "Architecture Microservices", "Lyon", true, null, null),
                new Formation(null, "UI/UX Design Avancé", "Design", 25, new BigDecimal("200.00"), "Concevez des interfaces utilisateurs modernes et intuitives.", "Figma & Adobe XD", "Bordeaux", true, null, null),
                new Formation(null, "Stratégie Marketing Digital", "Marketing", 20, new BigDecimal("99.90"), "Apprenez à booster votre marque sur les réseaux sociaux.", "SEO, SEA, Social Media", "Lille", true, null, null),
                new Formation(null, "Gestion de Projet Agile", "Business", 30, new BigDecimal("180.00"), "Méthodologies Scrum et Kanban pour chefs de projet.", "Certification Scrum Master", "Marseille", true, null, null),
                new Formation(null, "Introduction à la Data Science", "Data Science", 45, new BigDecimal("250.00"), "Analysez des données avec Python et Pandas.", "Python, Pandas, Matplotlib", "Nantes", true, null, null),
                new Formation(null, "Développement Mobile Flutter", "Développement", 50, new BigDecimal("130.00"), "Créez des apps iOS et Android avec une seule base de code.", "Dart & Flutter", "Toulouse", true, null, null),
                new Formation(null, "Photoshop & Illustrator", "Design", 28, new BigDecimal("110.00"), "Maîtrisez les outils de création graphique.", "Suite Adobe", "Nice", true, null, null),
                new Formation(null, "SEO & Content Marketing", "Marketing", 15, new BigDecimal("85.00"), "Optimisez votre référencement naturel.", "Rédaction web & Audit SEO", "Strasbourg", true, null, null),
                new Formation(null, "Entrepreneuriat : Start-up", "Business", 60, new BigDecimal("300.00"), "De l'idée au business plan concret.", "Business Model Canvas", "Rennes", true, null, null)
            );

            formationRepository.saveAll(formations);
            System.out.println("Database seeded with " + formations.size() + " formations.");
        } else {
            System.out.println("Database already contains formations. Skipping seed.");
        }
    }
}
