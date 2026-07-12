import React from 'react';
import { Modal } from '@/components/common';
import { CategoryForm } from './CategoryForm';

/**
 * CategoryModal Component.
 * Composited Modal view rendering creation, edition and details cards.
 * @param {Object} props - Properties.
 * @param {boolean} props.isOpen - Visual activity state toggler.
 * @param {Function} props.onClose - Modal closure click actions.
 * @param {Object} [props.category] - Existing category data structure.
 * @param {string} [props.mode='create'] - Display layout mode (create, edit, view).
 * @param {Function} props.onSubmit - Triggered on valid form submissions.
 * @returns {JSX.Element} Category Modal dialog.
 */
export const CategoryModal = ({
  isOpen,
  onClose,
  category,
  mode = 'create',
  onSubmit,
}) => {
  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create Category';
      case 'edit': return 'Edit Category';
      case 'view': return 'Category Details';
      default: return 'Category';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header onClose={onClose}>{getModalTitle()}</Modal.Header>
      <Modal.Body>
        <CategoryForm
          category={category}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </Modal.Body>
    </Modal>
  );
};
