import React from 'react';

export const StatusBadge = ({ status, label }) => {
  const getBadgeClass = () => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'success':
      case 'active':
      case 'returned':
      case 'completed':
        return 'badge-success';
      case 'assigned':
      case 'warning':
      case 'pending':
      case 'in_progress':
      case 'in progress':
        return 'badge-warning';
      case 'under_maintenance':
      case 'maintenance':
      case 'primary':
      case 'cancelled':
      case 'scheduled':
        return 'badge-primary';
      case 'retired':
      case 'danger':
      case 'inactive':
      case 'overdue':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {label || status}
    </span>
  );
};
