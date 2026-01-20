import React, { useEffect, useState } from 'react';
import FormateurService from '../api/FormateurService';

const Profil = () => {
    const [profile, setProfile] = useState({
        nom: '',
        email: '',
        competences: '',
        remarques: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                setErrorMsg('Session expirée ou email manquant. Veuillez vous reconnecter.');
                setLoading(false);
                return;
            }

            const data = await FormateurService.getMe();
            console.log("Profile Data Received:", data); // DEBUG log

            if (data) {
                setProfile({
                    nom: data.nom || (data.user ? `${data.user.nom} ${data.user.prenom}` : ''),
                    email: data.email || (data.user ? data.user.email : ''),
                    competences: data.motsCles || data.mots_cles || data.keywords || '',
                    remarques: data.remarques || ''
                });
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setErrorMsg('Profil non trouvé. Veuillez vérifier votre compte.');
            } else {
                setErrorMsg('Erreur de connexion au serveur. Assurez-vous que le backend fonctionne.');
            }
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await FormateurService.updateProfile({
                nom: profile.nom,
                email: profile.email,
                motsCles: profile.competences,
                remarques: profile.remarques
            });
            setSuccessMsg('Profil mis à jour avec succès !');
            setIsEditing(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('Erreur lors de la mise à jour.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    const skillsArray = profile.competences ? profile.competences.split(',').map(s => s.trim()).filter(s => s) : [];

    return (
        <div className="container-fluid">
            {/* Header avec gradient */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="d-flex align-items-center mb-3 mb-md-0">
                                    <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>
                                        {profile.nom ? profile.nom.charAt(0).toUpperCase() : 'F'}
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-1">{profile.nom || 'Formateur'}</h2>
                                        <p className="mb-0 opacity-75">
                                            <i className="bi bi-envelope me-2"></i>
                                            {profile.email}
                                        </p>
                                        <div className="mt-2">
                                            <span className="badge bg-white text-primary px-3 py-2">
                                                <i className="bi bi-patch-check me-1"></i>
                                                Formateur Certifié
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {!isEditing ? (
                                        <button
                                            className="btn btn-light btn-lg px-4"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Modifier mon profil
                                        </button>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-outline-light"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    fetchProfile();
                                                }}
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                className="btn btn-light"
                                                onClick={handleSubmit}
                                            >
                                                <i className="bi bi-check-lg me-2"></i>
                                                Enregistrer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {successMsg && (
                <div className="alert alert-success alert-dismissible fade show shadow-sm border-0" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <strong>Succès !</strong> {successMsg}
                    <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
                </div>
            )}
            {errorMsg && (
                <div className="alert alert-danger alert-dismissible fade show shadow-sm border-0" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Erreur !</strong> {errorMsg}
                    <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
                </div>
            )}

            <div className="row g-4">
                {/* SECTION 1 - Informations personnelles */}
                <div className="col-12 col-lg-6">
                    <div className="dubank-card h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                    }}>
                                    <i className="bi bi-person-fill fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0 text-white">Informations Personnelles</h5>
                                    <small className="text-muted">Gérez vos informations de base</small>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-muted small text-uppercase">
                                        Nom complet
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-dark border-secondary text-muted">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-dark border-secondary text-white"
                                            name="nom"
                                            value={profile.nom}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            style={{ fontSize: '1.1rem', fontWeight: '500' }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-muted small text-uppercase">
                                        Adresse email
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-dark border-secondary text-muted">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control bg-dark border-secondary text-white"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            style={{ fontSize: '1.1rem', fontWeight: '500' }}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <i className="bi bi-info-circle text-primary me-3 fs-4"></i>
                                    <small className="text-muted">
                                        Ces informations sont visibles par les administrateurs et les entreprises clientes.
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SECTION 2 - Compétences */}
                <div className="col-12 col-lg-6">
                    <div className="dubank-card h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white'
                                    }}>
                                    <i className="bi bi-lightbulb-fill fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0 text-white">Compétences & Expertises</h5>
                                    <small className="text-muted">Vos domaines de spécialisation</small>
                                </div>
                            </div>

                            {!isEditing ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {skillsArray.length > 0 ? (
                                        skillsArray.map((skill, index) => {
                                            const colors = [
                                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                            ];
                                            return (
                                                <span
                                                    key={index}
                                                    className="badge px-4 py-2 text-white"
                                                    style={{
                                                        background: colors[index % colors.length],
                                                        fontSize: '0.95rem',
                                                        fontWeight: '500',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    {skill}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center w-100 py-4">
                                            <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                                            <p className="text-muted mb-0">Aucune compétence renseignée</p>
                                            <small className="text-muted">Cliquez sur "Modifier" pour ajouter vos compétences</small>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="form-label fw-semibold text-muted small text-uppercase">
                                        Mots-clés (séparés par des virgules)
                                    </label>
                                    <textarea
                                        className="form-control bg-dark border-secondary text-white"
                                        rows="4"
                                        name="competences"
                                        value={profile.competences}
                                        onChange={handleChange}
                                        placeholder="React, Java, Spring Boot, DevOps, Management..."
                                        style={{ fontSize: '1rem' }}
                                    ></textarea>
                                    <small className="text-muted">
                                        <i className="bi bi-lightbulb me-1"></i>
                                        Exemple: React, Java, Spring Boot, Management
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 3 - Remarques & Biographie */}
                <div className="col-12">
                    <div className="dubank-card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white'
                                    }}>
                                    <i className="bi bi-chat-left-text-fill fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0 text-white">Biographie & Remarques</h5>
                                    <small className="text-muted">Présentez-vous et partagez votre expérience</small>
                                </div>
                            </div>

                            <textarea
                                className="form-control border-secondary text-white"
                                rows="6"
                                name="remarques"
                                value={profile.remarques}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Parlez de votre parcours, vos expériences, vos méthodes pédagogiques..."
                                style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    resize: 'none',
                                    backgroundColor: 'rgba(0,0,0,0.2)'
                                }}
                            ></textarea>

                            {isEditing && (
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light px-4"
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchProfile();
                                        }}
                                    >
                                        <i className="bi bi-x-lg me-2"></i>
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success px-4"
                                        onClick={handleSubmit}
                                        style={{
                                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                            border: 'none'
                                        }}
                                    >
                                        <i className="bi bi-check-lg me-2"></i>
                                        Enregistrer les modifications
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistiques supprimées */}
            </div>
        </div>
    );
};

export default Profil;
