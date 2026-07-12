import React, { useMemo } from 'react';
import { Search } from 'lucide-react';

/**
 * MaintenanceFilters Component.
 * Search toolbar filtering maintenance logs.
 * @param {Object} props
 */
export const MaintenanceFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  vendorFilter,
  onVendorChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
  allMaintenanceLogs,
}) => {
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(allMaintenanceLogs.map((m) => m.category).filter(Boolean))].sort();
    return unique;
  }, [allMaintenanceLogs]);

  const vendorOptions = useMemo(() => {
    const unique = [...new Set(allMaintenanceLogs.map((m) => m.vendor).filter(Boolean))].sort();
    return unique;
  }, [allMaintenanceLogs]);

  return (
    <div className="filters-toolbar" style={{ gap: '1rem', flexWrap: 'wrap' }}>
      <div className="filters-toolbar-left" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Search */}
        <div className="filters-search-wrapper" style={{ minWidth: '220px' }}>
          <Search className="filters-search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search code, tech, vendor…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters-search-input"
            aria-label="Search maintenance"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Overdue">Overdue</option>
        </select>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by maintenance type"
        >
          <option value="all">All Types</option>
          <option value="Preventive">Preventive</option>
          <option value="Corrective">Corrective</option>
          <option value="Inspection">Inspection</option>
          <option value="Calibration">Calibration</option>
          <option value="Emergency">Emergency</option>
        </select>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        {/* Vendor */}
        <select
          value={vendorFilter}
          onChange={(e) => onVendorChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by vendor"
        >
          <option value="all">All Vendors</option>
          {vendorOptions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Sched Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="filters-select"
            aria-label="Filter by scheduled date"
            style={{ paddingRight: '1rem', backgroundImage: 'none' }}
          />
        </div>
      </div>

      <div className="filters-toolbar-right">
        <div className="filters-sort-wrapper">
          <span className="filters-sort-label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filters-select"
            aria-label="Sort maintenance"
          >
            <option value="newest">Newest Logged</option>
            <option value="oldest">Oldest Logged</option>
            <option value="scheduled_asc">Scheduled Date</option>
            <option value="cost_desc">Cost (High to Low)</option>
            <option value="cost_asc">Cost (Low to High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
