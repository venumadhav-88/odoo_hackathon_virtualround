import React from 'react';
import { Modal } from '@/components/common';
import { MaintenanceForm } from './MaintenanceForm';
import { MaintenanceTimeline } from './MaintenanceTimeline';

/**
 * MaintenanceModal Component.
 * Orchestrating modal wrapper directing views between scheduling forms and job progress timelines.
 * @param {Object} props
 */
export const MaintenanceModal = ({ isOpen, onClose, maintenanceLog, mode, onSubmit }) => {
  const isView = mode === 'view';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={isView ? '' : 'modal-wide'}>
      <Modal.Header onClose={onClose}>
        {mode === 'create' ? 'Schedule Asset Maintenance' : 'Maintenance Log Record'}
      </Modal.Header>

      {isView ? (
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick specs grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                backgroundColor: 'var(--color-surface-hover)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Asset
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {maintenanceLog?.assetName} ({maintenanceLog?.assetCode})
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Category
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {maintenanceLog?.category}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Type
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {maintenanceLog?.maintenanceType}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Technician
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {maintenanceLog?.technician || 'unassigned'}
                </span>
              </div>
            </div>

            <MaintenanceTimeline maintenanceLog={maintenanceLog} />
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <MaintenanceForm onSubmit={onSubmit} onCancel={onClose} />
        </Modal.Body>
      )}
    </Modal>
  );
};
