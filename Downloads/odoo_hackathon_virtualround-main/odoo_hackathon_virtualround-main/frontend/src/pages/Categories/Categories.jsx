import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { usePageTitle, useCategoryFilters } from '@/hooks';
import { CategoryService } from '@/services';
import {
  PageContainer,
  PageHeader,
  ActionButton,
  ErrorState,
} from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';
import {
  CategoryStats,
  CategoryFilters,
  CategoryTable,
  CategoryModal,
  DeleteCategoryDialog,
} from '@/components/categories';

/**
 * Categories Page Component.
 * Main view coordinating fetching lifecycle, stats aggregation, list sorting, and crud toggles.
 * @returns {JSX.Element} Categories View.
 */
const Categories = () => {
  usePageTitle('Asset Categories');

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredCategories,
  } = useCategoryFilters(categories);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (category) => {
    setModalMode('view');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setIsActionLoading(true);
    try {
      if (modalMode === 'create') {
        const newCat = await CategoryService.createCategory(formData);
        setCategories((prev) => [newCat, ...prev]);
      } else if (modalMode === 'edit') {
        const updatedCat = await CategoryService.updateCategory(selectedCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCategory.id ? updatedCat : c))
        );
      }
      setIsModalOpen(false);
    } catch {
      // Error alerts are routed to the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsActionLoading(true);
    try {
      await CategoryService.deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
    } catch {
      // Error alerts are routed to the service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Asset Categories" subtitle="Organize asset listings by department or group" />
        <PageLoader message="Fetching categories inventory..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Asset Categories" subtitle="Organize asset listings by department or group" />
        <ErrorState
          title="Failed to Load Categories"
          description="We encountered an issue connecting to the EAM database."
          onRetry={fetchCategories}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Asset Categories"
        subtitle="Organize asset listings by department or group"
        actions={
          <ActionButton
            onClick={handleOpenCreateModal}
            icon={Plus}
            variant="primary"
          >
            Add Category
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      <CategoryStats categories={categories} />

      <CategoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <CategoryTable
        categories={filteredCategories}
        isLoading={false}
        onView={handleOpenViewModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        mode={modalMode}
        onSubmit={handleModalSubmit}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ''}
      />
    </PageContainer>
  );
};

export default Categories;
