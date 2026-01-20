import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import '../Visitor.css';

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
            setMessage({ type: 'success', text: 'Demande envoyée avec succès !' });
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            console.error("Error submitting form:", err);
            const errorMsg = err.response?.data || "Erreur lors de l'envoi. Veuillez vérifier vos informations.";
            setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="visitor-wrapper">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6">
                        <div className="card shadow-lg border-0 overflow-hidden" style={{ background: '#222240', color: 'white' }}>
                            <div className="card-header py-3 text-center" style={{ background: 'linear-gradient(90deg, #d64374 0%, #6e6ce6 100%)', border: 'none' }}>
                                <h3 className="mb-0 fs-4 fw-bold text-white">
                                    Devenir Formateur
                                </h3>
                            </div>
                            <div className="card-body p-4">
                                {message && (
                                    <div className={`alert alert-${message.type} mb-4 text-center border-0`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Nom complet</label>
                                        <input
                                            type="text"
                                            name="nomComplet"
                                            className="form-control rounded-pill border-0 shadow-sm"
                                            style={{ background: '#1e1e36', color: 'white' }}
                                            required
                                            value={formData.nomComplet}
                                            onChange={handleChange}
                                            placeholder="Ex: Mohammed Alami"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Email professionnel</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control rounded-pill border-0 shadow-sm"
                                            style={{ background: '#1e1e36', color: 'white' }}
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="exemple@professionnel.com"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Mots clés de compétences</label>
                                        <input
                                            type="text"
                                            name="competences"
                                            className="form-control rounded-pill border-0 shadow-sm"
                                            style={{ background: '#1e1e36', color: 'white' }}
                                            required
                                            value={formData.competences}
                                            onChange={handleChange}
                                            placeholder="Java, React, SQL, Management..."
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Remarques / Motivation</label>
                                        <textarea
                                            name="remarques"
                                            className="form-control trainer-textarea"
                                            style={{ background: '#1e1e36', color: 'white', border: 'none', borderRadius: '15px' }}
                                            rows="4"
                                            value={formData.remarques}
                                            onChange={handleChange}
                                            placeholder="Dites-nous en plus sur votre expérience..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 py-3 rounded-pill shadow-sm fw-bold transition-all"
                                        style={{ background: '#d64374', color: 'white', border: 'none' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Envoi...' : <><i className="bi bi-send-fill me-2"></i> Envoyer ma candidature</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerForm;
