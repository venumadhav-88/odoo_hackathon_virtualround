import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { EmployeeService } from '@/services';
import {
  PageContainer,
  PageHeader,
  ActionButton,
  DataTable,
  StatusBadge,
  Modal,
  ConfirmDialog,
  ErrorState,
} from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';

const DEPARTMENTS = ['Information Technology', 'Operations', 'Marketing', 'Sales', 'Finance', 'Human Resources'];

/**
 * Employees Page Component.
 * Directory workspace displaying custodians, custody statuses, search filters, and profile forms.
 */
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form fields states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Information Technology');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Active');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Confirm delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const inactive = employees.filter((e) => e.status === 'Inactive').length;
    return { total, active, inactive };
  }, [employees]);

  // Filtering
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const q = searchTerm.toLowerCase().trim();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q)
    );
  }, [employees, searchTerm]);

  // Modal actions
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedEmp(null);
    setName('');
    setEmail('');
    setDepartment('Information Technology');
    setRole('');
    setPhone('');
    setStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setModalMode('edit');
    setSelectedEmp(emp);
    setName(emp.name);
    setEmail(emp.email);
    setDepartment(emp.department);
    setRole(emp.role);
    setPhone(emp.phone || '');
    setStatus(emp.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const openDeleteDialog = (emp) => {
    setEmpToDelete(emp);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !role.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const payload = { name, email, department, role, phone, status };

    setIsActionLoading(true);
    try {
      if (modalMode === 'create') {
        const created = await EmployeeService.addEmployee(payload);
        setEmployees((prev) => [created, ...prev]);
      } else {
        const updated = await EmployeeService.updateEmployee(selectedEmp.id, payload);
        setEmployees((prev) => prev.map((emp) => (emp.id === selectedEmp.id ? { ...emp, ...updated } : emp)));
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to persist employee.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!empToDelete) return;
    setIsActionLoading(true);
    try {
      await EmployeeService.deleteEmployee(empToDelete.id);
      setEmployees((prev) => prev.filter((e) => e.id !== empToDelete.id));
      setIsDeleteOpen(false);
      setEmpToDelete(null);
    } catch {
      // Notification handled in service
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Custodian Name',
      width: '200px',
      render: (value, row) => (
        <div>
          <strong style={{ display: 'block' }}>{value}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.id}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email Address', width: '220px' },
    { key: 'department', header: 'Department', width: '160px' },
    { key: 'role', header: 'Corporate Role', width: '180px' },
    {
      key: 'assignedAssetsCount',
      header: 'Custodies Count',
      width: '130px',
      render: (value) => (
        <strong style={{ color: value > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
          {value} items
        </strong>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const rowActions = (row) => (
    <div className="table-row-actions">
      <button
        className="action-icon-btn"
        onClick={() => openEditModal(row)}
        aria-label={`Edit profile for ${row.name}`}
        title="Edit Profile"
      >
        <Edit2 size={16} />
      </button>
      <button
        className="action-icon-btn delete"
        onClick={() => openDeleteDialog(row)}
        aria-label={`Deregister custodian ${row.name}`}
        title="Deregister Custodian"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Employees Directory" subtitle="View and manage asset custodians" />
        <PageLoader message="Fetching custodians directory data…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Employees Directory" subtitle="View and manage asset custodians" />
        <ErrorState
          title="Failed to Load Employees Directory"
          description="We encountered an issue connecting to the EAM directory."
          onRetry={fetchEmployees}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Employees Directory"
        subtitle="View and manage asset custodians"
        actions={
          <ActionButton onClick={openCreateModal} icon={Plus} variant="primary">
            Register Custodian
          </ActionButton>
        }
      />

      {isActionLoading && <LoaderOverlay />}

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Employees</span>
            <div className="stat-card-icon-wrapper">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Custodians</span>
            <div className="stat-card-icon-wrapper success">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
            {stats.active}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Inactive Employees</span>
            <div className="stat-card-icon-wrapper danger">
              <XCircle size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-danger)' }}>
            {stats.inactive}
          </div>
        </div>
      </div>

      {/* Filters search */}
      <div className="filters-toolbar" style={{ marginBottom: '1.5rem' }}>
        <div className="filters-search-wrapper" style={{ minWidth: '300px' }}>
          <Search className="filters-search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search name, email, department, role…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filters-search-input"
            aria-label="Search employees"
          />
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        rows={filteredEmployees}
        isLoading={false}
        emptyMessage="No custodians match the active search term."
        rowActions={rowActions}
        keyExtractor={(row) => row.id}
      />

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header onClose={() => setIsModalOpen(false)}>
          {modalMode === 'create' ? 'Register Employee Custodian' : 'Edit Custodian Details'}
        </Modal.Header>
        <form onSubmit={handleFormSubmit} noValidate>
          <Modal.Body>
            {formError && (
              <div
                style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', marginBottom: '1rem', fontWeight: 500 }}
                role="alert"
              >
                {formError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="emp-name" className="form-label">Full Name *</label>
              <input
                id="emp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-email" className="form-label">Email Address *</label>
              <input
                id="emp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.m@enterprise.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-phone" className="form-label">Phone Number</label>
              <input
                id="emp-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 012-3456"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-dept" className="form-label">Corporate Department *</label>
              <select
                id="emp-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="filters-select form-input"
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="emp-role" className="form-label">Corporate Role *</label>
              <input
                id="emp-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-status" className="form-label">Employment Status *</label>
              <select
                id="emp-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="filters-select form-input"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {modalMode === 'create' ? 'Register Custodian' : 'Save Details'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Deregister Custodian"
        description={`Are you sure you want to deregister ${empToDelete?.name} from EAM? This removes their record from the active list.`}
        confirmText="Deregister"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        isDanger={true}
      />
    </PageContainer>
  );
};

export default Employees;
