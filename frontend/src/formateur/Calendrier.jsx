import React, { useEffect, useState } from 'react';
import FormateurService from '../api/FormateurService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendrier = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const data = await FormateurService.getSessions();
            const calendarEvents = (data || []).map(session => ({
                id: session.id,
                title: session.formationTitre || 'Formation',
                start: session.dateDebut,
                end: session.dateFin,
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                extendedProps: {
                    entreprise: session.entrepriseNom || 'N/A',
                    participants: session.participantCount || 0,
                    lieu: session.lieu || 'Non spécifié'
                }
            }));
            setEvents(calendarEvents);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des sessions:', err);
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        setSelectedEvent({
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            entreprise: info.event.extendedProps.entreprise,
            participants: info.event.extendedProps.participants,
            lieu: info.event.extendedProps.lieu
        });
        setShowModal(true);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

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
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="fw-bold mb-0 text-white">
                        <i className="bi bi-calendar-week me-2 text-primary"></i>
                        Calendrier des Formations
                    </h2>
                    <p className="text-muted">Vue d'ensemble de vos sessions planifiées</p>
                </div>
            </div>

            <div className="dubank-card">
                <div className="card-body p-4 bg-light rounded text-dark">
                    {/* FullCalendar is complex to style fully dark, so keeping card body light for contrast/readability for now, wrapped in dubank-card structure */}
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale="fr"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                        buttonText={{
                            today: "Aujourd'hui",
                            month: 'Mois',
                            week: 'Semaine'
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        height="auto"
                        eventDisplay="block"
                        displayEventTime={false}
                    />
                </div>
            </div>

            {/* Modal pour les détails */}
            {showModal && selectedEvent && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow bg-dark text-white">
                            <div className="modal-header bg-dark border-bottom border-secondary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Détails de la Formation
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <h6 className="text-muted mb-2">
                                        <i className="bi bi-book me-2"></i>
                                        Formation
                                    </h6>
                                    <p className="fw-bold fs-5 mb-0">{selectedEvent.title}</p>
                                </div>

                                <hr className="border-secondary" />

                                <div className="mb-3">
                                    <h6 className="text-muted mb-2">
                                        <i className="bi bi-calendar-range me-2"></i>
                                        Période
                                    </h6>
                                    <p className="mb-1">
                                        <strong>Début:</strong> {formatDate(selectedEvent.start)}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Fin:</strong> {formatDate(selectedEvent.end)}
                                    </p>
                                </div>

                                <hr className="border-secondary" />

                                <div className="mb-3">
                                    <h6 className="text-muted mb-2">
                                        <i className="bi bi-building me-2"></i>
                                        Entreprise
                                    </h6>
                                    <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                        {selectedEvent.entreprise}
                                    </span>
                                </div>

                                <hr className="border-secondary" />

                                <div className="mb-3">
                                    <h6 className="text-muted mb-2">
                                        <i className="bi bi-people me-2"></i>
                                        Participants
                                    </h6>
                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                        {selectedEvent.participants} participant(s)
                                    </span>
                                </div>

                                <hr className="border-secondary" />

                                <div className="mb-0">
                                    <h6 className="text-muted mb-2">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        Lieu
                                    </h6>
                                    <p className="mb-0">{selectedEvent.lieu}</p>
                                </div>
                            </div>
                            <div className="modal-footer border-top border-secondary bg-dark">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendrier;
