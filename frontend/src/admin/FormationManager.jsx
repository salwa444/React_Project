
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const FormationManager = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentFormation, setCurrentFormation] = useState({
        titre: '',
        categorie: '',
        nombreHeures: '',
        cout: '',
        ville: '',
        objectifs: '',
        programme: '',
        publie: false
    });

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            const res = await axiosInstance.get('/formations');
            setFormations(res.data);
        } catch (err) {
            console.error("Erreur chargement formations", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentFormation.id) {
                await axiosInstance.put(`/formations/${currentFormation.id}`, currentFormation);
            } else {
                await axiosInstance.post('/formations', currentFormation);
            }
            setShowModal(false);
            fetchFormations();
            setCurrentFormation({ titre: '', categorie: '', nombreHeures: '', cout: '', ville: '', objectifs: '', programme: '', publie: false });
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette formation ?")) {
            try {
                await axiosInstance.delete(`/formations/${id}`);
                fetchFormations();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const openModal = (f = null) => {
        if (f) setCurrentFormation(f);
        else setCurrentFormation({ titre: '', categorie: '', nombreHeures: '', cout: '', ville: '', objectifs: '', programme: '', publie: false });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="card border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Gestion des Formations</h3>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Ajouter une formation
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Titre</th>
                            <th>Catégorie</th>
                            <th>Durée</th>
                            <th>Coût</th>
                            <th>Ville</th>
                            <th>Statut</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formations.map((f) => (
                            <tr key={f.id}>
                                <td className="fw-bold">{f.titre}</td>
                                <td><span className="badge bg-info text-dark">{f.categorie}</span></td>
                                <td>{f.nombreHeures}h</td>
                                <td>{f.cout} €</td>
                                <td>{f.ville}</td>
                                <td>
                                    <span className={`badge ${f.publie ? 'bg-success' : 'bg-secondary'}`}>
                                        {f.publie ? 'Publié' : 'Brouillon'}
                                    </span>
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

            {/* Basic Bootstrap Modal Mockup */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{currentFormation.id ? 'Modifier' : 'Ajouter'} une formation</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label">Titre</label>
                                            <input type="text" className="form-control" value={currentFormation.titre} onChange={(e) => setCurrentFormation({ ...currentFormation, titre: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Catégorie</label>
                                            <input type="text" className="form-control" value={currentFormation.categorie} onChange={(e) => setCurrentFormation({ ...currentFormation, categorie: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Heures</label>
                                            <input type="number" className="form-control" value={currentFormation.nombreHeures} onChange={(e) => setCurrentFormation({ ...currentFormation, nombreHeures: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Coût (€)</label>
                                            <input type="number" className="form-control" value={currentFormation.cout} onChange={(e) => setCurrentFormation({ ...currentFormation, cout: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Ville</label>
                                            <input type="text" className="form-control" value={currentFormation.ville} onChange={(e) => setCurrentFormation({ ...currentFormation, ville: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Objectifs</label>
                                            <textarea className="form-control" rows="2" value={currentFormation.objectifs} onChange={(e) => setCurrentFormation({ ...currentFormation, objectifs: e.target.value })}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Programme</label>
                                            <textarea className="form-control" rows="3" value={currentFormation.programme} onChange={(e) => setCurrentFormation({ ...currentFormation, programme: e.target.value })}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" checked={currentFormation.publie} onChange={(e) => setCurrentFormation({ ...currentFormation, publie: e.target.checked })} id="publieCheck" />
                                                <label className="form-check-label" htmlFor="publieCheck">Publier cette formation</label>
                                            </div>
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

export default FormationManager;
