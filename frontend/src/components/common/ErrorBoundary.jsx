import React, { Component } from 'react';
import { APP_CONFIG } from '@/config/app';
import { logger } from '@/utils/logger';

/**
 * ErrorBoundary Component.
 * Class component acting as a global layout error fallback shield.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Unhandled render crash intercepted by ErrorBoundary:', error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-container">
          <div className="auth-card error-boundary-card">
            <h1 className="auth-title">Application Error</h1>
            <p className="dialog-description">
              An unexpected client-side crash occurred. You can attempt to restore state or reload the window.
            </p>
            <div className="error-boundary-code">
              {this.state.error?.toString() || 'Unknown Runtime Error'}
            </div>
            <div className="error-boundary-actions">
              <button onClick={this.handleTryAgain} className="btn btn-secondary">
                Try Again
              </button>
              <button onClick={this.handleReload} className="btn btn-primary">
                Reload Page
              </button>
            </div>
            <p className="error-boundary-version">
              {APP_CONFIG.NAME} v{APP_CONFIG.VERSION}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
