import React, { useMemo } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

/**
 * MaintenanceCostCard Component.
 * Sleek visual widgets summarizing realized expenditure costs vs pending budgets.
 * @param {Object} props
 */
export const MaintenanceCostCard = ({ maintenanceLogs }) => {
  const costStats = useMemo(() => {
    const completedRecords = maintenanceLogs.filter((m) => m.status === 'Completed');
    const totalCost = completedRecords.reduce((sum, m) => sum + (m.actualCost || 0), 0);
    const avgCost = completedRecords.length > 0 ? totalCost / completedRecords.length : 0;

    const activeRecords = maintenanceLogs.filter((m) => m.status === 'Scheduled' || m.status === 'In Progress');
    const estimatedPending = activeRecords.reduce((sum, m) => sum + (m.estimatedCost || 0), 0);

    return { totalCost, avgCost, estimatedPending };
  }, [maintenanceLogs]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {/* Total Cost Card */}
      <div
        className="stat-card"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="stat-card-header">
          <span className="stat-card-title">Total Maintenance Cost</span>
          <div className="stat-card-icon-wrapper success">
            <DollarSign size={18} />
          </div>
        </div>
        <div className="stat-card-value" style={{ color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
          {formatCurrency(costStats.totalCost)}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <TrendingUp size={12} style={{ color: 'var(--color-success)' }} />
          <span>Realized cost across all completed repairs</span>
        </div>
      </div>

      {/* Average Cost Card */}
      <div
        className="stat-card"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.04) 100%)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="stat-card-header">
          <span className="stat-card-title">Average Cost per Repair</span>
          <div className="stat-card-icon-wrapper primary">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="stat-card-value" style={{ letterSpacing: '-0.02em' }}>
          {formatCurrency(costStats.avgCost)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          <span>
            Pending scheduled budget: <strong>{formatCurrency(costStats.estimatedPending)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
