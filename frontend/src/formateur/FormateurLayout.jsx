import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../admin/Admin.css'; // Reusing Admin CSS for consistent premium look
import axiosInstance from '../api/axiosConfig';

const FormateurLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Formateur');

    const [searchTerm, setSearchTerm] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('username');

        if (storedName) {
            setUserName(storedName);
        }

        if (email) {
            axiosInstance.get(`/formateur/me?email=${email}`)
                .then(res => {
                    if (res.data && res.data.nom) {
                        setUserName(res.data.nom);
                        // Update local storage if needed or just local state
                    }
                })
                .catch(err => {
                    console.error("Error fetching formateur info", err);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const menuItems = [
        { path: '/formateur/formations', icon: 'bi-journal-bookmark', label: 'Mes Formations' },
        { path: '/formateur/calendrier', icon: 'bi-calendar-week', label: 'Calendrier' },
        { path: '/formateur/evaluations', icon: 'bi-star', label: 'Mes Évaluations' },
    ];

    return (
        <div className="admin-container">
            {/* Sidebar (Blue style from Admin.css) */}
            <aside className="admin-sidebar">
                <Link to="/formateur" className="sidebar-logo">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    <span>Espace Formateur</span>
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
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Rechercher une formation..."
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
                                src={`https://ui-avatars.com/api/?name=${userName}&background=764ba2&color=fff`}
                                alt="Formateur"
                                className="avatar me-2"
                            />
                            <div className="d-none d-md-block">
                                <div className="fw-bold text-white small">{userName}</div>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Formateur</div>
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

export default FormateurLayout;
