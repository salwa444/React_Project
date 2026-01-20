import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const AssistantDashboard = () => {
    const [stats, setStats] = useState({
        planifications: 0,
        participants: 0,
        entreprises: 0
    });
    const [recentParticipants, setRecentParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [plansRes, partsRes, entsRes] = await Promise.all([
                    axiosInstance.get('/planifications'),
                    axiosInstance.get('/participants'),
                    axiosInstance.get('/entreprises')
                ]);

                setStats({
                    planifications: plansRes.data.length,
                    participants: partsRes.data.length,
                    entreprises: entsRes.data.length
                });

                // Get last 5 participants, assuming higher ID is newer or array order
                // Ideally this should be sorted by a created_at date from backend
                const parts = partsRes.data || [];
                // Sort by ID descending as a proxy for recency if no date field is guaranteed, 
                // or just take the last ones if appended. Let's assume last in array is newest.
                // Better: reverse the array to show newest first.
                const recent = [...parts].reverse().slice(0, 5);
                setRecentParticipants(recent);

            } catch (err) {
                console.error("Erreur chargement stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Line Chart Data (Simulated for Assistant view)
    const lineChartData = {
        labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
        datasets: [
            {
                label: 'Inscriptions',
                data: [5, 12, 19, 15, 25, 22, 30, 40],
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)'); // Green for Assistant
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                    return gradient;
                },
                borderColor: '#10b981',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2,
            },
        ],
    };

    const doughnutData = {
        labels: ['Entreprise', 'Individuel'],
        datasets: [
            {
                data: [70, 30],
                backgroundColor: ['#10b981', '#34d399'], // Green shades
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                grid: { color: '#f3f4f6', borderDash: [4, 4] },
                border: { display: false },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: '#9ca3af' }
            }
        },
        interaction: { mode: 'index', intersect: false },
    };

    if (loading) return <div></div>;

    const kpiData = [
        { label: 'Formations Planifiées', value: stats.planifications, color: '#2563eb', percent: 65 },
        { label: 'Participants', value: stats.participants, color: '#10b981', percent: 80 },
        { label: 'Entreprises', value: stats.entreprises, color: '#f59e0b', percent: 45 },
        // Placeholder for consistency
        { label: 'Taux Satisfaction', value: '4.8/5', color: '#8b5cf6', percent: 90 },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="welcome-text">Bonjour {localStorage.getItem('username')?.split(' ')[0] || 'Assistant'} ! <span>Ravi de vous revoir !</span></div>
            </div>

            {/* Row 1: KPIs */}
            <div className="kpi-row">
                <div className="dubank-card">
                    <div className="card-title">Formations Planifiées</div>
                    <div className="card-value">{stats.planifications}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-calendar-event"></i>
                        <span>Sessions actives</span>
                    </div>
                </div>

                <div className="dubank-card">
                    <div className="card-title">Participants</div>
                    <div className="card-value">{stats.participants}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-people-fill"></i>
                        <span>Inscrits totaux</span>
                    </div>
                </div>

                <div className="dubank-card">
                    <div className="card-title">Entreprises</div>
                    <div className="card-value">{stats.entreprises}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-building"></i>
                        <span>Partenaires</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Charts + Widgets */}
            <div className="dashboard-grid-row2">
                {/* Main Chart */}
                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Analyse des Inscriptions</div>
                        <div className="text-muted small">Cette année <i className="bi bi-chevron-down"></i></div>
                    </div>
                    <div style={{ height: '240px' }}>
                        <Line options={chartOptions} data={lineChartData} />
                    </div>
                </div>

                {/* Status Doughnut */}
                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Répartition</div>
                        <div className="text-muted small">Clientèle <i className="bi bi-chevron-down"></i></div>
                    </div>
                    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '180px' }}>
                        <Doughnut
                            data={doughnutData}
                            options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                        />
                        <div className="position-absolute text-center">
                            <h4 className="fw-bold mb-0 text-white">Total</h4>
                            <div className="small text-muted">{stats.entreprises + stats.participants}</div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between small mb-2">
                            <div className="d-flex align-items-center text-white"><span className="badge-dot" style={{ width: 8, height: 8, backgroundColor: '#10b981', marginRight: 8 }}></span>Entreprises</div>
                            <div className="fw-bold text-white">70%</div>
                        </div>
                        <div className="d-flex justify-content-between small">
                            <div className="d-flex align-items-center text-white"><span className="badge-dot" style={{ width: 8, height: 8, backgroundColor: '#34d399', marginRight: 8 }}></span>Individuel</div>
                            <div className="fw-bold text-white">30%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Recent Activity Table */}
            <div className="dubank-card">
                <div className="chart-header mb-0 p-2">
                    <div className="card-title mb-0">Dernières Inscriptions</div>
                    <button className="btn btn-sm btn-outline-light rounded-pill px-3">Voir tout</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="bg-transparent border-0 text-white opacity-50">Nom</th>
                                <th className="bg-transparent border-0 text-white opacity-50">Formation</th>
                                <th className="bg-transparent border-0 text-white opacity-50">Date</th>
                                <th className="bg-transparent border-0 text-white opacity-50">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentParticipants.length > 0 ? (
                                recentParticipants.map((participant, index) => (
                                    <tr key={participant.id || index}>
                                        <td className="bg-transparent text-white">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center me-3" style={{ width: 35, height: 35, border: '1px solid #2a2a4a' }}>
                                                    <i className="bi bi-person text-white small"></i>
                                                </div>
                                                <span className="fw-500">{participant.nom} {participant.prenom}</span>
                                            </div>
                                        </td>
                                        <td className="bg-transparent text-muted">
                                            {participant.planification?.formation?.titre || 'Formation Inconnue'}
                                        </td>
                                        <td className="bg-transparent text-muted">
                                            {participant.createdAt ? new Date(participant.createdAt).toLocaleDateString() : 'Récemment'}
                                        </td>
                                        <td className="bg-transparent">
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Confirmé</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted bg-transparent py-4">
                                        Aucune inscription récente
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssistantDashboard;
