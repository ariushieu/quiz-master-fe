import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setsAPI } from '../services/api';

// --- Levenshtein distance ---
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function checkAnswer(userInput, correctTerm) {
    const input = userInput.trim().toLowerCase();
    const correct = correctTerm.trim().toLowerCase();

    if (!input) return 'wrong';
    if (input === correct) return 'correct';

    const distance = levenshtein(input, correct);
    const threshold = correct.length <= 5 ? 1 : 2;

    if (distance <= threshold) return 'close';
    return 'wrong';
}

const WORD_COUNT_OPTIONS = [5, 10, 15, 20];

export default function VocabularyPractice() {
    const { id } = useParams();
    const inputRef = useRef(null);

    const [set, setSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Setup
    const [screen, setScreen] = useState('setup'); // 'setup' | 'practice' | 'result'
    const [wordCount, setWordCount] = useState(null);

    // Practice
    const [practiceCards, setPracticeCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null); // null | { status, correctAnswer }
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const data = await setsAPI.getOne(id);
                setSet(data);
            } catch (err) {
                setError(err.message || 'Failed to load set');
            } finally {
                setLoading(false);
            }
        };
        fetchSet();
    }, [id]);

    // Autofocus input on each new card
    useEffect(() => {
        if (screen === 'practice' && !feedback) {
            inputRef.current?.focus();
        }
    }, [currentIndex, screen, feedback]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startPractice = () => {
        const shuffled = shuffleArray(set.cards);
        const count = wordCount === 'all' ? shuffled.length : wordCount;
        setPracticeCards(shuffled.slice(0, count));
        setCurrentIndex(0);
        setUserInput('');
        setFeedback(null);
        setAnswers([]);
        setScreen('practice');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (feedback) return;

        const card = practiceCards[currentIndex];
        const result = checkAnswer(userInput, card.term);

        setFeedback({
            status: result,
            correctAnswer: card.term
        });

        setAnswers(prev => [...prev, {
            definition: card.definition,
            term: card.term,
            note: card.note,
            userAnswer: userInput.trim(),
            result
        }]);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= practiceCards.length) {
            setScreen('result');
        } else {
            setCurrentIndex(prev => prev + 1);
            setUserInput('');
            setFeedback(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && feedback) {
            e.preventDefault();
            handleNext();
        }
    };

    const retryAll = () => {
        setWordCount(null);
        setScreen('setup');
    };

    const retryWrong = () => {
        const wrongCards = answers
            .filter(a => a.result !== 'correct')
            .map(a => ({
                term: a.term,
                definition: a.definition,
                note: a.note
            }));

        if (wrongCards.length === 0) return;

        setPracticeCards(shuffleArray(wrongCards));
        setCurrentIndex(0);
        setUserInput('');
        setFeedback(null);
        setAnswers([]);
        setScreen('practice');
    };

    // --- LOADING ---
    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    // --- ERROR ---
    if (error) {
        if (error.includes('Access denied') || error.includes('403')) {
            return (
                <div className="page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
                        <h2 style={{ marginBottom: '16px' }}>Private Set</h2>
                        <p className="text-secondary" style={{ marginBottom: '32px' }}>
                            This set is private. You do not have permission to view it.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Link to="/explore" className="btn btn-primary">Explore Public Sets</Link>
                            <Link to="/sets" className="btn btn-secondary">Back to Sets</Link>
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

    // --- EMPTY SET ---
    if (!set || !set.cards || set.cards.length === 0) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center', paddingTop: '60px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
                    <h2 style={{ marginBottom: '16px' }}>Chưa có thẻ nào</h2>
                    <p className="text-muted" style={{ marginBottom: '32px' }}>
                        Bộ thẻ này chưa có thẻ nào. Hãy thêm thẻ trước khi ôn tập.
                    </p>
                    <Link to="/sets" className="btn btn-secondary">Quay về danh sách</Link>
                </div>
            </div>
        );
    }

    // ========================
    // SCREEN 1: SETUP
    // ========================
    if (screen === 'setup') {
        const totalCards = set.cards.length;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <Link to="/sets" className="text-muted">← Quay về danh sách</Link>

                    <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
                        <h1 style={{ marginBottom: '8px' }}>Ôn tập từ vựng</h1>
                        <h3 style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{set.title}</h3>
                        <p className="text-muted">{totalCards} thẻ có sẵn</p>
                    </div>

                    <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>Chọn số từ muốn ôn tập</h4>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        {WORD_COUNT_OPTIONS.map(count => (
                            <button
                                key={count}
                                className={`btn ${wordCount === count ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setWordCount(count)}
                                disabled={totalCards < count}
                                style={{
                                    padding: '16px 8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    opacity: totalCards < count ? 0.4 : 1
                                }}
                            >
                                {count}
                            </button>
                        ))}
                    </div>

                    <button
                        className={`btn ${wordCount === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setWordCount('all')}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '24px'
                        }}
                    >
                        Tất cả ({totalCards} từ)
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={startPractice}
                        disabled={!wordCount}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            opacity: !wordCount ? 0.5 : 1
                        }}
                    >
                        Bắt đầu ôn tập
                    </button>
                </div>
            </div>
        );
    }

    // ========================
    // SCREEN 2: PRACTICE
    // ========================
    if (screen === 'practice') {
        const card = practiceCards[currentIndex];
        const progress = ((currentIndex + (feedback ? 1 : 0)) / practiceCards.length) * 100;
        const isLast = currentIndex + 1 >= practiceCards.length;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    {/* Progress */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="text-muted">Ôn tập từ vựng</span>
                            <span className="text-muted">{currentIndex + 1} / {practiceCards.length}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Definition card */}
                    <div className="card mb-3 fade-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
                        <p className="text-muted" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                            Nghĩa tiếng Việt:
                        </p>
                        <h2 style={{ marginBottom: card.note ? '16px' : '0', lineHeight: '1.4' }}>
                            {card.definition}
                        </h2>
                        {card.note && (
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem',
                                fontStyle: 'italic',
                                marginBottom: 0
                            }}>
                                Ghi chú: {card.note}
                            </p>
                        )}
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSubmit}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)'
                        }}>
                            Nhập thuật ngữ tiếng Anh:
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-input mb-2"
                            placeholder="Type the English term..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!!feedback}
                            autoComplete="off"
                            style={feedback ? { opacity: 0.7 } : {}}
                        />
                        {!feedback && (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                            >
                                Kiểm tra
                            </button>
                        )}
                    </form>

                    {/* Feedback */}
                    {feedback && (
                        <div className="fade-in" style={{
                            marginTop: '16px',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-lg, 12px)',
                            ...(feedback.status === 'correct' ? {
                                background: 'rgba(76, 175, 80, 0.1)',
                                border: '1px solid rgba(76, 175, 80, 0.3)'
                            } : feedback.status === 'close' ? {
                                background: 'rgba(255, 152, 0, 0.1)',
                                border: '1px solid rgba(255, 152, 0, 0.3)'
                            } : {
                                background: 'rgba(244, 67, 54, 0.1)',
                                border: '1px solid rgba(244, 67, 54, 0.3)'
                            })
                        }}>
                            {feedback.status === 'correct' && (
                                <div style={{ color: 'var(--success, #4caf50)', fontWeight: '600', fontSize: '1.05rem' }}>
                                    ✅ Chính xác!
                                </div>
                            )}
                            {feedback.status === 'close' && (
                                <div>
                                    <div style={{ color: 'var(--warning, #ff9800)', fontWeight: '600', fontSize: '1.05rem', marginBottom: '4px' }}>
                                        🤏 Gần đúng!
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Đáp án: <strong style={{ color: 'var(--warning, #ff9800)' }}>{feedback.correctAnswer}</strong>
                                    </div>
                                </div>
                            )}
                            {feedback.status === 'wrong' && (
                                <div>
                                    <div style={{ color: 'var(--error, #f44336)', fontWeight: '600', fontSize: '1.05rem', marginBottom: '4px' }}>
                                        ❌ Sai rồi
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Đáp án: <strong style={{ color: 'var(--success, #4caf50)' }}>{feedback.correctAnswer}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Next button */}
                    {feedback && (
                        <button
                            onClick={handleNext}
                            className="btn btn-primary fade-in"
                            style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '1rem' }}
                        >
                            {isLast ? 'Xem kết quả' : 'Tiếp theo →'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ========================
    // SCREEN 3: RESULT
    // ========================
    if (screen === 'result') {
        const correctCount = answers.filter(a => a.result === 'correct').length;
        const closeCount = answers.filter(a => a.result === 'close').length;
        const wrongCount = answers.filter(a => a.result === 'wrong').length;
        const total = answers.length;
        const percentage = Math.round((correctCount / total) * 100);
        const hasWrong = closeCount + wrongCount > 0;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '700px' }}>
                    {/* Score summary */}
                    <div className="card mb-3 fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
                            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                        </div>
                        <h2 style={{ marginBottom: '12px' }}>Kết quả ôn tập</h2>
                        <p style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--error)'
                        }}>
                            {correctCount} / {total} ({percentage}%)
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            marginTop: '16px',
                            fontSize: '0.95rem'
                        }}>
                            <span style={{ color: 'var(--success, #4caf50)' }}>✅ {correctCount} đúng</span>
                            {closeCount > 0 && (
                                <span style={{ color: 'var(--warning, #ff9800)' }}>🤏 {closeCount} gần đúng</span>
                            )}
                            {wrongCount > 0 && (
                                <span style={{ color: 'var(--error, #f44336)' }}>❌ {wrongCount} sai</span>
                            )}
                        </div>
                    </div>

                    {/* Detail review */}
                    <h3 style={{ marginBottom: '16px' }}>Chi tiết</h3>

                    {answers.map((answer, idx) => (
                        <div
                            key={idx}
                            className="card mb-2 fade-in"
                            style={{
                                borderLeft: `4px solid ${answer.result === 'correct'
                                    ? 'var(--success, #4caf50)'
                                    : answer.result === 'close'
                                        ? 'var(--warning, #ff9800)'
                                        : 'var(--error, #f44336)'
                                    }`,
                                animationDelay: `${idx * 0.05}s`
                            }}
                        >
                            <div style={{ marginBottom: '8px' }}>
                                <strong style={{ fontSize: '1rem' }}>{answer.definition}</strong>
                                <span style={{
                                    marginLeft: '8px',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }}>
                                    → {answer.term}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: answer.result === 'correct'
                                    ? 'var(--success, #4caf50)'
                                    : answer.result === 'close'
                                        ? 'var(--warning, #ff9800)'
                                        : 'var(--error, #f44336)'
                            }}>
                                {answer.result === 'correct' && '✅ '}
                                {answer.result === 'close' && '🤏 '}
                                {answer.result === 'wrong' && '❌ '}
                                Bạn nhập: {answer.userAnswer || '(bỏ trống)'}
                            </div>
                        </div>
                    ))}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                        <button onClick={retryAll} className="btn btn-primary">
                            Làm lại
                        </button>
                        {hasWrong && (
                            <button onClick={retryWrong} className="btn btn-secondary">
                                Chỉ ôn từ sai ({closeCount + wrongCount})
                            </button>
                        )}
                        <Link to="/sets" className="btn btn-secondary">
                            Quay về danh sách
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
