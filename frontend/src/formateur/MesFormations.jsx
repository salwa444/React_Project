import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FormateurService from '../api/FormateurService';

const MesFormations = () => {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { searchTerm: globalSearchTerm } = useOutletContext(); // Get global search term

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        // Use globalSearchTerm instead of local searchTerm
        filterAndSortSessions(globalSearchTerm);
    }, [sessions, globalSearchTerm, sortConfig]);

    const fetchSessions = async () => {
        try {
            const data = await FormateurService.getSessions();
            setSessions(data || []);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des sessions:', err);
            setLoading(false);
        }
    };

    const filterAndSortSessions = (term) => {
        let filtered = [...sessions];

        // Recherche
        if (term) {
            filtered = filtered.filter(session =>
                session.formationTitre?.toLowerCase().includes(term.toLowerCase()) ||
                session.entrepriseNom?.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Tri
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'dateDebut') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredSessions(filtered);
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up text-muted ms-1"></i>;
        return sortConfig.direction === 'asc'
            ? <i className="bi bi-arrow-up text-primary ms-1"></i>
            : <i className="bi bi-arrow-down text-primary ms-1"></i>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSessions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dubank-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem' }}>
                    <i className="bi bi-journal-bookmark me-2"></i>
                    Mes Formations
                </h2>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                    <i className="bi bi-list-check me-2"></i>
                    {filteredSessions.length} formation(s)
                </span>
            </div>

            {/* Tableau */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th className="py-3 px-4" style={{ cursor: 'pointer' }} onClick={() => handleSort('formationTitre')}>
                                Formation {getSortIcon('formationTitre')}
                            </th>
                            <th className="py-3" style={{ cursor: 'pointer' }} onClick={() => handleSort('dateDebut')}>
                                Dates {getSortIcon('dateDebut')}
                            </th>
                            <th className="py-3" style={{ cursor: 'pointer' }} onClick={() => handleSort('entrepriseNom')}>
                                Entreprise {getSortIcon('entrepriseNom')}
                            </th>
                            <th className="py-3" style={{ cursor: 'pointer' }} onClick={() => handleSort('participantCount')}>
                                Participants {getSortIcon('participantCount')}
                            </th>
                            <th className="py-3">Lieu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((session, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-book text-primary"></i>
                                            </div>
                                            <div>
                                                <div className="fw-semibold">{session.formationTitre || 'N/A'}</div>
                                                <small className="text-muted">Session #{session.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div>
                                            <i className="bi bi-calendar-event me-2 text-muted"></i>
                                            {formatDate(session.dateDebut)} - {formatDate(session.dateFin)}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                            <i className="bi bi-building me-1"></i>
                                            {session.entrepriseNom || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                            <i className="bi bi-people me-1"></i>
                                            {session.participantCount || 0} participant(s)
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <i className="bi bi-geo-alt me-1 text-muted"></i>
                                        {session.lieu || 'Non spécifié'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    Aucune formation trouvée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            Affichage {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredSessions.length)} sur {filteredSessions.length}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link bg-dark border-secondary text-white" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link bg-dark border-secondary text-white" onClick={() => setCurrentPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link bg-dark border-secondary text-white" onClick={() => setCurrentPage(currentPage + 1)}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesFormations;
