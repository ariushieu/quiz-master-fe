import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { grammarService } from '../services/grammarService';
import Toast from '../components/Toast';

export default function GrammarPractice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('learn'); // 'learn' or 'practice'
  const [currentExercise, setCurrentExercise] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getLesson(id);
      setLesson(data);
    } catch (error) {
      setToast({ message: 'Failed to load lesson', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (exerciseId, answer) => {
    setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const answerArray = Object.entries(answers).map(([exerciseId, userAnswer]) => ({
        exerciseId,
        userAnswer
      }));

      const result = await grammarService.submitAnswers(id, answerArray);
      setResults(result);
      setShowResults(true);
    } catch (error) {
      setToast({ message: 'Failed to submit answers', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container" style={{ paddingTop: '100px' }}>
        <p>Lesson not found</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container" style={{ paddingTop: '100px', maxWidth: '800px' }}>
        <div className="card">
          <h1>Results</h1>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {results.passed ? '🎉' : '📚'}
            </div>
            <h2>Score: {results.score}%</h2>
            <p>{results.correct} / {results.total} correct</p>
            <p style={{ color: results.passed ? 'green' : 'orange' }}>
              {results.passed ? 'Passed! Great job!' : 'Keep practicing!'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/grammar')} className="btn btn-secondary">
              Back to Lessons
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'learn') {
    return (
      <div className="container" style={{ paddingTop: '100px', maxWidth: '800px' }}>
        <div className="card">
          <h1>{lesson.title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className={`badge badge-${lesson.level}`}>{lesson.level}</span>
            <span className="tag">{lesson.category}</span>
          </div>

          <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} />
          </div>

          {lesson.examples && lesson.examples.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Examples:</h3>
              {lesson.examples.map((example, idx) => (
                <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--color-border-light)', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>"{example.sentence}"</p>
                  {example.translation && (
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      {example.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setCurrentStep('practice')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Start Practice ({lesson.exercises.length} exercises)
          </button>
        </div>
      </div>
    );
  }

  const exercise = lesson.exercises[currentExercise];
  const progress = ((currentExercise + 1) / lesson.exercises.length) * 100;

  return (
    <div className="container" style={{ paddingTop: '100px', maxWidth: '800px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Question {currentExercise + 1} of {lesson.exercises.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--color-border-light)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-success)', width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <ExerciseComponent
          exercise={exercise}
          answer={answers[exercise._id]}
          onAnswer={(answer) => handleAnswer(exercise._id, answer)}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {currentExercise > 0 && (
            <button
              onClick={() => setCurrentExercise(prev => prev - 1)}
              className="btn btn-secondary"
            >
              Previous
            </button>
          )}
          
          {currentExercise < lesson.exercises.length - 1 ? (
            <button
              onClick={() => setCurrentExercise(prev => prev + 1)}
              className="btn btn-primary"
              style={{ marginLeft: 'auto' }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ marginLeft: 'auto' }}
              disabled={Object.keys(answers).length < lesson.exercises.length}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseComponent({ exercise, answer, onAnswer }) {
  if (exercise.type === 'multiple-choice') {
    return (
      <div>
        <h3>{exercise.question}</h3>
        {exercise.hint && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            💡 Hint: {exercise.hint}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          {exercise.options.map((option, idx) => (
            <label
              key={idx}
              style={{
                padding: '1rem',
                border: '2px solid',
                borderColor: answer === option ? 'var(--color-success)' : 'var(--color-border-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: answer === option ? 'var(--color-success-bg)' : 'var(--color-surface)'
              }}
            >
              <input
                type="radio"
                name={exercise._id}
                value={option}
                checked={answer === option}
                onChange={(e) => onAnswer(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (exercise.type === 'fill-in-blank') {
    const parts = exercise.question.split(/___|\{blank\}/);
    
    return (
      <div>
        <h3>Fill in the blanks:</h3>
        {exercise.hint && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            💡 Hint: {exercise.hint}
          </p>
        )}
        <div style={{ fontSize: '1.1rem', lineHeight: '2' }}>
          {parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < parts.length - 1 && (
                <input
                  type="text"
                  value={answer?.[idx] || ''}
                  onChange={(e) => {
                    const newAnswer = [...(answer || [])];
                    newAnswer[idx] = e.target.value;
                    onAnswer(newAnswer);
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '4px',
                    minWidth: '100px',
                    margin: '0 0.25rem'
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (exercise.type === 'sentence-correction' || exercise.type === 'sentence-reorder') {
    return (
      <div>
        <h3>{exercise.question}</h3>
        {exercise.hint && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            💡 Hint: {exercise.hint}
          </p>
        )}
        <textarea
          value={answer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '1rem',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        />
      </div>
    );
  }

  return null;
}
