import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    const location = useLocation();

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
                    <Link to="/login" className="menu-link text-white-50">
                        <i className="bi bi-box-arrow-left"></i>
                        <span>Déconnexion</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Topbar */}
                <header className="topbar">
                    <div className="search-bar">
                        <i className="bi bi-search search-icon"></i>
                        <input type="text" className="search-input" placeholder="Rechercher..." />
                    </div>

                    <div className="user-profile">
                        <button className="icon-btn">
                            <i className="bi bi-bell"></i>
                            <span className="badge-dot"></span>
                        </button>
                        <button className="icon-btn">
                            <i className="bi bi-gear"></i>
                        </button>
                        <div className="d-flex align-items-center ms-2">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff"
                                alt="Admin"
                                className="avatar me-2"
                            />
                            <div className="d-none d-md-block">
                                <div className="fw-bold text-dark small">Super Admin</div>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Administrateur</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
