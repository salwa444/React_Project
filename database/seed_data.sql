
USE centre_formation;

-- Désactiver les vérifications de clés étrangères pour permettre les TRUNCATE/DELETE
SET FOREIGN_KEY_CHECKS = 0;

-- =======================================================
-- 1. NETTOYAGE
-- =======================================================
DELETE FROM evaluations;
ALTER TABLE evaluations AUTO_INCREMENT = 1;

DELETE FROM participants;
ALTER TABLE participants AUTO_INCREMENT = 1;

DELETE FROM planifications;
ALTER TABLE planifications AUTO_INCREMENT = 1;

-- Pour les tables qui ont des données initiales dans schema.sql, on supprime seulement les ajouts
DELETE FROM entreprises WHERE id > 2; 
DELETE FROM formateurs WHERE id > 3; 
DELETE FROM user_roles WHERE user_id > 1;
DELETE FROM users WHERE id > 1;

-- On remet l'AUTO_INCREMENT à une valeur correcte pour éviter les trous si possible, 
-- mais le plus sûr est de forcer les IDs pour les nouvelles insertions référencées.

-- =======================================================
-- 2. UTILISATEURS & ROLES
-- =======================================================
INSERT INTO users (id, email, password, nom, prenom, telephone) VALUES 
(2, 'jean.duval@test.com', 'password123', 'Duval', 'Jean', '0611223344'),
(3, 'sara.bennani@test.com', 'password123', 'Bennani', 'Sara', '0655667788'),
(4, 'marc.legrand@test.com', 'password123', 'Legrand', 'Marc', '0622334455'),
(5, 'fatima.zara@test.com', 'password123', 'Zara', 'Fatima', '0677889900'),
(6, 'ahmed.alami@test.com', 'password123', 'Alami', 'Ahmed', '0633445566'),
(7, 'sofia.elamrani@test.com', 'password123', 'El Amrani', 'Sofia', '0688997766'),
(8, 'karim.idrissi@test.com', 'password123', 'Idrissi', 'Karim', '0612345678'),
(9, 'nadia.mansouri@test.com', 'password123', 'Mansouri', 'Nadia', '0698765432');

-- Attribution des rôles
-- Utilisations de sous-requêtes pour les IDs de rôles (car standards) mais IDs users explicites
INSERT INTO user_roles (user_id, role_id) VALUES 
(2, (SELECT id FROM roles WHERE name = 'FORMATEUR')),
(3, (SELECT id FROM roles WHERE name = 'ASSISTANT')),
(4, (SELECT id FROM roles WHERE name = 'FORMATEUR')),
(5, (SELECT id FROM roles WHERE name = 'VISITEUR')),
(6, (SELECT id FROM roles WHERE name = 'ADMIN')),
(7, (SELECT id FROM roles WHERE name = 'VISITEUR')),
(8, (SELECT id FROM roles WHERE name = 'FORMATEUR'));


-- =======================================================
-- 3. FORMATEURS SUPPLÉMENTAIRES (Forcage IDs 4+)
-- =======================================================
INSERT INTO formateurs (id, nom, email, telephone, mots_cles, statut) VALUES
(4, 'El Amrani Sofia', 'sofia.formateur@test.com', '0688997766', 'Marketing, SEO, Digital', 'ACTIF'),
(5, 'Idrissi Karim', 'karim.formateur@test.com', '0612345678', 'DevOps, Docker, Kubernetes', 'ACTIF'),
(6, 'Mansouri Nadia', 'nadia.formateur@test.com', '0698765432', 'Management, Agile, Scrum', 'ACTIF'),
(7, 'Benali Youssef', 'youssef.benali@test.com', '0655443322', 'Sécurité, Cyber, Hacking', 'EN_ATTENTE'),
(8, 'Chraibi Houda', 'houda.chraibi@test.com', '0644332211', 'Data, Python, SQL', 'ACTIF');


-- =======================================================
-- 4. ENTREPRISES SUPPLÉMENTAIRES (Forcage IDs 3+)
-- =======================================================
INSERT INTO entreprises (id, nom, adresse, telephone, email, url) VALUES
(3, 'Maroc Digital Center', 'Technopark, Casablanca', '0522000000', 'contact@mdc.ma', 'https://mdc.ma'),
(4, 'Atlas Services', 'Avenue Mohamed V, Rabat', '0537000000', 'rh@atlas-services.ma', 'https://atlas-services.ma'),
(5, 'Orange Business', 'Casanearshore, Casablanca', '0522111111', 'contact@orange-business.ma', 'https://orange.ma'),
(6, 'Capgemini Maroc', 'Shore 1, Casanearshore', '0522222222', 'recrutement@capgemini.ma', 'https://capgemini.com'),
(7, 'DXC Technology', 'Technopolis, Rabat', '0537333333', 'info@dxc.ma', 'https://dxc.com');


-- =======================================================
-- 5. PLANIFICATIONS (Forcage IDs 1+)
-- =======================================================
-- Formation IDs 1,2,3 existent dans schema.sql
-- Formateur IDs 1,2,3 existent dans schema.sql, 4,5,6... ajoutés ci-dessus
-- Entreprise IDs 1,2 existent dans schema.sql, 3,4,5... ajoutés ci-dessus

INSERT INTO planifications (id, formation_id, formateur_id, entreprise_id, date_debut, date_fin, type, remarques) VALUES
(1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 60 DAY), DATE_SUB(CURDATE(), INTERVAL 55 DAY), 'ENTREPRISE', 'Session intensive pour TechCorp'),
(2, 2, 2, NULL, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 26 DAY), 'INDIVIDUEL', 'Session ouverte au public'),
(3, 3, 3, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'ENTREPRISE', 'Formation Scrum Master pour InnoSoft'),
(4, 1, 1, NULL, DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'INDIVIDUEL', 'Bootcamp Java Printemps'),
(5, 2, 5, 5, DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'ENTREPRISE', 'Formation React pour DXC'); -- Idrissi Karim (ID 5) / Orange (ID 5)


-- =======================================================
-- 6. INSCRIPTIONS (PARTICIPANTS)
-- =======================================================

INSERT INTO participants (id, nom, prenom, email, telephone, ville, planification_id, created_at) VALUES
(1, 'Hakimi', 'Achraf', 'achraf.hakimi@email.com', '0600112233', 'Paris', 1, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(2, 'Ziyech', 'Hakim', 'hakim.ziyech@email.com', '0600445566', 'London', 1, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(3, 'Bounou', 'Yassine', 'yassine.bounou@email.com', '0600778899', 'Seville', 1, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(4, 'Saiss', 'Romain', 'romain.saiss@email.com', '0611223344', 'Wolverhampton', 2, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(5, 'Amrabat', 'Sofyan', 'sofyan.amrabat@email.com', '0611556677', 'Florence', 2, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(6, 'Boufal', 'Sofiane', 'sofiane.boufal@email.com', '0611889900', 'Angers', 2, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(7, 'Ounahi', 'Azzedine', 'azzedine.ounahi@email.com', '0611001122', 'Marseille', 2, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(8, 'Aguerd', 'Nayef', 'nayef.aguerd@email.com', '0622334455', 'Rennes', 3, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(9, 'Mazraoui', 'Noussair', 'noussair.mazraoui@email.com', '0622667788', 'Munich', 3, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(10, 'En-Nesyri', 'Youssef', 'youssef.ennesyri@email.com', '0633445566', 'Seville', 4, CURDATE());


-- =======================================================
-- 7. ÉVALUATIONS
-- =======================================================
INSERT INTO evaluations (participant_id, planification_id, note_pedagogie, note_rythme, note_support, note_maitrise, commentaire) VALUES
(1, 1, 5, 4, 5, 5, 'Excellente formation, très complète.'),
(2, 1, 4, 5, 4, 5, 'Très bon formateur, mais rythme un peu rapide.'),
(3, 1, 5, 5, 5, 5, 'Parfait, rien à redire.'),
(4, 2, 3, 3, 4, 4, 'Bonne introduction mais manque de pratique.'),
(5, 2, 5, 4, 5, 5, 'J''ai beaucoup appris, merci !');

-- Réactiver les vérifications
SET FOREIGN_KEY_CHECKS = 1;
