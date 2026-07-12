import React, { useMemo } from 'react';
import { Search } from 'lucide-react';

/**
 * AssignmentFilters Component.
 * Search bar, dropdown selectors, and sorting widgets for asset assignments.
 * @param {Object} props
 */
export const AssignmentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  employeeFilter,
  onEmployeeChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
  allAssignments,
}) => {
  const departmentOptions = useMemo(() => {
    const unique = [...new Set(allAssignments.map((a) => a.department).filter(Boolean))].sort();
    return unique;
  }, [allAssignments]);

  const employeeOptions = useMemo(() => {
    const unique = [...new Set(allAssignments.map((a) => a.employeeName).filter(Boolean))].sort();
    return unique;
  }, [allAssignments]);

  return (
    <div className="filters-toolbar" style={{ gap: '1rem', flexWrap: 'wrap' }}>
      <div className="filters-toolbar-left" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Search */}
        <div className="filters-search-wrapper" style={{ minWidth: '200px' }}>
          <Search className="filters-search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search custodian, code, remarks…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters-search-input"
            aria-label="Search assignments"
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
          <option value="Assigned">Assigned</option>
          <option value="Returned">Returned</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Custodian */}
        <select
          value={employeeFilter}
          onChange={(e) => onEmployeeChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by custodian"
        >
          <option value="all">All Employees</option>
          {employeeOptions.map((emp) => (
            <option key={emp} value={emp}>{emp}</option>
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
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Assigned Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="filters-select"
            aria-label="Filter by assigned date"
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
            aria-label="Sort assignments"
          >
            <option value="newest">Newest Assigned</option>
            <option value="oldest">Oldest Assigned</option>
            <option value="expected_return">Expected Return</option>
          </select>
        </div>
      </div>
    </div>
  );
};
