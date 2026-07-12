import React from 'react';
import { Eye, Play, CheckSquare, XCircle } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components/common';
import { formatDate, formatCurrency } from '@/utils/formatters';

/**
 * MaintenanceTable Component.
 * Maps MaintenanceModel rows to DataTable with active lifecycle actions.
 * @param {Object} props
 */
export const MaintenanceTable = ({
  maintenanceLogs,
  isLoading,
  onView,
  onStart,
  onComplete,
  onCancel,
}) => {
  const columns = [
    {
      key: 'assetName',
      header: 'Asset',
      width: '240px',
      render: (value, row) => (
        <div>
          <strong style={{ display: 'block' }}>{value}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {row.assetCode}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '160px',
    },
    {
      key: 'maintenanceType',
      header: 'Type',
      width: '140px',
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '120px',
      render: (value) => {
        let color = 'var(--color-text-main)';
        if (value === 'Critical') color = 'var(--color-danger)';
        else if (value === 'High') color = 'var(--color-warning)';
        return <span style={{ fontWeight: 600, color }}>{value}</span>;
      },
    },
    {
      key: 'vendor',
      header: 'Vendor',
      width: '160px',
      render: (value) => value || '-',
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      width: '140px',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'estimatedCost',
      header: 'Cost (Est / Act)',
      width: '150px',
      render: (value, row) => {
        if (row.status === 'Completed') {
          return (
            <div>
              <strong style={{ color: 'var(--color-success)', display: 'block' }}>
                {formatCurrency(row.actualCost)}
              </strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Est: {formatCurrency(row.estimatedCost)}
              </span>
            </div>
          );
        }
        return <span style={{ fontStyle: 'italic' }}>{formatCurrency(row.estimatedCost)} (Est)</span>;
      },
    },
  ];

  const rowActions = (row) => {
    const isScheduled = row.status === 'Scheduled' || row.status === 'Overdue';
    const isInProgress = row.status === 'In Progress';
    const canCancel = row.status === 'Scheduled' || row.status === 'In Progress' || row.status === 'Overdue';

    return (
      <div className="table-row-actions">
        <button
          className="action-icon-btn"
          onClick={() => onView(row)}
          aria-label={`View maintenance details for ${row.assetName}`}
          title="View Details"
        >
          <Eye size={16} />
        </button>

        {isScheduled && (
          <button
            className="action-icon-btn"
            onClick={() => onStart(row)}
            aria-label={`Start maintenance for ${row.assetName}`}
            title="Start Maintenance"
            style={{ color: 'var(--color-primary)' }}
          >
            <Play size={16} />
          </button>
        )}

        {isInProgress && (
          <button
            className="action-icon-btn"
            onClick={() => onComplete(row)}
            aria-label={`Complete maintenance for ${row.assetName}`}
            title="Complete Maintenance"
            style={{ color: 'var(--color-success)' }}
          >
            <CheckSquare size={16} />
          </button>
        )}

        {canCancel && (
          <button
            className="action-icon-btn delete"
            onClick={() => onCancel(row)}
            aria-label={`Cancel maintenance for ${row.assetName}`}
            title="Cancel Maintenance"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      rows={maintenanceLogs}
      isLoading={isLoading}
      emptyMessage="No asset maintenance records match the active filters."
      rowActions={rowActions}
      keyExtractor={(row) => row.maintenanceId}
    />
  );
};
