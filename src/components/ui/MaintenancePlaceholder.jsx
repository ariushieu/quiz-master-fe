import { useNavigate } from 'react-router-dom';

function WrenchIcon({ size = 28, color = 'var(--color-primary)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5.6L4 16.9V20h3.1l5-5.1a4.2 4.2 0 0 0 5.6-5.6l-3 3-2.1-2.1 3-3z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * IELTS MaintenancePlaceholder (Section 10)
 *
 * @param {string} title
 * @param {string} message
 * @param {boolean} fullPage
 */
export function MaintenancePlaceholder({
  title = 'Tính năng đang được phát triển',
  message = 'Chúng tôi đang hoàn thiện tính năng này. Vui lòng quay lại sau.',
  fullPage = true,
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage
          ? 'calc(100vh - var(--topbar-height) - 48px)'
          : '320px',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--card-radius)',
          padding: '56px 48px',
          textAlign: 'center',
          maxWidth: 420,
          width: '100%',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <WrenchIcon size={28} />
        </div>

        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--lh-normal)',
            marginBottom: 28,
          }}
        >
          {message}
        </p>

        {/* Maintenance tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--color-warning-bg)',
            color: 'var(--color-warning)',
            borderRadius: 'var(--badge-radius)',
            padding: '4px 12px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-semibold)',
            marginBottom: 24,
          }}
        >
          🚧 &nbsp;Đang phát triển
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
            padding: '8px 18px',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-medium)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--color-bg)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'var(--color-surface)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          ← Quay về Dashboard
        </button>
      </div>
    </div>
  );
}

