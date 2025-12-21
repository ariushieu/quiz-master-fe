import React from 'react';

const DictionaryPopup = ({ position, word, definition, onClose, onAddToSet, mode = 'menu', onTranslate, onHighlight, isHighlighted, onRemoveHighlight }) => {
    const popupRef = React.useRef(null);
    const [style, setStyle] = React.useState({
        opacity: 0, // Start invisible to measure
        top: position.top,
        left: position.left,
        arrowLeft: '50%',
        transform: 'translate(-50%, -100%)'
    });

    React.useLayoutEffect(() => {
        if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect();
            const width = rect.width;
            const screenWidth = window.innerWidth;
            const PADDING = 16; // Safety margin from screen edge

            let newLeft = position.left;
            let newTransform = 'translate(-50%, -100%)';
            let newArrowLeft = '50%';

            // Check Left Overflow
            // Left edge would be: position.left - width/2
            if (position.left - width / 2 < PADDING) {
                // Pin to left
                newLeft = PADDING;
                newTransform = 'translate(0, -100%)';
                // Arrow points to original target relative to new left
                // The arrow needs to be at (position.left - newLeft)
                newArrowLeft = `${position.left - PADDING}px`;
            }
            // Check Right Overflow
            // Right edge would be: position.left + width/2
            else if (position.left + width / 2 > screenWidth - PADDING) {
                // Pin to right
                newLeft = screenWidth - PADDING;
                newTransform = 'translate(-100%, -100%)';
                // Arrow points to original target relative to new left (which is the right edge of popup)
                // Distance from right edge of popup to target is (screenWidth - PADDING) - position.left
                // So arrow from left is width - distance
                newArrowLeft = `${width - ((screenWidth - PADDING) - position.left)}px`;
            }

            setStyle({
                opacity: 1,
                top: position.top,
                left: newLeft,
                transform: newTransform,
                arrowLeft: newArrowLeft
            });
        }
    }, [position.left, position.top, word, definition, mode]);

    if (!word) return null;

    return (
        <div
            ref={popupRef}
            className="card dictionary-popup"
            style={{
                position: 'fixed',
                top: style.top,
                left: style.left,
                transform: style.transform,
                opacity: style.opacity,
                marginTop: '-12px',
                zIndex: 1000,
                padding: '16px',
                minWidth: '220px',
                maxWidth: '320px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                transition: 'opacity 0.1s ease-out, transform 0.1s ease-out, left 0.1s ease-out'
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
                left: style.arrowLeft,
                transform: 'translateX(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                background: 'var(--bg-elevated)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                transition: 'left 0.1s ease-out'
            }}></div>
        </div>
    );
};

export default DictionaryPopup;
