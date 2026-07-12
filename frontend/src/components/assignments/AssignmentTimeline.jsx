import React from 'react';
import { formatDate } from '@/utils/formatters';
import { ClipboardList, Undo2, XCircle, AlertCircle, Clock } from 'lucide-react';

/**
 * AssignmentTimeline Component.
 * Visualizes the chronological lifecycle steps of an asset assignment.
 * @param {Object} props
 */
export const AssignmentTimeline = ({ assignment }) => {
  if (!assignment) return null;

  const events = [];

  // Step 1: Assigned
  events.push({
    key: 'assigned',
    title: 'Asset Custody Assigned',
    date: assignment.assignedDate,
    icon: ClipboardList,
    color: 'var(--color-primary)',
    content: `Asset assigned to ${assignment.employeeName} (${assignment.department}) by ${assignment.assignedBy || 'Alex Carter'}.`,
    remarks: assignment.remarks?.split(' | Return')[0] || assignment.remarks,
  });

  // Step 2: Overdue Status (if applicable)
  if (assignment.status === 'Overdue') {
    events.push({
      key: 'overdue',
      title: 'Return Overdue Alert',
      date: assignment.expectedReturnDate,
      icon: AlertCircle,
      color: 'var(--color-danger)',
      content: `The expected return date (${formatDate(assignment.expectedReturnDate)}) has passed without a return clearance.`,
    });
  }

  // Step 3: Termination (Returned or Cancelled)
  if (assignment.status === 'Returned') {
    const returnRemarksMatch = assignment.remarks?.match(/Return remarks: (.*)$/);
    const returnRemarks = returnRemarksMatch ? returnRemarksMatch[1] : '';

    events.push({
      key: 'returned',
      title: 'Asset Returned & Cleared',
      date: assignment.actualReturnDate,
      icon: Undo2,
      color: 'var(--color-success)',
      content: `Returned condition logged as "${assignment.returnCondition || 'Good'}". Released from employee custody.`,
      remarks: returnRemarks,
    });
  } else if (assignment.status === 'Cancelled') {
    events.push({
      key: 'cancelled',
      title: 'Assignment Cancelled',
      date: assignment.actualReturnDate || new Date().toISOString().split('T')[0],
      icon: XCircle,
      color: 'var(--color-text-muted)',
      content: 'The custody request or assignment was formally cancelled and released.',
    });
  } else if (assignment.status === 'Assigned') {
    // Current ongoing status
    events.push({
      key: 'ongoing',
      title: 'In Custody (Active)',
      date: assignment.expectedReturnDate,
      icon: Clock,
      color: 'var(--color-warning)',
      content: `Currently in custody. Expected return scheduled on ${formatDate(assignment.expectedReturnDate)}.`,
    });
  }

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
        Custody Activity Timeline
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
