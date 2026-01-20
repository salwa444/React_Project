import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useOutletContext } from 'react-router-dom';

const EvaluationManager = ({ readOnly = false }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Safety check for useOutletContext - handles case where component is used outside AdminLayout (e.g. formateur view)
    const context = useOutletContext();
    const searchTerm = context?.searchTerm || '';

    const [formData, setFormData] = useState({
        id: null,
        participant: { id: '' },
        notePedagogie: 5,
        noteRythme: 5,
        noteSupport: 5,
        noteMaitrise: 5,
        commentaire: ''
    });

    useEffect(() => {
        fetchEvaluations();
        if (!readOnly) {
            fetchParticipants();
        }
    }, [readOnly]);

    const fetchEvaluations = async () => {
        try {
            const response = await axiosInstance.get('/evaluations');
            setEvaluations(response.data || []);
        } catch (error) {
            console.error('Error fetching evaluations:', error);
            setEvaluations([]);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await axiosInstance.get('/participants');
            setParticipants(response.data || []);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleParticipantChange = (e) => {
        const participantId = e.target.value;
        const participant = participants.find(p => p.id == participantId);
        setFormData(prev => ({
            ...prev,
            participant: participant ? participant : { id: '' }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axiosInstance.put(`/evaluations/${formData.id}`, {
                    ...formData,
                    planification: formData.participant.planification // Ensure link logic
                });
            } else {
                await axiosInstance.post('/evaluations', {
                    ...formData,
                    planification: formData.participant.planification
                });
            }
            fetchEvaluations();
            resetForm();
        } catch (error) {
            console.error('Error saving evaluation:', error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
            try {
                await axiosInstance.delete(`/evaluations/${id}`);
                fetchEvaluations();
            } catch (error) {
                console.error('Error deleting evaluation:', error);
            }
        }
    };

    const handleEdit = (evaluation) => {
        setIsEditing(true);
        setFormData({
            id: evaluation.id,
            participant: evaluation.participant,
            notePedagogie: evaluation.notePedagogie,
            noteRythme: evaluation.noteRythme,
            noteSupport: evaluation.noteSupport,
            noteMaitrise: evaluation.noteMaitrise,
            commentaire: evaluation.commentaire
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({
            id: null,
            participant: { id: '' },
            notePedagogie: 5,
            noteRythme: 5,
            noteSupport: 5,
            noteMaitrise: 5,
            commentaire: ''
        });
    };

    const filteredEvaluations = Array.isArray(evaluations) ? evaluations.filter(ev => {
        if (!ev) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            ev.participant?.nom?.toLowerCase().includes(searchLower) ||
            ev.participant?.prenom?.toLowerCase().includes(searchLower) ||
            ev.planification?.formation?.titre?.toLowerCase().includes(searchLower)
        );
    }) : [];

    return (
        <div className="dubank-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title text-white mb-0" style={{ fontSize: '1.25rem' }}>Gestion des Évaluations</h3>
            </div>

            {!readOnly && (
                <form onSubmit={handleSubmit} className="mb-4 p-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
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
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Participant</th>
                            <th>Formation</th>
                            <th>Notes (P/R/S/M)</th>
                            <th>Moyenne</th>
                            <th>Commentaire</th>
                            {!readOnly && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvaluations.map(ev => {
                            // Safe calculation for average
                            let avg = 0;
                            try {
                                const p = Number(ev.notePedagogie) || 0;
                                const r = Number(ev.noteRythme) || 0;
                                const s = Number(ev.noteSupport) || 0;
                                const m = Number(ev.noteMaitrise) || 0;
                                avg = (p + r + s + m) / 4;
                            } catch (e) {
                                console.error("Error calc avg", e);
                            }

                            return (
                                <tr key={ev.id || Math.random()}>
                                    <td>{ev.participant?.nom || '-'} {ev.participant?.prenom || ''}</td>
                                    <td>{ev.planification?.formation?.titre || '-'}</td>
                                    <td>{ev.notePedagogie || 0}/{ev.noteRythme || 0}/{ev.noteSupport || 0}/{ev.noteMaitrise || 0}</td>
                                    <td>
                                        <span className={`badge ${avg >= 5 ? 'bg-success' : 'bg-danger'}`}>
                                            {typeof avg === 'number' ? avg.toFixed(1) : '0.0'}/10
                                        </span>
                                    </td>
                                    <td className="text-truncate" style={{ maxWidth: '200px' }}>{ev.commentaire || '-'}</td>
                                    {!readOnly && (
                                        <td>
                                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(ev)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ev.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {filteredEvaluations.length === 0 && (
                            <tr>
                                <td colSpan={readOnly ? 5 : 6} className="text-center py-4 text-muted">Aucune évaluation trouvée pour "{searchTerm}".</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default EvaluationManager;
