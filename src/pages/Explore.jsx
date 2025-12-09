import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setsAPI } from '../services/api';

export default function Explore() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPublicSets();
        // Track for quest
        localStorage.setItem('quest_explore', 'true');
    }, []);

    const loadPublicSets = async () => {
        try {
            const data = await setsAPI.getPublicSets();
            setSets(data);
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

    return (
        <div className="page">
            <div className="container">
                <div className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 className="page-title">Community Library</h1>
                    <p className="text-secondary" style={{ maxWidth: '600px', margin: '10px auto' }}>
                        Explore and study high-quality sets created by the QuizMaster community.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {sets.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <span style={{ fontSize: '48px' }}>🌏</span>
                        </div>
                        <h3 className="empty-state-title">No public sets yet</h3>
                        <p className="text-secondary">Be the first to share your knowledge with the world!</p>
                        <Link to="/create" className="btn btn-primary mt-3">
                            Create Public Set
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {sets.map((set) => (
                            <div key={set._id} className="set-card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 className="set-card-title">{set.title}</h3>
                                    </div>
                                    <p className="set-card-desc">
                                        {set.description || 'No description'}
                                    </p>
                                </div>

                                <div className="set-card-meta">
                                    <span>{set.cards?.length || 0} terms</span>
                                    <span>By {set.userId?.username || 'Unknown'}</span>
                                </div>
                                <div className="set-card-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <Link to={`/study/${set._id}`} className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
                                        Study
                                    </Link>
                                    <Link to={`/quiz/${set._id}`} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                                        Quiz
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
