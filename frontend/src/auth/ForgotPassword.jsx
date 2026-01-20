import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Visitor.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
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
                        <div className="login-title-space" style={{ fontSize: '2rem' }}>
                            Pass<br /><strong>Reset</strong>
                        </div>
                    </div>
                    <div className="sphere-small-blue"></div>
                    <div className="sphere-small-orange"></div>
                </div>

                {!submitted ? (
                    <>
                        <p className="text-muted mb-4 small">
                            Enter your email address to verify your account and receive a password reset link.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-space-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-space-login"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Verify Email'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center fade-in">
                        <div className="mb-3">
                            <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#00d09c' }}></i>
                        </div>
                        <h4 className="fw-bold mb-3">Email Sent!</h4>
                        <p className="text-muted small mb-4">
                            If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
                        </p>
                    </div>
                )}

                <div className="login-footer-links text-center mt-4">
                    <Link to="/login" className="text-white text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
