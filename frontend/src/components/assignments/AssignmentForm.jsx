import React, { useEffect, useState } from 'react';
import { useAssignmentForm } from '@/hooks';
import { ActionButton } from '@/components/common';
import { AssetService } from '@/services';

const MOCK_EMPLOYEES = [
  { name: 'Sarah Mitchell', department: 'Information Technology' },
  { name: 'James Owusu', department: 'Operations' },
  { name: 'Linda Adeyemi', department: 'Marketing' },
  { name: 'Tom Nakamura', department: 'Information Technology' },
  { name: 'Sophia Martinez', department: 'Sales' },
  { name: 'David Chen', department: 'Finance' },
  { name: 'Emma Watson', department: 'Human Resources' },
];

/**
 * AssignmentForm Component.
 * Form rendering inputs for asset selection, employee assignments, and validation rules.
 * @param {Object} props
 */
export const AssignmentForm = ({ onSubmit, onCancel }) => {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);

  // Fetch only AVAILABLE assets to assign
  useEffect(() => {
    const fetchAvailableAssets = async () => {
      try {
        const data = await AssetService.getAssets();
        // Only show 'Available' status assets
        const filtered = data.filter((a) => a.status.toLowerCase() === 'available');
        setAvailableAssets(filtered);
      } catch (err) {
        console.error('Failed to load available assets for form:', err);
      } finally {
        setIsAssetsLoading(false);
      }
    };
    fetchAvailableAssets();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const { register, onSubmitHandler, errors, isLoading, watch, setValue } = useAssignmentForm({
    defaultValues: {
      assetCode: '',
      assetName: '',
      employeeName: '',
      department: '',
      assignedDate: todayStr,
      expectedReturnDate: '',
      remarks: '',
    },
    onSubmit: async (data) => {
      // Find asset name from selected code to submit fully
      const asset = availableAssets.find((a) => a.assetCode === data.assetCode);
      const payload = {
        ...data,
        assetName: asset ? asset.assetName : '',
      };
      await onSubmit(payload);
    },
  });

  const selectedEmployeeName = watch('employeeName');
  const assignedDateValue = watch('assignedDate');

  // Auto-fill department when employee is selected
  useEffect(() => {
    if (selectedEmployeeName) {
      const match = MOCK_EMPLOYEES.find((e) => e.name === selectedEmployeeName);
      if (match) {
        setValue('department', match.department);
      }
    }
  }, [selectedEmployeeName, setValue]);

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <div className="asset-form-grid">
        {/* Asset Selection */}
        <div className="form-group">
          <label htmlFor="assetCode" className="form-label">Asset to Assign *</label>
          <select
            id="assetCode"
            disabled={isAssetsLoading || isLoading}
            className={`filters-select form-input ${errors.assetCode ? 'input-error' : ''}`}
            {...register('assetCode', { required: 'Asset selection is required.' })}
          >
            <option value="">
              {isAssetsLoading ? 'Loading assets…' : 'Select an available asset…'}
            </option>
            {availableAssets.map((asset) => (
              <option key={asset.assetCode} value={asset.assetCode}>
                {asset.assetName} ({asset.assetCode})
              </option>
            ))}
          </select>
          {errors.assetCode && <span className="error-message" role="alert">{errors.assetCode.message}</span>}
        </div>

        {/* Employee Selection */}
        <div className="form-group">
          <label htmlFor="employeeName" className="form-label">Custodian (Employee) *</label>
          <select
            id="employeeName"
            disabled={isLoading}
            className={`filters-select form-input ${errors.employeeName ? 'input-error' : ''}`}
            {...register('employeeName', { required: 'Custodian selection is required.' })}
          >
            <option value="">Select an employee…</option>
            {MOCK_EMPLOYEES.map((emp) => (
              <option key={emp.name} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>
          {errors.employeeName && <span className="error-message" role="alert">{errors.employeeName.message}</span>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="department" className="form-label">Department *</label>
          <input
            id="department"
            type="text"
            disabled={isLoading}
            placeholder="e.g. Information Technology"
            className={`form-input ${errors.department ? 'input-error' : ''}`}
            {...register('department', {
              required: 'Department is required.',
              maxLength: { value: 60, message: 'Cannot exceed 60 characters.' },
            })}
          />
          {errors.department && <span className="error-message" role="alert">{errors.department.message}</span>}
        </div>

        {/* Assigned Date */}
        <div className="form-group">
          <label htmlFor="assignedDate" className="form-label">Assigned Date *</label>
          <input
            id="assignedDate"
            type="date"
            disabled={isLoading}
            className={`form-input ${errors.assignedDate ? 'input-error' : ''}`}
            {...register('assignedDate', { required: 'Assigned date is required.' })}
          />
          {errors.assignedDate && <span className="error-message" role="alert">{errors.assignedDate.message}</span>}
        </div>

        {/* Expected Return Date */}
        <div className="form-group">
          <label htmlFor="expectedReturnDate" className="form-label">Expected Return Date *</label>
          <input
            id="expectedReturnDate"
            type="date"
            disabled={isLoading}
            className={`form-input ${errors.expectedReturnDate ? 'input-error' : ''}`}
            {...register('expectedReturnDate', {
              required: 'Expected return date is required.',
              validate: (value) => {
                if (!value || !assignedDateValue) return true;
                const expected = new Date(value);
                const assigned = new Date(assignedDateValue);
                if (expected <= assigned) {
                  return 'Expected return date must be after the assigned date.';
                }
                return true;
              },
            })}
          />
          {errors.expectedReturnDate && (
            <span className="error-message" role="alert">{errors.expectedReturnDate.message}</span>
          )}
        </div>

        {/* Remarks */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label htmlFor="remarks" className="form-label">Remarks</label>
          <textarea
            id="remarks"
            disabled={isLoading}
            placeholder="Provide detail on why the asset is assigned or custody context…"
            className="form-input"
            rows={3}
            {...register('remarks')}
          />
        </div>
      </div>

      <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
        <ActionButton onClick={onCancel} variant="secondary" disabled={isLoading}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Assign Asset
        </ActionButton>
      </div>
    </form>
  );
};
