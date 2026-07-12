import React from 'react';

/**
 * AssetUtilizationChart Component.
 * Donut progress ring representing the percentage of assets currently utilized.
 * @param {Object} props
 */
export const AssetUtilizationChart = ({
  utilizationRate = 0,
  assigned = 0,
  available = 0,
  maintenance = 0,
  retired = 0,
}) => {
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(utilizationRate, 100) / 100) * circumference;

  const legendItems = [
    { label: 'Assigned (In Use)', count: assigned, color: 'var(--color-warning)' },
    { label: 'Available (Idle)', count: available, color: 'var(--color-success)' },
    { label: 'In Maintenance', count: maintenance, color: 'var(--color-primary)' },
    { label: 'Retired (Disposal)', count: retired, color: 'var(--color-danger)' },
  ];

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
        Asset Utilization & Registry Status
      </h4>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          flexGrow: 1,
          padding: '0.5rem 0',
        }}
      >
        {/* SVG Circle */}
        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Circle */}
            <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
            {/* Dynamic Progress Circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          {/* Gauge Center text */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: '1' }}>
              {utilizationRate.toFixed(1)}%
            </span>
            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              Utilized
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', minWidth: '160px', flexGrow: 1 }}>
          {legendItems.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
              </div>
              <strong style={{ color: 'var(--color-text-main)' }}>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
