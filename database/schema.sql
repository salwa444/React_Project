
-- TRAINING CENTER MANAGEMENT SYSTEM


-- Drop existing database if exists
DROP DATABASE IF EXISTS centre_formation;

-- Create database
CREATE DATABASE centre_formation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE centre_formation;


-- ROLES TABLE

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT chk_role_name CHECK (name IN ('ADMIN', 'ASSISTANT', 'FORMATEUR', 'VISITEUR'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USERS TABLE

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    telephone VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- USER_ROLES TABLE (Many-to-Many)

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FORMATIONS TABLE

CREATE TABLE formations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    categorie VARCHAR(100),
    nombre_heures INT,
    cout DECIMAL(10, 2),
    objectifs TEXT,
    programme TEXT,
    ville VARCHAR(100),
    publie BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categorie (categorie),
    INDEX idx_ville (ville),
    INDEX idx_publie (publie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FORMATEURS TABLE

CREATE TABLE formateurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    mots_cles TEXT,
    remarques TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_formateur_statut CHECK (statut IN ('ACTIF', 'EN_ATTENTE', 'INACTIF')),
    INDEX idx_email (email),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ENTREPRISES TABLE

CREATE TABLE entreprises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    url VARCHAR(200),
    email VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PLANIFICATIONS TABLE

CREATE TABLE planifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    formation_id BIGINT NOT NULL,
    formateur_id BIGINT,
    entreprise_id BIGINT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    type VARCHAR(20) NOT NULL,
    remarques TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_planification_type CHECK (type IN ('INDIVIDUEL', 'ENTREPRISE')),
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE SET NULL,
    INDEX idx_formation (formation_id),
    INDEX idx_formateur (formateur_id),
    INDEX idx_entreprise (entreprise_id),
    INDEX idx_dates (date_debut, date_fin),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PARTICIPANTS TABLE

CREATE TABLE participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    ville VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    planification_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (planification_id) REFERENCES planifications(id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_planification (planification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- EVALUATIONS TABLE

CREATE TABLE evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT NOT NULL,
    planification_id BIGINT NOT NULL,
    note_pedagogie INT NOT NULL,
    note_rythme INT NOT NULL,
    note_support INT NOT NULL,
    note_maitrise INT NOT NULL,
    commentaire TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_note_pedagogie CHECK (note_pedagogie BETWEEN 1 AND 5),
    CONSTRAINT chk_note_rythme CHECK (note_rythme BETWEEN 1 AND 5),
    CONSTRAINT chk_note_support CHECK (note_support BETWEEN 1 AND 5),
    CONSTRAINT chk_note_maitrise CHECK (note_maitrise BETWEEN 1 AND 5),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (planification_id) REFERENCES planifications(id) ON DELETE CASCADE,
    INDEX idx_participant (participant_id),
    INDEX idx_planification (planification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Insert roles
INSERT INTO roles (name) VALUES 
    ('ADMIN'),
    ('ASSISTANT'),
    ('FORMATEUR'),
    ('VISITEUR');

-- Insert default admin user (password: admin123)

INSERT INTO users (email, password, nom, prenom, telephone) VALUES 
    ('admin@formation.com', '12345678', 'Admin', 'System', '0600000000');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@formation.com' AND r.name = 'ADMIN';

-- Sample formations
INSERT INTO formations (titre, categorie, nombre_heures, cout, objectifs, programme, ville, publie) VALUES
    ('Formation Java Spring Boot', 'Développement', 40, 2500.00, 
     'Maîtriser le développement d\'applications avec Spring Boot', 
     'Introduction à Spring Boot, Spring Data JPA, Spring Security, REST APIs', 
     'Paris', TRUE),
    ('Formation React Avancé', 'Développement', 35, 2200.00,
     'Développer des applications React modernes',
     'Hooks, Context API, Redux, Performance optimization',
     'Lyon', TRUE),
    ('Gestion de Projet Agile', 'Management', 20, 1500.00,
     'Comprendre et appliquer les méthodes agiles',
     'Scrum, Kanban, Sprint planning, Retrospectives',
     'Paris', TRUE);

-- Sample formateurs
INSERT INTO formateurs (nom, email, telephone, mots_cles, statut) VALUES
    ('Dupont Jean', 'jean.dupont@formation.com', '0601020304', 'Java, Spring, Microservices', 'ACTIF'),
    ('Martin Sophie', 'sophie.martin@formation.com', '0605060708', 'React, JavaScript, Frontend', 'ACTIF'),
    ('Bernard Pierre', 'pierre.bernard@formation.com', '0609101112', 'Agile, Scrum, Management', 'ACTIF');

-- Sample entreprises
INSERT INTO entreprises (nom, adresse, telephone, email, url) VALUES
    ('TechCorp SA', '123 Avenue des Champs-Élysées, 75008 Paris', '0140000000', 'contact@techcorp.fr', 'https://techcorp.fr'),
    ('InnoSoft SARL', '45 Rue de la République, 69002 Lyon', '0478000000', 'info@innosoft.fr', 'https://innosoft.fr');

-- ====================================
-- VIEWS FOR REPORTING (Optional)
-- ====================================

-- View for formation statistics
CREATE VIEW v_formation_stats AS
SELECT 
    f.id,
    f.titre,
    f.categorie,
    f.ville,
    COUNT(DISTINCT p.id) as nombre_planifications,
    COUNT(DISTINCT part.id) as nombre_participants
FROM formations f
LEFT JOIN planifications p ON f.id = p.formation_id
LEFT JOIN participants part ON p.id = part.planification_id
GROUP BY f.id, f.titre, f.categorie, f.ville;

-- View for formateur evaluations
CREATE VIEW v_formateur_evaluations AS
SELECT 
    fmt.id as formateur_id,
    fmt.nom as formateur_nom,
    COUNT(e.id) as nombre_evaluations,
    AVG(e.note_pedagogie) as moy_pedagogie,
    AVG(e.note_rythme) as moy_rythme,
    AVG(e.note_support) as moy_support,
    AVG(e.note_maitrise) as moy_maitrise,
    AVG((e.note_pedagogie + e.note_rythme + e.note_support + e.note_maitrise) / 4.0) as moyenne_generale
FROM formateurs fmt
LEFT JOIN planifications p ON fmt.id = p.formateur_id
LEFT JOIN evaluations e ON p.id = e.planification_id
GROUP BY fmt.id, fmt.nom;

-- ====================================
-- END OF SCHEMA
-- ====================================
