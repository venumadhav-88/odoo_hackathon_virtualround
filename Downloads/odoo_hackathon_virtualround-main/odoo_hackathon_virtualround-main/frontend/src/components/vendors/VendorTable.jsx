import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components/common';

export const VendorTable = ({ vendors, isLoading, onView, onEdit, onDelete }) => {
  const columns = [
    {
      key: 'vendorCode',
      header: 'Vendor Code',
      width: '140px',
      render: (value) => <strong>{value}</strong>,
    },
    {
      key: 'companyName',
      header: 'Company',
      width: '220px',
      render: (value) => value || '-',
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      width: '180px',
    },
    {
      key: 'phone',
      header: 'Phone',
      width: '160px',
    },
    {
      key: 'email',
      header: 'Email',
      width: '220px',
      render: (value) => value || '-',
    },
    {
      key: 'vendorType',
      header: 'Vendor Type',
      width: '170px',
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (value) => <StatusBadge status={value} label={value ? value.charAt(0).toUpperCase() + value.slice(1) : ''} />,
    },
    {
      key: 'rating',
      header: 'Rating',
      width: '110px',
      render: (value) => `${Number(value || 0).toFixed(1)} / 5`,
    },
  ];

  const rowActions = (row) => (
    <div className="table-row-actions">
      <button className="action-icon-btn" onClick={() => onView(row)} aria-label={`View ${row.companyName}`}>
        <Eye size={16} />
      </button>
      <button className="action-icon-btn" onClick={() => onEdit(row)} aria-label={`Edit ${row.companyName}`}>
        <Pencil size={16} />
      </button>
      <button className="action-icon-btn delete" onClick={() => onDelete(row)} aria-label={`Delete ${row.companyName}`}>
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={vendors}
      isLoading={isLoading}
      emptyMessage="No vendors match the active filters."
      rowActions={rowActions}
    />
  );
};