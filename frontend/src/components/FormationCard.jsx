import React from 'react';
import { Link } from 'react-router-dom';

const FormationCard = ({ formation }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm formation-card">
                <div className="card-header bg-primary text-white py-3">
                    <h5 className="card-title mb-0">{formation.titre}</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex align-items-center">
                        <span className="badge bg-soft-primary text-primary me-2">
                            <i className="bi bi-tag-fill me-1"></i> {formation.categorie}
                        </span>
                        <span className="badge bg-soft-info text-info">
                            <i className="bi bi-geo-alt-fill me-1"></i> {formation.ville}
                        </span>
                    </div>

                    <div className="formation-details">
                        <div className="detail-item mb-2">
                            <i className="bi bi-clock me-2 text-muted"></i>
                            <strong>Durée:</strong> {formation.heures} heures
                        </div>
                        <div className="detail-item mb-2">
                            <i className="bi bi-calendar-event me-2 text-muted"></i>
                            <strong>Début:</strong> {new Date(formation.date_debut).toLocaleDateString()}
                        </div>
                        <div className="detail-item mb-3">
                            <h4 className="text-primary fw-bold mb-0">{formation.cout} <small>MAD</small></h4>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                    <Link
                        to={`/inscription/${formation.id}`}
                        className="btn btn-outline-primary w-100 rounded-pill hover-lift"
                    >
                        S'inscrire à cette formation
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FormationCard;
