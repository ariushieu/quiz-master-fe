import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColors = {
        success: 'rgba(34, 197, 94, 0.9)', // var(--success)
        error: 'rgba(239, 68, 68, 0.9)',   // var(--error)
        info: 'rgba(59, 130, 246, 0.9)'     // var(--info)
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px', // Top-right position
                right: '20px',
                background: bgColors[type] || bgColors.info,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px', // var(--radius-md)
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 9999,
                animation: 'slideIn 0.3s ease-out',
                fontWeight: '500',
                fontSize: '0.95rem',
                backdropFilter: 'blur(4px)',
                minWidth: '280px'
            }}
        >
            <span>{message}</span>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Toast;
