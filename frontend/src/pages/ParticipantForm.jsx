import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const ParticipantForm = () => {
    const { formationId } = useParams();
    const navigate = useNavigate();
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Initial state with formationId from URL
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '',
        ville: '',
        email: '',
        telephone: '',
        formationId: formationId && formationId !== '0' ? parseInt(formationId) : ''
    });

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            console.log('Chargement des formations...');
            const response = await axiosInstance.get('/formations');
            setFormations(response.data);
            console.log('Formations chargées avec succès:', response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des formations:', err);
            setMessage({
                type: 'danger',
                text: 'Impossible de charger la liste des formations. Vérifiez que le backend est lancé.'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'formationId' ? (value ? parseInt(value) : '') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validation simple
        if (!formData.formationId) {
            setMessage({ type: 'danger', text: 'Veuillez sélectionner une formation.' });
            setLoading(false);
            return;
        }

        try {
            console.log("Tentative d'inscription avec les données:", formData);

            // Note: Si le backend attend 'planificationId', il faudra peut-être adapter ici.
            // Mais nous suivons l'objectif de corriger le frontend.
            const response = await axiosInstance.post('/participants', formData);

            console.log("Réponse de l'API:", response.data);

            setMessage({
                type: 'success',
                text: 'Inscription réussie ! Vous allez être redirigé vers l\'accueil.'
            });

            // Redirection après 3 secondes
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            console.error("Détails de l'erreur API:", err.response || err);

            const errorMsg = err.response?.data?.message
                || err.response?.data
                || "Erreur lors de l'inscription. L'endpoint /api/participants est-il prêt ?";

            setMessage({
                type: 'danger',
                text: `Échec de l'inscription : ${errorMsg}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-lg border-0 overflow-hidden">
                        <div className="card-header bg-primary text-white py-3 text-center">
                            <h3 className="mb-0 fs-4 fw-bold">
                                <i className="bi bi-person-check-fill me-2"></i>
                                Inscription Participant
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert alert-${message.type} shadow-sm border-0 fade show`} role="alert">
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Nom</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            placeholder="Votre nom"
                                            required
                                            value={formData.nom}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Prénom</label>
                                        <input
                                            type="text"
                                            name="prenom"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            placeholder="Votre prénom"
                                            required
                                            value={formData.prenom}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Date de naissance</label>
                                        <input
                                            type="date"
                                            name="dateNaissance"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            required
                                            value={formData.dateNaissance}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Ville</label>
                                        <input
                                            type="text"
                                            name="ville"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            placeholder="Votre ville de résidence"
                                            required
                                            value={formData.ville}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            placeholder="exemple@email.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Téléphone</label>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            className="form-control rounded-pill border-0 shadow-sm bg-light"
                                            placeholder="Votre numéro de téléphone"
                                            required
                                            value={formData.telephone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Choisir une formation</label>
                                        <select
                                            name="formationId"
                                            className="form-select rounded-pill border-0 shadow-sm bg-light"
                                            required
                                            value={formData.formationId}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Sélectionnez une formation --</option>
                                            {formations.map(f => (
                                                <option key={f.id} value={f.id}>{f.titre} - {f.ville}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 rounded-pill shadow-sm d-flex align-items-center justify-content-center fw-bold transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-send-fill me-2"></i>
                                                    Confirmer l'inscription
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer bg-light py-3 text-center border-0">
                            <button onClick={() => navigate('/')} className="btn btn-link btn-sm text-decoration-none text-muted">
                                <i className="bi bi-arrow-left me-1"></i> Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantForm;
