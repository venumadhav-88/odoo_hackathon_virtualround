import React from 'react';

/**
 * SettingsSection Component.
 * Generic styled wrapper section displaying headers and options lists.
 * @param {Object} props
 */
export const SettingsSection = ({ title, description, children }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        flex: 1,
        height: 'fit-content',
      }}
    >
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{title}</h3>
        {description && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};
