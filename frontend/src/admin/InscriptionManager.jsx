import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const InscriptionManager = () => {
    const [participants, setParticipants] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const res = await axiosInstance.get('/participants');
            setParticipants(res.data);
        } catch (err) {
            console.error("Erreur chargement participants", err);
        }
    };

    const filteredParticipants = participants.filter(p =>
        p.nom.toLowerCase().includes(filter.toLowerCase()) ||
        p.prenom.toLowerCase().includes(filter.toLowerCase()) ||
        p.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Gestion des Inscriptions</h3>
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Rechercher..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Participant</th>
                                <th>Contact</th>
                                <th>Formation / Planification</th>
                                <th>Date Inscription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.map(participant => (
                                <tr key={participant.id}>
                                    <td>
                                        <div className="fw-bold">{participant.nom} {participant.prenom}</div>
                                        <div className="text-muted small">{participant.ville}</div>
                                    </td>
                                    <td>
                                        <div>{participant.email}</div>
                                        <div className="small text-muted">{participant.telephone}</div>
                                    </td>
                                    <td>
                                        {participant.planification?.formation?.titre || 'Formation inconnue'}
                                        <br />
                                        <span className="badge bg-secondary">
                                            {participant.planification?.dateDebut}
                                        </span>
                                    </td>
                                    <td>{participant.createdAt ? new Date(participant.createdAt).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))}
                            {filteredParticipants.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">Aucun participant trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InscriptionManager;
