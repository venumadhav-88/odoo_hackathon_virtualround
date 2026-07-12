import React from 'react';

/**
 * TableLoader Component.
 * Skeleton rows mapping structured cells to render list fetch loader previews.
 * @param {Object} props - Properties.
 * @param {number} [props.rows=5] - Number of skeleton rows to render.
 * @returns {JSX.Element} Table skeleton list loader.
 */
export const TableLoader = ({ rows = 5 }) => {
  return (
    <div className="table-loader-container" aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="table-loader-row">
          <div className="table-loader-cell cell-sm skeleton-pulse" />
          <div className="table-loader-cell cell-lg skeleton-pulse" />
          <div className="table-loader-cell cell-md skeleton-pulse" />
          <div className="table-loader-cell cell-sm skeleton-pulse" />
        </div>
      ))}
    </div>
  );
};
