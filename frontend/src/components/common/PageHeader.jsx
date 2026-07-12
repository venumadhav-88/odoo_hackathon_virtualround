import React from 'react';

export const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="page-header">
      <div className="page-header-title-wrapper">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
};
