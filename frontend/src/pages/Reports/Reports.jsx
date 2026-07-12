import React, { useCallback, useEffect, useState } from 'react';
import { usePageTitle, useReports } from '@/hooks';
import { ReportsService } from '@/services';
import { PageContainer, PageHeader, ErrorState } from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import {
  ReportCards,
  AssetUtilizationChart,
  CategoryDistributionChart,
  MaintenanceCostChart,
  AssignmentTrendChart,
  ReportFilters,
  ExportPanel,
  RecentActivities,
} from '@/components/reports';

/**
 * Reports Orchestrator Page.
 * Visualizes asset analysis KPIs, SVG/CSS custom charts, and consolidated log lists.
 */
const Reports = () => {
  usePageTitle('Reports & Analytics');

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ReportsService.getReportData();
      setReportData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const {
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
  } = useReports(reportData || {});

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Reports & Analytics" subtitle="Executive KPI dashboard and asset utilization metrics" />
        <PageLoader message="Compiling executive analytics reports…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Reports & Analytics" subtitle="Executive KPI dashboard and asset utilization metrics" />
        <ErrorState
          title="Failed to Load Executive Reports"
          description="We encountered an issue communicating with the database repositories."
          onRetry={fetchReports}
        />
      </PageContainer>
    );
  }

  const { assets = [] } = filteredData;
  const assignedCount = assets.filter((a) => a.status?.toLowerCase() === 'assigned').length;
  const availableCount = assets.filter((a) => a.status?.toLowerCase() === 'available').length;
  const maintenanceCount = assets.filter(
    (a) => a.status?.toLowerCase() === 'under maintenance' || a.status?.toLowerCase() === 'under_maintenance'
  ).length;
  const retiredCount = assets.filter((a) => a.status?.toLowerCase() === 'retired').length;

  return (
    <PageContainer>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Executive KPI dashboard and asset utilization metrics"
        actions={<ExportPanel />}
      />

      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        maintTypeFilter={maintTypeFilter}
        onMaintTypeChange={setMaintTypeFilter}
        allAssets={reportData?.assets || []}
        allAssignments={reportData?.assignments || []}
      />

      <ReportCards kpis={kpis} />

      {/* Grid displaying custom SVG/CSS Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Utilization Gauge */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <AssetUtilizationChart
            utilizationRate={kpis.utilizationRate}
            assigned={assignedCount}
            available={availableCount}
            maintenance={maintenanceCount}
            retired={retiredCount}
          />
        </div>

        {/* Category Distribution CSS Progress Bars */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <CategoryDistributionChart data={categoryChartData} />
        </div>

        {/* Maintenance Cost SVG Bar Columns */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <MaintenanceCostChart data={maintenanceCostChartData} />
        </div>

        {/* Monthly Assignment SVG Area-Line */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <AssignmentTrendChart data={assignmentTrendChartData} />
        </div>
      </div>

      <RecentActivities
        assets={filteredData.assets}
        assignments={filteredData.assignments}
        maintenance={filteredData.maintenance}
      />
    </PageContainer>
  );
};

export default Reports;
