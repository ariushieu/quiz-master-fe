import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { grammarService } from '../services/grammarService';
import Toast from '../components/Toast';

export default function CreateGrammar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'intermediate',
    category: 'tenses',
    content: '',
    examples: [],
    exercises: [],
    tags: [],
    difficulty: 3
  });

  const [currentExample, setCurrentExample] = useState({ sentence: '', translation: '' });
  const [currentExercise, setCurrentExercise] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    hint: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      const data = await grammarService.getLesson(id);
      setFormData(data);
    } catch (error) {
      setToast({ message: 'Failed to load lesson', type: 'error' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExample = () => {
    if (currentExample.sentence) {
      setFormData(prev => ({
        ...prev,
        examples: [...prev.examples, currentExample]
      }));
      setCurrentExample({ sentence: '', translation: '' });
    }
  };

  const removeExample = (index) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const addExercise = () => {
    if (currentExercise.question) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...currentExercise }]
      }));
      setCurrentExercise({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        hint: ''
      });
    }
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || formData.exercises.length === 0) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await grammarService.updateLesson(id, formData);
        setToast({ message: 'Lesson updated successfully!', type: 'success' });
      } else {
        await grammarService.createLesson(formData);
        setToast({ message: 'Lesson created successfully!', type: 'success' });
      }
      setTimeout(() => navigate('/grammar'), 1500);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to save lesson', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', maxWidth: '900px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h1>{isEdit ? 'Edit' : 'Create'} Grammar Lesson</h1>

      <form onSubmit={handleSubmit} className="card">
        {/* Basic Info */}
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows="3"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Level</label>
            <select value={formData.level} onChange={(e) => handleChange('level', e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="tenses">Tenses</option>
              <option value="conditionals">Conditionals</option>
              <option value="passive-voice">Passive Voice</option>
              <option value="modals">Modals</option>
              <option value="reported-speech">Reported Speech</option>
              <option value="articles">Articles</option>
              <option value="prepositions">Prepositions</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Grammar Explanation *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows="8"
            placeholder="Explain the grammar rule in detail..."
            required
          />
        </div>

        {/* Examples */}
        <div className="form-group">
          <label>Examples</label>
          {formData.examples.map((example, idx) => (
            <div key={idx} style={{ padding: '0.5rem', background: 'var(--color-border-light)', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>{example.sentence}</div>
                {example.translation && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{example.translation}</div>}
              </div>
              <button type="button" onClick={() => removeExample(idx)} className="btn-icon">🗑️</button>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Example sentence"
              value={currentExample.sentence}
              onChange={(e) => setCurrentExample(prev => ({ ...prev, sentence: e.target.value }))}
              style={{ flex: 2 }}
            />
            <input
              type="text"
              placeholder="Translation (optional)"
              value={currentExample.translation}
              onChange={(e) => setCurrentExample(prev => ({ ...prev, translation: e.target.value }))}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addExample} className="btn btn-secondary">Add</button>
          </div>
        </div>

        {/* Exercises */}
        <div className="form-group">
          <label>Exercises * (at least 1 required)</label>
          {formData.exercises.map((exercise, idx) => (
            <div key={idx} style={{ padding: '1rem', background: 'var(--color-border-light)', borderRadius: '4px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <strong>{exercise.type}</strong>
                  <p style={{ margin: '0.25rem 0' }}>{exercise.question}</p>
                </div>
                <button type="button" onClick={() => removeExercise(idx)} className="btn-icon">🗑️</button>
              </div>
            </div>
          ))}

          <div style={{ border: '1px dashed var(--color-border-light)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h4>Add New Exercise</h4>
            
            <select
              value={currentExercise.type}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, type: e.target.value }))}
              style={{ marginBottom: '1rem' }}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="fill-in-blank">Fill in the Blank</option>
              <option value="sentence-correction">Sentence Correction</option>
            </select>

            <input
              type="text"
              placeholder="Question"
              value={currentExercise.question}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, question: e.target.value }))}
              style={{ marginBottom: '0.5rem' }}
            />

            {currentExercise.type === 'multiple-choice' && (
              <>
                {currentExercise.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...currentExercise.options];
                      newOptions[idx] = e.target.value;
                      setCurrentExercise(prev => ({ ...prev, options: newOptions }));
                    }}
                    style={{ marginBottom: '0.5rem' }}
                  />
                ))}
              </>
            )}

            <input
              type="text"
              placeholder="Correct Answer"
              value={currentExercise.correctAnswer}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, correctAnswer: e.target.value }))}
              style={{ marginBottom: '0.5rem' }}
            />

            <input
              type="text"
              placeholder="Hint (optional)"
              value={currentExercise.hint}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, hint: e.target.value }))}
              style={{ marginBottom: '0.5rem' }}
            />

            <button type="button" onClick={addExercise} className="btn btn-secondary">
              Add Exercise
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" onClick={() => navigate('/grammar')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')} Lesson
          </button>
        </div>
      </form>
    </div>
  );
}
