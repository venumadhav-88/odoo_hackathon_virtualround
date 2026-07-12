import React from 'react';
import { Eye, Undo2, XCircle } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components/common';
import { formatDate } from '@/utils/formatters';

/**
 * AssignmentTable Component.
 * Displays list of assignments using the reusable DataTable component.
 * @param {Object} props
 */
export const AssignmentTable = ({
  assignments,
  isLoading,
  onView,
  onReturn,
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
      key: 'employeeName',
      header: 'Employee',
      width: '180px',
    },
    {
      key: 'department',
      header: 'Department',
      width: '160px',
    },
    {
      key: 'assignedDate',
      header: 'Assigned Date',
      width: '140px',
      render: (value) => formatDate(value),
    },
    {
      key: 'expectedReturnDate',
      header: 'Expected Return',
      width: '140px',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const rowActions = (row) => {
    const isActive = row.status === 'Assigned' || row.status === 'Overdue';

    return (
      <div className="table-row-actions">
        <button
          className="action-icon-btn"
          onClick={() => onView(row)}
          aria-label={`View assignment details for ${row.assetName}`}
          title="View Details"
        >
          <Eye size={16} />
        </button>
        
        {isActive && (
          <>
            <button
              className="action-icon-btn"
              onClick={() => onReturn(row)}
              aria-label={`Process return for ${row.assetName}`}
              title="Return Asset"
              style={{ color: 'var(--color-success)' }}
            >
              <Undo2 size={16} />
            </button>
            <button
              className="action-icon-btn delete"
              onClick={() => onCancel(row)}
              aria-label={`Cancel assignment for ${row.assetName}`}
              title="Cancel Assignment"
            >
              <XCircle size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      rows={assignments}
      isLoading={isLoading}
      emptyMessage="No asset assignments match the active filters."
      rowActions={rowActions}
      keyExtractor={(row) => row.assignmentId}
    />
  );
};
