import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Note: Endpoint is assumed based on standard patterns or could be /auth/login
            const response = await axiosInstance.post('/auth/login', formData);
            const role = response.data?.role;

            // Store token/role/username
            localStorage.setItem('role', role);

            if (response.data.nom && response.data.prenom) {
                localStorage.setItem('username', `${response.data.nom} ${response.data.prenom}`);
            } else {
                // Fallback: Extract name from email (e.g., "sara.bennani@..." -> "Sara Bennani")
                const emailName = response.data.email.split('@')[0];
                const formattedName = emailName
                    .split(/[._-]/)
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(' ');
                localStorage.setItem('username', formattedName);
            }

            console.log("Login successful, role:", role);

            // Normalize role to handle any backend variations (admin, ADMIN, ROLE_ADMIN, etc.)
            const normalizedRole = role ? role.toString().toUpperCase().replace('ROLE_', '').trim() : '';

            if (normalizedRole === 'ADMIN') {
                navigate('/admin');
            } else if (normalizedRole === 'ASSISTANT') {
                navigate('/assistant');
            } else {
                // Default fallback
                navigate('/');
            }

        } catch (err) {
            console.error("Login Error Full Details:", err);
            if (err.response) {
                console.error("Data:", err.response.data);
                console.error("Status:", err.response.status);
                console.error("Headers:", err.response.headers);
            } else if (err.request) {
                console.error("No response received:", err.request);
            } else {
                console.error("Error setting up request:", err.message);
            }
            setError("Erreur de connexion : " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-person-circle display-1 text-primary"></i>
                                <h2 className="fw-bold mt-2">Bienvenue</h2>
                                <p className="text-muted">Connectez-vous à votre espace</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger py-2 border-0 small text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-pill">
                                            <i className="bi bi-envelope text-muted"></i>
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control bg-light border-0 rounded-end-pill py-2"
                                            placeholder="votre@email.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Mot de passe</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-pill">
                                            <i className="bi bi-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control bg-light border-0 rounded-end-pill py-2"
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 rounded-pill shadow fw-bold d-flex align-items-center justify-content-center"
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                    Se connecter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
