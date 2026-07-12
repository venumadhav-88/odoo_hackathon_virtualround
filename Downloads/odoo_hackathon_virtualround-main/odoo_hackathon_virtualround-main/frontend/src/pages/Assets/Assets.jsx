import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePageTitle, useAssetFilters } from '@/hooks';
import { AssetService } from '@/services';
import {
  PageContainer,
  PageHeader,
  ActionButton,
  ErrorState,
} from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';
import {
  AssetStats,
  AssetFilters,
  AssetTable,
  AssetModal,
  DeleteAssetDialog,
} from '@/components/assets';

/**
 * Assets Page.
 * Orchestrates the asset list view, statistics, filtering, and CRUD modals.
 */
const Assets = () => {
  usePageTitle('Asset Inventory');

  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AssetService.getAssets();
      setAssets(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    sortBy, setSortBy,
    filteredAssets,
  } = useAssetFilters(assets);

  // Modal handlers
  const openCreate = () => { setModalMode('create'); setSelectedAsset(null); setIsModalOpen(true); };
  const openView = (asset) => { setModalMode('view'); setSelectedAsset(asset); setIsModalOpen(true); };
  const openEdit = (asset) => { setModalMode('edit'); setSelectedAsset(asset); setIsModalOpen(true); };
  const openDelete = (asset) => { setAssetToDelete(asset); setIsDeleteOpen(true); };

  const handleModalSubmit = async (formData) => {
    setIsActionLoading(true);
    try {
      if (modalMode === 'create') {
        const created = await AssetService.createAsset(formData);
        setAssets((prev) => [created, ...prev]);
      } else if (modalMode === 'edit') {
        const updated = await AssetService.updateAsset(selectedAsset.id, formData);
        setAssets((prev) => prev.map((a) => (a.id === selectedAsset.id ? updated : a)));
      }
      setIsModalOpen(false);
    } catch {
      // Notifications handled inside the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;
    setIsActionLoading(true);
    try {
      await AssetService.deleteAsset(assetToDelete.id);
      setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id));
      setIsDeleteOpen(false);
      setAssetToDelete(null);
    } catch {
      // Notifications handled inside the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Asset Inventory" subtitle="Manage and track company physical assets" />
        <PageLoader message="Loading asset inventory…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Asset Inventory" subtitle="Manage and track company physical assets" />
        <ErrorState
          title="Failed to Load Assets"
          description="We encountered an issue fetching asset records."
          onRetry={fetchAssets}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Asset Inventory"
        subtitle="Manage and track company physical assets"
        actions={
          <ActionButton onClick={openCreate} icon={Plus} variant="primary">
            Add Asset
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      <AssetStats assets={assets} />

      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        allAssets={assets}
      />

      <AssetTable
        assets={filteredAssets}
        isLoading={false}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        asset={selectedAsset}
        mode={modalMode}
        onSubmit={handleModalSubmit}
      />

      <DeleteAssetDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        assetName={assetToDelete?.assetName || ''}
      />
    </PageContainer>
  );
};

export default Assets;
