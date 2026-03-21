import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setsAPI } from '../services/api';

export default function CreateSet() {
    const { id } = useParams(); // If editing
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [cards, setCards] = useState([{ term: '', definition: '', note: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [csvText, setCsvText] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadSet();
        }
    }, [id]);

    const loadSet = async () => {
        try {
            const data = await setsAPI.getOne(id);
            setTitle(data.title);
            setDescription(data.description || '');
            setIsPublic(data.isPublic || false);
            setCards(data.cards.length > 0 ? data.cards.map(card => ({
                term: card.term,
                definition: card.definition,
                note: card.note || ''
            })) : [{ term: '', definition: '', note: '' }]);
        } catch (err) {
            setError(err.message);
        }
    };

    const addCard = () => {
        setCards([...cards, { term: '', definition: '', note: '' }]);
    };

    const removeCard = (index) => {
        if (cards.length === 1) return;
        setCards(cards.filter((_, i) => i !== index));
    };

    const updateCard = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate
        const validCards = cards.filter(c => c.term.trim() && c.definition.trim());
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (validCards.length === 0) {
            setError('Add at least one card with term and definition');
            return;
        }

        setLoading(true);

        try {
            if (isEditing) {
                await setsAPI.update(id, title, description, validCards, isPublic);
            } else {
                await setsAPI.create(title, description, validCards, isPublic);
                // Track for quest
                localStorage.setItem('quest_create', 'true');
            }
            navigate('/sets');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const parseCSV = (text) => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
            setError('CSV must have at least a header row and one data row');
            return;
        }

        // Parse header
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Find column indices
        const termIndex = header.findIndex(h => h === 'term');
        const ipaIndex = header.findIndex(h => h === 'ipa');
        const definitionIndex = header.findIndex(h => h === 'definition');
        const exampleIndex = header.findIndex(h => h === 'example');

        if (termIndex === -1 || definitionIndex === -1) {
            setError('CSV must have "Term" and "Definition" columns');
            return;
        }

        // Parse data rows
        const newCards = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle quoted values with commas
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            const term = values[termIndex] || '';
            const ipa = ipaIndex !== -1 ? values[ipaIndex] : '';
            const definition = values[definitionIndex] || '';
            const example = exampleIndex !== -1 ? values[exampleIndex] : '';

            if (term && definition) {
                // Build note from IPA and Example
                let note = '';
                if (ipa) note += `IPA: ${ipa}`;
                if (example) {
                    if (note) note += '\n\n';
                    note += `Example: ${example}`;
                }

                newCards.push({
                    term: term.replace(/^"|"$/g, ''), // Remove surrounding quotes
                    definition: definition.replace(/^"|"$/g, ''),
                    note: note.replace(/^"|"$/g, '')
                });
            }
        }

        if (newCards.length === 0) {
            setError('No valid cards found in CSV');
            return;
        }

        setCards(newCards);
        setShowImportModal(false);
        setCsvText('');
        setError('');
    };

    const handleImportCSV = () => {
        if (!csvText.trim()) {
            setError('Please paste CSV content');
            return;
        }
        parseCSV(csvText);
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 className="page-header">{isEditing ? 'Edit Set' : 'Create New Set'}</h1>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="card mb-3">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., English Vocabulary"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Description (optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Add a description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0, marginTop: '20px' }}>
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <div>
                                    <span style={{ fontWeight: 600 }}>Make this set Public</span>
                                    <p className="text-secondary" style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                        Public sets can be studied by anyone, will have a shareable link, and appear in the Explore page.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '20px' }}>Cards ({cards.length})</h3>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="btn btn-secondary"
                        >
                            📋 Import from CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => setCards([{ term: '', definition: '', note: '' }])}
                            className="btn btn-secondary"
                        >
                            🗑️ Clear All
                        </button>
                    </div>

                    {cards.map((card, index) => (
                        <div key={index} className="card mb-2 fade-in" style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '16px',
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem'
                            }}>
                                #{index + 1}
                            </div>

                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCard(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--error)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    ×
                                </button>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Term</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter term"
                                            value={card.term}
                                            onChange={(e) => updateCard(index, 'term', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Definition</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter definition"
                                            value={card.definition}
                                            onChange={(e) => updateCard(index, 'definition', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Note (optional)</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Add additional notes, examples, or context..."
                                        value={card.note || ''}
                                        onChange={(e) => updateCard(index, 'note', e.target.value)}
                                        rows="2"
                                        style={{ resize: 'vertical', minHeight: '60px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCard}
                        className="btn btn-secondary"
                        style={{ width: '100%', marginBottom: '24px' }}
                    >
                        + Add Card
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Set')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/sets')}
                            className="btn btn-secondary btn-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Import CSV Modal */}
                {showImportModal && (
                    <>
                        <div 
                            className="modal-overlay" 
                            onClick={() => setShowImportModal(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 999
                            }}
                        />
                        <div 
                            className="modal-content"
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'var(--bg-elevated)',
                                padding: '32px',
                                borderRadius: 'var(--radius-lg)',
                                maxWidth: '700px',
                                width: '90%',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                zIndex: 1000,
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <h2 style={{ marginBottom: '16px' }}>Import Cards from CSV</h2>
                            
                            <div style={{ 
                                background: 'var(--bg-surface)', 
                                padding: '16px', 
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '16px',
                                fontSize: '0.9rem',
                                lineHeight: '1.6'
                            }}>
                                <strong>CSV Format:</strong>
                                <pre style={{ 
                                    margin: '8px 0 0 0', 
                                    padding: '12px',
                                    background: 'var(--bg-elevated)',
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    fontSize: '0.85rem'
                                }}>
{`Term,IPA,Definition,Example
Hello,/həˈloʊ/,A greeting,"Hello, how are you?"
World,/wɜːrld/,The earth,The world is round.`}
                                </pre>
                                <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>
                                    • Required columns: <strong>Term</strong>, <strong>Definition</strong><br/>
                                    • Optional columns: <strong>IPA</strong>, <strong>Example</strong> (will be added to Note)<br/>
                                    • Use quotes for values containing commas
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Paste CSV Content</label>
                                <textarea
                                    className="form-input"
                                    value={csvText}
                                    onChange={(e) => setCsvText(e.target.value)}
                                    rows="10"
                                    placeholder="Paste your CSV content here..."
                                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={handleImportCSV}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Import Cards
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowImportModal(false);
                                        setCsvText('');
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
