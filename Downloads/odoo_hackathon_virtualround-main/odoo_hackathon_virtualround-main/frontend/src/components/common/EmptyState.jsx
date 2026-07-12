import React from 'react';
import { Database } from 'lucide-react';

export const EmptyState = ({ 
  title = 'No records found', 
  description = 'There is currently no data matching your query.', 
  icon: Icon = Database, 
  action 
}) => {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" size={48} />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
