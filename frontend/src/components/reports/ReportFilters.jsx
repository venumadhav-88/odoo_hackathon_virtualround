import React, { useMemo } from 'react';

/**
 * ReportFilters Component.
 * Form controls coordinating filter states across categories, custody departments, and dates.
 * @param {Object} props
 */
export const ReportFilters = ({
  dateRange,
  onDateRangeChange,
  categoryFilter,
  onCategoryChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  maintTypeFilter,
  onMaintTypeChange,
  allAssets = [],
  allAssignments = [],
}) => {
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(allAssets.map((a) => a.category).filter(Boolean))].sort();
    return unique;
  }, [allAssets]);

  const departmentOptions = useMemo(() => {
    const unique = [...new Set(allAssignments.map((a) => a.department).filter(Boolean))].sort();
    return unique;
  }, [allAssignments]);

  const handleStartChange = (val) => {
    onDateRangeChange({ ...dateRange, start: val });
  };

  const handleEndChange = (val) => {
    onDateRangeChange({ ...dateRange, end: val });
  };

  return (
    <div className="filters-toolbar" style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <div className="filters-toolbar-left" style={{ flexWrap: 'wrap', gap: '0.75rem', width: '100%', maxWidth: '100%' }}>
        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by department"
        >
          <option value="all">All Departments</option>
          {departmentOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by asset status"
        >
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Retired">Retired</option>
        </select>

        {/* Maintenance Type */}
        <select
          value={maintTypeFilter}
          onChange={(e) => onMaintTypeChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by maintenance type"
        >
          <option value="all">All Maint Types</option>
          <option value="Preventive">Preventive</option>
          <option value="Corrective">Corrective</option>
          <option value="Inspection">Inspection</option>
          <option value="Calibration">Calibration</option>
          <option value="Emergency">Emergency</option>
        </select>

        {/* Date Range Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Range:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="filters-select"
            aria-label="Start date"
            style={{ paddingRight: '1rem', backgroundImage: 'none' }}
          />
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleEndChange(e.target.value)}
            className="filters-select"
            aria-label="End date"
            style={{ paddingRight: '1rem', backgroundImage: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};
