import React, { useState } from 'react';
import { Modal, ActionButton } from '@/components/common';

/**
 * ReturnAssetDialog Component.
 * Modal form prompting for asset condition state and returns log notes.
 * @param {Object} props
 */
export const ReturnAssetDialog = ({ isOpen, onClose, onConfirm, assetName }) => {
  const [condition, setCondition] = useState('Good');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm({ condition, remarks });
      setCondition('Good');
      setRemarks('');
    } catch (err) {
      console.error('Failed to submit return state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header onClose={onClose}>Return Asset</Modal.Header>
      <form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            You are registering the return of asset: <strong>{assetName}</strong>. Specify the current condition to update the inventory logs.
          </p>

          <div className="form-group">
            <label htmlFor="returnCondition" className="form-label">Asset Condition *</label>
            <select
              id="returnCondition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="filters-select form-input"
              disabled={isLoading}
              required
            >
              <option value="Good">Good (Available for inventory)</option>
              <option value="Damaged">Damaged (Re-route to maintenance)</option>
              <option value="Lost">Lost (Mark asset as retired)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="returnRemarks" className="form-label">Return Remarks</label>
            <textarea
              id="returnRemarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Returned power cords, minor scratches, lost stylus..."
              className="form-input"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ActionButton onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            Process Return
          </ActionButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
