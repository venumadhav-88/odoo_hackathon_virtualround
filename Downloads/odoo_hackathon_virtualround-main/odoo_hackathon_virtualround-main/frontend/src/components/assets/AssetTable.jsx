import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components/common';
import { formatDate } from '@/utils/formatters';

/**
 * AssetTable Component.
 * Maps AssetModel fields to the reusable DataTable with view/edit/delete row actions.
 * @param {Object} props
 * @param {AssetModel[]} props.assets
 * @param {boolean} props.isLoading
 * @param {Function} props.onView
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 */
export const AssetTable = ({ assets, isLoading, onView, onEdit, onDelete }) => {
  const columns = [
    {
      key: 'assetCode',
      header: 'Asset Code',
      width: '140px',
      render: (value) => <strong>{value}</strong>,
    },
    {
      key: 'assetName',
      header: 'Asset Name',
      width: '220px',
    },
    {
      key: 'category',
      header: 'Category',
      width: '180px',
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      width: '180px',
      render: (value) => value || <span style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'location',
      header: 'Location',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'purchaseDate',
      header: 'Purchase Date',
      width: '140px',
      render: (value) => formatDate(value),
    },
  ];

  const rowActions = (row) => (
    <div className="table-row-actions">
      <button
        className="action-icon-btn"
        onClick={() => onView(row)}
        aria-label={`View ${row.assetName}`}
      >
        <Eye size={16} />
      </button>
      <button
        className="action-icon-btn"
        onClick={() => onEdit(row)}
        aria-label={`Edit ${row.assetName}`}
      >
        <Pencil size={16} />
      </button>
      <button
        className="action-icon-btn delete"
        onClick={() => onDelete(row)}
        aria-label={`Delete ${row.assetName}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={assets}
      isLoading={isLoading}
      emptyMessage="No assets match the active filters."
      rowActions={rowActions}
    />
  );
};
