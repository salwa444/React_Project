
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: '/admin/formations', label: 'Formations', icon: 'bi-journal-text' },
        { path: '/admin/formateurs', label: 'Formateurs', icon: 'bi-people' },
        { path: '/admin/entreprises', label: 'Entreprises', icon: 'bi-building' },
        { path: '/admin/planning', label: 'Planification', icon: 'bi-calendar3' },
        { path: '/admin/inscriptions', label: 'Inscriptions', icon: 'bi-person-check' },
        { path: '/admin/evaluations', label: 'Évaluations', icon: 'bi-star' },
        { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'bi-person-gear' },
    ];

    return (
        <div className="container-fluid p-0">
            <div className="row g-0">
                {/* Sidebar */}
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white admin-sidebar">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 text-white min-vh-100">
                        <Link to="/admin" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none border-bottom w-100">
                            <span className="fs-4 d-none d-sm-inline text-dark fw-bold text-primary">Admin Panel</span>
                        </Link>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100 mt-3" id="menu">
                            {menuItems.map((item) => (
                                <li className="nav-item w-100" key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`nav-link align-middle px-3 py-2 ${location.pathname === item.path ? 'active' : ''}`}
                                    >
                                        <i className={`bi ${item.icon} fs-5 me-2`}></i>
                                        <span className="ms-1 d-none d-sm-inline">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <div className="dropdown pb-4 w-100">
                            <Link to="/" className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle fs-4 me-2"></i>
                                <span className="d-none d-sm-inline mx-1">Admin</span>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-light shadow text-small" aria-labelledby="dropdownUser1">
                                <li><Link className="dropdown-item" to="/">Retour au site</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/login">Déconnexion</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col py-4 px-4 admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
