import React from 'react';
import { Modal } from '@/components/common';
import { AssetForm } from './AssetForm';

const MODAL_TITLES = {
  create: 'Add New Asset',
  edit: 'Edit Asset',
  view: 'Asset Details',
};

/**
 * AssetModal Component.
 * Wraps AssetForm in the shared Modal for create, edit, and view interactions.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {AssetModel} [props.asset]
 * @param {'create'|'edit'|'view'} [props.mode='create']
 * @param {Function} props.onSubmit
 */
export const AssetModal = ({ isOpen, onClose, asset, mode = 'create', onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-wide">
      <Modal.Header onClose={onClose}>
        {MODAL_TITLES[mode] || 'Asset'}
      </Modal.Header>
      <Modal.Body>
        <AssetForm
          asset={asset}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </Modal.Body>
    </Modal>
  );
};
