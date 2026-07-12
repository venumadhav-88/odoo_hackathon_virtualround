import React, { useState } from 'react';
import { Modal, ActionButton } from '@/components/common';

/**
 * CompleteMaintenanceDialog Component.
 * Dialog modal collecting realized costs, actual completion date, outcome result, and remarks.
 * @param {Object} props
 */
export const CompleteMaintenanceDialog = ({ isOpen, onClose, onConfirm, assetName }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [completionDate, setCompletionDate] = useState(todayStr);
  const [actualCost, setActualCost] = useState('');
  const [remarks, setRemarks] = useState('');
  const [result, setResult] = useState('Successful');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!completionDate) {
      setErrorMsg('Completion date is required.');
      return;
    }

    if (actualCost === '' || isNaN(Number(actualCost)) || Number(actualCost) < 0) {
      setErrorMsg('Actual cost must be a positive number (or 0).');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm({
        completionDate,
        actualCost: parseFloat(actualCost),
        remarks,
        result,
      });
      // reset states
      setCompletionDate(todayStr);
      setActualCost('');
      setRemarks('');
      setResult('Successful');
    } catch (err) {
      console.error('Failed to log completion state:', err);
      setErrorMsg(err.message || 'Failed to complete maintenance.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header onClose={onClose}>Complete Maintenance</Modal.Header>
      <form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            Logging completion details for: <strong>{assetName}</strong>. This will release the asset and update the inventory records.
          </p>

          {errorMsg && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', marginBottom: '1rem', fontWeight: 500 }} role="alert">
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="completionDate" className="form-label">Completion Date *</label>
            <input
              id="completionDate"
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="actualCost" className="form-label">Actual Cost (USD) *</label>
            <input
              id="actualCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maintenanceResult" className="form-label">Outcome Result *</label>
            <select
              id="maintenanceResult"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="filters-select form-input"
              disabled={isLoading}
              required
            >
              <option value="Successful">Successful (Revert to Available)</option>
              <option value="Needs Follow-up">Needs Follow-up (Keep in Maintenance)</option>
              <option value="Replacement Required">Replacement Required (Mark as Retired)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="completeRemarks" className="form-label">Completion Remarks</label>
            <textarea
              id="completeRemarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter repairs details, tasks done, parts replaced..."
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
            Complete Job
          </ActionButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
