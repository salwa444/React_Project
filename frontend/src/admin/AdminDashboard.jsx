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

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        formations: 0,
        formateurs: 0,
        entreprises: 0,
        participants: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Erreur stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Main Chart: Cashflow style (Blue Area)
    const lineChartData = {
        labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
        datasets: [
            {
                label: 'Revenus',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000],
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)'); // Blue
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
                    return gradient;
                },
                borderColor: '#2563eb',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2,
            },
        ],
    };

    // Secondary Chart: Doughnut style
    const doughnutData = {
        labels: ['Salaires', 'Logiciels', 'Remboursements', 'Pub'],
        datasets: [
            {
                data: [45, 25, 15, 15],
                backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'], // Blue shades
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
        { label: 'Formations Actives', value: stats.formations, color: '#2563eb', percent: 75 },
        { label: 'Participants', value: stats.participants, color: '#10b981', percent: 45 },
        { label: 'Formateurs', value: stats.formateurs, color: '#f59e0b', percent: 60 },
        { label: 'Entreprises', value: stats.entreprises, color: '#ef4444', percent: 30 },
    ];

    return (
        <div>
            <h2 className="section-title">Dashboard</h2>

            {/* Row 1: KPI Cards */}
            <div className="kpi-row">
                {kpiData.map((kpi, idx) => (
                    <div className="kpi-card-white" key={idx}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="kpi-label-sm text-uppercase">{kpi.label}</div>
                                <div className="kpi-value-lg">{kpi.value}</div>
                            </div>
                            <span className="badge rounded-pill bg-light text-dark">+12%</span>
                        </div>
                        <div className="kpi-progress">
                            <div
                                className="progress-bar"
                                style={{ width: `${kpi.percent}%`, backgroundColor: kpi.color }}
                            ></div>
                        </div>
                        <div className="mt-2 small text-muted">Mise à jour: Hier</div>
                    </div>
                ))}
            </div>

            {/* Row 2: Charts */}
            <div className="chart-row">
                <div className="chart-card-white">
                    <div className="chart-header-row">
                        <h3 className="chart-title-md">Flux de Trésorerie</h3>
                        <div className="dropdown">
                            <button className="btn btn-sm btn-light text-muted dropdown-toggle" type="button">
                                Cette année
                            </button>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line options={chartOptions} data={lineChartData} />
                    </div>
                </div>

                <div className="chart-card-white">
                    <div className="chart-header-row">
                        <h3 className="chart-title-md">Dépenses</h3>
                        <button className="btn btn-sm btn-light p-1 rounded-circle">
                            <i className="bi bi-three-dots"></i>
                        </button>
                    </div>
                    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                        <Doughnut
                            data={doughnutData}
                            options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                        />
                        <div className="position-absolute text-center">
                            <div className="h4 fw-bold mb-0">85%</div>
                            <div className="small text-muted">Budget</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="d-flex justify-content-between small mb-2">
                            <span className="d-flex align-items-center"><span className="badge-dot bg-primary me-2" style={{ width: 8, height: 8 }}></span>Salaires</span>
                            <span className="fw-bold">45%</span>
                        </div>
                        <div className="d-flex justify-content-between small">
                            <span className="d-flex align-items-center"><span className="badge-dot bg-info me-2" style={{ width: 8, height: 8 }}></span>Logiciels</span>
                            <span className="fw-bold">25%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Recent Activity / Table placeholder */}
            <div className="table-container">
                <div className="chart-header-row">
                    <h3 className="chart-title-md">Dernières Inscriptions</h3>
                    <button className="btn btn-primary btn-sm rounded-pill px-3">Voir tout</button>
                </div>
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Formation</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map(i => (
                            <tr key={i}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                            <i className="bi bi-person text-secondary"></i>
                                        </div>
                                        <span className="fw-500">Utilisateur Demo {i}</span>
                                    </div>
                                </td>
                                <td className="text-muted">Formation React Avancé</td>
                                <td className="text-muted">29 Dec 2025</td>
                                <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Confirmé</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminDashboard;
