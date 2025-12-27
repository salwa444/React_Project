
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const FormateurManager = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentFormateur, setCurrentFormateur] = useState({
        nom: '',
        email: '',
        telephone: '',
        motsCles: '',
        remarques: '',
        statut: 'ACTIF'
    });

    useEffect(() => {
        fetchFormateurs();
    }, []);

    const fetchFormateurs = async () => {
        try {
            const res = await axiosInstance.get('/formateurs');
            setFormateurs(res.data);
        } catch (err) {
            console.error("Erreur chargement formateurs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentFormateur.id) {
                await axiosInstance.put(`/formateurs/${currentFormateur.id}`, currentFormateur);
            } else {
                await axiosInstance.post('/formateurs', currentFormateur);
            }
            setShowModal(false);
            fetchFormateurs();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce formateur ?")) {
            try {
                await axiosInstance.delete(`/formateurs/${id}`);
                fetchFormateurs();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const openModal = (f = null) => {
        if (f) setCurrentFormateur(f);
        else setCurrentFormateur({ nom: '', email: '', telephone: '', motsCles: '', remarques: '', statut: 'ACTIF' });
        setShowModal(true);
    };

    const handleStatusChange = async (f, newStatus) => {
        try {
            await axiosInstance.put(`/formateurs/${f.id}`, { ...f, statut: newStatus });
            fetchFormateurs();
        } catch (err) {
            alert("Erreur changement statut");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="card border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Gestion des Formateurs</h3>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-person-plus me-2"></i>Ajouter un formateur
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Spécialités</th>
                            <th>Statut</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formateurs.map((f) => (
                            <tr key={f.id}>
                                <td className="fw-bold">{f.nom}</td>
                                <td>{f.email}</td>
                                <td>{f.telephone}</td>
                                <td>{f.motsCles}</td>
                                <td>
                                    <select
                                        className={`form-select form-select-sm w-auto ${f.statut === 'ACTIF' ? 'text-success border-success' : f.statut === 'EN_ATTENTE' ? 'text-warning border-warning' : 'text-danger border-danger'}`}
                                        value={f.statut}
                                        onChange={(e) => handleStatusChange(f, e.target.value)}
                                    >
                                        <option value="ACTIF">ACTIF</option>
                                        <option value="EN_ATTENTE">EN ATTENTE</option>
                                        <option value="INACTIF">INACTIF</option>
                                    </select>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(f)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{currentFormateur.id ? 'Modifier' : 'Ajouter'} un formateur</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Nom complet</label>
                                            <input type="text" className="form-control" value={currentFormateur.nom} onChange={(e) => setCurrentFormateur({ ...currentFormateur, nom: e.target.value })} required />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={currentFormateur.email} onChange={(e) => setCurrentFormateur({ ...currentFormateur, email: e.target.value })} required />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Téléphone</label>
                                            <input type="text" className="form-control" value={currentFormateur.telephone} onChange={(e) => setCurrentFormateur({ ...currentFormateur, telephone: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Mots clés / Compétences</label>
                                            <input type="text" className="form-control" value={currentFormateur.motsCles} onChange={(e) => setCurrentFormateur({ ...currentFormateur, motsCles: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Statut</label>
                                            <select className="form-select" value={currentFormateur.statut} onChange={(e) => setCurrentFormateur({ ...currentFormateur, statut: e.target.value })}>
                                                <option value="ACTIF">ACTIF</option>
                                                <option value="EN_ATTENTE">EN ATTENTE</option>
                                                <option value="INACTIF">INACTIF</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary px-4">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormateurManager;
