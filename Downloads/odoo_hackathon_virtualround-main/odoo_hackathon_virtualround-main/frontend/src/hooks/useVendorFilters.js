import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

export const useVendorFilters = (vendors) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorTypeFilter, setVendorTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (vendor) =>
          vendor.vendorCode.toLowerCase().includes(query) ||
          vendor.companyName.toLowerCase().includes(query) ||
          vendor.contactPerson.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query) ||
          vendor.phone.toLowerCase().includes(query) ||
          vendor.gstNumber.toLowerCase().includes(query)
      );
    }

    if (vendorTypeFilter !== 'all') {
      result = result.filter((vendor) => vendor.vendorType === vendorTypeFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((vendor) => vendor.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      result = result.filter((vendor) => vendor.city === cityFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'company_name':
          return a.companyName.localeCompare(b.companyName);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [vendors, debouncedSearch, vendorTypeFilter, statusFilter, cityFilter, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    vendorTypeFilter,
    setVendorTypeFilter,
    statusFilter,
    setStatusFilter,
    cityFilter,
    setCityFilter,
    sortBy,
    setSortBy,
    filteredVendors,
  };
};