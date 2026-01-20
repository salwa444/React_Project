import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useOutletContext } from 'react-router-dom';

const PlanificationManager = () => {
    const [planifications, setPlanifications] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const { searchTerm } = useOutletContext();

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        formation: null,
        formateur: null,
        entreprise: null,
        dateDebut: '',
        dateFin: '',
        type: 'ENTREPRISE',
        remarques: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPlanifications();
        fetchDependencies();
    }, []);

    const fetchPlanifications = async () => {
        try {
            const res = await axiosInstance.get('/planifications');
            setPlanifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [formationsRes, formateursRes, entreprisesRes] = await Promise.all([
                axiosInstance.get('/formations'),
                axiosInstance.get('/formateurs'),
                axiosInstance.get('/entreprises')
            ]);
            setFormations(formationsRes.data);
            setFormateurs(formateursRes.data);
            setEntreprises(entreprisesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleObjectChange = (e, list, field) => {
        const id = e.target.value;
        const obj = list.find(item => item.id == id);
        setFormData({ ...formData, [field]: obj });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a payload matching PlanificationDTO
            const payload = {
                formationId: formData.formation?.id,
                formateurId: formData.formateur?.id,
                entrepriseId: formData.entreprise?.id,
                dateDebut: formData.dateDebut,
                dateFin: formData.dateFin,
                type: formData.type,
                remarques: formData.remarques || ''
            };

            if (isEditing) {
                await axiosInstance.put(`/planifications/${formData.id}`, payload);
            } else {
                await axiosInstance.post('/planifications', payload);
            }
            fetchPlanifications();
            resetForm();
        } catch (err) {
            console.error(err);
            const errorData = err.response?.data;
            let errorMessage = "Erreur lors de l'enregistrement";

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = `Erreur: ${errorData.error}`;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(errorMessage);
        }
    };

    const handleEdit = (plan) => {
        setFormData({
            id: plan.id,
            formation: plan.formation,
            formateur: plan.formateur,
            entreprise: plan.entreprise,
            dateDebut: plan.dateDebut,
            dateFin: plan.dateFin,
            type: plan.type,
            remarques: plan.remarques || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Confirmer la suppression ?')) {
            try {
                await axiosInstance.delete(`/planifications/${id}`);
                fetchPlanifications();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            formation: null,
            formateur: null,
            entreprise: null,
            dateDebut: '',
            dateFin: '',
            type: 'INTER',
            remarques: ''
        });
        setIsEditing(false);
    };

    const filteredPlanifications = planifications.filter(p =>
        p.formation?.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.formateur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dubank-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title text-white mb-0" style={{ fontSize: '1.25rem' }}>Gestion des Planifications</h3>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 p-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Formation</label>
                        <select className="form-select" onChange={(e) => handleObjectChange(e, formations, 'formation')} value={formData.formation?.id || ''} required>
                            <option value="">Choisir...</option>
                            {formations.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Formateur</label>
                        <select className="form-select" onChange={(e) => handleObjectChange(e, formateurs, 'formateur')} value={formData.formateur?.id || ''}>
                            <option value="">Choisir...</option>
                            {formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Entreprise (Optionnel)</label>
                        <select className="form-select" onChange={(e) => handleObjectChange(e, entreprises, 'entreprise')} value={formData.entreprise?.id || ''}>
                            <option value="">Choisir...</option>
                            {entreprises.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Date Début</label>
                        <input type="date" className="form-control" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Date Fin</label>
                        <input type="date" className="form-control" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Type</label>
                        <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                            <option value="ENTREPRISE">Entreprise</option>
                            <option value="INDIVIDUEL">Individuel</option>
                        </select>
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Remarques</label>
                        <textarea className="form-control" name="remarques" value={formData.remarques} onChange={handleChange}></textarea>
                    </div>
                </div>
                <div className="mt-3">
                    <button type="submit" className={`btn btn-${isEditing ? 'warning' : 'primary'} me-2`}>
                        {isEditing ? 'Modifier' : 'Ajouter'}
                    </button>
                    {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>}
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Formation</th>
                            <th>Dates</th>
                            <th>Formateur</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlanifications.map(plan => (
                            <tr key={plan.id}>
                                <td>{plan.formation?.titre}</td>
                                <td>{plan.dateDebut} au {plan.dateFin}</td>
                                <td>{plan.formateur ? `${plan.formateur.nom} ${plan.formateur.prenom}` : '-'}</td>
                                <td><span className="badge bg-info text-dark">{plan.type}</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(plan)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plan.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPlanifications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">
                                    Aucune planification trouvée pour "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlanificationManager;
