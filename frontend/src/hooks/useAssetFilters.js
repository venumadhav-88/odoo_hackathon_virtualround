import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Manages search, status filter, category filter, and sort state for the asset list.
 * @param {AssetModel[]} assets - Full unfiltered asset list.
 * @returns {Object} Filter state and the derived filtered list.
 */
export const useAssetFilters = (assets) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Text search across code, name, serial, category, assignedTo
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.assetCode.toLowerCase().includes(q) ||
          a.assetName.toLowerCase().includes(q) ||
          (a.serialNumber && a.serialNumber.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q)) ||
          (a.assignedTo && a.assignedTo.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(
        (a) => a.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name_asc':
          return a.assetName.localeCompare(b.assetName);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [assets, debouncedSearch, statusFilter, categoryFilter, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    filteredAssets,
  };
};
