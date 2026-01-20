
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useOutletContext } from 'react-router-dom';

const FormateurManager = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { searchTerm } = useOutletContext(); // Get search term

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

    // Filter logic
    const filteredFormateurs = formateurs.filter(f =>
        f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.telephone?.includes(searchTerm) ||
        f.motsCles?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="dubank-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title text-white mb-0" style={{ fontSize: '1.25rem' }}>Gestion des Formateurs</h3>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-person-plus me-2"></i>Ajouter un formateur
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
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
                        {filteredFormateurs.map((f) => (
                            <tr key={f.id}>
                                <td className="fw-bold">{f.nom}</td>
                                <td>{f.email}</td>
                                <td>{f.telephone}</td>
                                <td>{f.motsCles}</td>
                                <td>
                                    <select
                                        className={`form-select form-select-sm w-auto bg-transparent border-0 ${f.statut === 'ACTIF' ? 'text-success' : f.statut === 'EN_ATTENTE' ? 'text-warning' : 'text-danger'}`}
                                        value={f.statut}
                                        onChange={(e) => handleStatusChange(f, e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        <option value="ACTIF" className="bg-dark text-success">ACTIF</option>
                                        <option value="EN_ATTENTE" className="bg-dark text-warning">EN ATTENTE</option>
                                        <option value="INACTIF" className="bg-dark text-danger">INACTIF</option>
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
                        {filteredFormateurs.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">
                                    Aucun formateur trouvé pour "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content shadow">
                            <div className="modal-header bg-dark text-white border-bottom border-secondary">
                                <h5 className="modal-title">{currentFormateur.id ? 'Modifier' : 'Ajouter'} un formateur</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4 bg-dark text-white">
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
                                <div className="modal-footer border-top border-secondary bg-dark">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
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
