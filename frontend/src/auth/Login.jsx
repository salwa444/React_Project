import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import '../Visitor.css';

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
            const response = await axiosInstance.post('/auth/login', formData);
            const role = response.data?.role;

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            localStorage.setItem('role', role);
            localStorage.setItem('userEmail', response.data.email);

            if (response.data.nom && response.data.prenom) {
                localStorage.setItem('username', `${response.data.nom} ${response.data.prenom}`);
            } else {
                const emailName = response.data.email.split('@')[0];
                const formattedName = emailName.split(/[._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                localStorage.setItem('username', formattedName);
            }

            const normalizedRole = role ? role.toString().toUpperCase().replace('ROLE_', '').trim() : '';

            if (normalizedRole === 'ADMIN') {
                navigate('/admin');
            } else if (normalizedRole === 'ASSISTANT') {
                navigate('/assistant');
            } else if (normalizedRole === 'FORMATEUR') {
                navigate('/formateur');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError("Identifiants incorrects. Veuillez réessayer.");
            setLoading(false);
        }
    };

    return (
        <div className="login-container-space">
            {/* Background Spheres for Ambience */}
            <div className="sphere sphere-1"></div>
            <div className="sphere sphere-2"></div>

            <div className="login-card-space">
                {/* Visual Composition */}
                <div className="login-visual-comp">
                    <div className="sphere-main">
                        <div className="login-title-space">
                            Sign<br /><strong>in</strong>
                        </div>
                    </div>
                    <div className="sphere-small-blue"></div>
                    <div className="sphere-small-orange"></div>
                </div>

                {error && (
                    <div className="alert alert-danger py-1 small bg-transparent border-0 text-danger mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-space-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email / Username"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-space-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="login-footer-links text-end mb-3">
                        <Link to="/forgot-password" className="small">Forgot you password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="btn-space-login"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <div className="login-footer-links text-center mt-4">
                        <Link to="/" className="text-white text-decoration-none">Don't have an account? Go Home</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
