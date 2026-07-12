import React from 'react';

/**
 * LoaderOverlay Component.
 * Fixed full-screen glassmorphic blocker modal displaying a loading spinner.
 * @returns {JSX.Element} Loader overlay.
 */
export const LoaderOverlay = () => {
  return (
    <div className="loading-overlay loader-overlay-fixed" aria-busy="true">
      <div className="loading-spinner" />
    </div>
  );
};
