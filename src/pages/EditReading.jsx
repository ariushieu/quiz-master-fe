import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import readingService from '../services/readingService';
import Toast from '../components/Toast';

const EditReading = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        loadPassage();
    }, [id]);

    // Convert flat questions to groups
    const questionsToGroups = (questions) => {
        const groupsMap = {};

        questions.forEach(q => {
            const key = q.groupLabel || 'Ungrouped';
            if (!groupsMap[key]) {
                groupsMap[key] = {
                    groupLabel: q.groupLabel || 'Questions',
                    groupInstruction: q.groupInstruction || '',
                    type: q.type || 'fill-in-blank',
                    questions: []
                };
            }
            groupsMap[key].questions.push({
                questionText: q.questionText || '',
                correctAnswer: q.correctAnswer || '',
                explanation: q.explanation || '',
                subHeading: q.subHeading || '',
                options: q.options || []
            });
        });

        return Object.values(groupsMap);
    };

    // Convert groups back to flat questions
    const groupsToQuestions = (groups) => {
        const flat = [];
        groups.forEach(group => {
            group.questions.forEach(q => {
                flat.push({
                    questionText: q.questionText,
                    type: group.type,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    subHeading: q.subHeading || '',
                    groupLabel: group.groupLabel,
                    groupInstruction: group.groupInstruction
                });
            });
        });
        return flat;
    };

    const loadPassage = async () => {
        try {
            const data = await readingService.getPassageById(id);
            setFormData({
                title: data.title || '',
                topic: data.topic || '',
                level: data.level || 'IELTS Passage 1',
                passageText: data.passageText || '',
                questionGroups: questionsToGroups(data.questions || [])
            });
        } catch (error) {
            setToast({ message: 'Failed to load passage', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Auto-generate instruction based on question type
    const getDefaultInstruction = (type, groupLabel) => {
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

    // Group handlers
    const addGroup = () => {
        const idx = formData.questionGroups.length;
        const groupLabel = `Questions ${idx * 5 + 1}-${idx * 5 + 5}`;
        const type = 'fill-in-blank';
        setFormData(prev => ({
            ...prev,
            questionGroups: [...prev.questionGroups, {
                groupLabel: groupLabel,
                groupInstruction: getDefaultInstruction(type, groupLabel),
                type: type,
                questions: [{ questionText: '', correctAnswer: '', explanation: '', subHeading: '' }]
            }]
        }));
    };

    const updateGroup = (gIndex, field, value) => {
        const newGroups = [...formData.questionGroups];
        newGroups[gIndex][field] = value;

        // Auto-update instruction when type changes
        if (field === 'type') {
            newGroups[gIndex].groupInstruction = getDefaultInstruction(value, newGroups[gIndex].groupLabel);
        }

        // Update instruction's question range when groupLabel changes
        if (field === 'groupLabel') {
            newGroups[gIndex].groupInstruction = getDefaultInstruction(newGroups[gIndex].type, value);
        }

        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const removeGroup = (gIndex) => {
        if (!window.confirm('Delete this entire group?')) return;
        const newGroups = formData.questionGroups.filter((_, i) => i !== gIndex);
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    // Question handlers
    const addQuestion = (gIndex) => {
        const newGroups = [...formData.questionGroups];
        newGroups[gIndex].questions.push({ questionText: '', correctAnswer: '', explanation: '', subHeading: '' });
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const updateQuestion = (gIndex, qIndex, field, value) => {
        const newGroups = [...formData.questionGroups];
        newGroups[gIndex].questions[qIndex][field] = value;
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const removeQuestion = (gIndex, qIndex) => {
        const newGroups = [...formData.questionGroups];
        newGroups[gIndex].questions = newGroups[gIndex].questions.filter((_, i) => i !== qIndex);
        setFormData(prev => ({ ...prev, questionGroups: newGroups }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await readingService.updatePassage(id, {
                title: formData.title,
                topic: formData.topic,
                level: formData.level,
                passageText: formData.passageText,
                questions: groupsToQuestions(formData.questionGroups)
            });
            setToast({ message: 'Passage updated successfully!', type: 'success' });
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            setToast({ message: 'Failed to update passage', type: 'error' });
            setSaving(false);
        }
    };

    const totalQuestions = formData.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div style={{ minHeight: 'calc(100vh - 74px)', background: 'var(--bg-base)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Edit Passage</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Update reading passage details and question groups</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Basic Information</h2>
                        <div className="form-grid-3">
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Title *</label>
                                <input className="form-input" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Topic *</label>
                                <input className="form-input" name="topic" value={formData.topic} onChange={handleInputChange} required style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Level</label>
                                <select className="form-input" name="level" value={formData.level} onChange={handleInputChange} style={{ width: '100%' }}>
                                    {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Passage Text */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Passage Content</h2>
                        <textarea
                            className="form-input" name="passageText" value={formData.passageText} onChange={handleInputChange} required
                            style={{ width: '100%', minHeight: '250px', fontFamily: 'Georgia, serif', lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: 'justify', resize: 'vertical' }}
                        />
                    </div>

                    {/* Question Groups */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Question Groups ({totalQuestions} questions)</h2>
                            <button type="button" onClick={addGroup} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                                + Add Group
                            </button>
                        </div>

                        {formData.questionGroups.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>No question groups. Click "Add Group" to create one.</p>
                        ) : (
                            formData.questionGroups.map((group, gIndex) => (
                                <div key={gIndex} style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', overflow: 'hidden' }}>
                                    {/* Group Header */}
                                    <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Group {gIndex + 1}</span>
                                        <button type="button" onClick={() => removeGroup(gIndex)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Delete Group</button>
                                    </div>

                                    <div style={{ padding: '16px' }}>
                                        {/* Group Settings */}
                                        <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Group Label</label>
                                                <input className="form-input" value={group.groupLabel} onChange={(e) => updateGroup(gIndex, 'groupLabel', e.target.value)} style={{ width: '100%', fontSize: '0.9rem' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type</label>
                                                <select className="form-input" value={group.type} onChange={(e) => updateGroup(gIndex, 'type', e.target.value)} style={{ width: '100%', fontSize: '0.9rem' }}>
                                                    {questionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Group Instruction</label>
                                            <textarea className="form-input" value={group.groupInstruction} onChange={(e) => updateGroup(gIndex, 'groupInstruction', e.target.value)} style={{ width: '100%', fontSize: '0.95rem', minHeight: '160px', resize: 'vertical', lineHeight: '1.6' }} />
                                        </div>

                                        {/* Questions */}
                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Questions ({group.questions.length})</span>
                                                <button type="button" onClick={() => addQuestion(gIndex)} style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>+ Add Question</button>
                                            </div>

                                            {group.questions.map((q, qIndex) => (
                                                <div key={qIndex} style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '10px', marginBottom: '8px', border: '1px solid var(--border)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Q{qIndex + 1}</span>
                                                        {group.questions.length > 1 && (
                                                            <button type="button" onClick={() => removeQuestion(gIndex, qIndex)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                                                        )}
                                                    </div>
                                                    <input className="form-input" value={q.subHeading || ''} onChange={(e) => updateQuestion(gIndex, qIndex, 'subHeading', e.target.value)} placeholder="Sub-heading (e.g. Advantages of cork stoppers)" style={{ width: '100%', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '6px', background: 'rgba(99, 102, 241, 0.05)' }} />
                                                    <input className="form-input" value={q.questionText} onChange={(e) => updateQuestion(gIndex, qIndex, 'questionText', e.target.value)} placeholder="Question text..." style={{ width: '100%', fontSize: '0.85rem', marginBottom: '8px' }} />
                                                    <div className="form-grid-1-2">
                                                        <input className="form-input" value={q.correctAnswer} onChange={(e) => updateQuestion(gIndex, qIndex, 'correctAnswer', e.target.value)} placeholder="Answer" style={{ fontSize: '0.85rem', borderColor: 'rgba(34, 197, 94, 0.5)' }} />
                                                        <input className="form-input" value={q.explanation} onChange={(e) => updateQuestion(gIndex, qIndex, 'explanation', e.target.value)} placeholder="Explanation..." style={{ fontSize: '0.85rem' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={() => navigate('/admin')} style={{ padding: '14px 28px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={saving} style={{ padding: '14px 32px', background: saving ? '#666' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

export default EditReading;
