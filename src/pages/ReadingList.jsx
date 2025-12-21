import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import readingService from '../services/readingService';
import { useAuth } from '../context/AuthContext';

const ReadingList = () => {
    const { user } = useAuth();
    const [passages, setPassages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPassages = async () => {
            try {
                const data = await readingService.getPassages();
                setPassages(data);
            } catch (err) {
                setError('Failed to load reading passages');
            } finally {
                setLoading(false);
            }
        };

        fetchPassages();
    }, []);

    const getLevelColor = (level) => {
        if (level.includes('Band 7')) return 'bg-purple-100 text-purple-800';
        if (level.includes('Band 6')) return 'bg-blue-100 text-blue-800';
        if (level.includes('Band 5')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header text-center">
                    <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                        IELTS Reading Practice
                    </h1>
                    <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Improve your reading skills with authentic IELTS passages and interactive questions.
                    </p>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="alert alert-error text-center">{error}</div>
                ) : (
                    <div className="grid-responsive" style={{ gap: '24px' }}>
                        {passages.map((passage) => (
                            <Link
                                to={`/reading/${passage._id}`}
                                key={passage._id}
                                className="reading-card group"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}
                            >
                                {/* Decorative Header Gradient */}
                                <div style={{
                                    height: '6px',
                                    background: passage.level.includes('7') ? 'linear-gradient(90deg, #a855f7, #d946ef)' :
                                        passage.level.includes('6') ? 'linear-gradient(90deg, #3b82f6, #06b6d4)' :
                                            'linear-gradient(90deg, #22c55e, #10b981)'
                                }} />

                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                                    {/* Top Metadata */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {passage.level}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(passage.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        marginBottom: '12px',
                                        color: 'var(--text-primary)',
                                        lineHeight: '1.3'
                                    }} className="group-hover:text-primary transition-colors">
                                        {passage.title}
                                    </h3>

                                    {/* Topic */}
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
                                        <span style={{ opacity: 0.6 }}>Topic:</span> {passage.topic}
                                    </p>

                                    {/* Bottom Action */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '16px',
                                        borderTop: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--primary)' }}>
                                            Start Practice
                                        </span>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: 'var(--primary-subtle)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'transform 0.2s ease'
                                        }} className="group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        boxShadow: 'inset 0 0 0 1px var(--primary-subtle)',
                                        borderRadius: '16px'
                                    }}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingList;
