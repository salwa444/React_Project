import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-gradient" to="/">
                    <i className="bi bi-mortarboard-fill me-2"></i>
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
                            <Link className="btn btn-outline-info me-2 mb-2 mb-lg-0 rounded-pill px-4" to="/register-formateur">
                                S'inscrire comme formateur
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-primary rounded-pill px-4" to="/login">
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
