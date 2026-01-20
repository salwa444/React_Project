import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import '../Visitor.css';

const Home = () => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [filters, setFilters] = useState({
        categorie: ''
    });

    // Mock data fallback
    const mockFormations = [
        { id: 101, title: 'Formation Web Web', category: 'Développement', price: 109.90, desc: 'Apprenez les bases du web modern.', featured: false },
        { id: 102, title: 'Développement Backend Agile', category: 'Développement', price: 145.90, desc: 'Maîtrisez Java et Spring.', featured: false },
        { id: 103, title: 'Formation Dusit Sedialite', category: 'Design', price: 509.93, desc: 'UI/UX Design Avancé.', featured: true },
        { id: 104, title: 'Gestion de Projet Digital', category: 'Management', price: 89.90, desc: 'Certifiez vos compétences.', featured: false },
        { id: 105, title: 'Marketing Terawet', category: 'Marketing', price: 50.90, desc: 'Stratégies de croissance.', featured: false },
        { id: 106, title: 'Data Science Basics', category: 'Data', price: 200.00, desc: 'Introduction à la data.', featured: false },
    ];

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/formations');
            // If API returns empty array, use mock data for demo purposes so UI is not empty
            const data = (response.data && response.data.length > 0) ? response.data : mockFormations;
            setFormations(data);
            setFilteredFormations(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setFormations(mockFormations);
            setLoading(false);
        }
    };

    // Advanced Filtering Logic
    useEffect(() => {
        let result = formations;

        // 1. Search Term (Global search on title/desc)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(f =>
                (f.titre || f.title || f.sujet || '').toLowerCase().includes(lowerTerm) ||
                (f.objectifs || f.desc || f.description || '').toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Category (from Tags or Input)
        if (activeCategory !== 'Tous') {
            // Strict match for tags
            result = result.filter(f => (f.category || f.categorie || '').toLowerCase() === activeCategory.toLowerCase());
        } else if (filters.categorie) {
            // Partial match for manual input
            result = result.filter(f => (f.category || f.categorie || '').toLowerCase().includes(filters.categorie.toLowerCase()));
        }

        setFilteredFormations(result);
    }, [searchTerm, activeCategory, filters, formations]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryInput = (e) => {
        setFilters(prev => ({ ...prev, categorie: e.target.value }));
        setActiveCategory('Tous'); // Reset pill if typing manually
    };

    const handleTagClick = (tag) => {
        setActiveCategory(tag);
        setFilters(prev => ({ ...prev, categorie: '' })); // Clear manual input
    };

    const tags = ["Tous", "Design", "Développement", "Marketing", "Business", "Data Science"];

    return (
        <div className="visitor-content">
            {/* Hero Section */}
            <section className="hero-section container">
                <div className="hero-bg-shape"></div>
                <div className="hero-bg-shape-2"></div>

                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <h1 className="hero-title">
                            Explorez Votre Avenir <br />
                            <span style={{ color: '#2563eb' }}>Numérique</span>
                        </h1>
                        <p className="hero-subtitle">
                            Trouvez la formation parfaite pour booster votre carrière. Des cours experts, flexibles et certifiants.
                        </p>

                        {/* Search Bar */}
                        <div className="search-container">
                            <div className="search-input-group">
                                <i className="bi bi-search me-2"></i>
                                <input
                                    type="text"
                                    className="search-field"
                                    placeholder="Qu'aimeriez-vous apprendre ?"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="search-input-group d-none d-md-flex">
                                <i className="bi bi-grid me-2"></i>
                                <input
                                    type="text"
                                    className="search-field"
                                    placeholder="Catégorie"
                                    value={filters.categorie}
                                    onChange={handleCategoryInput}
                                />
                            </div>
                            <button className="search-btn">Rechercher</button>
                        </div>

                        {/* Tags */}
                        <div className="tags-scroll">
                            {tags.map((tag, idx) => (
                                <button
                                    key={idx}
                                    className={`tag-pill ${activeCategory === tag ? 'active' : ''}`}
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold text-white">Formations Populaires ({filteredFormations.length})</h3>

                </div>

                <div className="course-grid">
                    {filteredFormations.length > 0 ? (
                        filteredFormations.map((f) => (
                            <div key={f.id} className={`course-card ${f.featured ? 'featured' : ''}`}>
                                <div className="course-header">
                                    <h4 className="course-title">{f.titre || f.title || 'Titre non disponible'}</h4>
                                    <div className="course-icon">
                                        <i className="bi bi-bookmark-fill"></i>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="course-badge mb-0">{f.categorie || f.category || 'Formation'}</span>
                                        <div className="course-price" style={{ fontSize: '1.1rem', color: '#d64374' }}>
                                            {f.cout || f.price || f.prix || '45.00'} €
                                        </div>
                                    </div>
                                    <div className="rating">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-half"></i>
                                        <span className="text-secondary ms-1 small" style={{ color: f.featured ? '#cbd5e1' : '' }}>(4.8)</span>
                                    </div>
                                </div>

                                <p className="text-muted small mt-2 mb-4" style={{ color: f.featured ? '#94a3b8' : '' }}>
                                    {f.objectifs || f.desc || f.description || 'Une formation complète pour maîtriser les compétences clés.'}
                                </p>

                                <div className="course-footer">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-fill text-muted" style={{ color: f.featured ? '#94a3b8' : '' }}></i>
                                        <span className="small text-muted" style={{ color: f.featured ? '#94a3b8' : '' }}>{f.nombreHeures || 0}h</span>
                                        {f.ville && (
                                            <>
                                                <span className="text-muted mx-1">•</span>
                                                <i className="bi bi-geo-alt-fill text-muted" style={{ color: f.featured ? '#94a3b8' : '' }}></i>
                                                <span className="small text-muted" style={{ color: f.featured ? '#94a3b8' : '' }}>{f.ville}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <Link to={`/inscription/${f.id}`} className="btn-enroll">
                                            S'inscrire
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-white py-5">
                            <i className="bi bi-emoji-frown display-1 opacity-50"></i>
                            <p className="mt-3">Aucune formation trouvée pour cette recherche.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
