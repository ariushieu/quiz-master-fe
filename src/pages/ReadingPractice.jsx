import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import readingService from '../services/readingService';
import ReadingText from '../components/reading/ReadingText';
import QuestionGroup from '../components/reading/QuestionGroup';
import Toast from '../components/Toast';

const ReadingPractice = () => {
    const { id } = useParams();
    const [passage, setPassage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [toast, setToast] = useState(null);

    const handleCloseToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        const fetchPassage = async () => {
            try {
                const data = await readingService.getPassageById(id);
                setPassage(data);
            } catch (err) {
                setError('Failed to load reading passage');
            } finally {
                setLoading(false);
            }
        };

        fetchPassage();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        if (showResults) return; // Disable changes after submit
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        if (window.confirm("Are you sure you want to submit?")) {
            setShowResults(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

    useEffect(() => {
        if (showResults) return; // Stop timer when results shown
        if (timeLeft <= 0) {
            setShowResults(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setToast({ message: "Time's up! Answers submitted automatically.", type: 'info' });
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, showResults]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        // ... (existing loading)
        <div className="loading">
            <div className="spinner"></div>
        </div>
    );
    // ... (existing error)
    if (error) return (
        <div className="alert alert-error text-center" style={{ margin: '40px' }}>
            {error} <Link to="/reading" style={{ textDecoration: 'underline' }}>Go Back</Link>
        </div>
    );

    if (!passage) return null;

    return (
        <div className="split-pane-container">
            {/* Left Panel: Reading Text (Scrollable) */}
            <div className="split-pane-panel text-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                        <Link to="/reading" className="btn btn-sm btn-secondary">
                            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </Link>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            fontFamily: 'monospace',
                            color: timeLeft < 300 ? '#ff4d4f' : 'var(--primary)',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            lineHeight: 1
                        }}>
                            ⏱ {formatTime(timeLeft)}
                        </div>
                    </div>

                    <span className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {passage.level} • {passage.topic}
                    </span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
                    <ReadingText title={passage.title} content={passage.passageText} />
                </div>
            </div>

            {/* Right Panel: Questions (Scrollable) */}
            <div className="split-pane-panel no-scrollbar" style={{ overflowY: 'auto', background: 'var(--bg-base)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', padding: '24px' }}>
                    <div className="card text-center" style={{ marginBottom: '24px' }}>
                        <h2 style={{ marginBottom: '12px' }}>Questions</h2>

                        {/* Question Palette */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                            {passage.questions.map((_, index) => {
                                const qId = passage.questions[index]._id;
                                const isAnswered = answers[qId];
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            background: isAnswered ? 'var(--primary)' : 'var(--bg-elevated)',
                                            color: isAnswered ? '#fff' : 'var(--text-secondary)',
                                            border: '1px solid var(--border)',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            cursor: 'default'
                                            // In future, adding IDs to QuestionGroup allows navigation: onClick={() => document.getElementById(`q-${index}`).scrollIntoView()}
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                            Answer the questions based on the text. Click 'Submit' when you are done.
                        </p>
                    </div>

                    <QuestionGroup
                        questions={passage.questions}
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        showResults={showResults}
                    />

                    <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {!showResults ? (
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary btn-lg"
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <Link
                                to="/reading"
                                className="btn btn-secondary btn-lg"
                            >
                                Finish Review
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
        </div>
    );
};

export default ReadingPractice;
