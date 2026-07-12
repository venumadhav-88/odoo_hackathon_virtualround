import React from 'react';
import { APP_CONFIG } from '@/config/app';
import { ShauntLogo } from '@/components/common';
import { AuthIllustration } from './AuthIllustration';

/**
 * AuthLayout Component.
 * Implements split-screen layout wrapping login, forgot-password, and reset-password forms.
 * @param {Object} props - Properties.
 * @param {React.ReactNode} props.children - Subform card layout.
 * @returns {JSX.Element} Auth Layout.
 */
export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-split-container">
      {/* Left illustration pane */}
      <div className="auth-left-pane">
        <div className="auth-branding-logo">
          <ShauntLogo size={24} />
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
            <ShauntLogo size={28} />
            <h2>Shaunt</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
