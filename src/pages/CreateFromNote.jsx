import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/ai';
import { setsAPI } from '../services/api';
import Toast from '../components/Toast';

const STORAGE_KEY = 'createFromNote_draft';
const ONBOARDING_KEY = 'createFromNote_onboardingSeen';
const MAX_CHARS = 50000;

export default function CreateFromNote() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    // ========== STATE ==========
    const [phase, setPhase] = useState('editor'); // 'editor' | 'processing' | 'preview'
    const [noteText, setNoteText] = useState('');

    // Onboarding
    const [showOnboarding, setShowOnboarding] = useState(() => {
        if (!isAdmin) return false;
        return !localStorage.getItem(ONBOARDING_KEY);
    });

    // Draft recovery
    const [restoredDraft] = useState(() => {
        if (!isAdmin) return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.text && parsed.text.trim()) return parsed;
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        return null;
    });
    const [showRestorePrompt, setShowRestorePrompt] = useState(() => restoredDraft !== null);

    // Preview state — array of sets
    const [previewSets, setPreviewSets] = useState([]);
    const [savedSetIds, setSavedSetIds] = useState(new Set()); // track which sets have been saved
    const [isPublic, setIsPublic] = useState(false);

    // UI state
    const [savingIndex, setSavingIndex] = useState(null); // which set is currently being saved
    const [savingAll, setSavingAll] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [processingMessage, setProcessingMessage] = useState('');

    const textareaRef = useRef(null);
    const debounceTimerRef = useRef(null);

    // ========== ONBOARDING ==========
    const dismissOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem(ONBOARDING_KEY, 'true');
    };

    // ========== DRAFT RECOVERY ==========
    const restoreDraft = () => {
        if (restoredDraft) {
            setNoteText(restoredDraft.text);
        }
        setShowRestorePrompt(false);
    };

    const discardDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setShowRestorePrompt(false);
    };

    // ========== AUTO-SAVE (debounced 1s) ==========
    const saveToLocalStorage = useCallback((text) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            if (text.trim()) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    text,
                    savedAt: new Date().toISOString()
                }));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }, 1000);
    }, []);

    const handleNoteChange = (e) => {
        const value = e.target.value;
        setNoteText(value);
        saveToLocalStorage(value);
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // ========== GENERATE FLASHCARDS ==========
    const handleGenerate = async () => {
        if (!noteText.trim()) {
            setError('Please write some vocabulary notes first.');
            return;
        }
        if (noteText.trim().length < 10) {
            setError('Your notes are too short. Add more vocabulary content.');
            return;
        }

        setError('');
        setPhase('processing');
        setProcessingMessage('Analyzing your notes...');

        try {
            const msgTimer = setTimeout(() => {
                setProcessingMessage('Grouping by topic and structuring flashcards...');
            }, 3000);

            const result = await aiAPI.generateFlashcards(noteText);
            clearTimeout(msgTimer);

            if (!result.sets || result.sets.length === 0) {
                setPhase('editor');
                setError('Could not identify any vocabulary items in your notes. Try being more explicit with terms and definitions.');
                return;
            }

            setPreviewSets(result.sets);
            setSavedSetIds(new Set());
            setPhase('preview');
        } catch (err) {
            setPhase('editor');
            setError(err.message || 'Failed to generate flashcards. Please try again.');
        }
    };

    // ========== PREVIEW EDITING ==========
    const updateSetField = (setIndex, field, value) => {
        const updated = [...previewSets];
        updated[setIndex] = { ...updated[setIndex], [field]: value };
        setPreviewSets(updated);
    };

    const updateCard = (setIndex, cardIndex, field, value) => {
        const updated = [...previewSets];
        const cards = [...updated[setIndex].cards];
        cards[cardIndex] = { ...cards[cardIndex], [field]: value };
        updated[setIndex] = { ...updated[setIndex], cards };
        setPreviewSets(updated);
    };

    const removeCard = (setIndex, cardIndex) => {
        const updated = [...previewSets];
        if (updated[setIndex].cards.length <= 1) return;
        updated[setIndex] = {
            ...updated[setIndex],
            cards: updated[setIndex].cards.filter((_, i) => i !== cardIndex)
        };
        setPreviewSets(updated);
    };

    const addCard = (setIndex) => {
        const updated = [...previewSets];
        updated[setIndex] = {
            ...updated[setIndex],
            cards: [...updated[setIndex].cards, { term: '', definition: '', note: '' }]
        };
        setPreviewSets(updated);
    };

    const removeSet = (setIndex) => {
        if (previewSets.length <= 1) return;
        setPreviewSets(previewSets.filter((_, i) => i !== setIndex));
    };

    // ========== SAVE ==========
    const saveOneSet = async (setIndex) => {
        const set = previewSets[setIndex];
        const validCards = set.cards.filter(c => c.term.trim() && c.definition.trim());
        if (!set.title.trim()) {
            setError(`Set "${set.title || `#${setIndex + 1}`}" needs a title.`);
            return;
        }
        if (validCards.length === 0) {
            setError(`Set "${set.title}" needs at least one card with term and definition.`);
            return;
        }

        setSavingIndex(setIndex);
        setError('');

        try {
            await setsAPI.create(set.title, set.description, validCards, isPublic);
            setSavedSetIds(prev => new Set([...prev, setIndex]));
            setToast({ message: `"${set.title}" saved!`, type: 'success' });

            // If all sets are now saved, clear draft
            const newSaved = new Set([...savedSetIds, setIndex]);
            if (newSaved.size === previewSets.length) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.setItem('quest_create', 'true');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingIndex(null);
        }
    };

    const saveAllSets = async () => {
        const unsavedIndexes = previewSets
            .map((_, i) => i)
            .filter(i => !savedSetIds.has(i));

        if (unsavedIndexes.length === 0) return;

        // Validate all first
        for (const i of unsavedIndexes) {
            const set = previewSets[i];
            const validCards = set.cards.filter(c => c.term.trim() && c.definition.trim());
            if (!set.title.trim()) {
                setError(`Set #${i + 1} needs a title.`);
                return;
            }
            if (validCards.length === 0) {
                setError(`Set "${set.title}" needs at least one card with term and definition.`);
                return;
            }
        }

        setSavingAll(true);
        setError('');

        try {
            for (const i of unsavedIndexes) {
                const set = previewSets[i];
                const validCards = set.cards.filter(c => c.term.trim() && c.definition.trim());
                await setsAPI.create(set.title, set.description, validCards, isPublic);
                setSavedSetIds(prev => new Set([...prev, i]));
            }

            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem('quest_create', 'true');
            setToast({ message: `${unsavedIndexes.length} set(s) saved successfully!`, type: 'success' });
            setTimeout(() => navigate('/sets'), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingAll(false);
        }
    };

    const backToEditor = () => {
        setPhase('editor');
        setError('');
    };

    // ========== Total card count ==========
    const totalCards = previewSets.reduce((sum, set) => sum + set.cards.length, 0);
    const unsavedCount = previewSets.filter((_, i) => !savedSetIds.has(i)).length;

    // ========== ACCESS CONTROL ==========
    if (!isAdmin) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <div className="card" style={{ padding: '48px 32px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px', display: 'block' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <h2 style={{ marginBottom: '16px' }}>Feature Not Available</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            "Create from Note" is currently available to admin users only.
                            Contact an administrator to request access.
                        </p>
                        <button
                            onClick={() => navigate('/create')}
                            className="btn btn-primary"
                            style={{ marginTop: '24px' }}
                        >
                            Use Standard Creator
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== RENDER ==========
    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '900px' }}>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {/* ===== ONBOARDING GUIDE ===== */}
                {showOnboarding && phase === 'editor' && (
                    <div className="card fade-in" style={{
                        marginBottom: '24px',
                        border: '1px solid var(--primary)',
                        background: 'var(--bg-surface)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>
                                How to use Create from Note
                            </h3>
                            <button
                                onClick={dismissOnboarding}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '1.4rem',
                                    lineHeight: 1,
                                    padding: '4px 8px'
                                }}
                                aria-label="Dismiss guide"
                            >
                                x
                            </button>
                        </div>
                        <ol style={{
                            margin: 0,
                            paddingLeft: '20px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.8'
                        }}>
                            <li>Write or paste your vocabulary notes freely - any format works</li>
                            <li>AI will automatically group words by topic into separate sets</li>
                            <li>Review and edit each set individually</li>
                            <li>Save all sets at once, or save them one by one</li>
                        </ol>
                        <p style={{
                            marginTop: '12px',
                            marginBottom: 0,
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)'
                        }}>
                            Supported formats: word lists, "term - definition" pairs, bullet points,
                            tables, mixed languages, and more.
                        </p>
                    </div>
                )}

                {/* ===== DRAFT RESTORE PROMPT ===== */}
                {showRestorePrompt && (
                    <div className="card fade-in" style={{
                        marginBottom: '24px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--warning, #f59e0b)'
                    }}>
                        <p style={{ marginBottom: '12px' }}>
                            You have an unsaved draft from{' '}
                            {restoredDraft?.savedAt
                                ? new Date(restoredDraft.savedAt).toLocaleString()
                                : 'a previous session'}.
                            Would you like to restore it?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={restoreDraft} className="btn btn-primary">
                                Restore Draft
                            </button>
                            <button onClick={discardDraft} className="btn btn-secondary">
                                Discard
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== PHASE 1: NOTE EDITOR ===== */}
                {phase === 'editor' && (
                    <div className="fade-in">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <h1 className="page-title" style={{ margin: 0 }}>
                                Create from Note
                            </h1>
                            <Link to="/create" className="btn btn-secondary">
                                Standard Creator
                            </Link>
                        </div>

                        <div className="card" style={{ padding: '0' }}>
                            <textarea
                                ref={textareaRef}
                                value={noteText}
                                onChange={handleNoteChange}
                                placeholder={"Type or paste your vocabulary notes here...\n\nExamples:\n  apple - tao\n  banana: chuoi\n  guitar, piano, drums\n  wake up, brush teeth, commute\n\nAI will automatically group words by topic\ninto separate flashcard sets."}
                                style={{
                                    width: '100%',
                                    minHeight: '400px',
                                    padding: '24px',
                                    background: 'var(--bg-elevated)',
                                    color: 'var(--text-primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-lg, 12px)',
                                    fontFamily: 'inherit',
                                    fontSize: '1rem',
                                    lineHeight: '1.7',
                                    resize: 'vertical',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '16px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <span style={{
                                color: noteText.length > 45000
                                    ? 'var(--error)'
                                    : 'var(--text-muted)',
                                fontSize: '0.85rem'
                            }}>
                                {noteText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                            </span>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => navigate('/sets')}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    className="btn btn-primary btn-lg"
                                    disabled={!noteText.trim() || noteText.length > MAX_CHARS}
                                >
                                    Generate Flashcards
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== PHASE 2: PROCESSING ===== */}
                {phase === 'processing' && (
                    <div className="loading fade-in" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        padding: '80px 20px'
                    }}>
                        <div className="spinner" style={{ marginBottom: '24px' }}></div>
                        <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>{processingMessage}</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                            This may take a few seconds depending on the length of your notes.
                        </p>
                    </div>
                )}

                {/* ===== PHASE 3: PREVIEW — MULTIPLE SETS ===== */}
                {phase === 'preview' && (
                    <div className="fade-in">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <h1 className="page-title" style={{ margin: 0 }}>
                                Review Flashcards
                            </h1>
                            <button onClick={backToEditor} className="btn btn-secondary">
                                Back to Editor
                            </button>
                        </div>

                        {/* Summary bar */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem'
                        }}>
                            <span>{previewSets.length} set(s)</span>
                            <span>{totalCards} total cards</span>
                            {savedSetIds.size > 0 && (
                                <span style={{ color: 'var(--success)' }}>
                                    {savedSetIds.size} saved
                                </span>
                            )}
                            <div style={{ marginLeft: 'auto' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                    />
                                    <span>Public</span>
                                </label>
                            </div>
                        </div>

                        {/* Each set */}
                        {previewSets.map((set, setIndex) => {
                            const isSaved = savedSetIds.has(setIndex);
                            const isSaving = savingIndex === setIndex;

                            return (
                                <div key={setIndex} className="card fade-in" style={{
                                    marginBottom: '20px',
                                    border: isSaved ? '1px solid var(--success)' : undefined,
                                    opacity: isSaved ? 0.7 : 1
                                }}>
                                    {/* Set header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px',
                                        flexWrap: 'wrap',
                                        gap: '8px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                            <span style={{
                                                background: isSaved ? 'var(--success)' : 'var(--primary)',
                                                color: 'white',
                                                padding: '2px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {isSaved ? 'SAVED' : `SET ${setIndex + 1}`}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                {set.cards.length} cards
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!isSaved && (
                                                <button
                                                    onClick={() => saveOneSet(setIndex)}
                                                    className="btn btn-primary btn-sm"
                                                    disabled={isSaving || savingAll}
                                                >
                                                    {isSaving ? 'Saving...' : 'Save this set'}
                                                </button>
                                            )}
                                            {previewSets.length > 1 && !isSaved && (
                                                <button
                                                    onClick={() => removeSet(setIndex)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--error)',
                                                        cursor: 'pointer',
                                                        fontSize: '1.1rem',
                                                        padding: '4px 8px'
                                                    }}
                                                    aria-label="Remove set"
                                                >
                                                    x
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title + Description */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        marginBottom: '16px'
                                    }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={set.title}
                                                onChange={(e) => updateSetField(setIndex, 'title', e.target.value)}
                                                disabled={isSaved}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Description</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={set.description}
                                                onChange={(e) => updateSetField(setIndex, 'description', e.target.value)}
                                                disabled={isSaved}
                                            />
                                        </div>
                                    </div>

                                    {/* Cards */}
                                    {set.cards.map((card, cardIndex) => (
                                        <div key={cardIndex} style={{
                                            background: 'var(--bg-surface)',
                                            borderRadius: 'var(--radius-md, 8px)',
                                            padding: '12px 16px',
                                            marginBottom: '8px',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '8px'
                                            }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    #{cardIndex + 1}
                                                </span>
                                                {set.cards.length > 1 && !isSaved && (
                                                    <button
                                                        onClick={() => removeCard(setIndex, cardIndex)}
                                                        style={{
                                                            marginLeft: 'auto',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--error)',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            padding: '0 4px'
                                                        }}
                                                    >
                                                        x
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '8px',
                                                marginBottom: '8px'
                                            }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={card.term}
                                                    onChange={(e) => updateCard(setIndex, cardIndex, 'term', e.target.value)}
                                                    placeholder="Term"
                                                    disabled={isSaved}
                                                    style={{ fontSize: '0.9rem' }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={card.definition}
                                                    onChange={(e) => updateCard(setIndex, cardIndex, 'definition', e.target.value)}
                                                    placeholder="Definition"
                                                    disabled={isSaved}
                                                    style={{ fontSize: '0.9rem' }}
                                                />
                                            </div>
                                            {card.note && (
                                                <textarea
                                                    className="form-input"
                                                    value={card.note}
                                                    onChange={(e) => updateCard(setIndex, cardIndex, 'note', e.target.value)}
                                                    rows="2"
                                                    disabled={isSaved}
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        resize: 'vertical',
                                                        minHeight: '40px',
                                                        color: 'var(--text-secondary)'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Add card button */}
                                    {!isSaved && (
                                        <button
                                            onClick={() => addCard(setIndex)}
                                            className="btn btn-secondary btn-sm"
                                            style={{ width: '100%', marginTop: '8px' }}
                                        >
                                            + Add Card
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Bottom save all bar */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginTop: '24px',
                            position: 'sticky',
                            bottom: '20px',
                            background: 'var(--bg-base)',
                            padding: '16px',
                            borderRadius: 'var(--radius-lg, 12px)',
                            border: '1px solid var(--border, rgba(255,255,255,0.1))'
                        }}>
                            {unsavedCount > 0 ? (
                                <button
                                    onClick={saveAllSets}
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1 }}
                                    disabled={savingAll || savingIndex !== null}
                                >
                                    {savingAll
                                        ? 'Saving...'
                                        : `Save All (${unsavedCount} set${unsavedCount > 1 ? 's' : ''})`
                                    }
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/sets')}
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1 }}
                                >
                                    All sets saved — Go to My Sets
                                </button>
                            )}
                            <button
                                onClick={backToEditor}
                                className="btn btn-secondary btn-lg"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
