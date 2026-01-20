import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import '../admin/Admin.css'; // Reuse Admin styles

const AssistantLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const [searchTerm, setSearchTerm] = React.useState(''); // Global search state

    // Assistant-specific menu items
    const menuItems = [
        { path: '/assistant', label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: '/assistant/entreprises', label: 'Entreprises', icon: 'bi-building' },
        { path: '/assistant/planification', label: 'Planification', icon: 'bi-calendar-event' },
        { path: '/assistant/inscriptions', label: 'Inscriptions', icon: 'bi-people' },
        { path: '/assistant/evaluations', label: 'Évaluations', icon: 'bi-star' },
    ];

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <Link to="/assistant" className="sidebar-logo">
                    <i className="bi bi-person-workspace me-2"></i>
                    <span>AssistantPanel</span>
                </Link>

                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li className="menu-item" key={item.path}>
                            <Link
                                to={item.path}
                                className={`menu-link ${location.pathname === item.path || (item.path === '/assistant' && location.pathname === '/assistant/dashboard') ? 'active' : ''}`}
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
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '20px' }}
                        />
                    </div>

                    <div className="user-profile">
                        <button className="icon-btn">
                            <i className="bi bi-bell"></i>
                            <span className="badge-dot"></span>
                        </button>
                        <div className="d-flex align-items-center ms-2">
                            <img
                                src={`https://ui-avatars.com/api/?name=${localStorage.getItem('username') || 'A U'}&background=10b981&color=fff`}
                                alt="Assistant"
                                className="avatar me-2"
                                style={{ boxShadow: '0 0 0 2px #10b981' }} // Green for Assistant
                            />
                            <div className="d-none d-md-block">
                                <div className="fw-bold text-white small">{localStorage.getItem('username') || 'Assistant'}</div>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Assistant</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet context={{ searchTerm }} />
            </main>
        </div>
    );
};

export default AssistantLayout;
