import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { usePageTitle } from '@/hooks';
import { ActionButton } from '@/components/common';
import { ROUTES } from '@/constants/routes';

/**
 * NotFound Page Component.
 * Visual error block rendered when navigating to non-existent route pathways.
 * @returns {JSX.Element} NotFound Page.
 */
const NotFound = () => {
  usePageTitle('Page Not Found');
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="auth-container">
      <div className="auth-card not-found-card">
        <div className="not-found-icon-wrapper">
          <ShieldAlert size={48} />
        </div>
        <h1 className="auth-title">404 - Not Found</h1>
        <p className="dialog-description">
          The requested view does not exist or has been relocated. Check the address and try again.
        </p>
        <ActionButton 
          onClick={handleReturn} 
          variant="primary" 
          className="btn btn-primary btn-full"
        >
          Return to Dashboard
        </ActionButton>
      </div>
    </div>
  );
};

export default NotFound;
