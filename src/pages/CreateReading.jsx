import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import readingService from '../services/readingService';
import Toast from '../components/Toast';

const CreateReading = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        level: 'IELTS Passage 1',
        passageText: '',
        questions: []
    });

    const levels = [
        'Beginner', 'Intermediate', 'Advanced',
        'IELTS Band 4.5-5.5', 'IELTS Band 6.0-7.0', 'IELTS Band 7.5+',
        'IELTS Passage 1', 'IELTS Passage 2', 'IELTS Passage 3'
    ];

    const questionTypes = ['multiple-choice', 'true-false-not-given', 'fill-in-blank', 'matching'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, {
                questionText: '',
                type: 'multiple-choice',
                options: ['', '', '', ''],
                correctAnswer: '',
                groupLabel: '',
                explanation: ''
            }]
        }));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await readingService.createPassage(formData);
            setToast({ message: 'Passage created successfully!', type: 'success' });
            setTimeout(() => navigate('/reading'), 1500);
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to create passage.', type: 'error' });
            setLoading(false);
        }
    };

    // Auto-resize textarea
    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="page-title mb-3">Create New Passage</h1>

                <form onSubmit={handleSubmit} className="grid grid-1 gap-4">

                    {/* Basic Info */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Passage Details</h2>
                        <div className="grid grid-2" style={{ gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. The Cork Oak"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Topic</label>
                                <input
                                    className="form-input"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Nature & Environment"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Level</label>
                                <select className="form-input" name="level" value={formData.level} onChange={handleInputChange}>
                                    {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mt-3">
                            <label className="form-label">Passage Content</label>
                            <textarea
                                className="form-input"
                                name="passageText"
                                value={formData.passageText}
                                onChange={(e) => { handleInputChange(e); autoResize(e); }}
                                required
                                style={{ minHeight: '300px', fontFamily: 'serif', lineHeight: '1.6', fontSize: '1.1rem' }}
                                placeholder="Paste the full reading text here..."
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Questions ({formData.questions.length})</h2>
                            <button type="button" onClick={addQuestion} className="btn btn-primary btn-sm">
                                + Add Question
                            </button>
                        </div>

                        {formData.questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-[var(--bg-surface)] p-4 rounded-lg mb-4 border border-[var(--border)]">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-[var(--primary)]">Question {qIndex + 1}</span>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-400 text-sm">
                                        Delete
                                    </button>
                                </div>

                                <div className="grid grid-2 gap-4 mb-3">
                                    <div className="form-group">
                                        <label className="text-xs text-secondary mb-1 block">Type</label>
                                        <select
                                            className="form-input text-sm p-2"
                                            value={q.type}
                                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                        >
                                            {questionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-secondary mb-1 block">Group Label (Optional)</label>
                                        <input
                                            className="form-input text-sm p-2"
                                            value={q.groupLabel}
                                            onChange={(e) => updateQuestion(qIndex, 'groupLabel', e.target.value)}
                                            placeholder="e.g. Questions 1-5"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="text-xs text-secondary mb-1 block">Question Text</label>
                                    <input
                                        className="form-input"
                                        value={q.questionText}
                                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                        placeholder="Enter the question statement..."
                                    />
                                </div>

                                {q.type === 'multiple-choice' && (
                                    <div className="grid grid-2 gap-2 mb-3">
                                        {q.options.map((opt, oIndex) => (
                                            <input
                                                key={oIndex}
                                                className="form-input text-sm"
                                                value={opt}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="text-xs text-secondary mb-1 block">Correct Answer</label>
                                    <input
                                        className="form-input border-green-500/50 focus:border-green-500"
                                        value={q.correctAnswer}
                                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                        placeholder={q.type === 'multiple-choice' ? 'e.g. A' : 'The correct answer...'}
                                    />
                                </div>
                            </div>
                        ))}

                        {formData.questions.length === 0 && (
                            <p className="text-center text-secondary py-8">No questions added yet.</p>
                        )}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Passage'}
                        </button>
                    </div>
                </form>

                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

export default CreateReading;
