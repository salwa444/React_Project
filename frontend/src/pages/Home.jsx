import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import FormationCard from '../components/FormationCard';

const Home = () => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        categorie: '',
        ville: '',
        date: ''
    });

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/formations');
            setFormations(response.data);
            setFilteredFormations(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des formations. Assurez-vous que le backend est lancé.');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        let result = formations;

        if (filters.categorie) {
            result = result.filter(f => f.categorie.toLowerCase().includes(filters.categorie.toLowerCase()));
        }

        if (filters.ville) {
            result = result.filter(f => f.ville.toLowerCase().includes(filters.ville.toLowerCase()));
        }

        if (filters.date) {
            result = result.filter(f => f.date_debut >= filters.date);
        }

        setFilteredFormations(result);
    }, [filters, formations]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-4 pb-5">
            <div className="row mb-5">
                <div className="col-12 text-center mb-4">
                    <h1 className="display-4 fw-bold">Nos Formations</h1>
                    <p className="lead text-muted">Découvrez nos programmes de formation de haute qualité</p>
                </div>

                {/* Filters */}
                <div className="col-12 mb-4">
                    <div className="card shadow-sm border-0 p-3 bg-light">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Catégorie</label>
                                <input
                                    type="text"
                                    name="categorie"
                                    className="form-control rounded-pill border-0 shadow-sm"
                                    placeholder="Filtrer par catégorie..."
                                    value={filters.categorie}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">Ville</label>
                                <input
                                    type="text"
                                    name="ville"
                                    className="form-control rounded-pill border-0 shadow-sm"
                                    placeholder="Filtrer par ville..."
                                    value={filters.ville}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-uppercase">À partir de la date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control rounded-pill border-0 shadow-sm"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="alert alert-danger shadow-sm border-0 mb-5">{error}</div>
            ) : (
                <div className="row">
                    {filteredFormations.length > 0 ? (
                        filteredFormations.map(formation => (
                            <FormationCard key={formation.id} formation={formation} />
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-search display-1 text-muted opacity-25"></i>
                            <p className="mt-3 fs-5 text-muted">Aucune formation ne correspond à vos critères.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
