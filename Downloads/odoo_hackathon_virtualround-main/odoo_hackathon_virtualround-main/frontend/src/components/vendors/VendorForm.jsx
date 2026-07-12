import React, { useEffect } from 'react';
import { useVendorForm } from '@/hooks';
import { ActionButton } from '@/components/common';

const VENDOR_TYPE_OPTIONS = [
  'Manufacturer',
  'Supplier',
  'Distributor',
  'Service Provider',
  'Repair Partner',
  'Rental Vendor',
  'Other',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blocked', label: 'Blocked' },
];

export const VendorForm = ({ vendor, mode = 'create', onSubmit, onCancel }) => {
  const isView = mode === 'view';

  const { register, onSubmitHandler, errors, isLoading, reset } = useVendorForm({
    defaultValues: buildDefaultValues(vendor),
    onSubmit,
  });

  useEffect(() => {
    reset(buildDefaultValues(vendor));
  }, [vendor, reset]);

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <div className="vendor-form-grid">
        <div className="vendor-form-section-title">Basic Information</div>

        <div className="form-group">
          <label htmlFor="vendorCode" className="form-label">Vendor Code *</label>
          <input
            id="vendorCode"
            type="text"
            disabled={isView || isLoading || mode === 'edit'}
            placeholder="e.g. VND-001"
            className={`form-input ${errors.vendorCode ? 'input-error' : ''}`}
            {...register('vendorCode', {
              required: 'Vendor code is required.',
              maxLength: { value: 20, message: 'Cannot exceed 20 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.vendorCode && <span className="error-message" role="alert">{errors.vendorCode.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="companyName" className="form-label">Company Name *</label>
          <input
            id="companyName"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. Northwind Manufacturing"
            className={`form-input ${errors.companyName ? 'input-error' : ''}`}
            {...register('companyName', {
              required: 'Company name is required.',
              maxLength: { value: 120, message: 'Cannot exceed 120 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.companyName && <span className="error-message" role="alert">{errors.companyName.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contactPerson" className="form-label">Contact Person *</label>
          <input
            id="contactPerson"
            type="text"
            disabled={isView || isLoading}
            placeholder="e.g. Amit Sharma"
            className={`form-input ${errors.contactPerson ? 'input-error' : ''}`}
            {...register('contactPerson', {
              required: 'Contact person is required.',
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.contactPerson && <span className="error-message" role="alert">{errors.contactPerson.message}</span>}
        </div>

        <div className="vendor-form-section-title">Contact Information</div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            id="email"
            type="email"
            disabled={isView || isLoading}
            placeholder="name@company.com"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Email is required.',
              maxLength: { value: 120, message: 'Cannot exceed 120 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.email && <span className="error-message" role="alert">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone *</label>
          <input
            id="phone"
            type="text"
            disabled={isView || isLoading}
            placeholder="+919876543210"
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            {...register('phone', {
              required: 'Phone is required.',
              maxLength: { value: 20, message: 'Cannot exceed 20 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.phone && <span className="error-message" role="alert">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="website" className="form-label">Website</label>
          <input
            id="website"
            type="url"
            disabled={isView || isLoading}
            placeholder="https://company.com"
            className={`form-input ${errors.website ? 'input-error' : ''}`}
            {...register('website', {
              maxLength: { value: 200, message: 'Cannot exceed 200 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.website && <span className="error-message" role="alert">{errors.website.message}</span>}
        </div>

        <div className="vendor-form-section-title">Business Information</div>

        <div className="form-group">
          <label htmlFor="gstNumber" className="form-label">GST Number *</label>
          <input
            id="gstNumber"
            type="text"
            disabled={isView || isLoading}
            placeholder="27ABCDE1234F1Z5"
            className={`form-input ${errors.gstNumber ? 'input-error' : ''}`}
            {...register('gstNumber', {
              required: 'GST number is required.',
              maxLength: { value: 15, message: 'GST number cannot exceed 15 characters.' },
              setValueAs: (value) => value.trim().toUpperCase(),
            })}
          />
          {errors.gstNumber && <span className="error-message" role="alert">{errors.gstNumber.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="vendorType" className="form-label">Vendor Type *</label>
          <select
            id="vendorType"
            disabled={isView || isLoading}
            className={`filters-select form-input ${errors.vendorType ? 'input-error' : ''}`}
            {...register('vendorType', { required: 'Vendor type is required.' })}
          >
            <option value="">Select vendor type…</option>
            {VENDOR_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.vendorType && <span className="error-message" role="alert">{errors.vendorType.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">Status *</label>
          <select
            id="status"
            disabled={isView || isLoading}
            className={`filters-select form-input ${errors.status ? 'input-error' : ''}`}
            {...register('status', { required: 'Status is required.' })}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.status && <span className="error-message" role="alert">{errors.status.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating" className="form-label">Rating *</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            disabled={isView || isLoading}
            className={`form-input ${errors.rating ? 'input-error' : ''}`}
            {...register('rating', {
              required: 'Rating is required.',
              valueAsNumber: true,
              min: { value: 1, message: 'Rating must be at least 1.' },
              max: { value: 5, message: 'Rating cannot exceed 5.' },
            })}
          />
          {errors.rating && <span className="error-message" role="alert">{errors.rating.message}</span>}
        </div>

        <div className="vendor-form-section-title">Address</div>

        <div className="form-group vendor-form-group-span-2">
          <label htmlFor="address" className="form-label">Address *</label>
          <input
            id="address"
            type="text"
            disabled={isView || isLoading}
            placeholder="Street, building, or office address"
            className={`form-input ${errors.address ? 'input-error' : ''}`}
            {...register('address', {
              required: 'Address is required.',
              maxLength: { value: 200, message: 'Cannot exceed 200 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.address && <span className="error-message" role="alert">{errors.address.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">City *</label>
          <input
            id="city"
            type="text"
            disabled={isView || isLoading}
            placeholder="City"
            className={`form-input ${errors.city ? 'input-error' : ''}`}
            {...register('city', {
              required: 'City is required.',
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.city && <span className="error-message" role="alert">{errors.city.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state" className="form-label">State *</label>
          <input
            id="state"
            type="text"
            disabled={isView || isLoading}
            placeholder="State"
            className={`form-input ${errors.state ? 'input-error' : ''}`}
            {...register('state', {
              required: 'State is required.',
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.state && <span className="error-message" role="alert">{errors.state.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country" className="form-label">Country *</label>
          <input
            id="country"
            type="text"
            disabled={isView || isLoading}
            placeholder="Country"
            className={`form-input ${errors.country ? 'input-error' : ''}`}
            {...register('country', {
              required: 'Country is required.',
              maxLength: { value: 80, message: 'Cannot exceed 80 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.country && <span className="error-message" role="alert">{errors.country.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode" className="form-label">Postal Code *</label>
          <input
            id="postalCode"
            type="text"
            disabled={isView || isLoading}
            placeholder="Postal code"
            className={`form-input ${errors.postalCode ? 'input-error' : ''}`}
            {...register('postalCode', {
              required: 'Postal code is required.',
              maxLength: { value: 12, message: 'Cannot exceed 12 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.postalCode && <span className="error-message" role="alert">{errors.postalCode.message}</span>}
        </div>

        <div className="form-group vendor-form-group-span-2">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            rows={4}
            disabled={isView || isLoading}
            placeholder="Optional vendor notes"
            className={`form-input ${errors.notes ? 'input-error' : ''}`}
            {...register('notes', {
              maxLength: { value: 500, message: 'Cannot exceed 500 characters.' },
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.notes && <span className="error-message" role="alert">{errors.notes.message}</span>}
        </div>
      </div>

      <div className="modal-footer">
        <ActionButton onClick={onCancel} variant="secondary" disabled={isLoading}>
          {isView ? 'Close' : 'Cancel'}
        </ActionButton>
        {!isView && (
          <ActionButton type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            {mode === 'create' ? 'Create Vendor' : 'Save Changes'}
          </ActionButton>
        )}
      </div>
    </form>
  );
};

function buildDefaultValues(vendor) {
  return {
    vendorCode: vendor?.vendorCode || '',
    companyName: vendor?.companyName || '',
    contactPerson: vendor?.contactPerson || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    gstNumber: vendor?.gstNumber || '',
    address: vendor?.address || '',
    city: vendor?.city || '',
    state: vendor?.state || '',
    country: vendor?.country || '',
    postalCode: vendor?.postalCode || '',
    website: vendor?.website || '',
    vendorType: vendor?.vendorType || '',
    status: vendor?.status || 'active',
    rating: vendor?.rating ?? 3,
    notes: vendor?.notes || '',
  };
}