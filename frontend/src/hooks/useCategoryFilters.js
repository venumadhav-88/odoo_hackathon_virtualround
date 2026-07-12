import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook to filter and sort lists of categories based on user inputs.
 * @param {Array} categories - Raw domain categories dataset.
 * @returns {Object} Search/filter controllers and the filtered category list.
 */
export const useCategoryFilters = (categories) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by text search (name, code, description)
    if (debouncedSearchTerm.trim()) {
      const query = debouncedSearchTerm.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      );
    }

    // Filter by active/inactive status
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Sort categories
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most_assets':
          return b.assetCount - a.assetCount;
        case 'least_assets':
          return a.assetCount - b.assetCount;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [categories, debouncedSearchTerm, statusFilter, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredCategories: filteredAndSortedCategories,
  };
};
