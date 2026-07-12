import React, { useEffect } from 'react';
import { useAssetForm } from '@/hooks';
import { ActionButton } from '@/components/common';
import { ASSET_STATUS } from '@/constants/assetStatus';

const CATEGORY_OPTIONS = [
  'Information Technology',
  'Office Furniture',
  'Mobile Devices',
  'Network Infrastructure',
  'Lab Equipment',
];

/**
 * AssetForm Component.
 * Full create/edit/view form for an asset with React Hook Form validation.
 * @param {Object} props
 * @param {AssetModel} [props.asset] - Existing asset for edit/view modes.
 * @param {'create'|'edit'|'view'} [props.mode='create']
 * @param {Function} props.onSubmit - Called with valid form data.
 * @param {Function} props.onCancel - Cancel / close handler.
 */
export const AssetForm = ({ asset, mode = 'create', onSubmit, onCancel }) => {
  const isView = mode === 'view';

  const { register, onSubmitHandler, errors, isLoading, reset } = useAssetForm({
    defaultValues: buildDefaultValues(asset),
    onSubmit,
  });

  useEffect(() => {
    reset(buildDefaultValues(asset));
  }, [asset, reset]);

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <div className="asset-form-grid">
        {/* Asset Code */}
        <div className="form-group">
          <label htmlFor="assetCode" className="form-label">Asset Code *</label>
          <input
            id="assetCode"
            type="text"
            disabled={isView || isLoading || mode === 'edit'}
            placeholder="e.g. IT-LT-001"
            className={`form-input ${errors.assetCode ? 'input-error' : ''}`}
            {...register('assetCode', {
              required: 'Asset code is required.',
              maxLength: { value: 20, message: 'Cannot exceed 20 characters.' },
              setValueAs: (v) => v?.trim(),
            })}
          />
          {errors.assetCode && <span className="error-message" role="alert">{errors.assetCode.message}</span>}
        </div>

        {/* Asset Name */}
        <div className="form-group">
          <label htmlFor="assetName" className="form-label">Asset Name *</label>
          <input
            id="assetName"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. Dell XPS 15 Laptop"
            className={`form-input ${errors.assetName ? 'input-error' : ''}`}
            {...register('assetName', {
              required: 'Asset name is required.',
              maxLength: { value: 100, message: 'Cannot exceed 100 characters.' },
              setValueAs: (v) => v?.trim(),
            })}
          />
          {errors.assetName && <span className="error-message" role="alert">{errors.assetName.message}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category *</label>
          <select
            id="category"
            disabled={isView || isLoading}
            className={`filters-select form-input ${errors.category ? 'input-error' : ''}`}
            {...register('category', { required: 'Category is required.' })}
          >
            <option value="">Select a category…</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className="error-message" role="alert">{errors.category.message}</span>}
        </div>

        {/* Serial Number */}
        <div className="form-group">
          <label htmlFor="serialNumber" className="form-label">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. SN-001-2024"
            className="form-input"
            {...register('serialNumber', {
              maxLength: { value: 50, message: 'Cannot exceed 50 characters.' },
              setValueAs: (v) => v?.trim(),
            })}
          />
          {errors.serialNumber && <span className="error-message" role="alert">{errors.serialNumber.message}</span>}
        </div>

        {/* Manufacturer */}
        <div className="form-group">
          <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
          <input
            id="manufacturer"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. Dell, Apple, Cisco"
            className="form-input"
            {...register('manufacturer', {
              maxLength: { value: 60, message: 'Cannot exceed 60 characters.' },
              setValueAs: (v) => v?.trim(),
            })}
          />
          {errors.manufacturer && <span className="error-message" role="alert">{errors.manufacturer.message}</span>}
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status *</label>
          <select
            id="status"
            disabled={isView || isLoading}
            className={`filters-select form-input ${errors.status ? 'input-error' : ''}`}
            {...register('status', { required: 'Status is required.' })}
          >
            <option value={ASSET_STATUS.AVAILABLE}>Available</option>
            <option value={ASSET_STATUS.ASSIGNED}>Assigned</option>
            <option value={ASSET_STATUS.UNDER_MAINTENANCE}>Under Maintenance</option>
            <option value={ASSET_STATUS.RETIRED}>Retired</option>
          </select>
          {errors.status && <span className="error-message" role="alert">{errors.status.message}</span>}
        </div>

        {/* Assigned To */}
        <div className="form-group">
          <label htmlFor="assignedTo" className="form-label">Assigned To</label>
          <input
            id="assignedTo"
            type="text"
            disabled={isView || isLoading}
            placeholder="Employee name"
            className="form-input"
            {...register('assignedTo', {
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
              setValueAs: (v) => v?.trim() || null,
            })}
          />
          {errors.assignedTo && <span className="error-message" role="alert">{errors.assignedTo.message}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            id="location"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. Head Office - Floor 3"
            className="form-input"
            {...register('location', {
              maxLength: { value: 100, message: 'Cannot exceed 100 characters.' },
              setValueAs: (v) => v?.trim(),
            })}
          />
          {errors.location && <span className="error-message" role="alert">{errors.location.message}</span>}
        </div>

        {/* Purchase Date */}
        <div className="form-group">
          <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            disabled={isView || isLoading}
            className="form-input"
            {...register('purchaseDate')}
          />
        </div>

        {/* Purchase Cost */}
        <div className="form-group">
          <label htmlFor="purchaseCost" className="form-label">Purchase Cost (USD)</label>
          <input
            id="purchaseCost"
            type="number"
            step="0.01"
            min="0"
            disabled={isView || isLoading}
            placeholder="0.00"
            className={`form-input ${errors.purchaseCost ? 'input-error' : ''}`}
            {...register('purchaseCost', {
              min: { value: 0, message: 'Cost cannot be negative.' },
              valueAsNumber: true,
            })}
          />
          {errors.purchaseCost && <span className="error-message" role="alert">{errors.purchaseCost.message}</span>}
        </div>

        {/* Warranty Expiry */}
        <div className="form-group">
          <label htmlFor="warrantyExpiry" className="form-label">Warranty Expiry</label>
          <input
            id="warrantyExpiry"
            type="date"
            disabled={isView || isLoading}
            className="form-input"
            {...register('warrantyExpiry')}
          />
        </div>
      </div>

      <div className="modal-footer">
        <ActionButton onClick={onCancel} variant="secondary" disabled={isLoading}>
          {isView ? 'Close' : 'Cancel'}
        </ActionButton>
        {!isView && (
          <ActionButton type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            {mode === 'create' ? 'Create Asset' : 'Save Changes'}
          </ActionButton>
        )}
      </div>
    </form>
  );
};

function buildDefaultValues(asset) {
  return {
    assetCode: asset?.assetCode || '',
    assetName: asset?.assetName || '',
    category: asset?.category || '',
    serialNumber: asset?.serialNumber || '',
    assignedTo: asset?.assignedTo || '',
    purchaseDate: asset?.purchaseDate || '',
    purchaseCost: asset?.purchaseCost ?? '',
    status: asset?.status || 'available',
    location: asset?.location || '',
    manufacturer: asset?.manufacturer || '',
    warrantyExpiry: asset?.warrantyExpiry || '',
  };
}
