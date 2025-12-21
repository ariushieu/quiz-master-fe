import React from 'react';

const DictionaryPopup = ({ position, word, definition, onClose, onAddToSet, mode = 'menu', onTranslate, onHighlight, isHighlighted, onRemoveHighlight }) => {
    if (!word) return null;

    return (
        <div
            className="card dictionary-popup"
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -100%)',
                marginTop: '-12px',
                zIndex: 1000,
                padding: '16px',
                minWidth: '220px',
                maxWidth: '320px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    fontSize: '1.1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                    display: 'block'
                }}>
                    {word}
                </span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0 4px', fontSize: '1.2rem' }}>&times;</button>
            </div>

            {/* MODE: MENU (Initial Selection) */}
            {mode === 'menu' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        onClick={onTranslate}
                        className="btn btn-sm btn-primary w-full"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <span></span> Translate
                    </button>

                    {isHighlighted ? (
                        <button
                            onClick={onRemoveHighlight}
                            className="btn btn-sm w-full"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--error)',
                                color: 'var(--error)'
                            }}
                        >
                            <span></span> Remove Highlight
                        </button>
                    ) : (
                        <button
                            onClick={onHighlight}
                            className="btn btn-sm btn-secondary w-full"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-surface)', borderColor: '#eab308', color: '#eab308' }}
                        >
                            <span></span> Highlight
                        </button>
                    )}
                </div>
            )}

            {/* MODE: TRANSLATION (After clicking Translate) */}
            {mode === 'translation' && (
                <>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.4' }}>
                        {definition}
                    </div>

                    <button
                        onClick={() => onAddToSet(word)}
                        className="btn btn-sm btn-primary w-full"
                    >
                        + Add to Flashcards
                    </button>

                    <div style={{ marginTop: '10px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                        * Translated by Google. May not be 100% accurate.
                    </div>
                </>
            )}

            {/* Arrow */}
            <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                background: 'var(--bg-elevated)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)'
            }}></div>
        </div>
    );
};

export default DictionaryPopup;
