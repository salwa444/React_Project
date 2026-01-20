import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Menu updated to match "Premium" feel icons
    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
        { path: '/admin/formations', label: 'Formations', icon: 'bi-journal-album' },
        { path: '/admin/formateurs', label: 'Formateurs', icon: 'bi-people-fill' },
        { path: '/admin/entreprises', label: 'Entreprises', icon: 'bi-building-fill' },
        { path: '/admin/planning', label: 'Planification', icon: 'bi-calendar-event-fill' },
        { path: '/admin/inscriptions', label: 'Inscriptions', icon: 'bi-person-badge-fill' },
        { path: '/admin/evaluations', label: 'Évaluations', icon: 'bi-star-fill' },
        { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'bi-gear-fill' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* Left Sidebar (Blue) */}
            <aside className="admin-sidebar">
                <Link to="/" className="sidebar-logo">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    <span>AdminPanel</span>
                </Link>

                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li className="menu-item" key={item.path}>
                            <Link
                                to={item.path}
                                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="menu-link text-white-50 bg-transparent border-0 w-100 text-start">
                        <i className="bi bi-box-arrow-left"></i>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Topbar */}
                <header className="topbar">
                    <div className="search-wrapper">
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="user-profile d-flex align-items-center gap-3">
                        <button className="icon-btn position-relative me-2">
                            <i className="bi bi-bell"></i>
                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                        </button>
                        <div className="text-end d-none d-sm-block">
                            <span className="d-block fw-bold text-white small">{localStorage.getItem('username') || 'Admin'}</span>
                            <span className="d-block text-white-50 very-small" style={{ fontSize: '0.75rem' }}>Administrateur</span>
                        </div>
                        <div className="avatar-circle">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet context={{ searchTerm }} />
            </main>
        </div>
    );
};

export default AdminLayout;
