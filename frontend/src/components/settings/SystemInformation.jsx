import React from 'react';

/**
 * SystemInformation Component.
 * Displays application, api versions, build environments, and license terms.
 * @param {Object} props
 */
export const SystemInformation = ({ systemInfo = {} }) => {
  const infoItems = [
    { label: 'Application Name', value: systemInfo.appName },
    { label: 'Application Version', value: systemInfo.appVersion },
    { label: 'Frontend Version', value: systemInfo.frontendVersion },
    { label: 'Mock API Version', value: systemInfo.apiVersion },
    { label: 'Environment', value: systemInfo.environment },
    { label: 'Build Date', value: systemInfo.buildDate },
    { label: 'Developer/Author', value: systemInfo.developer },
    { label: 'License Code', value: systemInfo.license },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '600px' }}>
      {infoItems.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{item.label}</span>
          <strong style={{ color: 'var(--color-text-main)' }}>{item.value}</strong>
        </div>
      ))}
    </div>
  );
};
