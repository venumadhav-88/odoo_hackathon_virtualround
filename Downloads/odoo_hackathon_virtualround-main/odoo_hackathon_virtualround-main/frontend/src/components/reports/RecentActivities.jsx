import React, { useMemo } from 'react';
import { Package, ClipboardList, Undo2, Calendar, Play, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

/**
 * RecentActivities Component.
 * Aggregates and displays a chronological log list of assets, check-outs, and repairs.
 * @param {Object} props
 */
export const RecentActivities = ({ assets = [], assignments = [], maintenance = [] }) => {
  const activities = useMemo(() => {
    const list = [];

    // Assets
    assets.forEach((a) => {
      list.push({
        date: a.createdAt || '2026-07-01',
        type: 'Asset Registration',
        message: `New asset "${a.assetName}" (${a.assetCode}) was registered in the database.`,
        icon: Package,
        color: 'var(--color-primary)',
      });
    });

    // Assignments
    assignments.forEach((asg) => {
      list.push({
        date: asg.assignedDate,
        type: 'Asset Assigned',
        message: `Asset "${asg.assetName}" (${asg.assetCode}) was assigned to custodian ${asg.employeeName} (${asg.department}).`,
        icon: ClipboardList,
        color: 'var(--color-warning)',
      });
      if (asg.status === 'Returned' && asg.actualReturnDate) {
        list.push({
          date: asg.actualReturnDate,
          type: 'Asset Returned',
          message: `Asset "${asg.assetName}" (${asg.assetCode}) was returned by ${asg.employeeName} (Condition: ${asg.returnCondition}).`,
          icon: Undo2,
          color: 'var(--color-success)',
        });
      } else if (asg.status === 'Cancelled') {
        const cancelDate = asg.actualReturnDate || asg.assignedDate;
        list.push({
          date: cancelDate,
          type: 'Assignment Cancelled',
          message: `Assignment request for "${asg.assetName}" to ${asg.employeeName} was cancelled.`,
          icon: XCircle,
          color: 'var(--color-text-muted)',
        });
      }
    });

    // Maintenance
    maintenance.forEach((m) => {
      list.push({
        date: m.scheduledDate,
        type: 'Maintenance Scheduled',
        message: `Maintenance scheduled for "${m.assetName}" (${m.assetCode}) on ${m.scheduledDate}. Type: ${m.maintenanceType}.`,
        icon: Calendar,
        color: 'var(--color-primary)',
      });
      if (m.startDate) {
        list.push({
          date: m.startDate,
          type: 'Maintenance Started',
          message: `Maintenance started on "${m.assetName}" (${m.assetCode}) by vendor "${m.vendor}".`,
          icon: Play,
          color: 'var(--color-warning)',
        });
      }
      if (m.status === 'Completed' && m.completionDate) {
        list.push({
          date: m.completionDate,
          type: 'Maintenance Completed',
          message: `Maintenance completed for "${m.assetName}" (${m.assetCode}) - Result: ${m.result}.`,
          icon: CheckCircle,
          color: 'var(--color-success)',
        });
      } else if (m.status === 'Cancelled') {
        const cancelDate = m.updatedAt ? m.updatedAt.split('T')[0] : m.scheduledDate;
        list.push({
          date: cancelDate,
          type: 'Maintenance Cancelled',
          message: `Maintenance job for "${m.assetName}" (${m.assetCode}) was cancelled.`,
          icon: XCircle,
          color: 'var(--color-text-muted)',
        });
      }
    });

    // Sort newest first
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list.slice(0, 10); // Top 10 entries
  }, [assets, assignments, maintenance]);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginTop: '2rem',
      }}
    >
      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
        Consolidated Activity Log (Filtered Results)
      </h4>
      {activities.length === 0 ? (
        <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          No recent activity matches the active reporting filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activities.map((act, index) => {
            const Icon = act.icon;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  paddingBottom: index === activities.length - 1 ? 0 : '1.25rem',
                  borderBottom: index === activities.length - 1 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-hover)',
                    color: act.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{act.type}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {formatDate(act.date)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {act.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
