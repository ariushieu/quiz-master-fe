import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';

const Avatar = ({ src, username, className, placeholderClassName }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={placeholderClassName}>
                {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={username}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

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

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    // Pagination Logic for 'rest'
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentRestUsers = rest.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(rest.length / usersPerPage);

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="page-header" style={{ textAlign: 'center', marginBottom: '90px' }}>
                    <h1 className="page-title">Bảng Xếp Hạng Streak</h1>
                </div>

                {/* PODIUM SECTION */}
                <div className="podium-container" style={{ marginTop: '60px' }}>
                    {/* Rank 2 - Silver */}
                    {top3[1] && (
                        <div className="podium-item rank-2 silver">
                            <div className="podium-rank-label">Top 2</div>
                            <div className="podium-avatar-container">
                                <Avatar
                                    src={top3[1].avatar}
                                    username={top3[1].username}
                                    className="podium-avatar"
                                    placeholderClassName="podium-avatar-placeholder"
                                />
                                <div className="podium-badge">2</div>
                            </div>
                            <div className="podium-info">
                                <div className="podium-name">{top3[1].username}</div>
                                <div className="podium-score">{top3[1].streak} ngày</div>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 - Gold */}
                    {top3[0] && (
                        <div className="podium-item rank-1 gold">
                            <div className="podium-rank-label" style={{ color: '#fbbf24', top: '-45px' }}>Top 1</div>
                            <div className="podium-avatar-container">
                                <Avatar
                                    src={top3[0].avatar}
                                    username={top3[0].username}
                                    className="podium-avatar"
                                    placeholderClassName="podium-avatar-placeholder"
                                />
                                <div className="podium-badge">1</div>
                            </div>
                            <div className="podium-info">
                                <div className="podium-name">{top3[0].username}</div>
                                <div className="podium-score">{top3[0].streak} ngày</div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 - Bronze */}
                    {top3[2] && (
                        <div className="podium-item rank-3 bronze">
                            <div className="podium-rank-label">Top 3</div>
                            <div className="podium-avatar-container">
                                <Avatar
                                    src={top3[2].avatar}
                                    username={top3[2].username}
                                    className="podium-avatar"
                                    placeholderClassName="podium-avatar-placeholder"
                                />
                                <div className="podium-badge">3</div>
                            </div>
                            <div className="podium-info">
                                <div className="podium-name">{top3[2].username}</div>
                                <div className="podium-score">{top3[2].streak} ngày</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* LIST SECTION */}
                <div className="leaderboard-list">
                    {currentRestUsers.map((user, index) => {
                        const realRank = 4 + index + (currentPage - 1) * usersPerPage;
                        return (
                            <Link
                                key={user.username}
                                to={`/user/${user.username}`}
                                className="leaderboard-row"
                            >
                                <div className="lb-rank-num">{realRank}</div>

                                <div className="lb-avatar-small green-border">
                                    <Avatar
                                        src={user.avatar}
                                        username={user.username}
                                        className="" /* CSS handles styling via parent .lb-avatar-small img */
                                        placeholderClassName="lb-avatar-placeholder-small"
                                    />
                                    <div className={`lb-status-dot ${user.streak > 0 ? 'online' : ''}`}></div>
                                </div>

                                <div className="lb-user-info">
                                    <div className="lb-name">
                                        {user.username}
                                    </div>
                                </div>

                                <div className="lb-score-col">
                                    <div className="lb-score-label">Streak</div>
                                    <div className="lb-score-val">{user.streak} ngày</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* PAGINATION */}
                {rest.length > usersPerPage && (
                    <div className="pagination-controls text-center mt-3">
                        <button
                            className="btn btn-sm btn-secondary"
                            disabled={currentPage === 1}
                            onClick={() => changePage(currentPage - 1)}
                            style={{ marginRight: '10px' }}
                        >
                            Previous
                        </button>
                        <span className="page-indicator" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => changePage(currentPage + 1)}
                            style={{ marginLeft: '10px' }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {leaderboard.length === 0 && (
                    <div className="empty-state">
                        <p>Chưa có ai học. Hãy là người đầu tiên!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
