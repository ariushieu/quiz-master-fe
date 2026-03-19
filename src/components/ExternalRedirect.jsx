import { useEffect } from 'react';

export default function ExternalRedirect({ url }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', paddingTop: '60px' }}>
        <div className="card" style={{ padding: '48px 32px' }}>
          <div className="loading">
            <div className="spinner"></div>
          </div>
          <p className="text-secondary" style={{ marginTop: '24px' }}>
            Redirecting to {url}...
          </p>
        </div>
      </div>
    </div>
  );
}
