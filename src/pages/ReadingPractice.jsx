import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import readingService from '../services/readingService';
import ReadingText from '../components/reading/ReadingText';
import QuestionGroup from '../components/reading/QuestionGroup';
import Toast from '../components/Toast';
import StudyTimer from '../components/StudyTimer';

const ReadingPractice = () => {
    const { id } = useParams();
    const [passage, setPassage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        setShowConfirmModal(true);
    };

    const confirmSubmit = () => {
        setShowConfirmModal(false);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelSubmit = () => {
        setShowConfirmModal(false);
    };

    // Calculate score
    const calculateScore = () => {
        if (!passage || !showResults) {
            return { correct: 0, total: 0, percentage: 0 };
        }
        
        let correct = 0;
        let total = 0;
        
        passage.questions.forEach(q => {
            if (q.type === 'table-completion') {
                // Count each blank in the table
                if (q.tableStructure && q.tableStructure.rows) {
                    q.tableStructure.rows.forEach(row => {
                        row.cells.forEach(cell => {
                            if (cell.type === 'blank') {
                                total++;
                                const userAnswer = answers[cell.blankId];
                                if (userAnswer && String(cell.answer).trim().toLowerCase() === String(userAnswer).trim().toLowerCase()) {
                                    correct++;
                                }
                            }
                        });
                    });
                }
            } else {
                // Regular questions
                total++;
                const userAnswer = answers[q._id];
                const isAnswerCorrect = isCorrect(q, userAnswer);
                if (isAnswerCorrect) {
                    correct++;
                }
            }
        });
        
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        return { correct, total, percentage };
    };

    // Helper function to check if answer is correct
    const isCorrect = (question, userAnswer) => {
        if (!userAnswer) return false;
        
        const correctAnswers = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer 
            : [question.correctAnswer];
        
        // If multiple correct answers expected
        if (correctAnswers.length > 1) {
            if (!Array.isArray(userAnswer)) return false;
            
            if (userAnswer.length !== correctAnswers.length) return false;
            
            const normalizedCorrect = correctAnswers.map(a => String(a).trim().toLowerCase()).sort();
            const normalizedUser = userAnswer.map(a => String(a).trim().toLowerCase()).sort();
            
            return normalizedCorrect.every((val, idx) => val === normalizedUser[idx]);
        }
        
        // Single answer
        const correct = String(correctAnswers[0]).trim().toLowerCase();
        const user = Array.isArray(userAnswer) 
            ? (userAnswer.length === 1 ? String(userAnswer[0]).trim().toLowerCase() : '')
            : String(userAnswer).trim().toLowerCase();
        
        return correct === user;
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
                        {passage.level}{passage.topic ? ` • ${passage.topic}` : ''}
                    </span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
                    <ReadingText title={passage.title} content={passage.passageText} />
                </div>
            </div>

            {/* Right Panel: Questions (Scrollable) */}
            <div className="split-pane-panel no-scrollbar" style={{ overflowY: 'auto', background: 'var(--bg-base)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', padding: '24px' }}>
                    {/* Results Summary Card - Show after submit */}
                    {showResults && (
                        <ResultsCard score={calculateScore()} />
                    )}
                    
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
                            {showResults ? 'Review your answers below' : 'Answer the questions based on the text. Click \'Submit\' when you are done.'}
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

            {/* Confirm Submit Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>
                                Submit Your Answers?
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                Once submitted, you won't be able to change your answers. Make sure you've reviewed all questions.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={cancelSubmit}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'var(--bg-base)'}
                                onMouseOut={(e) => e.target.style.background = 'var(--bg-surface)'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubmit}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <StudyTimer isActive={!loading && !showResults} />
        </div>
    );
};

// Results Card Component
const ResultsCard = ({ score }) => {
    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#22c55e';
        if (percentage >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="card" style={{ 
            marginBottom: '24px', 
            background: `linear-gradient(135deg, ${getScoreColor(score.percentage)}15, ${getScoreColor(score.percentage)}05)`,
            border: `3px solid ${getScoreColor(score.percentage)}`,
            boxShadow: `0 8px 24px ${getScoreColor(score.percentage)}40`,
            padding: '32px'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    📊 Your Results
                </h2>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '32px',
                    flexWrap: 'wrap',
                    marginBottom: '16px'
                }}>
                    <div>
                        <div style={{ 
                            fontSize: '3rem', 
                            fontWeight: 'bold', 
                            color: getScoreColor(score.percentage),
                            lineHeight: 1
                        }}>
                            {score.percentage}%
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Score
                        </div>
                    </div>
                    
                    <div style={{ 
                        height: '60px', 
                        width: '1px', 
                        background: 'var(--border)' 
                    }} />
                    
                    <div>
                        <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: 'bold', 
                            color: 'var(--text-primary)'
                        }}>
                            {score.correct}/{score.total}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Correct Answers
                        </div>
                    </div>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                }}>
                    <span style={{ color: '#22c55e' }}>✓ {score.correct} Correct</span>
                    <span>•</span>
                    <span style={{ color: '#ef4444' }}>✗ {score.total - score.correct} Incorrect</span>
                </div>
            </div>
        </div>
    );
};

export default ReadingPractice;
