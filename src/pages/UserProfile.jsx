import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { statsAPI } from '../services/api';

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        try {
            const data = await statsAPI.getUserProfile(username);
            setProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                    <Link to="/leaderboard" className="btn btn-secondary">Back to Leaderboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Avatar */}
                    {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.username} className="avatar avatar-lg" />
                    ) : (
                        <div className="avatar avatar-lg avatar-placeholder">
                            {profile.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1 className="page-title mt-2">{profile.username}</h1>
                    {/* Member Since Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        marginTop: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        <span style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                        }}>
                            Thành viên từ: {new Date(profile.memberSince).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-value">{profile.stats?.totalCardsStudied || 0}</div>
                        <div className="stat-label">Cards Studied</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">{profile.stats?.currentStreak || 0}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value">{profile.stats?.longestStreak || 0}</div>
                        <div className="stat-label">Best Streak</div>
                    </div>
                </div>

                {/* Special Badges */}
                {profile.specialBadges?.length > 0 && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>⭐ Special Badges</h2>
                            <span className="badge badge-exclusive">{profile.specialBadges.length} exclusive</span>
                        </div>

                        <div className="achievements-grid">
                            {profile.specialBadges.map(badge => (
                                <div key={badge.id} className="achievement-card exclusive unlocked">
                                    <div className="achievement-icon">{badge.icon}</div>
                                    <div className="achievement-info">
                                        <div className="achievement-name">{badge.name}</div>
                                        <div className="achievement-desc">{badge.description}</div>
                                    </div>
                                    <div className="achievement-check">⭐</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {profile.achievements?.length > 0 && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Achievements</h2>
                            <span className="badge">{profile.achievements.length} unlocked</span>
                        </div>

                        <div className="achievements-grid">
                            {profile.achievements.map(achievement => (
                                <div key={achievement.id} className="achievement-card unlocked">
                                    <div className="achievement-icon">{achievement.icon}</div>
                                    <div className="achievement-info">
                                        <div className="achievement-name">{achievement.name}</div>
                                        <div className="achievement-desc">{achievement.description}</div>
                                    </div>
                                    <div className="achievement-check">✓</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-3">
                    <Link to="/leaderboard" className="btn btn-secondary">
                        ← Back to Leaderboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
