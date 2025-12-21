import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import readingService from '../services/readingService';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('content');
    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [passages, setPassages] = useState([]);
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
            const [usersData, badgesData, passagesData] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getBadges(),
                readingService.getPassages()
            ]);
            setUsers(usersData);
            setBadges(badgesData);
            setPassages(passagesData);
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

    const handleDeletePassage = async (id, title) => {
        if (!window.confirm(`Bạn có chắc muốn xóa bài "${title}"?`)) return;

        setActionLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await readingService.deletePassage(id);
            setSuccessMsg('Passage deleted successfully');
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to delete passage');
        } finally {
            setActionLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">⛔ Access Denied. Admin only.</div>
                    <Link to="/" className="btn btn-secondary">← Back Home</Link>
                </div>
            </div>
        );
    }

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    const tabs = [
        { id: 'content', label: 'Content', icon: '📚' },
        { id: 'users', label: 'Users & Badges', icon: '👥' },
        { id: 'system', label: 'System', icon: '⚙️' }
    ];

    return (
        <div style={{ minHeight: 'calc(100vh - 74px)', background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    padding: '24px 32px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '8px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Manage content, users, and system settings
                        </p>
                    </div>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem'
                    }}>
                        🛡️
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '32px',
                    padding: '6px',
                    background: 'var(--bg-elevated)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                background: activeTab === tab.id
                                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                    : 'transparent',
                                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>{error}</div>}
                {successMsg && <div className="alert alert-success" style={{ marginBottom: '24px' }}>{successMsg}</div>}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                padding: '24px 32px',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>Reading Passages</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create and manage IELTS reading content</p>
                                </div>
                                <Link to="/reading/create" style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>+</span>
                                    Create New Passage
                                </Link>
                            </div>

                            <div style={{ padding: '16px' }}>
                                {passages.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            margin: '0 auto 20px',
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem'
                                        }}>
                                            📖
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)' }}>No passages yet. Create your first one!</p>
                                    </div>
                                ) : (
                                    passages.map(p => (
                                        <div
                                            key={p._id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '16px 20px',
                                                background: 'var(--bg-surface)',
                                                borderRadius: '12px',
                                                marginBottom: '10px',
                                                border: '1px solid var(--border)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: '700'
                                                }}>
                                                    📄
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{p.title}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                                                        <span>{p.level}</span>
                                                        <span>•</span>
                                                        <span>{p.topic}</span>
                                                        <span>•</span>
                                                        <span>{p.questions?.length || 0} questions</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link
                                                    to={`/reading/${p._id}`}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: 'var(--bg-elevated)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '8px',
                                                        color: 'var(--text-primary)',
                                                        textDecoration: 'none',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/reading/edit/${p._id}`}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: 'rgba(59, 130, 246, 0.2)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#3b82f6',
                                                        textDecoration: 'none',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeletePassage(p._id, p.title)}
                                                    disabled={actionLoading}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: 'rgba(239, 68, 68, 0.2)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#ef4444',
                                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        opacity: actionLoading ? 0.5 : 1
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                padding: '24px 32px',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>User Management</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {users.length} registered users • Grant or revoke special badges
                                </p>
                            </div>

                            <div style={{ padding: '16px' }}>
                                {users.map(u => (
                                    <div
                                        key={u.id}
                                        style={{
                                            background: selectedUser === u.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-surface)',
                                            borderRadius: '16px',
                                            marginBottom: '12px',
                                            border: selectedUser === u.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border)',
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div
                                            onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)}
                                            style={{
                                                padding: '16px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt={u.username} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontWeight: '700',
                                                        fontSize: '1.2rem'
                                                    }}>
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {u.username}
                                                        {u.role === 'admin' && (
                                                            <span style={{
                                                                fontSize: '10px',
                                                                padding: '2px 8px',
                                                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                                color: '#fff',
                                                                borderRadius: '6px',
                                                                fontWeight: '700'
                                                            }}>ADMIN</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                                    {u.specialBadges.length > 0 && (
                                                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                                            {u.specialBadges.map(badgeId => {
                                                                const badge = badges.find(b => b.id === badgeId);
                                                                return badge ? (
                                                                    <span key={badgeId} style={{ fontSize: '0.8rem' }}>{badge.icon}</span>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'var(--bg-base)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--text-secondary)',
                                                transition: 'transform 0.2s ease',
                                                transform: selectedUser === u.id ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}>
                                                ▼
                                            </div>
                                        </div>

                                        {selectedUser === u.id && (
                                            <div style={{
                                                padding: '16px 20px',
                                                borderTop: '1px solid var(--border)',
                                                background: 'var(--bg-base)'
                                            }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Manage Badges
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                                    {badges.map(badge => {
                                                        const hasBadge = u.specialBadges.includes(badge.id);
                                                        return (
                                                            <div key={badge.id} style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '10px 14px',
                                                                background: 'var(--bg-elevated)',
                                                                borderRadius: '10px',
                                                                border: '1px solid var(--border)'
                                                            }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{badge.name}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => hasBadge ? handleRevokeBadge(u.id, badge.id) : handleGrantBadge(u.id, badge.id)}
                                                                    disabled={actionLoading}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '600',
                                                                        background: hasBadge
                                                                            ? 'rgba(239, 68, 68, 0.2)'
                                                                            : 'rgba(34, 197, 94, 0.2)',
                                                                        color: hasBadge ? '#ef4444' : '#22c55e',
                                                                        opacity: actionLoading ? 0.5 : 1
                                                                    }}
                                                                >
                                                                    {hasBadge ? 'Revoke' : 'Grant'}
                                                                </button>
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
                    </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                borderRadius: '20px',
                                padding: '24px',
                                color: '#fff'
                            }}>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>Total Users</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{users.length}</div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                borderRadius: '20px',
                                padding: '24px',
                                color: '#fff'
                            }}>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>Active Badges</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{badges.length}</div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '20px',
                                padding: '24px',
                                color: '#fff'
                            }}>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>Admins</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{users.filter(u => u.role === 'admin').length}</div>
                            </div>
                        </div>

                        {/* Badge Registry */}
                        <div style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>Badge Registry</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All available special badges in the system</p>
                            </div>
                            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                                {badges.map(badge => (
                                    <div key={badge.id} style={{
                                        padding: '20px',
                                        background: 'var(--bg-surface)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{badge.icon}</div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{badge.name}</div>
                                        <code style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '2px 8px', borderRadius: '4px' }}>{badge.id}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
