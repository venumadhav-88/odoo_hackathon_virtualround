import React, { useEffect, useState, useMemo } from 'react';
import {
  Package,
  ClipboardList,
  Wrench,
  DollarSign,
  Calendar,
  Play,
  CheckCircle,
  XCircle,
  Undo2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { PageContainer, PageHeader } from '@/components/common';
import { AssetService, AssignmentService, MaintenanceService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/formatters';

const COLORS = {
  Available: '#10b981', // emerald
  Assigned: '#f59e0b', // amber
  'Under Maintenance': '#d1d5db', // graphite
  Retired: '#ef4444', // rose
};

/**
 * Dashboard Component.
 * Unified overview board demonstrating dynamic synchronization of stats, charts, and activity feeds.
 */
const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all logs in parallel to compile stats
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const [assetsData, assignmentsData, maintenanceData] = await Promise.all([
          AssetService.getAssets(),
          AssignmentService.getAssignments(),
          MaintenanceService.getMaintenance(),
        ]);
        setAssets(assetsData);
        setAssignments(assignmentsData);
        setMaintenance(maintenanceData);
      } catch (err) {
        console.error('Failed to load dashboard sync datasets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDashboardData();
  }, []);

  // 1. Metric calculations
  const metrics = useMemo(() => {
    const totalAssets = assets.length;
    const activeAssignments = assignments.filter((a) => a.status === 'Assigned' || a.status === 'Overdue').length;
    const underMaintenance = assets.filter((a) => a.status === 'Under Maintenance').length;
    
    const completedMaint = maintenance.filter((m) => m.status === 'Completed');
    const totalMaintCost = completedMaint.reduce((sum, m) => sum + (m.actualCost || 0), 0);

    return { totalAssets, activeAssignments, underMaintenance, totalMaintCost };
  }, [assets, assignments, maintenance]);

  // 2. Chart data: Asset Status distribution
  const assetChartData = useMemo(() => {
    const counts = { Available: 0, Assigned: 0, 'Under Maintenance': 0, Retired: 0 };
    assets.forEach((a) => {
      let statusLabel = 'Available';
      if (a.status === 'Assigned') statusLabel = 'Assigned';
      else if (a.status === 'Under Maintenance') statusLabel = 'Under Maintenance';
      else if (a.status === 'Retired') statusLabel = 'Retired';
      counts[statusLabel]++;
    });

    return Object.keys(counts)
      .map((key) => ({ name: key, value: counts[key] }))
      .filter((item) => item.value > 0);
  }, [assets]);

  // 3. Chart data: Maintenance cost by Type
  const costChartData = useMemo(() => {
    const costByType = {};
    maintenance.forEach((m) => {
      const type = m.maintenanceType;
      const cost = m.status === 'Completed' ? m.actualCost : m.estimatedCost;
      if (!costByType[type]) {
        costByType[type] = { name: type, Estimated: 0, Actual: 0 };
      }
      if (m.status === 'Completed') {
        costByType[type].Actual += cost || 0;
      } else {
        costByType[type].Estimated += cost || 0;
      }
    });

    return Object.values(costByType);
  }, [maintenance]);

  // 4. Live Chronological Recent Activity log
  const recentActivities = useMemo(() => {
    const list = [];

    // Assets
    assets.forEach((a) => {
      list.push({
        date: a.createdAt || '2026-07-01',
        type: 'Asset Registration',
        message: `New asset "${a.assetName}" (${a.assetCode}) was registered in the database.`,
        icon: Package,
        color: 'var(--color-primary)',
      });
    });

    // Assignments
    assignments.forEach((asg) => {
      list.push({
        date: asg.assignedDate,
        type: 'Asset Assigned',
        message: `Asset "${asg.assetName}" (${asg.assetCode}) was assigned to custodian ${asg.employeeName} (${asg.department}).`,
        icon: ClipboardList,
        color: 'var(--color-warning)',
      });
      if (asg.status === 'Returned' && asg.actualReturnDate) {
        list.push({
          date: asg.actualReturnDate,
          type: 'Asset Returned',
          message: `Asset "${asg.assetName}" (${asg.assetCode}) was returned by ${asg.employeeName} (Condition: ${asg.returnCondition}).`,
          icon: Undo2,
          color: 'var(--color-success)',
        });
      } else if (asg.status === 'Cancelled') {
        const cancelDate = asg.actualReturnDate || asg.assignedDate;
        list.push({
          date: cancelDate,
          type: 'Assignment Cancelled',
          message: `Assignment request for "${asg.assetName}" to ${asg.employeeName} was cancelled.`,
          icon: XCircle,
          color: 'var(--color-text-muted)',
        });
      }
    });

    // Maintenance
    maintenance.forEach((m) => {
      list.push({
        date: m.scheduledDate,
        type: 'Maintenance Scheduled',
        message: `Maintenance scheduled for "${m.assetName}" (${m.assetCode}) on ${m.scheduledDate}. Type: ${m.maintenanceType}.`,
        icon: Calendar,
        color: 'var(--color-primary)',
      });
      if (m.startDate) {
        list.push({
          date: m.startDate,
          type: 'Maintenance Started',
          message: `Maintenance started on "${m.assetName}" (${m.assetCode}) by vendor "${m.vendor}".`,
          icon: Play,
          color: 'var(--color-warning)',
        });
      }
      if (m.status === 'Completed' && m.completionDate) {
        list.push({
          date: m.completionDate,
          type: 'Maintenance Completed',
          message: `Maintenance completed for "${m.assetName}" (${m.assetCode}) - Result: ${m.result}. Realized cost: ${formatCurrency(
            m.actualCost
          )}.`,
          icon: CheckCircle,
          color: 'var(--color-success)',
        });
      } else if (m.status === 'Cancelled') {
        const cancelDate = m.updatedAt ? m.updatedAt.split('T')[0] : m.scheduledDate;
        list.push({
          date: cancelDate,
          type: 'Maintenance Cancelled',
          message: `Maintenance job for "${m.assetName}" (${m.assetCode}) was cancelled.`,
          icon: XCircle,
          color: 'var(--color-text-muted)',
        });
      }
    });

    // Sort newest first
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list.slice(0, 7);
  }, [assets, assignments, maintenance]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" subtitle="Overview of enterprise assets and scheduling" />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="loading-spinner" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Overview of enterprise assets and scheduling" />

      {/* KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Assets</span>
            <div className="stat-card-icon-wrapper">
              <Package size={18} />
            </div>
          </div>
          <div className="stat-card-value">{metrics.totalAssets}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Assets in Maintenance</span>
            <div className="stat-card-icon-wrapper primary">
              <Wrench size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            {metrics.underMaintenance}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Custodies</span>
            <div className="stat-card-icon-wrapper warning">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
            {metrics.activeAssignments}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Realized Repair Cost</span>
            <div className="stat-card-icon-wrapper success">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
            {formatCurrency(metrics.totalMaintCost)}
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Left Chart: Status Distribution */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
            Asset Inventory Status Distribution
          </h4>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={assetChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {assetChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#d1d5db'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-main)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Servicing Cost by Type */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
            Maintenance Expenditure by Type (USD)
          </h4>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={costChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-main)',
                  }}
                />
                <Legend verticalAlign="top" height={36} iconSize={12} iconType="circle" />
                <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estimated" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Recent Activities Feed */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}
      >
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
          Recent Enterprise Activity Logs
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recentActivities.map((act, index) => {
            const Icon = act.icon;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  paddingBottom: index === recentActivities.length - 1 ? 0 : '1.25rem',
                  borderBottom: index === recentActivities.length - 1 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-hover)',
                    color: act.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{act.type}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {formatDate(act.date)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {act.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
