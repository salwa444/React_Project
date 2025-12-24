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
            const { role } = response.data;

            // Store token/role if needed (simplified for this task)
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'admin') navigate('/admin');
            else if (role === 'assistant') navigate('/assistant');
            else navigate('/dashboard');

        } catch (err) {
            setError("Email ou mot de passe incorrect.");
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
