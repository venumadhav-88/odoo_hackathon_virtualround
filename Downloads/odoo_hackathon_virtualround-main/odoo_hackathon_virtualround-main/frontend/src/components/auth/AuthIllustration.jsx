import React from 'react';

/**
 * AuthIllustration Component.
 * Tech grid layout displaying corporate network links, node structures, and taglines.
 * @returns {JSX.Element} Illustration panel graphic view.
 */
export const AuthIllustration = () => {
  return (
    <div className="auth-illustration-section">
      <div className="auth-illustration-graphic">
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="auth-illustration-svg"
        >
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-text-main)" />
            </linearGradient>
          </defs>

          {/* Tech Grid */}
          <path
            d="M 20 20 L 380 20 M 20 60 L 380 60 M 20 100 L 380 100 M 20 140 L 380 140 M 20 180 L 380 180 M 20 220 L 380 220 M 20 260 L 380 260"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <path
            d="M 60 20 L 60 280 M 120 20 L 120 280 M 180 20 L 180 280 M 240 20 L 240 280 M 300 20 L 300 280 M 360 20 L 360 280"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />

          {/* Link Nodes */}
          <g opacity="0.85">
            <line x1="80" y1="180" x2="200" y2="80" stroke="url(#glowGrad)" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="200" y1="80" x2="320" y2="180" stroke="url(#glowGrad)" strokeWidth="2" />
            <line x1="80" y1="180" x2="200" y2="220" stroke="url(#glowGrad)" strokeWidth="2" />
            <line x1="200" y1="220" x2="320" y2="180" stroke="url(#glowGrad)" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="200" y1="80" x2="200" y2="220" stroke="url(#glowGrad)" strokeWidth="1.5" />

            <circle cx="200" cy="80" r="8" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="2" />
            <circle cx="80" cy="180" r="6" fill="var(--color-text-muted)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="320" cy="180" r="6" fill="var(--color-text-muted)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="200" cy="220" r="8" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Secure Shield tag */}
          <g transform="translate(180, 125)" opacity="0.95">
            <rect x="0" y="0" width="40" height="46" rx="6" fill="rgba(15, 15, 15, 0.9)" stroke="var(--color-primary)" strokeWidth="2" />
            <path
              d="M 12 23 L 18 29 L 28 17"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="auth-illustration-text">
        <h2 className="auth-tagline">Secure Enterprise Asset Intelligence</h2>
        <p className="auth-description">
          Monitor life cycles, schedule maintenance checks, and coordinate directory custodians with a centralized system dashboard.
        </p>
      </div>
    </div>
  );
};
