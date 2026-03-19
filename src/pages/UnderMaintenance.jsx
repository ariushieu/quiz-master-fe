import { Link } from 'react-router-dom';

export default function UnderMaintenance({ feature = 'This feature' }) {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', paddingTop: '60px' }}>
        <div className="card" style={{ padding: '48px 32px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>
            🚧
          </div>
          <h1 style={{ marginBottom: '16px' }}>Under Maintenance</h1>
          <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
            {feature} is currently under maintenance. We're working hard to bring you an amazing experience!
          </p>
          <div style={{ 
            background: 'var(--bg-surface)', 
            padding: '20px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '32px',
            border: '1px solid var(--border)'
          }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              💡 In the meantime, check out our other features like Flashcards and Reading Practice!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/sets" className="btn btn-primary">
              Go to Flashcards
            </Link>
            <Link to="/reading" className="btn btn-secondary">
              Reading Practice
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
