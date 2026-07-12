import React, { useMemo } from 'react';
import { Search } from 'lucide-react';

const VENDOR_TYPE_OPTIONS = [
  'Manufacturer',
  'Supplier',
  'Distributor',
  'Service Provider',
  'Repair Partner',
  'Rental Vendor',
  'Other',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blocked', label: 'Blocked' },
];

export const VendorFilters = ({
  searchTerm,
  onSearchChange,
  vendorTypeFilter,
  onVendorTypeChange,
  statusFilter,
  onStatusChange,
  cityFilter,
  onCityChange,
  sortBy,
  onSortChange,
  allVendors,
}) => {
  const cityOptions = useMemo(() => {
    return [...new Set(allVendors.map((vendor) => vendor.city).filter(Boolean))].sort();
  }, [allVendors]);

  return (
    <div className="filters-toolbar">
      <div className="filters-toolbar-left">
        <div className="filters-search-wrapper">
          <Search className="filters-search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search code, company, contact, email, phone, GST..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters-search-input"
            aria-label="Search vendors"
          />
        </div>

        <select
          value={vendorTypeFilter}
          onChange={(e) => onVendorTypeChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by vendor type"
        >
          <option value="all">All Vendor Types</option>
          {VENDOR_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by vendor status"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => onCityChange(e.target.value)}
          className="filters-select"
          aria-label="Filter by city"
        >
          <option value="all">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
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
            aria-label="Sort vendors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="company_name">Company Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};