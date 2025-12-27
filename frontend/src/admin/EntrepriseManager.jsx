
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const EntrepriseManager = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentEntreprise, setCurrentEntreprise] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        url: '',
        email: ''
    });

    useEffect(() => {
        fetchEntreprises();
    }, []);

    const fetchEntreprises = async () => {
        try {
            const res = await axiosInstance.get('/entreprises');
            setEntreprises(res.data);
        } catch (err) {
            console.error("Erreur chargement entreprises", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentEntreprise.id) {
                await axiosInstance.put(`/entreprises/${currentEntreprise.id}`, currentEntreprise);
            } else {
                await axiosInstance.post('/entreprises', currentEntreprise);
            }
            setShowModal(false);
            fetchEntreprises();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette entreprise ?")) {
            try {
                await axiosInstance.delete(`/entreprises/${id}`);
                fetchEntreprises();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const openModal = (e = null) => {
        if (e) setCurrentEntreprise(e);
        else setCurrentEntreprise({ nom: '', adresse: '', telephone: '', url: '', email: '' });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="card border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Gestion des Entreprises</h3>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Ajouter une entreprise
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Site Web</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entreprises.map((e) => (
                            <tr key={e.id}>
                                <td className="fw-bold">{e.nom}</td>
                                <td>{e.email}</td>
                                <td>{e.telephone}</td>
                                <td><a href={e.url} target="_blank" rel="noreferrer" className="text-decoration-none">{e.url}</a></td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(e)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e.id)}>
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
                    <div className="modal-dialog">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{currentEntreprise.id ? 'Modifier' : 'Ajouter'} une entreprise</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label">Nom de l'entreprise</label>
                                        <input type="text" className="form-control" value={currentEntreprise.nom} onChange={(e) => setCurrentEntreprise({ ...currentEntreprise, nom: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" value={currentEntreprise.email} onChange={(e) => setCurrentEntreprise({ ...currentEntreprise, email: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Téléphone</label>
                                        <input type="text" className="form-control" value={currentEntreprise.telephone} onChange={(e) => setCurrentEntreprise({ ...currentEntreprise, telephone: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">URL Site Web</label>
                                        <input type="url" className="form-control" value={currentEntreprise.url} onChange={(e) => setCurrentEntreprise({ ...currentEntreprise, url: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Adresse</label>
                                        <textarea className="form-control" rows="2" value={currentEntreprise.adresse} onChange={(e) => setCurrentEntreprise({ ...currentEntreprise, adresse: e.target.value })}></textarea>
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

export default EntrepriseManager;
