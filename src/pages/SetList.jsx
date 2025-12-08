import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setsAPI } from '../services/api';

export default function SetList() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadSets();
    }, []);

    const loadSets = async () => {
        try {
            const data = await setsAPI.getAll();
            setSets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (id, title, e) => {
        e.stopPropagation();
        e.preventDefault();
        setDeleteModal({ show: true, id, title });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, id: null, title: '' });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        setDeleting(true);
        try {
            await setsAPI.delete(deleteModal.id);
            setSets(sets.filter(s => s._id !== deleteModal.id));
            closeDeleteModal();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="page-title">My Study Sets</h1>
                    <Link to="/create" className="btn btn-primary">
                        Create New Set
                    </Link>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {sets.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">No study sets yet</h3>
                        <p className="text-secondary">Create your first set to start learning!</p>
                        <Link to="/create" className="btn btn-primary mt-3">
                            Create Set
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {sets.map((set) => (
                            <div key={set._id} className="set-card fade-in">
                                <h3 className="set-card-title">{set.title}</h3>
                                <p className="set-card-desc">
                                    {set.description || 'No description'}
                                </p>
                                <div className="set-card-meta">
                                    <span>{set.cards?.length || 0} cards</span>
                                    <span>{new Date(set.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="set-card-actions">
                                    <Link to={`/study/${set._id}`} className="btn btn-primary btn-sm">
                                        Study
                                    </Link>
                                    <Link to={`/quiz/${set._id}`} className="btn btn-secondary btn-sm">
                                        Quiz
                                    </Link>
                                    <Link to={`/edit/${set._id}`} className="btn btn-secondary btn-sm">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => openDeleteModal(set._id, set.title, e)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card fade-in" style={{
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginBottom: '12px' }}>Delete Set?</h3>
                        <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
                            Are you sure you want to delete "<strong>{deleteModal.title}</strong>"?
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeDeleteModal}
                                className="btn btn-secondary"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn btn-danger"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
