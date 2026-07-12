import React from 'react';
import { Shield } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';
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
          <Shield className="sidebar-logo" size={24} />
          <span>AssetGuard</span>
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
            <Shield className="sidebar-logo" size={28} />
            <h2>AssetGuard</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
