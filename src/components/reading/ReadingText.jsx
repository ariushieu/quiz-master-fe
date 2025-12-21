import React, { useState, useRef, useCallback } from 'react';
import DictionaryPopup from './DictionaryPopup';
import Toast from '../Toast';
import flashcardService from '../../services/flashcardService';

const ReadingContent = React.memo(({ content }) => (
    <>
        <div
            className="reading-content"
            style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                textAlign: 'justify'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
        <style>{`
            .reading-content { user-select: text; cursor: text; }
            .reading-content p { margin-bottom: 20px; }
        `}</style>
    </>
), (prev, next) => prev.content === next.content);

const ReadingText = ({ title, content }) => {
    const [popup, setPopup] = useState({ show: false, top: 0, left: 0, word: '', definition: '', isSentence: false, mode: null, isHighlighted: false });
    const [toast, setToast] = useState(null);
    const containerRef = useRef(null);

    const handleCloseToast = useCallback(() => {
        setToast(null);
    }, []);




    const handleMouseUp = (e) => {
        // Prevent popup from triggering if selecting text INSIDE the popup
        if (e.target.closest('.dictionary-popup')) return;

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Check if selection is inside a highlight
            let isHighlighted = false;
            let node = range.commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode; // Text node -> Element

            // Check if the common ancestor or any of its parents is a highlight-marker
            if (node && node.closest('.highlight-marker')) {
                isHighlighted = true;
            }

            setPopup({
                show: true,
                mode: 'menu', // Start in menu mode
                top: rect.top,
                left: rect.left + (rect.width / 2),
                word: selectedText,
                definition: '', // Definition is fetched later
                isSentence: selectedText.split(' ').length > 3,
                isHighlighted
            });
        } else {
            // Clicked outside/empty -> handled by Close button or blur logic
        }
    };

    const handleTranslate = async () => {
        setPopup(prev => ({ ...prev, mode: 'translation', definition: 'Searching translation...' }));

        try {
            const encodedText = encodeURIComponent(popup.word);
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodedText}`);
            const data = await response.json();

            if (data && data[0] && data[0][0] && data[0][0][0]) {
                const translatedText = data[0][0][0];
                setPopup(prev => ({ ...prev, definition: translatedText }));
            } else {
                setPopup(prev => ({ ...prev, definition: 'Translation not found.' }));
            }
        } catch (error) {
            console.error("Translation error:", error);
            setPopup(prev => ({ ...prev, definition: 'Could not fetch translation.' }));
        }
    };

    const handleHighlight = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            // Soft Highlight Style (Dark Mode Friendly)
            span.style.backgroundColor = 'rgba(234, 179, 8, 0.25)'; // Muted Gold background
            span.style.color = '#fde047'; // Bright Yellow text
            span.style.borderBottom = '1px solid #eab308'; // Subtle underline
            span.style.borderRadius = '2px';
            span.style.padding = '0 2px';
            span.className = 'highlight-marker';

            try {
                range.surroundContents(span);
                window.getSelection().removeAllRanges();
            } catch (e) {
                console.error("Highlight failed (complex range):", e);
                // Fallback or alert if needed, but usually silent is ok for simple text
            }
        }
        setPopup(prev => ({ ...prev, show: false }));
    };

    const handleRemoveHighlight = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let node = range.commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode; // If it's a text node, get its parent element

            // Find the closest highlight-marker ancestor
            const highlightMarker = node.closest('.highlight-marker');

            if (highlightMarker) {
                const parent = highlightMarker.parentNode;
                while (highlightMarker.firstChild) {
                    parent.insertBefore(highlightMarker.firstChild, highlightMarker); // Move children out before the marker
                }
                parent.removeChild(highlightMarker); // Remove the empty marker
                window.getSelection().removeAllRanges();
            }
        }
        setPopup(prev => ({ ...prev, show: false }));
    };

    const handleAddToSet = async (word) => {
        try {
            const sets = await flashcardService.getSets();
            let targetSet = sets.find(s => s.title === 'IELTS Vocabulary');

            if (!targetSet) {
                // Create new set if not exists
                targetSet = await flashcardService.createSet({
                    title: 'IELTS Vocabulary',
                    description: 'Words saved from Reading Practice',
                    isPublic: false,
                    cards: []
                });
            }

            // Prepare new card
            const newCard = {
                term: word,
                definition: popup.definition || 'Saved from reading'
            };

            const fullSet = await flashcardService.getSetById(targetSet._id);
            const updatedCards = [...fullSet.cards, newCard];

            await flashcardService.updateSet(targetSet._id, {
                title: fullSet.title,
                description: fullSet.description,
                cards: updatedCards,
                isPublic: fullSet.isPublic
            });

            setToast({ message: `Saved "${word}" to "IELTS Vocabulary" set!`, type: 'success' });
            setPopup({ ...popup, show: false });
            window.getSelection().removeAllRanges();

        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to save to flashcards. Please try again.', type: 'error' });
        }
    };

    return (
        <div
            ref={containerRef}
            style={{ padding: '40px 60px', color: 'var(--text-primary)', position: 'relative' }}
            onMouseUp={handleMouseUp}
        >
            <h1 style={{ fontSize: '2rem', marginBottom: '24px', fontWeight: 'bold' }}>{title}</h1>

            <ReadingContent content={content} />

            {popup.show && (
                <DictionaryPopup
                    position={{ top: popup.top, left: popup.left }}
                    word={popup.word}
                    definition={popup.definition}
                    mode={popup.mode}
                    isHighlighted={popup.isHighlighted}
                    onTranslate={handleTranslate}
                    onHighlight={handleHighlight}
                    onRemoveHighlight={handleRemoveHighlight}
                    onClose={() => {
                        setPopup({ ...popup, show: false });
                        window.getSelection().removeAllRanges();
                    }}
                    onAddToSet={handleAddToSet}
                />
            )}

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

export default ReadingText;
