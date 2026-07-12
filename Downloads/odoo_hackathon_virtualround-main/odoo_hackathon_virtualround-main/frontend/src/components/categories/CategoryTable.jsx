import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components/common';
import { formatDate } from '@/utils/formatters';

/**
 * CategoryTable Component.
 * Maps dynamic Category fields onto the reusable DataTable.
 * @param {Object} props - Properties.
 * @param {Array} props.categories - Active list of EAM CategoryModels.
 * @param {boolean} props.isLoading - Loader active trigger flag.
 * @param {Function} props.onView - Triggers viewing single record.
 * @param {Function} props.onEdit - Triggers editing form.
 * @param {Function} props.onDelete - Triggers delete confirmation modal.
 * @returns {JSX.Element} DataTable container.
 */
export const CategoryTable = ({
  categories,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'code',
      header: 'Code',
      width: '120px',
      render: (value) => <strong>{value}</strong>,
    },
    {
      key: 'name',
      header: 'Category Name',
      width: '250px',
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <span className="text-truncate-2" title={value}>
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'assetCount',
      header: 'Asset Count',
      width: '130px',
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      width: '160px',
      render: (value) => formatDate(value),
    },
  ];

  const rowActions = (row) => (
    <div className="table-row-actions">
      <button
        onClick={() => onView(row)}
        className="action-icon-btn"
        aria-label={`View ${row.name}`}
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onEdit(row)}
        className="action-icon-btn"
        aria-label={`Edit ${row.name}`}
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => onDelete(row)}
        className="action-icon-btn delete"
        aria-label={`Delete ${row.name}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={categories}
      isLoading={isLoading}
      emptyMessage="No categories match the active filter criteria."
      rowActions={rowActions}
    />
  );
};
