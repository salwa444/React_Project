
-- SEED DATA FOR TRAINING CENTER MANAGEMENT SYSTEM

USE centre_formation;

-- Adding more Formations
INSERT INTO formations (titre, categorie, nombre_heures, cout, objectifs, programme, ville, publie) VALUES
    ('Data Science avec Python', 'Data', 60, 3500.00, 
     'Maîtriser l\'analyse de données et le Machine Learning', 
     'Python, Pandas, Scikit-Learn, Visualisation de données', 
     'Casablanca', TRUE),
    ('Intelligence Artificielle & Deep Learning', 'IA', 80, 4500.00,
     'Apprendre les réseaux de neurones profonds',
     'TensorFlow, Keras, CNN, RNN, LLMs',
     'Rabat', TRUE),
    ('DevOps & Kubernetes', 'Infrastructure', 45, 3000.00,
     'Automatiser le déploiement et la gestion des conteneurs',
     'Docker, Kubernetes, Jenkins, CI/CD pipelines',
     'Marrakech', TRUE),
    ('Cybersécurité Avancée', 'Sécurité', 50, 3200.00,
     'Sécuriser les infrastructures et détecter les vulnérabilités',
     'Ethical Hacking, Cryptographie, SOC, SIEM',
     'Tanger', TRUE),
    ('Marketing Digital et Stratégie', 'Business', 30, 1800.00,
     'Optimiser la visibilité en ligne et le ROI',
     'SEO, SEA, Social Media, Google Analytics',
     'Agadir', TRUE);

-- Adding more Users (Note: passwords are plain for demo, should be hashed in production)
-- Default password: password123
INSERT INTO users (email, password, nom, prenom, telephone) VALUES 
    ('jean.duval@example.com', 'password123', 'Duval', 'Jean', '0611223344'),
    ('sara.bennani@example.com', 'password123', 'Bennani', 'Sara', '0655667788'),
    ('marc.legrand@example.com', 'password123', 'Legrand', 'Marc', '0622334455'),
    ('fatima.zara@example.com', 'password123', 'Zara', 'Fatima', '0677889900'),
    ('ahmed.alami@example.com', 'password123', 'Alami', 'Ahmed', '0633445566');

-- Assigning roles to these users
-- First, get role IDs (assuming standard IDs from schema.sql)
-- 1: ADMIN, 2: ASSISTANT, 3: FORMATEUR, 4: VISITEUR

-- Jean Duval -> FORMATEUR
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'jean.duval@example.com' AND r.name = 'FORMATEUR';

-- Sara Bennani -> ASSISTANT
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'sara.bennani@example.com' AND r.name = 'ASSISTANT';

-- Marc Legrand -> FORMATEUR
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'marc.legrand@example.com' AND r.name = 'FORMATEUR';

-- Fatima Zara -> VISITEUR
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'fatima.zara@example.com' AND r.name = 'VISITEUR';

-- Ahmed Alami -> ADMIN (Second Admin)
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'ahmed.alami@example.com' AND r.name = 'ADMIN';
