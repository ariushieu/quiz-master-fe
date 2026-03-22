import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setsAPI } from '../services/api';

export default function Oxford3000() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOxfordSets();
    }, []);

    const loadOxfordSets = async () => {
        try {
            setLoading(true);
            const data = await setsAPI.getPublicSets();
            // Filter only Oxford 3000 sets and sort them by part number
            const oxfordSets = data.filter(set => set.title.includes('Oxford 3000')).sort((a, b) => {
                const numA = parseInt(a.title.match(/Part (\d+)/)[1]);
                const numB = parseInt(b.title.match(/Part (\d+)/)[1]);
                return numA - numB;
            });
            setSets(oxfordSets);
        } catch (err) {
            setError('Failed to load Oxford 3000 vocabulary sets.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 className="page-title">📚 Oxford 3000 Core Vocabulary</h1>
                    <p className="text-secondary" style={{ maxWidth: '600px', margin: '10px auto' }}>
                        The 3000 most important words to learn in English, divided into 33 easy-to-learn milestones.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="grid grid-3">
                    {sets.map(set => (
                        <div key={set._id} className="set-card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: 'auto' }}>
                                <h3 className="set-card-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                                    {set.title}
                                </h3>
                                <p className="set-card-desc" style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                                    {set.description || 'No description'}
                                </p>
                            </div>

                            <div className="set-card-meta" style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                                <span>🃏 {set.cards?.length || 0} terms</span>
                            </div>
                            
                            <div className="set-card-actions" style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
                                <Link to={`/study/${set._id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                                    Start Studying
                                </Link>
                                <Link to={`/quiz/${set._id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                                    Quiz
                                </Link>
                            </div>
                        </div>
                    ))}

                    {sets.length === 0 && !error && (
                        <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                            <h3 className="empty-state-title">No Oxford sets found</h3>
                            <p className="text-secondary">Please run the database seed script.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
