import React from 'react';

/**
 * SkeletonCard Component.
 * Pulsing card skeleton structure representing loading grid elements.
 * @returns {JSX.Element} Card skeleton layout block.
 */
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card-container" aria-busy="true">
      <div className="skeleton-card-header skeleton-pulse" />
      <div className="skeleton-card-body">
        <div className="skeleton-card-line skeleton-pulse" />
        <div className="skeleton-card-line line-short skeleton-pulse" />
      </div>
    </div>
  );
};
