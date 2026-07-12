import React from 'react';
import { Modal } from '@/components/common';
import { AssignmentForm } from './AssignmentForm';
import { AssignmentTimeline } from './AssignmentTimeline';

/**
 * AssignmentModal Component.
 * Orchestrating wrapper loading the AssignmentForm or AssignmentTimeline depending on action triggers.
 * @param {Object} props
 */
export const AssignmentModal = ({ isOpen, onClose, assignment, mode, onSubmit }) => {
  const isView = mode === 'view';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={isView ? '' : 'modal-wide'}>
      <Modal.Header onClose={onClose}>
        {mode === 'create' ? 'Assign New Asset' : 'Custody Assignment Record'}
      </Modal.Header>

      {isView ? (
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick specifications grid */}
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
                  Asset Code
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {assignment?.assetCode}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Asset Name
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {assignment?.assetName}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Custodian
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {assignment?.employeeName}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  Department
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {assignment?.department}
                </span>
              </div>
            </div>

            <AssignmentTimeline assignment={assignment} />
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <AssignmentForm onSubmit={onSubmit} onCancel={onClose} />
        </Modal.Body>
      )}
    </Modal>
  );
};
