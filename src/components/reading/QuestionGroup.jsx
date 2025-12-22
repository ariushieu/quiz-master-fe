import React from 'react';
import TableCompletionQuestion from './TableCompletionQuestion';

const QuestionGroup = ({ questions, answers, onAnswerChange, showResults }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {questions.map((q, index) => {
                // Handle table-completion separately
                if (q.type === 'table-completion') {
                    return (
                        <TableCompletionQuestion
                            key={index}
                            question={q}
                            answers={answers}
                            onAnswerChange={onAnswerChange}
                            showResults={showResults}
                        />
                    );
                }
                
                // Regular questions
                // Determine if we need to show a group header
                // Show if it's the first question, or if the groupLabel is different from the previous one
                const prevQ = questions[index - 1];
                const showGroupHeader = q.groupLabel && (!prevQ || prevQ.groupLabel !== q.groupLabel);

                return (
                    <React.Fragment key={index}>
                        {/* Section Header Card */}
                        {showGroupHeader && (
                            <div className="card" style={{ padding: '24px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', marginBottom: '-8px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>
                                    {q.groupLabel}
                                </h3>
                                {q.groupInstruction && (
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                                        {q.groupInstruction}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Question Card */}
                        <div className="card" style={{ padding: '24px', marginBottom: '0' }}>
                            {/* Sub-heading if exists and different from previous */}
                            {q.subHeading && (!prevQ || prevQ.subHeading !== q.subHeading) && (
                                <div style={{
                                    marginBottom: '16px',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid var(--border)'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: 0
                                    }}>
                                        {q.subHeading}
                                    </h4>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '20px' }}>
                                <span className="text-primary font-bold text-lg flex-shrink-0 select-none" style={{ marginRight: '8px', minWidth: '25px' }}>
                                    {index + 1}.
                                </span>
                                <div className="text-primary font-medium text-lg leading-relaxed">
                                    {q.questionText}
                                </div>
                            </div>

                            <div style={{ paddingLeft: '0px' }}>
                                {/* Multiple Choice */}
                                {q.type === 'multiple-choice' && (() => {
                                    // Determine if this is a multi-answer question
                                    const correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                                    const isMultiAnswer = correctAnswers.length > 1;
                                    
                                    // For multi-answer, user's answer should be an array
                                    const userAnswer = answers[q._id];
                                    const userAnswers = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []);
                                    
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {q.options.map((option, optIdx) => {
                                                const isSelected = isMultiAnswer 
                                                    ? userAnswers.includes(option)
                                                    : userAnswer === option;
                                                
                                                return (
                                                    <label 
                                                        key={optIdx} 
                                                        className={`quiz-option ${isSelected ? 'selected' : ''}`} 
                                                        style={{ 
                                                            padding: '12px', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            cursor: showResults ? 'default' : 'pointer' 
                                                        }}
                                                    >
                                                        <input
                                                            type={isMultiAnswer ? 'checkbox' : 'radio'}
                                                            name={q._id}
                                                            value={option}
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (isMultiAnswer) {
                                                                    // Toggle checkbox
                                                                    const newAnswers = isSelected
                                                                        ? userAnswers.filter(a => a !== option)
                                                                        : [...userAnswers, option];
                                                                    onAnswerChange(q._id, newAnswers.length > 0 ? newAnswers : null);
                                                                } else {
                                                                    // Radio button
                                                                    onAnswerChange(q._id, option);
                                                                }
                                                            }}
                                                            disabled={showResults}
                                                            style={{ 
                                                                marginRight: '12px', 
                                                                width: '18px', 
                                                                height: '18px', 
                                                                accentColor: 'var(--primary)' 
                                                            }}
                                                        />
                                                        <span style={{ fontSize: '1rem' }}>{option}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                {/* True / False / Not Given */}
                                {q.type === 'true-false-not-given' && (
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        {['True', 'False', 'Not Given'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => onAnswerChange(q._id, option)}
                                                disabled={showResults}
                                                className={`btn ${answers[q._id] === option ? 'btn-primary' : 'btn-secondary'}`}
                                                style={{
                                                    minWidth: '80px',
                                                    padding: '8px 16px',
                                                    fontSize: '0.9rem',
                                                    cursor: showResults ? 'default' : 'pointer'
                                                }}
                                            >
                                                {option.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Matching Type (Dropdown) */}
                                {q.type === 'matching' && (
                                    <div className="w-full max-w-md">
                                        <select
                                            value={answers[q._id] || ''}
                                            onChange={(e) => onAnswerChange(q._id, e.target.value)}
                                            disabled={showResults}
                                            className="form-select w-full"
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                backgroundColor: 'var(--bg-elevated)',
                                                borderColor: 'var(--border)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="" disabled>Select an option...</option>
                                            {q.options.map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Fill in the Blank */}
                                {q.type === 'fill-in-blank' && (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={answers[q._id] || ''}
                                            onChange={(e) => onAnswerChange(q._id, e.target.value)}
                                            disabled={showResults}
                                            placeholder="Type your answer..."
                                            className="form-input"
                                            style={{ padding: '12px', fontSize: '1rem', marginTop: '0' }}
                                        />
                                    </div>
                                )}

                                {/* Result Feedback */}
                                {showResults && (
                                    <div
                                        className={`alert ${isCorrect(q, answers[q._id]) ? 'alert-success' : 'alert-error'}`}
                                        style={{ marginTop: '24px', padding: '16px' }}
                                    >
                                        <p className="font-bold text-base mb-2">
                                            {isCorrect(q, answers[q._id]) ? 'Correct!' : (() => {
                                                const correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                                                const correctText = correctAnswers.length > 1 
                                                    ? `Correct answers: ${correctAnswers.join(', ')}`
                                                    : `Correct answer: ${q.correctAnswer}`;
                                                return `Incorrect. ${correctText}`;
                                            })()}
                                        </p>
                                        {q.explanation && (
                                            <p className="opacity-90 leading-relaxed text-sm">In the passage: {q.explanation}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// Helper to check answer loosely (case insensitive, trimmed)
const isCorrect = (question, userAnswer) => {
    if (!userAnswer) return false;
    
    const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
    
    // If multiple correct answers expected
    if (correctAnswers.length > 1) {
        if (!Array.isArray(userAnswer)) return false;
        
        // Check if arrays have same length and same elements (order doesn't matter)
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

export default QuestionGroup;
