import React, { useEffect, useState } from 'react';
import FormateurService from '../api/FormateurService';

const Evaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averages, setAverages] = useState({
        pedagogie: 0,
        rythme: 0,
        support: 0,
        maitrise: 0
    });

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const data = await FormateurService.getEvaluations();
            setEvaluations(data || []);
            calculateAverages(data || []);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des évaluations:', err);
            setLoading(false);
        }
    };

    const calculateAverages = (evals) => {
        if (evals.length === 0) {
            setAverages({ pedagogie: 0, rythme: 0, support: 0, maitrise: 0 });
            return;
        }

        const sum = evals.reduce((acc, ev) => ({
            pedagogie: acc.pedagogie + (ev.pedagogie || 0),
            rythme: acc.rythme + (ev.rythme || 0),
            support: acc.support + (ev.supportCours || 0),
            maitrise: acc.maitrise + (ev.maitriseSujet || 0)
        }), { pedagogie: 0, rythme: 0, support: 0, maitrise: 0 });

        setAverages({
            pedagogie: (sum.pedagogie / evals.length).toFixed(1),
            rythme: (sum.rythme / evals.length).toFixed(1),
            support: (sum.support / evals.length).toFixed(1),
            maitrise: (sum.maitrise / evals.length).toFixed(1)
        });
    };

    const getScoreColor = (score) => {
        if (score >= 4.5) return 'success';
        if (score >= 3.5) return 'primary';
        if (score >= 2.5) return 'warning';
        return 'danger';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    const kpiCards = [
        { label: 'Pédagogie', value: averages.pedagogie, icon: 'bi-mortarboard', color: 'primary' },
        { label: 'Rythme', value: averages.rythme, icon: 'bi-speedometer2', color: 'info' },
        { label: 'Support de Cours', value: averages.support, icon: 'bi-file-earmark-text', color: 'warning' },
        { label: 'Maîtrise du Sujet', value: averages.maitrise, icon: 'bi-award', color: 'success' }
    ];

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="fw-bold mb-0 text-white">
                        <i className="bi bi-star me-2 text-primary"></i>
                        Mes Évaluations
                    </h2>
                    <p className="text-muted">Vos performances et retours des participants</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="row g-4 mb-4">
                {kpiCards.map((kpi, index) => (
                    <div key={index} className="col-12 col-sm-6 col-lg-3">
                        <div className="dubank-card h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex align-items-center mb-3">
                                <div className={`rounded-circle bg-${kpi.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`}
                                    style={{ width: '50px', height: '50px' }}>
                                    <i className={`bi ${kpi.icon} text-${kpi.color} fs-4`}></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-0 small">{kpi.label}</p>
                                    <h3 className="fw-bold mb-0 text-white">
                                        {kpi.value}
                                        <small className="text-muted fs-6">/5</small>
                                    </h3>
                                </div>
                            </div>
                            <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <div
                                    className={`progress-bar bg-${getScoreColor(parseFloat(kpi.value))}`}
                                    role="progressbar"
                                    style={{ width: `${(kpi.value / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tableau détaillé */}
            <div className="dubank-card p-0">
                <div className="card-header bg-transparent border-secondary border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-white">
                        <i className="bi bi-table me-2"></i>
                        Détails par Session
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 text-white">
                            <thead>
                                <tr className="border-secondary">
                                    <th className="bg-transparent border-0 py-3 px-4 text-white">Formation</th>
                                    <th className="bg-transparent border-0 py-3 text-white">Entreprise</th>
                                    <th className="bg-transparent border-0 py-3 text-white">Date</th>
                                    <th className="bg-transparent border-0 py-3 text-center text-white">Pédagogie</th>
                                    <th className="bg-transparent border-0 py-3 text-center text-white">Rythme</th>
                                    <th className="bg-transparent border-0 py-3 text-center text-white">Support</th>
                                    <th className="bg-transparent border-0 py-3 text-center text-white">Maîtrise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluations.length > 0 ? (
                                    evaluations.map((evaluation, index) => (
                                        <tr key={index} className="border-secondary">
                                            <td className="px-4 py-3 bg-transparent text-white">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <i className="bi bi-book text-primary"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{evaluation.formationTitre || 'N/A'}</div>
                                                        <small className="text-muted">Session #{evaluation.planificationId}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 bg-transparent">
                                                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                                    <i className="bi bi-building me-1"></i>
                                                    {evaluation.entrepriseNom || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 bg-transparent text-muted">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {formatDate(evaluation.dateSession)}
                                            </td>
                                            <td className="py-3 text-center bg-transparent">
                                                <span className={`badge bg-${getScoreColor(evaluation.pedagogie)} px-3 py-2`}>
                                                    {evaluation.pedagogie || 0}/5
                                                </span>
                                            </td>
                                            <td className="py-3 text-center bg-transparent">
                                                <span className={`badge bg-${getScoreColor(evaluation.rythme)} px-3 py-2`}>
                                                    {evaluation.rythme || 0}/5
                                                </span>
                                            </td>
                                            <td className="py-3 text-center bg-transparent">
                                                <span className={`badge bg-${getScoreColor(evaluation.supportCours)} px-3 py-2`}>
                                                    {evaluation.supportCours || 0}/5
                                                </span>
                                            </td>
                                            <td className="py-3 text-center bg-transparent">
                                                <span className={`badge bg-${getScoreColor(evaluation.maitriseSujet)} px-3 py-2`}>
                                                    {evaluation.maitriseSujet || 0}/5
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted bg-transparent">
                                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                            Aucune évaluation disponible
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evaluations;
