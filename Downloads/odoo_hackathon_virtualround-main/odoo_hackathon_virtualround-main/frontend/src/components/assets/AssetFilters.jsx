import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { ASSET_STATUS } from '@/constants/assetStatus';

/**
 * AssetFilters Component.
 * Search input, status dropdown, category dropdown, and sort selector.
 * @param {Object} props
 * @param {string} props.searchTerm
 * @param {Function} props.onSearchChange
 * @param {string} props.statusFilter
 * @param {Function} props.onStatusChange
 * @param {string} props.categoryFilter
 * @param {Function} props.onCategoryChange
 * @param {string} props.sortBy
 * @param {Function} props.onSortChange
 * @param {AssetModel[]} props.allAssets - Full list used to derive category options.
 */
export const AssetFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  allAssets,
}) => {
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(allAssets.map((a) => a.category).filter(Boolean))].sort();
    return unique;
  }, [allAssets]);

  return (
    <div className="filters-toolbar">
      <div className="filters-toolbar-left">
        {/* Search */}
        <div className="filters-search-wrapper">
          <Search className="filters-search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by code, name, serial, category…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters-search-input"
            aria-label="Search assets"
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
          <option value={ASSET_STATUS.AVAILABLE}>Available</option>
          <option value={ASSET_STATUS.ASSIGNED}>Assigned</option>
          <option value={ASSET_STATUS.UNDER_MAINTENANCE}>Maintenance</option>
          <option value={ASSET_STATUS.RETIRED}>Retired</option>
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
      </div>

      <div className="filters-toolbar-right">
        <div className="filters-sort-wrapper">
          <span className="filters-sort-label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filters-select"
            aria-label="Sort assets"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name_asc">Asset Name</option>
          </select>
        </div>
      </div>
    </div>
  );
};
