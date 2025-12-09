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
    const [cards, setCards] = useState([{ term: '', definition: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setCards(data.cards.length > 0 ? data.cards : [{ term: '', definition: '' }]);
        } catch (err) {
            setError(err.message);
        }
    };

    const addCard = () => {
        setCards([...cards, { term: '', definition: '' }]);
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
            }
            navigate('/sets');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
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
            </div>
        </div>
    );
}
