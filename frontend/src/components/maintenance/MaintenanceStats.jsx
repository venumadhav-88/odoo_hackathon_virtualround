import React, { useMemo } from 'react';
import { Wrench, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * MaintenanceStats Component.
 * Displays count metrics for scheduling and active maintenance events.
 * @param {Object} props
 */
export const MaintenanceStats = ({ maintenanceLogs }) => {
  const stats = useMemo(() => {
    const total = maintenanceLogs.length;
    const scheduled = maintenanceLogs.filter((m) => m.status === 'Scheduled').length;
    const inProgress = maintenanceLogs.filter((m) => m.status === 'In Progress').length;
    const completed = maintenanceLogs.filter((m) => m.status === 'Completed').length;
    const overdue = maintenanceLogs.filter((m) => m.status === 'Overdue').length;

    return { total, scheduled, inProgress, completed, overdue };
  }, [maintenanceLogs]);

  const cards = [
    { title: 'Total Maintenance', value: stats.total, icon: Wrench, accent: 'primary' },
    { title: 'Scheduled', value: stats.scheduled, icon: Calendar, accent: 'primary' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, accent: 'warning' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle, accent: 'success' },
    { title: 'Overdue', value: stats.overdue, icon: AlertTriangle, accent: 'danger' },
  ];

  return (
    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
      {cards.map(({ title, value, icon: Icon, accent }) => (
        <div key={title} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{title}</span>
            <div className={`stat-card-icon-wrapper ${accent !== 'primary' ? accent : ''}`}>
              <Icon size={18} />
            </div>
          </div>
          <div className="stat-card-value">{value}</div>
        </div>
      ))}
    </div>
  );
};
