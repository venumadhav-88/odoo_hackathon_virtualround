import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePageTitle, useAssignmentFilters } from '@/hooks';
import { AssignmentService } from '@/services';
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
  AssignmentStats,
  AssignmentFilters,
  AssignmentTable,
  AssignmentModal,
  ReturnAssetDialog,
} from '@/components/assignments';

/**
 * Assignments Page Component.
 * Main view orchestrating fetch cycles, stats, filtering, and custody return/cancel flows.
 */
const Assignments = () => {
  usePageTitle('Asset Assignments');

  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal triggers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Return dialog triggers
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [assignmentToReturn, setAssignmentToReturn] = useState(null);

  // Cancel dialog triggers
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [assignmentToCancel, setAssignmentToCancel] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AssignmentService.getAssignments();
      setAssignments(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    departmentFilter, setDepartmentFilter,
    employeeFilter, setEmployeeFilter,
    dateFilter, setDateFilter,
    sortBy, setSortBy,
    filteredAssignments,
  } = useAssignmentFilters(assignments);

  const openAssignModal = () => {
    setModalMode('create');
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const openViewModal = (assignment) => {
    setModalMode('view');
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const openReturnDialog = (assignment) => {
    setAssignmentToReturn(assignment);
    setIsReturnOpen(true);
  };

  const openCancelDialog = (assignment) => {
    setAssignmentToCancel(assignment);
    setIsCancelOpen(true);
  };

  const handleAssignSubmit = async (formData) => {
    setIsActionLoading(true);
    try {
      const created = await AssignmentService.assignAsset(formData);
      setAssignments((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReturnConfirm = async ({ condition, remarks }) => {
    if (!assignmentToReturn) return;
    setIsActionLoading(true);
    try {
      const updated = await AssignmentService.returnAsset(assignmentToReturn.assignmentId, { condition, remarks });
      setAssignments((prev) =>
        prev.map((a) => (a.assignmentId === assignmentToReturn.assignmentId ? updated : a))
      );
      setIsReturnOpen(false);
      setAssignmentToReturn(null);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!assignmentToCancel) return;
    setIsActionLoading(true);
    try {
      const updated = await AssignmentService.cancelAssignment(assignmentToCancel.assignmentId);
      setAssignments((prev) =>
        prev.map((a) => (a.assignmentId === assignmentToCancel.assignmentId ? updated : a))
      );
      setIsCancelOpen(false);
      setAssignmentToCancel(null);
    } catch {
      // Notifications handled in service layer.
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Asset Assignments" subtitle="Track check-outs, transfers, and returns" />
        <PageLoader message="Loading assignment logs…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Asset Assignments" subtitle="Track check-outs, transfers, and returns" />
        <ErrorState
          title="Failed to Load Assignments"
          description="We encountered an issue fetching custody records."
          onRetry={fetchAssignments}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Asset Assignments"
        subtitle="Track check-outs, transfers, and returns"
        actions={
          <ActionButton onClick={openAssignModal} icon={Plus} variant="primary">
            Assign Asset
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      <AssignmentStats assignments={assignments} />

      <AssignmentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        employeeFilter={employeeFilter}
        onEmployeeChange={setEmployeeFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        allAssignments={assignments}
      />

      <AssignmentTable
        assignments={filteredAssignments}
        isLoading={false}
        onView={openViewModal}
        onReturn={openReturnDialog}
        onCancel={openCancelDialog}
      />

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={selectedAssignment}
        mode={modalMode}
        onSubmit={handleAssignSubmit}
      />

      <ReturnAssetDialog
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        onConfirm={handleReturnConfirm}
        assetName={assignmentToReturn?.assetName || ''}
      />

      <ConfirmDialog
        isOpen={isCancelOpen}
        title="Cancel Custody Assignment"
        description={`Are you sure you want to cancel the custody assignment of ${assignmentToCancel?.assetName} to ${assignmentToCancel?.employeeName}? This releases the asset back to Available status.`}
        confirmText="Cancel Assignment"
        cancelText="Keep Active"
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelOpen(false)}
        isDanger={true}
      />
    </PageContainer>
  );
};

export default Assignments;
