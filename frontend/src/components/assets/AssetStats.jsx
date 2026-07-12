import React, { useMemo } from 'react';
import { Package, CheckCircle, Clock, Wrench, Archive } from 'lucide-react';
import { ASSET_STATUS } from '@/constants/assetStatus';

/**
 * AssetStats Component.
 * Renders five metric cards computed from the full unfiltered asset list.
 * @param {Object} props
 * @param {AssetModel[]} props.assets - Full asset list.
 */
export const AssetStats = ({ assets }) => {
  const stats = useMemo(() => {
    const total = assets.length;
    const assigned = assets.filter((a) => a.status === ASSET_STATUS.ASSIGNED).length;
    const available = assets.filter((a) => a.status === ASSET_STATUS.AVAILABLE).length;
    const maintenance = assets.filter((a) => a.status === ASSET_STATUS.UNDER_MAINTENANCE).length;
    const retired = assets.filter((a) => a.status === ASSET_STATUS.RETIRED).length;
    return { total, assigned, available, maintenance, retired };
  }, [assets]);

  const cards = [
    { title: 'Total Assets', value: stats.total, icon: Package, accent: 'primary' },
    { title: 'Assigned', value: stats.assigned, icon: CheckCircle, accent: 'warning' },
    { title: 'Available', value: stats.available, icon: Clock, accent: 'success' },
    { title: 'Maintenance', value: stats.maintenance, icon: Wrench, accent: 'primary' },
    { title: 'Retired', value: stats.retired, icon: Archive, accent: 'danger' },
  ];

  return (
    <div className="stats-grid">
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
