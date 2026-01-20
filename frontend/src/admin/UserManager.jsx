import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useOutletContext } from 'react-router-dom';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const { searchTerm } = useOutletContext();

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
        role: 'VISITOR'
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axiosInstance.put(`/users/${formData.id}`, formData);
            } else {
                await axiosInstance.post('/users', formData);
            }
            fetchUsers();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Erreur: " + (err.response?.data || "Une erreur est survenue"));
        }
    };

    const handleEdit = (user) => {
        setFormData({
            id: user.id,
            email: user.email,
            password: '', // Don't fill password on edit
            nom: user.nom || '',
            prenom: user.prenom || '',
            telephone: user.telephone || '',
            role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'VISITOR'
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Confirmer la suppression ?')) {
            try {
                await axiosInstance.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            email: '',
            password: '',
            nom: '',
            prenom: '',
            telephone: '',
            role: 'VISITOR'
        });
        setIsEditing(false);
    };

    const filteredUsers = users.filter(user =>
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dubank-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title text-white mb-0" style={{ fontSize: '1.25rem' }}>Gestion des Utilisateurs</h3>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 p-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Mot de passe {isEditing && '(Laisser vide pour ne pas changer)'}</label>
                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Rôle</label>
                        <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="ASSISTANT">ASSISTANT</option>
                            <option value="FORMATEUR">FORMATEUR</option>
                            <option value="VISITOR">VISITOR</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Nom</label>
                        <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Prénom</label>
                        <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Téléphone</label>
                        <input type="text" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} />
                    </div>
                </div>
                <div className="mt-3">
                    <button type="submit" className={`btn btn-${isEditing ? 'warning' : 'primary'} me-2`}>
                        {isEditing ? 'Modifier' : 'Ajouter'}
                    </button>
                    {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>}
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="fw-bold">{user.nom} {user.prenom}</div>
                                    <div className="small text-muted">{user.telephone}</div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {user.roles && user.roles.map(r => (
                                        <span key={r.id} className="badge bg-dark me-1">{r.name}</span>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(user)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">Aucun utilisateur trouvé pour "{searchTerm}".</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
