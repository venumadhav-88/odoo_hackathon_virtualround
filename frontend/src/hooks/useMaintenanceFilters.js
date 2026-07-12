import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook to filter and sort lists of asset maintenance records based on user inputs.
 * @param {MaintenanceModel[]} maintenanceLogs - Full list of maintenance records.
 * @returns {Object} Search/filter handlers and the filtered list.
 */
export const useMaintenanceFilters = (maintenanceLogs) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredAndSorted = useMemo(() => {
    let result = [...maintenanceLogs];

    // Search query matching asset code, name, tech, vendor, or remarks
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.assetCode.toLowerCase().includes(q) ||
          m.assetName.toLowerCase().includes(q) ||
          (m.technician && m.technician.toLowerCase().includes(q)) ||
          (m.vendor && m.vendor.toLowerCase().includes(q)) ||
          (m.remarks && m.remarks.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(
        (m) => m.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(
        (m) => m.maintenanceType.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(
        (m) => m.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (m) => m.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Vendor filter
    if (vendorFilter !== 'all') {
      result = result.filter(
        (m) => m.vendor?.toLowerCase() === vendorFilter.toLowerCase()
      );
    }

    // Date filter (Scheduled Date match)
    if (dateFilter) {
      result = result.filter((m) => m.scheduledDate === dateFilter);
    }

    // Sort configurations
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'scheduled_asc':
          return new Date(a.scheduledDate) - new Date(b.scheduledDate);
        case 'cost_desc': {
          const costB = b.actualCost !== null && b.actualCost !== undefined ? b.actualCost : b.estimatedCost;
          const costA = a.actualCost !== null && a.actualCost !== undefined ? a.actualCost : a.estimatedCost;
          return costB - costA;
        }
        case 'cost_asc': {
          const costB = b.actualCost !== null && b.actualCost !== undefined ? b.actualCost : b.estimatedCost;
          const costA = a.actualCost !== null && a.actualCost !== undefined ? a.actualCost : a.estimatedCost;
          return costA - costB;
        }
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [
    maintenanceLogs,
    debouncedSearch,
    categoryFilter,
    typeFilter,
    priorityFilter,
    statusFilter,
    vendorFilter,
    dateFilter,
    sortBy,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    filteredMaintenance: filteredAndSorted,
  };
};
