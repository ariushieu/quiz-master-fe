import { useState } from 'react';

export default function FlashCard({ term, definition, onAskAI }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (text, e) => {
        e.stopPropagation();

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Try to detect language
        const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
        const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/i.test(text);

        if (hasVietnamese) {
            utterance.lang = 'vi-VN';
        } else if (hasJapanese) {
            utterance.lang = 'ja-JP';
        } else {
            utterance.lang = 'en-US';
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleAskAI = (e) => {
        e.stopPropagation();
        if (onAskAI) {
            onAskAI(term, definition);
        }
    };

    return (
        <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                <div className="flashcard-face flashcard-front">
                    <div>
                        <p className="flashcard-label">Term</p>
                        <p className="flashcard-content">{term}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flashcard-actions">
                        <button
                            className={`flashcard-action-btn ${isSpeaking ? 'active' : ''}`}
                            onClick={(e) => speak(term, e)}
                            title="Listen to pronunciation"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        </button>
                        {onAskAI && (
                            <button
                                className="flashcard-action-btn"
                                onClick={handleAskAI}
                                title="Ask AI for help"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flashcard-face flashcard-back">
                    <div>
                        <p className="flashcard-label">Definition</p>
                        <p className="flashcard-content">{definition}</p>
                    </div>

                    <div className="flashcard-actions">
                        <button
                            className={`flashcard-action-btn ${isSpeaking ? 'active' : ''}`}
                            onClick={(e) => speak(definition, e)}
                            title="Listen to pronunciation"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
