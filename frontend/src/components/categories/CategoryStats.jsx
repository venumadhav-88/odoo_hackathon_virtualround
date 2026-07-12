import React from 'react';
import { Folder, ToggleLeft, ToggleRight, Database, Percent } from 'lucide-react';

/**
 * CategoryStats Component.
 * Aggregate metric widgets mapping categories metadata.
 * @param {Object} props - Properties.
 * @param {Array} props.categories - List of active EAM CategoryModels.
 * @returns {JSX.Element} Grid list of stat widgets.
 */
export const CategoryStats = ({ categories }) => {
  const stats = React.useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === 'active').length;
    const inactive = total - active;
    const totalAssets = categories.reduce((sum, c) => sum + (c.assetCount || 0), 0);
    const averageAssets = total > 0 ? parseFloat((totalAssets / total).toFixed(1)) : 0;

    return {
      total,
      active,
      inactive,
      totalAssets,
      averageAssets,
    };
  }, [categories]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Total Categories</span>
          <div className="stat-card-icon-wrapper">
            <Folder size={18} />
          </div>
        </div>
        <div className="stat-card-value">{stats.total}</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Active Categories</span>
          <div className="stat-card-icon-wrapper success">
            <ToggleRight size={18} />
          </div>
        </div>
        <div className="stat-card-value">{stats.active}</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Inactive Categories</span>
          <div className="stat-card-icon-wrapper danger">
            <ToggleLeft size={18} />
          </div>
        </div>
        <div className="stat-card-value">{stats.inactive}</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Total Assets</span>
          <div className="stat-card-icon-wrapper">
            <Database size={18} />
          </div>
        </div>
        <div className="stat-card-value">{stats.totalAssets}</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Avg Assets/Category</span>
          <div className="stat-card-icon-wrapper warning">
            <Percent size={18} />
          </div>
        </div>
        <div className="stat-card-value">{stats.averageAssets}</div>
      </div>
    </div>
  );
};
