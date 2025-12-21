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
        questionGroups: []
    });

    const levels = [
        'Beginner', 'Intermediate', 'Advanced',
        'IELTS Band 4.5-5.5', 'IELTS Band 6.0-7.0', 'IELTS Band 7.5+',
        'IELTS Passage 1', 'IELTS Passage 2', 'IELTS Passage 3'
    ];

    const questionTypes = [
        { value: 'multiple-choice', label: 'Multiple Choice' },
        { value: 'true-false-not-given', label: 'True/False/Not Given' },
        { value: 'fill-in-blank', label: 'Fill in the Blank' },
        { value: 'matching', label: 'Matching' }
    ];

    // Default instructions for each question type
    const getDefaultInstruction = (type, groupLabel) => {
        // Extract question numbers from groupLabel (e.g., "Questions 1-5" -> "1-5")
        const match = groupLabel?.match(/(\d+[-–]\d+)/);
        const range = match ? match[1] : '1-5';

        switch (type) {
            case 'true-false-not-given':
                return `Do the following statements agree with the information given in Reading Passage?

In boxes ${range} on your answer sheet, write

TRUE    if the statement agrees with the information
FALSE    if the statement contradicts the information
NOT GIVEN    if there is no information on this`;

            case 'multiple-choice':
                return `Choose the correct letter, A, B, C or D.

Write the correct letter in boxes ${range} on your answer sheet.`;

            case 'fill-in-blank':
                return `Complete the sentences below.

Choose NO MORE THAN TWO WORDS from the passage for each answer.

Write your answers in boxes ${range} on your answer sheet.`;

            case 'matching':
                return `Look at the following statements and the list of people below.

Match each statement with the correct person.

Write the correct letter A-F in boxes ${range} on your answer sheet.`;

            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ========== Question Group Functions ==========
    const addQuestionGroup = () => {
        const newIndex = formData.questionGroups.length;
        const groupLabel = `Questions ${newIndex * 5 + 1}-${newIndex * 5 + 5}`;
        const type = 'fill-in-blank';

        setFormData(prev => ({
            ...prev,
            questionGroups: [...prev.questionGroups, {
                groupLabel: groupLabel,
                groupInstruction: getDefaultInstruction(type, groupLabel),
                type: type,
                wordLimit: 'NO MORE THAN TWO WORDS',
                questions: [{ questionText: '', correctAnswer: '', explanation: '' }]
            }]
        }));
    };

    const updateGroup = (groupIndex, field, value) => {
        const newGroups = [...formData.questionGroups];
        newGroups[groupIndex][field] = value;

        // Auto-update instruction when type changes
        if (field === 'type') {
            newGroups[groupIndex].groupInstruction = getDefaultInstruction(value, newGroups[groupIndex].groupLabel);
            // Reset word limit for non-fill-in-blank types
            if (value !== 'fill-in-blank') {
                newGroups[groupIndex].wordLimit = '';
            } else {
                newGroups[groupIndex].wordLimit = 'NO MORE THAN TWO WORDS';
            }
        }

        // Update instruction's question range when groupLabel changes
        if (field === 'groupLabel') {
            newGroups[groupIndex].groupInstruction = getDefaultInstruction(newGroups[groupIndex].type, value);
        }

        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const removeGroup = (groupIndex) => {
        const newGroups = formData.questionGroups.filter((_, i) => i !== groupIndex);
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    // ========== Question Functions ==========
    const addQuestionToGroup = (groupIndex) => {
        const newGroups = [...formData.questionGroups];
        newGroups[groupIndex].questions.push({ questionText: '', correctAnswer: '', explanation: '' });
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const updateQuestion = (groupIndex, qIndex, field, value) => {
        const newGroups = [...formData.questionGroups];
        newGroups[groupIndex].questions[qIndex][field] = value;
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const removeQuestion = (groupIndex, qIndex) => {
        const newGroups = [...formData.questionGroups];
        newGroups[groupIndex].questions = newGroups[groupIndex].questions.filter((_, i) => i !== qIndex);
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    // ========== Multiple Choice Options ==========
    const updateOption = (groupIndex, qIndex, optIndex, value) => {
        const newGroups = [...formData.questionGroups];
        if (!newGroups[groupIndex].questions[qIndex].options) {
            newGroups[groupIndex].questions[qIndex].options = ['', '', '', ''];
        }
        newGroups[groupIndex].questions[qIndex].options[optIndex] = value;
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    // ========== Submit ==========
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Flatten question groups into questions array for backend
        const flatQuestions = [];
        formData.questionGroups.forEach(group => {
            group.questions.forEach(q => {
                flatQuestions.push({
                    questionText: q.questionText,
                    type: group.type,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    wordLimit: group.wordLimit,
                    groupLabel: group.groupLabel,
                    groupInstruction: group.groupInstruction
                });
            });
        });

        try {
            await readingService.createPassage({
                title: formData.title,
                topic: formData.topic,
                level: formData.level,
                passageText: formData.passageText,
                questions: flatQuestions
            });
            setToast({ message: 'Passage created successfully!', type: 'success' });
            setTimeout(() => navigate('/reading'), 1500);
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to create passage.', type: 'error' });
            setLoading(false);
        }
    };

    // Count total questions
    const totalQuestions = formData.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);

    return (
        <div style={{ minHeight: 'calc(100vh - 74px)', background: 'var(--bg-base)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Create New Passage</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Add an IELTS reading passage with question groups</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* ========== Section 1: Basic Info ========== */}
                    <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--primary)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                            Basic Information
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Title *</label>
                                <input
                                    className="form-input"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. The Cork Oak"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Topic *</label>
                                <input
                                    className="form-input"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Nature & Environment"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Level</label>
                                <select
                                    className="form-input"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                >
                                    {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ========== Section 2: Passage Text ========== */}
                    <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--primary)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                            Passage Content
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                            Paste the full reading text. Line breaks will be preserved.
                        </p>
                        <textarea
                            className="form-input"
                            name="passageText"
                            value={formData.passageText}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                minHeight: '400px',
                                fontFamily: 'Georgia, serif',
                                lineHeight: '1.8',
                                fontSize: '1.05rem',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'justify',
                                resize: 'vertical'
                            }}
                            placeholder="Paste the full reading passage here...

Paragraph 1...

Paragraph 2...

The text will preserve line breaks exactly as you paste it."
                        />
                    </div>

                    {/* ========== Section 3: Question Groups ========== */}
                    <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: 'var(--primary)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                                Question Groups ({totalQuestions} questions)
                            </h2>
                            <button
                                type="button"
                                onClick={addQuestionGroup}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                + Add Question Group
                            </button>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Group questions by type (e.g., Questions 1-5: Fill in blank). Each group shares the same type, instruction, and word limit.
                        </p>

                        {formData.questionGroups.length === 0 && (
                            <div style={{
                                padding: '48px',
                                textAlign: 'center',
                                background: 'var(--bg-surface)',
                                borderRadius: '12px',
                                border: '2px dashed var(--border)'
                            }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No question groups yet. Click "Add Question Group" to start.</p>
                            </div>
                        )}

                        {formData.questionGroups.map((group, gIndex) => (
                            <div key={gIndex} style={{
                                background: 'var(--bg-surface)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                {/* Group Header */}
                                <div style={{
                                    padding: '16px 20px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                        Group {gIndex + 1}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeGroup(gIndex)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                                    >
                                        Delete Group
                                    </button>
                                </div>

                                {/* Group Settings */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Group Label</label>
                                            <input
                                                className="form-input"
                                                value={group.groupLabel}
                                                onChange={(e) => updateGroup(gIndex, 'groupLabel', e.target.value)}
                                                placeholder="e.g. Questions 1-5"
                                                style={{ width: '100%', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Question Type</label>
                                            <select
                                                className="form-input"
                                                value={group.type}
                                                onChange={(e) => updateGroup(gIndex, 'type', e.target.value)}
                                                style={{ width: '100%', fontSize: '0.9rem' }}
                                            >
                                                {questionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Group Instruction</label>
                                        <textarea
                                            className="form-input"
                                            value={group.groupInstruction}
                                            onChange={(e) => updateGroup(gIndex, 'groupInstruction', e.target.value)}
                                            placeholder="e.g. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer."
                                            style={{ width: '100%', fontSize: '0.95rem', minHeight: '160px', resize: 'vertical', lineHeight: '1.6' }}
                                        />
                                    </div>

                                    {/* Questions in this group */}
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Questions ({group.questions.length})</span>
                                            <button
                                                type="button"
                                                onClick={() => addQuestionToGroup(gIndex)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                + Add Question
                                            </button>
                                        </div>

                                        {group.questions.map((q, qIndex) => (
                                            <div key={qIndex} style={{
                                                background: 'var(--bg-elevated)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                marginBottom: '10px',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>Q{qIndex + 1}</span>
                                                    {group.questions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeQuestion(gIndex, qIndex)}
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>

                                                <div style={{ marginBottom: '10px' }}>
                                                    <input
                                                        className="form-input"
                                                        value={q.questionText}
                                                        onChange={(e) => updateQuestion(gIndex, qIndex, 'questionText', e.target.value)}
                                                        placeholder="Question text or statement..."
                                                        style={{ width: '100%', fontSize: '0.9rem' }}
                                                    />
                                                </div>

                                                {/* Multiple choice options */}
                                                {group.type === 'multiple-choice' && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                                                        {[0, 1, 2, 3].map(optIndex => (
                                                            <input
                                                                key={optIndex}
                                                                className="form-input"
                                                                value={q.options?.[optIndex] || ''}
                                                                onChange={(e) => updateOption(gIndex, qIndex, optIndex, e.target.value)}
                                                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                                style={{ fontSize: '0.85rem' }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Correct Answer *</label>
                                                        <input
                                                            className="form-input"
                                                            value={q.correctAnswer}
                                                            onChange={(e) => updateQuestion(gIndex, qIndex, 'correctAnswer', e.target.value)}
                                                            placeholder={group.type === 'true-false-not-given' ? 'TRUE/FALSE/NOT GIVEN' : 'Answer'}
                                                            style={{ width: '100%', fontSize: '0.9rem', borderColor: 'rgba(34, 197, 94, 0.5)' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Explanation</label>
                                                        <input
                                                            className="form-input"
                                                            value={q.explanation}
                                                            onChange={(e) => updateQuestion(gIndex, qIndex, 'explanation', e.target.value)}
                                                            placeholder="Why this is the correct answer..."
                                                            style={{ width: '100%', fontSize: '0.9rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/reading')}
                            style={{
                                padding: '14px 28px',
                                background: 'var(--bg-elevated)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '14px 32px',
                                background: loading ? '#666' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                            }}
                        >
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
