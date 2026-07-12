import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePageTitle, useVendorFilters } from '@/hooks';
import { VendorService } from '@/services';
import { PageContainer, PageHeader, ActionButton, ErrorState } from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';
import { VendorStats, VendorFilters, VendorTable, VendorModal, DeleteVendorDialog } from '@/components/vendors';

const Vendors = () => {
  usePageTitle('Vendor Management');

  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await VendorService.getVendors();
      setVendors(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const {
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
  } = useVendorFilters(vendors);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedVendor(null);
    setIsModalOpen(true);
  };

  const openViewModal = (vendor) => {
    setModalMode('view');
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setModalMode('edit');
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (vendor) => {
    setVendorToDelete(vendor);
    setIsDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setIsActionLoading(true);
    try {
      if (modalMode === 'create') {
        const created = await VendorService.createVendor(formData);
        setVendors((prev) => [created, ...prev]);
      } else if (modalMode === 'edit') {
        const updated = await VendorService.updateVendor(selectedVendor.id, formData);
        setVendors((prev) => prev.map((vendor) => (vendor.id === selectedVendor.id ? updated : vendor)));
      }
      setIsModalOpen(false);
    } catch {
      // Notifications handled in the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!vendorToDelete) return;
    setIsActionLoading(true);
    try {
      await VendorService.deleteVendor(vendorToDelete.id);
      setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorToDelete.id));
      setIsDeleteOpen(false);
      setVendorToDelete(null);
    } catch {
      // Notifications handled in the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Vendor Management" subtitle="Manage approved third-party vendors and service partners" />
        <PageLoader message="Loading vendor records…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Vendor Management" subtitle="Manage approved third-party vendors and service partners" />
        <ErrorState
          title="Failed to Load Vendors"
          description="We encountered an issue loading vendor records."
          onRetry={fetchVendors}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Vendor Management"
        subtitle="Manage approved third-party vendors and service partners"
        actions={
          <ActionButton onClick={openCreateModal} icon={Plus} variant="primary">
            Add Vendor
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      <VendorStats vendors={vendors} />

      <VendorFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        vendorTypeFilter={vendorTypeFilter}
        onVendorTypeChange={setVendorTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        cityFilter={cityFilter}
        onCityChange={setCityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        allVendors={vendors}
      />

      <VendorTable
        vendors={filteredVendors}
        isLoading={false}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vendor={selectedVendor}
        mode={modalMode}
        onSubmit={handleModalSubmit}
      />

      <DeleteVendorDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        vendorName={vendorToDelete?.companyName || ''}
      />
    </PageContainer>
  );
};

export default Vendors;