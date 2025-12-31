import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const EvaluationManager = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [participants, setParticipants] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        participant: null,
        planification: null,
        notePedagogie: 5,
        noteRythme: 5,
        noteSupport: 5,
        noteMaitrise: 5,
        commentaire: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchEvaluations();
        fetchParticipants();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const res = await axiosInstance.get('/evaluations');
            setEvaluations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await axiosInstance.get('/participants');
            setParticipants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleParticipantChange = (e) => {
        const id = e.target.value;
        const participant = participants.find(p => p.id == id);
        if (participant) {
            setFormData({
                ...formData,
                participant: participant,
                planification: participant.planification // Link directly to the participant's session
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.participant || !formData.planification) {
            alert("Veuillez sélectionner un participant (qui doit être inscrit à une session).");
            return;
        }

        try {
            if (isEditing) {
                await axiosInstance.put(`/evaluations/${formData.id}`, formData);
            } else {
                await axiosInstance.post('/evaluations', formData);
            }
            fetchEvaluations();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (evalData) => {
        setFormData({
            id: evalData.id,
            participant: evalData.participant,
            planification: evalData.planification,
            notePedagogie: evalData.notePedagogie,
            noteRythme: evalData.noteRythme,
            noteSupport: evalData.noteSupport,
            noteMaitrise: evalData.noteMaitrise,
            commentaire: evalData.commentaire
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Confirmer la suppression ?')) {
            try {
                await axiosInstance.delete(`/evaluations/${id}`);
                fetchEvaluations();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            participant: null,
            planification: null,
            notePedagogie: 5,
            noteRythme: 5,
            noteSupport: 5,
            noteMaitrise: 5,
            commentaire: ''
        });
        setIsEditing(false);
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <h3 className="mb-4">Gestion des Évaluations</h3>

                <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded">
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label">Participant</label>
                            <select className="form-select" onChange={handleParticipantChange} value={formData.participant?.id || ''} required disabled={isEditing}>
                                <option value="">Choisir un participant...</option>
                                {participants.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nom} {p.prenom} - {p.planification?.formation?.titre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Pédagogie (0-10)</label>
                            <input type="number" min="0" max="10" className="form-control" name="notePedagogie" value={formData.notePedagogie} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Rythme (0-10)</label>
                            <input type="number" min="0" max="10" className="form-control" name="noteRythme" value={formData.noteRythme} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Support (0-10)</label>
                            <input type="number" min="0" max="10" className="form-control" name="noteSupport" value={formData.noteSupport} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Maîtrise (0-10)</label>
                            <input type="number" min="0" max="10" className="form-control" name="noteMaitrise" value={formData.noteMaitrise} onChange={handleChange} required />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Commentaire</label>
                            <textarea className="form-control" name="commentaire" value={formData.commentaire} onChange={handleChange}></textarea>
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
                                <th>Participant</th>
                                <th>Formation</th>
                                <th>Notes (P/R/S/M)</th>
                                <th>Moyenne</th>
                                <th>Commentaire</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluations.map(ev => {
                                const avg = (ev.notePedagogie + ev.noteRythme + ev.noteSupport + ev.noteMaitrise) / 4;
                                return (
                                    <tr key={ev.id}>
                                        <td>{ev.participant?.nom} {ev.participant?.prenom}</td>
                                        <td>{ev.planification?.formation?.titre}</td>
                                        <td>{ev.notePedagogie}/{ev.noteRythme}/{ev.noteSupport}/{ev.noteMaitrise}</td>
                                        <td><span className={`badge ${avg >= 5 ? 'bg-success' : 'bg-danger'}`}>{avg.toFixed(1)}/10</span></td>
                                        <td className="text-truncate" style={{ maxWidth: '200px' }}>{ev.commentaire}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(ev)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ev.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EvaluationManager;
