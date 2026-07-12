import React from 'react';
import { Package, BadgePercent, DollarSign, CheckCircle, Trash2, Clock, CalendarDays } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

/**
 * ReportCards Component.
 * Displays a grid of eight executive KPI cards.
 * @param {Object} props
 */
export const ReportCards = ({ kpis }) => {
  const cards = [
    {
      title: 'Total Assets Managed',
      value: kpis.totalAssets,
      icon: Package,
      accent: 'primary',
      description: 'Total registry count',
    },
    {
      title: 'Asset Utilization Rate',
      value: `${kpis.utilizationRate.toFixed(1)}%`,
      icon: BadgePercent,
      accent: 'success',
      description: 'Active pools utilization',
    },
    {
      title: 'Assignment Rate',
      value: `${kpis.assignmentRate.toFixed(1)}%`,
      icon: CheckCircle,
      accent: 'warning',
      description: 'Proportion of assigned items',
    },
    {
      title: 'Total Maintenance Cost',
      value: formatCurrency(kpis.maintenanceCost),
      icon: DollarSign,
      accent: 'danger',
      description: 'Realized & estimated servicing cost',
    },
    {
      title: 'Available Inventory',
      value: kpis.availableAssets,
      icon: CheckCircle,
      accent: 'success',
      description: 'Ready for re-assignment',
    },
    {
      title: 'Retired / Disposal Assets',
      value: kpis.retiredAssets,
      icon: Trash2,
      accent: 'danger',
      description: 'Marked for write-off',
    },
    {
      title: 'Average Asset Age',
      value: `${kpis.avgAssetAge.toFixed(1)} Years`,
      icon: Clock,
      accent: 'primary',
      description: 'Mean elapsed life span',
    },
    {
      title: 'Upcoming Maintenance',
      value: kpis.upcomingMaintenance,
      icon: CalendarDays,
      accent: 'warning',
      description: 'Pending scheduled logs',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {cards.map(({ title, value, icon: Icon, accent, description }) => (
        <div key={title} className="stat-card" style={{ padding: '1.25rem' }}>
          <div className="stat-card-header" style={{ marginBottom: '0.75rem' }}>
            <span className="stat-card-title" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{title}</span>
            <div className={`stat-card-icon-wrapper ${accent !== 'primary' ? accent : ''}`} style={{ padding: '0.375rem', borderRadius: '8px' }}>
              <Icon size={16} />
            </div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: accent === 'danger' ? 'var(--color-danger)' : accent === 'success' ? 'var(--color-success)' : 'var(--color-text-main)' }}>
            {value}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {description}
          </div>
        </div>
      ))}
    </div>
  );
};
