import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studyAPI, setsAPI } from '../services/api';
import FlashCard from '../components/FlashCard';
import AIChat from '../components/AIChat';

export default function Study() {
    const { id } = useParams();

    const [setData, setSetData] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sessionComplete, setSessionComplete] = useState(false);
    const [stats, setStats] = useState({ studied: 0, total: 0 });

    // AI Chat state
    const [showAIChat, setShowAIChat] = useState(false);

    useEffect(() => {
        loadStudyData();
    }, [id]);

    const loadStudyData = async () => {
        try {
            const data = await studyAPI.getCards(id);
            setSetData(data);

            if (data.cards.length === 0) {
                const fullSet = await setsAPI.getOne(id);
                setCards(fullSet.cards.map((c, i) => ({ ...c, cardIndex: i })));
                setStats({ studied: 0, total: fullSet.cards.length });
            } else {
                setCards(data.cards);
                setStats({ studied: 0, total: data.dueCards });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (quality) => {
        try {
            await studyAPI.submitReview(id, cards[currentIndex].cardIndex, quality);

            setStats(prev => ({ ...prev, studied: prev.studied + 1 }));

            if (currentIndex >= cards.length - 1) {
                setSessionComplete(true);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        } catch (err) {
            console.error('Review error:', err);
        }
    };

    const handleAskAI = () => {
        setShowAIChat(true);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        if (error.includes('Access denied') || error.includes('403')) {
            return (
                <div className="page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
                        <h2 style={{ marginBottom: '16px' }}>Private Set</h2>
                        <p className="text-secondary" style={{ marginBottom: '32px' }}>
                            This set is private. You do not have permission to view or study it.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Link to="/explore" className="btn btn-primary">
                                Explore Public Sets
                            </Link>
                            <Link to="/sets" className="btn btn-secondary">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                    <Link to="/sets" className="btn btn-secondary">Back to Sets</Link>
                </div>
            </div>
        );
    }

    if (sessionComplete) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <div className="card fade-in" style={{ padding: '48px 32px' }}>
                        <div className="feature-icon" style={{ margin: '0 auto 20px', width: '64px', height: '64px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2>Session Complete!</h2>
                        <p className="text-secondary mt-2 mb-3">
                            You studied {stats.studied} cards. Great job!
                        </p>
                        <div className="flex flex-center gap-2">
                            <button onClick={() => {
                                setSessionComplete(false);
                                setCurrentIndex(0);
                                loadStudyData();
                            }} className="btn btn-primary">
                                Study Again
                            </button>
                            <Link to="/sets" className="btn btn-secondary">
                                Back to Sets
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <div className="card" style={{ padding: '48px 32px' }}>
                        <div className="feature-icon" style={{ margin: '0 auto 20px', width: '64px', height: '64px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h2>All caught up!</h2>
                        <p className="text-secondary mt-2 mb-3">
                            No cards are due for review right now. Come back later!
                        </p>
                        <Link to="/sets" className="btn btn-primary">
                            Back to Sets
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex) / cards.length) * 100;

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '640px' }}>
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Link to="/sets" className="text-secondary" style={{ fontSize: '0.9rem' }}>← Back</Link>
                            <Link to={`/quiz/${id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                                🎮 Quiz Mode
                            </Link>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {currentIndex + 1} / {cards.length}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <FlashCard
                    key={currentIndex}
                    term={currentCard.term}
                    definition={currentCard.definition}
                    onAskAI={handleAskAI}
                />

                <p className="text-center text-muted mt-2 mb-3" style={{ fontSize: '0.85rem' }}>
                    Click card to flip • Use buttons for audio & AI help
                </p>

                <div className="study-controls">
                    <button onClick={() => handleReview(0)} className="study-btn again">
                        Again
                    </button>
                    <button onClick={() => handleReview(2)} className="study-btn hard">
                        Hard
                    </button>
                    <button onClick={() => handleReview(4)} className="study-btn good">
                        Good
                    </button>
                    <button onClick={() => handleReview(5)} className="study-btn easy">
                        Easy
                    </button>
                </div>

                <p className="text-center text-muted mt-3" style={{ fontSize: '0.8rem' }}>
                    Rate how well you knew this card
                </p>
            </div>

            {/* AI Chat */}
            {showAIChat && (
                <AIChat
                    term={currentCard.term}
                    definition={currentCard.definition}
                    onClose={() => setShowAIChat(false)}
                />
            )}
        </div>
    );
}
