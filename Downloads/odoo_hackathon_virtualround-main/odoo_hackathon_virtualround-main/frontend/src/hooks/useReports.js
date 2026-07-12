import { useState, useMemo } from 'react';

/**
 * Custom hook to filter data and calculate aggregate executive KPIs and chart arrays.
 * @param {Object} rawData - Consolidated reporting data containing assets, assignments, and maintenance logs.
 */
export const useReports = (rawData) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [maintTypeFilter, setMaintTypeFilter] = useState('all');

  const { assets = [], assignments = [], maintenance = [] } = rawData || {};

  // 1. Filtering process
  const filteredData = useMemo(() => {
    let fAssets = [...assets];
    let fAssignments = [...assignments];
    let fMaintenance = [...maintenance];

    // Filter by Category
    if (categoryFilter !== 'all') {
      fAssets = fAssets.filter((a) => a.category?.toLowerCase() === categoryFilter.toLowerCase());
      fAssignments = fAssignments.filter((asg) => {
        const asset = assets.find((a) => a.assetCode === asg.assetCode);
        return asset?.category?.toLowerCase() === categoryFilter.toLowerCase();
      });
      fMaintenance = fMaintenance.filter((m) => m.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Filter by Department
    if (departmentFilter !== 'all') {
      fAssets = fAssets.filter((a) => {
        const lastAsg = assignments.find((asg) => asg.assetCode === a.assetCode && asg.status === 'Assigned');
        return lastAsg?.department?.toLowerCase() === departmentFilter.toLowerCase();
      });
      fAssignments = fAssignments.filter((asg) => asg.department?.toLowerCase() === departmentFilter.toLowerCase());
      fMaintenance = fMaintenance.filter((m) => {
        const lastAsg = assignments.find((asg) => asg.assetCode === m.assetCode && asg.status === 'Assigned');
        return lastAsg?.department?.toLowerCase() === departmentFilter.toLowerCase();
      });
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      fAssets = fAssets.filter((a) => a.status?.toLowerCase() === statusFilter.toLowerCase());
      fAssignments = fAssignments.filter((asg) => asg.status?.toLowerCase() === statusFilter.toLowerCase());
      fMaintenance = fMaintenance.filter((m) => m.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by Maintenance Type
    if (maintTypeFilter !== 'all') {
      fMaintenance = fMaintenance.filter((m) => m.maintenanceType?.toLowerCase() === maintTypeFilter.toLowerCase());
    }

    // Filter by Date Range (using assignedDate for assignments, scheduledDate for maintenance, purchaseDate for assets)
    if (dateRange.start) {
      const start = new Date(dateRange.start);
      fAssets = fAssets.filter((a) => !a.purchaseDate || new Date(a.purchaseDate) >= start);
      fAssignments = fAssignments.filter((asg) => new Date(asg.assignedDate) >= start);
      fMaintenance = fMaintenance.filter((m) => new Date(m.scheduledDate) >= start);
    }
    if (dateRange.end) {
      const end = new Date(dateRange.end);
      fAssets = fAssets.filter((a) => !a.purchaseDate || new Date(a.purchaseDate) <= end);
      fAssignments = fAssignments.filter((asg) => new Date(asg.assignedDate) <= end);
      fMaintenance = fMaintenance.filter((m) => new Date(m.scheduledDate) <= end);
    }

    return { assets: fAssets, assignments: fAssignments, maintenance: fMaintenance };
  }, [assets, assignments, maintenance, categoryFilter, departmentFilter, statusFilter, maintTypeFilter, dateRange]);

  // 2. Executive KPIs calculation
  const kpis = useMemo(() => {
    const total = filteredData.assets.length;
    const assigned = filteredData.assets.filter((a) => a.status?.toLowerCase() === 'assigned').length;
    const available = filteredData.assets.filter((a) => a.status?.toLowerCase() === 'available').length;
    const retired = filteredData.assets.filter((a) => a.status?.toLowerCase() === 'retired').length;

    // Asset Utilization % = (Assigned) / (Total - Retired)
    const activePool = total - retired;
    const utilizationRate = activePool > 0 ? (assigned / activePool) * 100 : 0;

    // Assignment Rate % = (Assigned) / Total
    const assignmentRate = total > 0 ? (assigned / total) * 100 : 0;

    // Total Maintenance Cost = Sum of actual cost of Completed logs + estimated cost of Scheduled/In Progress
    const compCost = filteredData.maintenance
      .filter((m) => m.status === 'Completed')
      .reduce((sum, m) => sum + (m.actualCost || 0), 0);
    const activeCost = filteredData.maintenance
      .filter((m) => m.status === 'Scheduled' || m.status === 'In Progress')
      .reduce((sum, m) => sum + (m.estimatedCost || 0), 0);
    const totalCost = compCost + activeCost;

    // Average Asset Age in years
    const ages = filteredData.assets
      .map((a) => {
        if (!a.purchaseDate) return null;
        const purchase = new Date(a.purchaseDate);
        const diffYears = (new Date('2026-07-12') - purchase) / (1000 * 60 * 60 * 24 * 365.25);
        return diffYears > 0 ? diffYears : 0;
      })
      .filter((age) => age !== null);
    const avgAge = ages.length > 0 ? ages.reduce((s, a) => s + a, 0) / ages.length : 0;

    // Upcoming maintenance tasks
    const upcomingMaint = filteredData.maintenance.filter((m) => m.status === 'Scheduled').length;

    return {
      totalAssets: total,
      utilizationRate,
      assignmentRate,
      maintenanceCost: totalCost,
      availableAssets: available,
      retiredAssets: retired,
      avgAssetAge: avgAge,
      upcomingMaintenance: upcomingMaint,
    };
  }, [filteredData]);

  // 3. Category Distribution chart data
  const categoryChartData = useMemo(() => {
    const counts = {};
    filteredData.assets.forEach((a) => {
      const cat = a.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts)
      .map((key) => ({ name: key, value: counts[key] }))
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [filteredData]);

  // 4. Maintenance cost breakdown chart data
  const maintenanceCostChartData = useMemo(() => {
    const costByType = {};
    filteredData.maintenance.forEach((m) => {
      const type = m.maintenanceType;
      const cost = m.status === 'Completed' ? (m.actualCost || 0) : (m.estimatedCost || 0);
      costByType[type] = (costByType[type] || 0) + cost;
    });
    return Object.keys(costByType).map((key) => ({ name: key, value: costByType[key] }));
  }, [filteredData]);

  // 5. Monthly assignment trend chart data
  const assignmentTrendChartData = useMemo(() => {
    // Generate monthly labels for the past 6 months leading up to July 2026
    const months = ['Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026'];
    const monthlyCounts = { '02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0 };

    filteredData.assignments.forEach((asg) => {
      if (asg.assignedDate && asg.assignedDate.startsWith('2026-')) {
        const monthPart = asg.assignedDate.substring(5, 7); // '02', '03' etc.
        if (monthlyCounts[monthPart] !== undefined) {
          monthlyCounts[monthPart]++;
        }
      }
    });

    const values = [
      monthlyCounts['02'],
      monthlyCounts['03'],
      monthlyCounts['04'],
      monthlyCounts['05'],
      monthlyCounts['06'],
      monthlyCounts['07'],
    ];

    return months.map((m, i) => ({ label: m, value: values[i] }));
  }, [filteredData]);

  return {
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    maintTypeFilter,
    setMaintTypeFilter,
    kpis,
    categoryChartData,
    maintenanceCostChartData,
    assignmentTrendChartData,
    filteredData,
  };
};
