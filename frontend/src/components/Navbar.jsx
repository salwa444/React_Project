import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-visitor sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="bi bi-mortarboard-fill me-2 text-primary"></i>
                    Centre de Formation
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="btn btn-outline-primary border-0 me-2 rounded-pill px-4 fw-bold bg-white shadow-sm" to="/register-formateur" style={{ color: '#2563eb' }}>
                                Devenir Formateur
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-login rounded-pill px-4 fw-bold" to="/login">
                                Connexion
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
