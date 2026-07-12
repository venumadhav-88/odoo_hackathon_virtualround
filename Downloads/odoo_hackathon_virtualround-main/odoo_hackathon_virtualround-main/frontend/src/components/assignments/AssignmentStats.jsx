import React, { useMemo } from 'react';
import { ClipboardList, CheckCircle, Undo2, AlertCircle, CalendarDays } from 'lucide-react';

/**
 * AssignmentStats Component.
 * Displays aggregate counts for assignments.
 * @param {Object} props
 * @param {AssignmentModel[]} props.assignments - Raw list of assignments.
 */
export const AssignmentStats = ({ assignments }) => {
  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter((a) => a.status === 'Assigned' || a.status === 'Overdue').length;
    const returned = assignments.filter((a) => a.status === 'Returned').length;
    const overdue = assignments.filter((a) => a.status === 'Overdue').length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = assignments.filter((a) => a.assignedDate === todayStr).length;

    return { total, active, returned, overdue, todayCount };
  }, [assignments]);

  const cards = [
    { title: 'Total Assignments', value: stats.total, icon: ClipboardList, accent: 'primary' },
    { title: 'Active Assignments', value: stats.active, icon: CheckCircle, accent: 'warning' },
    { title: 'Returned', value: stats.returned, icon: Undo2, accent: 'success' },
    { title: 'Overdue', value: stats.overdue, icon: AlertCircle, accent: 'danger' },
    { title: "Today's Assignments", value: stats.todayCount, icon: CalendarDays, accent: 'primary' },
  ];

  return (
    <div className="stats-grid" style={{ marginBottom: '2rem' }}>
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
