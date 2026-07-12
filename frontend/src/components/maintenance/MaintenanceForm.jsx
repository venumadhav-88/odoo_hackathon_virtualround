import React, { useEffect, useState } from 'react';
import { useMaintenanceForm } from '@/hooks';
import { ActionButton } from '@/components/common';
import { AssetService } from '@/services';

const MAINTENANCE_TYPES = ['Preventive', 'Corrective', 'Inspection', 'Calibration', 'Emergency'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

/**
 * MaintenanceForm Component.
 * Form scheduling asset maintenance tasks with validations.
 * @param {Object} props
 */
export const MaintenanceForm = ({ onSubmit, onCancel }) => {
  const [assets, setAssets] = useState([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);

  // Fetch assets that are eligible for maintenance (not retired, not already under maintenance)
  useEffect(() => {
    const fetchEligibleAssets = async () => {
      try {
        const data = await AssetService.getAssets();
        const filtered = data.filter(
          (a) =>
            a.status.toLowerCase() !== 'retired' &&
            a.status.toLowerCase() !== 'under_maintenance' &&
            a.status.toLowerCase() !== 'under maintenance'
        );
        setAssets(filtered);
      } catch (err) {
        console.error('Failed to load eligible assets for maintenance schedule:', err);
      } finally {
        setIsAssetsLoading(false);
      }
    };
    fetchEligibleAssets();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const { register, onSubmitHandler, errors, isLoading } = useMaintenanceForm({
    defaultValues: {
      assetCode: '',
      maintenanceType: 'Preventive',
      priority: 'Medium',
      vendor: '',
      technician: '',
      scheduledDate: todayStr,
      estimatedCost: '',
      remarks: '',
    },
    onSubmit: async (data) => {
      // Find asset detail from selected code
      const selectedAsset = assets.find((a) => a.assetCode === data.assetCode);
      const payload = {
        ...data,
        assetId: selectedAsset ? selectedAsset.id : '',
        assetName: selectedAsset ? selectedAsset.assetName : '',
        category: selectedAsset ? selectedAsset.category : '',
      };
      await onSubmit(payload);
    },
  });

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <div className="asset-form-grid">
        {/* Asset Selection */}
        <div className="form-group">
          <label htmlFor="assetCode" className="form-label">Asset *</label>
          <select
            id="assetCode"
            disabled={isAssetsLoading || isLoading}
            className={`filters-select form-input ${errors.assetCode ? 'input-error' : ''}`}
            {...register('assetCode', { required: 'Asset selection is required.' })}
          >
            <option value="">
              {isAssetsLoading ? 'Loading assets…' : 'Select an asset…'}
            </option>
            {assets.map((asset) => (
              <option key={asset.assetCode} value={asset.assetCode}>
                {asset.assetName} ({asset.assetCode})
              </option>
            ))}
          </select>
          {errors.assetCode && <span className="error-message" role="alert">{errors.assetCode.message}</span>}
        </div>

        {/* Maintenance Type */}
        <div className="form-group">
          <label htmlFor="maintenanceType" className="form-label">Maintenance Type *</label>
          <select
            id="maintenanceType"
            disabled={isLoading}
            className={`filters-select form-input ${errors.maintenanceType ? 'input-error' : ''}`}
            {...register('maintenanceType', { required: 'Maintenance type is required.' })}
          >
            {MAINTENANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.maintenanceType && (
            <span className="error-message" role="alert">{errors.maintenanceType.message}</span>
          )}
        </div>

        {/* Priority */}
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Priority *</label>
          <select
            id="priority"
            disabled={isLoading}
            className={`filters-select form-input ${errors.priority ? 'input-error' : ''}`}
            {...register('priority', { required: 'Priority is required.' })}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {errors.priority && <span className="error-message" role="alert">{errors.priority.message}</span>}
        </div>

        {/* Scheduled Date */}
        <div className="form-group">
          <label htmlFor="scheduledDate" className="form-label">Scheduled Date *</label>
          <input
            id="scheduledDate"
            type="date"
            disabled={isLoading}
            className={`form-input ${errors.scheduledDate ? 'input-error' : ''}`}
            {...register('scheduledDate', {
              required: 'Scheduled date is required.',
              validate: (value) => {
                if (!value) return true;
                const selected = new Date(value + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected < today) {
                  return 'Scheduled date cannot be in the past.';
                }
                return true;
              },
            })}
          />
          {errors.scheduledDate && <span className="error-message" role="alert">{errors.scheduledDate.message}</span>}
        </div>

        {/* Estimated Cost */}
        <div className="form-group">
          <label htmlFor="estimatedCost" className="form-label">Estimated Cost (USD) *</label>
          <input
            id="estimatedCost"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            disabled={isLoading}
            className={`form-input ${errors.estimatedCost ? 'input-error' : ''}`}
            {...register('estimatedCost', {
              required: 'Estimated cost is required.',
              min: { value: 0, message: 'Cost cannot be negative.' },
              valueAsNumber: true,
            })}
          />
          {errors.estimatedCost && <span className="error-message" role="alert">{errors.estimatedCost.message}</span>}
        </div>

        {/* Vendor */}
        <div className="form-group">
          <label htmlFor="vendor" className="form-label">Service Vendor</label>
          <input
            id="vendor"
            type="text"
            placeholder="e.g. NetSolutions Inc."
            disabled={isLoading}
            className="form-input"
            {...register('vendor', {
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
            })}
          />
        </div>

        {/* Technician */}
        <div className="form-group">
          <label htmlFor="technician" className="form-label">Technician</label>
          <input
            id="technician"
            type="text"
            placeholder="e.g. Marcus Vance"
            disabled={isLoading}
            className="form-input"
            {...register('technician', {
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
            })}
          />
        </div>

        {/* Remarks */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label htmlFor="remarks" className="form-label">Remarks</label>
          <textarea
            id="remarks"
            disabled={isLoading}
            placeholder="Specify maintenance diagnostics or details…"
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
          Schedule Maintenance
        </ActionButton>
      </div>
    </form>
  );
};
