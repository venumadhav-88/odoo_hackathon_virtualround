import React from 'react';
import { Search } from 'lucide-react';

/**
 * CategoryFilters Component.
 * Search bar, status filters, and sorting option dropdowns.
 * @param {Object} props - Properties.
 * @param {string} props.searchTerm - Active query text search value.
 * @param {Function} props.onSearchChange - Triggers on search text modification.
 * @param {string} props.statusFilter - Active status filter keyword.
 * @param {Function} props.onStatusChange - Triggers on status selection changes.
 * @param {string} props.sortBy - Active sort method key.
 * @param {Function} props.onSortChange - Triggers on sorting selection changes.
 * @returns {JSX.Element} Filters toolbar container.
 */
export const CategoryFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="filters-toolbar">
      <div className="filters-toolbar-left">
        <div className="filters-search-wrapper">
          <Search className="filters-search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by name, code or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters-search-input"
            aria-label="Search Categories"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by Status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="filters-toolbar-right">
        <div className="filters-sort-wrapper">
          <span className="filters-sort-label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filters-select"
            aria-label="Sort Categories"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_assets">Most Assets</option>
            <option value="least_assets">Least Assets</option>
          </select>
        </div>
      </div>
    </div>
  );
};
