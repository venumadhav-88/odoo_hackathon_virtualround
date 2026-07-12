import React from 'react';
import { Modal } from '@/components/common';
import { VendorForm } from './VendorForm';
import { VendorDetails } from './VendorDetails';

const MODAL_TITLES = {
  create: 'Create Vendor',
  edit: 'Edit Vendor',
  view: 'Vendor Details',
};

export const VendorModal = ({ isOpen, onClose, vendor, mode = 'create', onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-wide vendor-modal">
      <Modal.Header onClose={onClose}>{MODAL_TITLES[mode] || 'Vendor'}</Modal.Header>
      <Modal.Body>
        {mode === 'view' ? (
          <VendorDetails vendor={vendor} />
        ) : (
          <VendorForm vendor={vendor} mode={mode} onSubmit={onSubmit} onCancel={onClose} />
        )}
      </Modal.Body>
    </Modal>
  );
};