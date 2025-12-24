import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const TrainerForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        nomComplet: '',
        email: '',
        competences: '',
        remarques: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/formateurs/register', formData);
            setMessage({ type: 'success', text: 'Demande envoyée avec succès ! Notre équipe reviendra vers vous.' });
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setMessage({ type: 'danger', text: "Erreur lors de l'envoi. Veuillez réessayer." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow border-0 overflow-hidden">
                        <div className="card-header bg-info text-dark py-3">
                            <h3 className="mb-0 fs-4 fw-bold">Devenir Formateur</h3>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert alert-${message.type} shadow-sm border-0`} role="alert">
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Nom complet</label>
                                    <input
                                        type="text"
                                        name="nomComplet"
                                        className="form-control rounded-pill border-0 shadow-sm bg-light"
                                        required
                                        value={formData.nomComplet}
                                        onChange={handleChange}
                                        placeholder="Ex: Mohammed Alami"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Email professionnel</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control rounded-pill border-0 shadow-sm bg-light"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="exemple@professionnel.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Mots clés de compétences</label>
                                    <input
                                        type="text"
                                        name="competences"
                                        className="form-control rounded-pill border-0 shadow-sm bg-light"
                                        required
                                        value={formData.competences}
                                        onChange={handleChange}
                                        placeholder="Java, React, SQL, Management..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Remarques / Motivation</label>
                                    <textarea
                                        name="remarques"
                                        className="form-control border-0 shadow-sm bg-light"
                                        rows="4"
                                        style={{ borderRadius: '15px' }}
                                        value={formData.remarques}
                                        onChange={handleChange}
                                        placeholder="Dites-nous en plus sur votre expérience..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-info w-100 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center fw-bold text-dark"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="bi bi-send-fill me-2"></i>
                                    )}
                                    Envoyer ma candidature
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerForm;
