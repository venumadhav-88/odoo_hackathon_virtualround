import React from 'react';

/**
 * PageLoader Component.
 * Standard full-content-area loader spinner displaying custom text.
 * @param {Object} props - Properties.
 * @param {string} [props.message='Loading view...'] - Display message.
 * @returns {JSX.Element} Page loader view.
 */
export const PageLoader = ({ message = 'Loading view...' }) => {
  return (
    <div className="loading-overlay" aria-busy="true">
      <div className="loading-spinner" />
      <span className="loading-text">{message}</span>
    </div>
  );
};
