import React, { useState } from 'react';
import { APP_CONFIG } from '@/config/app';
import { AuthIllustration } from './AuthIllustration';
import LogoSrc from '@/assets/logo.png';

/**
 * AuthLayout Component.
 * Implements split-screen layout wrapping login, forgot-password, and reset-password forms.
 * @param {Object} props - Properties.
 * @param {React.ReactNode} props.children - Subform card layout.
 * @returns {JSX.Element} Auth Layout.
 */
export const AuthLayout = ({ children }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="auth-split-container">
      {/* Left illustration pane */}
      <div className="auth-left-pane">
        <div className="auth-branding-logo">
          {!logoError ? (
            <img 
              src={LogoSrc} 
              alt="Shaunt Logo" 
              className="sidebar-logo-img" 
              onError={() => setLogoError(true)} 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>S</span>
          )}
          <span>Shaunt</span>
        </div>
        
        <AuthIllustration />
        
        <div className="auth-footer-text">
          {APP_CONFIG.NAME} v{APP_CONFIG.VERSION}
        </div>
      </div>

      {/* Right form card pane */}
      <div className="auth-right-pane">
        <div className="auth-card">
          <div className="auth-mobile-branding">
            {!logoError ? (
              <img 
                src={LogoSrc} 
                alt="Shaunt Logo" 
                className="sidebar-logo-img" 
                onError={() => setLogoError(true)} 
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>S</span>
            )}
            <h2>Shaunt</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

