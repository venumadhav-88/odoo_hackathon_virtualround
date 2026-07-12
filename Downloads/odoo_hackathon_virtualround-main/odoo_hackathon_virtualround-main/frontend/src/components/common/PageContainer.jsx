import React from 'react';

export const PageContainer = ({ children }) => {
  return (
    <div className="page-container page-container-full">
      {children}
    </div>
  );
};
