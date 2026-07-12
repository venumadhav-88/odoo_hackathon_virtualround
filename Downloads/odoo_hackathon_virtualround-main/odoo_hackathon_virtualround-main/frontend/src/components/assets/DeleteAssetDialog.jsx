import React from 'react';
import { ConfirmDialog } from '@/components/common';

/**
 * DeleteAssetDialog Component.
 * Danger-variant confirmation dialog for asset deletion.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {string} props.assetName - Displayed in the dialog description.
 */
export const DeleteAssetDialog = ({ isOpen, onClose, onConfirm, assetName }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title="Delete Asset"
    description={`Are you sure you want to permanently delete "${assetName}"? This action cannot be undone.`}
    confirmText="Delete Asset"
    cancelText="Cancel"
    onConfirm={onConfirm}
    onCancel={onClose}
    isDanger={true}
  />
);
