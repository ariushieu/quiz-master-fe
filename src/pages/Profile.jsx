import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, uploadAPI } from '../services/api';

export default function Profile() {
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [specialBadges, setSpecialBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const [statsData, achievementsData] = await Promise.all([
                statsAPI.getMyStats(),
                statsAPI.getAchievements()
            ]);
            setStats(statsData);
            // Handle new response format with achievements and specialBadges
            if (achievementsData.achievements) {
                setAchievements(achievementsData.achievements);
                setSpecialBadges(achievementsData.specialBadges || []);
            } else {
                // Fallback for old format
                setAchievements(achievementsData);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadAPI.uploadAvatar(file);
            setStats(prev => ({ ...prev, avatar: result.avatar }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const unlockedSpecialBadges = specialBadges.filter(b => b.unlocked);

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Upload Loading Overlay */}
                    {uploading && (
                        <div className="upload-loading">
                            <div className="spinner"></div>
                            <p className="mt-2">Đang tải ảnh lên...</p>
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="avatar-container" onClick={handleAvatarClick} style={{ display: 'flex', justifyContent: 'center' }}>
                        {stats?.avatar ? (
                            <img src={stats.avatar} alt="Avatar" className="avatar avatar-lg" />
                        ) : (
                            <div className="avatar avatar-lg avatar-placeholder">
                                {stats?.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                        <div className="avatar-overlay">
                            {uploading ? '⏳' : '📷'}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <h1 className="page-title mt-2">{stats?.username || 'My Profile'}</h1>
                </div>

                {/* Stats Overview */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-value">{stats?.stats?.totalCardsStudied || 0}</div>
                        <div className="stat-label">Cards Studied</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">{stats?.stats?.currentStreak || 0}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value">{stats?.stats?.longestStreak || 0}</div>
                        <div className="stat-label">Best Streak</div>
                    </div>
                </div>

                {/* Special Badges Section */}
                {unlockedSpecialBadges.length > 0 && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>⭐ Special Badges</h2>
                            <span className="badge badge-exclusive">{unlockedSpecialBadges.length} exclusive</span>
                        </div>

                        <div className="achievements-grid">
                            {unlockedSpecialBadges.map(badge => (
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
                <div className="profile-section">
                    <div className="section-header">
                        <h2>Achievements</h2>
                        <span className="badge">{unlockedCount} / {achievements.length}</span>
                    </div>

                    <div className="achievements-grid">
                        {achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-info">
                                    <div className="achievement-name">{achievement.name}</div>
                                    <div className="achievement-desc">{achievement.description}</div>
                                </div>
                                {achievement.unlocked && (
                                    <div className="achievement-check">✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="profile-actions">
                    <Link to="/leaderboard" className="btn btn-secondary">
                        View Leaderboard
                    </Link>
                    <Link to="/sets" className="btn btn-primary">
                        Continue Learning
                    </Link>
                </div>
            </div>
        </div>
    );
}
