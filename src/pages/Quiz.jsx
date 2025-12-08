import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setsAPI } from '../services/api';

export default function Quiz() {
    const { id } = useParams();

    const [set, setSet] = useState(null);
    const [quizType, setQuizType] = useState(null); // 'multiple', 'written', 'matching'
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSet();
    }, [id]);

    const loadSet = async () => {
        try {
            const data = await setsAPI.getOne(id);
            setSet(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startQuiz = (type) => {
        setQuizType(type);
        setCurrentIndex(0);
        setUserAnswers([]);
        setShowResult(false);

        const shuffledCards = shuffleArray(set.cards);

        if (type === 'multiple') {
            // Multiple choice questions
            const qs = shuffledCards.map((card, idx) => {
                const wrongAnswers = shuffleArray(
                    set.cards.filter((c, i) => i !== set.cards.indexOf(card))
                ).slice(0, 3).map(c => c.definition);

                const options = shuffleArray([card.definition, ...wrongAnswers]);

                return {
                    question: card.term,
                    correctAnswer: card.definition,
                    options,
                    type: 'multiple'
                };
            });
            setQuestions(qs);
        } else if (type === 'written') {
            // Fill in the blank
            const qs = shuffledCards.map(card => ({
                question: card.term,
                correctAnswer: card.definition,
                type: 'written'
            }));
            setQuestions(qs);
        } else if (type === 'matching') {
            // Take first 5 cards for matching
            const matchCards = shuffledCards.slice(0, Math.min(5, shuffledCards.length));
            const terms = matchCards.map(c => c.term);
            const definitions = shuffleArray(matchCards.map(c => c.definition));

            setQuestions([{
                terms,
                definitions,
                correctPairs: matchCards.map(c => ({ term: c.term, definition: c.definition })),
                type: 'matching'
            }]);
        }
    };

    const handleMultipleChoice = (selectedOption) => {
        const isCorrect = selectedOption === questions[currentIndex].correctAnswer;
        setUserAnswers([...userAnswers, {
            question: questions[currentIndex].question,
            userAnswer: selectedOption,
            correctAnswer: questions[currentIndex].correctAnswer,
            isCorrect
        }]);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const [writtenInput, setWrittenInput] = useState('');

    const handleWrittenSubmit = (e) => {
        e.preventDefault();
        const correct = questions[currentIndex].correctAnswer.toLowerCase();
        const userAns = writtenInput.trim().toLowerCase();
        const isCorrect = correct === userAns;

        setUserAnswers([...userAnswers, {
            question: questions[currentIndex].question,
            userAnswer: writtenInput,
            correctAnswer: questions[currentIndex].correctAnswer,
            isCorrect
        }]);

        setWrittenInput('');

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const [matchingSelections, setMatchingSelections] = useState({});
    const [usedDefinitions, setUsedDefinitions] = useState([]);

    const handleMatchingSelect = (term, definition) => {
        const newSelections = { ...matchingSelections, [term]: definition };
        setMatchingSelections(newSelections);
        setUsedDefinitions([...usedDefinitions, definition]);
    };

    const handleMatchingSubmit = () => {
        const q = questions[0];
        let correct = 0;
        const answers = q.correctPairs.map(pair => {
            const isCorrect = matchingSelections[pair.term] === pair.definition;
            if (isCorrect) correct++;
            return {
                question: pair.term,
                userAnswer: matchingSelections[pair.term] || '(not selected)',
                correctAnswer: pair.definition,
                isCorrect
            };
        });
        setUserAnswers(answers);
        setShowResult(true);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                    <Link to="/sets" className="btn btn-secondary">Back to Sets</Link>
                </div>
            </div>
        );
    }

    // Quiz type selection
    if (!quizType) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <Link to="/sets" className="text-muted">← Back to Sets</Link>
                    <h1 style={{ marginTop: '24px', marginBottom: '8px' }}>{set?.title}</h1>
                    <p className="text-muted mb-3">{set?.cards.length} cards</p>

                    <h3 style={{ marginBottom: '20px' }}>Choose Quiz Type</h3>

                    <div className="card mb-2" style={{ cursor: 'pointer' }} onClick={() => startQuiz('multiple')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '2rem' }}>📝</span>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>Multiple Choice</h4>
                                <p className="text-muted" style={{ marginBottom: 0 }}>
                                    Choose the correct definition from 4 options
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-2" style={{ cursor: 'pointer' }} onClick={() => startQuiz('written')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '2rem' }}>✍️</span>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>Written</h4>
                                <p className="text-muted" style={{ marginBottom: 0 }}>
                                    Type the definition yourself
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ cursor: 'pointer' }} onClick={() => startQuiz('matching')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '2rem' }}>🔗</span>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>Matching</h4>
                                <p className="text-muted" style={{ marginBottom: 0 }}>
                                    Match terms with their definitions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show results
    if (showResult) {
        const correctCount = userAnswers.filter(a => a.isCorrect).length;
        const total = userAnswers.length;
        const percentage = Math.round((correctCount / total) * 100);

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '700px' }}>
                    <div className="card mb-3 fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
                            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                        </div>
                        <h2>Quiz Complete!</h2>
                        <p style={{ fontSize: '2rem', color: percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--error)' }}>
                            {correctCount} / {total} ({percentage}%)
                        </p>
                    </div>

                    <h3 style={{ marginBottom: '16px' }}>Review Answers</h3>

                    {userAnswers.map((answer, idx) => (
                        <div
                            key={idx}
                            className="card mb-2"
                            style={{
                                borderLeft: `4px solid ${answer.isCorrect ? 'var(--success)' : 'var(--error)'}`
                            }}
                        >
                            <div style={{ marginBottom: '8px' }}>
                                <strong>{answer.question}</strong>
                            </div>
                            <div style={{ color: answer.isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                Your answer: {answer.userAnswer}
                            </div>
                            {!answer.isCorrect && (
                                <div style={{ color: 'var(--success)', marginTop: '4px' }}>
                                    Correct: {answer.correctAnswer}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 mt-3">
                        <button onClick={() => startQuiz(quizType)} className="btn btn-primary">
                            Try Again
                        </button>
                        <button onClick={() => setQuizType(null)} className="btn btn-secondary">
                            Change Quiz Type
                        </button>
                        <Link to="/sets" className="btn btn-secondary">
                            Back to Sets
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Multiple choice quiz
    if (quizType === 'multiple') {
        const question = questions[currentIndex];
        const progress = ((currentIndex) / questions.length) * 100;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="text-muted">Multiple Choice</span>
                            <span className="text-muted">{currentIndex + 1} / {questions.length}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="card mb-3 fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                        <p className="text-muted mb-1">What is the definition of:</p>
                        <h2>{question.question}</h2>
                    </div>

                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleMultipleChoice(option)}
                            className="quiz-option fade-in"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Written quiz
    if (quizType === 'written') {
        const question = questions[currentIndex];
        const progress = ((currentIndex) / questions.length) * 100;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="text-muted">Written</span>
                            <span className="text-muted">{currentIndex + 1} / {questions.length}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="card mb-3 fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                        <p className="text-muted mb-1">Write the definition of:</p>
                        <h2>{question.question}</h2>
                    </div>

                    <form onSubmit={handleWrittenSubmit}>
                        <input
                            type="text"
                            className="form-input mb-2"
                            placeholder="Type your answer..."
                            value={writtenInput}
                            onChange={(e) => setWrittenInput(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Submit Answer
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Matching quiz
    if (quizType === 'matching') {
        const q = questions[0];
        const allMatched = Object.keys(matchingSelections).length === q.terms.length;

        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '24px' }}>Match the terms with definitions</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <h4 className="text-muted mb-2">Terms</h4>
                            {q.terms.map((term, idx) => (
                                <div key={idx} className="card mb-2" style={{
                                    padding: '16px',
                                    borderColor: matchingSelections[term] ? 'var(--primary)' : undefined
                                }}>
                                    <div style={{ marginBottom: '8px' }}><strong>{term}</strong></div>
                                    {matchingSelections[term] && (
                                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            → {matchingSelections[term]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <h4 className="text-muted mb-2">Definitions</h4>
                            {q.definitions.map((def, idx) => (
                                <button
                                    key={idx}
                                    className={`quiz-option ${usedDefinitions.includes(def) ? 'selected' : ''}`}
                                    disabled={usedDefinitions.includes(def)}
                                    onClick={() => {
                                        const unmatched = q.terms.find(t => !matchingSelections[t]);
                                        if (unmatched) handleMatchingSelect(unmatched, def);
                                    }}
                                >
                                    {def}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleMatchingSubmit}
                            className="btn btn-primary"
                            disabled={!allMatched}
                        >
                            Check Answers
                        </button>
                        <button
                            onClick={() => {
                                setMatchingSelections({});
                                setUsedDefinitions([]);
                            }}
                            className="btn btn-secondary"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
