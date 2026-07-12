import React from 'react';

export const ShauntLogo = ({ size = 24 }) => {
  const labelSize = size * 0.42;

  return (
    <div
      className="shaunt-logo"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size} height={size} focusable="false">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="var(--color-primary)" />
        <path
          d="M16 18c0-2.209 1.791-4 4-4h6c3.314 0 6 2.686 6 6s-2.686 6-6 6h-4c-1.105 0-2 .895-2 2s.895 2 2 2h10v4H20c-3.314 0-6-2.686-6-6s2.686-6 6-6h4c1.105 0 2-.895 2-2s-.895-2-2-2h-8v-4h8z"
          fill="#050505"
        />
      </svg>
      <span className="shaunt-logo-text" style={{ fontSize: labelSize }}>
        S
      </span>
    </div>
  );
};