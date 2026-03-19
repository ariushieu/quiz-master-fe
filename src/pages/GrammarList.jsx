import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { grammarService } from '../services/grammarService';
import { useAuth } from '../context/AuthContext';

export default function GrammarList() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    loadLessons();
  }, [filters]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getLessons(filters);
      setLessons(data);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Grammar Lessons</h1>
        {user?.role === 'admin' && (
          <Link to="/grammar/create" className="btn btn-primary">
            + Create Lesson
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search lessons..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          style={{ flex: '1', minWidth: '200px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
        />
        
        <select
          value={filters.level}
          onChange={(e) => handleFilterChange('level', e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Categories</option>
          <option value="tenses">Tenses</option>
          <option value="conditionals">Conditionals</option>
          <option value="passive-voice">Passive Voice</option>
          <option value="modals">Modals</option>
          <option value="reported-speech">Reported Speech</option>
          <option value="articles">Articles</option>
          <option value="prepositions">Prepositions</option>
        </select>
      </div>

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <div className="empty-state">
          <p>No grammar lessons found</p>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {lessons.map(lesson => (
            <Link
              key={lesson._id}
              to={`/grammar/${lesson._id}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{lesson.title}</h3>
                <span className={`badge badge-${lesson.level}`}>
                  {lesson.level}
                </span>
              </div>
              
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {lesson.description}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="tag">{lesson.category}</span>
                <span className="tag">{'⭐'.repeat(lesson.difficulty)}</span>
                <span className="tag">{lesson.exercises.length} exercises</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                By {lesson.createdBy?.username || 'Unknown'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
