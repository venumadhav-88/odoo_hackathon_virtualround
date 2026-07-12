import React from 'react';

/**
 * CategoryDistributionChart Component.
 * Custom CSS horizontal bar chart displaying asset distributions across categories.
 * @param {Object} props
 */
export const CategoryDistributionChart = ({ data = [] }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '0.25rem',
      }}
    >
      <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
        Asset Distribution by Category
      </h4>

      {data.length === 0 ? (
        <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          No category records found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flexGrow: 1, justifyContent: 'center' }}>
          {data.slice(0, 5).map((item) => {
            const pct = (item.value / maxVal) * 100;
            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {item.name}
                  </span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{item.value}</strong>
                </div>
                {/* Progress bar track */}
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  {/* Fill bar */}
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
