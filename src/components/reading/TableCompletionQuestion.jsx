import React from 'react';

const TableCompletionQuestion = ({ question, answers, onAnswerChange, showResults }) => {
    const { tableStructure, groupLabel, groupInstruction } = question;

    if (!tableStructure || !tableStructure.headers || !tableStructure.rows) {
        return <div className="alert alert-error">Invalid table structure</div>;
    }

    const isCorrect = (blankId, userAnswer) => {
        if (!userAnswer) return false;
        const cell = findCellByBlankId(blankId);
        if (!cell || !cell.answer) return false;
        
        const correct = String(cell.answer).trim().toLowerCase();
        const user = String(userAnswer).trim().toLowerCase();
        return correct === user;
    };

    const findCellByBlankId = (blankId) => {
        for (const row of tableStructure.rows) {
            for (const cell of row.cells) {
                if (cell.type === 'blank' && cell.blankId === blankId) {
                    return cell;
                }
            }
        }
        return null;
    };

    return (
        <div className="card" style={{ marginBottom: '24px' }}>
            {groupLabel && (
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--primary)' }}>
                    {groupLabel}
                </h3>
            )}
            
                {groupInstruction && (
                <div style={{ 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <p style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        whiteSpace: 'pre-line',
                        margin: 0,
                        color: 'var(--text-primary)'
                    }}>
                        {groupInstruction}
                    </p>
                </div>
            )}

            <div style={{ 
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--border) transparent'
            }}>
                <table className="completion-table" style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    fontSize: '0.9rem',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <thead>
                        <tr>
                            {tableStructure.headers.map((header, idx) => (
                                <th key={idx} style={{
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    padding: '12px 14px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    borderRight: idx < tableStructure.headers.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableStructure.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.cells.map((cell, cIdx) => (
                                    <td key={cIdx} style={{
                                        padding: '12px 14px',
                                        border: '1px solid var(--border)',
                                        background: rIdx % 2 === 0 ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                        verticalAlign: 'middle',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {cell.type === 'text' ? (
                                            <span style={{ 
                                                whiteSpace: 'pre-wrap',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {cell.value}
                                            </span>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ 
                                                    fontWeight: 'bold', 
                                                    color: 'var(--primary)',
                                                    minWidth: '30px',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    ({cell.blankId})
                                                </span>
                                                <input
                                                    type="text"
                                                    value={answers[cell.blankId] || ''}
                                                    onChange={(e) => onAnswerChange(cell.blankId, e.target.value)}
                                                    disabled={showResults}
                                                    placeholder="..."
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 12px',
                                                        border: showResults 
                                                            ? `2px solid ${isCorrect(cell.blankId, answers[cell.blankId]) ? '#22c55e' : '#ef4444'}`
                                                            : '2px solid var(--border)',
                                                        borderRadius: '6px',
                                                        background: showResults
                                                            ? isCorrect(cell.blankId, answers[cell.blankId]) 
                                                                ? 'rgba(34, 197, 94, 0.1)' 
                                                                : 'rgba(239, 68, 68, 0.1)'
                                                            : 'var(--bg-base)',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.9rem',
                                                        outline: 'none',
                                                        transition: 'all 0.2s',
                                                        fontWeight: '500'
                                                    }}
                                                />
                                                {showResults && (
                                                    <span style={{ 
                                                        fontSize: '1.2rem',
                                                        minWidth: '24px',
                                                        fontWeight: 'bold',
                                                        color: isCorrect(cell.blankId, answers[cell.blankId]) ? '#22c55e' : '#ef4444'
                                                    }}>
                                                        {isCorrect(cell.blankId, answers[cell.blankId]) ? '✓' : '✗'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Show correct answer after submission */}
                                        {showResults && cell.type === 'blank' && !isCorrect(cell.blankId, answers[cell.blankId]) && (
                                            <div style={{ 
                                                marginTop: '8px', 
                                                padding: '6px 10px',
                                                background: 'rgba(34, 197, 94, 0.1)',
                                                borderRadius: '6px',
                                                fontSize: '0.85rem',
                                                color: '#16a34a',
                                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                                fontWeight: '500'
                                            }}>
                                                <strong>Correct answer:</strong> {cell.answer}
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableCompletionQuestion;
