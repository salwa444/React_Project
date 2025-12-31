import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const PlanificationManager = () => {
    const [planifications, setPlanifications] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        formation: null,
        formateur: null,
        entreprise: null,
        dateDebut: '',
        dateFin: '',
        type: 'INTER',
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
            if (isEditing) {
                await axiosInstance.put(`/planifications/${formData.id}`, formData);
            } else {
                await axiosInstance.post('/planifications', formData);
            }
            fetchPlanifications();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
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

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <h3 className="mb-4">Gestion des Planifications</h3>

                <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded">
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
                                <option value="INTER">Inter-entreprises</option>
                                <option value="INTRA">Intra-entreprise</option>
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
                        <thead className="table-light">
                            <tr>
                                <th>Formation</th>
                                <th>Dates</th>
                                <th>Formateur</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planifications.map(plan => (
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlanificationManager;
