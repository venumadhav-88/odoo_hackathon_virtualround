import React from 'react';
import { ConfirmDialog } from '@/components/common';

/**
 * DeleteCategoryDialog Component.
 * Confirmation modal wrapping the generic dialog container for deleting category rows.
 * @param {Object} props - Properties.
 * @param {boolean} props.isOpen - Activity toggle state.
 * @param {Function} props.onClose - Modal closure click actions.
 * @param {Function} props.onConfirm - Deletion verification dispatcher callback.
 * @param {string} props.categoryName - Name text segment for warnings.
 * @returns {JSX.Element} Deletion dialogue modal.
 */
export const DeleteCategoryDialog = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Category"
      description={`Are you sure you want to permanently delete the category "${categoryName}"? This action cannot be undone.`}
      confirmText="Delete Category"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
      isDanger={true}
    />
  );
};
