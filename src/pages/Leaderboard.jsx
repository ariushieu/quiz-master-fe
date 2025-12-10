import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await statsAPI.getLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return 'gold';
        if (rank === 2) return 'silver';
        if (rank === 3) return 'bronze';
        return '';
    };

    const getRankEmoji = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
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
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="page-header" style={{ textAlign: 'center' }}>
                    <h1 className="page-title">🔥 Top Streak</h1>
                    <p className="text-secondary mt-1">Những người học chăm chỉ nhất</p>
                </div>

                <div className="leaderboard-list">
                    {leaderboard.map((user) => (
                        <Link
                            key={user.username}
                            to={`/user/${user.username}`}
                            className={`leaderboard-item ${getRankStyle(user.rank)}`}
                        >
                            <div className="lb-rank">{getRankEmoji(user.rank)}</div>

                            {/* Avatar */}
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.username} className="lb-avatar" />
                            ) : (
                                <div className="lb-avatar-placeholder">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="lb-user">
                                <div className="lb-username">{user.username}</div>
                                <div className="lb-stats">
                                    <span>📚 {user.cardsStudied} cards</span>
                                    <span>🏆 Best: {user.longestStreak} days</span>
                                </div>
                            </div>
                            <div className="lb-streak">
                                <span className="lb-streak-value">
                                    <span
                                        className={user.streak > 0 ? "streak-fire" : "streak-static"}
                                        data-text={user.streak > 0 ? "🔥" : ""}
                                    >
                                        🔥
                                    </span>
                                    {user.streak}
                                </span>
                                <span className="lb-streak-label">day streak</span>
                            </div>
                        </Link>
                    ))}

                    {leaderboard.length === 0 && (
                        <div className="empty-state">
                            <p>Chưa có ai học. Hãy là người đầu tiên!</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-3">
                    <Link to="/profile" className="btn btn-secondary">
                        View My Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
