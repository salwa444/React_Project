
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

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
                console.error("Erreur lors de la récupération des stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const doughnutData = {
        labels: ['Formations', 'Formateurs', 'Entreprises', 'Participants'],
        datasets: [
            {
                data: [stats.formations, stats.formateurs, stats.entreprises, stats.participants],
                backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
                hoverBackgroundColor: ['#0b5ed7', '#157347', '#ffca2c', '#bb2d3b'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [
            {
                label: 'Inscriptions',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
            },
        ],
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div>
            <h2 className="mb-4 fw-bold">Tableau de Bord</h2>

            <div className="row mb-4">
                {[
                    { label: 'Formations', value: stats.formations, icon: 'bi-journal-text', color: 'primary' },
                    { label: 'Formateurs', value: stats.formateurs, icon: 'bi-people', color: 'success' },
                    { label: 'Entreprises', value: stats.entreprises, icon: 'bi-building', color: 'warning' },
                    { label: 'Inscriptions', value: stats.participants, icon: 'bi-person-check', color: 'danger' }
                ].map((item, idx) => (
                    <div className="col-md-3" key={idx}>
                        <div className={`card card-stat shadow-sm mb-3 bg-${item.color} text-white`}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="card-title mb-0">{item.label}</h6>
                                    <h3 className="mb-0 fw-bold">{item.value}</h3>
                                </div>
                                <i className={`bi ${item.icon} fs-1 opacity-50`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-5 mb-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                        <h5 className="card-title fw-bold mb-4">Répartition des ressources</h5>
                        <div className="d-flex justify-content-center">
                            <div style={{ width: '80%' }}>
                                <Doughnut data={doughnutData} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 mb-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                        <h5 className="card-title fw-bold mb-4">Évolution des inscriptions</h5>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
