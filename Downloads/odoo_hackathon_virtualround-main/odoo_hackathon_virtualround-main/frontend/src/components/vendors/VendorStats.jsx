import React, { useMemo } from 'react';
import { Building2, CheckCircle, XCircle, Factory, Truck, Star } from 'lucide-react';
import { SkeletonCard } from '@/components/common/loading';

export const VendorStats = ({ vendors, isLoading = false }) => {
  const stats = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((vendor) => vendor.status === 'active').length;
    const inactive = vendors.filter((vendor) => vendor.status === 'inactive').length;
    const manufacturers = vendors.filter((vendor) => vendor.vendorType === 'Manufacturer').length;
    const suppliers = vendors.filter((vendor) => vendor.vendorType === 'Supplier').length;
    const averageRating = total > 0
      ? Number((vendors.reduce((sum, vendor) => sum + (Number(vendor.rating) || 0), 0) / total).toFixed(1))
      : 0;

    return { total, active, inactive, manufacturers, suppliers, averageRating };
  }, [vendors]);

  if (isLoading) {
    return (
      <div className="stats-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Vendors', value: stats.total, icon: Building2, accent: 'primary' },
    { title: 'Active Vendors', value: stats.active, icon: CheckCircle, accent: 'success' },
    { title: 'Inactive Vendors', value: stats.inactive, icon: XCircle, accent: 'danger' },
    { title: 'Manufacturers', value: stats.manufacturers, icon: Factory, accent: 'primary' },
    { title: 'Suppliers', value: stats.suppliers, icon: Truck, accent: 'warning' },
    { title: 'Average Rating', value: stats.averageRating.toFixed(1), icon: Star, accent: 'success' },
  ];

  return (
    <div className="stats-grid stats-grid-vendors">
      {cards.map(({ title, value, icon: Icon, accent }) => (
        <div key={title} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{title}</span>
            <div className={`stat-card-icon-wrapper ${accent !== 'primary' ? accent : ''}`}>
              <Icon size={18} />
            </div>
          </div>
          <div className="stat-card-value">{value}</div>
        </div>
      ))}
    </div>
  );
};