import React from 'react';
import { ConfirmDialog } from '@/components/common';

export const DeleteVendorDialog = ({ isOpen, onClose, onConfirm, vendorName }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Vendor"
      description={`Are you sure you want to delete ${vendorName || 'this vendor'}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
      isDanger
    />
  );
};