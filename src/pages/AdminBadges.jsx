import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

export default function AdminBadges() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, badgesData] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getBadges()
            ]);
            setUsers(usersData);
            setBadges(badgesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGrantBadge = async (userId, badgeId) => {
        setActionLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const result = await adminAPI.grantBadge(userId, badgeId);
            setSuccessMsg(result.message);
            // Refresh user list
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRevokeBadge = async (userId, badgeId) => {
        setActionLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const result = await adminAPI.revokeBadge(userId, badgeId);
            setSuccessMsg(result.message);
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Check if current user is admin
    if (user?.role !== 'admin') {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">
                        ⛔ Bạn không có quyền truy cập trang này
                    </div>
                    <Link to="/" className="btn btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="page-header">
                    <h1 className="page-title">🛡️ Admin - Quản lý Badge</h1>
                    <p className="text-secondary">Cấp và thu hồi exclusive badges cho người dùng</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                {/* Available Badges */}
                <div className="admin-section">
                    <h2>⭐ Available Special Badges</h2>
                    <div className="badges-preview">
                        {badges.map(badge => (
                            <div key={badge.id} className="badge-preview-item">
                                <span className="badge-icon">{badge.icon}</span>
                                <div className="badge-info">
                                    <div className="badge-name">{badge.name}</div>
                                    <div className="badge-desc">{badge.description}</div>
                                </div>
                                <code className="badge-id">{badge.id}</code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Users List */}
                <div className="admin-section">
                    <h2>👥 Users ({users.length})</h2>
                    <div className="users-list">
                        {users.map(u => (
                            <div key={u.id} className={`user-card ${selectedUser === u.id ? 'selected' : ''}`}>
                                <div className="user-info" onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)}>
                                    {u.avatar ? (
                                        <img src={u.avatar} alt={u.username} className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar placeholder">
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="user-details">
                                        <div className="user-name">
                                            {u.username}
                                            {u.role === 'admin' && <span className="admin-badge">ADMIN</span>}
                                        </div>
                                        <div className="user-email">{u.email}</div>
                                        <div className="user-badges">
                                            {u.specialBadges.map(badgeId => {
                                                const badge = badges.find(b => b.id === badgeId);
                                                return badge ? (
                                                    <span key={badgeId} className="user-badge-tag">
                                                        {badge.icon} {badge.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                    <span className="expand-icon">{selectedUser === u.id ? '▼' : '▶'}</span>
                                </div>

                                {selectedUser === u.id && (
                                    <div className="user-actions">
                                        <h4>Cấp / Thu hồi Badge:</h4>
                                        <div className="badge-actions">
                                            {badges.map(badge => {
                                                const hasBadge = u.specialBadges.includes(badge.id);
                                                return (
                                                    <div key={badge.id} className="badge-action-item">
                                                        <span className="badge-label">
                                                            {badge.icon} {badge.name}
                                                        </span>
                                                        {hasBadge ? (
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleRevokeBadge(u.id, badge.id)}
                                                                disabled={actionLoading}
                                                            >
                                                                Thu hồi
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleGrantBadge(u.id, badge.id)}
                                                                disabled={actionLoading}
                                                            >
                                                                Cấp badge
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-3">
                    <Link to="/profile" className="btn btn-secondary">← Về Profile</Link>
                </div>
            </div>
        </div>
    );
}
