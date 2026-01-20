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
import { Line } from 'react-chartjs-2';

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

    // Dubank Style Charts
    // Main Chart: Spending/Traffic - Neon Pink Line with Area
    const lineChartData = {
        labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        datasets: [
            {
                label: 'Spending Summary',
                data: [38, 48, 40, 50, 60, 48, 55],
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(214, 67, 116, 0.2)'); // Pink
                    gradient.addColorStop(1, 'rgba(214, 67, 116, 0)');
                    return gradient;
                },
                borderColor: '#d64374',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3,
            },
            {
                label: 'Previous Week',
                data: [30, 40, 35, 45, 50, 40, 45],
                fill: true,
                backgroundColor: 'transparent',
                borderColor: '#6e6ce6', // Purple
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                borderDash: [5, 5]
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#17163b',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                displayColors: false,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [4, 4] },
                border: { display: false },
                ticks: { color: '#8f95b2' }
            },
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: '#8f95b2' }
            }
        },
        interaction: { mode: 'index', intersect: false },
    };

    if (loading) return <div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="welcome-text">Bonjour {localStorage.getItem('username')?.split(' ')[0] || 'Admin'} ! <span>Ravi de vous revoir !</span></div>
            </div>

            {/* Row 1: 3 Cards (Balance style) */}
            <div className="kpi-row">
                <div className="dubank-card">
                    <div className="card-title">Composants Total</div>
                    <div className="card-value">{stats.formations}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-journal-album"></i>
                        <span>Formations actives</span>
                    </div>
                </div>

                <div className="dubank-card">
                    <div className="card-title">Inscrits</div>
                    <div className="card-value">{stats.participants}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-people-fill"></i>
                        <span>Participants totaux</span>
                    </div>
                </div>

                <div className="dubank-card">
                    <div className="card-title">Partenaires</div>
                    <div className="card-value">{stats.entreprises}</div>
                    <div className="card-trend trend-up">
                        <i className="bi bi-building"></i>
                        <span>Entreprises</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Chart + Transactions */}
            <div className="dashboard-grid-row2">
                {/* Main Linear Chart */}
                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Résumé des inscriptions</div>
                        <div className="text-muted small">Cette semaine <i className="bi bi-chevron-down"></i></div>
                    </div>
                    <div style={{ height: '240px' }}>
                        <Line options={chartOptions} data={lineChartData} />
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Activités Récentes</div>
                    </div>
                    <div>
                        {[1, 2, 3, 4].map(i => (
                            <div className="trans-item" key={i}>
                                <div className="d-flex align-items-center">
                                    <div className="trans-icon-box">
                                        <i className={`bi ${i % 2 === 0 ? 'bi-person-plus-fill' : 'bi-calendar-check-fill'}`}></i>
                                    </div>
                                    <div>
                                        <div className="trans-title">{i % 2 === 0 ? 'Nouvelle Inscription' : 'Session Planifiée'}</div>
                                        <div className="trans-sub">Aujourd'hui 10:{30 + i}</div>
                                    </div>
                                </div>
                                <div className="trans-amount" style={{ color: '#00d09c' }}>
                                    Succès
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Investment + Bar Chart (Simulation) */}
            <div className="dashboard-grid-row3">
                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Formateurs Top</div>
                        <div className="text-muted small">Ce mois <i className="bi bi-chevron-down"></i></div>
                    </div>
                    <div>
                        <div className="invest-item">
                            <div className="invest-icon"><i className="bi bi-person-circle"></i></div>
                            <div className="invest-info">
                                <h4>Ahmed Alami</h4>
                                <p>Expert Java</p>
                            </div>
                            <div className="invest-value">
                                <h4>4.9/5</h4>
                                <p>Note moy.</p>
                            </div>
                        </div>
                        <div className="invest-item">
                            <div className="invest-icon" style={{ background: 'rgba(255, 183, 77, 0.2)', color: '#ffb74d' }}><i className="bi bi-person-circle"></i></div>
                            <div className="invest-info">
                                <h4>Sarah Benoit</h4>
                                <p>Expert React</p>
                            </div>
                            <div className="invest-value">
                                <h4>4.8/5</h4>
                                <p>Note moy.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dubank-card">
                    <div className="chart-header">
                        <div className="card-title" style={{ marginBottom: 0 }}>Vues par page</div>
                        <div className="text-muted small">Derniers jours <i className="bi bi-chevron-down"></i></div>
                    </div>
                    <div style={{ height: '180px' }}>
                        {/* Placeholder for bar chart - reusing Line for now but configured like a bar visually if we had Bar component imported */}
                        <div className="d-flex align-items-end justify-content-between h-100 px-2 pb-2">
                            {[40, 60, 30, 70, 50, 80, 45, 60, 75].map((h, idx) => (
                                <div key={idx} style={{
                                    width: '8%',
                                    height: `${h}%`,
                                    background: idx % 2 === 0 ? '#6e6ce6' : '#d64374',
                                    borderRadius: '5px'
                                }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
