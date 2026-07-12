import React from 'react';
import { formatDatetime } from '@/utils/formatters';
import { StatusBadge } from '@/components/common';

const DetailItem = ({ label, value }) => (
  <div className="vendor-detail-item">
    <span className="vendor-detail-label">{label}</span>
    <span className="vendor-detail-value">{value || '-'}</span>
  </div>
);

export const VendorDetails = ({ vendor }) => {
  if (!vendor) return null;

  return (
    <div className="vendor-details">
      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Basic Information</h4>
        <div className="vendor-details-grid">
          <DetailItem label="Vendor Code" value={vendor.vendorCode} />
          <DetailItem label="Company Name" value={vendor.companyName} />
          <DetailItem label="Contact Person" value={vendor.contactPerson} />
          <DetailItem label="GST Number" value={vendor.gstNumber} />
        </div>
      </div>

      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Contact Information</h4>
        <div className="vendor-details-grid">
          <DetailItem label="Email" value={vendor.email} />
          <DetailItem label="Phone" value={vendor.phone} />
          <DetailItem label="Website" value={vendor.website} />
        </div>
      </div>

      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Business Information</h4>
        <div className="vendor-details-grid">
          <DetailItem label="Vendor Type" value={vendor.vendorType} />
          <div className="vendor-detail-item">
            <span className="vendor-detail-label">Status</span>
            <span className="vendor-detail-value"><StatusBadge status={vendor.status} label={vendor.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : ''} /></span>
          </div>
          <DetailItem label="Rating" value={`${Number(vendor.rating || 0).toFixed(1)} / 5`} />
        </div>
      </div>

      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Address</h4>
        <div className="vendor-details-grid">
          <DetailItem label="Address" value={vendor.address} />
          <DetailItem label="City" value={vendor.city} />
          <DetailItem label="State" value={vendor.state} />
          <DetailItem label="Country" value={vendor.country} />
          <DetailItem label="Postal Code" value={vendor.postalCode} />
        </div>
      </div>

      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Notes</h4>
        <p className="vendor-details-notes">{vendor.notes || '-'}</p>
      </div>

      <div className="vendor-details-section">
        <h4 className="vendor-details-section-title">Metadata</h4>
        <div className="vendor-details-grid">
          <DetailItem label="Created At" value={formatDatetime(vendor.createdAt)} />
          <DetailItem label="Updated At" value={formatDatetime(vendor.updatedAt)} />
        </div>
      </div>
    </div>
  );
};