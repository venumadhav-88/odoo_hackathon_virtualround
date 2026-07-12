import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook to filter and sort lists of asset assignments based on user inputs.
 * @param {AssignmentModel[]} assignments - Full assignments dataset.
 * @returns {Object} Filter controllers and the filtered assignments list.
 */
export const useAssignmentFilters = (assignments) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredAndSorted = useMemo(() => {
    let result = [...assignments];

    // Search query matching employee, asset code, asset name, or remarks
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(q) ||
          a.assetCode.toLowerCase().includes(q) ||
          a.assetName.toLowerCase().includes(q) ||
          (a.department && a.department.toLowerCase().includes(q)) ||
          (a.remarks && a.remarks.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Employee filter
    if (employeeFilter !== 'all') {
      result = result.filter((a) => a.employeeName === employeeFilter);
    }

    // Asset filter
    if (assetFilter !== 'all') {
      result = result.filter((a) => a.assetCode === assetFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter(
        (a) => a.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    // Assigned Date filter
    if (dateFilter) {
      result = result.filter((a) => a.assignedDate === dateFilter);
    }

    // Sort configurations
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.assignedDate) - new Date(a.assignedDate);
        case 'oldest':
          return new Date(a.assignedDate) - new Date(b.assignedDate);
        case 'expected_return':
          return new Date(a.expectedReturnDate) - new Date(b.expectedReturnDate);
        default:
          return new Date(b.assignedDate) - new Date(a.assignedDate);
      }
    });

    return result;
  }, [
    assignments,
    debouncedSearch,
    statusFilter,
    employeeFilter,
    assetFilter,
    departmentFilter,
    dateFilter,
    sortBy,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    employeeFilter,
    setEmployeeFilter,
    assetFilter,
    setAssetFilter,
    departmentFilter,
    setDepartmentFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    filteredAssignments: filteredAndSorted,
  };
};
