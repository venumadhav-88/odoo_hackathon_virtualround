import { employeeRepository } from './employee.repository';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service coordinating custodian directory actions, error logs, and notifications.
 */
export const EmployeeService = {
  /**
   * Fetches all registered custodians.
   * @returns {Promise<Object[]>}
   */
  async getEmployees() {
    try {
      return await employeeRepository.getEmployees();
    } catch (error) {
      logger.error('EmployeeService.getEmployees failed:', error);
      notify.error('Failed to load employee directory.');
      throw error;
    }
  },

  /**
   * Registers a new employee custodian.
   * @param {Object} formData
   * @returns {Promise<Object>}
   */
  async addEmployee(formData) {
    try {
      const data = await employeeRepository.addEmployee(formData);
      notify.success('Employee registered successfully.');
      return data;
    } catch (error) {
      logger.error('EmployeeService.addEmployee failed:', error);
      notify.error(error.message || 'Failed to register employee.');
      throw error;
    }
  },

  /**
   * Updates an existing employee custodian profile.
   * @param {string} id
   * @param {Object} formData
   * @returns {Promise<Object>}
   */
  async updateEmployee(id, formData) {
    try {
      const data = await employeeRepository.updateEmployee(id, formData);
      notify.success('Employee profile updated.');
      return data;
    } catch (error) {
      logger.error('EmployeeService.updateEmployee failed:', error);
      notify.error(error.message || 'Failed to update employee.');
      throw error;
    }
  },

  /**
   * Deregisters an employee.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deleteEmployee(id) {
    try {
      const data = await employeeRepository.deleteEmployee(id);
      notify.success('Employee deregistered.');
      return data;
    } catch (error) {
      logger.error('EmployeeService.deleteEmployee failed:', error);
      notify.error(error.message || 'Failed to deregister employee.');
      throw error;
    }
  },
};
