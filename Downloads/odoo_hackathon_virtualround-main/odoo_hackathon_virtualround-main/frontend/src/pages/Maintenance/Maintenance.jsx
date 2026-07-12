import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePageTitle, useMaintenanceFilters } from '@/hooks';
import { MaintenanceService } from '@/services';
import {
  PageContainer,
  PageHeader,
  ActionButton,
  ErrorState,
  ConfirmDialog,
} from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';
import {
  MaintenanceStats,
  MaintenanceCostCard,
  MaintenanceFilters,
  MaintenanceTable,
  MaintenanceModal,
  CompleteMaintenanceDialog,
} from '@/components/maintenance';

/**
 * Maintenance Page Component.
 * Main view orchestrating fetch cycles, stats, cost cards, filters, and job lifecycles.
 */
const Maintenance = () => {
  usePageTitle('Maintenance Scheduling');

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal triggers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedLog, setSelectedLog] = useState(null);

  // Complete triggers
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [logToComplete, setLogToComplete] = useState(null);

  // Cancel triggers
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [logToCancel, setLogToCancel] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MaintenanceService.getMaintenance();
      setLogs(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const {
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    typeFilter, setTypeFilter,
    priorityFilter, setPriorityFilter,
    statusFilter, setStatusFilter,
    vendorFilter, setVendorFilter,
    dateFilter, setDateFilter,
    sortBy, setSortBy,
    filteredMaintenance,
  } = useMaintenanceFilters(logs);

  const openScheduleModal = () => {
    setModalMode('create');
    setSelectedLog(null);
    setIsModalOpen(true);
  };

  const openViewModal = (log) => {
    setModalMode('view');
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const openCompleteDialog = (log) => {
    setLogToComplete(log);
    setIsCompleteOpen(true);
  };

  const openCancelDialog = (log) => {
    setLogToCancel(log);
    setIsCancelOpen(true);
  };

  const handleScheduleSubmit = async (formData) => {
    setIsActionLoading(true);
    try {
      const created = await MaintenanceService.scheduleMaintenance(formData);
      setLogs((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartJob = async (log) => {
    setIsActionLoading(true);
    try {
      const updated = await MaintenanceService.startMaintenance(log.maintenanceId);
      setLogs((prev) =>
        prev.map((l) => (l.maintenanceId === log.maintenanceId ? updated : l))
      );
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCompleteConfirm = async (details) => {
    if (!logToComplete) return;
    setIsActionLoading(true);
    try {
      const updated = await MaintenanceService.completeMaintenance(logToComplete.maintenanceId, details);
      setLogs((prev) =>
        prev.map((l) => (l.maintenanceId === logToComplete.maintenanceId ? updated : l))
      );
      setIsCompleteOpen(false);
      setLogToComplete(null);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!logToCancel) return;
    setIsActionLoading(true);
    try {
      const updated = await MaintenanceService.cancelMaintenance(logToCancel.maintenanceId);
      setLogs((prev) =>
        prev.map((l) => (l.maintenanceId === logToCancel.maintenanceId ? updated : l))
      );
      setIsCancelOpen(false);
      setLogToCancel(null);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Maintenance Scheduling" subtitle="Log repairs, checkups, and servicing events" />
        <PageLoader message="Fetching maintenance log entries…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Maintenance Scheduling" subtitle="Log repairs, checkups, and servicing events" />
        <ErrorState
          title="Failed to Load Maintenance Logs"
          description="We encountered an issue connecting to the servicing database."
          onRetry={fetchLogs}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance Scheduling"
        subtitle="Log repairs, checkups, and servicing events"
        actions={
          <ActionButton onClick={openScheduleModal} icon={Plus} variant="primary">
            Schedule Maintenance
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      <MaintenanceStats maintenanceLogs={logs} />

      <MaintenanceCostCard maintenanceLogs={logs} />

      <MaintenanceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        vendorFilter={vendorFilter}
        onVendorChange={setVendorFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        allMaintenanceLogs={logs}
      />

      <MaintenanceTable
        maintenanceLogs={filteredMaintenance}
        isLoading={false}
        onView={openViewModal}
        onStart={handleStartJob}
        onComplete={openCompleteDialog}
        onCancel={openCancelDialog}
      />

      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maintenanceLog={selectedLog}
        mode={modalMode}
        onSubmit={handleScheduleSubmit}
      />

      <CompleteMaintenanceDialog
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
        onConfirm={handleCompleteConfirm}
        assetName={logToComplete?.assetName || ''}
      />

      <ConfirmDialog
        isOpen={isCancelOpen}
        title="Cancel Maintenance Schedule"
        description={`Are you sure you want to cancel the maintenance job scheduled for ${logToCancel?.assetName}? This releases the asset back to Available status.`}
        confirmText="Cancel Maintenance"
        cancelText="Keep Active"
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelOpen(false)}
        isDanger={true}
      />
    </PageContainer>
  );
};

export default Maintenance;
