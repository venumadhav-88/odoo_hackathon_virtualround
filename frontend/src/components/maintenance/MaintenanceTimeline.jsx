import React from 'react';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Calendar, Play, CheckCircle, XCircle } from 'lucide-react';

/**
 * MaintenanceTimeline Component.
 * Visualizes the vertical chronological flow of maintenance jobs.
 * @param {Object} props
 */
export const MaintenanceTimeline = ({ maintenanceLog }) => {
  if (!maintenanceLog) return null;

  const events = [];

  // Step 1: Scheduled
  events.push({
    key: 'scheduled',
    title: 'Maintenance Scheduled',
    date: maintenanceLog.scheduledDate,
    icon: Calendar,
    color: 'var(--color-primary)',
    content: `${maintenanceLog.maintenanceType} maintenance scheduled with "${maintenanceLog.priority}" priority. Technician: ${
      maintenanceLog.technician || 'unassigned'
    } (${maintenanceLog.vendor || 'unassigned'}).`,
    remarks: maintenanceLog.remarks?.split(' | Completion')[0] || maintenanceLog.remarks,
  });

  // Step 2: Started
  if (maintenanceLog.startDate || maintenanceLog.status === 'In Progress' || maintenanceLog.status === 'Completed') {
    events.push({
      key: 'started',
      title: 'Maintenance Started',
      date: maintenanceLog.startDate || maintenanceLog.scheduledDate, // Fallback if start date is missing
      icon: Play,
      color: 'var(--color-warning)',
      content: `Work commenced on-site. Diagnostic procedures initiated.`,
    });
  }

  // Step 3: Completed or Cancelled
  if (maintenanceLog.status === 'Completed') {
    const completionRemarksMatch = maintenanceLog.remarks?.match(/Completion remarks: (.*)$/);
    const completionRemarks = completionRemarksMatch ? completionRemarksMatch[1] : '';

    events.push({
      key: 'completed',
      title: 'Maintenance Completed',
      date: maintenanceLog.completionDate,
      icon: CheckCircle,
      color: 'var(--color-success)',
      content: `Outcome Result recorded as "${maintenanceLog.result}". Realized repair expenditure cost is ${formatCurrency(
        maintenanceLog.actualCost
      )}.`,
      remarks: completionRemarks,
    });
  } else if (maintenanceLog.status === 'Cancelled') {
    const cancelDate = maintenanceLog.updatedAt ? maintenanceLog.updatedAt.split('T')[0] : maintenanceLog.scheduledDate;
    events.push({
      key: 'cancelled',
      title: 'Maintenance Cancelled',
      date: cancelDate,
      icon: XCircle,
      color: 'var(--color-text-muted)',
      content: `Scheduled maintenance was cancelled. Associated asset released back to available inventory.`,
    });
  }

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
        Maintenance Job Progress Timeline
      </h4>
      <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px dashed var(--color-border)' }}>
        {events.map((ev, index) => {
          const Icon = ev.icon;
          return (
            <div key={ev.key} style={{ position: 'relative', marginBottom: index === events.length - 1 ? 0 : '1.5rem' }}>
              {/* Bullet circle */}
              <div
                style={{
                  position: 'absolute',
                  left: '-35px',
                  top: '0px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  border: `2px solid ${ev.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ev.color,
                  zIndex: 2,
                }}
              >
                <Icon size={12} />
              </div>

              {/* Event Content */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{ev.title}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {formatDate(ev.date)}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.375rem', lineHeight: '1.4' }}>
                  {ev.content}
                </p>
                {ev.remarks && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-surface-hover)',
                      borderLeft: `2px solid ${ev.color}`,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      marginTop: '0.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    "{ev.remarks}"
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
